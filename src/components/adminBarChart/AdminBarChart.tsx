import {
  Chart as ChartJs,
  BarElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { ITopFiveCustomerInterface } from "../../Types";

ChartJs.register(CategoryScale, LinearScale, BarElement, Legend, Tooltip);

const BarChart = () => {
  const [chartData, setChartData] = useState<ITopFiveCustomerInterface[]>([]);

  const { data } = useQuery<ITopFiveCustomerInterface[]>({
    queryKey: ["barChart"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/order/top5`)
        .then((res) => res.data),
  });

  console.log(chartData);

  useEffect(() => {
    setChartData(data || []);
  }, [data]);

  const graph = {
    labels: chartData?.map((item) => item.email),
    datasets: [
      {
        label: "Customer Email",
        data: chartData?.map((item) => item.orderCount),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
  };

  return (
    <div
      style={{
        width: "50%",
        height: "300px",
        padding: "20px",
        border: "3px solid gray",
      }}
    >
      <Bar data={graph} options={barOptions} />
    </div>
  );
};

export default BarChart;
