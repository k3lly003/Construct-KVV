import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Fetch designs from the real backend API
async function fetchDesignsFromBackend(queryParams: URLSearchParams) {
  try {
    const response = await fetch(`${API_URL}/api/v1/design/public/all?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching designs from backend:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Fetch from real backend
    const backendResponse = await fetchDesignsFromBackend(searchParams);
    
    return NextResponse.json(backendResponse);

  } catch (error) {
    console.error('Error in design API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch designs from backend' },
      { status: 500 }
    );
  }
}
