import { useEffect, useState } from "react";
import Tabs from "../components/Tabs";
import StudentInformation,{AttendanceTab} from "./StudentInformation";
import FeeDashboard from "./FeeDashboard";
import ResultsDashboard from "./ResultsDashboard";
import Chatbot from "../components/Chatbot";

import { 
  getStudentProfile, 
  getStudentAttendance,
  getStudentResults,
  getStudentFees,
  getStudentLeave,
  getStudentFeedback
} from "../api/erpApi";

export default function StudentERPDashboard() {
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [results, setResults] = useState([]);
  const [fees, setFees] = useState(null);
  const [leave, setLeave] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [photo, setPhoto] = useState(null);
  useEffect(() => {
    getStudentProfile().then(res => setProfile(res.data.data));
    getStudentAttendance().then(res => setAttendance(res.data));
    getStudentFees().then(res => setFees(res.data));
    getStudentLeave().then(res => setLeave(res.data.leave));
    // getStudentFeedback().then(res => setFeedback(res.data.feedback));
  }, []);

  if (!profile) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
  <div style={{ padding: "20px", background: "#f5f7fb", minHeight: "100vh" }}>
    
    {/* 🔥 TOP HEADER */}
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px"
    }}>
      <h2>Student Dashboard</h2>

      {/* 👉 PROFILE SECTION */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "white",
        padding: "8px 12px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}>
        
        {/* PHOTO */}
        <div style={{ position: "relative" }}>
          <img
            src={
              profile?.profile_photo
                ? `http://localhost:5002/uploads/${profile.profile_photo}`
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              objectFit: "cover",
              cursor: "pointer"
            }}
            onClick={() => document.getElementById("photoInput").click()}
          />

          {/* HIDDEN INPUT */}
          <input
            type="file"
            id="photoInput"
            style={{ display: "none" }}
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              const user = JSON.parse(localStorage.getItem("user"));
              const formData = new FormData();
              formData.append("file", file);

              try {
                const res= await fetch("http://localhost:5002/api/student/profile/photo", {
                  method: "POST",
                  headers: {
                    "x-user-id": user.user_id
                  },
                  body: formData
                });

                alert("Photo updated");
                const data = await res.json();
                setProfile(prev => ({
                    ...prev,
                    profile_photo: data.file
                    }));
              } catch (err) {
                alert("Upload failed");
              }
            }}
          />
        </div>

        {/* NAME + ROLL */}
        <div>
          <p style={{ margin: 0, fontWeight: "600" }}>
            {profile.first_name} {profile.last_name}
          </p>
          <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
            {profile.roll_number}
          </p>
        </div>
      </div>
    </div>

    {/* TABS */}
    <Tabs tabs={[
      "My Information",
      "Attendance",
      "Results",
      "Fees",
      "Leave",
      "Feedback"
    ]}>

      {/* INFORMATION */}
      <div>
        <StudentInformation />
      </div>

      {/* ATTENDANCE */}
      <div><AttendanceTab />
      </div>

      {/* RESULTS */}
      <div>
        <ResultsDashboard />
      </div>

      {/* FEES */}
      <div>
        <FeeDashboard />
      </div>

      {/* LEAVE */}
      <div>
        {leave.length === 0 ? (
          <p>No leave</p>
        ) : (
          leave.map(l => (
            <div key={l.leave_id}>
              {l.status}
            </div>
          ))
        )}
      </div>

    </Tabs>
  </div>
);
}