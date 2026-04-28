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
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="page-title">Products</h1>
        <Button onClick={openModal}>
          + Add Product
        </Button>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: "center", padding: "2rem", color: "var(--gray-text)" }}>
          No products found. Create one to get started.
        </p>
      ) : (
        <Table 
          headers={["SKU", "Name", "Category", "Price", "Actions"]}
          data={products}
          renderRow={(product) => (
            <>
              <td style={{ fontWeight: "600" }}>{product.sku}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price.toFixed(2)}</td>
              <td style={{ display: "flex", gap: "0.5rem" }}>
                <Button variant="secondary" onClick={() => handleEdit(product)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => confirmDelete(product)}>
                  Delete
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
        title={editingProduct ? "Edit Product" : "Add Product"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Price</label>
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
          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2rem" }}>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingProduct ? "Save Changes" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        title="Confirm Delete"
      >
        <p style={{ marginBottom: "2rem", color: "var(--gray-text)" }}>
          Are you sure you want to delete the product <strong>{productToDelete?.name}</strong>? This action cannot be undone.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
