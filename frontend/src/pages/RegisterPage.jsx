import { useState } from 'react';
import AuthLayout from '../components/Auth/AuthLayout';
import AuthForm from '../components/Auth/AuthForm';
import { register } from '../api/userService';
import riadLogo from '../assets/riad-logo.png';

export default function RegisterPage() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
   
    try {
      const response = await register({ firstname, lastname, username, telephone, email, password });
      console.log('Registration successful:', response);
      setSuccess('Inscription réussie! Redirection vers la page de connexion...');
      // Redirection après 2 secondes
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.message || 'Échec de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    {
      label: 'Prénom',
      type: 'text',
      name: 'firstname',
      value: firstname,
      onChange: (e) => setFirstname(e.target.value),
      placeholder: 'Prénom',
      required: true
    },
    {
      label: 'Nom',
      type: 'text',
      name: 'lastname',
      value: lastname,
      onChange: (e) => setLastname(e.target.value),
      placeholder: 'Nom',
      required: true
    },
    {
      label: 'Nom d\'utilisateur',
      type: 'text',
      name: 'username',
      value: username,
      onChange: (e) => setUsername(e.target.value),
      placeholder: 'Nom d\'utilisateur',
      required: true
    },
    {
      label: 'Téléphone',
      type: 'tel',
      name: 'telephone',
      value: telephone,
      onChange: (e) => setTelephone(e.target.value),
      placeholder: 'Téléphone',
      required: true
    },
    {
      label: 'Email',
      type: 'email',
      name: 'email',
      value: email,
      onChange: (e) => setEmail(e.target.value),
      placeholder: 'Email',
      required: true
    },
    {
      label: 'Mot de passe',
      type: 'password',
      name: 'password',
      value: password,
      onChange: (e) => setPassword(e.target.value),
      placeholder: 'Mot de passe',
      showPassword: showPassword,
      setShowPassword: setShowPassword,
      required: true
    },
  ];

  return (
    <AuthLayout>
      <div className="flex justify-center mb-6">
        <div className="text-center">
          <div className="flex justify-center">
            <img src={riadLogo} alt="RIAD Logo" className="h-16 mb-2" />
          </div>
          <h1 className="text-3xl font-bold text-[#2e3f6e]">FACTURA</h1>
          <p className="text-sm text-gray-500">Powered by YCD</p>
        </div>
      </div>
      <div className="mb-8 text-center">
        <p className="text-gray-700">
          Veuillez remplir le formulaire ci-dessous pour créer un compte
        </p>
      </div>
      <AuthForm
        fields={fields}
        onSubmit={handleSubmit}
        buttonText="S'inscrire"
        isLoading={isLoading}
        error={error}
        success={success}
      />
      <div className="text-center mt-4">
        <p className="text-gray-600">
          Vous avez déjà un compte?{' '}
          <a href="/login" className="text-[#2e3f6e] hover:underline">
            Se connecter
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}