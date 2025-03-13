import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { generateUtilityFacture, generateRechargeFacture, markFactureAsPaid, downloadPDF } from '../../api/factureService';
import ServiceCard from './ServiceCard';

const RECHARGE_AMOUNTS = [100, 200, 300, 500, 1000];

export default function ServiceGrid({ services, isLoading, searchTerm }) {
  const [selectedService, setSelectedService] = useState(null);
  const [contractNumber, setContractNumber] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFactureModal, setShowFactureModal] = useState(false);
  const [facture, setFacture] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);

  const handleServiceClick = (service) => {
    console.log('Selected Service:', service); // Log the selected service
    setSelectedService(service);
    setContractNumber('');
    setSelectedAmount(null);
    setShowModal(true);
  };

  const isRechargeService = (service) => {
    return service?.group?.toUpperCase() === "AUTRES SERVICES";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contractNumber.trim()) {
      toast.error('Veuillez entrer un numéro de contrat');
      return;
    }
  
    try {
      let newFacture;
      console.log('Sending request with:', {
        service: selectedService,
        contractNumber,
        fournisseurId: selectedService.id, 
      });
  
      if (isRechargeService(selectedService)) {
        newFacture = await generateRechargeFacture(
          selectedService,
          contractNumber,
          selectedService.id, 
          selectedAmount
        );
      } else {
        newFacture = await generateUtilityFacture(
          selectedService,
          contractNumber,
          selectedService.id // 🔥 Vérifiez que ce champ passe bien
        );
      }
  
      setFacture(newFacture);
      setShowModal(false);
      setShowFactureModal(true);
    } catch (error) {
      console.error(error.response?.data || error);
      toast.error('Erreur lors de la génération de la facture');
    }
  };
  

  const handleAmountSelection = (amount) => {
    setSelectedAmount(amount);
  };

  const handlePayment = async () => {
    if (isRechargeService(selectedService) && !selectedAmount) {
      toast.error('Veuillez sélectionner un montant');
      return;
    }

    try {
      // Marquer la facture comme payée
      await markFactureAsPaid(facture.id);
      toast.success('Paiement effectué avec succès');
      setShowFactureModal(false);
      setSelectedAmount(null);
    } catch (error) {
      toast.error('Erreur lors du paiement de la facture');
      console.error(error);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Télécharger la facture en PDF
      await downloadPDF(facture, selectedService.fournisseur, user); // Assurez-vous d'avoir les données du fournisseur et de l'utilisateur
      toast.success('Facture téléchargée avec succès!');
    } catch (error) {
      toast.error('Erreur lors du téléchargement de la facture');
      console.error(error);
    }
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
      {services?.map((service) => (
  <div key={service?.id} onClick={() => handleServiceClick(service)} className="cursor-pointer">
    <ServiceCard service={service} />
  </div>
))}

      </div>

   
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
                  {facture?.details?.map((detail, index) => (
                    <div key={index} className="flex justify-between mb-2">
                      <span className="text-gray-600">{detail?.description}</span>
                      <span className="font-medium">{detail?.amount} MAD</span>
                    </div>
                  ))}
                  <div className="flex justify-between mt-4 pt-4 border-t">
                    <span className="text-lg font-semibold">Total à payer</span>
                    <span className="text-lg font-bold text-blue-600">
                      {facture?.amount} MAD
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDownloadPDF}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Télécharger PDF
              </button>
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