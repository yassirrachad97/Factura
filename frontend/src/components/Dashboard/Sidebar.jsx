import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Sidebar({ activeItem }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Icônes utilisant les mêmes noms que Font Awesome mais avec emojis/labels descriptifs 
  // pour une meilleure compatibilité visuelle
  const menuItems = [
    { id: 'opar', icon: '💎', label: 'Opar Token', description: 'Gérez vos tokens' },
    { id: 'assurance', icon: '🛡️', label: 'Assurance', description: 'Assurance et sécurité sociale' },
    { id: 'eau', icon: '💧', label: 'Eau & Élec.', description: 'Eau et Électricité' },
    { id: 'telephone', icon: '📱', label: 'Téléphonie', description: 'Téléphonie et Internet' },
    { id: 'transport', icon: '🚌', label: 'Transport', description: 'Services de transport' },
    { id: 'transfert', icon: '💸', label: 'Transfert', description: 'Transfert d\'argent' },
    { id: 'impots', icon: '📊', label: 'Impôts', description: 'Impôts & Taxes' },
    { id: 'achat', icon: '🛒', label: 'Achat', description: 'Achat Internet' },
    { id: 'societes', icon: '🏢', label: 'Sociétés', description: 'Sociétés de financement' },
    { id: 'comptes', icon: '💳', label: 'Comptes', description: 'Comptes de paiement' },
    { id: 'services', icon: '🔧', label: 'Services', description: 'Services M2T' },
  ];

  const managementItems = [
    { id: 'profile', icon: '👤', label: 'Profile', description: 'Gérer votre profil' },
    { id: 'transactions', icon: '📝', label: 'Transactions', description: 'Historique des transactions' },
    { id: 'logout', icon: '🚪', label: 'Déconnexion', description: 'Se déconnecter' },
  ];

  // Fonction pour regrouper les éléments par catégorie
  const categoryGroups = [
    { title: "SERVICES ESSENTIELS", items: ['opar', 'eau', 'telephone', 'impots'] },
    { title: "SERVICES FINANCIERS", items: ['transfert', 'comptes', 'societes', 'assurance'] },
    { title: "AUTRES SERVICES", items: ['transport', 'achat', 'services'] },
  ];

  // Obtenir tous les éléments organisés par groupe
  const getItemsByCategory = () => {
    return categoryGroups.map(group => {
      const groupItems = menuItems.filter(item => group.items.includes(item.id));
      return { ...group, menuItems: groupItems };
    });
  };

  const organizedItems = getItemsByCategory();

  // Fonction pour basculer la barre latérale
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`transition-all duration-300 bg-[#1e1e2d] text-white flex-shrink-0 border-r border-gray-800 h-screen overflow-y-auto relative ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo et Titre */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center">
          <div className="bg-blue-500 text-white rounded-lg p-2 mr-2">
            <span className="text-xl">F</span>
          </div>
          {!isCollapsed && <span className="font-bold text-xl">Factura</span>}
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

      {/* Menu Principal */}
      <div className="mt-4">
        {/* Afficher les éléments par catégorie */}
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

        {/* Section Gestion */}
        <div className="mt-2 border-t border-gray-800 pt-4">
          {!isCollapsed && (
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              GESTION
            </div>
          )}
          {managementItems.map((item) => (
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

      {/* Profil utilisateur */}
      <div className="absolute bottom-0 w-full border-t border-gray-800 p-4 bg-[#1a1a27]">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
            <span className="text-white text-sm font-medium">UT</span>
          </div>
          {!isCollapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Utilisateur</p>
              <p className="text-xs text-gray-400">Compte Standard</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}