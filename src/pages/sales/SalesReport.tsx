import { useState, useMemo } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import moment from "moment";
import DatePicker from "react-datepicker";
import { OrderInterface } from "../../Types";
import { useQuery } from "react-query";

const SalesReport = () => {
  const { data } = useQuery<OrderInterface[]>({
    queryKey: ["OrderSalesReport"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/order/list`)
        .then((res) => res.data),
  });

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
  };

  const filteredData = useMemo(() => {
    return data?.filter((order: OrderInterface) => {
      const orderDate = moment(order.orderDate, "YYYY-MM-DD");

      if (startDate && endDate) {
        const startDateMoment = moment(startDate);
        const endDateMoment = moment(endDate);
        return orderDate.isBetween(startDateMoment, endDateMoment, "day", "[]");
      }

      return false;
    });
  }, [data, startDate, endDate]);

  const totalPrices = filteredData?.reduce(
    (total: number, order: OrderInterface) => {
      return total + parseFloat(order.totalPrice);
    },
    0
  );

  const handlePrint = () => {
    // Logic to print the filteredData
    const printWindow = window.open("", "_blank");
    printWindow?.document.write(
      "<html><head><title>Sales Report</title></head><body styles='display: flex; align-items: center; justify-content:center; flex-direction: column;'>"
    );

    printWindow?.document.write(
      `<div style='display: flex; align-items: center; justify-content: center; margin-bottom: 20px;'>
        <img src='https://res.cloudinary.com/alialcantara/image/upload/v1709767680/logo.png' alt='Company Logo' style='width: 100px; height: 100px;'/>
        <h1 style='margin-left: 20px; font-size: 50px'>Moditech</h1>
      </div>`
    );

    printWindow?.document.write("<h1>Sales Report</h1>");
    printWindow?.document.write("<table style='border-collapse: collapse;'>");
    printWindow?.document.write(
      "<thead><tr><th style='border: 1px solid black; padding: 8px;'>Transaction ID</th><th style='border: 1px solid black; padding: 8px;'>Order Date</th><th style='border: 1px solid black; padding: 8px;'>Email</th><th style='border: 1px solid black; padding: 8px;'>Products</th><th style='border: 1px solid black; padding: 8px;'>Total Price</th></tr></thead>"
    );

    printWindow?.document.write("<tbody>");
    filteredData?.forEach((item: OrderInterface) => {
      const products = JSON.parse(item.orderList); // Assuming 'products' is the key in your OrderInterface for the JSON string
      const productNames = products
        .map((product: any) => product.product.productName)
        .join(", ");

      printWindow?.document.write(
        `<tr><td style='border: 1px solid black; padding: 8px;'>${
          item.id
        }</td><td style='border: 1px solid black; padding: 8px;'>${moment(
          item.orderDate
        ).format(
          "MMMM DD YYYY"
        )}</td><td style='border: 1px solid black; padding: 8px;'>${
          item.email
        }</td><td style='border: 1px solid black; padding: 8px;'>${productNames}</td><td style='border: 1px solid black; padding: 8px;'>₱${
          item.totalPrice
        }.00</td></tr>`
      );
    });
    printWindow?.document.write("</tbody></table>");
    printWindow?.document.write(
      "<p style='text-align: right; margin-top: 20px;'>Total Income: ₱" +
        totalPrices +
        ".00</p>"
    );
    printWindow?.document.write("</body></html>");
    printWindow?.document.close();
    printWindow?.print();
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
      <section
        className="product"
        style={{ maxWidth: "1100px", width: "100%" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div>
            <span>Start Date: </span>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              dateFormat="yyyy-MM-dd"
              isClearable
            />
          </div>
          <div>
            <span>End Date: </span>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              dateFormat="yyyy-MM-dd"
              isClearable
            />
          </div>
          <label htmlFor="">
            Total Income:
            <span> ₱{totalPrices}.00</span>
          </label>
          <Button variant="contained" onClick={handlePrint}>
            Print
          </Button>
        </div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="assessment-header" align="center">
                  Transaction ID
                </TableCell>
                <TableCell className="assessment-header" align="center">
                  Order Date
                </TableCell>
                <TableCell className="assessment-header" align="center">
                  Email
                </TableCell>
                <TableCell className="assessment-header" align="center">
                  Products
                </TableCell>
                <TableCell className="assessment-header" align="center">
                  Total Price
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="assessment-tablebody">
              {filteredData?.map((item: OrderInterface) => {
                const products = JSON.parse(item.orderList); // Assuming 'products' is the key in your OrderInterface for the JSON string
                const productNames = products
                  .map((product: any) => product.product.productName)
                  .join(", ");
                return (
                  <TableRow key={item.id}>
                    <TableCell align="center">{item.id}</TableCell>
                    <TableCell align="center">
                      {moment(item.orderDate).format("MMMM DD YYYY")}
                    </TableCell>
                    <TableCell align="center">{item.email}</TableCell>
                    <TableCell align="center">{productNames}</TableCell>
                    <TableCell align="center">₱{item.totalPrice}.00</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </section>
    </div>
  );
};

export default SalesReport;
