import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Message } from '@/lib/models';
import { User } from '@/lib/models';
import { Product } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    console.log('Starting message cleanup process...');
    
    // Find all messages
    const allMessages = await Message.find({});
    console.log(`Total messages found: ${allMessages.length}`);
    
    let orphanedCount = 0;
    let validCount = 0;
    const orphanedMessages = [];
    
    // Check each message for orphaned references
    for (const message of allMessages) {
      try {
        // Check if sender exists
        const senderExists = await User.findById(message.sender);
        if (!senderExists) {
          orphanedMessages.push({
            messageId: message._id,
            reason: 'Missing sender',
            senderId: message.sender
          });
          orphanedCount++;
          continue;
        }
        
        // Check if receiver exists
        const receiverExists = await User.findById(message.receiver);
        if (!receiverExists) {
          orphanedMessages.push({
            messageId: message._id,
            reason: 'Missing receiver',
            receiverId: message.receiver
          });
          orphanedCount++;
          continue;
        }
        
        // Check if product exists
        const productExists = await Product.findById(message.product);
        if (!productExists) {
          orphanedMessages.push({
            messageId: message._id,
            reason: 'Missing product',
            productId: message.product
          });
          orphanedCount++;
          continue;
        }
        
        validCount++;
        
      } catch (error) {
        console.error('Error checking message:', message._id, error);
        orphanedCount++;
      }
    }
    
    console.log(`Cleanup results: ${validCount} valid, ${orphanedCount} orphaned`);
    
    // Optionally delete orphaned messages (uncomment to enable)
    // if (orphanedCount > 0) {
    //   const orphanedIds = orphanedMessages.map(m => m.messageId);
    //   await Message.deleteMany({ _id: { $in: orphanedIds } });
    //   console.log(`Deleted ${orphanedCount} orphaned messages`);
    // }
    
    return NextResponse.json({
      success: true,
      summary: {
        totalMessages: allMessages.length,
        validMessages: validCount,
        orphanedMessages: orphanedCount
      },
      orphanedDetails: orphanedMessages
    });
    
  } catch (error: any) {
    console.error('Error during message cleanup:', error);
    return NextResponse.json({ 
      error: 'Cleanup failed',
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    
    // Get a quick summary without full cleanup
    const totalMessages = await Message.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    return NextResponse.json({
      summary: {
        totalMessages,
        totalUsers,
        totalProducts
      },
      note: 'Use POST to perform full cleanup'
    });
    
  } catch (error: any) {
    console.error('Error getting cleanup summary:', error);
    return NextResponse.json({ 
      error: 'Failed to get summary',
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
