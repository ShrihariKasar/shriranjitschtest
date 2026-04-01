import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", value: 60 },
  { name: "Tue", value: 70 },
  { name: "Wed", value: 85 },
  { name: "Thu", value: 80 },
  { name: "Fri", value: 65 },
  { name: "Sat", value: 30 },
];

export default function Dashboard() {
  return (
    <div
      style={{
        padding: "25px",
        background: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      {/* TITLE */}
      <h2 style={{ marginBottom: "20px", fontWeight: "600" }}>
        Dashboard
      </h2>

      {/* TOP CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "18px",
          marginBottom: "22px",
        }}
      >
        <Card title="Total Students" color="#7aa7d9" />
        <Card title="Total Employees" color="#a99ad6" />
        <Card title="Revenue" color="#7fc799" />
        <Card title="Total Profit" color="#e79c94" />
      </div>

      {/* MAIN SECTION */}
      <div style={{ display: "flex", gap: "20px" }}>
        
        {/* CHART */}
        <div
          style={{
            flex: 3,
            background: "#ffffff",
            padding: "20px",
            borderRadius: "14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <h4 style={{ marginBottom: "10px", fontWeight: "500" }}>
            Attendance
          </h4>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3C91E0"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div style={boxStyle}>
            <Stat label="Today Present Students" value="0%" />
            <Stat label="Today Present Employees" value="0%" />
            <Stat label="This Month Fee Collection" value="0%" />
          </div>

          <div style={boxStyle}>
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
}

/* CARD COMPONENT */
function Card({ title, color }) {
  return (
    <div
      style={{
        background: color,
        padding: "18px",
        borderRadius: "14px",
        color: "#fff",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        transition: "0.3s",
      }}
    >
      <div style={{ fontSize: "14px", opacity: 0.9 }}>
        {title}
      </div>

      <div
        style={{
          marginTop: "8px",
          fontSize: "26px",
          fontWeight: "700",
        }}
      >
        0
      </div>
    </div>
  );
}

/* STAT COMPONENT */
function Stat({ label, value }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <p style={{ fontSize: "12px", color: "#555" }}>{label}</p>

      <div
        style={{
          background: "#e0e0e0",
          height: "7px",
          borderRadius: "10px",
          marginTop: "6px",
        }}
      >
        <div
          style={{
            width: value,
            height: "100%",
            background: "#3C91E0",
            borderRadius: "10px",
          }}
        ></div>
      </div>
    </div>
  );
}


/* CALENDAR COMPONENT */
function Calendar() {
  return (
    <div style={{ textAlign: "center" }}>
      <h4 style={{ marginBottom: "12px", fontWeight: "500" }}>
        March
      </h4>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "6px",
          fontSize: "12px",
        }}
      >
        {Array.from({ length: 31 }, (_, i) => (
          <div
            key={i}
            style={{
              padding: "7px",
              borderRadius: "6px",
              background: i === 13 ? "#ff5b5b" : "#f1f1f1",
              color: i === 13 ? "#fff" : "#333",
              fontWeight: i === 13 ? "bold" : "normal",
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}


const boxStyle = {
  background: "#ffffff",
  padding: "16px",
  borderRadius: "14px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
};