import "./Registration.css";
import { RegistrationInterface } from "../../Types";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const Registration = ({ toggleRegistrationModal }: any) => {
  const [registrationInfo, setRegistrationInfo] =
    useState<RegistrationInterface>({
      fullname: "",
      email: "",
      password: "",
    });
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const onChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setRegistrationInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const sendEmail = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/email/sendEmail/${
          registrationInfo.email
        }`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/user/register`,
        registrationInfo
      );
      setLoading(false);
      sendEmail();
      toast.success("Please check your email to verify your registration!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        toggleRegistrationModal();
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response) {
          const responseStatus = axiosError.response.status;
          if (responseStatus === 409) {
            setError("Email already exist.");
            setLoading(false);
          } else {
            setError("An error occured.");
            setLoading(false);
          }
        }
      } else {
        setError((err as Error).message);
        setLoading(false);
      }
    }
  };

  return (
    <div className="registration-container">
      <h2>Registration</h2>
      <hr style={{ width: "100%", marginBottom: "16px" }} />
      <div className="input-container">
        <input
          type="text"
          placeholder="Full name"
          name="fullname"
          onChange={onChangeHandler}
        />
      </div>
      <div className="input-container">
        <input
          type="email"
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
      </div>
      {error && (
        <span
          style={{ color: "red", paddingTop: "5px", paddingBottom: "10px" }}
        >
          {error}
        </span>
      )}
      <div className="register-btns">
        <button
          className="register-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Please wait..." : "Register"}
        </button>
        <button
          className="register-button "
          style={{ backgroundColor: "red" }}
          onClick={toggleRegistrationModal}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Registration;
