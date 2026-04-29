"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Table from "@/components/Table";

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: ""
  });

  const API_URL = "/api/branches";

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBranches(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching branches:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingBranch ? "PUT" : "POST";
    const url = editingBranch ? `${API_URL}/${editingBranch._id}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        fetchBranches();
        closeModal();
      }
    } catch (error) {
      console.error("Error saving branch:", error);
    }
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      location: branch.location
    });
    setIsModalOpen(true);
  };

  const confirmDelete = (branch) => {
    setBranchToDelete(branch);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!branchToDelete) return;

    try {
      const res = await fetch(`${API_URL}/${branchToDelete._id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchBranches();
        setIsDeleteModalOpen(false);
        setBranchToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting branch:", error);
    }
  };

  const openModal = () => {
    setEditingBranch(null);
    setFormData({ name: "", location: "" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBranch(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Sucursales</h1>
        <Button onClick={openModal}>
          + Añadir Sucursal
        </Button>
      </div>

      {loading ? (
        <p>Cargando sucursales...</p>
      ) : branches.length === 0 ? (
        <p style={{ textAlign: "center", padding: "2rem", color: "var(--gray-text)" }}>
          No se encontraron sucursales. Crea una para comenzar.
        </p>
      ) : (
        <Table 
          headers={["Nombre", "Ubicación", "Acciones"]}
          data={branches}
          renderRow={(branch) => (
            <>
              <td style={{ fontWeight: "600" }}>{branch.name}</td>
              <td>{branch.location}</td>
              <td style={{ display: "flex", gap: "0.5rem" }}>
                <Button variant="secondary" onClick={() => handleEdit(branch)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => confirmDelete(branch)}>
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
        title={editingBranch ? "Editar Sucursal" : "Añadir Sucursal"}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
            <label>Ubicación</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1rem" }}>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              {editingBranch ? "Guardar Cambios" : "Crear"}
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
          ¿Estás seguro de que deseas eliminar la sucursal <strong>{branchToDelete?.name}</strong>? Esta acción no se puede deshacer.
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
