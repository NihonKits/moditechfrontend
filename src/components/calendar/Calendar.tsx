import "./Calendar.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Dialog, DialogContent } from "@mui/material";
import { useState, useEffect } from "react";
// import designLine from "../../assets/design-line.png";
import { IAppointment, Transition } from "../../Types";
// import useAuthStore from "../../zustand/AuthStore";
import { useQuery } from "react-query";
import axios from "axios";
// import Login from "../login/Login";
import moment from "moment";
import CalendarModal from "./CalendarModal";

const Calendar = () => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data } = useQuery<IAppointment[]>("calendar", async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_BASE_URL}/api/reservation/list`
    );
    return response.data.map((appointment: any) => ({
      title: moment(appointment.appointmentTime, "HH:mm").format("hh:mm A"),
      date: appointment.appointmentDate,
      appointmentDate: appointment.appointmentDate,
    }));
  });

  const toggleModal = (date: any) => {
    setOpen(!open);
    setSelectedDate(date);
  };

  const maxAppointments = 3;
  const [isMaxedNumber, setIsMaxedNumber] = useState(false);

  console.log(isMaxedNumber);

  useEffect(() => {
    if (selectedDate && data) {
      const formattedDate = moment(selectedDate).format("yyyy-MM-DD");
      const appointmentsForSelectedDate = data.filter(
        (event) => event.appointmentDate === formattedDate
      );
      console.log(appointmentsForSelectedDate);
      setIsMaxedNumber(appointmentsForSelectedDate.length >= maxAppointments);
    } else {
      setIsMaxedNumber(false);
    }
  }, [selectedDate, data]);

  //
  const date = new Date();

  const validDate = {
    start: date.setDate(date.getDate() + 1),
  };

  return (
    <div className="calendar" id="calendar">
      <div className="calendar-container">
        <div className="calendar-title-container">
          {/* <img src={designLine} alt="" className="calendar-design-line" /> */}
          <h2 className="calendar-title">Book a reservation here..</h2>
          <p className="calendar-description">
            Click on your desired date for the reservation and submit your
            inquiry.
          </p>
          {/* <img src={designLine} alt="" className="calendar-design-line" /> */}
        </div>

        <div className="fullcalendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={(info) => toggleModal(info.date)}
            events={data}
            validRange={validDate}
          />
          <Dialog
            open={open}
            onClose={toggleModal}
            maxWidth="lg"
            TransitionComponent={Transition}
            keepMounted
          >
            <DialogContent>
              {/* <Login /> */}
              <CalendarModal
                isMaxedNumber={isMaxedNumber}
                selectedDate={selectedDate}
                toggleModal={toggleModal}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
