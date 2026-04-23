import { useEffect, useState } from "react";
import axios from "axios";
import { updateStudentAdmission } from "../api/erpApi";

export default function StudentAdmission() {
  const [student, setStudent] = useState(null);
  const [admission, setAdmission] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  // ---------------- LOAD DATA ----------------
  const loadData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
        "http://localhost:5002/api/student/admission",
        {
          headers: { "x-user-id": user.user_id }
        }
      );

      setStudent(res.data.data.student);
      setAdmission({
        ...(res.data.data.admission || {}),
        dob: res.data.data.admission?.dob || res.data.data.student?.date_of_birth
        });
    } catch (err) {
      console.error(err);
      setError("Failed to load admission details");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- HANDLE CHANGE ----------------
  const handleChange = (field, value) => {
    // convert boolean fields
    const booleanFields = [
        "lateral_entry",
        "autonomous_batch",
        "spot_admission",
        "fee_reimbursement",
        "scholarship",
        "education_loan"
    ];

    let finalValue = value;

    if (booleanFields.includes(field)) {
        finalValue = value === "true"; // convert to boolean
    }

    setAdmission((prev) => ({
        ...prev,
        [field]: finalValue
    }));
    };

  // ---------------- SAVE ----------------
  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const formattedData = {
        ...admission,
        admission_date: formatDate(admission.admission_date)
        };

        // remove dob before sending
        delete formattedData.dob;

     await updateStudentAdmission(formattedData);

      alert("Updated successfully");
      setEditMode(false);
    } catch (err) {
    console.error(err);
    alert(err.response?.data?.error || "Update failed");
}
  };
  const formatDisplayDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
    };
    const formatDate = (value) => {
        if (!value) return "";
        return new Date(value).toISOString().split("T")[0];
        };
  // ---------------- COMMON FIELD ----------------
  const renderField = (label, field, editable = false, type = "text") => {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", marginBottom: "12px" }}>
      <p style={{ fontWeight: "600", fontSize: "15px", marginBottom: "2px" }}>
        {label}
      </p>

      {editMode && editable ? (
        type === "select" ? (
          <select
            value={admission[field] ?? ""}
            onChange={(e) => handleChange(field, e.target.value)}
            style={input}
          >
            <option value="">Select</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        ) : (
          <input
            type={type}
            value={
              type === "date"
                ? formatDate(admission[field])   // ✅ FIXED
                : admission[field] || ""
            }
            onChange={(e) => handleChange(field, e.target.value)}
            style={input}
          />
        )
      ) : (
        <p style={{ color: "#333", fontSize: "15px", margin: 0 }}>
          {type === "select"
            ? admission[field] === true
              ? "Yes"
              : "No"
            : field === "dob"
            ? formatDisplayDate(admission[field])   // ✅ DOB FORMAT
            : type === "date"
            ? formatDate(admission[field]) || "-"
            : admission[field] || "-"}
        </p>
      )}
    </div>
  );
};

  if (loading) return <p style={{ padding: "30px" }}>Loading...</p>;
  if (error) return <p style={{ padding: "30px", color: "red" }}>{error}</p>;

  // ---------------- STYLES ----------------
  const container = {
    padding: "20px"
  };

  const headerCard = {
    background: "linear-gradient(135deg, #2563eb, #1e40af)",
    color: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px"
  };

  const section = {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    columnGap:"15px",
    rowGap: "15px"
  };

  const input = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    fontSize:"15px",
    boxSizing:"border-box"
  };

  const button = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600"
  };

  // ---------------- UI ----------------
  return (
    <div style={container}>
      <h2>Admission Details</h2>

      {/* HEADER */}
      {student && (
        <div style={headerCard}>
          <h2>{student.first_name} {student.last_name}</h2>
          <p>Roll Number : {student.roll_number}</p>
          <p>Admission No : {student.admission_number}</p>
          <p>Department : {student.branch}</p>
          <p>Semester : {student.semester}</p>
        </div>
      )}

      {/* ACTION BUTTON */}
      <div style={{ marginBottom: "20px" }}>
        {!editMode ? (
          <button
            style={{ ...button, background: "#2563eb", color: "white" }}
            onClick={() => setEditMode(true)}
          >
            Edit Details
          </button>
        ) : (
          <>
            <button
              style={{ ...button, background: "green", color: "white", marginRight: "10px" }}
              onClick={handleSave}
            >
              Save
            </button>

            <button
              style={{ ...button, background: "#ccc" }}
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {/* ADMISSION */}
      <div style={{marginBottom: "10px", fontSize: "16px"}}>
        <h3>Allotment Details</h3>
        <div style={grid}>
          {renderField("Batch", "batch")}
          {renderField("Year of Join", "year_of_join")}
          {renderField("Admission Date", "admission_date")}
          {renderField("Lateral Entry", "lateral_entry",true, "select")}
          {renderField("Autonomous", "autonomous_batch",true, "select")}
          {renderField("Spot Admission", "spot_admission",true, "select")}
          {renderField("Admission Type", "admission_type")}
          {renderField("Category", "admission_category")}
        </div>
      </div>

      {/* SCHOLARSHIP */}
      <div style={{marginBottom: "10px", fontSize: "16px"}}>
        <h3>Scholarship</h3>
        <div style={grid}>
          {renderField("Caste Category", "caste_category")}
          {renderField("Caste Name", "caste_name", true)}
          {renderField("Fee Reimbursement", "fee_reimbursement", true,"select")}
          {renderField("Amount", "reimbursement_amount")}
          {renderField("Scholarship", "scholarship", true, "select")}
          {renderField("Education Loan", "education_loan", true, "select")}
        </div>
      </div>

      {/* PERSONAL */}
      <div style={{ marginBottom: "10px", fontSize: "16px" }}>
        <h3>Personal Deatils</h3>
        <div style={grid}>
          {renderField("DOB", "dob")}
          {renderField("Gender", "gender", true)}
          {renderField("Nationality", "nationality", true)}
          {renderField("Blood Group", "blood_group", true)}
          {renderField("Religion", "religion", true)}
          {renderField("Mother Tongue", "mother_tongue", true)}
        </div>
      </div>
      {/* PARENTS */}
    <div style={{ marginBottom: "10px", fontSize: "16px" }}>
    <h3>Parents Details</h3>

    <div style={grid}>
        {renderField("Father Name", "father_name", true)}
        {renderField("Father Occupation", "father_occupation", true)}
        {renderField("Father Income", "father_income", true)}
        {renderField("Father Phone", "father_phone", true)}

        {renderField("Mother Name", "mother_name", true)}
        {renderField("Mother Occupation", "mother_occupation", true)}
        {renderField("Mother Income", "mother_income", true)}
        {renderField("Mother Phone", "mother_phone", true)}
    </div>
    </div>

      {/* QUALIFICATION */}
      <div style={{ marginBottom: "10px", fontSize: "16px" }}>
        <h3>Qualified Previous Exam Details</h3>
        <div style={grid}>
          {renderField("Test", "test_name", true)}
          {renderField("Hall Ticket", "hall_ticket_number", true)}
          {renderField("Rank", "rank", true)}
          {renderField("Study Duration", "study_duration", true)}
        </div>
      </div>
    </div>
  );
}

export function CommunicationDetails() {
  const [data, setData] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadCommunication();
  }, []);

  const loadCommunication = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
        "http://localhost:5002/api/student/communication",
        {
          headers: { "x-user-id": user.user_id }
        }
      );

      setData(res.data.data || {});
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.put(
        "http://localhost:5002/api/student/student/communication",
        data,
        {
          headers: { "x-user-id": user.user_id }
        }
      );

      alert("Updated successfully");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const renderField = (label, field, editable = true) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <p style={{ fontWeight: "600", marginBottom: "4px" }}>{label}</p>

      {editMode && editable ? (
        <input
          value={data[field] || ""}
          onChange={(e) => handleChange(field, e.target.value)}
          style={input}
        />
      ) : (
        <p>{data[field] || "-"}</p>
      )}
    </div>
  );

  // ---------- styles ----------
  const grid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "15px"
  };

  const input = {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "6px"
  };

  const button = {
    padding: "8px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Communication Details</h2>

      {/* ACTION BUTTON */}
      <div style={{ marginBottom: "15px" }}>
        {!editMode ? (
          <button
            style={{ ...button, background: "#2563eb", color: "white" }}
            onClick={() => setEditMode(true)}
          >
            Edit Details
          </button>
        ) : (
          <>
            <button
              style={{ ...button, background: "green", color: "white", marginRight: "10px" }}
              onClick={handleSave}
            >
              Save
            </button>

            <button
              style={{ ...button, background: "#ccc" }}
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {/* PHONE + EMAIL */}
      <h3>Phone & Email</h3>
      <div style={grid}>
        {renderField("Landline", "landline")}
        {renderField("Father Mobile", "father_phone")}
        {renderField("Mother Mobile", "mother_phone")}
        {renderField("Parent Email", "parent_email")}
        {renderField("Student Email", "student_email")}
        {renderField("Alt Email", "alt_email")}
      </div>

      {/* LOCATION */}
      <h3 style={{ marginTop: "20px" }}>Location</h3>
      <div style={grid}>
        {renderField("Distance to College", "distance_to_college")}
        {renderField("Area", "area")}
        {renderField("Belongs To", "belongs_to")}
      </div>

      {/* CORRESPONDENCE ADDRESS */}
      <h3 style={{ marginTop: "20px" }}>Correspondence Address</h3>
      <div style={grid}>
        {renderField("Door No", "c_door_no")}
        {renderField("Street", "c_street")}
        {renderField("Village", "c_area")}
        {renderField("Mandal", "c_mandal")}
        {renderField("State", "c_state")}
        {renderField("District", "c_district")}
        {renderField("Pincode", "c_pincode")}
      </div>

      {/* PERMANENT ADDRESS */}
      <h3 style={{ marginTop: "20px" }}>Permanent Address</h3>
      <div style={grid}>
        {renderField("Door No", "p_door_no")}
        {renderField("Street", "p_street")}
        {renderField("Village", "p_area")}
        {renderField("Mandal", "p_mandal")}
        {renderField("State", "p_state")}
        {renderField("District", "p_district")}
        {renderField("Pincode", "p_pincode")}
      </div>
    </div>
  );
}

export function IdentityDetails() {
  const [data, setData] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadIdentity();
  }, []);

  const loadIdentity = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await axios.get(
      "http://localhost:5002/api/student/identity",
      {
        headers: { "x-user-id": user.user_id }
      }
    );

    setData(res.data.data || {});
  };

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    await axios.put(
      "http://localhost:5002/api/student/student/identity",
      data,
      {
        headers: { "x-user-id": user.user_id }
      }
    );

    alert("Updated successfully");
    setEditMode(false);
  };

  const renderField = (label, field) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <p style={{ fontWeight: "600" }}>{label}</p>

      {editMode ? (
        <input
          value={data[field] || ""}
          onChange={(e) => handleChange(field, e.target.value)}
          style={input}
        />
      ) : (
        <p>{data[field] || "-"}</p>
      )}
    </div>
  );

  const grid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "15px"
  };

  const input = {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "6px"
  };

  const button = {
    padding: "8px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Identity Details</h2>

      <div style={{ marginBottom: "15px" }}>
        {!editMode ? (
          <button
            style={{ ...button, background: "#2563eb", color: "white" }}
            onClick={() => setEditMode(true)}
          >
            Edit Details
          </button>
        ) : (
          <>
            <button
              style={{ ...button, background: "green", color: "white" }}
              onClick={handleSave}
            >
              Save
            </button>
            <button
              style={{ ...button, marginLeft: "10px" }}
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </>
        )}
      </div>

      <div style={grid}>
        {renderField("Aadhar Number", "aadhar_number")}
        {renderField("PAN Number", "pan_number")}
        {renderField("Passport Number", "passport_number")}
        {renderField("Voter ID", "voter_id")}
        {renderField("Driving License", "driving_license")}
      </div>
    </div>
  );
}

export function QualificationDetails() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    score_type: "percentage"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await axios.get(
      "http://localhost:5002/api/student/qualification",
      {
        headers: { "x-user-id": user.user_id }
      }
    );

    setList(res.data.data || []);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdd = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    await axios.post(
      "http://localhost:5002/api/student/qualification",
      form,
      {
        headers: { "x-user-id": user.user_id }
      }
    );

    alert("Added");
    setForm({ score_type: "percentage" });
    loadData();
  };

  const handleDelete = async (id) => {
    await axios.delete(
      `http://localhost:5002/api/student/qualification/${id}`
    );
    loadData();
  };

  const input = {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "6px"
  };
  const th = {
    padding: "10px",
    fontWeight: "600",
    borderBottom: "1px solid #e5e7eb"
    };

    const td = {
    padding: "10px",
    color: "#333"
    };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Qualification Details</h2>

      {/* ADD FORM */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "10px",
        marginBottom: "20px"
      }}>
        <input
          placeholder="Type (10th / Inter)"
          value={form.qualification_type || ""}
          onChange={e => handleChange("qualification_type", e.target.value)}
          style={input}
        />

        <input
          placeholder="Board"
          value={form.board || ""}
          onChange={e => handleChange("board", e.target.value)}
          style={input}
        />

        <input
          placeholder="Institution"
          value={form.institution || ""}
          onChange={e => handleChange("institution", e.target.value)}
          style={input}
        />

        <input
          placeholder="Year"
          value={form.year_of_passing || ""}
          onChange={e => handleChange("year_of_passing", e.target.value)}
          style={input}
        />

        {/* 🔥 SCORE TYPE DROPDOWN */}
        <select
          value={form.score_type}
          onChange={(e) =>
            handleChange("score_type", e.target.value)
          }
          style={input}
        >
          <option value="percentage">Percentage</option>
          <option value="gpa">GPA</option>
        </select>

        {/* 🔥 DYNAMIC INPUT */}
        {form.score_type === "percentage" ? (
          <input
            placeholder="Percentage"
            value={form.percentage || ""}
            onChange={(e) =>
              handleChange("percentage", e.target.value)
            }
            style={input}
          />
        ) : (
          <input
            placeholder="GPA"
            value={form.gpa || ""}
            onChange={(e) =>
              handleChange("gpa", e.target.value)
            }
            style={input}
          />
        )}

        <input
          placeholder="Hall Ticket"
          value={form.hall_ticket_number || ""}
          onChange={e =>
            handleChange("hall_ticket_number", e.target.value)
          }
          style={input}
        />
      </div>

      <button
        onClick={handleAdd}
        style={{
          padding: "10px 15px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px"
        }}
      >
        Add Qualification
      </button>

      {/* LIST */}
      <div style={{
        marginTop: "25px",
        background: "white",
        borderRadius: "10px",
        padding: "15px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
        <h3 style={{ marginBottom: "15px" }}>Saved Qualifications</h3>

        <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px"
        }}>
            <thead>
            <tr style={{
                background: "#f1f5f9",
                textAlign: "left"
            }}>
                <th style={th}>Type</th>
                <th style={th}>Board</th>
                <th style={th}>Institution</th>
                <th style={th}>Year</th>
                <th style={th}>Score</th>
                <th style={th}>Hall Ticket</th>
                <th style={th}>Action</th>
            </tr>
            </thead>

            <tbody>
            {list.length === 0 ? (
                <tr>
                <td colSpan="7" style={{
                    textAlign: "center",
                    padding: "15px",
                    color: "#888"
                }}>
                    No qualifications added yet
                </td>
                </tr>
            ) : (
                list.map(item => (
                <tr key={item.qualification_id} style={{
                    borderBottom: "1px solid #e5e7eb"
                }}>
                    <td style={td}>{item.qualification_type}</td>
                    <td style={td}>{item.board}</td>
                    <td style={td}>{item.institution}</td>
                    <td style={td}>{item.year_of_passing}</td>

                    <td style={td}>
                    {item.score_type === "gpa"
                        ? `${item.gpa} GPA`
                        : `${item.percentage}%`}
                    </td>

                    <td style={td}>{item.hall_ticket_number}</td>

                    <td style={td}>
                    <button
                        onClick={() => handleDelete(item.qualification_id)}
                        style={{
                        padding: "5px 10px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                        }}
                    >
                        Delete
                    </button>
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </table>
        </div>
    </div>
  );
}

export function Certificates() {
  const [list, setList] = useState([]);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await axios.get(
      "http://localhost:5002/api/student/certificates",
      {
        headers: { "x-user-id": user.user_id }
      }
    );

    setList(res.data.data || []);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select file");

    const user = JSON.parse(localStorage.getItem("user"));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("certificate_name", name);

    await axios.post(
      "http://localhost:5002/api/student/certificates",
      formData,
      {
        headers: {
          "x-user-id": user.user_id,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    alert("Uploaded successfully");
    setFile(null);
    setName("");
    loadData();
  };

  const handleDelete = async (id) => {
    await axios.delete(
      `http://localhost:5002/api/student/certificates/${id}`
    );
    loadData();
  };

  // styles
  const card = {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
  };

  const input = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px"
  };

  const button = {
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500"
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Certificates</h2>

      {/* 🔷 UPLOAD SECTION */}
      <div style={{ ...card, marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "10px" }}>Upload Certificate</h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto",
          gap: "10px"
        }}>
          <input
            placeholder="Certificate Name (e.g. SSC, Inter)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={input}
          />

          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => setFile(e.target.files[0])}
            style={input}
          />

          <button
            onClick={handleUpload}
            style={{ ...button, background: "#2563eb", color: "white" }}
          >
            Upload
          </button>
        </div>

        {/* file preview name */}
        {file && (
          <p style={{ marginTop: "10px", color: "#555" }}>
            Selected: {file.name}
          </p>
        )}
      </div>

      {/* 🔷 LIST SECTION */}
      <div style={card}>
        <h3 style={{ marginBottom: "10px" }}>Uploaded Certificates</h3>

        {list.length === 0 ? (
          <p style={{ color: "#888" }}>No certificates uploaded</p>
        ) : (
          <table style={{
            width: "100%",
            borderCollapse: "collapse"
          }}>
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                <th style={th}>Name</th>
                <th style={th}>Type</th>
                <th style={th}>View</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {list.map(item => (
                <tr key={item.certificate_id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  
                  <td style={td}>{item.certificate_name}</td>

                  <td style={td}>
                    {item.file_type.includes("pdf") ? "📄 PDF" : "🖼 Image"}
                  </td>

                  <td style={td}>
                    <a
                      href={`http://localhost:5002/uploads/${item.file_url}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#2563eb" }}
                    >
                      View
                    </a>
                  </td>

                  <td style={td}>
                    <button
                      onClick={() => handleDelete(item.certificate_id)}
                      style={{
                        ...button,
                        background: "#ef4444",
                        color: "white"
                      }}
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// styles
const th = {
  padding: "10px",
  textAlign: "left",
  borderBottom: "1px solid #e5e7eb"
};

const td = {
  padding: "10px"
};

export function StudentAchievements() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await axios.get(
      "http://localhost:5002/api/student/achievements",
      { headers: { "x-user-id": user.user_id } }
    );

    setList(res.data.data || []);
  };

  const handleAdd = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });

    if (file) formData.append("file", file);

    await axios.post(
      "http://localhost:5002/api/student/achievements",
      formData,
      {
        headers: {
          "x-user-id": user.user_id,
          "Content-Type": "multipart/form-data"
        }
      }
    );

    alert("Achievement Added");
    setForm({});
    setFile(null);
    loadData();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5002/api/student/achievements/${id}`);
    loadData();
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toISOString().split("T")[0];
    };

  // ---------- STYLES ----------
  const container = {
    padding: "20px"
  };

  const card = {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: "20px"
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px"
  };

  const input = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    boxSizing:"border-box"
  };

  const button = {
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600"
  };

  return (
    <div style={container}>
      <h2>Student Achievements</h2>

      {/* FORM CARD */}
      <div style={card}>
        <h3>Add Achievement</h3>

        <div style={grid}>
          <input
            placeholder="Title"
            value={form.title || ""}
            onChange={e => setForm({ ...form, title: e.target.value })}
            style={input}
          />

          <select
            value={form.level || ""}
            onChange={e => setForm({ ...form, level: e.target.value })}
            style={input}
            >
            <option value="">Select Level</option>
            <option value="College">College</option>
            <option value="University">University</option>
            <option value="Regional">Regional</option>
            <option value="State">State</option>
            <option value="National">National</option>
            <option value="International">International</option>
            </select>

          <input
            type="date"
            value={form.achievement_date || ""}
            onChange={e => setForm({ ...form, achievement_date: e.target.value })}
            style={input}
          />

          <input
            placeholder="Description"
            value={form.description || ""}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={input}
          />

          <input
            type="file"
            onChange={e => setFile(e.target.files[0])}
            style={input}
          />
        </div>

        <button
          onClick={handleAdd}
          style={{ ...button, background: "#2563eb", color: "white", marginTop: "15px" }}
        >
          Add Achievement
        </button>
      </div>

      {/* LIST */}
      <div>
        {list.length === 0 && <p>No achievements added yet.</p>}

        {list.map(item => (
          <div key={item.achievement_id} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>{item.title}</h3>

              <button
                onClick={() => handleDelete(item.achievement_id)}
                style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
                >
                Delete
                </button>
            </div>

            <p style={{ color: "#555" }}>{item.description}</p>

            <div style={{ marginTop: "10px", fontSize: "14px" }}>
              <p><b>Level:</b> {item.level}</p>
              <p><b>Date:</b> {formatDate(item.achievement_date)}</p>
            </div>

            {item.file_url && (
              <a
                href={`http://localhost:5002/uploads/${item.file_url}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#2563eb", fontWeight: "600" }}
              >
                View Proof
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}