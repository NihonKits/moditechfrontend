import "./AdminViewOrders.css";
import axios from "axios";
import { useQuery } from "react-query";
import { OrderInterface, SingleOrderItemInterface } from "../../Types";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AdminViewOrders = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[3];

  console.log("eto ung id", id);

  const [singleOrderItemList, setSingleOrderItemList] =
    useState<SingleOrderItemInterface[]>();

  const { data } = useQuery<OrderInterface>({
    queryKey: ["AdminViewOrders"],
    queryFn: async () =>
      await axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/order/list/${id}`)
        .then((res) => res.data),
  });

  useEffect(() => {
    setSingleOrderItemList(eval(data?.orderList || ""));
  }, [data]);

  return (
    <div className="admin-view-order">
      <div className="admin-view-order-container">
        <div style={{ padding: "10px 20px", fontSize: "20px" }}>
          <span>{data?.status}</span>
        </div>
        <hr style={{ borderBottom: "2px solid gray" }} />
        <section className="ordercard">
          {singleOrderItemList?.map((orderItem) => (
            <div className="ordercard-container" key={orderItem.id}>
              <img
                className="orderlist-image"
                src={orderItem.productImage}
                alt=""
              />
              <div className="ordercard-info-container">
                <span>Product Name: {orderItem.productName}</span>
                <span style={{ color: "gray" }}>
                  Product Description: {orderItem.description}
                </span>
                <span>Product Price: ₱{orderItem.price}.00</span>
                <span>Quantity Ordered: {orderItem.quantity}</span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default AdminViewOrders;
