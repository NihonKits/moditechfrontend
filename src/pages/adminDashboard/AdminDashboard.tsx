import "./AdminDashboard.css";
import { ArrowDropUp } from "@mui/icons-material";
import { useQuery } from "react-query";
import axios from "axios";
import BarChart from "../../components/adminBarChart/AdminBarChart";
import AdminBestProducts from "../../components/adminBestProducts/AdminBestProducts";
import AdminZeroSoldProducts from "../../components/adminBestProducts/AdminZeroSoldProducts";

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
      <div className="dashboard-container">
        <AdminBestProducts />
      </div>
      <div className="dashboard-container">
        <AdminZeroSoldProducts />
      </div>
    </div>
  );
};

export default AdminDashboard;
