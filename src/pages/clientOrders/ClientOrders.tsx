import "./ClientOrders.css";
import ClientOrderCard from "../../components/clientOrderCard/ClientOrderCard";
import { useQuery } from "react-query";
import { OrderInterface } from "../../Types";
import axios from "axios";
import useAuthStore from "../../zustand/AuthStore";
import { useState } from "react";
import moment from "moment";

const ClientOrders = () => {
  const [openAll, setOpenAll] = useState<boolean>(true);
  const [openDelivered, setOpenDelivered] = useState<boolean>(false);
  const [openPending, setOpenPending] = useState<boolean>(false);
  const [openCancelled, setOpenCancelled] = useState<boolean>(false);

  const user = useAuthStore((state) => state.user);

  const { data } = useQuery<OrderInterface[]>({
    queryKey: ["findOrderByUserMail"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/order/userEmail/${user}`)
        .then((res) => res.data),
  });

  const toggleOpenAll = () => {
    setOpenAll(true);
    setOpenDelivered(false);
    setOpenPending(false);
    setOpenCancelled(false);
  };

  const toggleOpenDelivered = () => {
    setOpenAll(false);
    setOpenDelivered(true);
    setOpenPending(false);
    setOpenCancelled(false);
  };

  const toggleOpenPending = () => {
    setOpenAll(false);
    setOpenDelivered(false);
    setOpenPending(true);
    setOpenCancelled(false);
  };

  const toggleOpenCancelled = () => {
    setOpenAll(false);
    setOpenDelivered(false);
    setOpenPending(false);
    setOpenCancelled(true);
  };

  const all = data?.sort((a, b) =>
    moment(b.orderDate).diff(moment(a.orderDate))
  );

  const delivered = data
    ?.filter((item) => item.status === "Completed")
    .sort((a, b) => moment(b.orderDate).diff(moment(a.orderDate)));

  const pending = data
    ?.filter((item) => item.status === "Pending")
    .sort((a, b) => moment(b.orderDate).diff(moment(a.orderDate)));

  const cancelled = data
    ?.filter((item) => item.status === "Cancelled")
    .sort((a, b) => moment(b.orderDate).diff(moment(a.orderDate)));

  return (
    <div className="profilepage">
      <section className="profilepage-body">
        <div className="profilepage-btns">
          <button
            className={openAll ? "active" : "profilepage-btn-list"}
            onClick={toggleOpenAll}
          >
            All
          </button>
          <button
            className={openDelivered ? "active" : "profilepage-btn-list"}
            onClick={toggleOpenDelivered}
          >
            Completed
          </button>
          <button
            className={openPending ? "active" : "profilepage-btn-list"}
            onClick={toggleOpenPending}
          >
            Pending
          </button>
          <button
            className={openCancelled ? "active" : "profilepage-btn-list"}
            onClick={toggleOpenCancelled}
          >
            Cancelled
          </button>
        </div>
        <div className="profilepage-order-container">
          {openAll &&
            all?.map((orderData: OrderInterface) => (
              <ClientOrderCard orderData={orderData} key={orderData.id} />
            ))}
          {openDelivered &&
            delivered?.map((orderData: OrderInterface) => (
              <ClientOrderCard orderData={orderData} key={orderData.id} />
            ))}
          {openPending &&
            pending?.map((orderData: OrderInterface) => (
              <ClientOrderCard orderData={orderData} key={orderData.id} />
            ))}
          {openCancelled &&
            cancelled?.map((orderData: OrderInterface) => (
              <ClientOrderCard orderData={orderData} key={orderData.id} />
            ))}
        </div>
      </section>
    </div>
  );
};

export default ClientOrders;
