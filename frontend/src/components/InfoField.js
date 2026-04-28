"use client";

export default function InfoField({ label, value, children }) {
  return (
    <div>
      <span style={{ fontSize: "0.75rem", color: "var(--gray-text)", display: "block", marginBottom: "0.25rem" }}>
        {label}
      </span>
      {value ? (
        <span style={{ fontWeight: "500" }}>{value}</span>
      ) : (
        children
      )}
    </div>
  );
}
