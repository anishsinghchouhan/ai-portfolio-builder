import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { isReservedSlug, ROUTES } from "../constants/routes";
import NotFoundPage from "./NotFoundPage";

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

  const content = portfolio.content || {};
  const personal = content.personal || {};
  const name = personal.name || portfolio.title || "Portfolio";
  const headline = personal.headline || "Professional Portfolio";
  const bio = personal.bio || content.about?.description || "";
  const skills = Array.isArray(content.skills) ? content.skills : [];
  const projects = portfolio.projects || content.projects || [];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0b0f17",
        color: "#f8fafc",
        fontFamily: "Inter, sans-serif",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        {/* Header */}
        <header style={{ marginBottom: "40px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "30px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "8px" }}>{name}</h1>
          <p style={{ fontSize: "1.2rem", color: "#818cf8", marginBottom: "16px" }}>{headline}</p>
          {bio && <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "1rem" }}>{bio}</p>}
        </header>

        {/* Skills */}
        {skills.length > 0 && (
          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px" }}>Skills</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: "6px 14px",
                    background: "rgba(99, 102, 241, 0.15)",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                    borderRadius: "999px",
                    color: "#a5b4fc",
                    fontSize: "0.85rem",
                  }}
                >
                  {typeof skill === "object" ? skill.name : skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px" }}>Projects</h2>
            <div style={{ display: "grid", gap: "16px" }}>
              {projects.map((proj, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "20px",
                    background: "rgba(15, 23, 42, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "12px",
                  }}
                >
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "6px" }}>{proj.title}</h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6 }}>{proj.description}</p>
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#38bdf8", fontSize: "0.85rem", display: "inline-block", marginTop: "8px" }}
                    >
                      View Live Project →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer style={{ marginTop: "60px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px", color: "#64748b", fontSize: "0.85rem" }}>
          Built with <Link to={ROUTES.HOME} style={{ color: "#818cf8", textDecoration: "none" }}>Portfolio.ai</Link>
        </footer>
      </div>
    </div>
  );
};

export default PublicPortfolioView;
