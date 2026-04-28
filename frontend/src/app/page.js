import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="page-title">Welcome to StockFlow</h1>
        <p style={{ color: "var(--gray-text)", fontSize: "1.125rem" }}>
          Your simple inventory and warehouse management system.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginTop: "3rem" }}>
        <div style={{ border: "1px solid var(--border)", padding: "2rem", borderRadius: "0.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ color: "var(--primary)", marginBottom: "1rem", fontSize: "1.5rem" }}>Products</h2>
            <p style={{ color: "var(--gray-text)", marginBottom: "2rem", lineHeight: "1.6" }}>
              Manage your product catalog, track SKUs, update pricing, and categorize items effectively.
            </p>
          </div>
          <Link href="/products" className="btn btn-primary" style={{ textAlign: "center", display: "block" }}>
            Go to Products
          </Link>
        </div>

        <div style={{ border: "1px solid var(--border)", padding: "2rem", borderRadius: "0.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ color: "var(--primary)", marginBottom: "1rem", fontSize: "1.5rem" }}>Branches</h2>
            <p style={{ color: "var(--gray-text)", marginBottom: "2rem", lineHeight: "1.6" }}>
              Monitor warehouse locations, track multiple store branches, and optimize stock distribution.
            </p>
          </div>
          <Link href="/branches" className="btn btn-primary" style={{ textAlign: "center", display: "block" }}>
            Go to Branches
          </Link>
        </div>
      </div>
    </div>
  );
}
