import { useEffect, useState } from "react";
import { getStudentDashboard } from "../api/dashboardApi";

const GradesPage = () => {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await getStudentDashboard();
      setGrades(res.data.data.learning?.assignments || []);
    };

    fetch();
  }, []);

  const styles = {
    container: {
      padding: "30px"
    },
    card: {
      border: "1px solid #e0e0e0",
      borderRadius: "10px",
      padding: "18px",
      marginBottom: "15px",
      background: "#fff",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
    },
    title: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "5px"
    },
    course: {
      color: "#666",
      marginBottom: "10px"
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "8px"
    },
    statusSubmitted: {
      color: "#2e7d32",
      fontWeight: "600"
    },
    statusPending: {
      color: "#d32f2f",
      fontWeight: "600"
    },
    marks: {
      background: "#1976d2",
      color: "white",
      padding: "5px 12px",
      borderRadius: "6px",
      fontWeight: "600"
    }
  };

  return (
    <div style={styles.container}>
      <h2>Grades</h2>

      {grades.length === 0 ? (
        <p>No grades available.</p>
      ) : (
        grades.map(g => (
          <div key={g.assignment_id} style={styles.card}>
            
            <div style={styles.title}>
              {g.assignment_name}
            </div>

            <div style={styles.course}>
              Course: {g.course_name}
            </div>

            <div style={styles.row}>
              <div>
                Status:{" "}
                <span
                      style={
                        g.submission_status === "submitted"
                          ? styles.statusSubmitted
                          : styles.statusPending
                      }
                    >
                      {g.submission_status === "submitted" ? "Submitted" : "Not submitted"}
                    </span>
              </div>

              <div style={styles.marks}>
                {g.grade != null ? Number(g.grade).toFixed(2) : "-"}
              </div>
            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default GradesPage;