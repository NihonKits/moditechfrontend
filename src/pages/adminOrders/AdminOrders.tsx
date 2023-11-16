import "./AdminOrders.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { OrderInterface } from "../../Types";
import axios from "axios";
import { useQuery } from "react-query";
import moment from "moment";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AdminOrders = () => {
  const { data } = useQuery<OrderInterface[]>({
    queryKey: ["AdminOrders"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/order/list`)
        .then((res) => res.data),
  });

  const handleChangeStatus = async (id: string, newValueStatus: string) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/api/order/updateStatus/${id}`,
        {
          status: newValueStatus,
        }
      );
      toast(`Successfully change status to ${newValueStatus}!`, {
        type: "success",
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
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
                Customer Email
              </TableCell>
              <TableCell className="table-header" align="center">
                Address
              </TableCell>
              <TableCell className="table-header" align="center">
                Contact number
              </TableCell>
              <TableCell className="table-header" align="center">
                Total Price
              </TableCell>
              <TableCell className="table-header" align="center">
                Status
              </TableCell>
              <TableCell className="table-header" align="center">
                Order Date
              </TableCell>

              <TableCell className="table-header" align="center">
                Action Button
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="product-tablebody">
            {data?.map((item) => (
              <TableRow key={item.id} className="admin-order-table-body-row">
                <TableCell className="table-header" align="center">
                  {item.email}
                </TableCell>
                <TableCell className="table-header" align="center">
                  {item.address}
                </TableCell>
                <TableCell className="table-header" align="center">
                  {item.contactNumber}
                </TableCell>
                <TableCell className="table-header" align="center">
                  ₱{item.totalPrice}
                </TableCell>
                <TableCell className="table-header" align="center">
                  <select
                    defaultValue={item.status}
                    onChange={(e) =>
                      handleChangeStatus(item.id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </TableCell>
                <TableCell className="table-header" align="center">
                  {moment(item.orderDate).format("YYYY-MM-DD")}
                </TableCell>
                <TableCell className="table-header" align="center">
                  <Link to={`/admin/orders/${item.id}`}>
                    <button
                      className="admin-order-btn"
                      style={{ backgroundColor: "green" }}
                    >
                      View Orders
                    </button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminOrders;
