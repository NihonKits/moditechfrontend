import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-container">
        <section className="header-left">
          <h1 className="header-title">ModiTech</h1>
          <p className="header-slogan">
            We offer Premium LED lights that gives you better ride during night
            life.
          </p>
        </section>
        <section className="header-right"></section>
      </div>
    </div>
  );
};

export default Header;
