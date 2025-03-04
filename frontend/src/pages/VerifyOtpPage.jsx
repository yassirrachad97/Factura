import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/Auth/AuthLayout";
import AuthForm from "../components/Auth/AuthForm";
import { verifyOtp, resendOtp } from "../api/userService"; // Importez resendOtp
import riadLogo from "../assets/riad-logo.png";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const email = localStorage.getItem("user-email");
    if (!email) {
      setError("Aucun email trouvé. Veuillez réessayer.");
      return;
    }

    try {
      const response = await verifyOtp(email, otp);

      if (response.message === "OTP validé avec succès") {
        setSuccessMessage("OTP vérifié avec succès. Redirection...");
        setTimeout(() => {
          navigate("/dashboard"); 
        }, 2000);
      } else {
        setError("Code OTP invalide ou expiré.");
      }
    } catch (err) {
      console.error("Erreur lors de la vérification OTP:", err);
      setError("Échec de la vérification du code.");
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccessMessage("");

    const email = localStorage.getItem("user-email");
    if (!email) {
      setError("Aucun email trouvé. Veuillez réessayer.");
      return;
    }

    try {
      const response = await resendOtp(email);
      if (response.message === "OTP renvoyé avec succès") {
        setSuccessMessage("Un nouveau code OTP a été envoyé à votre email.");
      } else {
        setError("Échec de l'envoi du nouveau code OTP.");
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'OTP:", err);
      setError("Échec de l'envoi du nouveau code OTP.");
    }
  };

  const fields = [
    {
      label: "Code OTP",
      type: "text",
      name: "otp",
      value: otp,
      onChange: (e) => setOtp(e.target.value),
      placeholder: "Entrez votre code OTP",
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
        <p className="text-gray-700">Veuillez entrer le code OTP envoyé à votre email.</p>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

      <AuthForm fields={fields} onSubmit={handleSubmit} buttonText="Vérifier" />

      <div className="text-center mt-4">
        <button
          onClick={handleResendOtp}
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Renvoyer le code OTP
        </button>
      </div>
    </AuthLayout>
  );
}