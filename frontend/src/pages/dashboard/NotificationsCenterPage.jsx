import React, { useState } from "react";
import "./NotificationsCenterPage.css";

export const NotificationsCenterPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications, setNotifications] = useState([
    {
      id: "notif_1",
      category: "ai",
      title: "⚡ AI Project Recommendation",
      message: "Sync 2 new open-source projects from GitHub to boost your recruiter engagement score by +35%.",
      time: "5 minutes ago",
      isUnread: true,
      icon: "✨",
    },
    {
      id: "notif_2",
      category: "visitor",
      title: "👁️ Recruiter Visit from Apple",
      message: "A Senior Technical Recruiter from Apple (Cupertino, CA) downloaded your PDF Resume.",
      time: "25 minutes ago",
      isUnread: true,
      icon: "💼",
    },
    {
      id: "notif_3",
      category: "system",
      title: "🛡️ Custom Domain SSL Active",
      message: "SSL certificate for alexmorgan.portfolio.ai has been automatically renewed for 1 year.",
      time: "2 hours ago",
      isUnread: true,
      icon: "🔒",
    },
    {
      id: "notif_4",
      category: "portfolio",
      title: "🚀 Live Update Published",
      message: "Version 2.4 update published successfully to Global Edge CDN.",
      time: "4 hours ago",
      isUnread: false,
      icon: "🌐",
    },
    {
      id: "notif_5",
      category: "template",
      title: "🎨 3 New Modern Themes Released",
      message: "Check out the new Vercel Ultra Dark, Linear Glass, and Notion Minimal themes in Theme Studio.",
      time: "1 day ago",
      isUnread: false,
      icon: "🎨",
    },
    {
      id: "notif_6",
      category: "ai",
      title: "✨ ATS Resume Score Improved",
      message: "Your AI bullet point optimization increased candidate match rate to 99.8% for Senior Engineer roles.",
      time: "2 days ago",
      isUnread: false,
      icon: "📄",
    },
  ]);

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isUnread: false } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isUnread: false })));
  };

  const handleDeleteNotif = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all notifications?")) {
      setNotifications([]);
    }
  };

  const filteredNotifs = notifications.filter((item) => {
    const matchesCategory =
      activeFilter === "all" ||
      (activeFilter === "unread" && item.isUnread) ||
      item.category === activeFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  return (
    <div className="notifications-page-root">
      <div className="notifications-card-container">
        {/* Header Bar */}
        <div className="notifications-header-bar">
          <div className="notifications-title-group">
            <h2>Notifications Center</h2>
            <p>
              Stay updated on recruiter visits, AI suggestions, and system deployment status.
              {unreadCount > 0 && (
                <strong style={{ color: "#818cf8", marginLeft: "8px" }}>
                  ({unreadCount} Unread)
                </strong>
              )}
            </p>
          </div>

          <div className="notifications-global-actions">
            {unreadCount > 0 && (
              <button type="button" className="btn-mark-all-read" onClick={handleMarkAllAsRead}>
                ✓ Mark All Read
              </button>
            )}
            {notifications.length > 0 && (
              <button type="button" className="btn-clear-all" onClick={handleClearAll}>
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Controls Row: Search & Category Filters */}
        <div className="notifications-controls-row">
          <div className="notif-search-field">
            <svg className="notif-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="notif-filter-tabs">
            <button
              className={`filter-tab-btn ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All ({notifications.length})
            </button>
            <button
              className={`filter-tab-btn ${activeFilter === "unread" ? "active" : ""}`}
              onClick={() => setActiveFilter("unread")}
            >
              Unread ({unreadCount})
            </button>
            <button
              className={`filter-tab-btn ${activeFilter === "ai" ? "active" : ""}`}
              onClick={() => setActiveFilter("ai")}
            >
              AI Suggestions
            </button>
            <button
              className={`filter-tab-btn ${activeFilter === "visitor" ? "active" : ""}`}
              onClick={() => setActiveFilter("visitor")}
            >
              Recruiter Activity
            </button>
            <button
              className={`filter-tab-btn ${activeFilter === "system" ? "active" : ""}`}
              onClick={() => setActiveFilter("system")}
            >
              System Alerts
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifs.length > 0 ? (
          <div className="notifications-list">
            {filteredNotifs.map((item) => (
              <div
                key={item.id}
                className={`notification-card-item ${item.isUnread ? "unread" : ""}`}
              >
                <div className="notif-item-left">
                  {item.isUnread && <span className="unread-pulse-badge" />}
                  <div className={`notif-category-icon ${item.category}`}>
                    <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                  </div>
                  <div className="notif-item-body">
                    <h4>{item.title}</h4>
                    <p>{item.message}</p>
                    <span className="notif-timestamp-tag">⏱️ {item.time}</span>
                  </div>
                </div>

                <div className="notif-item-actions">
                  {item.isUnread && (
                    <button
                      type="button"
                      className="btn-notif-action"
                      onClick={() => handleMarkAsRead(item.id)}
                      title="Mark as read"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-notif-action delete"
                    onClick={() => handleDeleteNotif(item.id)}
                    title="Delete notification"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="notif-empty-state">
            <div className="notif-empty-icon">🔔</div>
            <h3>No notifications found</h3>
            <p>You're all caught up! There are no active notifications matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsCenterPage;
