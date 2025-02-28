import { useState } from 'react';
import AuthLayout from '../components/Auth/AuthLayout';
import AuthForm from '../components/Auth/AuthForm';
import { login } from '../api/userService';
import riadLogo from '../assets/riad-logo.png';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ identifier, password });
      console.log('Login successful:', response);
      
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const fields = [
    {
      label: 'Identifiant',
      type: 'text',
      name: 'identifier',
      value: identifier,
      onChange: (e) => setIdentifier(e.target.value),
      placeholder: 'Identifiant',
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
          Veuillez saisir votre identifiant et mot de passe pour se connecter
        </p>
      </div>

      <AuthForm 
        fields={fields} 
        onSubmit={handleSubmit} 
        buttonText="Se connecter" 
      />

      <div className="text-center mt-4">
        <a href="#" className="text-[#2e3f6e] hover:underline">
          Mot de passe oublié ?
        </a>
      </div>
    </AuthLayout>
  );
}