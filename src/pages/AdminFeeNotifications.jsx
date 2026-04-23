import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5002/api/admin/fees";

export default function AdminFeeNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);

  const [form, setForm] = useState({
    title: "",
    fee_type_id: "",
    semester: "",
    amount: "",
    due_date: "",
    apply_to: "all"
  });

  useEffect(() => {
    fetchNotifications();
    fetchFeeTypes();
  }, []);

  // ✅ GET NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/notification`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Fetch notifications error:", err);
    }
  };

  // ✅ GET FEE TYPES
  const fetchFeeTypes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/types/all`);
      console.log("Fee Types:", res.data);
      setFeeTypes(res.data);
    } catch (err) {
      console.error("Fetch fee types error:", err);
    }
  };

  // ✅ CREATE NOTIFICATION
  const createNotification = async () => {
    try {
      await axios.post(`${BASE_URL}/notification`, form);
      alert("Notification created");
      fetchNotifications();
    } catch (err) {
      console.error("Create error:", err);
      alert("Failed to create notification");
    }
  };

  // ✅ GENERATE FEES
  const generateFees = async (id) => {
    try {
      await axios.post(`${BASE_URL}/generate`, {
        notification_id: id
      });

      alert("Fees Generated Successfully 🎉");
    } catch (err) {
      console.error("Generate error:", err);
      alert("Fee generation failed");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800 }}>

      <h2>Create Fee Notification</h2>

      {/* FORM */}
      <div style={styles.form}>

      {/* TITLE */}
      <label style={styles.label}>Title</label>
      <input
        placeholder="Enter title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
        style={styles.input}
      />

      {/* FEE TYPE */}
      <label style={styles.label}>Fee Type</label>
      <select
        value={form.fee_type_id}
        onChange={(e) =>
          setForm({ ...form, fee_type_id: e.target.value })
        }
        style={styles.input}
      >
        <option value="">Select Fee Type</option>
        {feeTypes.map((f) => (
          <option key={f.fee_type_id} value={f.fee_type_id}>
            {f.name}
          </option>
        ))}
      </select>

      {/* SEMESTER */}
      <label style={styles.label}>Semester</label>
      <input
        placeholder="Enter semester (e.g., 1,2,3...)"
        value={form.semester}
        onChange={(e) =>
          setForm({ ...form, semester: e.target.value })
        }
        style={styles.input}
      />

      {/* AMOUNT */}
      <label style={styles.label}>Amount (₹)</label>
      <input
        placeholder="Enter amount"
        value={form.amount}
        onChange={(e) =>
          setForm({ ...form, amount: e.target.value })
        }
        style={styles.input}
      />

      {/* DUE DATE */}
      <label style={styles.label}>Due Date</label>
      <input
        type="date"
        value={form.due_date}
        onChange={(e) =>
          setForm({ ...form, due_date: e.target.value })
        }
        style={styles.input}
      />

      <button onClick={createNotification} style={styles.button}>
        Create Notification
      </button>
    </div>

      <hr />

      <h2>Fee Notifications</h2>

      {/* LIST */}
      {notifications.length === 0 ? (
        <p>No notifications found</p>
      ) : (
        notifications.map((n) => (
          <div key={n.notification_id} style={styles.card}>

            <h3>{n.title}</h3>

            <p><b>Type:</b> {n.fee_type}</p>
            <p><b>Amount:</b> ₹{n.amount}</p>
            <p><b>Due Date:</b> {n.due_date}</p>
            <p><b>Semester:</b> {n.semester || "All"}</p>

            <button
              onClick={() => generateFees(n.notification_id)}
              style={styles.button}
            >
              Generate Fees
            </button>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 20
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc"
  },
  button: {
    padding: 10,
    background: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold"
  },
  card: {
    border: "1px solid #ddd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    background: "#fff"
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 5
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc"
  },
  button: {
    padding: 10,
    background: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: 10
  },
  card: {
    border: "1px solid #ddd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    background: "#fff"
  }
};