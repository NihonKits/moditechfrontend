import moment from "moment";
// import React from "react";
import TimePicker from "react-time-picker";
import { useState } from "react";
import axios from "axios";
import useAuthStore from "../../zustand/AuthStore";
import { toast } from "react-toastify";

interface Prop {
  isMaxedNumber: boolean;
  toggleModal: (date: any) => void;
  selectedDate: Date | null;
}

const CalendarModal = ({ isMaxedNumber, selectedDate, toggleModal }: Prop) => {
  const user = useAuthStore((state) => state.user);

  const [message, setMessage] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string | null>(
    new Date().toLocaleTimeString()
  );

  const handleTimeChange = (time: string | null) => {
    if (time) {
      setSelectedTime(time);
    }
  };

  const handleSubmit = async () => {
    if (message === "") {
      alert("Please put message before submitting.");
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/reservation/create`,
        {
          appointmentDate: moment(selectedDate).format("yyyy-MM-DD"),
          appointmentTime: selectedTime,
          inquiryMessage: message,
          email: user,
          service: service,
        }
      );
      toast("Successful reservation", {
        type: "success",
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="modal-container">
      {isMaxedNumber ? (
        <h2>This date has reached the maximum number of reservations.</h2>
      ) : (
        <>
          <h2>Date: {moment(selectedDate).format("yyyy-MM-DD")}</h2>
          <label style={{ width: "100%" }}>
            Time of Appointment: {""}
            <TimePicker
              onChange={handleTimeChange}
              value={selectedTime}
              className="time-picker"
            />
          </label>
          <label
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            What service do you need ?
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              style={{
                width: "100%",
                height: "30px",
                paddingLeft: "5px",
                paddingRight: "5px",
              }}
            >
              <option value="Change Oil">Change Oil</option>
              <option value="CVT Cleaning">CVT Cleaning</option>
              <option value="Remapping and Dyno">Remapping and Dyno</option>
              <option value="Wirings">Wirings</option>
              <option value="MDL Installation">MDL Installation</option>
              <option value="Motorcycle Maintenance">
                Motorcycle Maintenance
              </option>
              <option value="Fairings Installation">
                Fairings Installation
              </option>
              <option value="Horn Installation">Horn Installation</option>
            </select>
          </label>
          <label style={{ width: "100%" }}>
            Additional instruction:
            <textarea
              name=""
              id=""
              cols={30}
              rows={10}
              onChange={(e) => setMessage(e.target.value)}
              className="text-area"
            ></textarea>
          </label>
          <div className="calendar-btns">
            <button className="calendar-btn submit" onClick={handleSubmit}>
              Submit Appointment
            </button>
            <button className="calendar-btn cancel" onClick={toggleModal}>
              Cancel Appointment
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarModal;
