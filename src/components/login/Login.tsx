import "./Login.css";
import { LoginInterface, Transition } from "../../Types";
import { useState } from "react";
import axios from "axios";
import Registration from "../registration/Registration";
import useAuthStore from "../../zustand/AuthStore";
import { Dialog, DialogContent } from "@mui/material";

// interface Props{
//   toggleLoginModal: () => void
// }
// {toggleLoginModal}: Props
const Login = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const [credentials, setCredentials] = useState<LoginInterface>({
    email: "",
    password: "",
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleLogin = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/user/login`,
        credentials
      );
      setLoading(false);
      setUser(credentials.email);
      setTimeout(() => {
        window.location.reload();
      }, 0);
    } catch (err) {
      setLoading(false);
      console.log(err);
      setErrors("Incorrect email or password.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <hr />
      <p>Welcome to Moditech Motor Shop and Services</p>
      <div className="input-container">
        <input
          type="text"
          placeholder="Email"
          name="email"
          onChange={onChangeHandler}
        />
      </div>
      <div className="input-container">
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={onChangeHandler}
        />
        {errors && (
          <div style={{ padding: "5px 0" }}>
            <span style={{ color: "red" }}>{errors}</span>
          </div>
        )}
        <button className="login-btn" onClick={handleLogin}>
          {loading ? "Please wait..." : "Login"}
        </button>

        <p className="or-text">
          No account? Register{" "}
          <a onClick={toggleIsOpen}>
            <u style={{ cursor: "pointer" }}>here</u>
          </a>
        </p>
      </div>
      <Dialog
        open={isOpen}
        onClose={toggleIsOpen}
        maxWidth="sm"
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogContent>
          <Registration toggleRegistrationModal={toggleIsOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
