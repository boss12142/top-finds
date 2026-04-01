import { getProducts, getCategories, getProductsByCategory } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/types";
import Link from "next/link";

const CATEGORY_EMOJI: Record<string, string> = {
  electronics: "⚡",
  home: "🏠",
  kitchen: "🍳",
  beauty: "✨",
  toys: "🧸",
  fitness: "💪",
  tools: "🔧",
  office: "💼",
  pet: "🐾",
  baby: "👶",
  clothing: "👕",
  "tech accessories": "💻",
  gadgets: "🎮",
  all: "🔥",
};

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage({ searchParams }: { searchParams: { cat?: string } }) {
  const currentCategory = searchParams.cat?.toLowerCase() || 'all';
  const categories = await getCategories();

  let products = [];
  if (currentCategory === 'all') {
    const data = await getProducts();
    products = data.products;
  } else {
    products = await getProductsByCategory(currentCategory);
  }

  const featured = products.slice(0, 10); // Show up to 10 products per category view

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">🔥 Updated Daily</div>
          <h1>The Best Products<br />You Didn&apos;t Know You Needed</h1>
          <p>Curated top picks from Amazon. No fluff, just the best deals reviewed by real people.</p>
          <a href="#products" className="hero-cta">
            Explore Top Finds ↓
          </a>
        </div>
      </section>

      {/* Categories */}
      <section style={{ paddingBottom: 20 }}>
        <div className="category-pills">
          <Link href="/?cat=all" className={`category-pill ${currentCategory === 'all' ? 'active' : ''}`}>
            {CATEGORY_EMOJI.all} All
          </Link>
          {categories.map((cat) => (
            <Link key={cat} href={`/?cat=${cat}`} className={`category-pill ${currentCategory === cat.toLowerCase() ? 'active' : ''}`}>
              {CATEGORY_EMOJI[cat.toLowerCase()] || "📦"} {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Link>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section id="products" style={{ paddingBottom: 60 }}>
        <div className="section-title">
          <h2>{currentCategory === 'all' ? '🏆 Trending Right Now' : `📦 Top Picks: ${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}`}</h2>
          <p>Handpicked products {currentCategory === 'all' ? 'trending on Amazon' : `in ${currentCategory}`}</p>

        </div>

        {featured.length > 0 ? (
          <div className="product-grid">
            {featured.map((product: Product, i: number) => (
              <ProductCard key={product.asin} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>Products coming soon</h3>
            <p>We&apos;re curating the best finds for you. Check back soon!</p>
          </div>
        )}
      </section>
    </>
  );
}
