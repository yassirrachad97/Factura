// serviceAPI.js (Version statique sans API)

// Fonction pour récupérer les services (retourne uniquement les données mockées)
export const fetchServices = async (categoryId = 'opar') => {
    return getMockServices(categoryId);
  };
  
  // Fonction des données mockées (services statiques)
  const getMockServices = (categoryId) => {
    const oparServices = [
      { id: 1, name: 'Cih Voyage !', logo: '/images/services/cih.png', description: 'Paiement de factures CIHVoyage' },
      { id: 2, name: 'Markoub.ma', logo: '/images/services/markoub.png', description: 'Paiement ticket d\'autocar' },
      { id: 3, name: 'Inyad', logo: '/images/services/inyad.png', description: 'Alimentation' },
      { id: 4, name: 'Inyad', logo: '/images/services/inyad.png', description: 'Paiement' },
      { id: 5, name: 'Sapress', logo: '/images/services/sapress.png', description: 'Frais de transport' },
      { id: 6, name: 'Sapress', logo: '/images/services/sapress.png', description: 'Centre remboursement RAMED' },
      { id: 7, name: 'FREE FIRE', logo: '/images/services/freefire.png', description: 'Recharge FREE FIRE' },
      { id: 8, name: 'Tadakir', logo: '/images/services/tadakir.png', description: 'Paiement billets SONABRES' },
      { id: 9, name: 'H', logo: '/images/services/h.png', description: 'Paiement de Service PARKING' },
      { id: 10, name: 'Wafacash', logo: '/images/services/wafacash.png', description: 'Paiement de facture Wafa' }
    ];
  
    switch (categoryId) {
      case 'opar':
        return oparServices;
      case 'eau':
        return [
          { id: 101, name: 'ONEE', logo: '/images/services/onee.png', description: 'Office National Electricité' },
          { id: 102, name: 'Redal', logo: '/images/services/redal.png', description: 'Eau et électricité Rabat' }
        ];
      case 'telephone':
        return [
          { id: 201, name: 'Maroc Telecom', logo: '/images/services/iam.png', description: 'Factures et recharges' },
          { id: 202, name: 'Orange', logo: '/images/services/orange.png', description: 'Factures et recharges' },
          { id: 203, name: 'Inwi', logo: '/images/services/inwi.png', description: 'Factures et recharges' }
        ];
      default:
        return [];
    }
  };
  