import Image from "next/image";
import type { Category } from "@/lib/types";

export function CollectionCard({ category }: { category: Category; index: number }) {
  const imageSrc = category.slug.includes("wax") ? "/collections/sachets.jpg" : "/collections/candle.jpg";

  return (
    <a
      href={`/catalogue?category=${category.slug}`}
      className="group relative flex min-h-[320px] overflow-hidden rounded-[2.35rem] bg-[#ead4bd] p-6 md:min-h-[380px]"
    >
      <Image
        src={imageSrc}
        alt={`${category.name} collection`}
        fill
        sizes="(min-width: 768px) 45vw, 92vw"
        className="object-cover object-center transition duration-700 group-hover:scale-[1.045]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#2a1b12]/72 via-[#8d613a]/34 to-[#fffaf4]/12" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,250,244,0.28),transparent_24rem)]" />
      <div className="relative mt-auto text-[#fffaf4] drop-shadow-[0_2px_14px_rgba(42,27,18,0.22)]">
        <h3 className="serif-title text-4xl font-semibold lowercase md:text-5xl">{category.name}</h3>
        <p className="mt-3 max-w-sm text-sm leading-6 opacity-90">{category.description}</p>
        <span className="button-line mt-6 inline-block text-sm lowercase">shop collection</span>
      </div>
    </a>
  );
}
