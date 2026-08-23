import Link from "next/link";

type Props = {
  href?: string;
  size?: "sm" | "md" | "lg";
  /** Dark header / footer on ink backgrounds */
  inverted?: boolean;
  showWordmark?: boolean;
  className?: string;
};

const sizes = {
  sm: { mark: 28, text: "text-base" },
  md: { mark: 34, text: "text-lg" },
  lg: { mark: 40, text: "text-xl" },
};

/** Custom mark: rising odds spike — not a stock trophy. */
export function BrandMark({
  size = 34,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="40" height="40" rx="11" fill="currentColor" className="text-primary" />
      <path
        d="M9 27.5V22l5.2-7.2 4.1 5.4L26.5 10 31 10.8 22.2 27.5H9Z"
        fill="#ECFDF5"
      />
      <path
        d="M26.5 10l4.5.8-2.2 4.1-2.3-4.9Z"
        fill="#A3E635"
      />
      <circle cx="29.5" cy="12.2" r="2.2" fill="#A3E635" />
    </svg>
  );
}

export default function BrandLogo({
  href = "/",
  size = "md",
  inverted = false,
  showWordmark = true,
  className = "",
}: Props) {
  const s = sizes[size];
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <BrandMark size={s.mark} />
      {showWordmark && (
        <span
          className={`font-display font-bold tracking-wide leading-none ${s.text} ${
            inverted ? "text-white" : "text-base-content"
          }`}
        >
          LitreGre
          <span className={inverted ? "text-lime-300" : "text-primary"}>
            {" "}
            Prediction
          </span>
        </span>
      )}
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} className="flex-shrink-0 hover:opacity-90 transition-opacity">
      {content}
    </Link>
  );
}
