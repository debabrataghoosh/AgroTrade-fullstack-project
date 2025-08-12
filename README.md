# 🌾 AgroTrade

**AgroTrade** is a modern, production-ready agri-commerce platform built to empower Indian farmers, sellers, and buyers. The platform supports direct crop trading, real-time buyer-seller chat, secure checkout, product management, and multilingual support — all through a seamless web experience.

---

## 🚀 Features

### 🏠 Homepage
- **Modern UI/UX** with Tailwind CSS
- **Location selector** for regional product discovery
- **Advanced search** with category filtering
- **Language support** (Bengali, Hindi, Tamil, etc.)
- **"Become a Seller"** onboarding with benefits
- **Dynamic product sections**:
  - New Products
  - Popular Products  
  - Featured Products
- **User authentication** via Clerk
- **Wishlist management**
- **Real-time chat integration**

### 🧑‍🌾 Seller Portal
- **Secure authentication** via Clerk
- **Product management** with image uploads
- **Live/unlive toggle** for product visibility
- **Order management** with buyer addresses
- **Real-time chat** for bulk order negotiation
- **Sales analytics** and performance tracking

### 🛒 Buyer Experience
- **Product browsing** with advanced filters
- **Secure checkout** via Stripe integration
- **Real-time chat** with sellers
- **Order tracking** and history
- **Wishlist management**
- **Address management**

### 💬 Real-Time Communication
- **Instant messaging** between buyers and sellers
- **Product-specific chat rooms**
- **Real-time notifications**
- **Message history** and persistence
- **File sharing** capabilities

---

## 🛠 Tech Stack

### **Frontend & Backend**
- **Framework**: [Next.js 15.3.4](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) for modern design
- **State Management**: React Hooks with Context API

### **Authentication & Security**
- **Authentication**: [Clerk](https://clerk.dev/) for secure user management
- **Authorization**: Role-based access control (Buyer/Seller)
- **API Security**: Protected routes with middleware

### **Database & Backend**
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) with Mongoose ODM
- **Real-time**: [Socket.IO](https://socket.io/) for live communication
- **Payment**: [Stripe](https://stripe.com/) for secure transactions
- **File Storage**: Cloudinary for image management

### **Deployment & Infrastructure**
- **Frontend**: [Vercel](https://vercel.com/) for Next.js hosting
- **Socket Server**: [Render](https://render.com/) for real-time services
- **Database**: MongoDB Atlas cloud hosting
- **CDN**: Global content delivery network

---

## 🚀 Live Demo

### **Production URLs**
- **Main Application**: [https://agrotrade-ebrbvlkmi-debabrata-ghoshs-projects.vercel.app](https://agrotrade-ebrbvlkmi-debabrata-ghoshs-projects.vercel.app)
- **Socket Server**: [https://agrotrade-fullstack-project.onrender.com](https://agrotrade-fullstack-project.onrender.com)
- **GitHub Repository**: [https://github.com/debabrataghoosh/AgroTrade-fullstack-project](https://github.com/debabrataghoosh/AgroTrade-fullstack-project)

---

## 💻 Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/debabrataghoosh/AgroTrade-fullstack-project.git
cd AgroTrade-fullstack-project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root folder:

```env
# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# MongoDB Database
MONGODB_URI=your_mongodb_atlas_connection_string

# Stripe Payment
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 4. Database Setup

1. **MongoDB Atlas**: Create a cluster and get your connection string
2. **Collections**: The app will automatically create required collections
3. **Indexes**: Database indexes are automatically created for performance

### 5. Run Development Servers

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Socket Server (for real-time features)
npm run socket

# Terminal 3: Run both (recommended)
npm run dev:all
```

Open your browser at: [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deployment

### **Frontend (Vercel)**
1. **Connect GitHub** repository to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Automatic deployment** on every push to main branch

### **Socket Server (Render)**
1. **Create Render account** (100% FREE FOREVER)
2. **Connect GitHub** repository
3. **Set root directory** to `socket-server`
4. **Deploy** with automatic HTTPS

### **Database (MongoDB Atlas)**
1. **Create cluster** in MongoDB Atlas
2. **Set up network access** (IP whitelist or 0.0.0.0/0)
3. **Create database user** with read/write permissions
4. **Get connection string** and add to environment variables

---

## 🔧 Project Structure

```
AgroTrade/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── components/        # Reusable components
│   │   ├── dashboard/         # Seller dashboard
│   │   ├── products/          # Product pages
│   │   ├── chat/              # Real-time chat
│   │   └── seller/            # Seller portal
│   ├── lib/
│   │   ├── models/            # MongoDB schemas
│   │   └── mongodb.ts         # Database connection
│   └── middleware.ts          # Route protection
├── socket-server/              # Real-time communication server
├── public/                     # Static assets
└── package.json               # Dependencies and scripts
```

---

## 🎯 Key Features Implemented

### **✅ Production Ready**
- **TypeScript compilation** with strict type checking
- **Error handling** and graceful fallbacks
- **Performance optimization** with database indexes
- **Security** with protected API routes
- **Responsive design** for all devices

### **✅ Real-Time Features**
- **Live chat** between buyers and sellers
- **Instant notifications** for new messages
- **Socket.IO integration** with Render hosting
- **Message persistence** in MongoDB

### **✅ E-commerce Features**
- **Product catalog** with advanced filtering
- **Secure checkout** via Stripe
- **Order management** system
- **Wishlist functionality**
- **User role management**

---

## 🐛 Troubleshooting

### **Common Issues**

1. **MissingSchemaError**: Ensure all models are imported via `@/lib/models`
2. **Socket connection failed**: Check Render socket server status
3. **MongoDB timeout**: Verify connection string and network access
4. **Build errors**: Check TypeScript compilation and dependencies

### **Performance Issues**

1. **Slow queries**: Database indexes are automatically created
2. **Memory leaks**: Connection pooling is configured
3. **Timeout errors**: Query timeouts are set to prevent hangs

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js team** for the amazing framework
- **Vercel** for seamless deployment
- **Render** for free socket server hosting
- **MongoDB Atlas** for database hosting
- **Clerk** for authentication services

---

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/debabrataghoosh/AgroTrade-fullstack-project/issues)
- **Email**: Contact through GitHub profile
- **Documentation**: Check the code comments and API routes

---

**AgroTrade** - Empowering Indian agriculture through technology! 🌾🚀


