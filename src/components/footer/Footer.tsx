import "./Footer.css";

import { Facebook } from "@mui/icons-material";
import logo from "../../assets/logo.png";
import tiktok from "../../assets/tik-tok.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <img src={logo} alt="logo" className="footer-logo" />
          <p>&copy; 2023 ModiTech</p>
        </div>
        <div className="footer-right">
          <p>
            Corner, 275 3rd St, East Grace Park, Caloocan, 1403 Metro Manila,
            Caloocan, Philippines
          </p>
          <p>Contact Number: 09914605757</p>
          <div className="footer-social-container">
            <a
              href="https://www.tiktok.com/@moditechhub?_t=8iC1pXNwKvg&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "white",
                textDecoration: "none",
                height: "20px",
                width: "20px",
                padding: "5px",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={tiktok} alt="" style={{ width: "20px" }} />
            </a>
            <a
              href="https://www.facebook.com/ModiTechHUB?mibextid=ZbWKwL"
              target="_blank"
              style={{
                backgroundColor: "white",
                color: "black",
                textDecoration: "none",
                height: "20px",
                width: "20px",
                padding: "5px",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              rel="noopener noreferrer"
            >
              <Facebook />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
