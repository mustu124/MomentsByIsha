import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  invert?: boolean;
};

const imageSizes = {
  sm: "h-10 w-10",
  md: "h-16 w-16",
  lg: "h-20 w-20",
  xl: "h-20 w-20 sm:h-28 sm:w-28",
};

export function BrandLogo({ href = "/", size = "md", showText = true, invert = false }: BrandLogoProps) {
  const content = (
    <span className="inline-flex items-center gap-3">
      <span className={`relative block shrink-0 overflow-hidden ${imageSizes[size]}`}>
        <Image
          src="/brand/moments-by-isha-logo.png"
          alt="Moments By Isha logo"
          fill
          sizes={size === "xl" ? "112px" : size === "lg" ? "80px" : size === "md" ? "64px" : "40px"}
          className="h-full w-full object-cover"
          priority={size === "lg" || size === "xl"}
        />
      </span>
      {showText ? (
        <span className={`serif-title leading-none ${invert ? "text-porcelain" : "text-ink"} ${size === "sm" ? "text-2xl" : "text-3xl"}`}>
          Moments By Isha
        </span>
      ) : null}
    </span>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
