# 🌾 AgroTrade

**AgroTrade** is a modern agri-commerce platform built to empower Indian farmers, sellers, and buyers. The platform supports direct crop trading, real-time buyer-seller chat, product management, and multilingual support — all through a seamless web experience.

---

## 🚀 Features

### 🏠 Homepage
- Logo and branding  
- Location selector  
- Search bar  
- Language selector (Bengali, Hindi, Tamil, etc.)  
- “Become a Seller” page with benefits & onboarding  
- Rotating banner with CTA  
- Sections for:  
  - New Products  
  - Popular Products  
  - Featured Products  
- Header Login with:  
  - Account management  
  - Wishlist  
  - Real-time chat  

### 🧑‍🌾 Seller Portal
- Seller login via Clerk  
- Add product with image and details  
- Product list with live/unlive toggle  
- Order management with buyer addresses  
- Real-time chat for bulk order negotiation  

---

## 🛠 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [React.js](https://reactjs.org/)  
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)  
- **Authentication**: [Clerk](https://clerk.dev/)  
- **Real-time Communication**: [Socket.IO](https://socket.io/)  
- **Database**: [MongoDB](https://www.mongodb.com/)  
- **Backend**: Native [Node.js APIs](https://nodejs.org/)  
- **Deployment**: [Vercel](https://vercel.com/)

---


## 💻 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/agrotrade.git
cd agrotrade
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root folder and add:

```env
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
MONGODB_URI=your_mongodb_connection_string
```

> Make sure you’ve set up your MongoDB cluster and Clerk application properly.

### 4. Run Development Server

```bash
npm run dev
npm run socket
```

Open your browser at: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Live Demo

🚧 Coming soon…

---


