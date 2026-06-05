import Image from "next/image";

type ProductImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  variant?: "card" | "hero" | "detail" | "thumb" | "admin";
};

const variantClasses = {
  card: "aspect-[4/5]",
  hero: "min-h-[480px] sm:min-h-[560px] lg:min-h-[620px]",
  detail: "aspect-[4/5] min-h-[340px] sm:min-h-[500px] lg:min-h-0",
  thumb: "aspect-square",
  admin: "aspect-[4/5]",
};

export function ProductImage({ src, alt, sizes, priority = false, variant = "card" }: ProductImageProps) {
  return (
    <div className={`product-image-frame ${variantClasses[variant]}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="product-image"
        />
      ) : (
        <div className="grid h-full place-items-center text-sm text-ink/45">Image pending</div>
      )}
      <div className="product-image-warmth" />
    </div>
  );
}
