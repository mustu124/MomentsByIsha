import { Footer } from "@/components/footer";
import { CartWidget } from "@/components/cart/cart-widget";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { getCategories, getProducts, getSiteSettings } from "@/lib/data";
import { toTitleCase } from "@/lib/display-text";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CataloguePage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const [{ category: selectedCategory, q }, products, categories, settings] = await Promise.all([
    searchParams,
    getProducts(),
    getCategories(),
    getSiteSettings(),
  ]);
  const searchQuery = (q || "").trim().toLowerCase();
  const selectedCategoryRow = selectedCategory ? categories.find((category) => category.slug === selectedCategory) : null;
  const selectedParentRow = selectedCategoryRow?.parent_id
    ? categories.find((category) => category.id === selectedCategoryRow.parent_id) || null
    : selectedCategoryRow;
  const topLevelCategories = categories.filter((category) => !category.parent_id);
  const visibleSubcategories = selectedParentRow
    ? categories.filter((category) => category.parent_id === selectedParentRow.id)
    : [];
  const selectedCategoryIds = selectedCategoryRow
    ? [selectedCategoryRow.id, ...categories.filter((category) => category.parent_id === selectedCategoryRow.id).map((category) => category.id)]
    : [];
  const filteredByCategory = selectedCategory
    ? products.filter((product) => product.categories?.slug === selectedCategory || selectedCategoryIds.includes(product.category_id || ""))
    : products;
  const filtered = searchQuery
    ? filteredByCategory.filter((product) =>
        [product.name, product.description, product.price, product.categories?.name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery),
      )
    : filteredByCategory;

  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-ink/10 bg-[#dfc3a4] py-12 text-center md:py-16 xl:py-20">
          <div className="luxury-container">
            <p className="text-xs tracking-[0.08em] text-ink/60 sm:text-sm">Shop All</p>
            <h1 className="serif-title mx-auto mt-2 max-w-4xl text-4xl font-semibold leading-none sm:text-6xl lg:text-7xl xl:text-8xl">Aroma, Made Collectible.</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-ink/68 sm:mt-5 sm:text-base sm:leading-8">
              Discover hand-poured candles and keepsake aromas made for gifting,
              quiet rituals, and corners of your home that deserve a little glow.
            </p>
            {searchQuery ? (
              <p className="mt-5 text-sm tracking-[0.04em] text-ink/68">
                Showing {filtered.length} Result{filtered.length === 1 ? "" : "s"} For "{q}"
              </p>
            ) : null}
          </div>
        </section>

        <section className="luxury-container pb-24 pt-10 sm:pb-10">
        <div className="mb-8 space-y-3 border-b border-ink/10 pb-5 md:mb-10">
          <div className="flex justify-start gap-2 overflow-x-auto md:justify-center">
            <a href="/catalogue" className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs sm:px-5 sm:text-sm ${!selectedCategory ? "border-ink bg-ink text-porcelain" : "border-ink/14 bg-[#fffaf4]/70"}`}>All</a>
            {topLevelCategories.map((category) => (
              <a key={category.id} href={`/catalogue?category=${category.slug}`} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs sm:px-5 sm:text-sm ${selectedCategory === category.slug ? "border-ink bg-ink text-porcelain" : "border-ink/14 bg-[#fffaf4]/70"}`}>
                {toTitleCase(category.name)}
              </a>
            ))}
          </div>
          {visibleSubcategories.length ? (
            <div className="flex justify-start gap-2 overflow-x-auto md:justify-center">
              {visibleSubcategories.map((category) => (
                <a key={category.id} href={`/catalogue?category=${category.slug}`} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs sm:px-5 sm:text-sm ${selectedCategory === category.slug ? "border-ink bg-ink text-porcelain" : "border-ink/14 bg-[#fffaf4]/70"}`}>
                  {toTitleCase(category.name)}
                </a>
              ))}
            </div>
          ) : null}
        </div>
        <section className="grid grid-cols-2 items-stretch gap-x-4 gap-y-10 sm:gap-x-5 sm:gap-y-12 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[1800px]:grid-cols-6">
          {filtered.map((product) => <ProductCard key={product.id} product={product} settings={settings} />)}
        </section>
        {!filtered.length ? (
          <div className="py-16 text-center">
            <p className="serif-title text-4xl font-semibold">No Matching Moments Found.</p>
            <a href="/catalogue" className="button-line mt-5 inline-block text-sm">View All Products</a>
          </div>
        ) : null}
        </section>
      </main>
      <CartWidget settings={settings} />
      <Footer settings={settings} />
    </>
  );
}
