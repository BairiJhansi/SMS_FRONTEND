import { useEffect, useState } from "react";
import axios from "axios";

export default function AddStudent() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    roll_number: "",
    admission_number: "",
    department_id: "",
    program_id: "",
    semester_id: "",
    phone_number: "",
    gender: ""
  });

  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    fetchDepartments();
    fetchPrograms();
  }, []);

  const fetchDepartments = async () => {
    const res = await axios.get("http://localhost:5002/api/admin/departments");
    setDepartments(res.data);
  };

  const fetchPrograms = async () => {
    const res = await axios.get("http://localhost:5002/api/admin/programs");
    setPrograms(res.data);
  };

  const fetchSemesters = async (programId) => {
    const res = await axios.get(
      `http://localhost:5002/api/admin/semesters/${programId}`
    );
    setSemesters(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === "program_id") {
      fetchSemesters(value);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5002/api/admin/students", form);
      alert("Student added successfully 🎓");
      setForm({});
    } catch (err) {
      console.error(err);
      alert("Failed to add student ❌");
    }
  };

  return (
  <div style={container}>
    <div style={card}>
      <h2 style={title}>Add Student</h2>

      <div style={grid}>
        <input name="first_name" placeholder="First Name" onChange={handleChange} style={input} />
        <input name="last_name" placeholder="Last Name" onChange={handleChange} style={input} />

        <input name="email" placeholder="Email" onChange={handleChange} style={input} />
        <input name="username" placeholder="Username" onChange={handleChange} style={input} />

        <input name="password" type="password" placeholder="Password" onChange={handleChange} style={input} />
        <input name="phone_number" placeholder="Phone Number" onChange={handleChange} style={input} />

        <input name="roll_number" placeholder="Roll Number" onChange={handleChange} style={input} />
        <input name="admission_number" placeholder="Admission Number" onChange={handleChange} style={input} />

        {/* Gender */}
        <select name="gender" onChange={handleChange} style={input}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        {/* Department */}
        <select name="department_id" onChange={handleChange} style={input}>
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.department_id} value={d.department_id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Program */}
        <select name="program_id" onChange={handleChange} style={input}>
          <option value="">Select Program</option>
          {programs.map((p) => (
            <option key={p.program_id} value={p.program_id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Semester */}
        <select name="semester_id" onChange={handleChange} style={input}>
          <option value="">Select Semester</option>
          {semesters.map((s) => (
            <option key={s.semester_id} value={s.semester_id}>
              Semester {s.semester_number}
            </option>
          ))}
        </select>
      </div>

      <button style={btn} onClick={handleSubmit}>
        Add Student
      </button>
    </div>
  </div>
);
}

const container = {
  padding: "30px",
  background: "#f5f7fb",
  minHeight: "100vh"
};

const card = {
  maxWidth: "800px",
  margin: "auto",
  background: "#fff",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
};

const title = {
  marginBottom: "20px",
  color: "#1e40af"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "15px",
  marginBottom: "20px",
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px",
  outline: "none"
};

const btn = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer"
};