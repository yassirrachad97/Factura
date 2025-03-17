import { useState, useEffect } from "react";
import { calculateStatistics } from "../../api/statisticsService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

export default function StatistiquesAdmin() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    categories: [],
    fournisseurs: [],
    users: [],
    factures: [],
    totalRevenue: 0,
    totalFactures: 0,
    totalPaidFactures: 0,
    totalUnpaidFactures: 0,
    monthlyRevenue: []
  });

  // Couleurs pour les graphiques
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#FF6384'];

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await calculateStatistics();
        setStats(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques:", err);
        setError("Erreur lors du chargement des statistiques");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Fonction pour générer des statistiques côté client si l'API n'existe pas
  const generateStatsFromData = (categories, fournisseurs, users, factures) => {
    // Calcul du revenu total
    const totalRevenue = factures.reduce((sum, facture) => sum + facture.amount, 0);
    
    // Factures payées vs non payées
    const paidFactures = factures.filter(facture => facture.isPaid);
    const unpaidFactures = factures.filter(facture => !facture.isPaid);
    
    // Regrouper les factures par mois pour le graphique d'évolution
    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];
    const monthlyData = Array(12).fill(0).map((_, i) => ({
      name: monthNames[i],
      revenue: 0,
      count: 0
    }));
    
    factures.forEach(facture => {
      const date = new Date(facture.createdAt || facture.dueDate);
      const month = date.getMonth();
      monthlyData[month].revenue += facture.amount;
      monthlyData[month].count += 1;
    });

    // Distribution des fournisseurs par catégorie
    const fournisseursByCategory = {};
    fournisseurs.forEach(fournisseur => {
      if (fournisseur.category) {
        fournisseursByCategory[fournisseur.category] = (fournisseursByCategory[fournisseur.category] || 0) + 1;
      }
    });

    return {
      totalRevenue,
      totalFactures: factures.length,
      totalPaidFactures: paidFactures.length,
      totalUnpaidFactures: unpaidFactures.length,
      monthlyRevenue: monthlyData,
      fournisseursByCategory
    };
  };

  // Données pour le graphique circulaire des utilisateurs par rôle
  const prepareUserRoleData = () => {
    const roles = {};
    stats.users.forEach(user => {
      const role = user.role || 'user';
      roles[role] = (roles[role] || 0) + 1;
    });
    
    return Object.keys(roles).map(role => ({
      name: role === 'admin' ? 'Administrateurs' : 'Utilisateurs standards',
      value: roles[role]
    }));
  };

  // Données pour le graphique des fournisseurs par catégorie
  const prepareFournisseurCategoryData = () => {
    const categoryMap = {};
    stats.categories.forEach(cat => {
      categoryMap[cat._id] = cat.name;
    });
    
    const categoryStats = {};
    stats.fournisseurs.forEach(fournisseur => {
      const categoryId = fournisseur.category;
      const categoryName = categoryMap[categoryId] || 'Non classé';
      categoryStats[categoryName] = (categoryStats[categoryName] || 0) + 1;
    });
    
    return Object.keys(categoryStats).map(name => ({
      name,
      count: categoryStats[name]
    }));
  };

  // Données pour le graphique des factures payées/impayées
  const prepareInvoiceStatusData = () => {
    return [
      { name: 'Payées', value: stats.totalPaidFactures },
      { name: 'Non payées', value: stats.totalUnpaidFactures }
    ];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <h2 className="text-xl font-bold">Erreur</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Format monétaire pour les sommes
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(amount);
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de Bord Statistique</h1>
      
      {/* Cards des statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
          <h3 className="text-sm text-gray-500 font-medium">Total Utilisateurs</h3>
          <p className="text-2xl font-bold">{stats.users.length}</p>
          <div className="flex items-center mt-2 text-xs text-gray-600">
            <span className="mr-1">🧑‍💼</span>
            <span>Actifs sur la plateforme</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
          <h3 className="text-sm text-gray-500 font-medium">Total Fournisseurs</h3>
          <p className="text-2xl font-bold">{stats.fournisseurs.length}</p>
          <div className="flex items-center mt-2 text-xs text-gray-600">
            <span className="mr-1">🏭</span>
            <span>Partenaires enregistrés</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
          <h3 className="text-sm text-gray-500 font-medium">Total Catégories</h3>
          <p className="text-2xl font-bold">{stats.categories.length}</p>
          <div className="flex items-center mt-2 text-xs text-gray-600">
            <span className="mr-1">🗂️</span>
            <span>Disponibles sur la plateforme</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
          <h3 className="text-sm text-gray-500 font-medium">Total Factures</h3>
          <p className="text-2xl font-bold">{stats.totalFactures || stats.factures.length}</p>
          <div className="flex items-center mt-2 text-xs text-gray-600">
            <span className="mr-1">📝</span>
            <span>Générées sur la plateforme</span>
          </div>
        </div>
      </div>
      
      {/* Métriques financières */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-sm text-gray-500 font-medium">Revenu Total</h3>
          <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue || 0)}</p>
          <div className="flex items-center mt-2 text-xs text-gray-600">
            <span className="mr-1">💰</span>
            <span>Montant total facturé</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-sm text-gray-500 font-medium">Factures Payées</h3>
          <p className="text-2xl font-bold">
            {stats.totalPaidFactures || 0} ({stats.totalFactures ? Math.round((stats.totalPaidFactures / stats.totalFactures) * 100) : 0}%)
          </p>
          <div className="flex items-center mt-2 text-xs text-green-600">
            <span className="mr-1">✅</span>
            <span>Règlements complétés</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-sm text-gray-500 font-medium">Factures En Attente</h3>
          <p className="text-2xl font-bold">
            {stats.totalUnpaidFactures || 0} ({stats.totalFactures ? Math.round((stats.totalUnpaidFactures / stats.totalFactures) * 100) : 0}%)
          </p>
          <div className="flex items-center mt-2 text-xs text-red-600">
            <span className="mr-1">⏳</span>
            <span>En attente de paiement</span>
          </div>
        </div>
      </div>
      
      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Évolution des revenus mensuels */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-bold mb-4">Évolution des Revenus Mensuels</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stats.monthlyRevenue || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenus" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Distribution des factures par statut */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-bold mb-4">Statut des Factures</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareInvoiceStatusData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {prepareInvoiceStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#00C49F' : '#FF8042'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Distribution des utilisateurs par rôle */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-bold mb-4">Utilisateurs par Rôle</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareUserRoleData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {prepareUserRoleData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                                  </Pie>
                <Tooltip formatter={(value) => value} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Distribution des fournisseurs par catégorie */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <h3 className="text-lg font-bold mb-4">Fournisseurs par Catégorie</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={prepareFournisseurCategoryData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Nombre de fournisseurs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}