import React from "react";
import "./Skeleton.css";

export const Skeleton = ({
  width = "100%",
  height = "20px",
  borderRadius = "8px",
  variant = "rect", // "rect" | "circle" | "text"
  className = "",
  style = {},
  ...props
}) => {
  const dynamicStyles = {
    width: variant === "circle" ? height : width,
    height,
    borderRadius: variant === "circle" ? "50%" : borderRadius,
    ...style,
  };

  return (
    <div
      className={`skeleton-shimmer-box ${variant} ${className}`}
      style={dynamicStyles}
      aria-hidden="true"
      {...props}
    />
  );
};

export default Skeleton;
