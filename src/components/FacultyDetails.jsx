import { useEffect, useState } from "react";
import axios from "axios";
import { AlignCenter } from "lucide-react";

/* =========================
   FACULTY PROFILE
========================= */

export default function FacultyDetails() {
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const loadFaculty = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const res = await axios.get(
          "http://localhost:5002/api/faculty/profile",
          { headers: { "x-user-id": user.user_id } }
        );

        setFaculty(res.data.data);
        setFormData(res.data.data);
      } catch {
        setError("Failed to load faculty profile");
      } finally {
        setLoading(false);
      }
    };

    loadFaculty();
  }, []);

  if (loading) return <p style={{ padding: 30 }}>Loading...</p>;
  if (error) return <p style={{ padding: 30 }}>{error}</p>;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    await axios.put(
      "http://localhost:5002/api/faculty/profile",
      formData,
      { headers: { "x-user-id": user.user_id } }
    );

    setFaculty(formData);
    setEditMode(false);
  };

  const renderField = (label, name) => {
    if (editMode) {
      return (
        <div style={fieldBox}>
          <label style={labelStyle}>{label}</label>

          {name === "marital_status" ? (
            <select
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </select>
          ) : (
            <input
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              style={inputStyle}
            />
          )}
        </div>
      );
    }

    return (
      <div style={fieldBox}>
        <label style={labelStyle}>{label}</label>
        <div style={valueBox}>{faculty[name] || "-"}</div>
      </div>
    );
  };

  return (
    <div style={container}>
      <h2>Faculty Details</h2>

      <div style={tabBar}>
        <button style={editBtn} onClick={() => setEditMode(!editMode)}>
          {editMode ? "Cancel" : "Edit"}
        </button>
      </div>

      <div style={tabContent}>
        <div style={grid3}>
          <div style={sectionTitle}>Personal Information</div>

          {renderField("First Name", "first_name")}
          {renderField("Last Name", "last_name")}
          {renderField("Phone Number", "phone_number")}
          {renderField("Nationality", "nationality")}
          {renderField("Religion", "religion")}
          {renderField("Mother Tongue", "mother_tongue")}
          {renderField("Marital Status", "marital_status")}

          <div style={sectionTitle}>Parents Details</div>

          {renderField("Father Name", "father_name")}
          {renderField("Father Occupation", "father_occupation")}
          {renderField("Father Phone", "father_phone")}
          {renderField("Mother Name", "mother_name")}
          {renderField("Mother Occupation", "mother_occupation")}
          {renderField("Mother Phone", "mother_phone")}

          {formData.marital_status === "Married" && (
            <>
              <div style={sectionTitle}>Spouse Details</div>

              {renderField("Spouse Name", "spouse_name")}
              {renderField("Spouse Occupation", "spouse_occupation")}
              {renderField("Spouse Phone", "spouse_phone")}
              {renderField("Spouse Email", "spouse_email")}
            </>
          )}

          <div style={sectionTitle}>Employment Details</div>

          {renderField("Designation", "designation")}
          {renderField("Qualification", "qualification")}
          {renderField("Department ID", "department_id")}
          {renderField("Office Location", "office_location")}

          {editMode && (
            <div style={{ gridColumn: "span 3" }}>
              <button style={saveBtn} onClick={handleSave}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================
   FACULTY ACADEMIC DETAILS
========================= */
/* ---------------- Field ---------------- */
const Field = ({ label, children }) => (
  <div style={field}>
    <label style={labelStyle}>{label}</label>
    {children}
  </div>
);

/* ---------------- Component ---------------- */
export function FacultyAchDetails() {
  const [records, setRecords] = useState([]);
  const [activeTab, setActiveTab] = useState("journal");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
  title: "",
  journal: "",
  authors: "",
  year: "",
  doi: "",
  indexed: "",
  description: "",
  proof: ""
});

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await axios.get(
      `http://localhost:5002/api/faculty/details/${user.user_id}`,
      { headers: { "x-user-id": user.user_id } }
    );

    const publications = res.data.publications || [];

    const achievements = (res.data.achievements || []).map(a => ({
      ...a,
      type: "achievements"
    }));

    setRecords([...publications, ...achievements]);
  };

  /* ---------------- Add ---------------- */
 const handleAdd = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (activeTab === "achievements") {
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("year", form.year);
    formData.append("proof", form.proof);

    await axios.post(
      "http://localhost:5002/api/faculty/achievement",
      formData,
      {
        headers: {
          "x-user-id": user.user_id,
          "Content-Type": "multipart/form-data"
        }
      }
    );

  } else {
    await axios.post(
      "http://localhost:5002/api/faculty/publication",
      { ...form, type: activeTab },
      { headers: { "x-user-id": user.user_id } }
    );
  }

    setShowForm(false);
    setForm({
      title: "",
      journal: "",
      authors: "",
      year: "",
      doi: "",
      indexed: "",
      description: ""
    });

    loadDetails();
  };

  /* ---------------- Delete ---------------- */
  const handleDelete = async (id) => {
    const user = JSON.parse(localStorage.getItem("user"));

    const url =
      activeTab === "achievements"
        ? `/achievement/${id}`
        : `/publication/${id}`;

    await axios.delete(
      `http://localhost:5002/api/faculty${url}`,
      { headers: { "x-user-id": user.user_id } }
    );

    loadDetails();
  };

  const filtered =
  activeTab === "achievements"
    ? records.filter(r => r.type === "achievements")
    : records.filter(r => r.type === activeTab);
    console.log(records)
  console.log(activeTab)

  return (
    <div style={container}>
      <h2>Faculty Academic Portfolio</h2>

      {/* Tabs */}
      <div style={tabs}>
        <Tab label="Journal" value="journal" {...{ activeTab, setActiveTab }} />
        <Tab label="Conference" value="conference" {...{ activeTab, setActiveTab }} />
        <Tab label="Books" value="book" {...{ activeTab, setActiveTab }} />
        <Tab label="Achievements" value="achievements" {...{ activeTab, setActiveTab }} />
      </div>

      {/* Header */}
      <div style={sectionHeader}>
        <h3 style={{ margin: 0, textTransform: "capitalize" }}>
          {activeTab}
        </h3>

        <button style={addBtn} onClick={() => setShowForm(true)}>
          + Add
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={formCard}>

          {/* JOURNAL */}
          {activeTab === "journal" && (
            <div style={grid}>
              <Field label="Title">
                <input style={input}
                  value={form.title}
                  onChange={e=>setForm({...form,title:e.target.value})}
                />
              </Field>

              <Field label="Year">
                <input style={input}
                  value={form.year}
                  onChange={e=>setForm({...form,year:e.target.value})}
                />
              </Field>

              <Field label="Journal / Publisher">
                <input style={input}
                  value={form.journal}
                  onChange={e=>setForm({...form,journal:e.target.value})}
                />
              </Field>

              <Field label="Indexed">
                <input style={input}
                  value={form.indexed}
                  onChange={e=>setForm({...form,indexed:e.target.value})}
                />
              </Field>

              <Field label="Authors">
                <input style={input}
                  value={form.authors}
                  onChange={e=>setForm({...form,authors:e.target.value})}
                />
              </Field>

              <Field label="DOI">
                <input style={input}
                  value={form.doi}
                  onChange={e=>setForm({...form,doi:e.target.value})}
                />
              </Field>
            </div>
          )}

          {/* CONFERENCE */}
          {activeTab === "conference" && (
            <div style={grid}>
              <Field label="Paper Title">
                <input style={input}
                  onChange={e=>setForm({...form,title:e.target.value})}
                />
              </Field>

              <Field label="Year">
                <input style={input}
                  onChange={e=>setForm({...form,year:e.target.value})}
                />
              </Field>

              <Field label="Conference Name">
                <input style={input}
                  onChange={e=>setForm({...form,journal:e.target.value})}
                />
              </Field>

              <Field label="Location">
                <input style={input}
                  onChange={e=>setForm({...form,indexed:e.target.value})}
                />
              </Field>

              <Field label="Authors">
                <input style={input}
                  onChange={e=>setForm({...form,authors:e.target.value})}
                />
              </Field>

              <Field label="DOI">
                <input style={input}
                  onChange={e=>setForm({...form,doi:e.target.value})}
                />
              </Field>
            </div>
          )}

          {/* BOOK */}
          {activeTab === "book" && (
            <div style={grid}>
              <Field label="Book Title">
                <input style={input}
                  onChange={e=>setForm({...form,title:e.target.value})}
                />
              </Field>

              <Field label="Year">
                <input style={input}
                  onChange={e=>setForm({...form,year:e.target.value})}
                />
              </Field>

              <Field label="Publisher">
                <input style={input}
                  onChange={e=>setForm({...form,journal:e.target.value})}
                />
              </Field>

              <Field label="ISBN">
                <input style={input}
                  onChange={e=>setForm({...form,indexed:e.target.value})}
                />
              </Field>

              <Field label="Authors">
                <input style={input}
                  onChange={e=>setForm({...form,authors:e.target.value})}
                />
              </Field>
            </div>
          )}

          {/* ACHIEVEMENTS */}
          {activeTab === "achievements" && (
            <div style={grid}>
              <Field label="Achievement Title">
                <input
                  style={input}
                  value={form.title}
                  onChange={e=>setForm({...form,title:e.target.value})}
                />
              </Field>

              <Field label="Year">
                <input
                  style={input}
                  value={form.year}
                  onChange={e=>setForm({...form,year:e.target.value})}
                />
              </Field>

              <Field label="Description">
                <textarea
                  style={textarea}
                  value={form.description}
                  onChange={e=>setForm({...form,description:e.target.value})}
                />
              </Field>

              <Field label="Proof Upload">
                <input
                  type="file"
                  onChange={(e)=>setForm({...form, proof:e.target.files[0]})}
                />
              </Field>
            </div>
          )}

          

          <button style={saveBtn} onClick={handleAdd}>
            Save
          </button>

        </div>
      )}

      {/* Table */}
        <div style={card}>
          <h3 style={sectionTitle}>Uploaded {activeTab}</h3>

          <div style={tableWrapper}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={thSno}>S.No</th>

                  {activeTab === "journal" && (
                    <>
                      <th style={thTitle}>Title</th>
                      <th style={thJournal}>Journal / Publisher</th>
                      <th style={thAuthors}>Authors</th>
                      <th style={thIndexed}>Indexed</th>
                      <th style={thDoi}>DOI</th>
                      <th style={thYear}>Year</th>
                    </>
                  )}

                  {activeTab === "conference" && (
                    <>
                      <th style={thTitle}>Paper Title</th>
                      <th style={thJournal}>Conference</th>
                      <th style={thIndexed}>Location</th>
                      <th style={thAuthors}>Authors</th>
                      <th style={thDoi}>DOI</th>
                      <th style={thYear}>Year</th>
                    </>
                  )}

                  {activeTab === "book" && (
                    <>
                      <th style={thTitle}>Book Title</th>
                      <th style={thJournal}>Publisher</th>
                      <th style={thIndexed}>ISBN</th>
                      <th style={thAuthors}>Authors</th>
                      <th style={thYear}>Year</th>
                    </>
                  )}

                  {activeTab === "achievements" && (
                    <>
                      <th style={thTitle}>Title</th>
                      <th>Description</th>
                      <th>Proof</th>
                      <th style={thYear}>Year</th>
                    </>
                  )}

                  <th style={thAction}>Action</th>
                </tr>
                </thead>

              <tbody>
                {filtered.map((j, index) => (
                <tr key={j.id} style={row}>
                <td>{index + 1}</td>

                {activeTab === "journal" && (
                <>
                <td style={wrap}>{j.title}</td>
                <td style={wrap}>{j.journal}</td>
                <td style={wrap}>{j.authors}</td>
                <td>{j.indexed}</td>
                <td><a href={j.doi} target="_blank">View</a></td>
                <td>{j.year}</td>
                </>
                )}

                {activeTab === "conference" && (
                <>
                <td style={wrap}>{j.title}</td>
                <td style={wrap}>{j.journal}</td>
                <td>{j.indexed}</td>
                <td style={wrap}>{j.authors}</td>
                <td><a href={j.doi} target="_blank">View</a></td>
                <td>{j.year}</td>
                </>
                )}

                {activeTab === "book" && (
                <>
                <td style={wrap}>{j.title}</td>
                <td style={wrap}>{j.journal}</td>
                <td>{j.indexed}</td>
                <td style={wrap}>{j.authors}</td>
                <td>{j.year}</td>
                </>
                )}

                {activeTab === "achievements" && (
                  <>
                  <td style={wrap}>{j.title}</td>
                  <td style={wrap}>{j.description}</td>

                  <td>
                  {j.proof && (
                  <a
                  href={`http://localhost:5002/uploads/${j.proof}`}
                  target="_blank"
                  >
                  View
                  </a>
                  )}
                  </td>

                  <td>{j.year}</td>
                  </>
                  )}

                <td>
                <button
                style={deleteBtn}
                onClick={() => handleDelete(j.id)}
                >
                Delete
                </button>
                </td>

                </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}

/* ---------------- Tab ---------------- */
function Tab({ label, value, activeTab, setActiveTab }) {
  return (
    <button
      onClick={() => setActiveTab(value)}
      style={{
        padding: "8px 16px",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        background: activeTab === value ? "#2563eb" : "#e5e7eb",
        color: activeTab === value ? "white" : "#333",
        fontWeight: 600
      }}
    >
      {label}
    </button>
  );
}

/* ---------------- Styles ---------------- */

const container = {
  padding: 30,
  background: "#f5f7fb",
  minHeight: "100vh"
};

const tabs = {
  display: "flex",
  gap: 10,
  marginBottom: 15
};

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 10
};

const addBtn = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: 6,
  cursor: "pointer"
};

const formCard = {
  background: "white",
  padding: 15,
  borderRadius: 8,
  marginBottom: 20
};

const textarea = {
  padding: 8,
  border: "1px solid #ddd",
  borderRadius: 6,
  minHeight: 70,
  resize: "vertical"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10
};

const field = {
  display: "flex",
  flexDirection: "column",
  gap: 4
};

const labelStyle = {
  fontWeight: 600,
  fontSize: 13
};

const input = {
  padding: 8,
  border: "1px solid #ddd",
  borderRadius: 6
};

const saveBtn = {
  marginTop: 10,
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: 6,
  cursor: "pointer"
};

const card = {
  background: "white",
  padding: 15,
  borderRadius: 8
};

const sectionTitle = {
  marginBottom: 10
};

const tableWrapper = {
  overflowX: "auto"
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  tableLayout: "fixed",
  textAlign: "left"
};

const row = {
  borderTop: "1px solid #eee"
};

const deleteBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: 6,
  cursor: "pointer"
};

const wrap = {
  wordBreak: "break-word",
  whiteSpace: "normal"
};

const thSno = { width: "08%", };
const thTitle = { width: "25%" };
const thJournal = { width: "15%" };
const thAuthors = { width: "18%" };
const thIndexed = { width: "10%" };
const thDoi = { width: "10%" };
const thYear = { width: "7%" };
const thAction = { width: "10%" };

const wrapText = {
  wordBreak: "break-word",
  whiteSpace: "normal"
};







const fieldBox = { display: "flex", flexDirection: "column", fontSize: "14px" };
const inputStyle = { padding: "8px", border: "1px solid #ccc", borderRadius: "6px" };
const valueBox = { padding: "8px", border: "1px solid #ddd", borderRadius: "6px", background: "#fafafa" };
const editBtn = { padding: "10px 20px", background: "#f59e0b", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" };
const tabContent = { background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }; 
const grid3 = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px" };
const tabBar = { display: "flex", justifyContent: "flex-end", marginBottom: "20px" };