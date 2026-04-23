import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPromotion = () => {
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
        const res = await axios.get(
        "http://localhost:5002/api/admin/programs" // ✅ FIXED
        );
        setPrograms(res.data);
    } catch (err) {
        console.error("Error fetching programs", err);
    }
    };

    const fetchStudents = async (programId, semesterId) => {
        try {
            const res = await axios.get(
            `http://localhost:5002/api/admin/students?program_id=${programId}&semester_id=${semesterId}`
            );
            setStudents(res.data);
        } catch (err) {
            console.error(err);
        }
        };
    const handleSemesterChange = (e) => {
        const semId = e.target.value;
        setSelectedSemester(semId);

        fetchStudents(selectedProgram, semId);
        };
  // 🔥 Fetch semesters when program changes
  const fetchSemesters = async (programId) => {
    try {
        const res = await axios.get(
        `http://localhost:5002/api/admin/semesters/${programId}` // ✅ FIXED
        );
        setSemesters(res.data);
        
    } catch (err) {
        console.error("Error fetching semesters", err);
    }
    };

    useEffect(() => {
    console.log("Programs:", programs);
    }, [programs]);

    useEffect(() => {
    console.log("Semesters:", semesters);
    }, [semesters]);

  const handleProgramChange = (e) => {
    const programId =parseInt(e.target.value);
    setSelectedProgram(programId);
    setSelectedSemester(""); // reset
    // setStudents([]);
    console.log("Fetching semesters for program:", programId);
    fetchSemesters(programId);
  };

  const handlePromote = async () => {
  if (!selectedProgram || !selectedSemester) {
    alert("Please select program and semester");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:5002/api/admin/promote",
      {
        program_id: selectedProgram,
        semester_id: selectedSemester,
      }
    );

    alert(res.data.message || "Students promoted successfully 🎓");

    // 🔥 find next semester from list
    const currentIndex = semesters.findIndex(
      (s) => s.semester_id === parseInt(selectedSemester)
    );

    if (currentIndex !== -1 && semesters[currentIndex + 1]) {
      const nextSemId = semesters[currentIndex + 1].semester_id;

      // ✅ update dropdown
      setSelectedSemester(nextSemId);

      // ✅ fetch new students
      fetchStudents(selectedProgram, nextSemId);
    } else {
      // final semester case
      setStudents([]);
    }

  } catch (err) {
    console.error("Promotion error", err);
    alert("Promotion failed ❌");
  }
};

  return (
    <div style={{ padding: 20 }}>
      <h2>Semester Promotion</h2>

      {/* Program Dropdown */}
      <select
        value={selectedProgram}
        onChange={handleProgramChange}
        style={input}
      >
        <option value="">Select Program</option>
        {programs.map((p) => (
          <option key={p.program_id} value={p.program_id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Semester Dropdown */}
      <select
        value={selectedSemester}
        onChange={handleSemesterChange} 
        style={input}
      >
        <option value="">Select Current Semester</option>
        {semesters.map((s) => (
          <option key={s.semester_id} value={s.semester_id}>
            Semester {s.semester_number}
          </option>
        ))}
      </select>

      <button style={btn} onClick={handlePromote}>
        Promote Students
      </button>
    </div>
  );
};

const input = {
  display: "block",
  marginBottom: 15,
  padding: 10,
  width: 250,
};

const btn = {
  padding: 12,
  background: "#4caf50",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

export default AdminPromotion;