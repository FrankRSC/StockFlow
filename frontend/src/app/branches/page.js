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
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="page-title">Branches</h1>
        <Button onClick={openModal}>
          + Add Branch
        </Button>
      </div>

      {loading ? (
        <p>Loading branches...</p>
      ) : branches.length === 0 ? (
        <p style={{ textAlign: "center", padding: "2rem", color: "var(--gray-text)" }}>
          No branches found. Create one to get started.
        </p>
      ) : (
        <Table 
          headers={["Name", "Location", "Actions"]}
          data={branches}
          renderRow={(branch) => (
            <>
              <td style={{ fontWeight: "600" }}>{branch.name}</td>
              <td>{branch.location}</td>
              <td style={{ display: "flex", gap: "0.5rem" }}>
                <Button variant="secondary" onClick={() => handleEdit(branch)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => confirmDelete(branch)}>
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
        title={editingBranch ? "Edit Branch" : "Add Branch"}
      >
        <form onSubmit={handleSubmit}>
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
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2rem" }}>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingBranch ? "Save Changes" : "Create"}
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
          Are you sure you want to delete the branch <strong>{branchToDelete?.name}</strong>? This action cannot be undone.
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
