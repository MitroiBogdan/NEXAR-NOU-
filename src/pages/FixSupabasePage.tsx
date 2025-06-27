import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Database, Shield, RefreshCw, CheckCircle, XCircle, AlertTriangle, ArrowRight, Wrench, Code } from 'lucide-react';
import FixSupabaseButton from '../components/FixSupabaseButton';
import { checkAndFixSupabaseConnection, fixUserProfile } from '../lib/fixSupabase';

const FixSupabasePage = () => {
  const [isFixingConnection, setIsFixingConnection] = useState(false);
  const [isFixingProfile, setIsFixingProfile] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{success?: boolean; message?: string}>({});
  const [profileResult, setProfileResult] = useState<{success?: boolean; message?: string}>({});
  const [allFixed, setAllFixed] = useState(false);

  const handleFixConnection = async () => {
    setIsFixingConnection(true);
    setConnectionResult({});
    
    try {
      const success = await checkAndFixSupabaseConnection();
      
      setConnectionResult({
        success,
        message: success 
          ? 'Conexiunea la Supabase a fost reparată cu succes!' 
          : 'Nu s-a putut repara conexiunea la Supabase'
      });
    } catch (error) {
      console.error('Eroare la repararea conexiunii:', error);
      setConnectionResult({
        success: false,
        message: 'A apărut o eroare neașteptată'
      });
    } finally {
      setIsFixingConnection(false);
    }
  };

  const handleFixProfile = async () => {
    setIsFixingProfile(true);
    setProfileResult({});
    
    try {
      const result = await fixUserProfile();
      
      setProfileResult({
        success: result.success,
        message: result.success 
          ? 'Profilul a fost reparat cu succes!' 
          : `Eroare la repararea profilului: ${result.error}`
      });
    } catch (error) {
      console.error('Eroare la repararea profilului:', error);
      setProfileResult({
        success: false,
        message: 'A apărut o eroare neașteptată'
      });
    } finally {
      setIsFixingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-nexar-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="h-8 w-8 text-nexar-accent" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Reparare Conexiune Supabase</h1>
            <p className="text-gray-600">
              Această pagină te ajută să repari problemele de conexiune la Supabase
            </p>
          </div>

          {/* Avertisment */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Atenție</h3>
                <p className="text-yellow-700">
                  Această pagină este destinată reparării conexiunii la Supabase și a profilului utilizatorului.
                  Folosește-o doar dacă întâmpini probleme de conectare sau dacă vezi mesajul "Deconectat" în aplicație.
                </p>
              </div>
            </div>
          </div>

          {/* Opțiuni de reparare */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Reparare Conexiune */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="h-6 w-6 text-nexar-accent" />
                <h3 className="text-lg font-semibold text-gray-900">Reparare Conexiune</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Repară conexiunea la Supabase și politicile RLS care cauzează erori.
              </p>
              
              <button
                onClick={handleFixConnection}
                disabled={isFixingConnection}
                className="w-full flex items-center justify-center space-x-2 bg-nexar-accent text-white px-4 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFixingConnection ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Se repară...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5" />
                    <span>Repară Conexiunea</span>
                  </>
                )}
              </button>
              
              {connectionResult.message && (
                <div className={`mt-4 p-3 rounded-lg ${
                  connectionResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center space-x-2">
                    {connectionResult.success ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                    <span>{connectionResult.message}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Reparare Profil */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-nexar-accent" />
                <h3 className="text-lg font-semibold text-gray-900">Reparare Profil</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Repară profilul utilizatorului curent dacă lipsește sau este incomplet.
              </p>
              
              <button
                onClick={handleFixProfile}
                disabled={isFixingProfile}
                className="w-full flex items-center justify-center space-x-2 bg-nexar-accent text-white px-4 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFixingProfile ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Se repară...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5" />
                    <span>Repară Profilul</span>
                  </>
                )}
              </button>
              
              {profileResult.message && (
                <div className={`mt-4 p-3 rounded-lg ${
                  profileResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center space-x-2">
                    {profileResult.success ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                    <span>{profileResult.message}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reparare Completă */}
          <div className="bg-nexar-accent/10 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Wrench className="h-6 w-6 text-nexar-accent" />
              <h3 className="text-lg font-semibold text-gray-900">Reparare Completă</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Repară atât conexiunea la Supabase, cât și profilul utilizatorului într-un singur pas.
            </p>
            
            <FixSupabaseButton 
              onSuccess={() => setAllFixed(true)} 
              buttonText="Repară Toate Problemele"
            />
          </div>

          {/* Succes */}
          {allFixed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 animate-scale-in">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-800 mb-2">Reparare Completă!</h3>
                  <p className="text-green-700 mb-4">
                    Conexiunea la Supabase și profilul utilizatorului au fost reparate cu succes.
                    Acum poți continua să folosești aplicația fără probleme.
                  </p>
                  
                  <Link
                    to="/"
                    className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    <span>Mergi la Pagina Principală</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Instrucțiuni pentru Admin */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Instrucțiuni pentru Administrator</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3 mb-4">
                <Code className="h-6 w-6 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Script SQL pentru Reparare Completă</h4>
                  <p className="text-blue-700 mb-4">
                    Dacă ești administrator și vrei să repari problemele pentru toți utilizatorii, 
                    copiază și rulează următorul script în SQL Editor din Supabase Dashboard:
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                <pre>{`-- 🚨 MIGRAȚIA FINALĂ - Rezolvă toate problemele cu RLS și funcționalitățile
-- Rulează această migrație în Supabase Dashboard → SQL Editor

-- Pasul 1: Dezactivează temporar RLS pentru a opri recursiunea
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

-- Pasul 2: Șterge TOATE politicile existente care cauzează probleme
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Șterge toate politicile pentru profiles
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.profiles';
    END LOOP;
    
    -- Șterge toate politicile pentru listings
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'listings' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.listings';
    END LOOP;
    
    -- Șterge toate politicile pentru favorites
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'favorites' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.favorites';
    END LOOP;
    
    -- Șterge toate politicile pentru messages
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'messages' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.messages';
    END LOOP;
    
    -- Șterge toate politicile pentru reviews
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'reviews' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.reviews';
    END LOOP;
    
    -- Șterge toate politicile pentru storage.objects
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects';
    END LOOP;
END $$;

-- Pasul 3: Reactivează RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Pasul 4: Creează politici SIMPLE pentru PROFILES (FĂRĂ RECURSIUNE)
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Pasul 5: Creează politici SIMPLE pentru LISTINGS (FĂRĂ RECURSIUNE)
CREATE POLICY "listings_select" ON listings
  FOR SELECT USING (status = 'active');

CREATE POLICY "listings_insert" ON listings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "listings_update" ON listings
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND 
    seller_id IN (
      SELECT id FROM profiles 
      WHERE user_id = auth.uid() 
      LIMIT 1
    )
  );

CREATE POLICY "listings_delete" ON listings
  FOR DELETE USING (
    auth.uid() IS NOT NULL AND 
    seller_id IN (
      SELECT id FROM profiles 
      WHERE user_id = auth.uid() 
      LIMIT 1
    )
  );

-- Pasul 6: Creează politici SIMPLE pentru FAVORITES
CREATE POLICY "favorites_select" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "favorites_insert" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Pasul 7: Creează politici SIMPLE pentru MESSAGES
CREATE POLICY "messages_select" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "messages_insert" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Pasul 8: Creează politici SIMPLE pentru REVIEWS
CREATE POLICY "reviews_select" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_insert" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Pasul 9: Configurează Storage pentru imagini (FĂRĂ RECURSIUNE)
-- Creează bucket-urile dacă nu există
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('listing-images', 'listing-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('profile-images', 'profile-images', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Activează RLS pentru storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Politici simple pentru storage
CREATE POLICY "storage_select_listing_images" ON storage.objects
  FOR SELECT USING (bucket_id = 'listing-images');

CREATE POLICY "storage_select_profile_images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "storage_insert_listing_images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'listing-images' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "storage_insert_profile_images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-images' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "storage_delete_listing_images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'listing-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "storage_delete_profile_images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Pasul 10: Configurează politici pentru administrator (FĂRĂ RECURSIUNE)
-- Adaugă coloana is_admin dacă nu există
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;
END $$;

-- Actualizează profilul admin
UPDATE profiles 
SET is_admin = true 
WHERE email = 'admin@nexar.ro';

-- Politici pentru admin - folosind email în loc de subqueries
CREATE POLICY "admin_select_listings" ON listings
  FOR SELECT USING (
    auth.email() = 'admin@nexar.ro'
  );

CREATE POLICY "admin_update_listings" ON listings
  FOR UPDATE USING (
    auth.email() = 'admin@nexar.ro'
  );

CREATE POLICY "admin_delete_listings" ON listings
  FOR DELETE USING (
    auth.email() = 'admin@nexar.ro'
  );

-- Pasul 11: Asigură-te că funcția handle_new_user este robustă
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (
    user_id,
    name,
    email,
    phone,
    location,
    seller_type,
    is_admin
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Utilizator'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'location', ''),
    COALESCE(NEW.raw_user_meta_data->>'sellerType', 'individual'),
    NEW.email = 'admin@nexar.ro'
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Dacă crearea profilului eșuează, permite totuși crearea utilizatorului
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasul 12: Recreează trigger-ul
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Pasul 13: Creează indexuri pentru performanță
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_listing_id ON favorites(listing_id);

-- Pasul 14: Repară profilurile utilizatorilor existenți
DO $$
DECLARE
    u RECORD;
BEGIN
    FOR u IN (
        SELECT id, email FROM auth.users
        WHERE id NOT IN (SELECT user_id FROM profiles)
    ) LOOP
        INSERT INTO profiles (
            user_id,
            name,
            email,
            seller_type,
            is_admin
        ) VALUES (
            u.id,
            split_part(u.email, '@', 1),
            u.email,
            'individual',
            u.email = 'admin@nexar.ro'
        );
        RAISE NOTICE 'Created missing profile for user %', u.email;
    END LOOP;
END $$;

-- Pasul 15: Test final - verifică că totul funcționează
DO $$
BEGIN
  -- Testează accesul la profiles
  PERFORM COUNT(*) FROM profiles;
  RAISE NOTICE 'Acces la tabela profiles: OK';
  
  -- Testează accesul la listings
  PERFORM COUNT(*) FROM listings WHERE status = 'active';
  RAISE NOTICE 'Acces la tabela listings: OK';
  
  -- Testează accesul la favorites
  PERFORM COUNT(*) FROM favorites;
  RAISE NOTICE 'Acces la tabela favorites: OK';
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Testul a eșuat: %', SQLERRM;
END $$;`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixSupabasePage;