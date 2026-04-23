import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie
} from "recharts";

const FacultyMarks = () => {
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [edited, setEdited] = useState({});
  const [analytics, setAnalytics] = useState([]);

  const [courseId, setCourseId] = useState("");
  const [semester, setSemester] = useState("");
  const [mode, setMode] = useState("entry");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // ================= LOGIN CHECK =================
  useEffect(() => {
    const role = parseInt(localStorage.getItem("role_id"));
    if (role !== 2) navigate("/");
  }, []);

  // ================= FETCH COURSES =================
  useEffect(() => {
    const fetchCourses = async () => {
      const res = await axios.get(
        "http://localhost:5002/api/dashboard/faculty",
        { headers: { "x-user-id": user.user_id } }
      );
      setCourses(res.data.data.teaching.courses);
    };
    fetchCourses();
  }, []);

  // ================= FETCH SEMESTERS =================
  useEffect(() => {
    const fetchSemesters = async () => {
      const res = await axios.get("http://localhost:5002/api/admin/semesters");
      setSemesters(res.data);
    };
    fetchSemesters();
  }, []);

  // ================= LOAD DATA =================
  useEffect(() => {
    if (!courseId || !semester) return;

    fetchStudents();
    fetchSavedMarks();
    fetchAnalytics();
  }, [courseId, semester]);

  // ================= FETCH STUDENTS =================
  const fetchStudents = async () => {
    const res = await axios.get(
      "http://localhost:5002/api/marks/students",
      {
        params: {
          course_id: Number(courseId),
          semester_id: Number(semester),
        },
      }
    );

    setStudents(res.data);

    // initialize marks
    const init = {};
    res.data.forEach((s) => {
      init[s.student_id] = {
        ct1: "",
        ct2: "",
        assignment1: "",
        assignment2: "",
      };
    });

    setMarks(init);
  };

  // ================= FETCH SAVED MARKS =================
  const fetchSavedMarks = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5002/api/marks/faculty-view",
        {
          params: {
            course_id: Number(courseId),
            semester_id: Number(semester),
          },
        }
      );

      const map = {};
        res.data.forEach((m) => {
          const a1 = Number(m.assignment1);
          const a2 = Number(m.assignment2);

          map[m.student_id] = {
            ct1: Number(m.ct1) || 0,
            ct2: Number(m.ct2) || 0,

            // 🔥 FIX: negative → 0
            assignment1: a1 < 0 ? 0 : a1 || 0,
            assignment2: a2 < 0 ? 0 : a2 || 0,
          };
        });

      setMarks((prev) => ({
        ...prev,
        ...map,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (id, field, value) => {
    setMarks((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: Number(value),
      },
    }));

    setEdited((prev) => ({
      ...prev,
      [`${id}-${field}`]: true,
    }));
  };

  // ================= SAVE ONE ROW =================
  const saveRow = async (studentId) => {
    try {
      const m = marks[studentId];

      await axios.post("http://localhost:5002/api/marks/internal/bulk", {
        course_id: Number(courseId),
        semester: Number(semester),
        marksData: [
          {
            student_id: studentId,
            ct1: m.ct1 || 0,
            ct2: m.ct2 || 0,
            assignment1: m.assignment1 || 0,
            assignment2: m.assignment2 || 0,
          },
        ],
      });

      alert("Saved ✅");
    } catch (err) {
      console.error(err);
      alert("Save failed ❌");
    }
  };

  // ================= SAVE ALL =================
  const handleSaveAll = async () => {
    try {
      const marksData = students.map((s) => ({
        student_id: s.student_id,
        ct1: marks[s.student_id]?.ct1 || 0,
        ct2: marks[s.student_id]?.ct2 || 0,
        assignment1: marks[s.student_id]?.assignment1 || 0,
        assignment2: marks[s.student_id]?.assignment2 || 0,
      }));

      await axios.post("http://localhost:5002/api/marks/internal/bulk", {
        course_id: Number(courseId),
        semester: Number(semester),
        marksData,
      });

      alert("All saved ✅");
      setMode("view");
    } catch (err) {
      console.error(err);
      alert("Failed ❌");
    }
  };

  const fetchAnalytics = async () => {
    const res = await axios.get(
      "http://localhost:5002/api/marks/analytics",
      {
        params: {
          course_id: Number(courseId),
          semester_id: Number(semester),
        },
      }
    );

    setAnalytics(res.data);
  };
  const riskData = [
    { name: "High", value: analytics.filter(s => s.risk === "high").length },
    { name: "Medium", value: analytics.filter(s => s.risk === "medium").length },
    { name: "Safe", value: analytics.filter(s => s.risk === "safe").length },
  ];

  const avgData = [
    {
      name: "CT1",
      value: analytics.reduce((a,b)=>a+b.ct1,0)/analytics.length || 0
    },
    {
      name: "CT2",
      value: analytics.reduce((a,b)=>a+b.ct2,0)/analytics.length || 0
    },
    {
      name: "A1",
      value: analytics.reduce((a,b)=>a+b.assignment1,0)/analytics.length || 0
    },
    {
      name: "A2",
      value: analytics.reduce((a,b)=>a+b.assignment2,0)/analytics.length || 0
    }
  ];

  // ================= UI =================
  return (
    <div style={styles.page}>
      <h2>Faculty Marks Dashboard</h2>

      {/* FILTER */}
      <div style={styles.filterBar}>
        <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option>Select Course</option>
          {courses.map((c) => (
            <option key={c.course_id} value={c.course_id}>
              {c.course_name}
            </option>
          ))}
        </select>

        <select value={semester} onChange={(e) => setSemester(e.target.value)}>
          <option>Select Semester</option>
          {semesters.map((s) => (
            <option key={s.semester_id} value={s.semester_id}>
              Sem {s.semester_number}
            </option>
          ))}
        </select>

        <button onClick={() => setMode("entry")}>Entry</button>
        <button onClick={() => setMode("view")}>View</button>
        <button onClick={() => setMode("analytics")}>Analytics</button>
      </div>

      {/* ENTRY MODE */}
      {mode === "entry" && (
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.cell}>Roll</th>
                <th style={styles.cell}>Name</th>
                <th style={styles.cell}>CT1</th>
                <th style={styles.cell}>CT2</th>
                <th style={styles.cell} >A1</th>
                <th style={styles.cell} >A2</th>
                <th style={styles.cell} >Total</th>
                <th style={styles.cell} >Save</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => {
                const m = marks[s.student_id] || {};

                const total =
                  (m.ct1 || 0) +
                  (m.ct2 || 0) +
                  (m.assignment1 || 0) +
                  (m.assignment2 || 0);

                return (
                  <tr key={s.student_id}>
                    <td style={styles.cell} >{s.roll_number}</td>
                    <td style={styles.cell} >{s.first_name} {s.last_name}</td>

                    {["ct1", "ct2"].map((f) => (
                      <td  style={styles.cell} key={f}>
                        <input
                          type="number"
                          value={m[f] ?? ""}
                          onChange={(e) =>
                            handleChange(s.student_id, f, e.target.value)
                          }
                          style={{
                            width: 70,
                            padding: 6,
                            textAlign: "center",
                            borderRadius: 6,
                            border: "1px solid #ccc",
                          }}
                        />
                      </td>
                    ))}

                    <td style={styles.cell} >{m.assignment1 ?? "-"}</td>
                    <td style={styles.cell} >{m.assignment2 ?? "-"}</td>
                    
                    <td style={styles.cell} ><b>{total}</b></td>

                    <td style={styles.cell} >
                      <button
                        style={styles.smallBtn}
                        onClick={() => saveRow(s.student_id)}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ marginTop: 20 }}>
            <button style={styles.saveBtn} onClick={handleSaveAll}>
              💾 Save All
            </button>
          </div>
        </div>
      )}

      {mode === "analytics" && (
        <div>
          <h3>📊 Performance</h3>

          <BarChart width={600} height={300} data={analytics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="roll_number" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" />
          </BarChart>

          <h3>⚠️ Risk Analysis</h3>

          <PieChart width={400} height={300}>
            <Pie data={riskData} dataKey="value" nameKey="name" />
            <Tooltip />
          </PieChart>

          <h3>📈 Average Marks</h3>

          <BarChart width={500} height={300} data={avgData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>

          {/* ALERT */}
          {riskData[0].value > 0 && (
            <div style={{ color: "red", fontWeight: "bold" }}>
              ⚠️ {riskData[0].value} students are at HIGH RISK
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE */}
      {mode === "view" && (
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.cell}>Roll</th>
              <th style={styles.cell}>Name</th>
              <th style={styles.cell}>CT1</th>
              <th style={styles.cell}>CT2</th>
              <th style={styles.cell}>A1</th>
              <th style={styles.cell}>A2</th>
              <th style={styles.cell}>Total</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => {
              const m = marks[s.student_id] || {};

              const total =
                (m.ct1 || 0) +
                (m.ct2 || 0) +
                (m.assignment1 || 0) +
                (m.assignment2 || 0);

              return (
                <tr key={s.student_id}>
                  <td style={styles.cell}>{s.roll_number}</td>
                  <td style={styles.cell}>
                    {s.first_name} {s.last_name}
                  </td>
                  <td style={styles.cell}>{m.ct1}</td>
                  <td style={styles.cell}>{m.ct2}</td>

                  <td style={{ ...styles.cell, color: "green", fontWeight: "bold" }}>
                    {m.assignment1}
                  </td>

                  <td style={{ ...styles.cell, color: "green", fontWeight: "bold" }}>
                    {m.assignment2}
                  </td>

                  <td style={styles.cell}>{total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

// ================= STYLES =================
const styles = {
  page: { padding: 20 },
  filterBar: { display: "flex", gap: 10, marginBottom: 20 },
  table: { width: "100%", borderCollapse: "collapse" },
  headerRow: { background: "#1976d2", color: "#fff" },
  card: { padding: 20, background: "#fff", borderRadius: 10 },
  input: {
    width: 60,
    padding: 6,
    borderRadius: 6,
    border: "1px solid #ccc",
    textAlign: "center",
  },
  smallBtn: {
    padding: "5px 8px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  saveBtn: {
    padding: "10px 20px",
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  table: {
  width: "100%",
  borderCollapse: "collapse",
},

headerRow: {
  background: "#1976d2",
  color: "#fff",
},

cell: {
  border: "1px solid #ddd",
  padding: 10,
  textAlign: "center",
},

nameCell: {
  textAlign: "left",
  paddingLeft: 10,
},
};

export default FacultyMarks;