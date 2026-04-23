import { useEffect, useState } from "react";
import { getStudentDashboard } from "../api/dashboardApi";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";

const StudentDashboard = () => {
  const [data, setData] = useState({
    student: null,
    courses: [],
    assignments: [],
    stats: {}
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =========================
     FETCH DASHBOARD DATA
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getStudentDashboard();

        const dashboard = res.data?.data;

        setData({
          student: dashboard?.student || null,
          courses: dashboard?.learning?.courses || [],
          assignments: dashboard?.learning?.assignments || [],
          stats: dashboard?.stats || {}
        });

      } catch (err) {
        console.error("Error fetching student dashboard:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* =========================
     MOODLE COURSE NAVIGATION
  ========================= */
  const openCourse = (c) => {
    if (!c.moodle_course_id) {
      console.warn("Missing moodle_course_id", c);
      alert("Course not available in Moodle");
      return;
    }

    const url = `http://localhost/moodle/course/view.php?id=${c.moodle_course_id}`;

    console.log("Opening Moodle Course:", url);
    window.open(url, "_blank");
  };

  /* =========================
     MOODLE ASSIGNMENT NAVIGATION
  ========================= */
  const openAssignment = (a) => {
    if (!a.moodle_cmid) {
      console.warn("Missing moodle_assignment_id", a);
      alert("Assignment not linked to Moodle");
      return;
    }

    const url = `http://localhost/moodle/mod/assign/view.php?id=${a.moodle_cmid}`;

    console.log("Opening Moodle Assignment:", url);
    window.open(url, "_blank");
  };

  /* =========================
     UI STATES
  ========================= */
  if (loading) return <p>Loading student dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  const { student, courses, assignments, stats } = data;

  return (
    <div className="container">
      <h2>Student Dashboard</h2>

      {/* =========================
         STUDENT INFO
      ========================= */}
      {student ? (
        <p>
          Welcome, {student.first_name} {student.last_name} (
          {student.admission_number})
        </p>
      ) : (
        <p>Student info not available.</p>
      )}

      {/* =========================
         COURSES
      ========================= */}
      <h3>Courses</h3>
      {courses.length ? (
        courses.map((c) => (
          <div
            key={c.course_id}
            className="card"
            onClick={() => openCourse(c)}
            style={{
              cursor: "pointer",
              transition: "all 0.2s ease",
              marginBottom: "10px",
              padding: "15px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 2px 4px rgba(0,0,0,0.1)";
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>{c.course_name}</strong> ({c.course_code})
              </div>

              <div
                style={{
                  background: "#4285f4",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "bold"
                }}
              >
                📚 Moodle
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No enrolled courses.</p>
      )}

      {/* =========================
         ASSIGNMENTS
      ========================= */}
      <h3>Assignments</h3>
      {assignments.length ? (
        assignments.map((a) => (
          <div
            key={a.assignment_id}
            className="card"
            onClick={() => openAssignment(a)}
            style={{
              cursor: "pointer",
              transition: "all 0.2s ease",
              marginBottom: "10px",
              padding: "15px"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 2px 4px rgba(0,0,0,0.1)";
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <strong>{a.assignment_name}</strong>
                <br />
                <span style={{ fontSize: "12px", color: "#666" }}>
                  {a.course_name}
                </span>
              </div>

              <div
                style={{
                  background: "#f57c00",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: "bold"
                }}
              >
                📝 Moodle
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No assignments yet.</p>
      )}

      {/* =========================
         PROGRESS
      ========================= */}
      <h3>Progress</h3>
      {stats ? (
        <div>
          <p>
            Assignments Submitted: {stats.total_grades} /{" "}
            {stats.total_assignments}
          </p>
          <p>
            Average Grade:{" "}
            {stats.avg_grade != null
              ? Number(stats.avg_grade).toFixed(2)
              : "-"}
          </p>
          <p>Pending Assignments: {stats.pending_assignments}</p>
        </div>
      ) : (
        <p>No progress data.</p>
      )}
    </div>
  );
};

export default StudentDashboard;