"use client";

export default function Badge({ type, status, children, className = "", style = {}, ...props }) {
  if (type) {
    const labels = {
      in: "Entrada",
      out: "Salida",
      adjustment: "Ajuste",
      transfer: "Transferencia"
    };
    return (
      <span 
        className={`badge badge-${type} ${className}`} 
        style={style}
        {...props}
      >
        {labels[type] || type}
      </span>
    );
  }

  if (status) {
    const labels = {
      pending: "Pendiente",
      failed: "Fallido",
      processed: "Procesado"
    };
    const finalStatus = status || "processed";
    const defaultStyle = finalStatus === 'failed' ? { cursor: 'help', ...style } : style;
    return (
      <span 
        className={`badge badge-${finalStatus} ${className}`} 
        style={defaultStyle}
        {...props}
      >
        {labels[finalStatus] || finalStatus}
      </span>
    );
  }

  return (
    <span 
      className={`badge ${className}`} 
      style={style}
      {...props}
    >
      {children}
    </span>
  );
}
