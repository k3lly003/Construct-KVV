import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create design order in the real backend API
async function createDesignOrderInBackend(token: string, orderData: any) {
  try {
    const response = await fetch(`${API_URL}/api/v1/design/order`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating design order in backend:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { designId, paymentMethod = 'card' } = body;

    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Create order in real backend
    const backendResponse = await createDesignOrderInBackend(token, { designId, paymentMethod });
    
    return NextResponse.json(backendResponse);

  } catch (error) {
    console.error('Error creating design order:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create design order',
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
