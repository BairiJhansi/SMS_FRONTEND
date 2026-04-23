import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.user_id) {
        console.error("No user found in localStorage");
        setLoading(false);
        return;
      }

      const studentRes = await axios.get(
        `http://localhost:5002/api/student/user/${user.user_id}`
      );

      const studentId = studentRes.data.student_id;

      const res = await axios.get(
        `http://localhost:5002/api/marks/results/${studentId}`
      );

      // newest semester first
      setResults(res.data.reverse());

    } catch (err) {
      console.error("Failed to fetch results", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading results...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>My Results</h2>

      {results.length === 0 ? (
        <p>No results published yet.</p>
      ) : (
        results.map((r, index) => (
          <div key={`${r.semester}-${index}`} style={card}>
            <h3>Semester {r.semester}</h3>
            <p><b>SGPA:</b> {r.sgpa}</p>
            <p><b>CGPA:</b> {r.cgpa}</p>
            <p><b>Status:</b> {r.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

const card = {
  border: "1px solid #ddd",
  padding: 15,
  marginBottom: 10,
  borderRadius: 10,
  background: "#f9fafb",
};

export default StudentResults;