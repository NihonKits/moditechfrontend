import "./Navbar.css";
import { LocalMall, Person } from "@mui/icons-material";
import logo from "../../assets/logo.png";
import { Drawer } from "antd";
import Checkout from "../checkout/Checkout";
import { useEffect, useState } from "react";
import { Badge, Dialog, DialogContent } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../zustand/CartStore";
import Login from "../login/Login";
import { OrderInterface, Transition, UserInterface } from "../../Types";
import useAuthStore from "../../zustand/AuthStore";
import axios from "axios";
import { useQuery } from "react-query";
import { Tooltip } from "react-tooltip";

const Navbar = () => {
  const [userData, setUserData] = useState<UserInterface>();
  const [open, setOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [showManagementDropdown, setShowManagementDropdown] =
    useState<boolean>(false);

  const { data: orderList } = useQuery<OrderInterface[]>({
    queryKey: ["navbar"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/order/list`)
        .then((res) => res.data),
  });

  const pendingOrders = orderList?.filter(
    (order) => order.status === "Pending"
  );

  const cart = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/api/user/${user}`
      );
      setUserData(res.data);
    };
    fetch();
  }, []);

  const navigate = useNavigate();

  const showDrawer = () => {
    setOpen(true);
  };

  const onCloseDrawer = () => {
    setOpen(false);
  };

  const toggleManagementDropdown = () => {
    setShowManagementDropdown(!showManagementDropdown);
  };

  const handleHome = () => {
    navigate("/");
  };

  const toggleLoginModal = () => {
    setIsLoginOpen(!isLoginOpen);
  };

  return (
    <div className="nav">
      <div className="nav-container">
        {/* <h2 style={{ color: "#F5FFFF" }}>ModiTech</h2> */}
        <img
          src={logo}
          alt="moditect logo"
          className="nav-logo"
          onClick={handleHome}
        />
        <section className="nav-link-container">
          <span className="nav-link-span" onClick={handleHome}>
            HOME
          </span>
          <span className="nav-link-span">ABOUT</span>
          <Link
            to="/client/shop"
            style={{ textDecoration: "none", color: "#f5ffff" }}
          >
            <span className="nav-link-span">SHOP</span>
          </Link>
          {userData?.userRole === "ROLE_USER" && (
            <Link
              to="/client/reservations"
              style={{ textDecoration: "none", color: "#f5ffff" }}
            >
              <span className="nav-link-span">SERVICE RESERVATION</span>
            </Link>
          )}
          {userData?.userRole === "ROLE_ADMIN" && (
            <>
              <div className="nav-dropdown" onClick={toggleManagementDropdown}>
                <span className="nav-link-span">MANAGEMENT</span>
                {showManagementDropdown && (
                  <div
                    className="dropdown-content"
                    style={
                      showManagementDropdown
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    <Link
                      style={{ textDecoration: "none", color: "#f5ffff" }}
                      to="/admin/dashboard"
                    >
                      <span>DASHBOARD</span>
                    </Link>
                    <Link
                      style={{ textDecoration: "none", color: "#f5ffff" }}
                      to="/admin/products"
                    >
                      <span>PRODUCT MANAGEMENT</span>
                    </Link>

                    <Link
                      style={{ textDecoration: "none", color: "#f5ffff" }}
                      to="/admin/chat-support"
                    >
                      <span>CHAT SUPPORT MANAGEMENT</span>
                    </Link>
                    <Link
                      style={{ textDecoration: "none", color: "#f5ffff" }}
                      to="/admin/reservations"
                    >
                      <span>RESERVATION MANAGEMENT</span>
                    </Link>
                  </div>
                )}
              </div>

              <Link
                style={{ textDecoration: "none", color: "#f5ffff" }}
                to="/admin/orders"
              >
                <Badge badgeContent={pendingOrders?.length} color="primary">
                  <span>CLIENT ORDERS</span>
                </Badge>
              </Link>
            </>
          )}
          {userData?.userRole === "ROLE_USER" && (
            <Link
              style={{ textDecoration: "none", color: "#f5ffff" }}
              to="/client/orders"
            >
              <span className="nav-link-span">ORDERS</span>
            </Link>
          )}
        </section>
        <section className="nav-action-container">
          {user ? (
            <div className="navbar-user-logout-container">
              <Person
                sx={{ color: "#f5ffff", fontSize: "33px" }}
                id="clickable"
              />
              <Tooltip
                anchorSelect="#clickable"
                clickable
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <span style={{ color: "#f5ffff" }}>{user}</span>
                <button onClick={clearUser}>Logout</button>
              </Tooltip>
            </div>
          ) : (
            <button className="nav-btn" onClick={toggleLoginModal}>
              LOGIN
            </button>
          )}
          <Badge
            badgeContent={cart.length}
            sx={{ cursor: "pointer" }}
            color="primary"
            onClick={showDrawer}
          >
            <LocalMall sx={{ color: "#f5ffff", fontSize: "30px" }} />
          </Badge>
        </section>
      </div>
      <Dialog
        open={isLoginOpen}
        onClose={toggleLoginModal}
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogContent>
          <Login />
        </DialogContent>
      </Dialog>
      <Drawer placement="right" onClose={onCloseDrawer} open={open}>
        <Checkout />
      </Drawer>
    </div>
  );
};

export default Navbar;
