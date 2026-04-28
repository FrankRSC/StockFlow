"use client";

export default function Button({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary", 
  className = "", 
  style = {},
  ...props 
}) {
  const baseClass = "btn";
  const variantClass = `btn-${variant}`;
  
  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${className}`}
      onClick={onClick}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}
