import { useState, useEffect } from "react";
import { calculateStatistics } from "../../api/statisticsService";
import {  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

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

        // Vérifiez que les données sont bien définies
        if (data) {
          setStats(data);
        } else {
          setError("Aucune donnée reçue de l'API");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques:", err);
        setError("Erreur lors du chargement des statistiques");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

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

  // Vérifiez que les données sont bien définies avant de les utiliser
  const users = stats.users || [];
  const fournisseurs = stats.fournisseurs || [];
  const categories = stats.categories || [];
  const factures = stats.factures || [];
  const monthlyRevenue = stats.monthlyRevenue || [];

  return (

    
    <div className="p-4 md:p-6">
         <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4">
          <h2 className="text-xl font-bold">Statistique</h2>
          <p className="text-blue-100">Tableau de Bord Statistique</p>
        </div>
     
      
      {/* Cards des statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
          <h3 className="text-sm text-gray-500 font-medium">Total Utilisateurs</h3>
          <p className="text-2xl font-bold">{users.length}</p>
          <div className="flex items-center mt-2 text-xs text-gray-600">
            <span className="mr-1">🧑‍💼</span>
            <span>Actifs sur la plateforme</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
          <h3 className="text-sm text-gray-500 font-medium">Total Fournisseurs</h3>
          <p className="text-2xl font-bold">{fournisseurs.length}</p>
          <div className="flex items-center mt-2 text-xs text-gray-600">
            <span className="mr-1">🏭</span>
            <span>Partenaires enregistrés</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
          <h3 className="text-sm text-gray-500 font-medium">Total Catégories</h3>
          <p className="text-2xl font-bold">{categories.length}</p>
          <div className="flex items-center mt-2 text-xs text-gray-600">
            <span className="mr-1">🗂️</span>
            <span>Disponibles sur la plateforme</span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
          <h3 className="text-sm text-gray-500 font-medium">Total Factures</h3>
          <p className="text-2xl font-bold">{stats.totalFactures || factures.length}</p>
          <div className="flex items-center mt-2 text-xs text-gray-600">
            <span className="mr-1">📝</span>
            <span>Générées sur la plateforme</span>
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
                data={monthlyRevenue}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenus" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}