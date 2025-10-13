import { useId } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
  placeholder?: string;
  ariaLabel?: string;
};

const SearchBar = ({ value, onChange, onReset, placeholder, ariaLabel }: SearchBarProps) => {
  const searchId = useId();

  return (
    <div className="relative">
      <label htmlFor={searchId} className="sr-only">
        {ariaLabel ?? "Search products"}
      </label>
      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/50">
        <Search className="h-4 w-4" aria-hidden="true" />
      </span>
      <Input
        id={searchId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? "Search collections"}
        className="h-12 w-full rounded-full border-white/20 bg-black/40 pl-10 pr-14 text-sm text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:ring-2 focus-visible:ring-white/40"
      />
      {value && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onReset}
          className="absolute inset-y-0 right-1 my-1 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
