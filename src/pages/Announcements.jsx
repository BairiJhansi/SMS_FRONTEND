import { useEffect, useState } from "react";
import axios from "axios";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [target, setTarget] = useState("all");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [course, setCourse] = useState("");

  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const role =
    user.role_id === 1
      ? "student"
      : user.role_id === 2
      ? "faculty"
      : "admin";

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5006/api/communication/departments"
      );
      // Depending on your backend response, either use res.data or res.data.data
      setDepartments(res.data.data.rows || res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  useEffect(() => {
    if (role === "faculty") fetchFacultyCourses();
    if (role === "admin") fetchDepartments();
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements =async () => {
    const res = await axios.get(
        `http://localhost:5006/api/communication/announcements?role=${role}&userId=${user.user_id}`
      );
      console.log("Announcements fetched:", res.data.data);
      setAnnouncements(res.data.data);
  };

  const fetchFacultyCourses = async () => {
    try {
      const facultyRes = await axios.get(
        `http://localhost:5006/api/communication/faculty-by-user/${user.user_id}`
      );

      const faculty_id =
        facultyRes.data.data?.faculty_id ||
        facultyRes.data.data?.[0]?.faculty_id;

      const res = await axios.get(
        `http://localhost:5006/api/communication/faculty-courses/${faculty_id}`
      );

      setCourses(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const createAnnouncement = async () => {
  try {
    if (role === "faculty" && !course) {
      alert("Please select a course");
      return;
    }

      await axios.post(
        "http://localhost:5006/api/communication/announcement",
        {
          title,
          message,
          created_by: user.user_id,
          role_target: role === "faculty" ? "course" : target,
          department_id: target === "department" ? department : null,
          course_id: role === "faculty" ? course : target === "course" ? course : null,
          semester: target === "semester" ? semester : null
        }
      );

      setTitle("");
      setMessage("");
      setCourse(""); // reset course also

      fetchAnnouncements();
    } catch (err) {
      console.error("Error creating announcement:", err);
    }
  };


const emergency = announcements.find(
  a => a.role_target === "emergency"
);

  return (
    <div style={styles.container}>
      
      {(role === "faculty" || role === "admin") && (
        <div style={styles.create}>
          <h3>Post Announcement</h3>

          <input
            style={styles.input}
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <textarea
            style={styles.textarea}
            placeholder="Message"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />

          {/* ADMIN TARGET */}
          {role === "admin" && (
            <select
              style={styles.select}
              value={target}
              onChange={e => setTarget(e.target.value)}
            >
              <option value="student">All Students</option>
              <option value="department">Department</option>
              <option value="semester">Semester</option>
              <option value="faculty">Faculty</option>
              <option value="emergency">Emergency Notice</option>
            </select>
          )}

          {/* FACULTY COURSE SELECT */}
          {role === "faculty" && (
            <select
              style={styles.select}
              value={course}
              onChange={e => setCourse(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map(c => (
                <option key={c.course_id} value={c.course_id}>
                  {c.course_name}
                </option>
              ))}
            </select>
          )}

          {/* DEPARTMENT */}
          {target === "department" && (
            <select
              style={styles.select}
              value={department}
              onChange={e => setDepartment(e.target.value)}
            >
              <option value="">Select Department</option>
              {Array.isArray(departments) && departments.map(d => (
                <option key={d.department_id} value={d.department_id}>
                  {d.name}
                </option>
              ))}
            </select>
          )}

          {/* SEMESTER */}
          {target === "semester" && (
            <select
              style={styles.select}
              value={semester}
              onChange={e => setSemester(e.target.value)}
            >
              <option value="">Select Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>
          )}

          {/* EMERGENCY */}
          {target === "emergency" && (
            <div style={styles.emergency}>
              ⚠️ This will appear as system-wide banner
            </div>
          )}

          <button style={styles.button} onClick={createAnnouncement}>
            Post Announcement
          </button>
        </div>
      )}

      {/* ANNOUNCEMENT LIST */}
      {announcements.map(a => (
        <div
          key={a.announcement_id}
          style={{
            ...styles.card,
            ...(a.role_target === "emergency" && styles.emergencyCard)
          }}
        >
          <div style={styles.header}>
            <h4>{a.title}</h4>

            <span style={styles.name}>
              {a.first_name} {a.last_name}
            </span>
          </div>

          <p>{a.message}</p>

          <small style={styles.time}>
            {new Date(a.created_at).toLocaleString()}
          </small>
        </div>
      ))}

      {emergency && (
        <div style={styles.topEmergency}>
          🚨 {emergency.title} — {emergency.message}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
  padding: 20,
  background: "#f5f7fb",
  height: "100vh",
  overflowY: "auto",
  boxSizing: "border-box"
},

  create: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20
  },

  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    border: "1px solid #ddd",
    borderRadius: 8
  },

  textarea: {
    width: "100%",
    padding: 10,
    height: 80,
    marginBottom: 10,
    border: "1px solid #ddd",
    borderRadius: 8
  },

  select: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8
  },

  button: {
    background: "#2563eb",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer"
  },

  emergency: {
    background: "#fff3cd",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    color: "#856404",
    fontWeight: 500
  },

  card: {
    background: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12
  },

  emergencyCard: {
    borderLeft: "5px solid red",
    background: "#fff5f5"
  },

  header: {
    display: "flex",
    justifyContent: "space-between"
  },
  time: {
    display: "block",
    marginTop: 8,
    color: "#888"
  },

  name: {
    fontSize: 12,
    color: "#666"
  },
  topEmergency: {
  background: "#ff4d4f",
  color: "white",
  padding: 12,
  borderRadius: 8,
  marginBottom: 15,
  fontWeight: 600
  }
};