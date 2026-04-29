"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Table from "@/components/Table";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    price: "",
    category: ""
  });

  const API_URL = "/api/products";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingProduct ? "PUT" : "POST";
    const url = editingProduct ? `${API_URL}/${editingProduct._id}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price)
        })
      });

      if (res.ok) {
        fetchProducts();
        closeModal();
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      price: product.price,
      category: product.category
    });
    setIsModalOpen(true);
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const res = await fetch(`${API_URL}/${productToDelete._id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchProducts();
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const openModal = () => {
    setEditingProduct(null);
    setFormData({ sku: "", name: "", price: "", category: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Productos</h1>
        <Button onClick={openModal}>
          + Añadir Producto
        </Button>
      </div>

      {loading ? (
        <p>Cargando productos...</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: "center", padding: "2rem", color: "var(--gray-text)" }}>
          No se encontraron productos. Crea uno para comenzar.
        </p>
      ) : (
        <Table 
          headers={["SKU", "Nombre", "Categoría", "Precio", "Acciones"]}
          data={products}
          renderRow={(product) => (
            <>
              <td style={{ fontWeight: "600" }}>{product.sku}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price.toFixed(2)}</td>
              <td style={{ display: "flex", gap: "0.5rem" }}>
                <Button variant="secondary" onClick={() => handleEdit(product)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => confirmDelete(product)}>
                  Eliminar
                </Button>
              </td>
            </>
          )}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingProduct ? "Editar Producto" : "Añadir Producto"}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="form-group" style={{ display: "flex", flexDirection: "column" }}>
            <label>SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group" style={{ display: "flex", flexDirection: "column" }}>
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group" style={{ display: "flex", flexDirection: "column" }}>
            <label>Categoría</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group" style={{ display: "flex", flexDirection: "column" }}>
            <label>Precio</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1rem" }}>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              {editingProduct ? "Guardar Cambios" : "Crear"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Confirmar Eliminación"
      >
        <p style={{ marginBottom: "2rem", color: "var(--gray-text)" }}>
          ¿Estás seguro de que deseas eliminar el producto <strong>{productToDelete?.name}</strong>? Esta acción no se puede deshacer.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  );
}
