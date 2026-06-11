"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatINR } from "@/lib/utils";

export interface StoreFilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  rxOnly: "all" | "rx" | "otc";
}

interface StoreFiltersProps {
  filters: StoreFilterState;
  onChange: (filters: StoreFilterState) => void;
  categoryOptions: { value: string; label: string }[];
  brandOptions: string[];
  maxPrice: number;
  showRxFilter?: boolean;
  onReset: () => void;
}

export function StoreFilters({
  filters,
  onChange,
  categoryOptions,
  brandOptions,
  maxPrice,
  showRxFilter = false,
  onReset,
}: StoreFiltersProps) {
  const toggleValue = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Filters
        </h3>
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onReset}>
          Clear all
        </Button>
      </div>

      {categoryOptions.length > 1 && (
        <>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Category</h4>
            <div className="space-y-2.5">
              {categoryOptions.map((option) => (
                <div key={option.value} className="flex items-center gap-2.5">
                  <Checkbox
                    id={`cat-${option.value}`}
                    checked={filters.categories.includes(option.value)}
                    onCheckedChange={() =>
                      onChange({
                        ...filters,
                        categories: toggleValue(filters.categories, option.value),
                      })
                    }
                  />
                  <Label
                    htmlFor={`cat-${option.value}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      <div>
        <h4 className="mb-3 text-sm font-semibold">Brand</h4>
        <div className="max-h-56 space-y-2.5 overflow-y-auto pr-1">
          {brandOptions.map((brand) => (
            <div key={brand} className="flex items-center gap-2.5">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={() =>
                  onChange({
                    ...filters,
                    brands: toggleValue(filters.brands, brand),
                  })
                }
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="cursor-pointer text-sm font-normal"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="mb-3 text-sm font-semibold">Price</h4>
        <Slider
          min={0}
          max={maxPrice}
          step={50}
          value={[filters.priceRange[0], filters.priceRange[1]]}
          onValueChange={([min, max]) =>
            onChange({ ...filters, priceRange: [min, max] })
          }
          aria-label="Price range"
        />
        <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatINR(filters.priceRange[0])}</span>
          <span>{formatINR(filters.priceRange[1])}</span>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Label htmlFor="instock" className="text-sm font-normal">
          In stock only
        </Label>
        <Switch
          id="instock"
          checked={filters.inStockOnly}
          onCheckedChange={(v) => onChange({ ...filters, inStockOnly: v })}
        />
      </div>

      {showRxFilter && (
        <>
          <Separator />
          <div>
            <h4 className="mb-3 text-sm font-semibold">Prescription</h4>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { value: "all", label: "All" },
                  { value: "otc", label: "No Rx needed" },
                  { value: "rx", label: "Rx required" },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange({ ...filters, rxOnly: option.value })}
                  className={
                    filters.rxOnly === option.value
                      ? "rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                      : "rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
