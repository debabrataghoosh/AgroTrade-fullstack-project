import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        vercel: 'operational',
        mongodb: 'checking...',
        socketio: 'checking...',
        stripe: 'checking...'
      },
      environment: process.env.NODE_ENV || 'development',
      isVercel: process.env.VERCEL === '1'
    };

    // Check MongoDB connection
    try {
      const { dbConnect } = await import('@/lib/mongodb');
      await dbConnect();
      healthStatus.services.mongodb = 'operational';
    } catch (error) {
      healthStatus.services.mongodb = 'error';
      healthStatus.status = 'degraded';
    }

    // Check Socket.IO server (Render)
    try {
      const response = await fetch('https://agrotrade-socket-server.onrender.com/health', {
        method: 'GET',
        timeout: 5000
      });
      if (response.ok) {
        healthStatus.services.socketio = 'operational';
      } else {
        healthStatus.services.socketio = 'error';
        healthStatus.status = 'degraded';
      }
    } catch (error) {
      healthStatus.services.socketio = 'error';
      healthStatus.status = 'degraded';
    }

    // Check Stripe configuration
    if (process.env.STRIPE_SECRET_KEY) {
      healthStatus.services.stripe = 'configured';
    } else {
      healthStatus.services.stripe = 'not_configured';
      healthStatus.status = 'degraded';
    }

    const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(healthStatus, { status: statusCode });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      environment: process.env.NODE_ENV || 'development'
    }, { status: 500 });
  }
}
