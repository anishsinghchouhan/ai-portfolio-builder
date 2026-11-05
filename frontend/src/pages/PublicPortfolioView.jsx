import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { isReservedSlug, ROUTES } from "../constants/routes";
import NotFoundPage from "./NotFoundPage";
import CandidatePortfolioView from "../components/portfolio/CandidatePortfolioView";

export const PublicPortfolioView = () => {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug || isReservedSlug(slug)) {
      setIsLoading(false);
      setError("NOT_FOUND");
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    api
      .get(`/public/portfolios/${slug}`)
      .then((res) => {
        if (isMounted) {
          setPortfolio(res.data?.data || res.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setIsLoading(false);
          setError(err.response?.status === 404 ? "NOT_FOUND" : "SERVER_ERROR");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isReservedSlug(slug) || error === "NOT_FOUND") {
    return <NotFoundPage />;
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#0b0f17",
          color: "#fff",
        }}
      >
        <p style={{ color: "#94a3b8" }}>Loading portfolio...</p>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#0b0f17",
          color: "#fff",
          padding: "20px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <h2>Portfolio Unavailable</h2>
          <p style={{ color: "#94a3b8", margin: "16px 0 24px" }}>
            This portfolio might be currently offline or draft-only.
          </p>
          <Link
            to={ROUTES.HOME}
            style={{
              padding: "10px 20px",
              background: "#6366f1",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const themeBg = portfolio?.content?.themeConfig?.bg || "#0b0f17";
  const themeRadius = portfolio?.content?.themeConfig?.radius
    ? `${portfolio.content.themeConfig.radius}px`
    : "20px";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: themeBg,
        padding: "32px 16px",
        boxSizing: "border-box",
        transition: "background-color 0.25s ease",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          borderRadius: themeRadius,
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.35)",
          overflow: "hidden",
        }}
      >
        <CandidatePortfolioView
          portfolio={portfolio}
          user={portfolio.user}
          sections={portfolio.content?.sections}
          isPublic={true}
        />
      </div>
    </div>
  );
};

export default PublicPortfolioView;
