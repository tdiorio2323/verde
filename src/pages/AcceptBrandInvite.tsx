import { useEffect, useState } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function AcceptBrandInvite() {
  const [sp] = useSearchParams();
  const token = sp.get("token") || "";
  const [ok, setOk] = useState<null | boolean>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        setErr("signin_required");
        return;
      }
      const { data, error } = await supabase.rpc("redeem_brand_invite", { invite_token: token, member_role: "owner" });
      if (error) { setErr(error.message); setOk(false); return; }
      setOk(true);
    })();
  }, [token]);

  if (ok) return <Navigate to="/dashboard/brand" replace />;
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Accept Brand Invite</h1>
      {!ok && !err && <p className="mt-2 text-sm text-neutral-500">Validating…</p>}
      {err === "signin_required" && <p className="mt-2 text-sm">Sign in to continue, then revisit this link.</p>}
      {err && err !== "signin_required" && <p className="mt-2 text-sm text-red-600">Error: {err}</p>}
    </main>
  );
}

