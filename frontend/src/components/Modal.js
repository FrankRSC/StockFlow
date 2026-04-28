"use client";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: "1.5rem", color: title === "Confirm Delete" ? "var(--danger)" : "inherit" }}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
