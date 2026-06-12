import {
  Activity,
  Apple,
  Baby,
  Beaker,
  Bone,
  Brain,
  Droplet,
  Droplets,
  Dumbbell,
  Eye,
  FlaskConical,
  Gauge,
  Hand,
  HeartPulse,
  Leaf,
  type LucideIcon,
  Pill,
  Scale,
  Shield,
  ShieldCheck,
  Sparkles,
  SprayCan,
  Stethoscope,
  Sun,
  Thermometer,
  Watch,
  Wind,
  Zap,
} from "lucide-react";
import type { IconKey, Tint } from "@/types";

/**
 * Products ship without real photography in mock mode, so every product/
 * category gets a deterministic icon + tint visual. Swap `ProductVisual`
 * for <Image> once real CDN images are wired into `product.images`.
 */
export const iconMap: Record<IconKey, LucideIcon> = {
  pill: Pill,
  syrup: FlaskConical,
  drops: Droplets,
  cream: Hand,
  spray: SprayCan,
  powder: Beaker,
  protein: Dumbbell,
  herb: Leaf,
  supplement: Sparkles,
  heart: HeartPulse,
  bp: Gauge,
  glucose: Droplet,
  thermometer: Thermometer,
  oximeter: Activity,
  watch: Watch,
  band: Zap,
  scale: Scale,
  nebulizer: Wind,
  baby: Baby,
  hygiene: ShieldCheck,
  shield: Shield,
  stethoscope: Stethoscope,
  eye: Eye,
  sun: Sun,
  brain: Brain,
  bone: Bone,
  nutrition: Apple,
};

interface TintStyle {
  /** soft gradient surface behind product icons */
  surface: string;
  /** icon / accent text color */
  text: string;
  /** small filled chip (category cards, concern cards) */
  chip: string;
  /** ring/hover accent */
  ring: string;
}

export const tintStyles: Record<Tint, TintStyle> = {
  blue: {
    surface:
      "bg-gradient-to-br from-sky-100 via-sky-50 to-blue-100",
    text: "text-sky-600",
    chip: "bg-sky-100 text-sky-700",
    ring: "group-hover:ring-sky-200",
  },
  green: {
    surface:
      "bg-gradient-to-br from-emerald-100 via-emerald-50 to-teal-100",
    text: "text-emerald-600",
    chip: "bg-emerald-100 text-emerald-700",
    ring: "group-hover:ring-emerald-200",
  },
  mint: {
    surface:
      "bg-gradient-to-br from-teal-100 via-emerald-50 to-cyan-100",
    text: "text-teal-600",
    chip: "bg-teal-100 text-teal-700",
    ring: "group-hover:ring-teal-200",
  },
  sky: {
    surface:
      "bg-gradient-to-br from-cyan-100 via-sky-50 to-sky-100",
    text: "text-cyan-600",
    chip: "bg-cyan-100 text-cyan-700",
    ring: "group-hover:ring-cyan-200",
  },
  amber: {
    surface:
      "bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100",
    text: "text-amber-600",
    chip: "bg-amber-100 text-amber-700",
    ring: "group-hover:ring-amber-200",
  },
  rose: {
    surface:
      "bg-gradient-to-br from-rose-100 via-pink-50 to-pink-100",
    text: "text-rose-600",
    chip: "bg-rose-100 text-rose-700",
    ring: "group-hover:ring-rose-200",
  },
  violet: {
    surface:
      "bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100",
    text: "text-violet-600",
    chip: "bg-violet-100 text-violet-700",
    ring: "group-hover:ring-violet-200",
  },
  teal: {
    surface:
      "bg-gradient-to-br from-teal-100 via-cyan-50 to-emerald-100",
    text: "text-teal-600",
    chip: "bg-teal-100 text-teal-700",
    ring: "group-hover:ring-teal-200",
  },
};
