import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5002/api/admin/students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    await axios.delete(`http://localhost:5002/api/admin/students/${id}`);
    fetchStudents();
  };

  return (
  <div style={styles.page}>
    <div style={styles.card}>
      <h2 style={styles.title}>Students List</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Roll No</th>
                <th style={styles.th}>Admission No</th>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>Semester</th>
                <th style={styles.th}>Phone</th>
            </tr>
            </thead>

          <tbody>
        {students.map((s) => (
            <tr key={s.student_id} style={{ background: "#fff" }}>
            <td
            style={{ color: "#2563eb", cursor: "pointer", fontWeight: "600" }}
            onClick={() => navigate(`/admin/student/${s.student_id}`)}
            >
            {s.first_name} {s.last_name}
            </td>            
            <td style={styles.td}>{s.roll_number}</td>
            <td style={styles.td}>{s.admission_number}</td>
            <td style={styles.td}>{s.department}</td>
            <td style={styles.td}>{s.semester_number}</td>
            <td style={styles.td}>{s.phone_number}</td>
            </tr>
        ))}
        </tbody>

        </table>
      </div>
    </div>
  </div>
);
}

const styles = {
  page: {
    padding: 30,
    background: "#f4f6f9",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif"
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
  },

  title: {
    marginBottom: 15,
    fontSize: 22,
    fontWeight: "bold",
    color: "#333"
  },

  tableWrapper: {
    overflowX: "auto"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 700
  },

  th: {
    background: "#1976d2",
    color: "#fff",
    padding: 12,
    textAlign: "left",
    position: "sticky",
    top: 0
  },
  
  td: {
    padding: 12,
    borderBottom: "1px solid #eee"
  },

  deleteBtn: {
    background: "#e53935",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
    transition: "0.2s"
  }
};