import "../../styles/dashboard.css";
import { useState } from "react";
import DashboardTabs from "../../components/DashboardTabs";

export default function Financials() {
  const [tab, setTab] = useState("collections");
  const [subTab, setSubTab] = useState("salaries");

  const [collections, setCollections] = useState([]);
  const [expenses, setExpenses] = useState({
    salaries: [],
    vendors: [],
  });

  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  // ✅ ADD COLLECTION
  const addCollection = () => {
    if (!amount) return;

    setCollections([
      ...collections,
      {
        id: Date.now(),
        amount,
        desc,
        date: new Date().toLocaleDateString(),
      },
    ]);

    setAmount("");
    setDesc("");
  };

  // ✅ ADD EXPENSE
  const addExpense = () => {
    if (!amount) return;

    setExpenses((prev) => ({
      ...prev,
      [subTab]: [
        ...prev[subTab],
        {
          id: Date.now(),
          amount,
          desc,
          date: new Date().toLocaleDateString(),
        },
      ],
    }));

    setAmount("");
    setDesc("");
  };

  return (
    <div className="page">
      <DashboardTabs />
      <h1 className="page-title">Financials</h1>

      {/* MAIN TABS */}
      <div className="fn-tabs">
        <span
          className={tab === "collections" ? "active" : ""}
          onClick={() => setTab("collections")}
        >
         Fees Collections
        </span>

        <span
          className={tab === "expenses" ? "active" : ""}
          onClick={() => setTab("expenses")}
        >
          Expenses
        </span>

        <span
          className={tab === "reports" ? "active" : ""}
          onClick={() => setTab("reports")}
        >
          Reports
        </span>
      </div>

      {/* ================= COLLECTIONS ================= */}
      {tab === "collections" && (
        <div className="fn-card">

          <div className="fn-form">
  <input
    placeholder="Fees Type"
    value={desc}
    onChange={(e) => setDesc(e.target.value)}
  />

  <input
    type="number"
    placeholder="Amount"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
  />

  <input
    placeholder="Description"
    value={desc}
    onChange={(e) => setDesc(e.target.value)}
  />

  <button onClick={addCollection}>Add</button>
</div>

          <div className="fn-list">
            {collections.map((c) => (
              <div key={c.id} className="fn-row">
                <div>
                  ₹{c.amount}
                  <p>{c.desc}</p>
                </div>
                <small>{c.date}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= EXPENSES ================= */}
      {tab === "expenses" && (
        <div className="fn-card">

          {/* SUB TABS */}
          <div className="fn-subtabs">
            <span
              className={subTab === "salaries" ? "active" : ""}
              onClick={() => setSubTab("salaries")}
            >
              Salaries
            </span>

            <span
              className={subTab === "vendors" ? "active" : ""}
              onClick={() => setSubTab("vendors")}
            >
              Vendors
            </span>
          </div>

          {/* FORM */}
          <div className="fn-form">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <input
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            <button onClick={addExpense}>Add Expense</button>
          </div>

          {/* LIST */}
          <div className="fn-list">
            {expenses[subTab].map((e) => (
              <div key={e.id} className="fn-row">
                <div>
                  ₹{e.amount}
                  <p>{e.desc}</p>
                </div>
                <small>{e.date}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= REPORTS ================= */}
      {tab === "reports" && (
        <div className="fn-card">

          <div className="fn-report">
            <h3>Total Collections</h3>
            <p>
              ₹
              {collections.reduce(
                (sum, c) => sum + Number(c.amount),
                0
              )}
            </p>
          </div>

          <div className="fn-report">
            <h3>Total Expenses</h3>
            <p>
              ₹
              {Object.values(expenses)
                .flat()
                .reduce((sum, e) => sum + Number(e.amount), 0)}
            </p>
          </div>

          <div className="fn-report profit">
            <h3>Profit / Loss</h3>
            <p>
              ₹
              {collections.reduce((s, c) => s + Number(c.amount), 0) -
                Object.values(expenses)
                  .flat()
                  .reduce((s, e) => s + Number(e.amount), 0)}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}