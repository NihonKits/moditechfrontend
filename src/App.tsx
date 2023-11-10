import "./App.css";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import ClientHome from "./pages/clientHome/ClientHome";
import AdminProducts from "./pages/adminProducts/AdminProducts";
import Navbar from "./components/navbar/Navbar";
import AdminOrders from "./pages/adminOrders/AdminOrders";
import AdminViewOrders from "./components/adminViewProduct/AdminViewOrders";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import ClientOrders from "./pages/clientOrders/ClientOrders";
import FloatingChatWidget from "./components/chat/FloatingChatWidget";
import AdminSupport from "./pages/adminSupport/AdminSupport";

function App() {
  return (
    <>
      <Navbar />
      <FloatingChatWidget />
      <Routes>
        <Route path="/" element={<ClientHome />} />
        <Route path="/client/orders" element={<ClientOrders />} />
        {/* admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/:id" element={<AdminViewOrders />} />
        <Route path="/admin/chat-support" element={<AdminSupport />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
