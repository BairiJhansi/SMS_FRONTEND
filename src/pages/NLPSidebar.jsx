import React, { useState } from "react";
import axios from "axios";

const NLPSearch = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleAsk = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setResponse("");

      const res = await axios.post("http://localhost:5007/api/nlp/query", {
        query,
        user_id: user.user_id,
        role: user.role_id
      });

      setResponse(res.data.answer);
    } catch (err) {
      console.error(err);
      setResponse("❌ Error fetching response");
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
  if (user.role_id === 1) {
    return `Ask something like:
- My attendance
- Attendance trend
- Attendance in computer programming
- Fees due
- My results`;
  }

  if (user.role_id === 2) {
    return `Ask something like:
- Students with low attendance
- Top 5 students attendance
- Attendance above 75%
- Class attendance trend`;
  }

  return "Ask anything...";
};

  return (
    <div style={{ padding: "30px", width: "100%" }}>
      
      <h2 style={{ marginBottom: "20px" }}>🤖 AI Academic Assistant</h2>

      {/* Input */}
      <textarea
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  placeholder={getPlaceholder()}
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          resize: "none",
          height: "120px",
          fontSize: "14px"
        }}
      />

      {/* Button */}
      <button
        onClick={handleAsk}
        disabled={loading}
        style={{
          marginTop: "15px",
          padding: "12px 20px",
          background: "#2563eb",
          border: "none",
          borderRadius: "8px",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {/* Response */}
      <div
        style={{
          marginTop: "25px",
          background: "#f1f5f9",
          padding: "20px",
          borderRadius: "10px",
          minHeight: "150px",
          whiteSpace: "pre-wrap"
        }}
      >
        {response || "💬 Your results will appear here..."}
      </div>
    </div>
  );
};

export default NLPSearch;