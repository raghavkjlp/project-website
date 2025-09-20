const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateInvoice(donation, user) {
  const uploads = process.env.UPLOAD_DIR || 'uploads';
  if (!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive: true });

  const filePath = path.join(uploads, `receipt_${donation._id}.pdf`);
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text('Donation Receipt', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Receipt ID: ${donation.receiptId || donation._id}`);
  doc.text(`Donor: ${user.name || 'Guest'}`);
  doc.text(`Email: ${user.email || ''}`);
  doc.text(`Amount: ₹${donation.amount}`);
  doc.text(`Date: ${new Date(donation.createdAt || Date.now()).toLocaleString()}`);

  doc.moveDown();
  doc.text('Thank you for your support!', { align: 'center' });

  doc.end();
  return filePath;
}

module.exports = generateInvoice;
