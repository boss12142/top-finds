import { getProducts, getCategories } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/types";

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
  all: "🔥",
};

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const data = await getProducts();
  const categories = await getCategories();
  const products = data.products;
  const featured = products.slice(0, 6);

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
          <span className="category-pill active">
            {CATEGORY_EMOJI.all} All
          </span>
          {categories.map((cat) => (
            <span key={cat} className="category-pill">
              {CATEGORY_EMOJI[cat.toLowerCase()] || "📦"} {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </span>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section id="products" style={{ paddingBottom: 60 }}>
        <div className="section-title">
          <h2>🏆 Trending Right Now</h2>
          <p>Handpicked products trending on Amazon</p>
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
