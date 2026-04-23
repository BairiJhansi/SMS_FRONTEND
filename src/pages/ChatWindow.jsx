import { useEffect, useState, useRef } from "react";
import axios from "axios";
import socket from "./socket"; 

export default function ChatWindow({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const bottomRef = useRef();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // 🔔 Request notification permission
  useEffect(() => {
    Notification.requestPermission();
  }, []);

  // ✅ Join personal room once
  useEffect(() => {
    socket.emit("join_user", currentUser.user_id);
  }, []);
  
  useEffect(() => {
  socket.on("messages_seen", ({ sender_id }) => {

    if (selectedUser?.user_id === sender_id) {
      setMessages(prev =>
        prev.map(m =>
          m.sender_id === currentUser.user_id
            ? { ...m, is_seen: true }
            : m
        )
      );
    }

  });

  return () => {
    socket.off("messages_seen");
  };
}, [selectedUser]);

    useEffect(() => {
  if (!selectedUser) return;

  setTimeout(() => {
    // 🔥 refresh unread after opening chat
    window.dispatchEvent(new Event("refreshUnread"));
  }, 300);

}, [selectedUser]);

  // ✅ Join group
  useEffect(() => {
    if (selectedUser?.type === "group") {
      socket.emit("join_group", selectedUser.course_id);
    }
  }, [selectedUser]);

  // ✅ Fetch old messages
  useEffect(() => {
    if (!selectedUser) return;

    setMessages([]);

    const isGroup = selectedUser.type === "group";

    const url = isGroup
      ? `http://localhost:5006/api/communication/group/chat/${selectedUser.course_id}`
      : `http://localhost:5006/api/communication/chat/${currentUser.user_id}/${selectedUser.user_id}`;

    axios.get(url)
      .then(res => setMessages(res.data.data || res.data))
      .catch(console.error);

  }, [selectedUser]);
  useEffect(() => {
  if (!selectedUser) return;

  if (selectedUser.type !== "group") {
    axios.post("http://localhost:5006/api/communication/read", {
      sender_id: selectedUser.user_id,
      receiver_id: currentUser.user_id
    });
  }

}, [selectedUser]);

  // ✅ Socket listeners
  useEffect(() => {

    const handler = (msg) => {

        const isPrivate =
        selectedUser &&
        (
            msg.sender_id === selectedUser.user_id ||
            msg.receiver_id === selectedUser.user_id
        );

        const isGroup =
        selectedUser?.type === "group" &&
        msg.group_id === selectedUser.course_id;

        if (isPrivate || isGroup) {
        setMessages(prev => {
            const exists = prev.find(m => m.message_id === msg.message_id);
            if (exists) return prev;
            return [...prev, msg];
            });
        }

        // refresh unread always
        window.dispatchEvent(new Event("refreshUnread"));
    };

    socket.on("receive_message", handler);

    return () => socket.off("receive_message", handler);

    }, [selectedUser]);

    // ✅ Auto scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ✅ Send message
    const handleFile = (e) => {
        const f = e.target.files[0];
        if (!f) return;

        setFile(f);

        // image preview
        if (f.type.startsWith("image")) {
            setPreview(URL.createObjectURL(f));
        } else {
            setPreview(null);
        }
        };
  const sendMessage = async () => {
        try {
            if (!text.trim() && !file) return;

            const form = new FormData();

            form.append("sender_id", currentUser.user_id);
            form.append("message", text || "");

            if (selectedUser.type === "group") {
            form.append("group_id", selectedUser.course_id);
            } else {
            form.append("receiver_id", selectedUser.user_id);
            }

            if (file) form.append("file", file);

            await axios.post(
            "http://localhost:5006/api/communication/message",
            form,
            {
                headers: {
                "Content-Type": "multipart/form-data"
                }
            }
            );

            setText("");
            setFile(null);
            setPreview(null);

        } catch (err) {
            console.error(err);
        }
        };

  useEffect(() => {
    if (!selectedUser) return;

    if (selectedUser.type === "group") {
        axios.post("http://localhost:5006/api/communication/group/read", {
        group_id: selectedUser.course_id,
        user_id: currentUser.user_id
        });
        setMessages(prev =>
            prev.map(m =>
                m.sender_id === selectedUser.user_id
                ? { ...m, is_seen: true }
                : m
            )
            );
    }
    }, [selectedUser]);

  const isGroup = selectedUser?.type === "group";

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.avatar}>
          {isGroup ? "📚" : selectedUser?.first_name?.charAt(0)}
        </div>

        <div>
          <div style={styles.name}>
            {isGroup
              ? selectedUser.first_name
              : `${selectedUser.first_name} ${selectedUser.last_name}`}
          </div>
          <div style={styles.status}>
            {isGroup ? "Group Chat" : "Online"}
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div style={styles.messages}>
        <div style={styles.messagesInner}>
          {messages.map(m => (
            <div
              key={m.message_id}
              style={
                m.sender_id === currentUser.user_id
                  ? styles.myMsg
                  : styles.otherMsg
              }
            >
              {/* Full name in group */}
              {isGroup && m.sender_id !== currentUser.user_id && (
                <div style={styles.senderName}>
                  {m.first_name} {m.last_name || ""}
                </div>
              )}

              {/* TEXT */}
            {m.message_type === "text" && m.message}

            {/* IMAGE */}
            {m.message_type === "image" && (
            <img
                src={`http://localhost:5006${m.file_url}`}
                style={{ maxWidth: "200px", borderRadius: "10px" }}
            />
            )}

            {/* FILE */}
            {m.message_type === "file" && (
            <a
                href={`http://localhost:5006${m.file_url}`}
                target="_blank"
            >
                📎 {m.file_name}
            </a>
            )}

            {/* VIDEO */}
            {m.message_type === "video" && (
            <video controls width="200">
                <source src={`http://localhost:5006${m.file_url}`} />
            </video>
            )}

            {/* AUDIO */}
            {m.message_type === "audio" && (
            <audio controls>
                <source src={`http://localhost:5006${m.file_url}`} />
            </audio>
            )}

              {/* Seen / Delivered */}
              {m.sender_id === currentUser.user_id && (
                <div style={styles.statusTick}>
                  {m.is_seen ? "✔✔ Seen" : "✔ Delivered"}
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>


      {file && (
        <div style={styles.previewBox}>

            {/* image preview */}
            {preview && (
            <img src={preview} style={styles.previewImage} />
            )}

            {/* file preview */}
            {!preview && (
            <div style={styles.filePreview}>
                📄 {file.name}
            </div>
            )}

            {/* remove */}
            <button
            style={styles.removeBtn}
            onClick={() => {
                setFile(null);
                setPreview(null);
            }}
            >
            ✕
            </button>

        </div>
        )}

      {/* INPUT */}
      <div style={styles.inputArea}>

        {/* hidden file input */}
        <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFile}
        />

        {/* attach button */}
        <button
            style={styles.attachBtn}
            onClick={() => document.getElementById("fileInput").click()}
        >
            📎
        </button>

        <input
            value={text}
            onChange={e => setText(e.target.value)}
            style={styles.input}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button style={styles.sendBtn} onClick={sendMessage}>
            ➤
        </button>

        </div>

    </div>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", height: "100%", background: "#f3f4f6" },
  header: { display: "flex", alignItems: "center", gap: "10px", padding: "12px", background: "#fff" },
  avatar: { width: "35px", height: "35px", borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" },
  name: { fontWeight: "600" },
  status: { fontSize: "12px", color: "#22c55e" },
  messages: { flex: 1, overflowY: "auto", padding: "15px" },
  messagesInner: { display: "flex", flexDirection: "column" },
  myMsg: { alignSelf: "flex-end", background: "#2563eb", color: "#fff", padding: "10px", borderRadius: "18px", marginBottom: "10px" },
  otherMsg: { alignSelf: "flex-start", background: "#fff", padding: "10px", borderRadius: "18px", marginBottom: "10px" },
  senderName: { fontSize: "11px", fontWeight: "600", color: "#2563eb" },
  statusTick: { fontSize: "10px", marginTop: "2px" },
  inputArea: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px",
    borderTop: "1px solid #eee",
    background: "#fff",
    marginRight:"70px"
    },
    input: { flex: 1, padding: "10px", borderRadius: "20px",border : "1px solid #ddd",outline:"none"},
  sendBtn: {
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    cursor: "pointer"
    },
  attachBtn: {
  border: "none",
  background: "transparent",
  fontSize: "18px",
  cursor: "pointer",
  marginRight: "8px",
  padding:"5px"
},

previewBox: {
  padding: "10px",
  background: "#fff",
  borderTop: "1px solid #eee",
  position: "relative"
},

previewImage: {
  maxWidth: "150px",
  borderRadius: "10px"
},

filePreview: {
  background: "#f1f5f9",
  padding: "8px 12px",
  borderRadius: "8px",
  display: "inline-block"
},

removeBtn: {
  position: "absolute",
  right: "10px",
  top: "10px",
  border: "none",
  background: "#ef4444",
  color: "#fff",
  borderRadius: "50%",
  width: "20px",
  height: "20px",
  cursor: "pointer"
}
};