import { useState } from "react";
import ChatPage from "./ChatPage";
import Announcements from "./Announcements";

export default function Communication() {
  const [tab, setTab] = useState("announcements");

  const user = JSON.parse(localStorage.getItem("user"));

  const role =
    user.role_id === 1
      ? "student"
      : user.role_id === 2
      ? "faculty"
      : "admin";

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.title}>Communication</div>

        <div style={styles.tabs}>

          {/* CHAT ONLY FOR STUDENT + FACULTY */}
          {(role === "student" || role === "faculty") && (
            <button
              onClick={() => setTab("chat")}
              style={{
                ...styles.tabBtn,
                ...(tab === "chat" && styles.activeTab)
              }}
            >
              Chat
            </button>
          )}

          <button
            onClick={() => setTab("announcements")}
            style={{
              ...styles.tabBtn,
              ...(tab === "announcements" && styles.activeTab)
            }}
          >
            Announcements
          </button>

        </div>
      </div>

      {/* BODY */}
      <div style={styles.body}>
        {tab === "chat" && (role !== "admin") && <ChatPage />}
        {tab === "announcements" && <Announcements />}
      </div>

    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f5f7fb"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    background: "#fff",
    borderBottom: "1px solid #e5e7eb"
  },

  title: {
    fontSize: "18px",
    fontWeight: "600"
  },

  tabs: {
    display: "flex",
    gap: "10px"
  },

  tabBtn: {
    padding: "8px 14px",
    borderRadius: "20px",
    border: "none",
    background: "#f1f5f9",
    cursor: "pointer",
    fontSize: "14px"
  },

  activeTab: {
    background: "#2563eb",
    color: "#fff"
  },

  body: {
    flex: 1,
    overflow: "hidden"
  }
};