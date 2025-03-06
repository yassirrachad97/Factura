import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useEffect, useState } from 'react';
import { getAllCategories } from '../../api/categoryService';
import riadLogo from "../../assets/riad-logo.png";

export default function Sidebar({ activeItem }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, role } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);
  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await getAllCategories();
        const formattedCategories = data.map(category => ({
          id: category._id,
          slug: category.slug,
          icon: category.icon,
          name: category.name,
          description: category.description,
          group: category.group,
          order: category.order
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const handleLogout = () => {
    dispatch(logout()); 
    navigate('/');
  };

  const menuItems = categories.map(category => ({
    id: category.slug || '',
    icon: category.icon || '📁',
    label: category.name || '',
    description: category.description || '',
    group: category.group || ''
  }));

  const managementItems = [
    { id: 'profile', icon: '👤', label: 'Profile', description: 'Gérer votre profil' },
    { id: 'transactions', icon: '📝', label: 'Transactions', description: 'Historique des transactions' },
    { id: 'logout', icon: '🚪', label: 'Déconnexion', description: 'Se déconnecter', onClick: handleLogout },
  ];

  const adminItems = [
    { id: 'users', icon: '👥', label: 'Utilisateurs', description: 'Gérer les utilisateurs' },
    { id: 'fournisseurs', icon: '🏭', label: 'Fournisseurs', description: 'Gérer les fournisseurs' },
  ];

  const categoryGroups = [
    { title: "SERVICES ESSENTIELS", items: ['opar', 'eau', 'telephone', 'impots'] },
    { title: "SERVICES FINANCIERS", items: ['transfert', 'comptes', 'societes', 'assurance'] },
    { title: "AUTRES SERVICES", items: ['transport', 'achat', 'services'] },
  ];

  const getItemsByCategory = () => {
    if (!menuItems || menuItems.length === 0) return [];
    
    return categoryGroups.map(group => {
      const groupItems = menuItems.filter(item => 
        item.id && group.items.includes(item.id)
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

  return (
    <div className={`transition-all duration-300 bg-[#1e1e2d] text-white flex-shrink-0 border-r border-gray-800 h-screen overflow-y-auto relative ${isCollapsed ? 'w-20' : 'w-64'}`}>
    
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
      <div className="flex items-center">
    <img 
      src={riadLogo} 
      alt="RIAD Logo" 
      className={`transition-all duration-300 object-contain ${
        isCollapsed ? 'h-8 w-8' : 'h-10 w-auto'
      }`} 
    />
    {!isCollapsed && <span className="font-bold text-xl ml-2">Factura</span>}
  </div>
  <button 
          onClick={toggleSidebar} 
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>


      <div className="mt-4">
     
        {organizedItems.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4">
            {!isCollapsed && (
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {group.title}
              </div>
            )}
            {group.menuItems.map((item) => (
              <Link 
                key={item.id}
                to={`/dashboard/${item.id}`} 
                className={`flex items-center px-4 py-3 text-sm transition-colors duration-200 
                  ${activeItem === item.id 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                title={item.description}
              >
                <span className={`${isCollapsed ? 'text-xl' : 'mr-3'}`}>{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
                {!isCollapsed && activeItem === item.id && (
                  <span className="ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </Link>
            ))}
          </div>
        ))}


        <div className="mt-2 border-t border-gray-800 pt-4">
          {!isCollapsed && (
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              GESTION
            </div>
          )}
          {managementItems.map((item) => (
            <div
              key={item.id}
              onClick={item.onClick}
              className={`flex items-center px-4 py-3 text-sm transition-colors duration-200 cursor-pointer
                ${activeItem === item.id 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
                } ${isCollapsed ? 'justify-center' : ''}`}
              title={item.description}
            >
              <span className={`${isCollapsed ? 'text-xl' : 'mr-3'}`}>{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </div>
          ))}

         
          {role === 'admin' && adminItems.map((item) => (
            <Link 
              key={item.id}
              to={`/dashboard/${item.id}`} 
              className={`flex items-center px-4 py-3 text-sm transition-colors duration-200
                ${activeItem === item.id 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
                } ${isCollapsed ? 'justify-center' : ''}`}
              title={item.description}
            >
              <span className={`${isCollapsed ? 'text-xl' : 'mr-3'}`}>{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
      </div>

    
      <div className="absolute bottom-0 w-full border-t border-gray-800 p-4 bg-[#1a1a27]">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
            <span className="text-white text-sm font-medium">{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.username || 'Utilisateur'}</p>
              <p className="text-xs text-gray-400">{role === 'admin' ? 'Admin' : 'Compte Standard'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}