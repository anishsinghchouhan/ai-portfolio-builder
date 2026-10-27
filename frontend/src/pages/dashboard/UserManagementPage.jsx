import React, { useState } from "react";
import { useDashboardTheme } from "../../context/DashboardThemeContext";
import "./UserManagementPage.css";

export const UserManagementPage = ({ onBack }) => {
  const { theme } = useDashboardTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const [users, setUsers] = useState([
    { id: "u_1", name: "Alex Morgan", email: "alex.morgan@email.com", role: "Pro Candidate", status: "Active", joined: "Oct 2026" },
    { id: "u_2", name: "Sarah Jenkins", email: "sarah.j@vercel.com", role: "Super Admin", status: "Active", joined: "May 2025" },
    { id: "u_3", name: "David Chen", email: "dchen@stripe.com", role: "Pro Candidate", status: "Active", joined: "Jan 2026" },
    { id: "u_4", name: "Marcus Vance", email: "marcus.vance@gmail.com", role: "Free User", status: "Suspended", joined: "Sep 2026" },
  ]);

  const handleAction = (id, action) => {
    alert(`User ${id} action performed: ${action}`);
  };

  return (
    <div className={`user-mgmt-root ${theme}`}>
      <div className="user-mgmt-header-bar">
        <div>
          <h1>User Account Management</h1>
          <p>Search, filter, edit roles, suspend accounts, and view user audit logs.</p>
        </div>

        <button style={{ padding: "0.55rem 1.35rem", borderRadius: "999px", background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", color: "#ffffff", border: "none", fontWeight: 700, cursor: "pointer" }}>
          + Add New User
        </button>
      </div>

      <div className="user-mgmt-card-box">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          style={{ width: "320px", height: "42px", borderRadius: "999px", background: "#0b0f19", border: "1px solid var(--color-border-dark)", color: "#ffffff", padding: "0 1rem", fontSize: "0.85rem", outline: "none", marginBottom: "1rem" }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <table className="user-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ fontWeight: 700, color: "#ffffff" }}>{u.name}</td>
                <td style={{ color: "#94a3b8" }}>{u.email}</td>
                <td style={{ color: "#818cf8", fontWeight: 600 }}>{u.role}</td>
                <td>
                  <span style={{ padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700, background: u.status === "Active" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: u.status === "Active" ? "#34d399" : "#f87171" }}>
                    {u.status}
                  </span>
                </td>
                <td style={{ color: "#94a3b8" }}>{u.joined}</td>
                <td>
                  <button style={{ padding: "0.3rem 0.65rem", borderRadius: "999px", background: "rgba(255,255,255,0.06)", border: "1px solid var(--color-border-dark)", color: "#ffffff", fontSize: "0.75rem", cursor: "pointer", marginRight: "6px" }} onClick={() => handleAction(u.id, "Edit Profile")}>
                    Edit
                  </button>
                  <button style={{ padding: "0.3rem 0.65rem", borderRadius: "999px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: "0.75rem", cursor: "pointer" }} onClick={() => handleAction(u.id, "Suspend")}>
                    Suspend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;
