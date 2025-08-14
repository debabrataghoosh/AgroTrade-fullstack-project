import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if we're in a serverless environment
    const isVercel = process.env.VERCEL === '1';
    
    if (isVercel) {
      // On Vercel, we can't maintain persistent WebSocket connections
      // Users should use the external Socket.IO server
      return NextResponse.json({ 
        message: 'Socket endpoint ready',
        note: 'For real-time features, use the external Socket.IO server',
        externalServer: 'https://agrotrade-socket-server.onrender.com'
      });
    }
    
    return NextResponse.json({ 
      message: 'Socket endpoint ready',
      environment: 'development'
    });
  } catch (error) {
    console.error('Socket API error:', error);
    return NextResponse.json({ 
      error: 'Socket service unavailable' 
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    return NextResponse.json({ 
      message: 'Socket POST endpoint',
      note: 'WebSocket connections are handled by external server'
    });
  } catch (error) {
    console.error('Socket POST API error:', error);
    return NextResponse.json({ 
      error: 'Socket service unavailable' 
    }, { status: 500 });
  }
}