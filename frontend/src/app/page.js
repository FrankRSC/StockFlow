"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import Table from "@/components/Table";
import Button from "@/components/Button";
import MetricCard from "@/components/MetricCard";
import Badge from "@/components/Badge";
import InfoField from "@/components/InfoField";

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters for Movements
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");

  // Detail modal
  const [selectedMovement, setSelectedMovement] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, branchRes, stockRes, movsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/branches"),
          fetch("/api/stocks"),
          fetch("/api/movements"),
        ]);

        const prodData = await prodRes.json();
        const branchData = await branchRes.json();
        const stockData = await stockRes.json();
        const movsData = await movsRes.json();

        setProducts(prodData);
        setBranches(branchData);
        setStocks(stockData);
        setMovements(movsData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(async () => {
      try {
        const [stockRes, movsRes] = await Promise.all([
          fetch("/api/stocks"),
          fetch("/api/movements"),
        ]);
        const stockData = await stockRes.json();
        const movsData = await movsRes.json();
        setStocks(stockData);
        setMovements(movsData);
      } catch (err) {
        console.error("Error polling dashboard:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Computed: Products with total stock & branch breakdown
  const productsWithStock = products.map((prod) => {
    const prodStocks = stocks.filter(
      (s) => (s.product?._id || s.product) === prod._id
    );
    const totalStock = prodStocks.reduce(
      (sum, s) => sum + (s.quantity || 0),
      0
    );

    const stockByBranch = branches.map((b) => {
      const branchStock = prodStocks.find(
        (s) => (s.branch?._id || s.branch) === b._id
      );
      return {
        branchId: b._id,
        branchName: b.name,
        quantity: branchStock ? branchStock.quantity : 0,
      };
    });

    return {
      ...prod,
      totalStock,
      stockByBranch,
    };
  });

  // Computed: Movements filtered
  const filteredMovements = movements.filter((mov) => {
    const matchesStatus = statusFilter === "all" || mov.status === statusFilter;

    const originId = mov.originBranch?._id || mov.originBranch;
    const destId = mov.destinationBranch?._id || mov.destinationBranch;
    const matchesBranch =
      branchFilter === "all" ||
      originId === branchFilter ||
      destId === branchFilter;

    return matchesStatus && matchesBranch;
  });

  const getBranchName = (id) => {
    if (!id) return "-";
    const b = branches.find((branch) => branch._id === id);
    return b ? b.name : "Desconocida";
  };

  const getProductName = (id) => {
    const p = products.find((prod) => prod._id === id);
    return p ? p.name : "Desconocido";
  };

  const openDetail = (movement) => {
    setSelectedMovement(movement);
    setIsDetailOpen(true);
  };

  if (loading && products.length === 0) {
    return <p style={{ padding: "2rem", textAlign: "center" }}>Cargando Dashboard...</p>;
  }

  const pendingCount = movements.filter(m => m.status === "pending").length;
  const failedCount = movements.filter(m => m.status === "failed").length;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 className="page-title">Dashboard Operativo</h1>
        <p style={{ color: "var(--gray-text)" }}>
          Vista en tiempo real del estado de inventario y flujo logístico.
        </p>
      </div>

      {/* Summary Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        <MetricCard 
          title="Movimientos Pendientes" 
          value={pendingCount} 
          background="#fef3c7" 
          titleColor="#d97706" 
          valueColor="#d97706" 
        />
        <MetricCard 
          title="Movimientos Fallidos" 
          value={failedCount} 
          background="#fee2e2" 
          titleColor="#dc2626" 
          valueColor="#dc2626" 
        />
        <MetricCard 
          title="Total Productos" 
          value={products.length} 
        />
        <MetricCard 
          title="Sucursales Operativas" 
          value={branches.length} 
        />
      </div>

      {/* 1. Lista de Productos */}
      <div style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1.5rem" }}>Control Global de Productos</h2>
        <Table
          headers={["Producto", "SKU", "Stock Total", "Stock por Sucursal"]}
          data={productsWithStock}
          renderRow={(prod) => (
            <>
              <td style={{ fontWeight: "600" }}>{prod.name}</td>
              <td><code style={{ background: "var(--gray-light)", padding: "0.125rem 0.25rem", borderRadius: "0.25rem" }}>{prod.sku}</code></td>
              <td style={{ fontWeight: "bold", color: prod.totalStock === 0 ? "var(--danger)" : "inherit" }}>
                {prod.totalStock}
              </td>
              <td>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {prod.stockByBranch.map((b, i) => (
                    <span
                      key={i}
                      style={{
                        background: b.quantity === 0 ? "#f9fafb" : "#f0fdf4",
                        color: b.quantity === 0 ? "var(--gray-text)" : "#16a34a",
                        border: `1px solid ${b.quantity === 0 ? "var(--border)" : "#bbf7d0"}`,
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.375rem",
                        fontSize: "0.75rem",
                      }}
                    >
                      <strong>{b.branchName}:</strong> {b.quantity}
                    </span>
                  ))}
                </div>
              </td>
            </>
          )}
        />
      </div>

      {/* 2. Lista de Movimientos */}
      <div style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", margin: 0 }}>Bitácora de Flujos Logísticos</h2>
          
          {/* Filters Panel */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <label style={{ margin: 0 }}>Estado:</label>
              <select 
                style={{ width: "auto", padding: "0.375rem 0.75rem" }}
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="pending">Pendiente</option>
                <option value="processed">Procesado</option>
                <option value="failed">Fallido</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <label style={{ margin: 0 }}>Sucursal:</label>
              <select 
                style={{ width: "auto", padding: "0.375rem 0.75rem" }}
                value={branchFilter} 
                onChange={(e) => setBranchFilter(e.target.value)}
              >
                <option value="all">Todas</option>
                {branches.map(b => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredMovements.length === 0 ? (
          <p style={{ border: "1px solid var(--border)", padding: "2rem", textAlign: "center", borderRadius: "0.5rem", color: "var(--gray-text)" }}>
            No se encontraron movimientos con los filtros seleccionados.
          </p>
        ) : (
          <Table
            headers={["Fecha", "Producto", "Tipo", "Cantidad", "Estado", "Acción"]}
            data={filteredMovements}
            renderRow={(mov) => (
              <>
                <td>{new Date(mov.date || mov.createdAt).toLocaleString()}</td>
                <td style={{ fontWeight: "600" }}>{mov.product?.name || getProductName(mov.product)}</td>
                <td>
                  <Badge type={mov.type} />
                </td>
                <td>{mov.quantity}</td>
                <td>
                  <Badge status={mov.status} />
                </td>
                <td>
                  <button 
                    onClick={() => openDetail(mov)} 
                    className="btn btn-secondary" 
                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.875rem" }}
                  >
                    Ver Detalle
                  </button>
                </td>
              </>
            )}
          />
        )}
      </div>

      {/* 3. Detalle de Movimiento (Modal) */}
      {selectedMovement && (
        <Modal 
          isOpen={isDetailOpen} 
          onClose={() => setIsDetailOpen(false)} 
          title="Detalle del Movimiento"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <InfoField label="ID de Movimiento">
              <code style={{ color: "var(--foreground)", wordBreak: "break-all" }}>{selectedMovement._id}</code>
            </InfoField>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <InfoField label="Fecha y Hora" value={new Date(selectedMovement.date || selectedMovement.createdAt).toLocaleString()} />
              <InfoField label="Tipo de Flujo">
                <Badge type={selectedMovement.type} />
              </InfoField>
            </div>

            <div style={{ background: "var(--gray-light)", padding: "1rem", borderRadius: "0.5rem" }}>
              <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "var(--gray-text)" }}>Producto</h4>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "600", fontSize: "1.125rem" }}>{selectedMovement.product?.name || getProductName(selectedMovement.product)}</span>
                <span style={{ color: "var(--gray-text)", fontSize: "0.875rem" }}>Cant: <strong>{selectedMovement.quantity}</strong></span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <InfoField 
                label="Sucursal Origen" 
                value={selectedMovement.originBranch?.name || getBranchName(selectedMovement.originBranch?._id || selectedMovement.originBranch)} 
              />
              <InfoField 
                label="Sucursal Destino" 
                value={selectedMovement.destinationBranch?.name || getBranchName(selectedMovement.destinationBranch?._id || selectedMovement.destinationBranch)} 
              />
            </div>

            <InfoField label="Estado Actual">
              <Badge status={selectedMovement.status} />
            </InfoField>

            {selectedMovement.status === "failed" && (
              <div style={{ background: "#fee2e2", color: "#dc2626", padding: "1rem", borderRadius: "0.5rem", fontSize: "0.875rem", border: "1px solid #fca5a5" }}>
                <strong>Error de Procesamiento:</strong> {selectedMovement.failureReason || "Razón desconocida"}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
              <Button onClick={() => setIsDetailOpen(false)} type="button">Cerrar</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

