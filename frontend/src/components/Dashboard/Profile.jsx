import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getUserProfile } from '../../api/userService';

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    telephone: '',
    email: ''
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getUserProfile();
        setUserData(data);
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4">
          <h2 className="text-xl font-bold">Profile Utilisateur</h2>
          <p className="text-blue-100">Vos informations personnelles</p>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
              {userData?.firstname?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-gray-800">{userData.firstname} {userData.lastname}</h3>
              <p className="text-gray-500">{userData.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-t border-gray-200 pt-4">
              <dl className="divide-y divide-gray-200">
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Prénom</dt>
                  <dd className="text-sm text-gray-900">{userData.firstname}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Nom</dt>
                  <dd className="text-sm text-gray-900">{userData.lastname}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Nom d'utilisateur</dt>
                  <dd className="text-sm text-gray-900">{userData.username}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">{userData.email}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                  <dd className="text-sm text-gray-900">{userData.telephone || 'Non renseigné'}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 