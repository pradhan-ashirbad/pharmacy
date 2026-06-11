"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product } from "@/types";

export function ProductDetailsTabs({ product }: { product: Product }) {
  const hasSpecs = (product.specifications?.length ?? 0) > 0;

  return (
    <Tabs defaultValue="description">
      <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-2xl p-1.5 scrollbar-none">
        <TabsTrigger value="description">Description</TabsTrigger>
        {product.ingredients && (
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
        )}
        {(product.dosage || product.usage) && (
          <TabsTrigger value="usage">Dosage & Usage</TabsTrigger>
        )}
        {hasSpecs && <TabsTrigger value="specs">Specifications</TabsTrigger>}
        {product.sideEffects && (
          <TabsTrigger value="side-effects">Side Effects</TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="description" className="mt-4">
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <p className="leading-relaxed text-muted-foreground">
            {product.description}
          </p>
          <h3 className="mt-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Key Highlights
          </h3>
          <ul className="mt-3 space-y-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </TabsContent>

      {product.ingredients && (
        <TabsContent value="ingredients" className="mt-4">
          <div className="rounded-2xl border bg-card p-6 shadow-soft">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Composition
            </h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {product.ingredients.map((ing) => (
                <li
                  key={ing}
                  className="rounded-lg bg-muted/60 px-3.5 py-2.5 text-sm font-medium"
                >
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      )}

      {(product.dosage || product.usage) && (
        <TabsContent value="usage" className="mt-4">
          <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-soft">
            {product.dosage && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Dosage
                </h3>
                <p className="mt-2 text-sm leading-relaxed">{product.dosage}</p>
              </div>
            )}
            {product.usage && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  How to Use
                </h3>
                <p className="mt-2 text-sm leading-relaxed">{product.usage}</p>
              </div>
            )}
            <p className="rounded-lg bg-accent/60 p-3 text-xs text-accent-foreground">
              This information is not a substitute for medical advice. Always
              follow your doctor&apos;s instructions.
            </p>
          </div>
        </TabsContent>
      )}

      {hasSpecs && (
        <TabsContent value="specs" className="mt-4">
          <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
            <table className="w-full text-sm">
              <tbody>
                {product.specifications!.map((spec, i) => (
                  <tr key={spec.label} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                    <td className="w-1/3 px-5 py-3 font-medium">{spec.label}</td>
                    <td className="px-5 py-3 text-muted-foreground">{spec.value}</td>
                  </tr>
                ))}
                {product.warranty && (
                  <tr
                    className={
                      product.specifications!.length % 2 === 0 ? "bg-muted/40" : ""
                    }
                  >
                    <td className="w-1/3 px-5 py-3 font-medium">Warranty</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {product.warranty}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      )}

      {product.sideEffects && (
        <TabsContent value="side-effects" className="mt-4">
          <div className="rounded-2xl border bg-card p-6 shadow-soft">
            <ul className="space-y-2">
              {product.sideEffects.map((effect) => (
                <li key={effect} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                  {effect}
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-lg bg-accent/60 p-3 text-xs text-accent-foreground">
              Consult your doctor if you experience any unusual symptoms after
              taking this product.
            </p>
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
}
