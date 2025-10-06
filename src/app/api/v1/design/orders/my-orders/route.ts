import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Fetch user's design orders from the real backend API
async function fetchUserOrdersFromBackend(token: string) {
  try {
    const response = await fetch(`${API_URL}/api/v1/design/orders/my-orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user orders from backend:', error);
    throw error;
  }
}


export async function GET(request: NextRequest) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Fetch from real backend
    const backendResponse = await fetchUserOrdersFromBackend(token);
    
    return NextResponse.json(backendResponse);

  } catch (error) {
    console.error('Error in design orders API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders from backend' },
      { status: 500 }
    );
  }
}
