import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResultsDashboard() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentId();
  }, []);

  // STEP 1: get student_id
  const fetchStudentId = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.user_id) return;

      const res = await axios.get(
        `http://localhost:5002/api/student/user/${user.user_id}`
      );

      fetchMarks(res.data.student_id);
    } catch (err) {
      console.error("Student fetch error", err);
    }
  };

  // STEP 2: fetch internal marks
  const fetchMarks = async (studentId) => {
    try {
      const res = await axios.get(
        `http://localhost:5002/api/marks/student/marks/${studentId}`
      );

      setMarks(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Marks fetch error", err);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading internal marks...</p>;

  return (
    <div>
      <h2>Internal Marks</h2>

      {/* ONLY ONE BUTTON */}
      <button
          onClick={() => navigate("/student/results")}
          style={overallBtn}
        >
          View Overall Result
        </button>

      <div style={tableWrapper}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Subject</th>
              <th style={th}>CT1</th>
              <th style={th}>CT2</th>
              <th style={th}>Assignment 1</th>
              <th style={th}>Assignment 2</th>
              <th style={th}>Total</th>
            </tr>
          </thead>

          <tbody>
            {marks.map((r) => (
              <tr key={`${r.course_id}-${r.student_id}`}>
                <td style={td}>{r.course_name}</td>
                <td style={td}>{r.ct1}</td>
                <td style={td}>{r.ct2}</td>
                <td style={td}>{r.assignment1}</td>
                <td style={td}>{r.assignment2}</td>
                <td style={td}>{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// styles
const tableWrapper = {
  background: "#fff",
  borderRadius: 10,
  padding: 15,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "center",
};

const th = {
  border: "1px solid #e5e7eb",
  padding: "12px",
  background: "#f8fafc",
  fontWeight: "600",
};
const overallBtn = {
  marginBottom: 18,
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
  color: "#fff",
  background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
  boxShadow: "0 4px 10px rgba(59, 130, 246, 0.3)",
  transition: "all 0.2s ease-in-out",
};

const td = {
  border: "1px solid #e5e7eb",
  padding: "12px",
  fontWeight: "500",
};