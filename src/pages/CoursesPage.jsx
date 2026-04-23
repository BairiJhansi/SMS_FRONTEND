import { useEffect, useState } from "react";
import { getStudentDashboard } from "../api/dashboardApi";
import { getFacultyDashboard } from "../api/dashboardApi";
const CoursesPage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user.role_id === 1) {
        const res = await getStudentDashboard();
        setCourses(res.data.data.learning?.courses || []);
      } 
      else if (user.role_id === 2) {
        const res = await getFacultyDashboard();
        setCourses(res.data.data.teaching?.courses || []);
      } 
      else {
        setCourses([]);
      }
    };

    fetch();
  }, []);

  const openCourse = (courseId) => {
  window.open(
    `http://localhost/moodle/course/view.php?id=${courseId}`,
    "_blank"
  );
};

  const styles = {
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
      gap: "20px"
    },
    card: {
      padding: "20px",
      borderRadius: "10px",
      background: "white",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      cursor: "pointer"
    },
    button: {
      marginTop: "10px",
      padding: "8px 12px",
      background: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "6px"
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Courses</h2>

      <div style={styles.grid}>
        {courses.map(c => (
          <div key={c.course_id} style={styles.card}>
            <h3>{c.course_name}</h3>
            <p>{c.course_code}</p>

            <button
                style={styles.button}
                onClick={() => openCourse(c.moodle_course_id)}
              >
                Open Course
              </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;