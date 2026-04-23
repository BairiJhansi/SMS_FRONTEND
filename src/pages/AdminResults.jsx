import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const AdminResults = () => {
  const [students, setStudents] = useState([]);
  const [externalMarks, setExternalMarks] = useState({});
  const [courseId, setCourseId] = useState("");
  const [semester, setSemester] = useState("");
    const navigate = useNavigate();
  

  useEffect(() => {
    const role = parseInt(localStorage.getItem("role_id"));

      // ❌ Only admin allowed
      if (role !== 3) {
        navigate("/");}

    const fetchStudents = async () => {
      const res = await axios.get("http://localhost:5002/api/admin/students");
      setStudents(res.data);
    };
    fetchStudents();
  }, []);

  const handleChange = (studentId, value) => {
    setExternalMarks({
      ...externalMarks,
      [studentId]: value,
    });
  };

  const submitMarks = async (studentId) => {
    await axios.post("http://localhost:5002/api/marks/external", {
      student_id: studentId,
      course_id: courseId,
      semester,
      external_marks: externalMarks[studentId] || 0,
    });

    alert("External marks added");
  };

  const generateResult = async (studentId) => {
    await axios.post("http://localhost:5002/api/marks/generate", {
      student_id: studentId,
      semester,
    });

    alert("Result generated 🎉");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Result Dashboard</h2>

      <input
        placeholder="Course ID"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
      />

      <input
        placeholder="Semester"
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
      />

      <table border="1" cellPadding="10" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>External Marks</th>
            <th>Submit</th>
            <th>Generate Result</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.student_id}>
              <td>{s.first_name} {s.last_name}</td>

              <td>
                <input
                  type="number"
                  value={externalMarks[s.student_id] || ""}
                  onChange={(e) =>
                    handleChange(s.student_id, e.target.value)
                  }
                />
              </td>

              <td>
                <button onClick={() => submitMarks(s.student_id)}>
                  Save
                </button>
              </td>

              <td>
                <button onClick={() => generateResult(s.student_id)}>
                  Generate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminResults;