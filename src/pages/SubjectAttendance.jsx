import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function SubjectAttendance() {
  const { courseId } = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAttendance();
  }, [courseId]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
        `http://localhost:5002/api/faculty/attendance/course/${courseId}`,
        {
          headers: {
            "x-user-id": user?.user_id
          }
        }
      );

      console.log("Attendance API Response:", res.data);

      const result =
        res.data?.data ||
        res.data?.attendance ||
        [];

      setData(result);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h2>📊 Subject Attendance</h2>
        <p>Loading attendance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <h2>📊 Subject Attendance</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>📊 Subject Attendance</h2>

      {data.length === 0 ? (
        <p>No attendance records found for this course.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          width="100%"
          style={{ borderCollapse: "collapse" }}
        >
          <thead style={{ background: "#f3f4f6" }}>
            <tr>
              <th>Roll No</th>
              <th>Student</th>
              <th>Present</th>
              <th>Total</th>
              <th>%</th>
            </tr>
          </thead>

          <tbody>
            {data.map((s) => (
              <tr key={s.student_id}>
                <td>{s.roll_number}</td>
                <td>
                  {s.first_name} {s.last_name}
                </td>
                <td>{s.present}</td>
                <td>{s.total_classes}</td>
                <td>
                  <b>
                    {s.percentage != null
                      ? `${s.percentage}%`
                      : "0%"}
                  </b>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}