import { useEffect, useState } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { supabase } from "@/shared/lib/supabaseClient";

export default function AcceptCustomerInvite() {
  const [sp] = useSearchParams();
  const token = sp.get("token") || "";
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      console.log("🔍 Attempting to redeem customer invite:", token);
      const { data, error } = await supabase.rpc("redeem_customer_invite", { invite_token: token });
      console.log("📊 Response:", { data, error });
      if (error) {
        console.error("❌ Error:", error);
        setErr(error.message);
        return;
      }
      console.log("✅ Success! Customer created:", data);
      setDone(true);
    })();
  }, [token]);

  if (done) return <Navigate to="/dashboard" replace />;
  return (
    <main className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-semibold">Joining Brand…</h1>
      {!err ? (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-neutral-400">Please wait...</p>
          <p className="text-xs text-neutral-600">Token: {token}</p>
          <p className="text-xs text-neutral-600">Check browser console (F12) for details</p>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-red-500">Error: {err}</p>
          <p className="text-xs text-neutral-600">Token: {token}</p>
          <p className="text-xs text-neutral-500">Check browser console (F12) for full details</p>
        </div>
      )}
    </main>
  );
}
