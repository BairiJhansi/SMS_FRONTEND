import React, { useEffect, useState } from "react";
import axios from "axios";

const FeeDashboard = () => {
    const [studentId, setStudentId] = useState(null);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payAmount, setPayAmount] = useState({});
  const [activeFeeId, setActiveFeeId] = useState(null);
  const [history, setHistory] = useState({});
  const [allHistory, setAllHistory] = useState([]);
  const [tab, setTab] = useState("fees");

  useEffect(() => {
    const loadStudent = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
        `http://localhost:5002/api/student/user/${user.user_id}`
      );

      setStudentId(res.data.student_id);
    };

    loadStudent();
  }, []);

  // ✅ fetch payment history per fee
  const fetchHistory = async (feeId) => {
    try {
      const res = await axios.get(
        `http://localhost:5002/api/payments/history/${feeId}`
      );

      setHistory((prev) => ({
        ...prev,
        [feeId]: res.data,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ fetch ALL payments
  const fetchAllHistory = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5002/api/payments/student/${studentId}`
      );
      setAllHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ fetch fees
  const fetchFees = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5002/api/fees/${studentId}`
      );
      // 🔥 SORT LOGIC
        const sorted = res.data.sort((a, b) => {
        // pending & partial first
        const statusOrder = { pending: 0, partial: 1, paid: 2 };

        if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
        }

        // then by due date ascending
        const dateA = a.due_date ? new Date(a.due_date) : new Date(8640000000000000);
        const dateB = b.due_date ? new Date(b.due_date) : new Date(8640000000000000);

        // 4. ascending
        return dateA - dateB;
        });

        setFees(sorted);

        sorted.forEach((f) => fetchHistory(f.fee_id));
    } catch (err) {
        console.error(err);
    }
    };

  useEffect(() => {
    if (!studentId) return;
    console.log("Loading fees for student:", studentId);
    fetchFees();
    fetchAllHistory();
  }, [studentId]);

  // ✅ payment handler
  const handlePayment = async (fee) => {
    setLoading(true);

    const amount = payAmount[fee.fee_id] || fee.due;

    if (amount <= 0 || amount > fee.due) {
      alert("Invalid amount");
      setLoading(false);
      return;
    }

    try {
      const { data: order } = await axios.post(
        "http://localhost:5002/api/payments/create-order",
        { amount }
      );

      const options = {
        key: "rzp_test_SYibcqwMjyvNLL",
        amount: order.amount,
        currency: "INR",
        order_id: order.id,

        name: "ERP Fee Payment",
        description: fee.fee_type,

        handler: async function (response) {
          try {
            await axios.post(
              "http://localhost:5002/api/payments/verify",
              {
              ...response,
              fee_id: fee.fee_id,
              amount: amount,
              student_id: studentId   // ✅ ADD THIS LINE
            }
            );

            alert("Payment Successful ✅");

            fetchFees();
            fetchAllHistory();
            setActiveFeeId(null);

          } catch (err) {
            alert("Verification failed ❌");
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Fee Dashboard</h2>

      {/* 🔥 Tabs */}
      <div style={{ marginBottom: 20 }}>
        <button
          style={tab === "fees" ? styles.tabActive : styles.tab}
          onClick={() => setTab("fees")}
        >
          Fees
        </button>

        <button
          style={tab === "history" ? styles.tabActive : styles.tab}
          onClick={() => setTab("history")}
        >
          Payment History
        </button>
      </div>

      {/* ================= FEES TAB ================= */}
      {tab === "fees" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "20px",
          }}
        >
          {fees.map((fee) => (
            <div
              key={fee.fee_id}
              style={styles.card}
            >
              <div style={styles.headerRow}>
                <h3 style={styles.feeTitle}>{fee.fee_type}</h3>

                <span
                    style={{
                        ...styles.dueDate,
                        background:
                        new Date(fee.due_date) < new Date() ? "#ffe5e5" : "#fff3cd",
                        color:
                        new Date(fee.due_date) < new Date() ? "#d32f2f" : "#856404",
                    }}
                    >
                    Due: {new Date(fee.due_date).toLocaleDateString()}
                    </span>
                </div>

              <div style={styles.row}>
                <span>Total:</span>
                <span>₹{fee.assigned_amount}</span>
              </div>

              <div style={styles.row}>
                <span>Paid:</span>
                <span style={{ color: "green" }}>₹{fee.paid}</span>
              </div>

              <div style={styles.row}>
                <span>Due:</span>
                <span style={{ color: "red" }}>₹{fee.due}</span>
              </div>

              <div style={styles.row}>
                <span>Status:</span>
                <span style={styles.status(fee.status)}>
                  {fee.status}
                </span>
              </div>

              {/* Payment Section */}
              {activeFeeId === fee.fee_id ? (
                <div style={{ marginTop: 15 }}>
                  <input
                    type="number"
                    value={payAmount[fee.fee_id] || fee.due}
                    onChange={(e) =>
                      setPayAmount({
                        ...payAmount,
                        [fee.fee_id]: Number(e.target.value),
                      })
                    }
                    style={styles.input}
                  />

                  <div style={styles.buttonRow}>
                    <button
                      style={styles.payBtn}
                      onClick={() => handlePayment(fee)}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Confirm"}
                    </button>

                    <button
                      style={styles.cancelBtn}
                      onClick={() => setActiveFeeId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                fee.due > 0 && (
                  <button
                    style={styles.mainBtn}
                    onClick={() => setActiveFeeId(fee.fee_id)}
                  >
                    Pay Now
                  </button>
                )
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= HISTORY TAB ================= */}
      {tab === "history" && (
        <div style={{ marginTop: 20 }}>
            {allHistory.length === 0 ? (
            <p>No payments yet</p>
            ) : (
            <table style={styles.table}>
                <thead>
                    <tr>
                    <th style={styles.th}>Fee Type</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Transaction ID</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Invoice</th>
                    </tr>
                </thead>

                <tbody>
                    {allHistory.map((p, index) => (
                    <tr
                        key={p.payment_id}
                        style={
                        index % 2 === 0
                            ? styles.rowEven
                            : styles.rowOdd
                        }
                    >
                        <td style={styles.td}>{p.fee_type}</td>

                        <td style={styles.td}>
                        ₹{Number(p.amount_paid).toFixed(2)}
                        </td>

                        <td style={styles.td}>
                        {p.transaction_id || "-"}
                        </td>

                        <td style={styles.td}>
                        {new Date(p.paid_at).toLocaleString()}
                        </td>

                        <td style={styles.td}>
                        <button
                            style={styles.invoiceBtn}
                            onClick={() =>
                            window.open(
                                `http://localhost:5002/api/payments/invoice/${p.payment_id}`,
                                "_blank"
                            )
                            }
                        >
                            Invoice
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
        </div>
        )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "100%",
    margin: "auto",
    fontFamily: "Arial",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "15px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    background: "#fff"
  },
  tab: {
    padding: "8px 15px",
    marginRight: 10,
    border: "1px solid #ccc",
    background: "#eee",
    cursor: "pointer",
  },
  tabActive: {
    padding: "8px 15px",
    marginRight: 10,
    border: "1px solid #007bff",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  feeTitle: {
    marginBottom: "10px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    margin: "5px 0",
  },
  status: (status) => ({
    color:
      status === "paid"
        ? "green"
        : status === "partial"
        ? "orange"
        : "red",
    fontWeight: "bold",
  }),
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
  },
  buttonRow: {
    display: "flex",
    gap: "10px"
  },
  mainBtn: {
    marginTop: "10px",
    padding: "8px 12px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
  payBtn: {
    flex: 1,
    padding: "8px",
    background: "green",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
  cancelBtn: {
    flex: 1,
    padding: "8px",
    background: "gray",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
  invoiceBtn: {
    marginTop: 10,
    padding: "6px 10px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: 5,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: "8px",
    overflow: "hidden",
    },

    th: {
    background: "#343a40",
    color: "white",
    padding: "12px",
    textAlign: "left",
    fontWeight: "600",
    },

    td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    },

    rowEven: {
    background: "#ffffff",
    },

    rowOdd: {
    background: "#f8f9fa",
    },
    headerRow: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px"
},

dueDate: {
  background: "#fff3cd",
  color: "#856404",
  padding: "3px 8px",
  borderRadius: "5px",
  fontSize: "12px",
  fontWeight: "bold"
}
};

export default FeeDashboard;