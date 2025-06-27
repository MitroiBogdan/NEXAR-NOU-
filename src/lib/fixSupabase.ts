import { supabase } from './supabase';

/**
 * Funcție pentru a verifica și repara conexiunea la Supabase
 * @returns Promise<boolean> - true dacă conexiunea este funcțională, false altfel
 */
export const checkAndFixSupabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Verificare conexiune Supabase...');
    
    // Testăm conexiunea cu o interogare simplă
    const { error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Eroare la testarea conexiunii:', error);
      
      // Încercăm să reparăm politicile RLS
      await fixRLSPolicies();
      
      // Verificăm din nou conexiunea
      const { error: retryError } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true });
      
      if (retryError) {
        console.error('❌ Conexiunea tot nu funcționează după reparare:', retryError);
        return false;
      }
      
      console.log('✅ Conexiunea a fost reparată cu succes!');
      return true;
    }
    
    console.log('✅ Conexiunea la Supabase funcționează corect');
    return true;
  } catch (err) {
    console.error('💥 Eroare la verificarea conexiunii:', err);
    return false;
  }
};

/**
 * Funcție pentru a repara politicile RLS
 * Această funcție va rula un script SQL pentru a repara politicile RLS
 */
const fixRLSPolicies = async (): Promise<void> => {
  try {
    console.log('🔧 Încercare de reparare a politicilor RLS...');
    
    // Acest script va fi rulat doar dacă utilizatorul are permisiuni de admin
    // Altfel, va eșua silențios
    const { error } = await supabase.rpc('fix_rls_policies');
    
    if (error) {
      console.error('❌ Eroare la repararea politicilor RLS:', error);
      console.log('ℹ️ Contactează administratorul pentru a rula script-ul de reparare');
    } else {
      console.log('✅ Politicile RLS au fost reparate cu succes!');
    }
  } catch (err) {
    console.error('💥 Eroare la repararea politicilor RLS:', err);
  }
};

/**
 * Funcție pentru a repara profilul utilizatorului curent
 * @returns Promise<{success: boolean, message?: string, error?: any}>
 */
export const fixUserProfile = async (): Promise<{success: boolean, message?: string, error?: any}> => {
  try {
    console.log('🔧 Încercare de reparare a profilului utilizatorului curent...');
    
    // Obținem utilizatorul curent
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ Utilizatorul nu este autentificat:', userError);
      return { success: false, error: 'Utilizatorul nu este autentificat' };
    }
    
    // Verificăm dacă profilul există
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (existingProfile && !profileError) {
      console.log('✅ Profilul există deja, nu este necesară repararea');
      return { success: true, message: 'Profilul există deja' };
    }
    
    // Profilul nu există, îl creăm
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert([{
        user_id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Utilizator',
        email: user.email,
        phone: user.user_metadata?.phone || '',
        location: user.user_metadata?.location || '',
        seller_type: user.user_metadata?.sellerType || 'individual',
        is_admin: user.email === 'admin@nexar.ro'
      }])
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Eroare la crearea profilului:', createError);
      return { success: false, error: createError };
    }
    
    console.log('✅ Profilul a fost creat cu succes:', newProfile);
    return { success: true, message: 'Profilul a fost creat cu succes' };
  } catch (err) {
    console.error('💥 Eroare la repararea profilului:', err);
    return { success: false, error: err };
  }
};

/**
 * Funcție pentru a repara toate problemele Supabase
 * @returns Promise<{success: boolean, message?: string, error?: any}>
 */
export const fixAllSupabaseIssues = async (): Promise<{success: boolean, message?: string, error?: any}> => {
  try {
    console.log('🔧 Începere reparare completă Supabase...');
    
    // Pasul 1: Verifică și repară conexiunea
    const connectionFixed = await checkAndFixSupabaseConnection();
    
    if (!connectionFixed) {
      return { 
        success: false, 
        message: 'Nu s-a putut repara conexiunea la Supabase. Contactează administratorul.' 
      };
    }
    
    // Pasul 2: Repară profilul utilizatorului
    const profileResult = await fixUserProfile();
    
    if (!profileResult.success) {
      return { 
        success: false, 
        message: `Conexiunea a fost reparată, dar profilul nu: ${profileResult.error}` 
      };
    }
    
    // Totul a funcționat
    return { 
      success: true, 
      message: 'Toate problemele au fost reparate cu succes!' 
    };
    
  } catch (err) {
    console.error('💥 Eroare la repararea completă:', err);
    return { success: false, error: err };
  }
};