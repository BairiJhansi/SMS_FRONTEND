import { useEffect, useState } from "react";
import axios from "axios";

export default function FacultyManagement() {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [coursesMap, setCoursesMap] = useState({});
  const [expanded, setExpanded] = useState(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    department_id: "",
    phone_number: "",
    gender:""
  });

  const [assign, setAssign] = useState({
    faculty_id: "",
    course_id: ""
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const f = await axios.get("http://localhost:5002/api/admin/faculty");
    const d = await axios.get("http://localhost:5002/api/admin/departments");
    const c = await axios.get("http://localhost:5002/api/admin/courses");

    setFaculty(f.data);
    setDepartments(d.data);
    setCourses(c.data);
  };

  const toggleCourses = async (facultyId) => {
  if (expanded === facultyId) {
    setExpanded(null);
    return;
  }

  setExpanded(facultyId);

  if (!coursesMap[facultyId]) {
    try {
      const res = await axios.get(
        `http://localhost:5002/api/admin/faculty/${facultyId}/courses`
      );

      setCoursesMap(prev => ({
        ...prev,
        [facultyId]: res.data
      }));
    } catch (err) {
      console.error("Error fetching courses", err);
    }
  }
};

  // ---------------- ADD FACULTY ----------------
  const handleAdd = async () => {
    try {
      await axios.post("http://localhost:5002/api/admin/faculty", form);
      alert("Faculty added ✅");
      fetchAll();
    } catch {
      alert("Failed ❌");
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this faculty?")) return;

    await axios.delete(`http://localhost:5002/api/admin/faculty/${id}`);
    fetchAll();
  };

  // ---------------- ASSIGN COURSE ----------------
  const handleAssign = async () => {
    try {
      await axios.post(
        "http://localhost:5002/api/admin/faculty/assign-course",
        assign
      );
      alert("Course assigned 🎯");
    } catch {
      alert("Assignment failed ❌");
    }
  };

  return (
  <div style={container}>
    <h2 style={title}>Faculty Management</h2>

    {/* ---------------- ADD FACULTY ---------------- */}
    <div style={card}>
      <h3 style={cardTitle}>Add Faculty</h3>

      <div style={grid}>
        <input style={input} placeholder="First Name"
          onChange={(e) => setForm({...form, first_name:e.target.value})} />

        <input style={input} placeholder="Last Name"
          onChange={(e) => setForm({...form, last_name:e.target.value})} />

        <input style={input} placeholder="Email"
          onChange={(e) => setForm({...form, email:e.target.value})} />

        <input style={input} placeholder="Username"
          onChange={(e) => setForm({...form, username:e.target.value})} />

        <input style={input} placeholder="Password" type="password"
          onChange={(e) => setForm({...form, password:e.target.value})} />

        <input style={input} placeholder="Phone"
          onChange={(e) => setForm({...form, phone_number:e.target.value})} />

        <select style={input}
          onChange={(e) => setForm({...form, gender: e.target.value})}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select style={input}
          onChange={(e) => setForm({...form, department_id:e.target.value})}>
          <option>Select Department</option>
          {departments.map(d => (
            <option key={d.department_id} value={d.department_id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <button style={primaryBtn} onClick={handleAdd}>
        Add Faculty
      </button>
    </div>

    {/* ---------------- ASSIGN COURSE ---------------- */}
    <div style={card}>
      <h3 style={cardTitle}>Assign Course</h3>

      <div style={assignRow}>
        <select style={input}
          onChange={(e) => setAssign({...assign, faculty_id:e.target.value})}>
          <option>Select Faculty</option>
          {faculty.map(f => (
            <option key={f.faculty_id} value={f.faculty_id}>
              {f.first_name} {f.last_name}
            </option>
          ))}
        </select>

        <select style={input}
          onChange={(e) => setAssign({...assign, course_id:e.target.value})}>
          <option>Select Course</option>
          {courses.map(c => (
            <option key={c.course_id} value={c.course_id}>
              {c.course_name}
            </option>
          ))}
        </select>

        <button style={primaryBtn} onClick={handleAssign}>
        Assign
        </button>
      </div>
    </div>

    {/* ---------------- FACULTY TABLE ---------------- */}
    <div style={card}>
      <h3 style={cardTitle}>Faculty List</h3>

      <table style={table}>
        <thead style={thead}>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
            {faculty.map(f => (
                <>
                {/* MAIN ROW */}
                <tr key={f.faculty_id} style={row}>
                    <td>{f.first_name} {f.last_name}</td>
                    <td>{f.email}</td>
                    <td>{f.department}</td>
                    <td>{f.phone_number}</td>
                    <td>
                    <button style={viewBtn}
                        onClick={() => toggleCourses(f.faculty_id)}>
                        {expanded === f.faculty_id ? "Hide" : "View Courses"}
                    </button>

                    <button style={deleteBtn}
                        onClick={() => handleDelete(f.faculty_id)}>
                        Delete
                    </button>
                    </td>
                </tr>

                {/* EXPANDED ROW */}
                {expanded === f.faculty_id && (
                    <tr>
                    <td colSpan="5" style={expandBox}>
                        <strong>Assigned Courses:</strong>

                        {coursesMap[f.faculty_id]?.length ? (
                        <ul>
                            {coursesMap[f.faculty_id].map(c => (
                            <li key={c.course_id}>
                                {c.course_name} ({c.course_code}) - {c.credits} credits
                            </li>
                            ))}
                        </ul>
                        ) : (
                        <p style={{ color: "gray" }}>No courses assigned</p>
                        )}
                    </td>
                    </tr>
                )}
                </>
            ))}
            </tbody>
      </table>
    </div>
  </div>
);
}

/* 🎨 STYLES */
const container = {
  padding: 30,
  background: "#eef2f7",
  minHeight: "100vh"
};
const viewBtn = {
  marginRight: 10,
  padding: "6px 10px",
  background: "#4caf50",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};

const expandBox = {
  background: "#f9f9f9",
  padding: 15
};

const title = {
  marginBottom: 20,
  fontWeight: "bold"
};

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  marginBottom: 25,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
};

const cardTitle = {
  marginBottom: 15,
  fontWeight: "600"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
  gap: 12,
  marginBottom: 15
};

const assignRow = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr auto",
  gap: 10
};

const input = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  outline: "none"
};

const primaryBtn = {
  padding: "10px 15px",
  background: "#1976d2",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "bold"
};

const deleteBtn = {
  background: "#e53935",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer"
};

const table = {
  width: "100%",
  borderCollapse: "collapse"
};

const thead = {
  background: "#1976d2",
  color: "#fff"
};

const row = {
  borderBottom: "1px solid #ddd"
};