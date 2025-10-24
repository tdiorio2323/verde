
import { supabase } from "@/shared/lib/supabaseClient";

export function InvitesPanel({ brandId }: { brandId: string }) {
  async function createInvite(email: string) {
    const token = crypto.randomUUID();
    await supabase.from("brand_invites").insert({
      brand_id: brandId,
      email,
      token,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    });
    // send email via your mailer with invite URL: /invite?token=...
  }
  return (
    <div className="rounded-2xl border p-4">
      <h2 className="text-lg font-semibold mb-3">Invite Brand Admins</h2>
      <p className="text-sm text-neutral-500">Generate invite links for owners/managers.</p>
    </div>
  );
}
