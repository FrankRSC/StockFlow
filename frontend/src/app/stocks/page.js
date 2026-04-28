"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Table from "@/components/Table";

export default function StocksPage() {
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    productId: "",
    branchId: "",
    quantity: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stockRes, prodRes, branchRes] = await Promise.all([
          fetch("/api/stocks"),
          fetch("/api/products"),
          fetch("/api/branches"),
        ]);

        const stockData = await stockRes.json();
        const prodData = await prodRes.json();
        const branchData = await branchRes.json();

        setStocks(stockData);
        setProducts(prodData);
        setBranches(branchData);

        if (prodData.length > 0) {
          setFormData((prev) => ({ ...prev, productId: prodData[0]._id }));
        }
        if (branchData.length > 0) {
          setFormData((prev) => ({ ...prev, branchId: branchData[0]._id }));
        }
      } catch (err) {
        console.error("Error fetching stock data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.productId || !formData.branchId) {
      setError("Debe seleccionar un producto y una sucursal.");
      return;
    }

    if (Number(formData.quantity) < 0) {
      setError("La cantidad no puede ser negativa.");
      return;
    }

    try {
      const res = await fetch("/api/stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: formData.productId,
          branch: formData.branchId,
          quantity: Number(formData.quantity),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Error al actualizar el stock.");
        return;
      }

      // Refresh stocks list
      const stockRes = await fetch("/api/stocks");
      const stockData = await stockRes.json();
      setStocks(stockData);
      setIsModalOpen(false);

      setFormData((prev) => ({
        ...prev,
        quantity: 0,
      }));
    } catch (err) {
      console.error("Error updating stock:", err);
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 className="page-title">Gestión de Stock</h1>
        <Button onClick={() => setIsModalOpen(true)}>+ Ajustar Stock</Button>
      </div>

      {loading ? (
        <p>Cargando inventario...</p>
      ) : stocks.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "var(--gray-text)",
          }}
        >
          No hay registros de stock todavía.
        </p>
      ) : (
        <Table
          headers={["SKU", "Producto", "Sucursal", "Cantidad", "Último Ajuste"]}
          data={stocks}
          renderRow={(item) => (
            <>
              <td>{item.product?.sku || "N/A"}</td>
              <td style={{ fontWeight: "600" }}>{item.product?.name || "Desconocido"}</td>
              <td>{item.branch?.name || "N/A"}</td>
              <td style={{ fontWeight: "600", color: item.quantity === 0 ? "var(--danger)" : "inherit" }}>
                {item.quantity}
              </td>
              <td>{new Date(item.updatedAt || item.createdAt).toLocaleString()}</td>
            </>
          )}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajustar Cantidad de Stock"
      >
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                color: "var(--danger)",
                background: "#fee2e2",
                padding: "0.75rem",
                borderRadius: "0.375rem",
                marginBottom: "1rem",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Producto</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleInputChange}
              required
            >
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Sucursal</label>
            <select
              name="branchId"
              value={formData.branchId}
              onChange={handleInputChange}
              required
            >
              {branches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Cantidad</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "flex-end",
              marginTop: "2rem",
            }}
          >
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar Stock
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
