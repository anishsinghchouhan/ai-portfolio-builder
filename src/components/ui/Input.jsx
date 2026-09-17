import React from "react";

export const Input = ({
  label,
  error,
  type = "text",
  placeholder = "",
  value,
  onChange,
  name,
  id,
  style = {},
  ...props
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
      {label && (
        <label htmlFor={id || name} style={{ fontSize: "0.875rem", fontWeight: 500, color: "#e2e8f0" }}>
          {label}
        </label>
      )}
      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: "8px",
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          border: error ? "1px solid #ef4444" : "1px solid rgba(255, 255, 255, 0.15)",
          color: "#ffffff",
          outline: "none",
          fontSize: "0.95rem",
          transition: "border-color 0.2s ease",
          ...style,
        }}
        {...props}
      />
      {error && <span style={{ fontSize: "0.75rem", color: "#ef4444" }}>{error}</span>}
    </div>
  );
};

export default Input;
