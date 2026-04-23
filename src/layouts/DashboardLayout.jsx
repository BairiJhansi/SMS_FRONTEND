import Sidebar from "../components/common/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: "flex"}}>
      
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        <div style={{ padding: "20px", overflowY: "auto" }}>
          {children}
        </div>
      </div>

    </div>
  );
};

export default DashboardLayout;