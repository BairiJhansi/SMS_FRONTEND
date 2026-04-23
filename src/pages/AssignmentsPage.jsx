import { useEffect, useState } from "react";
import { getStudentDashboard } from "../api/dashboardApi";
import { getFacultyDashboard } from "../api/dashboardApi";
import { getUser } from "../utils/auth";

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const user = getUser();
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        if (user.role_id === 1) {
          const res = await getStudentDashboard();
          setAssignments(
            res.data?.data?.learning?.assignments || []
          );
        } 
        else if (user.role_id === 2) {
          const res = await getFacultyDashboard();
          setAssignments(
            res.data?.data?.teaching?.assignments || []
          );
        } 
        else {
          setAssignments([]);
        }

      } catch (err) {
        console.error("Faculty assignments error:", err.response?.data);
      }
    };

    fetchAssignments();
  }, []);
  
  const openAssignment = (a) => {
    if (!a.moodle_cmid) {
      console.log("Missing moodle_assignment_id:", a);
      return;
    }

    window.open(
      `http://localhost/moodle/mod/assign/view.php?id=${a.moodle_cmid}`,
      "_blank"
    );
  };

  const openGradingPage = (a) => {
    if (!a.moodle_cmid) {
      alert("Moodle CMID missing");
      return;
    }

    const url = `http://localhost/moodle/mod/assign/view.php?id=${a.moodle_cmid}&action=grading`;

    window.open(url, "_blank");
  };

  const styles = {
    container: {
      padding: "30px"
    },
    card: {
      padding: "18px",
      marginBottom: "15px",
      borderRadius: "10px",
      background: "#fff",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      border: "1px solid #e0e0e0",
      cursor: "pointer",
      transition: "0.2s"
    },
    title: {
      fontSize: "18px",
      fontWeight: "600"
    },
    course: {
      color: "#666",
      marginTop: "4px"
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "12px"
    },
    submitted: {
      color: "green",
      fontWeight: "600"
    },
    notSubmitted: {
      color: "red",
      fontWeight: "600"
    },
    due: {
      background: "#fff3cd",
      padding: "4px 10px",
      borderRadius: "6px"
    }
  };

  return (
    <div style={styles.container}>
      <h2>Assignments</h2>

      {assignments.length === 0 ? (
        <p>No assignments available.</p>
      ) : (
        assignments.map((a) => (
          <div
            key={a.assignment_id}
            style={{ ...styles.card, cursor: "default" }}
          >
            {/* TITLE */}
            <div style={styles.title}>
              {a.assignment_name}
            </div>

            {/* COURSE */}
            <div style={styles.course}>
              Course: {a.course_name}
            </div>

            {/* TOP ROW */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "12px"
              }}
            >
              {/* LEFT SIDE */}
              <div>
                <div style={styles.due}>
                  Due: {a.due_date?.substring(0, 10)}
                </div>

                {/* STUDENT ONLY STATUS */}
                {user?.role_id === 1 && (
                  <div style={{ marginTop: "5px" }}>
                    Status:{" "}
                    <span
                      style={
                        a.submission_status === "submitted"
                          ? styles.submitted
                          : styles.notSubmitted
                      }
                    >
                      {a.submission_status === "submitted" ? "Submitted" : "Not submitted"}
                    </span>
                  </div>
                )}
              </div>

              {/* RIGHT SIDE → FACULTY BUTTON */}
              {user?.role_id === 2 && (
                <button
                  style={{
                    padding: "8px 12px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openGradingPage(a);
                  }}
                >
                  View Submissions
                </button>
              )}
            </div>

            {/* OPEN ASSIGNMENT → FOR BOTH */}
            <button
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
              onClick={() => openAssignment(a)}
            >
              Open Assignment
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AssignmentsPage;