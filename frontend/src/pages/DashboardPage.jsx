import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import ServiceGrid from "../components/Services/ServiceGrid";
import CategoryManagement from "../components/Dashboard/CategoryManagement"; 
import FournisseurManagement from "../components/Dashboard/FournisseurManagement";

import { getCategory, getAllCategories } from "../api/categoryService";
import { getFournisseursByCategory } from "../api/fournisseurService";
import { useSelector } from "react-redux"; 
import UserManagement from "../components/Dashboard/UserManagement";
import Profile from "../components/Dashboard/Profile";
import Statistique from "../components/Dashboard/statistique";

export default function DashboardPage() {
  const { categoryId = "opar" } = useParams();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth); 
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categories, setCategories] = useState({});
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);

  // Admin specific section handlers
  const isAdminSection = role === "admin" && ["categories", "fournisseurs", "users", "statistiques"].includes(categoryId);
  const isProfileSection = categoryId === "profile" && role !== "admin";
 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        const categoriesMap = {};
        categoriesData.forEach(cat => {
          categoriesMap[cat.slug] = {
            id: cat._id,
            name: cat.name,
            icon: cat.icon,
            description: cat.description
          };
        });
        setCategories(categoriesMap);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isAdminSection || isProfileSection) return;

    const loadCategoryAndServices = async () => {
      setIsLoading(true);
      try {
        const categoryData = await getCategory(categoryId);
        setCurrentCategory(categoryData);
        
        const servicesData = await getFournisseursByCategory(categoryData._id);
        const formattedServices = servicesData.map(service => ({
          id: service._id,
          name: service.name,
          description: service.description,
          logo: service.logo
        }));
        
        setServices(formattedServices);
        setFilteredServices(formattedServices);
        setError("");
      } catch (err) {
        console.error("Failed to fetch data:", err);
        if (err.response?.status === 401) {
          navigate('/');
        } else {
          setError("Failed to load category and services");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategoryAndServices();
  }, [categoryId, isAdminSection, isProfileSection, navigate]);

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

  const handleCategoryClick = (id) => {
    navigate(`/dashboard/${id}`);
  };

  const popularCategories = ["telephone", "eau", "transfert", "impots"];

  // Function to render admin sections based on categoryId
  const renderSection = () => {
    if (isAdminSection) {
      switch (categoryId) {
        case "categories":
          return <CategoryManagement />;
        case "fournisseurs":
          return <FournisseurManagement/>;
        case "users":
          return <UserManagement/>;
        case "statistiques":
          return <Statistique/>;
          
      }
    } else if (isProfileSection) {
      return <Profile />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar activeItem={categoryId} />

      <div className="flex-1 overflow-auto">
        {isAdminSection ? (
          renderSection()
        ) : isProfileSection ? (
          <Profile />
        ) : (
          // Regular dashboard content
          <>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-md">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold flex items-center">
                      {currentCategory?.icon && <span className="mr-2">{currentCategory.icon}</span>}
                      {currentCategory?.name || "Dashboard"}
                    </h1>
                    <p className="text-blue-100 mt-1">
                      {currentCategory?.description || "Accédez à tous vos services"}
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
              {categoryId === "opar" && categories && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Catégories populaires</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {popularCategories.map(catId => {
                      const category = categories[catId];
                      if (!category) return null;
                      
                      return (
                        <div 
                          key={catId}
                          onClick={() => handleCategoryClick(catId)}
                          className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow 
                                    cursor-pointer border border-gray-100 hover:border-blue-200 flex items-center"
                        >
                          <span className="text-2xl mr-3">{category.icon}</span>
                          <div>
                            <h3 className="font-medium text-gray-800">{category.name}</h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{category.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
    
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
    
              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-gray-600">Chargement des services...</p>
                </div>
              ) : (
                <>
                  {searchTerm && (
                    <div className="mb-6">
                      <h2 className="text-lg text-gray-700 mb-3">
                        {filteredServices.length === 0 
                          ? `Aucun résultat pour "${searchTerm}"` 
                          : `Résultats pour "${searchTerm}" (${filteredServices.length})`}
                      </h2>
                    </div>
                  )}
    
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
          </>
        )}
      </div>
    </div>
  );
}