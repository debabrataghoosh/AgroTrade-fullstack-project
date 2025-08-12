# AgroTrade Socket Server

Real-time communication server for AgroTrade chat functionality.

## 🚀 **Deploy to Render (100% FREE FOREVER)**

### **Step 1: Go to Render**
1. Visit [render.com](https://render.com/)
2. Sign up with your GitHub account (no credit card required!)

### **Step 2: Create New Web Service**
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `debabrataghoosh/AgroTrade-fullstack-project`
3. Set **Root Directory**: `socket-server`

### **Step 3: Configure Service**
- **Name**: `agrotrade-socket-server`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free` (select this for lifetime free tier)

### **Step 4: Deploy**
1. Click **"Create Web Service"**
2. Wait 2-3 minutes for deployment
3. Get your URL: `https://agrotrade-socket-server.onrender.com`

## 🔧 **Environment Variables (Auto-configured)**

Render will automatically set:
- `PORT` - The port your server runs on
- `NODE_ENV` - Set to production

## 📱 **Update Frontend**

After deployment, update your frontend socket connection URLs:

```typescript
// Replace localhost:3001 with your Render URL
socketRef.current = io("https://agrotrade-socket-server.onrender.com", {
  // ... other options
});
```

## 🏃‍♂️ **Local Development**

```bash
cd socket-server
npm install
npm run dev
```

## 🌟 **Why Render is Better than Railway**

| Feature | Render | Railway |
|---------|---------|---------|
| **Free Tier** | ✅ **FOREVER** | ❌ 30 days only |
| **Credit Card** | ❌ **Not Required** | ✅ Required |
| **Hours/Month** | 750 hours | 500 hours |
| **Setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 🎯 **What You Get**

✅ **100% Free Forever**  
✅ **No Credit Card Required**  
✅ **Automatic HTTPS**  
✅ **Global CDN**  
✅ **Easy GitHub Integration**  
✅ **Professional Infrastructure**  

Your socket server will run 24/7 for free, enabling real-time chat in your production app!
