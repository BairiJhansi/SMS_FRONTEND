import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FacultyDetails from "../components/FacultyDetails";

export default function FacultyERPDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [teaching, setTeaching] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const role = parseInt(localStorage.getItem("role_id"));

    // ❌ If not faculty → block
    if (role !== 2) {
      return <h3 style={{ padding: 30 }}>Access Denied</h3>;
      
    }

    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) throw new Error("User not logged in");

      const res = await axios.get(
        "http://localhost:5002/api/dashboard/faculty",
        { headers: { "x-user-id": user.user_id } }
      );

      if (res.data?.success) {
        setProfile(res.data.data?.faculty);
        setTeaching(res.data.data.teaching);
        setStats({ students: res.data.data.teaching.students });        console.log(res.data)
      } else {
        setError("Faculty data not found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load faculty profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ padding: "30px" }}>Loading...</p>;
  if (error) return <p style={{ padding: "30px", color: "red" }}>{error}</p>;

  return (
    <div style={container}>
      <h2 style={heading}>Faculty ERP Dashboard</h2>

      <div style={flexContainer}>
        {/* ===== PROFILE CARD ===== */}
        <div style={card}>
          <h3>Faculty Details</h3>
          <p><b>Name:</b> {profile.first_name} {profile.last_name}</p>
          <p><b>Email:</b> {profile.email}</p>
          <p><b>Department:</b> {profile.department_name}</p>
          <p><b>Designation:</b> {profile.designation}</p>
          <p><b>Phone:</b> {profile.phone_number || "N/A"}</p>
        </div>

        {/* ===== QUICK STATS + ACTIONS ===== */}
        <div style={{ ...card, flex: 1 }}>
          <h3>Quick Stats</h3>

          <div style={statsGrid}>
            <div style={statCard}>
              <b>Courses:</b> {teaching?.courses?.length || 0}
            </div>

            <div style={statCard}>
              <b>Assignments:</b> {teaching?.assignments?.length || 0}
            </div>

            <div style={statCard}>
              <b>Students:</b> {stats?.students || 0}
            </div>
          </div>

          <h3 style={{ marginTop: "20px" }}>Quick Actions</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button style={primaryBtn} onClick={() => navigate("/faculty-attendance")}>
            Mark Attendance
            </button>
            <button style={primaryBtn} onClick={() => navigate("/faculty/marks")}>
              Enter Marks</button>

            <button style={primaryBtn} onClick={() => navigate("/faculty-ach-details")}>
            Academic Portfolio</button>
    
            <button style={secondaryBtn} onClick={() => navigate("/faculty-details")}>
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================== STYLES =================== */
const container = { padding: "30px", background: "#f5f7fb", minHeight: "100vh" };
const heading = { marginBottom: "25px" };
const flexContainer = { display: "flex", gap: "20px", flexWrap: "wrap" };
const card = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  minWidth: "280px"
};
const statsGrid = { display: "flex", gap: "15px", flexWrap: "wrap", marginTop: "10px" };
const statCard = {
  background: "#f3f6fb",
  padding: "15px",
  borderRadius: "8px",
  fontWeight: "600",
  flex: 1,
  textAlign: "center"
};
const primaryBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "6px",
  cursor: "pointer"
};
const secondaryBtn = {
  background: "#e5e7eb",
  border: "none",
  padding: "10px 18px",
  borderRadius: "6px",
  cursor: "pointer"
};