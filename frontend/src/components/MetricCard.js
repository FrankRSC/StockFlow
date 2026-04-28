"use client";

export default function MetricCard({
  title,
  value,
  background = "#f9fafb",
  titleColor = "var(--gray-text)",
  valueColor = "inherit",
}) {
  return (
    <div style={{ 
      padding: "1.5rem", 
      border: "1px solid var(--border)", 
      borderRadius: "0.5rem", 
      background 
    }}>
      <h4 style={{ 
        color: titleColor, 
        margin: 0, 
        fontSize: "0.875rem" 
      }}>
        {title}
      </h4>
      <span style={{ 
        fontSize: "2.5rem", 
        fontWeight: "bold", 
        color: valueColor 
      }}>
        {value}
      </span>
    </div>
  );
}
