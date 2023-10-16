import "./AdminDashboard.css";
import { ArrowDropUp } from "@mui/icons-material";
import { useQuery } from "react-query";
import axios from "axios";
import BarChart from "../../components/adminBarChart/AdminBarChart";

const AdminDashboard = () => {
  const { data } = useQuery({
    queryKey: ["AdminDashboard"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/order/total-price`)
        .then((res) => res.data),
  });

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <BarChart />
        <div className="total-sales-container">
          <h1>TOTAL SALES</h1>
          <div className="total-sales">
            <ArrowDropUp sx={{ fontSize: "80px" }} />
            <b style={{ fontSize: "80px" }}>{data}</b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
