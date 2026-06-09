// Future scheduled refresh for cached market data or provider data.
//
// Set provider secrets before deploying:
//   supabase secrets set FMP_API_KEY=your_key_here
//   supabase secrets set FINNHUB_API_KEY=your_key_here
//
// Never expose provider API keys to the client bundle.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(() => {
  return new Response(
    JSON.stringify({
      ok: true,
      message: "Market data refresh placeholder",
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
});
