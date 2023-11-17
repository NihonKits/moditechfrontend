import "./Navbar.css";
import { LocalMall } from "@mui/icons-material";
import logo from "../../assets/logo.png";
import { Drawer } from "antd";
import Checkout from "../checkout/Checkout";
import { useEffect, useState } from "react";
import { Badge, Dialog, DialogContent } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../zustand/CartStore";
import Login from "../login/Login";
import { Transition, UserInterface } from "../../Types";
import useAuthStore from "../../zustand/AuthStore";
import axios from "axios";

const Navbar = () => {
  const [userData, setUserData] = useState<UserInterface>();
  const [open, setOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [showManagementDropdown, setShowManagementDropdown] =
    useState<boolean>(false);

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
        <img src={logo} alt="moditect logo" className="nav-logo" />
        <section className="nav-link-container">
          <span className="nav-link" onClick={handleHome}>
            HOME
          </span>
          <span className="nav-link">ABOUT</span>
          <Link
            to="/client/shop"
            style={{ textDecoration: "none", color: "black" }}
          >
            <span className="nav-link">SHOP</span>
          </Link>
          {userData?.userRole === "ROLE_USER" && (
            <Link
              to="/client/reservations"
              style={{ textDecoration: "none", color: "black" }}
            >
              <span className="nav-link">SERVICE RESERVATION</span>
            </Link>
          )}
          {userData?.userRole === "ROLE_ADMIN" && (
            <div className="nav-dropdown" onClick={toggleManagementDropdown}>
              <span className="nav-link">MANAGEMENT</span>
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
                    style={{ textDecoration: "none", color: "black" }}
                    to="/admin/dashboard"
                  >
                    <span>DASHBOARD</span>
                  </Link>
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to="/admin/products"
                  >
                    <span>PRODUCT MANAGEMENT</span>
                  </Link>

                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to="/admin/orders"
                  >
                    <span>ORDER MANAGEMENT</span>
                  </Link>
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to="/admin/chat-support"
                  >
                    <span>CHAT SUPPORT MANAGEMENT</span>
                  </Link>
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to="/admin/reservations"
                  >
                    <span>RESERVATION MANAGEMENT</span>
                  </Link>
                </div>
              )}
            </div>
          )}
          {userData?.userRole === "ROLE_USER" && (
            <Link
              style={{ textDecoration: "none", color: "black" }}
              to="/client/orders"
            >
              <span className="nav-link">ORDERS</span>
            </Link>
          )}
        </section>
        <section className="nav-action-container">
          {user ? (
            <div className="navbar-user-logout-container">
              <span>{user}</span>
              <button onClick={clearUser}>Logout</button>
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
            <LocalMall sx={{ color: "black" }} />
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
