// C:\Users\Youcode\Desktop\Factura\frontend\src\components\Services\ServiceGrid.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ServiceCard from './ServiceCard';

const RECHARGE_AMOUNTS = [100, 200, 300, 500, 1000]; // Predefined recharge amounts

export default function ServiceGrid({ services, isLoading, searchTerm }) {
  const [selectedService, setSelectedService] = useState(null);
  const [contractNumber, setContractNumber] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFactureModal, setShowFactureModal] = useState(false);
  const [facture, setFacture] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setContractNumber('');
    setSelectedAmount(null);
    setShowModal(true);
  };

  // Check if service is rechargeable based on its group
  const isRechargeService = (service) => {
    return service?.group?.toUpperCase() === "AUTRES SERVICES";
  };

  const generateUtilityFacture = () => {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const currentDate = new Date();
    const randomAmount = Math.floor(Math.random() * (1000 - 100) + 100);
    const randomMonth = months[Math.floor(Math.random() * months.length)];
    
    return {
      type: 'utility',
      factureNumber: 'FACT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: currentDate.toLocaleDateString(),
      month: randomMonth,
      amount: randomAmount.toFixed(2),
      dueDate: new Date(currentDate.setDate(currentDate.getDate() + 30)).toLocaleDateString(),
      details: [
        { description: 'Consommation', amount: (randomAmount * 0.8).toFixed(2) },
        { description: 'Taxes', amount: (randomAmount * 0.2).toFixed(2) }
      ]
    };
  };

  const generateRechargeFacture = (amount) => {
    const currentDate = new Date();
    
    return {
      type: 'recharge',
      factureNumber: 'RECH-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: currentDate.toLocaleDateString(),
      amount: amount.toFixed(2),
      details: [
        { description: 'Montant de recharge', amount: amount.toFixed(2) },
        { description: 'Frais de service', amount: '0.00' }
      ]
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contractNumber.trim()) {
      toast.error('Veuillez entrer un numéro de contrat');
      return;
    }

    // Check service type and handle accordingly
    if (isRechargeService(selectedService)) {
      console.log("Recharge service detected:", selectedService.name);
      setShowModal(false);
      setShowFactureModal(true);
    } else {
      console.log("Utility service detected:", selectedService.name);
      const newFacture = generateUtilityFacture();
      setFacture(newFacture);
      setShowModal(false);
      setShowFactureModal(true);
    }
    setContractNumber('');
  };

  const handleAmountSelection = (amount) => {
    setSelectedAmount(amount);
    const newFacture = generateRechargeFacture(amount);
    setFacture(newFacture);
  };

  const handlePayment = () => {
    if (isRechargeService(selectedService) && !selectedAmount) {
      toast.error('Veuillez sélectionner un montant');
      return;
    }
    
    // Log payment details
    console.log('Payment for service:', {
      serviceName: selectedService?.name,
      serviceGroup: selectedService?.group,
      isRecharge: isRechargeService(selectedService),
      amount: selectedAmount || facture?.amount,
      contractNumber: contractNumber
    });

    toast.success('Paiement effectué avec succès');
    setShowFactureModal(false);
    setSelectedAmount(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2e3f6e]"></div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun service disponible pour cette catégorie.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => handleServiceClick(service)}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 
                     transform hover:-translate-y-1 cursor-pointer border border-gray-100 hover:border-blue-200"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {service.logo ? (
                    <img
                      src={service.logo}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">🏢</span>
                  )}
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {service.description || "Aucune description disponible"}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  className="w-full text-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Entrer le numéro de contrat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contract Number Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {selectedService?.name}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="contractNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  {isRechargeService(selectedService) ? "Numéro de carte" : "Numéro de contrat"}
                </label>
                <input
                  type="text"
                  id="contractNumber"
                  value={contractNumber}
                  onChange={(e) => setContractNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={isRechargeService(selectedService) ? "Entrez votre numéro de carte" : "Entrez votre numéro de contrat"}
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Facture Modal */}
      {showFactureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl mx-4">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {isRechargeService(selectedService) ? 'Recharge' : 'Facture'}
              </h2>
              <p className="text-gray-600">
                {facture ? `N° ${facture.factureNumber}` : 'Sélectionnez un montant'}
              </p>
            </div>

            {isRechargeService(selectedService) ? (
              // Recharge service layout
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Sélectionnez le montant de recharge
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {RECHARGE_AMOUNTS.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handleAmountSelection(amount)}
                        className={`p-4 rounded-lg border-2 transition-all
                          ${selectedAmount === amount 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 hover:border-blue-200'}`}
                      >
                        <div className="text-lg font-bold">{amount} MAD</div>
                      </button>
                    ))}
                  </div>
                </div>

                {facture && (
                  <div className="border-t border-b py-4 mb-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Numéro de carte</span>
                        <span className="font-medium">{contractNumber}</span>
                      </div>
                      {facture.details.map((detail, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-600">{detail.description}</span>
                          <span className="font-medium">{detail.amount} MAD</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-4 border-t">
                        <span className="text-lg font-semibold">Total à payer</span>
                        <span className="text-lg font-bold text-blue-600">
                          {facture.amount} MAD
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Utility bill layout
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Numéro de contrat</span>
                  <span className="font-medium">{contractNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Période</span>
                  <span className="font-medium">{facture.month}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date d'émission</span>
                  <span className="font-medium">{facture.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date limite de paiement</span>
                  <span className="font-medium">{facture.dueDate}</span>
                </div>

                <div className="border-t border-b py-4">
                  {facture.details.map((detail, index) => (
                    <div key={index} className="flex justify-between mb-2">
                      <span className="text-gray-600">{detail.description}</span>
                      <span className="font-medium">{detail.amount} MAD</span>
                    </div>
                  ))}
                  <div className="flex justify-between mt-4 pt-4 border-t">
                    <span className="text-lg font-semibold">Total à payer</span>
                    <span className="text-lg font-bold text-blue-600">
                      {facture.amount} MAD
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowFactureModal(false);
                  setSelectedAmount(null);
                }}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handlePayment}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Payer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}