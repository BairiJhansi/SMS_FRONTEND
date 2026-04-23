import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminERPDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const role = parseInt(localStorage.getItem("role_id"));

  // ❌ If not admin → block access
  if (role !== 3) {
    navigate("/");
    return;
  }

  fetchStats();
}, []);

  const fetchStats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

    const res = await axios.get(
      "http://localhost:5002/api/admin/dashboard",
      {
        headers: {
          "x-user-id": user?.user_id
        }
      }
    );

      setStats(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Dashboard error", err);
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={{ padding: 20 }}>Loading Admin Dashboard...</h2>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin ERP Dashboard</h2>

      {/* ✅ STATS GRID */}
      <div style={grid}>
        <Card title="Students" value={stats.students} color="#2196f3" />
        <Card title="Faculty" value={stats.faculty} color="#9c27b0" />
        <Card title="Departments" value={stats.departments} color="#4caf50" />
        <Card title="Courses" value={stats.courses} color="#ff9800" />

        <Card title="Pending Fees" value={stats.pending_fees} color="#f44336" />
        <Card title="Partial Fees" value={stats.partial_fees} color="#ff9800" />
        <Card title="Paid Fees" value={stats.paid_fees} color="#4caf50" />

        <Card
          title="Collected Fees"
          value={`₹${Number(stats.collected_fees || 0).toLocaleString()}`}
          color="#009688"
        />
      </div>

      {/* ✅ ACTION BUTTONS (SEPARATE SECTION) */}
      <div style={actions}>
      
        <button style={btn} onClick={() => navigate("/admin/add-student")}>
          Add Student
        </button>

        <button style={btn} onClick={() => navigate("/admin/faculty")}>
          Manage Faculty
        </button>

        <button style={btn} onClick={() => navigate("/admin/students")}>
          View Students
        </button>

        <button style={btn} onClick={() => window.location.href="/admin/fees"}>
          Manage Fees
        </button>

        <button style={btn} onClick={() => window.location.href="/admin/promote"}>
          Promote Semester
        </button>

        <button style={btn} onClick={() => window.location.href="/communication"}>
          Announcements
        </button>

        <button>
          Results (next step)
        </button>
      </div>
    </div>
  );
};

const Card = ({ title, value, color }) => (
  <div
    style={{
      background: "#fff",
      padding: 20,
      borderRadius: 10,
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      borderLeft: `5px solid ${color}`,
    }}
  >
    <h4 style={{ margin: 0 }}>{title}</h4>
    <h2 style={{ color }}>{value ?? 0}</h2>
  </div>
);

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
  gap: 20,
  marginTop: 20,
};
const actions = {
  marginTop: 30,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
  gap: 15
};
const btn = {
  padding: 12,
  border: "none",
  borderRadius: 8,
  background: "#1976d2",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold"
};

export default AdminERPDashboard;