import { useState } from "react";
import ChatUsers from "./ChatUsers";
import ChatWindow from "./ChatWindow";

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [mode, setMode] = useState("conversations");
  
  return (
    <div style={styles.container}>
      
      {/* LEFT SIDEBAR */}
      <div style={styles.left}>

        {/* HEADER */}
        <div style={styles.sidebarHeader}>
          Messages
        </div>

        {/* TABS */}
        <div style={styles.tabs}>
          <button
            onClick={() => setMode("conversations")}
            style={{
              ...styles.tabBtn,
              ...(mode === "conversations" && styles.activeTab)
            }}
          >
            Chats
          </button>

          <button
            onClick={() => setMode("users")}
            style={{
              ...styles.tabBtn,
              ...(mode === "users" && styles.activeTab)
            }}
          >
            Users
          </button>

          <button
            onClick={() => setMode("groups")}
            style={{
              ...styles.tabBtn,
              ...(mode === "groups" && styles.activeTab)
            }}
          >
            Groups
          </button>
        </div>

        {/* USER LIST */}
        <ChatUsers
          mode={mode}
          onSelect={setSelectedUser}
          selectedUser={selectedUser}
        />
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        {selectedUser ? (
          <ChatWindow selectedUser={selectedUser} />
        ) : (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>💬</div>
            <div style={styles.emptyText}>
              Select a chat to start messaging
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100%",
    background: "#f5f7fb"
  },

  /* SIDEBAR */
  left: {
    width: "320px",
    background: "#fff",
    borderRight: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column"
  },

  sidebarHeader: {
    padding: "15px",
    fontWeight: "600",
    borderBottom: "1px solid #eee"
  },

  tabs: {
    display: "flex",
    padding: "10px",
    borderBottom: "1px solid #eee",
    gap: "10px"
  },

  tabBtn: {
    flex: 1,
    padding: "8px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    background: "#f1f5f9",
    fontSize: "13px"
  },

  activeTab: {
    background: "#2563eb",
    color: "#fff"
  },

  /* RIGHT */
  right: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },

  /* EMPTY STATE */
  empty: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280"
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "10px"
  },

  emptyText: {
    fontSize: "16px"
  }
};