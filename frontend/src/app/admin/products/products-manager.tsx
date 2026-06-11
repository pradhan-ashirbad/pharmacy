"use client";

import * as React from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ProductVisual } from "@/components/shared/product-visual";
import { RatingStars } from "@/components/shared/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { allProducts } from "@/data/products";
import { categories } from "@/data/categories";
import { formatINR } from "@/lib/utils";
import type { Product, ProductCategorySlug, StoreKind } from "@/types";

interface ProductForm {
  name: string;
  brand: string;
  price: string;
  mrp: string;
  category: ProductCategorySlug;
  store: StoreKind;
  packSize: string;
  stockCount: string;
  description: string;
  prescriptionRequired: boolean;
}

const emptyForm: ProductForm = {
  name: "",
  brand: "",
  price: "",
  mrp: "",
  category: "otc-medicines",
  store: "medicines",
  packSize: "",
  stockCount: "100",
  description: "",
  prescriptionRequired: false,
};

export function ProductsManager() {
  // Local working copy — in production this talks to /api/admin/products.
  const [products, setProducts] = React.useState<Product[]>(allProducts);
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [form, setForm] = React.useState<ProductForm>(emptyForm);
  const [deleting, setDeleting] = React.useState<Product | null>(null);

  const filtered = products.filter((p) =>
    [p.name, p.brand, p.subcategory, p.id]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const startAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const startEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      brand: product.brand,
      price: String(product.price),
      mrp: String(product.mrp),
      category: product.category,
      store: product.store,
      packSize: product.packSize,
      stockCount: String(product.stockCount),
      description: product.description,
      prescriptionRequired: product.prescriptionRequired,
    });
    setOpen(true);
  };

  const valid =
    form.name.trim() &&
    form.brand.trim() &&
    Number(form.price) > 0 &&
    Number(form.mrp) >= Number(form.price);

  const save = () => {
    if (editing) {
      setProducts((list) =>
        list.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                name: form.name.trim(),
                brand: form.brand.trim(),
                price: Number(form.price),
                mrp: Number(form.mrp),
                category: form.category,
                store: form.store,
                packSize: form.packSize.trim() || p.packSize,
                stockCount: Number(form.stockCount) || 0,
                inStock: Number(form.stockCount) > 0,
                description: form.description.trim() || p.description,
                prescriptionRequired: form.prescriptionRequired,
              }
            : p
        )
      );
      toast.success("Product updated", { description: form.name });
    } else {
      const slug = form.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const product: Product = {
        id: `prd-${Date.now().toString(36)}`,
        slug,
        name: form.name.trim(),
        brand: form.brand.trim(),
        category: form.category,
        subcategory: categories.find((c) => c.slug === form.category)?.name ?? "General",
        store: form.store,
        price: Number(form.price),
        mrp: Number(form.mrp),
        rating: 0,
        reviewCount: 0,
        prescriptionRequired: form.prescriptionRequired,
        inStock: Number(form.stockCount) > 0,
        stockCount: Number(form.stockCount) || 0,
        packSize: form.packSize.trim() || "1 unit",
        description: form.description.trim() || "Newly added product.",
        highlights: [],
        manufacturer: form.brand.trim(),
        countryOfOrigin: "India",
        tags: ["new"],
        image: { icon: "pill", tint: "blue" },
      };
      setProducts((list) => [product, ...list]);
      toast.success("Product added", { description: product.name });
    }
    setOpen(false);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    setProducts((list) => list.filter((p) => p.id !== deleting.id));
    toast("Product deleted", { description: deleting.name });
    setDeleting(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Products</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} products in catalogue
          </p>
        </div>
        <Button onClick={startAdd} className="ml-auto">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, brand or ID…"
          aria-label="Search products"
          className="pl-9"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-card shadow-soft">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3.5 font-semibold">Product</th>
              <th className="px-5 py-3.5 font-semibold">Category</th>
              <th className="px-5 py-3.5 font-semibold">Price</th>
              <th className="px-5 py-3.5 font-semibold">Stock</th>
              <th className="px-5 py-3.5 font-semibold">Rating</th>
              <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((product) => (
              <tr key={product.id} className="transition-colors hover:bg-muted/40">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <ProductVisual
                      image={product.image}
                      className="h-10 w-10 shrink-0 rounded-lg"
                    />
                    <div className="min-w-0">
                      <p className="max-w-56 truncate font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.brand}
                        {product.prescriptionRequired && " · Rx"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  {product.subcategory}
                </td>
                <td className="px-5 py-3.5 font-medium">{formatINR(product.price)}</td>
                <td className="px-5 py-3.5">
                  {product.inStock ? (
                    <Badge variant="success">{product.stockCount} in stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out of stock</Badge>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  {product.rating > 0 ? (
                    <RatingStars rating={product.rating} />
                  ) : (
                    <span className="text-xs text-muted-foreground">No ratings</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${product.name}`}
                      onClick={() => startEdit(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${product.name}`}
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleting(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                  No products match “{query}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogDescription>
              {editing
                ? `Updating ${editing.name}`
                : "Add a new product to the catalogue."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="f-name">Product name</Label>
              <Input
                id="f-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-brand">Brand</Label>
              <Input
                id="f-brand"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-pack">Pack size</Label>
              <Input
                id="f-pack"
                value={form.packSize}
                placeholder="e.g. Strip of 10 tablets"
                onChange={(e) => setForm({ ...form, packSize: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-price">Selling price (₹)</Label>
              <Input
                id="f-price"
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-mrp">MRP (₹)</Label>
              <Input
                id="f-mrp"
                type="number"
                min={0}
                value={form.mrp}
                onChange={(e) => setForm({ ...form, mrp: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm({ ...form, category: v as ProductCategorySlug })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Store</Label>
              <Select
                value={form.store}
                onValueChange={(v) => setForm({ ...form, store: v as StoreKind })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medicines">Medicines</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="devices">Health Devices</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="f-stock">Stock count</Label>
              <Input
                id="f-stock"
                type="number"
                min={0}
                value={form.stockCount}
                onChange={(e) => setForm({ ...form, stockCount: e.target.value })}
              />
            </div>
            <div className="flex items-end gap-2 pb-1">
              <input
                id="f-rx"
                type="checkbox"
                checked={form.prescriptionRequired}
                onChange={(e) =>
                  setForm({ ...form, prescriptionRequired: e.target.checked })
                }
                className="h-4 w-4 accent-[hsl(var(--primary))]"
              />
              <Label htmlFor="f-rx" className="font-normal">
                Prescription required
              </Label>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="f-desc">Description</Label>
              <Textarea
                id="f-desc"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={save} disabled={!valid} className="mt-2">
            {editing ? "Save Changes" : "Add Product"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogDescription>
              “{deleting?.name}” will be permanently removed from the catalogue.
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
