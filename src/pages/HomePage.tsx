import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
	Search,
	Star,
	Shield,
	Users,
	TrendingUp,
	ArrowRight,
	CheckCircle,
	Heart,
	MapPin,
	Calendar,
	Gauge,
	Filter,
	X,
	SlidersHorizontal,
	Zap,
	Building,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { listings } from "../lib/supabase";

const HomePage = () => {
	const [searchParams] = useSearchParams();
	// On desktop, show filters by default. On mobile, hide them by default
	const [showFilters, setShowFilters] = useState(window.innerWidth >= 1024);
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [filters, setFilters] = useState({
		priceMin: "",
		priceMax: "",
		category: searchParams.get("categorie") || "",
		brand: "",
		yearMin: "",
		yearMax: "",
		location: "",
	});
	const [allListings, setAllListings] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const itemsPerPage = 6; // Show 6 listings per page

	// Load real listings from Supabase
	useEffect(() => {
		loadListings();
	}, [filters, searchQuery, currentPage]);
	// Update filters when URL params change
	useEffect(() => {
		const categoryFromUrl = searchParams.get("categorie");
		if (categoryFromUrl) {
			setFilters((prev) => ({ ...prev, category: categoryFromUrl }));
		}
	}, [searchParams]);

	const loadListings = async () => {
		try {
			setIsLoading(true);
			setError(null);

			console.log("🔄 Loading listings from Supabase...");

			const { data, error } = await listings.getAll();

			if (error) {
				console.error("❌ Error loading listings:", error);
				setError("Nu s-au putut încărca anunțurile");
				return;
			}

			console.log("✅ Loaded listings:", data?.length || 0);

			// Formatăm datele pentru afișare
			const formattedListings = (data || []).map((listing: any) => ({
				id: listing.id,
				title: listing.title,
				price: listing.price,
				year: listing.year,
				mileage: listing.mileage,
				location: listing.location,
				images: listing.images || [],
				rating: listing.rating || 4.5,
				category: listing.category,
				brand: listing.brand,
				seller: listing.seller_name,
				sellerId: listing.seller_id,
				sellerType: listing.seller_type,
				featured: listing.featured || false,
			}));

			setAllListings(formattedListings);
		} catch (err) {
			console.error("💥 Error in loadListings:", err);
			setError("A apărut o eroare la încărcarea anunțurilor");
		} finally {
			setIsLoading(false);
		}
	};

	// Update showFilters state when window is resized
	useEffect(() => {
		const handleResize = () => {
			setShowFilters(window.innerWidth >= 1024);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Filtrare și căutare
	const filteredListings = useMemo(() => {
		return allListings.filter((listing) => {
			// Căutare în text
			const searchLower = searchQuery.toLowerCase();
			const matchesSearch =
				!searchQuery ||
				listing.title.toLowerCase().includes(searchLower) ||
				listing.brand.toLowerCase().includes(searchLower) ||
				listing.category.toLowerCase().includes(searchLower) ||
				listing.location.toLowerCase().includes(searchLower) ||
				listing.seller.toLowerCase().includes(searchLower);

			// Filtre
			const matchesPrice =
				(!filters.priceMin || listing.price >= parseInt(filters.priceMin)) &&
				(!filters.priceMax || listing.price <= parseInt(filters.priceMax));

			const matchesCategory =
				!filters.category ||
				listing.category.toLowerCase() === filters.category.toLowerCase();
			const matchesBrand =
				!filters.brand ||
				listing.brand.toLowerCase() === filters.brand.toLowerCase();
			const matchesYear =
				(!filters.yearMin || listing.year >= parseInt(filters.yearMin)) &&
				(!filters.yearMax || listing.year <= parseInt(filters.yearMax));
			const matchesLocation =
				!filters.location ||
				listing.location.toLowerCase().includes(filters.location.toLowerCase());

			return (
				matchesSearch &&
				matchesPrice &&
				matchesCategory &&
				matchesBrand &&
				matchesYear &&
				matchesLocation
			);
		});
	}, [searchQuery, filters, allListings]);

	// Calculate pagination
	const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentListings = filteredListings.slice(startIndex, endIndex);

	const handleFilterChange = (key: string, value: string) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
		setCurrentPage(1); // Reset to first page when filtering
	};

	const clearFilters = () => {
		setFilters({
			priceMin: "",
			priceMax: "",
			category: "",
			brand: "",
			yearMin: "",
			yearMax: "",
			location: "",
		});
		setSearchQuery("");
		setCurrentPage(1);
		// Clear URL params
		navigate("/", { replace: true });
	};

	// Funcție pentru a merge la o pagină și a face scroll la top
	const goToPage = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const categories = [
		{
			name: "Sport",
			count: "245 anunțuri",
			image:
				"https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg",
		},
		{
			name: "Touring",
			count: "189 anunțuri",
			image:
				"https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg",
		},
		{
			name: "Cruiser",
			count: "156 anunțuri",
			image:
				"https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg",
		},
		{
			name: "Adventure",
			count: "203 anunțuri",
			image:
				"https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg",
		},
		{
			name: "Naked",
			count: "178 anunțuri",
			image:
				"https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg",
		},
		{
			name: "Enduro",
			count: "142 anunțuri",
			image:
				"https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg",
		},
		{
			name: "Scooter",
			count: "134 anunțuri",
			image:
				"https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg",
		},
		{
			name: "Chopper",
			count: "98 anunțuri",
			image:
				"https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg",
		},
	];

	const ListingRow = ({ listing }: { listing: any }) => {
		const [currentImageIndex, setCurrentImageIndex] = useState(0);
		const [isFavorite, setIsFavorite] = useState(false);
		const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
		const touchStartX = useRef<number>(0);
		const touchEndX = useRef<number>(0);
		const imageContainerRef = useRef<HTMLDivElement>(null);

		// Handle touch events for mobile swipe
		const handleTouchStart = (e: React.TouchEvent) => {
			touchStartX.current = e.targetTouches[0].clientX;
		};

		const handleTouchMove = (e: React.TouchEvent) => {
			touchEndX.current = e.targetTouches[0].clientX;
		};

		const handleTouchEnd = (e: React.TouchEvent) => {
			e.preventDefault();
			e.stopPropagation();

			if (!touchStartX.current || !touchEndX.current) return;

			const distance = touchStartX.current - touchEndX.current;
			const isLeftSwipe = distance > 50;
			const isRightSwipe = distance < -50;

			if (isLeftSwipe && currentImageIndex < listing.images.length - 1) {
				setCurrentImageIndex((prev) => prev + 1);
			}
			if (isRightSwipe && currentImageIndex > 0) {
				setCurrentImageIndex((prev) => prev - 1);
			}
		};

		const nextImage = (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setCurrentImageIndex((prev) =>
				prev === listing.images.length - 1 ? 0 : prev + 1,
			);
		};

		const prevImage = (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setCurrentImageIndex((prev) =>
				prev === 0 ? listing.images.length - 1 : prev - 1,
			);
		};

		const handleSellerClick = (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			// Navigate to seller profile
			navigate(`/profil/${listing.sellerId}`);
		};

		const handleToggleFavorite = async (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();

			setIsTogglingFavorite(true);

			try {
				// Simulate toggle for now - you'll need to implement the actual logic
				setIsFavorite(!isFavorite);

				// Here you would call the actual API to add/remove from favorites
				// const { data: { user } } = await supabase.auth.getUser();
				// if (user) {
				//   if (isFavorite) {
				//     await listings.removeFromFavorites(user.id, listing.id);
				//   } else {
				//     await listings.addToFavorites(user.id, listing.id);
				//   }
				// }
			} catch (error) {
				console.error("Error toggling favorite:", error);
			} finally {
				setIsTogglingFavorite(false);
			}
		};

		// Funcție pentru a obține imaginea corectă
		const getListingImage = () => {
			if (
				listing.images &&
				listing.images.length > 0 &&
				listing.images[currentImageIndex]
			) {
				return listing.images[currentImageIndex];
			}
			// Fallback la imagine placeholder
			return "https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg";
		};

		return (
			<Link
				to={`/anunt/${listing.id}`}
				className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group border border-gray-100 block"
			>
				<div className="flex flex-col sm:flex-row">
					<div
						ref={imageContainerRef}
						className="relative w-full sm:w-64 flex-shrink-0"
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
					>
						<img
							loading="lazy"
							src={getListingImage()}
							alt={listing.title}
							className="w-full h-48 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
							onError={(e) => {
								// Fallback la imagine placeholder dacă imaginea nu se încarcă
								const target = e.currentTarget as HTMLImageElement;
								target.src =
									"https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg";
							}}
						/>

						{/* Navigation Arrows - Only show if multiple images */}
						{listing.images && listing.images.length > 1 && (
							<>
								<button
									onClick={prevImage}
									className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 hover:bg-white transition-colors opacity-0 group-hover:opacity-100 hidden sm:block"
								>
									<ChevronLeft className="h-4 w-4 text-gray-600" />
								</button>

								<button
									onClick={nextImage}
									className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 hover:bg-white transition-colors opacity-0 group-hover:opacity-100 hidden sm:block"
								>
									<ChevronRight className="h-4 w-4 text-gray-600" />
								</button>

								{/* Image indicators */}
								<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
									{listing.images.map((_: any, index: number) => (
										<div
											key={index}
											className={`w-1.5 h-1.5 rounded-full transition-colors ${
												index === currentImageIndex ? "bg-white" : "bg-white/50"
											}`}
										/>
									))}
								</div>
							</>
						)}

						<div className="absolute top-3 left-3">
							<span className="bg-nexar-accent text-white px-3 py-1 rounded-full text-xs font-semibold">
								{listing.category}
							</span>
						</div>
						<button
							onClick={handleToggleFavorite}
							disabled={isTogglingFavorite}
							className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
						></button>
					</div>

					<div className="flex-1 p-4 sm:p-6">
						<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
							<div>
								<h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-nexar-accent transition-colors mb-2">
									{listing.title}
								</h3>
								<div className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
									€{listing.price.toLocaleString()}
								</div>

								{/* EVIDENȚIERE DEALER MULT MAI PRONUNȚATĂ */}
								<div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
									<div className="text-sm text-gray-600">
										Vândut de:
										<button
											onClick={handleSellerClick}
											className="font-semibold text-nexar-accent hover:text-nexar-gold transition-colors ml-1 underline"
										>
											{listing.seller}
										</button>
									</div>

									{/* BADGE DEALER MULT MAI VIZIBIL */}
									{listing.sellerType === "dealer" ? (
										<div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1.5 rounded-full shadow-md border border-emerald-400">
											<Building className="h-3 w-3" />
											<span className="font-bold text-xs tracking-wide">
												DEALER PREMIUM
											</span>
											<div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
										</div>
									) : (
										<div className="inline-flex items-center space-x-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white px-3 py-1.5 rounded-full shadow-md">
											<span className="font-semibold text-xs">PRIVAT</span>
										</div>
									)}
								</div>
							</div>

							<div className="flex items-center space-x-1 bg-gray-50 rounded-lg px-3 py-1 self-start">E
								<span className="text-sm font-semibold">{listing.rating}</span>
							</div>
						</div>

						<div className="grid grid-cols-3 gap-3 sm:gap-6 mb-4">
							<div className="flex items-center space-x-2 text-gray-600">
								<Calendar className="h-4 w-4" />
								<span className="text-sm font-medium">{listing.year}</span>
							</div>
							<div className="flex items-center space-x-2 text-gray-600">
								<Gauge className="h-4 w-4" />
								<span className="text-sm font-medium">
									{listing.mileage.toLocaleString()} km
								</span>
							</div>
							<div className="flex items-center space-x-2 text-gray-600">
								<MapPin className="h-4 w-4" />
								<span className="text-sm font-medium">{listing.location}</span>
							</div>
						</div>

						<div className="bg-nexar-accent text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-nexar-gold transition-colors inline-flex items-center space-x-2">
							<span>Vezi Detalii</span>
							<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
						</div>
					</div>
				</div>
			</Link>
		);
	};

	return (
		<div className="animate-fade-in">
			{/* Hero Section - ULTRA MINIMALIST */}
			<section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
				<div className="absolute inset-0 bg-black opacity-40"></div>
				<div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
					<div className="text-center text-white">
						<h1 className="text-2xl sm:text-3xl font-bold mb-6 leading-tight">
							Cumpără și Vinde Motociclete
							<span className="block text-nexar-accent text-xl sm:text-2xl">
								GRATUIT
							</span>
						</h1>

						{/* Hero Search */}
						<div className="max-w-md mx-auto mb-6">
							<div className="relative backdrop-blur-md bg-white/10 rounded-xl p-1 border border-white/20">
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Caută după marcă, model sau tip..."
									className="w-full pl-4 pr-16 py-2.5 text-sm rounded-lg border-0 bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-nexar-accent shadow-lg text-gray-900 placeholder-gray-600"
								/>
								<button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-nexar-accent text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-nexar-gold transition-colors text-xs shadow-lg">
									Caută
								</button>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<Link
								to="/anunturi"
								className="bg-nexar-accent/90 backdrop-blur-sm text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-nexar-gold transition-all duration-200 transform hover:scale-105 shadow-lg border border-nexar-accent/30 text-sm"
							>
								Explorează Anunțurile
							</Link>
							<Link
								to="/adauga-anunt"
								className="bg-white/90 backdrop-blur-sm text-gray-900 px-5 py-2.5 rounded-lg font-semibold hover:bg-white transition-all duration-200 transform hover:scale-105 shadow-lg border border-white/30 text-sm"
							>
								Vinde Motocicleta Ta
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Listings with Filters */}
			<section className="py-8 sm:py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Mobile-friendly layout */}
					<div className="block lg:hidden mb-6">
						<button
							onClick={() => setShowFilters(!showFilters)}
							className="w-full flex items-center justify-center space-x-2 bg-white text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-gray-200 mb-4"
						>
							<SlidersHorizontal className="h-4 w-4" />
							<span>{showFilters ? "Ascunde" : "Arată"} Filtrele</span>
						</button>

						{showFilters && (
							<div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
								<div className="flex items-center justify-between mb-6">
									<h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
										<Filter className="h-5 w-5" />
										<span>Filtrează Rezultatele</span>
									</h3>
									<button
										onClick={() => setShowFilters(false)}
										className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
									>
										<X className="h-4 w-4" />
									</button>
								</div>

								<div className="space-y-6">
									{/* Price Range */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											Preț (EUR)
										</label>
										<div className="grid grid-cols-2 gap-2">
											<input
												type="number"
												placeholder="Min"
												value={filters.priceMin}
												onChange={(e) =>
													handleFilterChange("priceMin", e.target.value)
												}
												className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
											/>
											<input
												type="number"
												placeholder="Max"
												value={filters.priceMax}
												onChange={(e) =>
													handleFilterChange("priceMax", e.target.value)
												}
												className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
											/>
										</div>
									</div>

									{/* Category */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											Categorie
										</label>
										<select
											value={filters.category}
											onChange={(e) =>
												handleFilterChange("category", e.target.value)
											}
											className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
										>
											<option value="">Toate categoriile</option>
											<option value="sport">Sport</option>
											<option value="touring">Touring</option>
											<option value="cruiser">Cruiser</option>
											<option value="adventure">Adventure</option>
											<option value="naked">Naked</option>
											<option value="scooter">Scooter</option>
											<option value="enduro">Enduro</option>
											<option value="chopper">Chopper</option>
										</select>
									</div>

									{/* Brand */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											Marcă
										</label>
										<select
											value={filters.brand}
											onChange={(e) =>
												handleFilterChange("brand", e.target.value)
											}
											className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
										>
											<option value="">Toate mărcile</option>
											<option value="Yamaha">Yamaha</option>
											<option value="Honda">Honda</option>
											<option value="BMW">BMW</option>
											<option value="Ducati">Ducati</option>
											<option value="KTM">KTM</option>
											<option value="Suzuki">Suzuki</option>
											<option value="Harley-Davidson">Harley-Davidson</option>
											<option value="Kawasaki">Kawasaki</option>
											<option value="Triumph">Triumph</option>
											<option value="Aprilia">Aprilia</option>
										</select>
									</div>

									{/* Year Range */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											An fabricație
										</label>
										<div className="grid grid-cols-2 gap-2">
											<input
												type="number"
												placeholder="De la"
												value={filters.yearMin}
												onChange={(e) =>
													handleFilterChange("yearMin", e.target.value)
												}
												className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
											/>
											<input
												type="number"
												placeholder="Până la"
												value={filters.yearMax}
												onChange={(e) =>
													handleFilterChange("yearMax", e.target.value)
												}
												className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
											/>
										</div>
									</div>

									{/* Location */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											Locația
										</label>
										<select
											value={filters.location}
											onChange={(e) =>
												handleFilterChange("location", e.target.value)
											}
											className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
										>
											<option value="">Toate locațiile</option>
											<option value="București">București</option>
											<option value="Cluj-Napoca">Cluj-Napoca</option>
											<option value="Timișoara">Timișoara</option>
											<option value="Iași">Iași</option>
											<option value="Constanța">Constanța</option>
											<option value="Brașov">Brașov</option>
											<option value="Craiova">Craiova</option>
											<option value="Galați">Galați</option>
											<option value="Oradea">Oradea</option>
											<option value="Ploiești">Ploiești</option>
											<option value="Sibiu">Sibiu</option>
											<option value="Bacău">Bacău</option>
										</select>
									</div>

									{/* Clear Filters */}
									<button
										onClick={clearFilters}
										className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
									>
										<X className="h-4 w-4" />
										<span>Șterge Filtrele</span>
									</button>
								</div>
							</div>
						)}
					</div>

					{/* Desktop layout */}
					<div className="hidden lg:flex gap-6">
						{/* Filters Sidebar */}
						<div
							className={`${
								showFilters ? "w-80" : "w-0"
							} transition-all duration-300 overflow-hidden`}
						>
							<div className="bg-white rounded-xl shadow-sm p-6 sticky top-24 border border-gray-100">
								<div className="flex items-center justify-between mb-6">
									<h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
										<Filter className="h-5 w-5" />
										<span>Filtrează Rezultatele</span>
									</h3>
									<button
										onClick={() => setShowFilters(false)}
										className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
									>
										<X className="h-4 w-4" />
									</button>
								</div>

								<div className="space-y-6">
									{/* Price Range */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											Preț (EUR)
										</label>
										<div className="grid grid-cols-2 gap-2">
											<input
												type="number"
												placeholder="Min"
												value={filters.priceMin}
												onChange={(e) =>
													handleFilterChange("priceMin", e.target.value)
												}
												className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
											/>
											<input
												type="number"
												placeholder="Max"
												value={filters.priceMax}
												onChange={(e) =>
													handleFilterChange("priceMax", e.target.value)
												}
												className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
											/>
										</div>
									</div>

									{/* Category */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											Categorie
										</label>
										<select
											value={filters.category}
											onChange={(e) =>
												handleFilterChange("category", e.target.value)
											}
											className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
										>
											<option value="">Toate categoriile</option>
											<option value="sport">Sport</option>
											<option value="touring">Touring</option>
											<option value="cruiser">Cruiser</option>
											<option value="adventure">Adventure</option>
											<option value="naked">Naked</option>
											<option value="scooter">Scooter</option>
											<option value="enduro">Enduro</option>
											<option value="chopper">Chopper</option>
										</select>
									</div>

									{/* Brand */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											Marcă
										</label>
										<select
											value={filters.brand}
											onChange={(e) =>
												handleFilterChange("brand", e.target.value)
											}
											className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
										>
											<option value="">Toate mărcile</option>
											<option value="Yamaha">Yamaha</option>
											<option value="Honda">Honda</option>
											<option value="BMW">BMW</option>
											<option value="Ducati">Ducati</option>
											<option value="KTM">KTM</option>
											<option value="Suzuki">Suzuki</option>
											<option value="Harley-Davidson">Harley-Davidson</option>
											<option value="Kawasaki">Kawasaki</option>
											<option value="Triumph">Triumph</option>
											<option value="Aprilia">Aprilia</option>
										</select>
									</div>

									{/* Year Range */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											An fabricație
										</label>
										<div className="grid grid-cols-2 gap-2">
											<input
												type="number"
												placeholder="De la"
												value={filters.yearMin}
												onChange={(e) =>
													handleFilterChange("yearMin", e.target.value)
												}
												className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
											/>
											<input
												type="number"
												placeholder="Până la"
												value={filters.yearMax}
												onChange={(e) =>
													handleFilterChange("yearMax", e.target.value)
												}
												className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
											/>
										</div>
									</div>

									{/* Location */}
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-3">
											Locația
										</label>
										<select
											value={filters.location}
											onChange={(e) =>
												handleFilterChange("location", e.target.value)
											}
											className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nexar-accent focus:border-transparent"
										>
											<option value="">Toate locațiile</option>
											<option value="București">București</option>
											<option value="Cluj-Napoca">Cluj-Napoca</option>
											<option value="Timișoara">Timișoara</option>
											<option value="Iași">Iași</option>
											<option value="Constanța">Constanța</option>
											<option value="Brașov">Brașov</option>
											<option value="Craiova">Craiova</option>
											<option value="Galați">Galați</option>
											<option value="Oradea">Oradea</option>
											<option value="Ploiești">Ploiești</option>
											<option value="Sibiu">Sibiu</option>
											<option value="Bacău">Bacău</option>
										</select>
									</div>

									{/* Clear Filters */}
									<button
										onClick={clearFilters}
										className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
									>
										<X className="h-4 w-4" />
										<span>Șterge Filtrele</span>
									</button>
								</div>
							</div>
						</div>

						{/* Main Content */}
						<div className="flex-1">
							{/* Toggle Filters Button */}
							<div className="mb-6 flex justify-between items-center">
								<button
									onClick={() => setShowFilters(!showFilters)}
									className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-gray-200"
								>
									<SlidersHorizontal className="h-4 w-4" />
									<span>{showFilters ? "Ascunde" : "Arată"} Filtrele</span>
								</button>

								<p className="text-gray-600">
									{filteredListings.length} rezultate găsite
									{searchQuery && (
										<span className="ml-2 text-nexar-accent">
											pentru "{searchQuery}"
										</span>
									)}
								</p>
							</div>

							{/* Loading State */}
							{isLoading && (
								<div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
									<div className="w-16 h-16 border-4 border-nexar-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
									<h3 className="text-xl font-semibold text-gray-900 mb-2">
										Se încarcă anunțurile...
									</h3>
									<p className="text-gray-600">Te rugăm să aștepți</p>
								</div>
							)}

							{/* Error State */}
							{error && (
								<div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
									<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<X className="h-8 w-8 text-red-500" />
									</div>
									<h3 className="text-xl font-semibold text-gray-900 mb-2">
										Eroare la încărcare
									</h3>
									<p className="text-gray-600 mb-6">{error}</p>
									<button
										onClick={loadListings}
										className="bg-nexar-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
									>
										Încearcă din nou
									</button>
								</div>
							)}

							{/* No Results */}
							{!isLoading && !error && filteredListings.length === 0 && (
								<div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
									<Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
									<h3 className="text-xl font-semibold text-gray-900 mb-2">
										Nu am găsit rezultate
									</h3>
									<p className="text-gray-600 mb-6">
										{allListings.length === 0
											? "Nu există anunțuri publicate încă. Fii primul care adaugă un anunț!"
											: "Încearcă să modifici criteriile de căutare sau filtrele pentru a găsi mai multe rezultate."}
									</p>
									{allListings.length === 0 ? (
										<Link
											to="/adauga-anunt"
											className="bg-nexar-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
										>
											Adaugă primul anunț
										</Link>
									) : (
										<button
											onClick={clearFilters}
											className="bg-nexar-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
										>
											Șterge Toate Filtrele
										</button>
									)}
								</div>
							)}

							{/* Listings */}
							{!isLoading && !error && filteredListings.length > 0 && (
								<div className="space-y-4">
									{currentListings.map((listing) => (
										<ListingRow key={listing.id} listing={listing} />
									))}
								</div>
							)}
						</div>
					</div>

					{/* Mobile Listings - Show directly after filters button */}
					<div className="block lg:hidden">
						{/* Loading State */}
						{isLoading && (
							<div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
								<div className="w-12 h-12 border-4 border-nexar-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
								<p className="text-gray-600">Se încarcă anunțurile...</p>
							</div>
						)}

						{/* Error State */}
						{error && (
							<div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
								<div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<X className="h-6 w-6 text-red-500" />
								</div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									Eroare la încărcare
								</h3>
								<p className="text-gray-600 mb-6 text-sm">{error}</p>
								<button
									onClick={loadListings}
									className="bg-nexar-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
								>
									Încearcă din nou
								</button>
							</div>
						)}

						{/* No Results */}
						{!isLoading && !error && filteredListings.length === 0 && (
							<div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
								<Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									Nu am găsit rezultate
								</h3>
								<p className="text-gray-600 mb-6 text-sm">
									{allListings.length === 0
										? "Nu există anunțuri publicate încă. Fii primul care adaugă un anunț!"
										: "Încearcă să modifici criteriile de căutare sau filtrele pentru a găsi mai multe rezultate."}
								</p>
								{allListings.length === 0 ? (
									<Link
										to="/adauga-anunt"
										className="bg-nexar-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
									>
										Adaugă primul anunț
									</Link>
								) : (
									<button
										onClick={clearFilters}
										className="bg-nexar-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-nexar-gold transition-colors"
									>
										Șterge Toate Filtrele
									</button>
								)}
							</div>
						)}

						{/* Mobile Listings */}
						{!isLoading && !error && filteredListings.length > 0 && (
							<div className="space-y-4">
								{currentListings.map((listing) => (
									<ListingRow key={listing.id} listing={listing} />
								))}
							</div>
						)}
					</div>

					{/* Pagination - Show on all devices */}
					{!isLoading &&
						!error &&
						filteredListings.length > 0 &&
						totalPages > 1 && (
							<div className="mt-8 flex justify-center">
								<div className="flex items-center space-x-2">
									<button
										onClick={() => goToPage(Math.max(1, currentPage - 1))}
										disabled={currentPage === 1}
										className="flex items-center space-x-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<ChevronLeft className="h-4 w-4" />
										<span className="hidden sm:inline">Anterior</span>
									</button>

									{/* Page numbers */}
									{[...Array(totalPages)].map((_, index) => {
										const page = index + 1;
										// Show only a few pages around current page on mobile
										const showPage =
											totalPages <= 5 ||
											page === 1 ||
											page === totalPages ||
											(page >= currentPage - 1 && page <= currentPage + 1);

										if (!showPage) {
											// Show ellipsis
											if (
												page === currentPage - 2 ||
												page === currentPage + 2
											) {
												return (
													<span key={page} className="px-2 py-2 text-gray-400">
														...
													</span>
												);
											}
											return null;
										}

										return (
											<button
												key={page}
												onClick={() => goToPage(page)}
												className={`px-3 py-2 rounded-lg transition-colors ${
													currentPage === page
														? "bg-nexar-accent text-white"
														: "border border-gray-200 hover:bg-gray-50"
												}`}
											>
												{page}
											</button>
										);
									})}

									<button
										onClick={() =>
											goToPage(Math.min(totalPages, currentPage + 1))
										}
										disabled={currentPage === totalPages}
										className="flex items-center space-x-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										<span className="hidden sm:inline">Următorul</span>
										<ChevronRight className="h-4 w-4" />
									</button>
								</div>
							</div>
						)}
				</div>
			</section>

			{/* Categories */}
			<section className="py-16 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-10">
						<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
							Categorii Populare
						</h2>
						<p className="text-lg text-gray-600">
							Găsește exact tipul de motocicletă pe care îl cauți
						</p>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
						{categories.map((category, index) => (
							<Link
								key={index}
								to={`/?categorie=${category.name.toLowerCase()}`}
								className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-gray-200"
								onClick={() => {
									setFilters((prev) => ({
										...prev,
										category: category.name.toLowerCase(),
									}));
									window.scrollTo(0, 0);
								}} 
							>
								<img
									loading="lazy"
									src={category.image}
									alt={category.name}
									className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
								<div className="absolute bottom-0 left-0 right-0 p-3 text-white">
									<h3 className="font-bold mb-1">{category.name}</h3>
									<p className="text-xs text-gray-200">{category.count}</p>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Why Choose Us */}
			<section className="py-16 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-10">
						<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
							De Ce Să Alegi Nexar?
						</h2>
						<p className="text-lg text-gray-600 max-w-xl mx-auto">
							Oferim cea mai sigură și eficientă platformă pentru cumpărarea și
							vânzarea motocicletelor
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow border border-gray-200">
							<div className="inline-flex items-center justify-center w-12 h-12 bg-nexar-accent/10 rounded-lg mb-4">
								<Shield className="h-6 w-6 text-nexar-accent" />
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-3">
								Siguranță Garantată
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm">
								Toate anunțurile sunt verificate manual. Sistem de rating și
								recenzii pentru fiecare vânzător.
							</p>
						</div>

						<div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow border border-gray-200">
							<div className="inline-flex items-center justify-center w-12 h-12 bg-nexar-accent/10 rounded-lg mb-4">
								<CheckCircle className="h-6 w-6 text-nexar-accent" />
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-3">
								Proces Simplificat
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm">
								Interfață intuitivă și proces de listare simplu. Publică anunțul
								tău în doar câteva minute.
							</p>
						</div>

						<div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow border border-gray-200">
							<div className="inline-flex items-center justify-center w-12 h-12 bg-nexar-accent/10 rounded-lg mb-4">
								<Users className="h-6 w-6 text-nexar-accent" />
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-3">
								Comunitate Activă
							</h3>
							<p className="text-gray-600 leading-relaxed text-sm">
								Peste 15,000 de pasionați de motociclete. Găsește sfaturi și
								recomandări de la experți.
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
