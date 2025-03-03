import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import ServiceGrid from "../components/Services/ServiceGrid";
import CategoryHeader from "../components/Dashboard/CategoryHeader";
import { fetchServices } from "../api/serviceAPI";

export default function DashboardPage() {
  const { categoryId = "opar" } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);


  const categories = {
    opar: { 
      name: "Opar Token", 
      icon: "💎", 
      description: "Gérez vos tokens et transactions" 
    },
    assurance: { 
      name: "Assurance et sécurité sociale", 
      icon: "🛡️", 
      description: "Services d'assurance et de protection sociale" 
    },
    eau: { 
      name: "Eau et Électricité", 
      icon: "💧", 
      description: "Gestion de vos factures et consommation" 
    },
    telephone: { 
      name: "Téléphonie et Internet", 
      icon: "📱", 
      description: "Services de communication et connexion" 
    },
    transport: { 
      name: "Transport", 
      icon: "🚌", 
      description: "Billets et abonnements de transport" 
    },
    transfert: { 
      name: "Transfert d'argent", 
      icon: "💸", 
      description: "Solutions pour envoyer et recevoir de l'argent" 
    },
    impots: { 
      name: "Impôts & Taxes", 
      icon: "📊", 
      description: "Gestion de vos obligations fiscales" 
    },
    achat: { 
      name: "Achat Internet", 
      icon: "🛒", 
      description: "Services de paiement en ligne" 
    },
    societes: { 
      name: "Sociétés de financement", 
      icon: "🏢", 
      description: "Partenaires financiers et options de crédit" 
    },
    comptes: { 
      name: "Comptes de paiement", 
      icon: "💳", 
      description: "Gérez vos comptes et moyens de paiement" 
    },
    services: { 
      name: "Services M2T", 
      icon: "🔧", 
      description: "Services additionnels et support" 
    },
  };

  // Récupération des services
  useEffect(() => {
    const loadServices = async () => {
      setIsLoading(true);
      try {
        const data = await fetchServices(categoryId);
        setServices(data);
        setFilteredServices(data);
        setError("");
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setError("Échec du chargement des services. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, [categoryId]);

  // Filtrage des services en fonction du terme de recherche
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service => 
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredServices(filtered);
    }
  }, [searchTerm, services]);

  // Gestion du click sur une catégorie populaire
  const handleCategoryClick = (id) => {
    navigate(`/dashboard/${id}`);
  };

  // Obtention des catégories populaires (exemple statique - à remplacer par des données réelles)
  const popularCategories = ["telephone", "eau", "transfert", "impots"];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar activeItem={categoryId} />

      <div className="flex-1 overflow-auto">
        {/* Header avec bannière et recherche */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-md">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  {categories[categoryId]?.icon && <span className="mr-2">{categories[categoryId].icon}</span>}
                  {categories[categoryId]?.name || "Dashboard"}
                </h1>
                <p className="text-blue-100 mt-1">
                  {categories[categoryId]?.description || "Accédez à tous vos services"}
                </p>
              </div>
              
              <div className="w-full md:w-64">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher un service..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-800 bg-white bg-opacity-90 
                               focus:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-300 
                               transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-7xl mx-auto">
          {/* Catégories populaires */}
          {categoryId === "opar" && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Catégories populaires</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {popularCategories.map(catId => (
                  <div 
                    key={catId}
                    onClick={() => handleCategoryClick(catId)}
                    className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow 
                              cursor-pointer border border-gray-100 hover:border-blue-200 flex items-center"
                  >
                    <span className="text-2xl mr-3">{categories[catId].icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-800">{categories[catId].name}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{categories[catId].description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages d'erreur */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 flex items-start">
              <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">Erreur de chargement</p>
                <p className="text-sm">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-sm text-red-700 underline hover:text-red-800 mt-1 font-medium"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}

          {/* État de chargement */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12">
              {/* Spinner de chargement personnalisé (sans dépendance externe) */}
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Chargement des services...</p>
            </div>
          ) : (
            <>
              {/* Résultats de recherche */}
              {searchTerm && (
                <div className="mb-6">
                  <h2 className="text-lg text-gray-700 mb-3">
                    {filteredServices.length === 0 
                      ? `Aucun résultat pour "${searchTerm}"` 
                      : `Résultats pour "${searchTerm}" (${filteredServices.length})`}
                  </h2>
                </div>
              )}

              {/* Grille de services avec état vide */}
              {filteredServices.length === 0 && !isLoading && !error ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Aucun service disponible</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm 
                      ? "Essayez de modifier vos critères de recherche" 
                      : "Aucun service n'est actuellement disponible dans cette catégorie"}
                  </p>
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")} 
                      className="inline-flex items-center px-4 py-2 border border-transparent 
                                rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 
                                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                focus:ring-blue-500"
                    >
                      Effacer la recherche
                    </button>
                  )}
                </div>
              ) : (
                <ServiceGrid services={filteredServices} searchTerm={searchTerm} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}