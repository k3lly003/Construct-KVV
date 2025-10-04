import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Fetch specific design from the real backend API
async function fetchDesignFromBackend(designId: string) {
  try {
    const response = await fetch(`${API_URL}/api/v1/design/${designId}`, {
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
    console.error('Error fetching design from backend:', error);
    throw error;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ designId: string }> }
) {
  try {
    const { designId } = await params;
    
    if (!designId) {
      return NextResponse.json(
        { success: false, error: 'Design ID is required' },
        { status: 400 }
      );
    }

    // Fetch from real backend
    const backendResponse = await fetchDesignFromBackend(designId);
    
    return NextResponse.json(backendResponse);

  } catch (error) {
    console.error('Error in design API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch design from backend' },
      { status: 500 }
    );
  }
}
