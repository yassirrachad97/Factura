import React, { useEffect, useState } from 'react';
import { getUserFactures, downloadPDF } from '../../api/factureService';
import { toast } from 'react-toastify';

const PaidInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const data = await getUserFactures(); 
        console.log("API Response:", data); 
        const paidInvoices = data.filter(invoice => invoice.isPaid);
        setInvoices(paidInvoices);
        setFilteredInvoices(paidInvoices);
      } catch (error) {
        toast.error('Erreur lors du chargement des factures');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchInvoices();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredInvoices(invoices);
    } else {
        const filtered = invoices.filter(invoice =>
            invoice.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (invoice.fournisseur && invoice.fournisseur.name.toLowerCase().includes(searchTerm.toLowerCase()))
          );
      setFilteredInvoices(filtered);
    }
  }, [searchTerm, invoices]);

  const handleDownload = async (invoice) => {
    try {
      await downloadPDF(invoice, invoice.fournisseur, invoice.user);
    } catch (error) {
      toast.error('Erreur lors du téléchargement de la facture');
      console.error(error);
    }
  };

  const handleDetailsClick = (invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-8">Chargement des factures...</div>;
    }

    if (invoices.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">Vous n'avez pas encore effectué de factures payées.</p>
        </div>
      );
    }

    if (filteredInvoices.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">Aucune facture ne correspond à votre recherche.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Numéro de contrat
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Fournisseur
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date de paiement
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                  {invoice.contractNumber}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                {invoice.fournisseurId?.name || 'Fournisseur inconnu'}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                  <button
                    onClick={() => handleDetailsClick(invoice)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4">
          <h2 className="text-xl font-bold">transactions</h2>
          <p className="text-blue-100">Tableau de Bord transactions</p>
        </div>
      {invoices.length > 0 && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher par numéro de contrat ou fournisseur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
      {renderContent()}

      {showModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl mx-4">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Détails de la facture
              </h2>
              <p className="text-gray-600">
                N° {selectedInvoice.contractNumber}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Service</span>
                <span className="font-medium">
  {selectedInvoice.fournisseurId?.name || 'Fournisseur inconnu'}
</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Numéro de contrat</span>
                <span className="font-medium">{selectedInvoice.contractNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date d'émission</span>
                <span className="font-medium">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date limite de paiement</span>
                <span className="font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</span>
              </div>

              <div className="border-t border-b py-4">
                {selectedInvoice.details?.map((detail, index) => (
                  <div key={index} className="flex justify-between mb-2">
                    <span className="text-gray-600">{detail?.description}</span>
                    <span className="font-medium">{detail?.amount} MAD</span>
                  </div>
                ))}
                <div className="flex justify-between mt-4 pt-4 border-t">
                  <span className="text-lg font-semibold">Total à payer</span>
                  <span className="text-lg font-bold text-blue-600">
                    {selectedInvoice.amount} MAD
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleDownload(selectedInvoice)}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Télécharger PDF
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaidInvoices;