import StudentAdmission,{CommunicationDetails,IdentityDetails,QualificationDetails,Certificates,StudentAchievements} from "./StudentAdmission";
import { useEffect, useState } from "react";
import { getDetailedAttendance ,getSubjectAttendance} from "../api/erpApi";

export default function StudentInformation() {
  const [active, setActive] = useState("admission");

  const tabs = [
    { key: "admission", label: "Admission Details" },
    { key: "communication", label: "Communication Details" },
    { key: "identity", label: "Identity Details" },
    { key: "qualification", label: "Qualification Details" },
    { key: "certificates", label: "Certificates" },
    { key: "dates", label: "Important Dates" },
    { key: "activities", label: "Student Achievements" }
  ];

  return (
    <div>

      {/* 🔷 TOP NAVBAR */}
      <div style={{
        display: "flex",
        gap: "10px",
        overflowX: "auto",   // ✅ allows scroll instead of cutting
        whiteSpace: "nowrap", // ✅ prevents text breaking
        paddingBottom: "10px",
        borderBottom: "2px solid #e5e7eb"
        }}>
        {tabs.map(tab => (
            <div
            key={tab.key}
            onClick={() => setActive(tab.key)}
            style={{
                padding: "10px 16px",
                cursor: "pointer",
                borderRadius: "6px",
                fontWeight: "500",
                background: active === tab.key ? "#2563eb" : "#f1f5f9",
                color: active === tab.key ? "white" : "#333",
                flexShrink: 0,          // ✅ prevents shrinking
                minWidth: "fit-content" // ✅ keeps full text
            }}
            >
            {tab.label}
            </div>
        ))}
        </div>

      {/*  CONTENT AREA */}
      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        minHeight: "400px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}>

        {active === "admission" && <StudentAdmission />}

        {active === "communication" && <CommunicationDetails />}

        {active === "identity" && <IdentityDetails />}

        {active === "qualification" && <QualificationDetails /> }

        {active === "certificates" && <Certificates />}

        {active === "dates" && (
          <div>
            <h3>Important Dates</h3>
            <p>Detained , dicontinue dates...</p>
          </div>
        )}

        {active === "activities" && <StudentAchievements/>}

      </div>
    </div>
  );
}

export function AttendanceTab() {
  const [data, setData] = useState(null);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    getDetailedAttendance().then(res => setData(res.data.data));
    getSubjectAttendance().then(res => {
    setSubjects(res.data.data);
  });
  }, []);

  if (!data) return <p>Loading...</p>;

  const { slots, table, percentage } = data;

  return (
    <div style={{ padding: "20px" }}>

      {/* 🔵 ATTENDANCE RING */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
        <div style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: `conic-gradient(#22c55e ${percentage}%, #e5e7eb 0%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          fontWeight: "bold"
        }}>
          {percentage}%
        </div>
      </div>

      {/* 📊 TABLE */}
      <div style={{ overflowX: "auto" }}>
        <h3 style={{ marginTop: "30px" }}>Overall Attendance</h3>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          borderRadius: "10px",
          overflow: "hidden"
        }}>
          <thead>
            <tr style={{ background: "#2563eb", color: "white" }}>
              <th style={th}>Date</th>
              {slots.map(slot_id => (
                <th key={slot_id} style={th}>Slot {slot_id}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {table.map((row, i) => (
              <tr key={i} style={{ textAlign: "center" }}>
                <td style={td}>{row.date}</td>

                {slots.map(slot_id=> (
                  <td
                    key={slot_id}
                    style={{
                      ...td,
                      color:
                        row[slot_id] === "present"
                          ? "green"
                          : row[slot_id] === "absent"
                          ? "red"
                          : "#999",
                      fontWeight: "600"
                    }}
                  >
                    {row[slot_id] === "-"
                      ? "-"
                      : row[slot_id] === "present"
                      ? "P"
                      : "A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 style={{ marginTop: "30px" }}>Subject-wise Attendance</h3>

<table style={{
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
  background: "white",
  borderRadius: "10px",
  overflow: "hidden"
}}>
  <thead>
    <tr style={{ background: "#2563eb", color: "white" }}>
      <th style={th}>Subject</th>
      <th style={th}>Total</th>
      <th style={th}>Present</th>
      <th style={th}>%</th>
    </tr>
  </thead>

  <tbody>
    {subjects.map((s, i) => (
      <tr key={i} style={{ textAlign: "center" }}>
        <td style={td}>{s.course_name}</td>
        <td style={td}>{s.total_classes}</td>
        <td style={td}>{s.present_classes}</td>

        <td style={{
          ...td,
          color:
            s.percentage >= 75
              ? "green"
              : s.percentage >= 50
              ? "orange"
              : "red",
          fontWeight: "bold"
        }}>
          {s.percentage}%
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}

const th = {
  padding: "10px",
  border: "1px solid #ddd"
};

const td = {
  padding: "8px",
  border: "1px solid #eee"
};