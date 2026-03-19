import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  // Match generated Next.js route handler context typing.
  // Types expect `params` to be a Promise.
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const { reference } = await params;

    if (!BASE_URL) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }
    
    // ── LOG 1: Status check requested ───────────────────────────────────
    console.log('[Intouch Status Check] 🔍 Checking status for reference:', reference);
    
    // Forward the Authorization header from the incoming request
    const authHeader = request.headers.get("authorization");
    
    // Proxy the request to the backend
    const response = await fetch(`${BASE_URL}/api/v1/intouch/transaction/${reference}/status`, {
      method: "GET",
      headers: {
        "Accept": "*/*",
        ...(authHeader && { Authorization: authHeader }),
      },
    });
    
    // ── LOG 2: Backend response ─────────────────────────────────────────
    const responseText = await response.text();
    console.log('[Intouch Status Check] 📥 Backend response status:', response.status);
    
    if (response.ok) {
      try {
        const responseData = JSON.parse(responseText);
        console.log('[Intouch Status Check] 📊 Status check result:', {
          reference,
          status: responseData.data?.status,
          responsecode: responseData.data?.responsecode,
          success: responseData.data?.success,
          message: responseData.data?.message,
          transactionid: responseData.data?.transactionid,
        });
        console.log('[Intouch Status Check] 📤 Returning status response:', JSON.stringify(responseData, null, 2));
      } catch (parseErr) {
        console.log('[Intouch Status Check] 📤 Raw response body:', responseText);
      }
    } else {
      console.error('[Intouch Status Check] ❌ Backend error response:', responseText);
    }
    
    // Return the response status and body as-is
    return new NextResponse(responseText, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error('[Intouch Status Check] ❌ ERROR in status check:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
