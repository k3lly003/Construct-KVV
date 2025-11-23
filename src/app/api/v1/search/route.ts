import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'https://construct-kvv-bn-fork.onrender.com';

/**
 * Global Search API Route
 * Proxies global search requests to the backend API
 * GET /api/v1/search?q=query&types=products,services,designs,portfolios&page=1&limit=10
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q');
    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Search query is required and must be at least 2 characters' 
        },
        { status: 400 }
      );
    }

    // Build query string from search params
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    
    if (searchParams.get('types')) {
      queryParams.append('types', searchParams.get('types')!);
    }
    if (searchParams.get('page')) {
      queryParams.append('page', searchParams.get('page')!);
    }
    if (searchParams.get('limit')) {
      queryParams.append('limit', searchParams.get('limit')!);
    }

    // Get auth token from request headers if available
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(`${API_URL}/api/v1/search?${queryParams.toString()}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          success: false, 
          message: errorData.message || `Backend API error: ${response.statusText}`,
          error: errorData 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Global search API route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to perform global search' 
      },
      { status: 500 }
    );
  }
}

