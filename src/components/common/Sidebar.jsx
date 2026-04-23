import { useNavigate } from "react-router-dom";
import { getUser } from "../../utils/auth";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = getUser();
  const [profile, setProfile] = useState({});

  const roleId = user?.role_id;

  const getRoleBasedDashboard = () => {
    if (roleId === 1) return "/student-dashboard";
    if (roleId === 2) return "/faculty-lms";
    if (roleId === 3) return "/admin-dashboard";
    return "/";
  };

  const getDashboardLabel = () => {
    if (roleId === 1) return "Student Dashboard";
    if (roleId === 2) return "Faculty Dashboard";
    if (roleId === 3) return "Admin Dashboard";
    return "Dashboard";
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    let url = "";

    // student
    if (user.role_id === 1) {
      url = "http://localhost:5002/api/student/profile";
    }

    // faculty
    else if (user.role_id === 2) {
      url = "http://localhost:5002/api/faculty/profile";
    }

    // admin
    else {
      setProfile({
        first_name: "Admin",
        last_name: "",
        roll_number: "Administrator"
      });
      return;
    }

    fetch(url, {
      headers: {
        "x-user-id": user.user_id
      }
    })
      .then(res => res.json())
      .then(res => setProfile(res.data));

  }, []);

  return (
    <div
      style={{
        width: "240px",        // ✅ slightly better width
        minWidth: "200px",     // ✅ prevents shrinking
        maxWidth: "200px",     // ✅ locks width
        background: "#1e293b",
        color: "white",
        padding: "20px",
        height: "100vh",       // ✅ full height
        position: "sticky",    // ✅ stays fixed on scroll
        top: 0,
        overflowY: "auto"
      }}
    >
      <h3>LMS</h3>
      {/* PROFILE */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "white",
        padding: "8px 12px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        marginBottom: "15px",
        color: "black"
      }}>

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
            onClick={() =>
              document.getElementById("photoInput").click()
            }
          />

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

              const res = await fetch(
                "http://localhost:5002/api/student/profile/photo",
                {
                  method: "POST",
                  headers: {
                    "x-user-id": user.user_id
                  },
                  body: formData
                }
              );

              const data = await res.json();

              setProfile(prev => ({
                ...prev,
                profile_photo: data.file
              }));
            }}
          />
        </div>

        <div>
          <p style={{ margin: 0, fontWeight: 600 }}>
            {profile?.first_name} {profile?.last_name}
          </p>

          <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
            {user.role_id === 1 && profile?.roll_number}
            {user.role_id === 2 && profile?.email}
            {user.role_id === 3 && "Administrator"}
          </p>
        </div>
      </div>

      {/* Role Dashboard */}
      <p
        onClick={() => navigate(getRoleBasedDashboard())}
        style={{ cursor: "pointer", color: "#10b981", fontWeight: "bold" }}
      >
        {getDashboardLabel()}
      </p>

      {/* Common */}
      <p onClick={() => navigate("/courses")} style={{ cursor: "pointer" }}>
        Courses
      </p>

      <p onClick={() => navigate("/assignments")} style={{ cursor: "pointer" }}>
        Assignments
      </p>

      <p onClick={() => navigate(getRoleBasedDashboard())} style={{cursor:"pointer"}}>
      LMS Dashboard
      </p>

      <p onClick={() => navigate("/erp-dashboard")} style={{cursor:"pointer"}}>
      ERP Dashboard
      </p>
      
      <p onClick={() => navigate("/communication")} style={{cursor:"pointer"}}>
            Communication
            </p>

      <p
        onClick={() => navigate("/nlp-search")}
        style={{ cursor: "pointer", color: "#38bdf8", fontWeight: "500" }}
      >
        AI Assistant
      </p>
      {/* ================= STUDENT ================= */}
      {roleId === 1 && (
        <>
          <p
            onClick={() => navigate("/grades")}
            style={{ cursor: "pointer" }}
          >
            Grades
          </p>

          <p
            onClick={() => navigate("/attendance")}
            style={{ cursor: "pointer" }}
          >
            {/* Attendance */}
          </p>
        </>
      )}

      {/* ================= FACULTY ================= */}
      {roleId === 2 && (
        <>
          <p
            onClick={() => navigate("/faculty-dashboard")}
            style={{ cursor: "pointer" }}
          >
            My Courses
          </p>

          <p
            onClick={() => navigate("/assignments")}
            style={{ cursor: "pointer" }}
          >
           Manage Assignments
          </p>
        </>
      )}

      {/* ================= ADMIN ================= */}
      {roleId === 3 && (
        <>
          <p
            onClick={() => navigate("/admin-dashboard")}
            style={{ cursor: "pointer" }}
          >
            Admin Panel
          </p>

          <p
            onClick={() => navigate("/students")}
            style={{ cursor: "pointer" }}
          >
            Students
          </p>

          <p
            onClick={() => navigate("/faculty")}
            style={{ cursor: "pointer" }}
          >
            Faculty
          </p>
        </>
      )}
    </div>
  );
};

export default Sidebar;