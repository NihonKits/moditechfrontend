import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-container">
        <section className="header-left">
          <h1 className="header-title">ModiTech</h1>
          <p className="header-slogan">Where the Road Ends, Adventure Begins</p>
          <Link to="/client/shop">
            <button className="header-btn">Shop Now</button>
          </Link>
        </section>
        <section className="header-right"></section>
      </div>
    </div>
  );
};

export default Header;
