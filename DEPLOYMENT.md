# 🚀 Vercel Deployment Guide for AgroTrade

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Required
Make sure these environment variables are set in your Vercel project:

```bash
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Stripe Payment
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Optional: Clerk Webhook
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
```

### 2. Vercel Configuration
- ✅ `vercel.json` is configured
- ✅ Build command: `npm run build`
- ✅ Output directory: `.next`
- ✅ Framework: Next.js

### 3. External Services
- ✅ MongoDB Atlas cluster is accessible from Vercel
- ✅ Socket.IO server is deployed on Render (https://agrotrade-socket-server.onrender.com)
- ✅ Stripe webhook endpoint is configured
- ✅ Render-Vercel CORS configuration is set up

## 🔧 Deployment Steps

### Step 1: Connect to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Step 2: Set Environment Variables
In Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all required variables listed above
4. Redeploy after adding variables

### Step 3: Configure Domains
- Set your custom domain in Vercel
- Update Stripe webhook endpoint to use your Vercel domain
- Update Clerk webhook endpoints if needed

## 🚨 Common Issues & Solutions

### Issue 1: MongoDB Connection Timeout
**Problem**: MongoDB connection fails on Vercel
**Solution**: 
- Ensure MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
- Check if MONGODB_URI is correctly set in Vercel

### Issue 2: Stripe Webhook Failures
**Problem**: Webhooks not reaching your app
**Solution**:
- Verify webhook endpoint URL in Stripe dashboard
- Check STRIPE_WEBHOOK_SECRET is correct
- Ensure webhook endpoint is publicly accessible

### Issue 3: Socket.IO Not Working
**Problem**: Real-time features don't work
**Solution**:
- Socket.IO is handled by external server on Render (https://agrotrade-socket-server.onrender.com)
- Check if Render server is running and accessible
- Verify Socket.IO client URLs in the code point to Render server
- Test health check endpoint: `/api/health`
- Ensure CORS is properly configured between Vercel and Render

### Issue 4: Build Failures
**Problem**: Build fails on Vercel
**Solution**:
- Check for TypeScript errors locally first
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

## 🔌 Render-Vercel Socket.IO Integration

### Architecture Overview
- **Frontend**: Deployed on Vercel (Next.js)
- **Socket.IO Server**: Deployed on Render (Node.js)
- **Communication**: WebSocket connections from Vercel to Render

### Configuration Details
- **Socket.IO Client URLs**: All point to `https://agrotrade-socket-server.onrender.com`
- **CORS**: Configured to allow Vercel domains to connect to Render
- **Health Check**: `/api/health` endpoint monitors Render server status
- **Reconnection**: Automatic reconnection with 5 attempts and 1-second delays

### Files Updated
- `src/app/components/SocketProvider.tsx` - Main Socket.IO provider
- `src/app/chat/[id]/page.tsx` - Chat page Socket.IO connection
- `vercel.json` - CORS headers for Render integration
- `src/app/api/health/route.ts` - Health monitoring endpoint

### Testing the Integration
1. **Health Check**: Visit `/api/health` to verify all services
2. **Real-time Chat**: Test chat functionality between users
3. **Connection Status**: Check browser console for Socket.IO connection logs

## 📊 Performance Optimization

### 1. API Route Optimization
- API routes have 30-second timeout configured
- MongoDB connection pooling is optimized
- Static pages are pre-rendered where possible

### 2. Image Optimization
- Next.js Image component is used for optimization
- Static assets are served from CDN

### 3. Caching Strategy
- Static pages are cached at edge
- API responses can be cached based on headers

## 🔍 Monitoring & Debugging

### 1. Vercel Analytics
- Enable Vercel Analytics for performance monitoring
- Monitor API response times and errors

### 2. Logs
- Check Vercel function logs for API errors
- Monitor MongoDB connection logs
- Track Stripe webhook delivery

### 3. Health Checks
- `/api/socket` - Socket service status
- `/api/products` - Database connectivity
- `/api/orders` - Order system status

## 🚀 Post-Deployment Verification

### 1. Test Core Features
- ✅ User authentication (sign up/sign in)
- ✅ Product browsing and search
- ✅ Shopping cart and wishlist
- ✅ Checkout process (COD and online payment)
- ✅ Order management
- ✅ Real-time chat (via external Socket.IO server)

### 2. Test Payment Flow
- ✅ Stripe checkout session creation
- ✅ Webhook processing
- ✅ Order creation in database
- ✅ COD order placement

### 3. Test Responsiveness
- ✅ Mobile-friendly design
- ✅ Cross-browser compatibility
- ✅ Performance on different devices

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test locally with production environment
4. Check external service status (MongoDB, Stripe, Render)

## 🔄 Updates & Maintenance

### Regular Tasks
- Monitor MongoDB connection health
- Check Stripe webhook delivery rates
- Update dependencies regularly
- Monitor Vercel function performance

### Emergency Procedures
- Database connection issues: Check MongoDB Atlas
- Payment failures: Verify Stripe configuration
- Real-time features down: Check Render Socket.IO server
- Build failures: Test locally and check TypeScript errors
