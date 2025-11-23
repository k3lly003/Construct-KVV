import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'https://construct-kvv-bn-fork.onrender.com';

/**
 * Products Search API Route
 * Proxies search requests to the backend API
 * GET /api/v1/products?search=term&category=id&page=1&limit=10&sort=name&order=asc
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build query string from search params
    const queryParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      queryParams.append(key, value);
    });

    // Get auth token from request headers if available
    const authHeader = request.headers.get('authorization');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(`${API_URL}/api/v1/products?${queryParams.toString()}`, {
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
    console.error('Products API route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch products from backend' 
      },
      { status: 500 }
    );
  }
}

