// Future alert processing function (scheduled or event-driven).
//
// Provider secrets for market data checks (set via CLI, not in client):
//   supabase secrets set FMP_API_KEY=your_key_here
//   supabase secrets set FINNHUB_API_KEY=your_key_here

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(() => {
  return new Response(
    JSON.stringify({
      ok: true,
      message: "Alert processing placeholder",
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
});
