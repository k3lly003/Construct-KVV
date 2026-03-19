import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // ── LOG 1: Raw incoming request ─────────────────────────────────
  console.log('[Intouch Callback] ✅ Endpoint hit at:', new Date().toISOString());
  
  let body: any;
  try {
    body = await request.json();
    console.log('[Intouch Callback] Raw body received:', JSON.stringify(body, null, 2));
  } catch (err) {
    console.error('[Intouch Callback] ❌ ERROR: Failed to parse JSON body:', err);
    return NextResponse.json(
      { message: "success", success: true, request_id: null },
      { status: 200 }
    );
  }

  const payload = body?.jsonpayload;

  // ── LOG 2: Payload parse check ───────────────────────────────────
  if (!payload) {
    console.error('[Intouch Callback] ❌ ERROR: No jsonpayload in body. Full body:', body);
    return NextResponse.json(
      { message: "success", success: true, request_id: null },
      { status: 200 }
    );
  }

  console.log('[Intouch Callback] Parsed payload:', {
    requesttransactionid: payload.requesttransactionid,
    transactionid: payload.transactionid,
    responsecode: payload.responsecode,
    status: payload.status,
    statusdesc: payload.statusdesc,
  });

  // ── LOG 3: DB lookup (proxy to external backend) ─────────────────────
  console.log('[Intouch Callback] 🔍 Looking up transaction by reference:', payload.requesttransactionid);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!BASE_URL) {
    console.error('[Intouch Callback] ❌ ERROR: NEXT_PUBLIC_API_URL not configured');
    return NextResponse.json(
      {
        message: "success",
        success: true,
        request_id: payload.requesttransactionid ?? null,
      },
      { status: 200 }
    );
  }

  try {
    // Find transaction by reference
    // Validate requesttransactionid to prevent SSRF via path injection
    const rawRequestTransactionId = payload.requesttransactionid;
    const requesttransactionid =
      typeof rawRequestTransactionId === "string"
        ? rawRequestTransactionId
        : rawRequestTransactionId != null
          ? String(rawRequestTransactionId)
          : null;

    const requestTransactionIdPattern = /^[A-Za-z0-9_-]{1,100}$/;

    if (!requesttransactionid || !requestTransactionIdPattern.test(requesttransactionid)) {
      console.error(
        "[Intouch Callback] ❌ ERROR: Invalid requesttransactionid received:",
        rawRequestTransactionId
      );
      return NextResponse.json(
        {
          message: "success",
          success: true,
          request_id: payload.requesttransactionid ?? null,
        },
        { status: 200 } // always 200 so InTouchPay does not retry endlessly
      );
    }

    const transactionResponse = await fetch(
      `${BASE_URL}/api/v1/intouch/transaction/${requesttransactionid}`,
      {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
      }
    );

    if (!transactionResponse.ok) {
      console.error('[Intouch Callback] ❌ ERROR: Transaction not found for reference:', payload.requesttransactionid);
      return NextResponse.json(
        {
          message: "success",
          success: true,
          request_id: payload.requesttransactionid ?? null,
        },
        { status: 200 }
      );
    }

    const transactionData = await transactionResponse.json();
    console.log('[Intouch Callback] ✅ Transaction found:', {
      id: transactionData.data?.id,
      currentStatus: transactionData.data?.status,
      reference: transactionData.data?.reference,
    });

    // ── LOG 4: Status decision ───────────────────────────────────────
    const isSuccess = payload.responsecode === '1001' || payload.responsecode === '01';
    const newStatus = isSuccess ? 'COMPLETED' : 'FAILED';

    console.log(`[Intouch Callback] 📊 responsecode=${payload.responsecode} → setting status to: ${newStatus}`);

    // ── LOG 5: Update transaction status (proxy to external backend) ───────
    try {
      // Since we don't have direct DB access, we'll need to create an endpoint
      // on the external backend to handle status updates. For now, we'll log
      // what should be updated.
      console.log('[Intouch Callback] 🔄 Would update transaction:', {
        transactionId: transactionData.data?.id,
        newStatus,
        intouchRef: payload.transactionid,
        responsecode: payload.responsecode,
        statusdesc: payload.statusdesc,
      });

      // TODO: Create endpoint on external backend: PATCH /api/v1/intouch/transaction/:id/status
      // For now, we'll make the call assuming it exists
      const updateResponse = await fetch(`${BASE_URL}/api/v1/intouch/transaction/${transactionData.data?.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        body: JSON.stringify({
          status: newStatus,
          intouchRef: payload.transactionid,
          metadata: {
            callbackResponseCode: payload.responsecode,
            callbackStatusDesc: payload.statusdesc,
            callbackReceivedAt: new Date().toISOString(),
          },
        }),
      });

      if (updateResponse.ok) {
        console.log(`[Intouch Callback] ✅ Transaction ${transactionData.data?.id} updated to ${newStatus}`);
      } else {
        console.error('[Intouch Callback] ❌ ERROR updating transaction status:', await updateResponse.text());
      }
    } catch (err) {
      console.error('[Intouch Callback] ❌ ERROR updating transaction status:', err);
    }

    // ── LOG 6: Order update (if successful) ─────────────────────────────────
    if (isSuccess && transactionData.data?.metadata?.orderId) {
      try {
        console.log(`[Intouch Callback] 🔄 Updating order ${transactionData.data.metadata.orderId} to PAID`);
        
        const orderUpdateResponse = await fetch(`${BASE_URL}/api/v1/orders/${transactionData.data.metadata.orderId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
          },
          body: JSON.stringify({
            status: 'PAID',
            transactionId: payload.transactionid,
            reference: payload.requesttransactionid,
          }),
        });

        if (orderUpdateResponse.ok) {
          console.log(`[Intouch Callback] ✅ Order ${transactionData.data.metadata.orderId} marked as PAID`);
        } else {
          console.error('[Intouch Callback] ❌ ERROR updating order status:', await orderUpdateResponse.text());
        }
      } catch (err) {
        console.error('[Intouch Callback] ❌ ERROR updating order status:', err);
      }
    }

  } catch (err) {
    console.error('[Intouch Callback] ❌ ERROR in transaction lookup/update:', err);
  }

  console.log('[Intouch Callback] ✅ Done. Responding to IntouchPay with success.');

  // ── RESPONSE: Must be HTTP 200 with exact format ──────────────────────
  return NextResponse.json(
    {
      message: "success",
      success: true,
      request_id: payload.requesttransactionid ?? null,
    },
    { status: 200 }
  );
}
