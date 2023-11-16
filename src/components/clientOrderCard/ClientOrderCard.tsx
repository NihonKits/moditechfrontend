import { useEffect, useState } from "react";
import "./ClientOrderCard.css";
import { OrderInterface, OrderProductInterface } from "../../Types";
import UploadReceipt from "../clientUploadReceipt/UploadReceipt";
import moment from "moment";
import { Dialog, DialogContent } from "@mui/material";

interface IOrderData {
  orderData: OrderInterface;
}

const ClientOrderCard = ({ orderData }: IOrderData) => {
  const [orderListJson, setOrderListJson] = useState<OrderProductInterface[]>();
  const [openUploadReceipt, setOpenUploadReceipt] = useState<boolean>(false);

  useEffect(() => {
    setOrderListJson(JSON.parse(orderData.orderList));
  }, [orderData]);

  const toggleOpenUploadReceipt = () => {
    setOpenUploadReceipt(!openUploadReceipt);
  };

  console.log(orderListJson);

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
        {orderListJson?.map((orderItem, index) => (
          <div className="ordercard-container" key={index}>
            <span>{orderItem.product.productName}</span>
            <img
              className="orderlist-image"
              src={
                orderItem?.product.productVariationsList[
                  orderItem.variationIndex
                ]?.imgUrl
              }
              alt=""
            />
            <div className="ordercard-info-container">
              <span style={{ color: "gray" }}>
                {
                  orderItem?.product.productVariationsList[
                    orderItem.variationIndex
                  ]?.description
                }
              </span>
              <span>
                ₱
                {
                  orderItem?.product.productVariationsList[
                    orderItem.variationIndex
                  ]?.price
                }
                .00
              </span>
              <span>
                Qty:
                {orderItem?.quantity}
              </span>
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
