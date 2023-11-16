import "./AdminViewOrders.css";
import axios from "axios";
import { useQuery } from "react-query";
import { OrderInterface, OrderProductInterface } from "../../Types";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AdminViewOrders = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[3];

  console.log("eto ung id", id);

  const [singleOrderItemList, setSingleOrderItemList] =
    useState<OrderProductInterface[]>();

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

  console.log(singleOrderItemList);

  return (
    <div className="admin-view-order">
      <div className="admin-view-order-container">
        <div style={{ padding: "10px 20px", fontSize: "20px" }}>
          <span>{data?.status}</span>
        </div>
        <hr
          style={{
            borderBottom: "2px solid gray",
            maxWidth: "1100px",
            width: "100%",
          }}
        />
        <section className="ordercard">
          {singleOrderItemList?.map((orderItem, key) => (
            <div className="admin-view-order" key={key}>
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
                <span>Product Name: {orderItem.product.productName}</span>
                <span>
                  Variant:{" "}
                  {
                    orderItem?.product.productVariationsList[
                      orderItem.variationIndex
                    ]?.variationName
                  }
                </span>
                <span style={{ color: "gray" }}>
                  Product Description:{" "}
                  {
                    orderItem?.product.productVariationsList[
                      orderItem.variationIndex
                    ]?.description
                  }
                </span>
                <span>
                  Product Price: ₱
                  {
                    orderItem?.product.productVariationsList[
                      orderItem.variationIndex
                    ]?.price
                  }
                  .00
                </span>
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
