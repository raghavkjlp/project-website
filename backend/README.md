# NGO Portal Backend (Updated with Payments & Receipts)
This project is a Node.js + Express backend for an NGO portal (students, donors, admin, verifier).
## Quick start
1. Copy `.env.example` to `.env` and edit values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start MongoDB (local or Atlas) and set MONGO_URI accordingly.
4. Create uploads folder (will be auto-created by invoice util, but ensure permissions):
   ```bash
   mkdir uploads
   ```
5. Start server:
   ```bash
   npm run dev
   ```
## New features in this version
- express-validator added for auth input validation.
- Stripe checkout session route: `POST /api/payment/create-checkout-session` (requires STRIPE_SECRET_KEY).
- PDF receipt generation (pdfkit) when donation created.
- Example webhook placeholder for Stripe (implement verification in production).
