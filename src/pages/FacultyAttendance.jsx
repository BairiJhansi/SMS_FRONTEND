import { useEffect, useState } from "react";
import { getSlots, markAttendance, getStudentsByCourse,getFacultyCourses } from "../api/facultyApi";
import { useNavigate } from "react-router-dom";

export default function FacultyAttendance() {
  const [slots, setSlots] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [date, setDate] = useState("");
  const [courses, setCourses] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [confirm, setConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadSlots();
    loadCourses();
  }, []);

  const loadSlots = async () => {
    const res = await getSlots();

    const sorted = (res.data.slots || []).sort(
        (a, b) => a.start_time.localeCompare(b.start_time)
    );

    setSlots(sorted);
    };
  const loadCourses = async () => {
    try {
      const res = await getFacultyCourses();
      setCourses(res.data?.data?.teaching?.courses || []);
    } catch (err) {
      console.error(err);
      setCourses([]); // fallback
    }
    };

  const loadStudents = async (courseId) => {
    const res = await getStudentsByCourse(courseId);
    setStudents(res.data.students);

    // default all present ✅
    const defaultAttendance = {};
    res.data.students.forEach((s) => {
      defaultAttendance[s.student_id] = true;
    });
    setAttendance(defaultAttendance);
  };

  const toggleAttendance = (studentId) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const submitAttendance = async () => {
    if (!confirm) {
        alert("Please confirm attendance before submitting");
        return;
    }

    if (!selectedCourse || !selectedSlot || !date) {
        alert("Fill all fields");
        return;
    }

    const formatted = students.map((s) => ({
        studentId: s.student_id,
        status: attendance[s.student_id] ? "present" : "absent"
    }));

    await markAttendance({
        date,
        slot_id: selectedSlot,
        course_id: selectedCourse,
        students: formatted
    });

    alert("Attendance saved successfully");
    };

    const container = {
    padding: "30px",
    background: "#f3f6fb",
    minHeight: "100vh"
    };
    const list = {
        marginTop: "5px",
        fontSize: "14px",
        color: "#333",
        lineHeight: "1.6"
        };

    const topBar = {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap"
    };

    const input = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minWidth: "180px"
    };

    const card = {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    };

    const summary = {
    marginTop: "15px",
    padding: "10px",
    background: "#f1f5f9",
    borderRadius: "6px",
    fontWeight: "500"
    };

    const grid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr", // ✅ 2 columns
    gap: "15px",
    marginTop: "10px"
    };

    const studentCard = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    background: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb"
    };

    const button = {
    marginTop: "20px",
    padding: "12px 20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600"
    };

    const presentCount = Object.values(attendance).filter(v => v).length;
    const totalCount = students.length;
    const absentCount = totalCount - presentCount;
    const presentStudents = students
        .filter(s => attendance[s.student_id])
        .map(s => s.roll_number);

    const absentStudents = students
    .filter(s => !attendance[s.student_id])
    .map(s => s.roll_number);
  return (
  <div style={container}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}
    >
    <h2 style={{ marginBottom: "20px" }}>Mark Attendance</h2>

    <button
    style={{
      padding: "10px 15px",
      background: "#10b981",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "600",
    }}
    onClick={() => {
      if (!selectedCourse) {
        alert("Please select a course first");
        return;
      }
      navigate(`/faculty-attendance/${selectedCourse}`);
    }}
  >
   View Subject Attendance
  </button></div>

    {/* TOP CONTROLS */}
    <div style={topBar}>
      <input
        type="date"
        onChange={(e) => setDate(e.target.value)}
        style={input}
      />

      <select
        onChange={(e) => {
          setSelectedCourse(e.target.value);
          loadStudents(e.target.value);
        }}
        style={input}
      >
        <option value="">Select Course</option>
        {courses?.map((c) => (
          <option key={c.course_id} value={c.course_id}>
            {c.course_name}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => setSelectedSlot(e.target.value)}
        style={input}
      >
        <option value="">Select Slot</option>
        {slots.map((slot) => (
            <option key={slot.slot_id} value={slot.slot_id}>
            {slot.slot_name} ({slot.start_time} - {slot.end_time})
            </option>
        ))}
      </select>
    </div>

    {/* STUDENTS */}
    <div style={card}>
      <h3 style={{ marginBottom: "10px" }}>Students</h3>

      {students.length === 0 ? (
        <p style={{ color: "#777" }}>No students found</p>
      ) : (
        <div style={grid}>
          {students.map((s) => (
            <div key={s.student_id} style={studentCard}>
              
              <div>
                <b>{s.roll_number}</b><br />
                <span style={{ fontSize: "14px", color: "#555" }}>
                  {s.first_name} {s.last_name}
                </span>
              </div>

              <input
                type="checkbox"
                checked={attendance[s.student_id] || false}
                onChange={() => toggleAttendance(s.student_id)}
                style={{ transform: "scale(1.3)" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
    <div style={summary}>
        <div style={{ marginBottom: "8px" }}>
            <b style={{ color: "green" }}>Present ({presentStudents.length}):</b>
            <div style={list}>
            {presentStudents.length > 0
                ? presentStudents.join(", ")
                : "None"}
            </div>
        </div>

        <div>
            <b style={{ color: "red" }}>Absent ({absentStudents.length}):</b>
            <div style={list}>
            {absentStudents.length > 0
                ? absentStudents.join(", ")
                : "None"}
            </div>
        </div>

        <span style={{ marginLeft: "15px" }}>
            Total: {totalCount}
        </span>
        </div>
      <div style={{ marginTop: "15px" }}>
        <input
            type="checkbox"
            checked={confirm}
            onChange={() => setConfirm(!confirm)}
        />
        <span style={{ marginLeft: "8px" }}>
            I confirm this attendance is correct
        </span>
        </div>
    {/* SUBMIT */}
    {students.length > 0 && (
      <button style={button} onClick={submitAttendance}>
        Save Attendance
      </button>
    )}

  </div>
);
}