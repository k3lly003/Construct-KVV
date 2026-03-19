import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    
    // ── LOG 1: Payment initiation requested ────────────────────────────────
    console.log('[Intouch Payment] 🚀 Payment initiation request received');
    
    // Forward the Authorization header from the incoming request
    const authHeader = request.headers.get("authorization");
    
    // Get the request body
    const body = await request.json();
    
    // Generate callback URL
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || 'localhost:3001';
    const callbackUrl = `${protocol}://${host}/api/v1/intouch/callback`;
    
    console.log('[Intouch Payment] 📋 Request details:', {
      amount: body.amount,
      phoneNumber: body.phoneNumber,
      sellerId: body.sellerId,
      description: body.description,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      callbackUrl: callbackUrl,
      hasAuth: !!authHeader,
    });
    
    // Add callbackurl to the request body
    const enhancedBody = {
      ...body,
      callbackurl: callbackUrl,
    };
    
    console.log('[Intouch Payment] 📤 Enhanced request body with callbackurl:', JSON.stringify(enhancedBody, null, 2));
    
    // Proxy the request to the backend
    const response = await fetch(`${BASE_URL}/api/v1/intouch/payment/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(enhancedBody),
    });
    
    // ── LOG 2: Backend response ─────────────────────────────────────────
    const responseText = await response.text();
    console.log('[Intouch Payment] 📥 Backend raw response status:', response.status);
    console.log('[Intouch Payment] 📥 Backend response body:', responseText);
    
    // Return the response status and body as-is
    return new NextResponse(responseText, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error('[Intouch Payment] ❌ ERROR in payment initiation:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
