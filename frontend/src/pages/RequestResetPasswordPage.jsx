import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/Auth/AuthLayout";
import AuthForm from "../components/Auth/AuthForm";
import { resendOtp } from "../api/userService";
import riadLogo from "../assets/riad-logo.png";

export default function RequestResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await resendOtp(email);
      setSuccessMessage("Un code OTP a été envoyé à votre email.");
      localStorage.setItem("reset-email", email);
      setTimeout(() => {
        navigate("/reset-password");
      }, 2000);
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'OTP:", err);
      setError("Échec de l'envoi du code OTP.");
    }
  };

  const fields = [
    {
      label: "Email",
      type: "email",
      name: "email",
      value: email,
      onChange: (e) => setEmail(e.target.value),
      placeholder: "Entrez votre email",
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
          Veuillez saisir votre email pour réinitialiser votre mot de passe.
        </p>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-500 text-center mb-4">{successMessage}</p>
      )}

      <AuthForm
        fields={fields}
        onSubmit={handleSendOtp}
        buttonText="Envoyer le code OTP"
      />

      <div className="text-center mt-4">
        <button
          onClick={() => navigate("/")}
          className="text-[#2e3f6e] hover:underline"
        >
          Retour à la connexion
        </button>
      </div>
    </AuthLayout>
  );
}
