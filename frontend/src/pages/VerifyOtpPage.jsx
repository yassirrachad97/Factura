import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/Auth/AuthLayout";
import AuthForm from "../components/Auth/AuthForm";
import { verifyOtp } from "../api/userService";
import riadLogo from "../assets/riad-logo.png";


export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = localStorage.getItem("user-email");
    console.log("Email récupéré:", email);
    console.log("OTP saisi:", otp);
    try {
     
        const response = await verifyOtp (email, otp);

      if (response.message === "OTP validé avec succès") {
        localStorage.removeItem("user-email");
        navigate("/dashboard");
      } else {
        localStorage.removeItem("user-email");
        setError("Code OTP invalide ou expiré.");
        navigate("/");
      }
    } catch (err) {
      console.error("Erreur lors de la vérification OTP:", err);
      setError("Échec de la vérification du code.");
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

      <AuthForm fields={fields} onSubmit={handleSubmit} buttonText="Vérifier" />
    </AuthLayout>
  );
}
