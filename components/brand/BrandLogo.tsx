"use client";

import Image from "next/image";
import Link from "next/link";

/** Processed from official litre-images assets — do not redraw in SVG. */
const BRAND = {
  light: { src: "/brand/logo-light.png", width: 1984, height: 453 },
  dark: { src: "/brand/logo-dark.png", width: 1984, height: 453 },
  mark: { src: "/brand/mark.png", width: 615, height: 426 },
  markLight: { src: "/brand/mark-light.png", width: 414, height: 170 },
} as const;

type MarkProps = {
  size?: number;
  className?: string;
  inverted?: boolean;
  animate?: boolean;
};

export function BrandMark({
  size = 40,
  className = "",
  inverted = false,
}: MarkProps) {
  const asset = inverted ? BRAND.markLight : BRAND.mark;
  const w = Math.round(size * (asset.width / asset.height));

  return (
    <Image
      src={asset.src}
      alt=""
      width={w}
      height={size}
      className={`block h-auto w-auto max-w-full object-contain object-left ${className}`}
      style={{ height: size, width: w, maxWidth: "100%" }}
      aria-hidden
      priority
    />
  );
}

type Product = "prediction" | "bet";

type LogoProps = {
  href?: string | null;
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
  showWordmark?: boolean;
  product?: Product;
  className?: string;
  animate?: boolean;
};

const heights = { sm: 32, md: 40, lg: 48 } as const;

export default function BrandLogo({
  href = "/",
  size = "md",
  inverted = false,
  showWordmark = true,
  className = "",
}: LogoProps) {
  const h = heights[size];
  const asset = showWordmark
    ? inverted
      ? BRAND.dark
      : BRAND.light
    : inverted
      ? BRAND.markLight
      : BRAND.mark;
  const w = Math.round(h * (asset.width / asset.height));

  const content = (
    <span className={`inline-flex items-center min-w-0 max-w-full ${className}`}>
      <Image
        src={asset.src}
        alt="LitreGre Prediction"
        width={w}
        height={h}
        className="block max-h-full max-w-full w-auto h-auto object-contain object-left"
        style={{ height: h, maxWidth: w }}
        priority
      />
    </span>
  );

  if (!href) return content;
  return (
    <Link
      href={href}
      className="flex-shrink-0 min-w-0 max-w-full hover:opacity-90 transition-opacity"
    >
      {content}
    </Link>
  );
}
