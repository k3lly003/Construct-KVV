import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  // Next.js route handler "context" typing differs across versions.
  // In this project, the generated types expect `params` to be a Promise,
  // so we accept it as such and `await` it (await works for plain objects too).
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
    
    // Forward the Authorization header from the incoming request
    const authHeader = request.headers.get("authorization");
    
    // Proxy the request to the backend
    const response = await fetch(`${BASE_URL}/api/v1/intouch/transaction/${reference}`, {
      method: "GET",
      headers: {
        "Accept": "*/*",
        ...(authHeader && { Authorization: authHeader }),
      },
    });
    
    // Return the response status and body as-is
    const responseText = await response.text();
    
    return new NextResponse(responseText, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Transaction proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
