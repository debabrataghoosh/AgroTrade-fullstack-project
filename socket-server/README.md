# AgroTrade Socket Server

Real-time communication server for AgroTrade chat functionality.

## 🚀 Quick Deploy to Railway

1. **Fork this repository** or create a new one
2. **Go to [Railway](https://railway.app/)**
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Select your repository**
5. **Railway will automatically detect it's a Node.js app and deploy**

## 🔧 Environment Variables

Railway will automatically set:
- `PORT` - The port your server runs on (Railway sets this)

Optional:
- `ALLOWED_ORIGINS` - Comma-separated list of allowed origins (your Vercel domains)

## 📱 Update Frontend

After deployment, update your frontend socket connection URLs:

```typescript
// Replace localhost:3001 with your Railway URL
socketRef.current = io("https://your-app-name.railway.app", {
  // ... other options
});
```

## 🏃‍♂️ Local Development

```bash
cd socket-server
npm install
npm run dev
```

## 🌐 Production

Railway will give you a URL like:
`https://your-app-name.railway.app`

Use this URL in your Vercel-deployed frontend instead of `localhost:3001`.
