import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useQuery } from "react-query";
import { IAppointment } from "../../Types";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";

const AdminReservationList = () => {
  const { data } = useQuery<IAppointment[]>({
    queryKey: ["AdminReservationList"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/reservation/list`)
        .then((res) => res.data),
  });

  const onChangeHandleStatus = async (id: string, status: string) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/api/reservation/update/${id}`,
        {
          status: status,
        }
      );
      toast.success(`Successfully change the status`, {
        position: "bottom-right",
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
    <div
      style={{
        marginTop: "20px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <TableContainer
        className="product"
        style={{ maxWidth: "1100px", width: "100%" }}
      >
        <Table className="admin-order-table">
          <TableHead className="admin-order-table-header">
            <TableRow className="admin-order-header-table-row">
              <TableCell className="table-header" align="center">
                Email
              </TableCell>
              <TableCell className="table-header" align="center">
                Appointment Date
              </TableCell>
              <TableCell className="table-header" align="center">
                Appointment Time
              </TableCell>
              <TableCell className="table-header" align="center">
                Service
              </TableCell>
              <TableCell className="table-header" align="center">
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="product-tablebody">
            {data?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="table-header" align="center">
                  {item.email}
                </TableCell>
                <TableCell className="table-header" align="center">
                  {item.appointmentDate}
                </TableCell>

                <TableCell className="table-header" align="center">
                  {moment(item.appointmentTime, "HH:mm").format("hh:mm A")}
                </TableCell>
                <TableCell className="table-header" align="center">
                  {item.service}
                </TableCell>
                <TableCell className="table-header" align="center">
                  <div>
                    <select
                      style={{
                        padding: "10px",

                        color: "black",
                      }}
                      className={item.status}
                      defaultValue={item.status}
                      onChange={(e) =>
                        onChangeHandleStatus(item.id, e.target.value)
                      }
                    >
                      <option
                        style={{
                          fontSize: "16px",
                          backgroundColor: "#FFBF00",
                          color: "white",
                        }}
                        value="Pending"
                      >
                        Pending
                      </option>
                      <option
                        style={{
                          fontSize: "16px",
                          backgroundColor: "#039487",
                          color: "white",
                        }}
                        value="Approved"
                      >
                        {item.status === "Approved" ? "Approved" : "Approve"}
                      </option>
                      <option
                        style={{
                          fontSize: "16px",
                          backgroundColor: "#ff0000",
                          color: "white",
                        }}
                        value="Rejected"
                      >
                        {item.status === "Rejected" ? "Rejected" : "Reject"}
                      </option>
                    </select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminReservationList;
