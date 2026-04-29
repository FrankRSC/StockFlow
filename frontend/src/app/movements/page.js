"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Table from "@/components/Table";
import Badge from "@/components/Badge";

export default function MovementsPage() {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    type: "in",
    productId: "",
    originBranchId: "",
    destinationBranchId: "",
    quantity: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [movsRes, prodRes, branchRes] = await Promise.all([
          fetch("/api/movements"),
          fetch("/api/products"),
          fetch("/api/branches"),
        ]);
        
        const movsData = await movsRes.json();
        const prodData = await prodRes.json();
        const branchData = await branchRes.json();

        setMovements(movsData);
        setProducts(prodData);
        setBranches(branchData);
        
        if (prodData.length > 0) {
          setFormData(prev => ({ ...prev, productId: prodData[0]._id }));
        }
        if (branchData.length > 0) {
          setFormData(prev => ({
            ...prev,
            originBranchId: branchData[0]._id,
            destinationBranchId: branchData[0]._id
          }));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/movements");
        const data = await res.json();
        setMovements(data);
      } catch (err) {
        console.error("Error polling movements:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side basic validation
    if (formData.type === "out" || formData.type === "transfer") {
      if (!formData.originBranchId) {
        setError("Debe seleccionar una sucursal de origen.");
        return;
      }
    }
    if (formData.type === "in" || formData.type === "transfer") {
      if (!formData.destinationBranchId) {
        setError("Debe seleccionar una sucursal de destino.");
        return;
      }
    }

    if (formData.type === "transfer" && formData.originBranchId === formData.destinationBranchId) {
      setError("La sucursal de origen y destino no pueden ser la misma.");
      return;
    }

    if (Number(formData.quantity) <= 0) {
      setError("La cantidad debe ser mayor a cero.");
      return;
    }

    try {
      const res = await fetch("/api/movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          product: formData.productId,
          originBranch: (formData.type === "out" || formData.type === "transfer") ? formData.originBranchId : undefined,
          destinationBranch: (formData.type === "in" || formData.type === "transfer") ? formData.destinationBranchId : undefined,
          quantity: Number(formData.quantity),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Error al realizar el movimiento.");
        return;
      }

      // Success: refresh movements
      const movsRes = await fetch("/api/movements");
      const movsData = await movsRes.json();
      setMovements(movsData);
      setIsModalOpen(false);
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        quantity: 1
      }));
    } catch (err) {
      console.error("Error submitting movement:", err);
      setError("Error de conexión con el servidor.");
    }
  };

  const openModal = () => {
    setError("");
    setIsModalOpen(true);
  };

  const getBranchName = (id) => {
    if (!id) return "-";
    const b = branches.find((branch) => branch._id === id);
    return b ? b.name : "Desconocida";
  };

  const getProductName = (id) => {
    const p = products.find((prod) => prod._id === id);
    return p ? p.name : "Desconocido";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="page-title">Movimientos de Inventario</h1>
        <Button onClick={openModal}>+ Registrar Movimiento</Button>
      </div>

      {loading ? (
        <p>Cargando movimientos...</p>
      ) : movements.length === 0 ? (
        <p style={{ textAlign: "center", padding: "2rem", color: "var(--gray-text)" }}>
          No se han registrado movimientos todavía.
        </p>
      ) : (
        <Table
          headers={["Fecha", "Producto", "Tipo", "Origen", "Destino", "Cantidad", "Estado"]}
          data={movements}
          renderRow={(mov) => (
            <>
              <td>{new Date(mov.date || mov.createdAt).toLocaleString()}</td>
              <td style={{ fontWeight: "600" }}>{mov.product?.name || getProductName(mov.product)}</td>
              <td>
                <Badge type={mov.type} />
              </td>
              <td>{mov.originBranch?.name || getBranchName(mov.originBranch?._id || mov.originBranch)}</td>
              <td>{mov.destinationBranch?.name || getBranchName(mov.destinationBranch?._id || mov.destinationBranch)}</td>
              <td>{mov.quantity}</td>
              <td>
                <Badge 
                  status={mov.status} 
                  title={mov.failureReason || ''}
                />
              </td>
            </>
          )}
        />

      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Movimiento">
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ color: "var(--danger)", background: "#fee2e2", padding: "0.75rem", borderRadius: "0.375rem", marginBottom: "1rem", fontSize: "0.875rem" }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Tipo de Movimiento</label>
            <select name="type" value={formData.type} onChange={handleInputChange}>
              <option value="in">Entrada</option>
              <option value="out">Salida</option>
              <option value="transfer">Transferencia</option>
            </select>
          </div>

          <div className="form-group">
            <label>Producto</label>
            <select name="productId" value={formData.productId} onChange={handleInputChange} required>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>
          </div>

          {(formData.type === "out" || formData.type === "transfer") && (
            <div className="form-group">
              <label>Sucursal de Origen</label>
              <select name="originBranchId" value={formData.originBranchId} onChange={handleInputChange} required>
                {branches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(formData.type === "in" || formData.type === "transfer") && (
            <div className="form-group">
              <label>Sucursal de Destino</label>
              <select name="destinationBranchId" value={formData.destinationBranchId} onChange={handleInputChange} required>
                {branches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Cantidad</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2rem" }}>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar Movimiento
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
