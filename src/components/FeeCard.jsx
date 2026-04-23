const FeeCard = ({ fee, onPay }) => {
  return (
    <div>
      <p>Total: {fee.assigned_amount}</p>
      <p>Paid: {fee.paid}</p>
      <p>Due: {fee.due}</p>

      {fee.status !== "paid" && (
        <button onClick={() => onPay(fee)}>Pay</button>
      )}
    </div>
  );
};