import { Bar } from "react-chartjs-2";

const Charts = ({ assignments }) => {
  const data = {
    labels: assignments.map(a => a.assignment_name),
    datasets: [
      {
        label: "Completion %",
        data: assignments.map(a => a.completion_percentage),
      }
    ]
  };

  return <Bar data={data} />;
};

export default Charts;