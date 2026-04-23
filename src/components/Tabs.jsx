import { useState } from "react";
const tabStyle = (active) => ({
  padding: "10px 15px",
  cursor: "pointer",
  borderBottom: active ? "3px solid #2563eb" : "3px solid transparent",
  fontWeight: active ? "600" : "400",
  color: active ? "#2563eb" : "#555"
});

export default function Tabs({ tabs, children }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* TAB HEADERS */}
      <div style={{
        display: "flex",
        gap: "20px", 

        background: "white",
        padding: "10px 20px",
        borderRadius: "10px",
        marginBottom: "15px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}>
        {tabs.map((t, i) => (
          <div key={i} style={tabStyle(active === i)} onClick={() => setActive(i)}>
            {t}
          </div>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
      }}>
        {children[active]}
      </div>
    </div>
  );
}