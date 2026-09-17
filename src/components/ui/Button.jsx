import React from "react";

export const Button = ({
  children,
  variant = "primary",
  size = "medium",
  isLoading = false,
  disabled = false,
  onClick,
  type = "button",
  style = {},
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          color: "#3b82f6",
          border: "1px solid #3b82f6",
        };
      case "danger":
        return {
          backgroundColor: "#ef4444",
          color: "#ffffff",
          border: "none",
        };
      case "primary":
      default:
        return {
          background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
          color: "#ffffff",
          border: "none",
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return { padding: "6px 12px", fontSize: "0.875rem" };
      case "large":
        return { padding: "14px 28px", fontSize: "1.125rem" };
      case "medium":
      default:
        return { padding: "10px 20px", fontSize: "1rem" };
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        fontWeight: 600,
        cursor: disabled || isLoading ? "not-allowed" : "pointer",
        opacity: disabled || isLoading ? 0.6 : 1,
        transition: "all 0.2s ease-in-out",
        boxShadow: variant === "primary" ? "0 4px 14px rgba(59, 130, 246, 0.4)" : "none",
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default Button;
