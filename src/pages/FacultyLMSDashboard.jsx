import { useEffect, useState } from "react";
import { getFacultyDashboard } from "../api/dashboardApi";

export default function FacultyLMSDashboard() {
  const [data, setData] = useState({
    courses: [],
    assignments: [],
    submissions: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await getFacultyDashboard();

      setData({
        courses: res.data.data.teaching?.courses || [],
        assignments: res.data.data.teaching?.assignments || [],
        submissions: res.data.data.teaching?.submissions || []
      });
    } catch (err) {
      console.error(err);
    }
  };

  const openCourse = (c) => {
    window.open(
      `http://localhost/moodle/course/view.php?id=${c.moodle_course_id}`,
      "_blank"
    );
  };

  const openGrading = (a) => {
    window.open(
      `http://localhost/moodle/mod/assign/view.php?id=${a.moodle_cmid}&action=grading`,
      "_blank"
    );
  };

  return (
    <div style={container}>
      <h2 style={heading}>Faculty LMS Dashboard</h2>

      {/* ===== COURSES ===== */}
      <h3 style={sectionTitle}>Your Courses</h3>
      <div style={grid}>
        {data.courses.map((c) => (
          <div key={c.course_id} style={courseCard}>
            <div>
              <h4 style={{ margin: 0 }}>{c.course_name}</h4>
              <p style={subText}>{c.course_code}</p>
            </div>

            <button style={primaryBtn} onClick={() => openCourse(c)}>
              Open Course
            </button>
          </div>
        ))}
      </div>

      {/* ===== ASSIGNMENTS ===== */}
      <h3 style={{ ...sectionTitle, marginTop: "30px" }}>
        Assignments
      </h3>

      <div style={assignmentList}>
        {data.assignments.map((a) => (
          <div key={a.assignment_id} style={assignmentCard}>
            <div>
              <h4 style={{ margin: "0 0 5px 0" }}>
                {a.assignment_name}
              </h4>
              <p style={subText}>{a.course_name}</p>
              <p style={dueText}>
                Due: {a.due_date?.substring(0, 10)}
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={secondaryBtn}
                onClick={() =>
                  window.open(
                    `http://localhost/moodle/mod/assign/view.php?id=${a.moodle_cmid}`,
                    "_blank"
                  )
                }
              >
                Open
              </button>

              <button
                style={primaryBtn}
                onClick={() => openGrading(a)}
              >
                Grade
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  padding: "30px",
  background: "#f5f7fb",
  minHeight: "100vh"
};

const heading = {
  marginBottom: "20px"
};

const sectionTitle = {
  marginBottom: "15px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "20px"
};

const courseCard = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between"
};

const assignmentList = {
  display: "flex",
  flexDirection: "column",
  gap: "15px"
};

const assignmentCard = {
  background: "white",
  padding: "18px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const subText = {
  fontSize: "13px",
  color: "#666"
};

const dueText = {
  fontSize: "12px",
  color: "#f59e0b",
  marginTop: "5px"
};

const primaryBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};

const secondaryBtn = {
  background: "#e5e7eb",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};