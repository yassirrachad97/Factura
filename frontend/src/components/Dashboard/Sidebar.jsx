import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../api/categoryService";
import riadLogo from "../../assets/riad-logo.png";

export default function Sidebar({ activeItem, categoriesUpdated }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, role } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // Fonction pour charger les catégories
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getAllCategories();
      const formattedCategories = data.map((category) => ({
        id: category._id,
        slug: category.slug,
        icon: category.icon,
        name: category.name,
        description: category.description,
        group: category.group,
        order: category.order,
      }));
      console.log("Categories récupérées:", formattedCategories);
      setCategories(formattedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement initial des catégories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Rechargement des catégories lorsque categoriesUpdated change
  useEffect(() => {
    if (categoriesUpdated) {
      fetchCategories();
    }
  }, [categoriesUpdated]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Create menu items using both slug and id for more robust matching
  const menuItems = categories.map((category) => ({
    id: category.slug || "",
    categoryId: category.id,
    icon: category.icon || "📁",
    label: category.name || "",
    description: category.description || "",
    group: category.group || "",
  }));

  const managementItems = [
    ...(role !== 'admin' ? [{
      id: "profile",
      icon: "👤",
      label: "Profile",
      description: "Gérer votre profil",
      to: "/dashboard/profile"
    }] : []),
    {
      id: "transactions",
      icon: "📝",
      label: "Transactions",
      description: "Historique des transactions",
    },
    {
      id: "logout",
      icon: "🚪",
      label: "Déconnexion",
      description: "Se déconnecter",
      onClick: handleLogout,
    },
  ];

  const adminItems = [
    {
      id: "users",
      icon: "👥",
      label: "Utilisateurs",
      description: "Gérer les utilisateurs",
    },
    {
      id: "fournisseurs",
      icon: "🏭",
      label: "Fournisseurs",
      description: "Gérer les fournisseurs",
    },
    {
      id: "categories",
      icon: "🗂️",
      label: "Catégories",
      description: "Gérer les catégories",
    },
    {
      id: "statistiques",
      icon: "📄",
      label: "statistiques",
      description: "voir les statistiques",
    }
  ];

  const categoryGroups = [
    {
      title: "SERVICES ESSENTIELS",
      items: ["opar", "eau", "telephone", "impots"],
    },
    {
      title: "SERVICES FINANCIERS",
      items: ["transfert", "comptes", "societes", "assurance"],
    },
    { title: "AUTRES SERVICES", items: ["transport", "achat", "services"] },
  ];


  const getItemsByCategory = () => {
    if (!menuItems || menuItems.length === 0) return [];

    return categoryGroups.map((group) => {
      // Filter items either by id matching the items array OR by matching the group property
      const groupItems = menuItems.filter(
        (item) => (item.id && group.items.includes(item.id)) || 
                  (item.group && item.group.toUpperCase() === group.title)
      );
      return { ...group, menuItems: groupItems };
    });
  };

  const organizedItems = getItemsByCategory();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  console.log(organizedItems);

  return (
    <div className={`bg-[#1a1a27] text-white h-screen relative ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
      <div className="flex flex-col h-full">
        {/* Header with Logo and User Info */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img src={riadLogo} alt="Riad Logo" className="h-8 w-auto" />
              {!isCollapsed && <span className="ml-2 text-lg font-semibold">Factura</span>}
            </div>
            <button onClick={toggleSidebar} className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
              </svg>
            </button>
          </div>
          
          {/* User Info Section */}
          <div className="flex items-center mt-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
              <span className="text-white text-lg font-medium">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            {!isCollapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {user?.username || "Utilisateur"}
                </p>
                <p className="text-xs text-gray-400">
                  {role === "admin" ? "Administrateur" : "Compte Standard"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Rest of the sidebar content */}
        <div className="flex-1 overflow-y-auto py-4">
          {organizedItems.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-4">
              {!isCollapsed && (
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {group.title}
                </div>
              )}
              <div className="px-3 space-y-2">
                {group.menuItems.map((item) => (
                  <Link
                    key={item.id}
                    to={`/dashboard/${item.id}`}
                    className={`block p-2 rounded-xl text-sm transition-all duration-200
                      ${activeItem === item.id
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                        : "text-gray-300 hover:bg-gray-800"
                      }`}
                    title={item.description}
                  >
                    <div className={`${isCollapsed ? 'text-center' : 'flex items-center'}`}>
                      <span className={`${isCollapsed ? "text-xl" : "text-xl mr-3"}`}>
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-2 border-t border-gray-800 pt-4">
            {!isCollapsed && (
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                GESTION
              </div>
            )}
            {managementItems.map((item) => (
              item.to ? (
                <Link
                  key={item.id}
                  to={item.to}
                  className={`flex items-center px-4 py-3 text-sm transition-colors duration-200
                    ${
                      activeItem === item.id
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  title={item.description}
                >
                  <span className={`${isCollapsed ? "text-xl" : "mr-3"}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              ) : (
                <div
                  key={item.id}
                  onClick={item.onClick}
                  className={`flex items-center px-4 py-3 text-sm transition-colors duration-200 cursor-pointer
                    ${
                      activeItem === item.id
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    } ${isCollapsed ? "justify-center" : ""}`}
                  title={item.description}
                >
                  <span className={`${isCollapsed ? "text-xl" : "mr-3"}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
              )
            ))}

            {role === "admin" &&
              adminItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/dashboard/${item.id}`}
                  className={`flex items-center px-4 py-3 text-sm transition-colors duration-200
                  ${
                    activeItem === item.id
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  } ${isCollapsed ? "justify-center" : ""}`}
                  title={item.description}
                >
                  <span className={`${isCollapsed ? "text-xl" : "mr-3"}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}