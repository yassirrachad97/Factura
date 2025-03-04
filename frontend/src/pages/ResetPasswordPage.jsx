import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/Auth/AuthLayout";
import AuthForm from "../components/Auth/AuthForm";
import { resetPassword } from "../api/userService";
import riadLogo from "../assets/riad-logo.png";

export default function ResetPasswordPage() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const email = localStorage.getItem("reset-email"); 
    if (!email) {
      setError("Aucun email trouvé. Veuillez réessayer.");
      return;
    }

    try {
      const response = await resetPassword({ email, otp, newPassword });
      console.log(response);
      if (response === "Mot de passe réinitialisé avec succès") {
        setSuccessMessage("Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.");
        localStorage.removeItem("reset-email"); 
        setTimeout(() => {
          navigate("/"); 
        }, 2000);
      } else {
        setError("Échec de la réinitialisation du mot de passe.");
      }
    } catch (err) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", err);
      setError("Une erreur s'est produite lors de la réinitialisation du mot de passe.");
    }
  };

  const fields = [
    {
      label: "Code OTP",
      type: "text",
      name: "otp",
      value: otp,
      onChange: (e) => setOtp(e.target.value),
      placeholder: "Entrez le code OTP",
    },
    {
      label: "Nouveau mot de passe",
      type: "password",
      name: "newPassword",
      value: newPassword,
      onChange: (e) => setNewPassword(e.target.value),
      placeholder: "Entrez votre nouveau mot de passe",
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
          Veuillez entrer le code OTP envoyé à votre email et votre nouveau mot de passe.
        </p>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

      <AuthForm fields={fields} onSubmit={handleResetPassword} buttonText="Réinitialiser le mot de passe" />

      <div className="text-center mt-4">
        <button
          onClick={() => navigate("/requestPassword")}
          className="text-[#2e3f6e] hover:underline"
        >
          Réessayer avec un autre email
        </button>
      </div>
    </AuthLayout>
  );
}