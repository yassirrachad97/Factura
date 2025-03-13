// services/factureService.js
import axiosInstance from './axiosInstance';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Génère une facture pour un service standard (utilitaire)
 * @param {Object} serviceData - Données du service
 * @param {string} contractNumber - Numéro de contrat
 * @param {string} fournisseurId - ID du fournisseur
 * @returns {Promise} - Promesse contenant la facture générée
 */
export const generateUtilityFacture = async (serviceData, contractNumber, fournisseurId) => {
    try {
      const response = await axiosInstance.post('/invoices/generate', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        fournisseurId: fournisseurId, 
        amount: Math.floor(Math.random() * (1000 - 100) + 100),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
        contractNumber,
        serviceType: 'utility',
        serviceName: serviceData.name,
      });
  
      toast.success('Facture générée avec succès!');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la génération de la facture utilitaire:', error);
      toast.error('Erreur lors de la génération de la facture');
      throw error;
    }
  };
/**
 * Génère une facture pour un service de recharge
 * @param {Object} serviceData - Données du service
 * @param {string} cardNumber - Numéro de carte
 * @param {string} fournisseurId - ID du fournisseur
 * @param {number} amount - Montant de la recharge
 * @returns {Promise} - Promesse contenant la facture générée
 */
export const generateRechargeFacture = async (serviceData, cardNumber, fournisseurId, amount) => {
  // Calculer la date d'échéance (immédiate pour une recharge)
  const dueDate = new Date();
  
  // Données à envoyer au backend
  const factureData = {
    fournisseurId,
    amount,
    dueDate: dueDate.toISOString(),
    contractNumber: cardNumber, // Utiliser le numéro de carte comme numéro de contrat
    serviceType: 'recharge',
    serviceName: serviceData.name
  };
  
  try {
    // Appel API pour générer la facture côté serveur
    const response = await generateFacture(factureData);
    
    // Enrichir la réponse avec des détails supplémentaires pour l'affichage
    return {
      ...response,
      date: new Date().toLocaleDateString(),
      details: [
        { description: 'Montant de recharge', amount: amount.toFixed(2) },
        { description: 'Frais de service', amount: '0.00' }
      ],
      type: 'recharge'
    };
  } catch (error) {
    console.error('Erreur lors de la génération de la facture de recharge:', error);
    throw error;
  }
};

/**
 * Fonction principale pour générer une facture via l'API
 * @param {Object} factureData - Données de la facture
 * @returns {Promise} - Promesse contenant la réponse de l'API
 */
export const generateFacture = (factureData) => {
  const token = localStorage.getItem('token');
  
  return axiosInstance.post('/invoices/generate', factureData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => {
    toast.success('Facture générée avec succès!');
    return res.data;
  })
  .catch(error => {
    console.error('Erreur lors de la génération de la facture:', error);
    console.error('Réponse du serveur:', error.response?.data);
    toast.error('Erreur lors de la génération de la facture');
    throw error;
  });
};

/**
 * Récupère toutes les factures de l'utilisateur connecté
 * @returns {Promise} - Promesse contenant la liste des factures
 */
export const getUserFactures = () => 
  axiosInstance.get('/invoices/user').then(res => res.data);

/**
 * Récupère une facture spécifique par son ID
 * @param {string} id - ID de la facture
 * @returns {Promise} - Promesse contenant les détails de la facture
 */
export const getFacture = (id) => 
  axiosInstance.get(`/invoices/${id}`).then(res => res.data);

/**
 * Marque une facture comme payée
 * @param {string} id - ID de la facture
 * @returns {Promise} - Promesse contenant la facture mise à jour
 */
export const markFactureAsPaid = (id) => 
  axiosInstance.patch(`/invoices/${id}/pay`, {}, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(res => {
    toast.success('Facture marquée comme payée!');
    return res.data;
  })
  .catch(error => {
    toast.error('Erreur lors du paiement de la facture');
    throw error;
  });

/**
 * Génère un document PDF pour une facture
 * @param {Object} facture - Données de la facture
 * @param {Object} fournisseur - Données du fournisseur
 * @param {Object} user - Données de l'utilisateur
 * @returns {jsPDF} - Document PDF généré
 */
export const generatePDF = (facture, fournisseur, user) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // En-tête
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text("FACTURE", pageWidth / 2, 20, { align: 'center' });
  
  // Informations de la facture
  doc.setFontSize(10);
  doc.text(`N° Facture: ${facture.contractNumber}`, 14, 30);
  doc.text(`Date d'émission: ${new Date().toLocaleDateString('fr-FR')}`, 14, 35);
  doc.text(`Date d'échéance: ${new Date(facture.dueDate).toLocaleDateString('fr-FR')}`, 14, 40);
  
  // Informations du fournisseur
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("Fournisseur", 14, 55);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(`${fournisseur.name}`, 14, 60);
  
  // Informations du client
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("Client", pageWidth - 90, 55);
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  doc.text(`${user.firstName} ${user.lastName}`, pageWidth - 90, 60);
  doc.text(`Tél: ${user.phone || ''}`, pageWidth - 90, 70);
  
  // Tableau des détails
  doc.autoTable({
    startY: 85,
    head: [['Description', 'Montant HT']],
    body: [
      [`Services de ${fournisseur.name}`, `${facture.amount.toFixed(2)} MAD`],
    ],
    foot: [
      ['Total HT', `${facture.amount.toFixed(2)} MAD`],
      ['TVA (20%)', `${(facture.amount * 0.2).toFixed(2)} MAD`],
      ['Total TTC', `${(facture.amount * 1.2).toFixed(2)} MAD`]
    ],
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    footStyles: { fillColor: [220, 220, 220], textColor: 0, fontStyle: 'bold' }
  });
  
  // Statut de paiement
  const yPos = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  if (facture.isPaid) {
    doc.setTextColor(0, 128, 0);
    doc.text("PAYÉE", pageWidth / 2, yPos, { align: 'center' });
  } else {
    doc.setTextColor(220, 50, 50);
    doc.text("EN ATTENTE DE PAIEMENT", pageWidth / 2, yPos, { align: 'center' });
  }
  
  // Coordonnées bancaires
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text("Coordonnées bancaires:", 14, yPos + 10);
  doc.text("IBAN: FR76 XXXX XXXX XXXX XXXX XXXX XXX", 14, yPos + 15);
  doc.text("BIC: XXXXXXXX", 14, yPos + 20);
  
  // Pied de page
  doc.setFontSize(8);
  doc.text("Merci pour votre confiance. Cette facture est payable dans les délais indiqués ci-dessus.", 14, yPos + 30);
  
  return doc;
};

/**
 * Télécharge une facture au format PDF
 * @param {Object} facture - Données de la facture
 * @param {Object} fournisseur - Données du fournisseur
 * @param {Object} user - Données de l'utilisateur
 */
export const downloadPDF = async (facture, fournisseur, user) => {
  try {
    const doc = generatePDF(facture, fournisseur, user);
    doc.save(`Facture_${facture.contractNumber}.pdf`);
    toast.success('Facture téléchargée avec succès!');
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    toast.error('Erreur lors du téléchargement de la facture');
  }
};