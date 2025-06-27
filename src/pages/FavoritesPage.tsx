import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, MapPin, User, Eye, X, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Verificăm dacă utilizatorul este autentificat
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }
      
      console.log('🔍 Loading favorites for user:', user.id);
      
      // Încărcăm favoritele utilizatorului direct din tabela favorites
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          listing_id,
          listings (*)
        `)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('❌ Error loading favorites:', error);
        setError('Nu s-au putut încărca favoritele');
        return;
      }
      
      console.log('✅ Loaded favorites:', data?.length || 0);
      
      // Filtrăm rezultatele pentru a elimina null-urile
      const validData = data?.filter(item => item.listings !== null) || [];
      
      // Extragem doar anunțurile din rezultate
      const favoriteListings = validData.map(item => item.listings);
      console.log('📋 Extracted listings:', favoriteListings.length);
      
      setFavorites(favoriteListings);
      
    } catch (err) {
      console.error('💥 Error loading favorites:', err);
      setError('A apărut o eroare la încărcarea favoritelor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (listingId: string) => {
    try {
      setIsTogglingFavorite(listingId);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      console.log('🗑️ Removing favorite:', listingId);
      
      const { error } = await supabase
        .from('favorites')
        .delete()
        .match({ user_id: user.id, listing_id: listingId });
      
      if (error) {
        console.error('❌ Error removing favorite:', error);
        alert('Eroare la eliminarea din favorite');
        return;
      }
      
      console.log('✅ Favorite removed successfully');
      
      // Actualizăm lista de favorite
      setFavorites(prev => prev.filter(listing => listing.id !== listingId));
    } catch (err) {
      console.error('💥 Error removing favorite:', err);
      alert('A apărut o eroare la eliminarea din favorite');
    } finally {
      setIsTogglingFavorite(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="w-16 h-16 border-4 border-nexar-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă favoritele...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Eroare la încărcare
          </h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <button
            onClick={loadFavorites}
            className="bg-nexar-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
          >
            Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Heart className="h-6 w-6 text-nexar-accent mr-2" />
              Anunțurile Mele Favorite
            </h1>
            
            {favorites.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Nu ai anunțuri favorite
                </h2>
                <p className="text-gray-600 mb-6">
                  Adaugă anunțuri la favorite pentru a le găsi mai ușor
                </p>
                <button
                  onClick={() => navigate('/anunturi')}
                  className="bg-nexar-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
                >
                  Explorează Anunțuri
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {favorites.map(listing => (
                  <div key={listing.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-48 h-40 sm:h-auto">
                        <img
                          src={listing.images && listing.images[0] ? listing.images[0] : "https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg"}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="bg-nexar-accent text-white px-2 py-1 rounded-full text-xs font-semibold">
                            {listing.category}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveFavorite(listing.id)}
                          disabled={isTogglingFavorite === listing.id}
                          className="absolute top-2 right-2 bg-white rounded-full p-1.5 hover:bg-gray-100 transition-colors"
                        >
                          {isTogglingFavorite === listing.id ? (
                            <div className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Heart className="h-4 w-4 text-red-500 fill-current" />
                          )}
                        </button>
                      </div>
                      
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{listing.title}</h3>
                            <div className="text-xl font-bold text-nexar-accent mb-2">€{listing.price.toLocaleString()}</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                          <div className="flex items-center space-x-1 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{listing.year}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{listing.location}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-gray-600">
                            <User className="h-4 w-4" />
                            <span>{listing.seller_name}</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => navigate(`/anunt/${listing.id}`)}
                          className="bg-nexar-accent text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-nexar-gold transition-colors flex items-center space-x-2"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Vezi Anunțul</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;