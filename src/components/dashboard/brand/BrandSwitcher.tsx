
import { useSession } from "@/shared/stores/session";

export function BrandSwitcher() {
  const { brandIds, brandId, setActiveBrand } = useSession();
  if (brandIds.length <= 1) return null;
  return (
    <select
      className="border rounded-md px-3 py-2 text-sm"
      value={brandId ?? ""}
      onChange={(e) => setActiveBrand(e.target.value || null)}
    >
      {brandIds.map((id) => (
        <option key={id} value={id}>
          {id}
        </option>
      ))}
    </select>
  );
}
