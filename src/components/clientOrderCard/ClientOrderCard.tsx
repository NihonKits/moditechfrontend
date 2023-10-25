import { useEffect, useState } from "react";
import "./ClientOrderCard.css";
import { OrderInterface, ProductInterface } from "../../Types";
import UploadReceipt from "../clientUploadReceipt/UploadReceipt";
import moment from "moment";
import { Dialog, DialogContent } from "@mui/material";

interface IOrderData {
  orderData: OrderInterface;
}

const ClientOrderCard = ({ orderData }: IOrderData) => {
  const [orderListJson, setOrderListJson] = useState<ProductInterface[]>();
  const [openUploadReceipt, setOpenUploadReceipt] = useState<boolean>(false);

  useEffect(() => {
    setOrderListJson(JSON.parse(orderData.orderList));
  }, [orderData]);

  const toggleOpenUploadReceipt = () => {
    setOpenUploadReceipt(!openUploadReceipt);
  };

  return (
    <div style={{ border: "2px solid green" }}>
      <div
        style={{
          padding: "10px 0",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        <span>Status: {orderData.status}</span>
        <span>
          Order Date: {moment(orderData.orderDate).format("MM/DD/YYYY hh:mma")}
        </span>
      </div>
      <hr style={{ borderBottom: "2px solid gray" }} />
      <section className="ordercard">
        {orderListJson?.map((orderItem) => (
          <div className="ordercard-container" key={orderItem.id}>
            <img
              className="orderlist-image"
              src={orderItem.productImage}
              alt=""
            />
            <div className="ordercard-info-container">
              <span>{orderItem.productName}</span>
              <span style={{ color: "gray" }}>{orderItem.description}</span>
              <span>₱{orderItem.price}.00</span>
              <span>Qty: {orderItem.quantity}</span>
            </div>
          </div>
        ))}
      </section>
      <div
        style={{
          padding: "10px 0",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <span>Total price: ₱{orderData.totalPrice}.00</span>

        <button
          className="ordercard-uploadbtn"
          onClick={toggleOpenUploadReceipt}
        >
          Upload Receipt
        </button>
      </div>
      <Dialog open={openUploadReceipt} onClose={toggleOpenUploadReceipt}>
        <DialogContent>
          <UploadReceipt
            orderData={orderData}
            toggleOpenUploadReceipt={toggleOpenUploadReceipt}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientOrderCard;
