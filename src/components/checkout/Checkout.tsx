import "./Checkout.css";
import { useCartStore } from "../../zustand/CartStore";
import { IndeterminateCheckBox, AddBox } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import useAuthStore from "../../zustand/AuthStore";

const Checkout = () => {
  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseItem = useCartStore((state) => state.increaseItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);
  const total = useCartStore((state) => state.total);

  const itemsToString = JSON.stringify(items);

  const handlePlaceOrder = async () => {
    const orderData = {
      products: items.map((product) => ({
        productId: product.id,
        quantity: product.quantity,
      })),
      email: user,
      // userFullName: data?.name,
      totalPrice: total,
      orderList: itemsToString,
      status: "Pending",
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/order/create`,
        orderData
      );

      window.localStorage.removeItem("cart-storage");
      toast("Successfully ordered!", {
        type: "success",
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="checkout">
      <h1>Check Out</h1>
      <div className="checkout-container">
        <div>
          <h2>Here's what you're getting!</h2>
        </div>
        <hr
          style={{
            border: "3px solid gray",
            marginBottom: "20px",
          }}
        />
        {items?.map((item) => (
          <section className="checkout-product" key={item.id}>
            <div className="checkout-product-container">
              <img
                className="checkout-image"
                src={item.productImage}
                alt={item.productName}
              />
            </div>
            <label>
              Product Name: <b>{item.productName}</b>
            </label>
            <label>
              Product Price: <b>{item.price}</b>
            </label>
            <div className="checkout-quantity-btn-container">
              <label>Quantity:</label>
              <div className="checkout-quantity-btn">
                <IndeterminateCheckBox
                  onClick={() => decreaseItem(item.id)}
                  style={{ cursor: "pointer", fontSize: "20px" }}
                />
                <span>{item.quantity}</span>
                <AddBox
                  onClick={() => increaseItem(item.id)}
                  style={{ cursor: "pointer", fontSize: "20px" }}
                />
              </div>
            </div>
            <label>
              Price: <b>{item.price * item.quantity}</b>
            </label>
            <button
              className="checkout-cancelbtn"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </section>
        ))}
      </div>
      <h1>
        TOTAL PRICE: <b>{total}</b>
      </h1>
      <button
        disabled={total === 0}
        className="checkout-btn"
        onClick={handlePlaceOrder}
      >
        Checkout
      </button>
    </div>
  );
};

export default Checkout;
