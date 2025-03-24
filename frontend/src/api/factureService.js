import axios from 'axios';
import { jsPDF } from 'jspdf';

let autoTableModule;
try {
 
         autoTableModule = require('jspdf-autotable');
} catch (e) {
  console.warn("jspdf-autotable not available, will use fallback table method");
}

const API_URL = 'http://localhost:3000/api';


export const generateUtilityFacture = async (service, contractNumber, fournisseurId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User not authenticated');
    }

    const amount = Math.floor(Math.random() * 900) + 100; 
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); 

    const response = await axios.post(
      `${API_URL}/invoices/generate`,
      {
        fournisseurId: fournisseurId,
        amount,
        dueDate: dueDate.toISOString(),
        contractNumber,
        serviceType: 'Utility',
        serviceName: service.name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Réponse API (Facture générée) :', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la génération de la facture:', error);
    throw error;
  }
};


export const generateRechargeFacture = async (service, cardNumber, fournisseurId, amount) => {
                            try {
                              const token = localStorage.getItem('token');
                              if (!token) {
                                throw new Error('User not authenticated');
                              }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); 

    const response = await axios.post(
      `${API_URL}/invoices/generate`,
      {
        fournisseurId: fournisseurId,
        amount,
        dueDate: dueDate.toISOString(),
        contractNumber: cardNumber,
        serviceType: 'Recharge',
        serviceName: service.name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Réponse API (Recharge générée) :', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la génération de la recharge:', error);
    throw error;
  }
};


export const getUserFactures = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await axios.get(`${API_URL}/invoices/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
    throw error;
  }
};


const generateBasicPDF = (facture, fournisseur, user) => {

  const doc = new jsPDF();
  

  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('FACTURE', 105, 20, { align: 'center' });
  
 
  doc.setFontSize(16);



  doc.text('FACTURA', 20, 20);
  
 
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);
  

  doc.setFillColor(240, 240, 240);
  doc.rect(130, 30, 60, 25, 'F');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text('DÉTAILS DE LA FACTURE', 160, 35, { align: 'center' });
  doc.setTextColor(40, 40, 40);
  doc.text(`N° ${facture.contractNumber}`, 160, 42, { align: 'center' });
  const createdDate = facture.createdAt ? new Date(facture.createdAt) : new Date();
  doc.text(`Date: ${createdDate.toLocaleDateString()}`, 160, 48, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text('FACTURÉ À:', 20, 35);
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(`${user?.firstname || ''} ${user?.lastname || ''}`, 20, 42);
  doc.text(`Email: ${user?.email || ''}`, 20, 48);
  doc.text(`Tél: ${user?.telephone || ''}`, 20, 54);
  

  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text('FOURNISSEUR:', 75, 35);
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(`${fournisseur?.name || 'Fournisseur'}`, 75, 42);
  

  doc.setFillColor(66, 66, 110);
  doc.setTextColor(255, 255, 255);
  doc.rect(20, 65, 170, 10, 'F');
  doc.text('Description', 30, 71);
  doc.text('Date limite', 95, 71);
  doc.text('Montant', 160, 71);

  doc.setTextColor(0, 0, 0);
  doc.text(`Service ${fournisseur?.name || ''}`, 30, 81);
  const dueDate = facture.dueDate ? new Date(facture.dueDate) : new Date();
  doc.text(dueDate.toLocaleDateString(), 95, 81);
  doc.text(`${facture.amount} MAD`, 160, 81);
  

  doc.setFillColor(240, 240, 240);
  doc.rect(20, 85, 170, 10, 'F');
  doc.text('Total', 95, 91);
  doc.text(`${facture.amount} MAD`, 160, 91);
  
  
  doc.setFontSize(12);
  if (facture.isPaid) {
    doc.setTextColor(0, 128, 0);
    doc.text('PAYÉ', 105, 120, { align: 'center' });
  } else {
    doc.setTextColor(220, 53, 69);
    doc.text('À PAYER', 105, 120, { align: 'center' });
  }
  

  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Factura - Powered by YCD © 2025', 105, 285, { align: 'center' });
  
  return doc;
};


const generatePDF = (facture, fournisseur, user) => {

  const doc = new jsPDF();
  

  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('FACTURE', 105, 20, { align: 'center' });
 
  doc.setFontSize(16);
  doc.text('FACTURA', 20, 20);
  

  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(20, 25, 190, 25);

  doc.setFillColor(240, 240, 240);
  doc.rect(130, 30, 60, 25, 'F');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text('DÉTAILS DE LA FACTURE', 160, 35, { align: 'center' });
  doc.setTextColor(40, 40, 40);
  doc.text(`N° ${facture.contractNumber}`, 160, 42, { align: 'center' });
  const createdDate = facture.createdAt ? new Date(facture.createdAt) : new Date();
  doc.text(`Date: ${createdDate.toLocaleDateString()}`, 160, 48, { align: 'center' });
  

  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text('FACTURÉ À:', 20, 35);
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(`${user?.firstname || ''} ${user?.lastname || ''}`, 20, 42);
  doc.text(`Email: ${user?.email || ''}`, 20, 48);
  doc.text(`Tél: ${user?.telephone || ''}`, 20, 54);
  

  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text('FOURNISSEUR:', 75, 35);
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text(`${fournisseur?.name || 'Fournisseur'}`, 75, 42);
  

  if (typeof doc.autoTable === 'function') {
   
                      doc.autoTable({
                        startY: 65,
                        head: [['Description', 'Date limite', 'Montant']],
                        body: [
                          [
                            `Service ${fournisseur?.name || ''}`, 
                            new Date(facture.dueDate || new Date()).toLocaleDateString(),
                            `${facture.amount} MAD`
                          ],
                        ],
                        foot: [['', 'Total', `${facture.amount} MAD`]],
                        theme: 'grid',
                        headStyles: { 
                          fillColor: [66, 66, 110],
                          textColor: [255, 255, 255],
                          fontStyle: 'bold'
                        },
                        footStyles: { 
                          fillColor: [240, 240, 240],
                          textColor: [0, 0, 0],
                          fontStyle: 'bold'
                        }
                      });
  } else {
  
    doc.setFillColor(66, 66, 110);
    doc.setTextColor(255, 255, 255);
    doc.rect(20, 65, 170, 10, 'F');
    doc.text('Description', 30, 71);
    doc.text('Date limite', 95, 71);
    doc.text('Montant', 160, 71);
    
  
    doc.setTextColor(0, 0, 0);
    doc.text(`Service ${fournisseur?.name || ''}`, 30, 81);
    const dueDate = facture.dueDate ? new Date(facture.dueDate) : new Date();
    doc.text(dueDate.toLocaleDateString(), 95, 81);
    doc.text(`${facture.amount} MAD`, 160, 81);
    
 
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 85, 170, 10, 'F');
    doc.text('Total', 95, 91);
    doc.text(`${facture.amount} MAD`, 160, 91);
  }

  doc.setFontSize(12);
  if (facture.isPaid) {
    doc.setTextColor(0, 128, 0);
    doc.text('PAYÉ', 105, 120, { align: 'center' });
  } else {
    doc.setTextColor(220, 53, 69);
    doc.text('À PAYER', 105, 120, { align: 'center' });
  }

  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Factura - Powered by YCD © 2025', 105, 285, { align: 'center' });
  
  return doc;
};


export const downloadPDF = async (facture, fournisseur, user) => {
  try {
   
    let doc;
    try {
      doc = generatePDF(facture, fournisseur, user);
    } catch (e) {
      console.warn('Failed to generate PDF with autoTable, falling back to basic PDF', e);
    
      doc = generateBasicPDF(facture, fournisseur, user);
    }
    
    doc.save(`facture-${facture.contractNumber}.pdf`);
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw error;
  }
};