import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthLayout from "../components/Auth/AuthLayout";
import AuthForm from "../components/Auth/AuthForm";
import { login } from "../api/userService";
import { setCredentials } from "../features/auth/authSlice";
import riadLogo from "../assets/riad-logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login({ email, password });

      console.log(response);

     
      if (response.status === 201) {
      
        localStorage.setItem("user-email", response.email);
        
       
        navigate("/verifyOtp", { 
          state: { 
            message: "Un nouveau périphérique a été détecté. Veuillez vérifier votre email.",
            email: response.email 
          } 
        });
        return;
      }

  
      dispatch(setCredentials({
        user: response.user,
        token: response.token
      }));
      localStorage.setItem("token", response.token);
      localStorage.setItem("user-email", response.user.email);
      navigate("/dashboard"); 
    } catch (err) {
      console.error("Échec de connexion:", err);
      setError("Identifiant ou mot de passe incorrect.");
    }
  };

  const fields = [
    {
      label: "Email",
      type: "email",
      name: "email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      placeholder: "Email",
    },
    {
      label: "Mot de passe",
      type: "password",
      name: "password",
      value: password,
      onChange: (e) => setPassword(e.target.value),
      placeholder: "Mot de passe",
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
          Veuillez saisir votre identifiant et mot de passe pour vous connecter.
        </p>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <AuthForm fields={fields} onSubmit={handleSubmit} buttonText="Se connecter" />

      <div className="text-center mt-4">
        <p className="text-gray-600">
          Vous n'avez pas de compte?{" "}
          <a href="/register" className="text-[#2e3f6e] hover:underline">
            S'inscrire
          </a>
        </p>
        <button
          onClick={() => navigate("/requestPassword")} 
          className="text-[#2e3f6e] hover:underline"
        >
          Mot de passe oublié ?
        </button>
      </div>
    </AuthLayout>
  );
}