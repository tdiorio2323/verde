import { Button } from "@/components/ui/button";

export type CategoryOption = {
  id: string;
  name: string;
};

export type CategoryChipsProps = {
  categories: CategoryOption[];
  activeId: string;
  onSelect: (categoryId: string) => void;
};

const CategoryChips = ({ categories, activeId, onSelect }: CategoryChipsProps) => {
  return (
    <nav aria-label="Product categories" className="overflow-x-auto pb-2">
      <div className="flex w-max gap-2">
        {categories.map((category) => {
          const isActive = category.id === activeId;
          return (
            <Button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              variant="ghost"
              className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-all focus-visible:ring-2 focus-visible:ring-white/40 ${
                isActive
                  ? "border-white/40 bg-white/15 text-white shadow-glow"
                  : "border-white/15 bg-white/5 text-white/70 hover:text-white"
              }`}
              aria-pressed={isActive}
            >
              {category.name}
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default CategoryChips;
