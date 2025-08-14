# 🌾 AgroTrade - Complete Agri-Commerce Platform

**AgroTrade** is a modern, production-ready agri-commerce platform built to empower Indian farmers, sellers, and buyers. The platform supports direct crop trading, real-time buyer-seller chat, secure checkout, product management, and multilingual support — all through a seamless web experience.

---

## 🚀 Live Demo & Production URLs

### **🌐 Production Deployment**
- **Main Application**: [https://agrotrade-ebrbvlkmi-debabrata-ghoshs-projects.vercel.app](https://agrotrade-ebrbvlkmi-debabrata-ghoshs-projects.vercel.app)
- **Socket Server**: [https://agrotrade-fullstack-project.onrender.com](https://agrotrade-fullstack-project.onrender.com)
- **GitHub Repository**: [https://github.com/debabrataghoosh/AgroTrade-fullstack-project](https://github.com/debabrataghoosh/AgroTrade-fullstack-project)

---

## ✨ Complete Feature Set

### 🏠 **Homepage & User Experience**
- **Modern UI/UX** with Tailwind CSS v4
- **Location selector** for regional product discovery
- **Advanced search** with category filtering
- **Multilingual support** (Bengali, Hindi, Tamil, etc.)
- **"Become a Seller"** onboarding with benefits
- **Dynamic product sections**:
  - New Products
  - Popular Products  
  - Featured Products
- **User authentication** via Clerk
- **Wishlist management**
- **Real-time chat integration**

### 🧑‍🌾 **Seller Portal & Dashboard**
- **Secure authentication** via Clerk
- **Product management** with image uploads
- **Live/unlive toggle** for product visibility
- **Order management** with buyer addresses
- **Real-time chat** for bulk order negotiation
- **Sales analytics** and performance tracking
- **Product editing** and inventory management
- **Settings management**

### 🛒 **Buyer Experience & E-commerce**
- **Product browsing** with advanced filters
- **Secure checkout** via Stripe integration
- **Real-time chat** with sellers
- **Order tracking** and history
- **Wishlist management**
- **Address management**
- **Payment options** (Stripe + COD)
- **Order success** and confirmation

### 💬 **Real-Time Communication System**
- **Instant messaging** between buyers and sellers
- **Product-specific chat rooms**
- **Real-time notifications**
- **Message history** and persistence
- **File sharing** capabilities
- **Socket.IO integration** with Render hosting

---

## 🛠 **Complete Tech Stack & Dependencies**

### **🚀 Frontend Framework**
- **Next.js 15.3.4** with App Router and Turbopack
- **React 19.0.0** with latest features
- **TypeScript 5.8.3** for type safety
- **Tailwind CSS v4** for modern design system

### **🎨 UI/UX Libraries**
- **@headlessui/react 2.2.4** - Accessible UI components
- **@heroicons/react 2.2.0** - Beautiful SVG icons
- **react-icons 5.5.0** - Comprehensive icon library
- **framer-motion 12.23.0** - Smooth animations
- **aos 2.3.4** - Scroll animations
- **swiper 11.2.10** - Touch slider
- **clsx 2.1.1** - Conditional CSS classes

### **🔐 Authentication & Security**
- **@clerk/nextjs 6.23.2** - Complete auth solution
- **@clerk/backend 2.7.0** - Server-side auth
- **bcryptjs 3.0.2** - Password hashing
- **next-auth 4.24.11** - Alternative auth (legacy)

### **💳 Payment & E-commerce**
- **@stripe/react-stripe-js 3.9.0** - Stripe React components
- **@stripe/stripe-js 7.8.0** - Stripe JavaScript SDK
- **stripe 18.4.0** - Server-side Stripe integration

### **🗄️ Database & Backend**
- **mongoose 8.16.1** - MongoDB ODM
- **socket.io 4.8.1** - Real-time communication
- **socket.io-client 4.8.1** - Client-side sockets
- **axios 1.10.0** - HTTP client

### **📁 File Management**
- **cloudinary 2.7.0** - Cloud image storage
- **formidable 3.5.4** - File upload handling

### **📝 Forms & Validation**
- **react-hook-form 7.59.0** - Form management
- **dotenv 17.1.0** - Environment variables

### **🔧 Development Tools**
- **eslint 9** - Code linting
- **ts-node 10.9.2** - TypeScript execution
- **@types/node 20.19.4** - Node.js types
- **@types/react 19** - React types
- **@types/react-dom 19** - React DOM types
- **@types/aos 3.0.7** - AOS types
- **@types/formidable 3.4.5** - Formidable types

---

## 🚀 **Deployment & Infrastructure**

### **🌐 Frontend Hosting - Vercel**
- **Platform**: Vercel (Next.js optimized)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Framework**: Next.js
- **Features**: 
  - Automatic HTTPS
  - Global CDN
  - Edge functions
  - Automatic deployments
  - Performance analytics

### **🔌 Socket Server - Render**
- **Platform**: Render (100% FREE FOREVER)
- **Service Type**: Web service
- **Environment**: Node.js
- **Plan**: Free tier
- **Features**:
  - Automatic HTTPS
  - Custom domain support
  - Environment variables
  - Health monitoring
  - Auto-scaling

### **🗄️ Database - MongoDB Atlas**
- **Platform**: MongoDB Atlas
- **Type**: Cloud-hosted MongoDB
- **Features**:
  - Automatic backups
  - Global distribution
  - Built-in security
  - Performance monitoring
  - Connection pooling

### **🔐 Authentication - Clerk**
- **Platform**: Clerk.dev
- **Features**:
  - Multi-factor authentication
  - Social logins
  - User management
  - Webhook support
  - Role-based access

### **💳 Payments - Stripe**
- **Platform**: Stripe
- **Features**:
  - Secure checkout
  - Webhook processing
  - Multiple payment methods
  - Fraud protection
  - Analytics dashboard

---

## 💻 **Development Setup & Installation**

### **1. Clone the Repository**
```bash
git clone https://github.com/debabrataghoosh/AgroTrade-fullstack-project.git
cd AgroTrade-fullstack-project
```

### **2. Install Dependencies**
```bash
# Install main dependencies
npm install

# Install socket server dependencies
cd socket-server
npm install
cd ..
```

### **3. Environment Variables Setup**

Create a `.env.local` file in the root folder:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# MongoDB Database
MONGODB_URI=your_mongodb_atlas_connection_string

# Stripe Payment
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Socket Server
NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.onrender.com
```

### **4. Database Setup**
1. **MongoDB Atlas**: Create a cluster and get your connection string
2. **Collections**: The app will automatically create required collections
3. **Indexes**: Database indexes are automatically created for performance

### **5. Run Development Servers**

```bash
# Option 1: Run frontend only
npm run dev

# Option 2: Run socket server only
npm run socket

# Option 3: Run both simultaneously (recommended)
npm run dev:all
```

Open your browser at: [http://localhost:3000](http://localhost:3000)

---

## 🔧 **Project Structure & Architecture**

```
AgroTrade/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── buyer-chats/   # Buyer chat management
│   │   │   ├── create-checkout-session/ # Stripe checkout
│   │   │   ├── health/        # Health monitoring
│   │   │   ├── messages/      # Chat message handling
│   │   │   ├── orders/        # Order management
│   │   │   ├── products/      # Product CRUD operations
│   │   │   ├── seller-chats/  # Seller chat management
│   │   │   ├── socket/        # Socket.IO integration
│   │   │   ├── user/          # User management
│   │   │   ├── webhooks/      # Stripe webhooks
│   │   │   └── wishlist/      # Wishlist operations
│   │   ├── components/        # Reusable components
│   │   ├── dashboard/         # Seller dashboard
│   │   ├── products/          # Product pages
│   │   ├── chat/              # Real-time chat
│   │   ├── seller/            # Seller portal
│   │   ├── checkout/          # Payment checkout
│   │   ├── orders/            # Order management
│   │   └── wishlist/          # Wishlist pages
│   ├── lib/
│   │   ├── models/            # MongoDB schemas
│   │   │   ├── User.ts        # User model
│   │   │   ├── Product.ts     # Product model
│   │   │   ├── Order.ts       # Order model
│   │   │   ├── Message.ts     # Chat message model
│   │   │   └── Wishlist.ts    # Wishlist model
│   │   ├── mongodb.ts         # Database connection
│   │   └── mongodbClientPromise.ts # Client promise
│   └── middleware.ts          # Route protection
├── socket-server/              # Real-time communication server
│   ├── server.js              # Socket.IO server
│   ├── package.json           # Socket server dependencies
│   └── render.yaml            # Render deployment config
├── public/                     # Static assets
│   └── assets/                # Images and media
├── vercel.json                # Vercel deployment config
├── next.config.ts             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS config
├── tsconfig.json              # TypeScript config
└── package.json               # Main dependencies and scripts
```

---

## 🚀 **Deployment Guide**

### **Frontend Deployment (Vercel)**

1. **Connect GitHub** repository to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
4. **Automatic deployment** on every push to main branch

### **Socket Server Deployment (Render)**

1. **Create Render account** (100% FREE FOREVER)
2. **Connect GitHub** repository
3. **Set root directory** to `socket-server`
4. **Configure environment**:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Deploy** with automatic HTTPS

### **Database Setup (MongoDB Atlas)**

1. **Create cluster** in MongoDB Atlas
2. **Set up network access** (IP whitelist or 0.0.0.0/0)
3. **Create database user** with read/write permissions
4. **Get connection string** and add to environment variables

### **External Services Configuration**

1. **Clerk**: Set up authentication and webhooks
2. **Stripe**: Configure webhook endpoints
3. **Cloudinary**: Set up image upload credentials

---

## 🎯 **Key Features & Implementation Status**

### **✅ Production Ready Features**
- **TypeScript compilation** with strict type checking
- **Error handling** and graceful fallbacks
- **Performance optimization** with database indexes
- **Security** with protected API routes
- **Responsive design** for all devices
- **SEO optimization** with Next.js

### **✅ Real-Time Features**
- **Live chat** between buyers and sellers
- **Instant notifications** for new messages
- **Socket.IO integration** with Render hosting
- **Message persistence** in MongoDB
- **Connection status monitoring**

### **✅ E-commerce Features**
- **Product catalog** with advanced filtering
- **Secure checkout** via Stripe
- **Order management** system
- **Wishlist functionality**
- **User role management**
- **Payment processing**

### **✅ Authentication & Security**
- **Multi-factor authentication** via Clerk
- **Role-based access control**
- **Protected API routes**
- **Secure payment processing**
- **Data validation**

---

## 🐛 **Troubleshooting & Common Issues**

### **Development Issues**

1. **MissingSchemaError**: Ensure all models are imported via `@/lib/models`
2. **Socket connection failed**: Check Render socket server status
3. **MongoDB timeout**: Verify connection string and network access
4. **Build errors**: Check TypeScript compilation and dependencies

### **Deployment Issues**

1. **Vercel build failures**: Check for TypeScript errors locally
2. **Render socket server down**: Monitor Render dashboard
3. **MongoDB connection issues**: Verify Atlas network access
4. **Stripe webhook failures**: Check webhook endpoint configuration

### **Performance Issues**

1. **Slow queries**: Database indexes are automatically created
2. **Memory leaks**: Connection pooling is configured
3. **Timeout errors**: Query timeouts are set to prevent hangs

---

## 🔍 **Monitoring & Health Checks**

### **Health Endpoints**
- `/api/health` - Overall system health
- `/api/socket` - Socket service status
- `/api/products` - Database connectivity
- `/api/orders` - Order system status

### **Performance Monitoring**
- **Vercel Analytics** for frontend performance
- **MongoDB Atlas** for database metrics
- **Stripe Dashboard** for payment analytics
- **Render Dashboard** for socket server status

---

## 🤝 **Contributing & Development**

### **Development Workflow**
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### **Code Quality**
- **ESLint** configuration for code standards
- **TypeScript** for type safety
- **Prettier** for code formatting
- **Git hooks** for pre-commit checks

---

## 📄 **License & Legal**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments & Credits**

- **Next.js team** for the amazing framework
- **Vercel** for seamless deployment and hosting
- **Render** for free socket server hosting
- **MongoDB Atlas** for database hosting
- **Clerk** for authentication services
- **Stripe** for payment processing
- **Tailwind CSS** for the design system
- **Open source community** for various libraries

---

## 📞 **Support & Contact**

- **GitHub Issues**: [Report bugs or request features](https://github.com/debabrataghoosh/AgroTrade-fullstack-project/issues)
- **Email**: Contact through GitHub profile
- **Documentation**: Check the code comments and API routes
- **Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions

---

## 🚀 **Quick Start Commands**

```bash
# Development
npm run dev          # Frontend only
npm run socket       # Socket server only
npm run dev:all      # Both services

# Production
npm run build        # Build for production
npm run start        # Start production server

# Utilities
npm run lint         # Lint code
npm run type-check   # TypeScript check
```

---

**AgroTrade** - Empowering Indian agriculture through technology! 🌾🚀

*Built with Next.js, Deployed on Vercel, Powered by Render, Secured by Clerk, and Enhanced with Stripe*


