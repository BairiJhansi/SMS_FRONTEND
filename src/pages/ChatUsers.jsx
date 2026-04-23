import { useEffect, useState } from "react";
import axios from "axios";
import socket from "./socket"; 

export default function ChatUsers({ onSelect, mode, selectedUser }) {
  const [users, setUsers] = useState([]);
  const [unread, setUnread] = useState({});

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // ================= FETCH USERS =================
  useEffect(() => {
    const url =
      mode === "conversations"
        ? `http://localhost:5006/api/communication/conversations/${currentUser.user_id}`
        : `http://localhost:5006/api/communication/users/${currentUser.user_id}`;

    axios.get(url)
      .then(res => setUsers(res.data))
      .catch(console.error);

  }, [mode]);

  // ================= FETCH UNREAD =================
  const fetchUnread = () => {
    axios.get(`http://localhost:5006/api/communication/unread/${currentUser.user_id}`)
      .then(res => {
        const map = {};
        res.data.forEach(u => {
          map[u.id] = u.unread;
        });
        setUnread(map);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchUnread();
  }, []);
  useEffect(() => {
  socket.emit("join_user", currentUser.user_id);

  socket.on("unread_update", () => {
    fetchUnread(); // 🔥 auto refresh unread
  });

  return () => {
    socket.off("unread_update");
  };
}, []);

    useEffect(() => {
  const handler = () => fetchUnread();

  window.addEventListener("refreshUnread", handler);

  return () => {
    window.removeEventListener("refreshUnread", handler);
  };
}, []);
    useEffect(() => {
    socket.on("receive_message", (msg) => {

    setUsers(prev => {
        const updated = [...prev];

        const index = updated.findIndex(u =>
        u.user_id === msg.sender_id ||
        u.user_id === msg.receiver_id ||
        (u.type === "group" && u.course_id === msg.group_id)
        );

        if (index !== -1) {
        const [item] = updated.splice(index, 1);
        updated.unshift(item); // 🔥 move to top
        }

        return updated;
    });

    fetchUnread();
    });
    }, [mode]);

  // ================= FILTER USERS =================
  const filteredUsers =
    mode === "groups"
      ? users.filter(u => u.type === "group" && u.course_id)
      : mode === "users"
      ? users.filter(u => u.type !== "group" && u.user_id)
      : users.filter(u => u.user_id); // conversations safety

  // ================= UI =================
  return (
    <div style={styles.sidebar}>
      {[...filteredUsers]
        .sort((a,b)=>
        new Date(b.last_message_time || 0) - new Date(a.last_message_time || 0)
        )
        .map(user =>{

        const isSelected =
          user.type === "group"
            ? selectedUser?.course_id === user.course_id
            : selectedUser?.user_id === user.user_id;

        return (
          <div
            key={
              user.type === "group"
                ? `group-${user.course_id}`
                : user.user_id
            }
            style={{
              ...styles.user,
              background: isSelected ? "#e0edff" : "#fff"
            }}
            onClick={() => {
              onSelect(user);
              setTimeout(() => {
                    fetchUnread();
                }, 300); // refresh unread
            }}
          >

            {/* AVATAR */}
            <div style={styles.avatar}>
              {user.type === "group"
                ? "📚"
                : user.first_name?.charAt(0)}
            </div>

            <div style={styles.content}>

                {/* NAME */}
                <div style={styles.name}>
                    {user.type === "group"
                    ? user.first_name
                    : `${user.first_name} ${user.last_name || ""}`}
                </div>

                {/* 🟢 STUDENT ROLL */}
                {user.type === "student" && user.roll_number && (
                    <div style={styles.meta}>
                    {user.roll_number}
                    </div>
                )}

                {/* 🟢 FACULTY COURSE */}
                {user.type === "faculty" && user.course_name && (
                    <div style={styles.meta}>
                    {user.course_name}
                    </div>
                )}

                {/* 🔴 UNREAD BADGE */}
                {(
                    (user.type !== "group" && unread[user.user_id] > 0) ||
                    (user.type === "group" && unread[`group_${user.course_id}`] > 0)
                    ) && (
                    <div style={styles.badge}>
                        {user.type === "group"
                        ? unread[`group_${user.course_id}`]
                        : unread[user.user_id]}
                    </div>
                    )}

                </div>
          </div>
        );
      })}
    </div>
  );
}

// ================= STYLES =================
const styles = {
  sidebar: {
    overflowY: "auto",
    flex: 1
  },
  meta: {
  fontSize: "12px",
  color: "#6b7280"
},

  user: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    position: "relative", 
    borderBottom: "1px solid #f1f1f1",
    cursor: "pointer"
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600"
  },

  content: {
    display: "flex",
    flexDirection: "column"
  },

  name: {
    fontWeight: "600",
    fontSize: "14px",
  color: "#111827"
  },

  badge: {
    position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "#ef4444",
  color: "#fff",
  borderRadius: "999px",
  padding: "2px 6px",
  fontSize: "11px",
  fontWeight: "600",
  minWidth: "15px",
  textAlign: "center"
  }
};