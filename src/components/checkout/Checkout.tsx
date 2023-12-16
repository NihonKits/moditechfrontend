import "./Checkout.css";
import { IndeterminateCheckBox, AddBox } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import useAuthStore from "../../zustand/AuthStore";
import { Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import { useCartStore } from "../../zustand/CartStore";

import gcash from "../../assets/gcash.jpg";
import bpi from "../../assets/bpi.jpg";
import bdo from "../../assets/bdo.jpg";

const Checkout = () => {
  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseItem = useCartStore((state) => state.increaseItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);
  const total = useCartStore((state) => state.total);

  const [selectedModePayment, setSelectedModePayment] =
    useState<string>("gcash");
  const [open, setOpen] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");

  const handleCloseBtn = () => {
    setOpen(false);
    window.location.reload();
  };

  const itemsToString = JSON.stringify(items);

  const handlePlaceOrder = async () => {
    const orderData = {
      products: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        variationIndexes: [item.variationIndex],
      })),
      email: user,
      address: address,
      contactNumber: contactNumber,
      totalPrice: total,
      orderList: itemsToString,
      status: "Pending",
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/order/create`,
        orderData
      );

      // Use the clearCart function if available in your useCartStore
      window.localStorage.removeItem("cart-storage");

      toast("Successfully ordered!", {
        type: "success",
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        setOpen(true);
      }, 2000);
    } catch (error) {
      console.error(error);
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
        {items?.map((item, index) => (
          <section className="checkout-product" key={index}>
            <div className="checkout-product-container">
              <img
                className="checkout-image"
                src={
                  item.product?.productVariationsList[item?.variationIndex]
                    ?.imgUrl
                }
                alt={
                  item.product?.productVariationsList[item?.variationIndex]
                    ?.variationName
                }
              />
            </div>
            <label>
              Product Name:{" "}
              <b>
                {
                  item.product?.productVariationsList[item?.variationIndex]
                    ?.variationName
                }
              </b>
            </label>
            <label>
              Product Price:{" "}
              <b>
                {
                  item.product?.productVariationsList[item?.variationIndex]
                    ?.price
                }
              </b>
            </label>
            <div className="checkout-quantity-btn-container">
              <label>Quantity:</label>
              <div className="checkout-quantity-btn">
                <IndeterminateCheckBox
                  onClick={() => decreaseItem(index)}
                  style={{ cursor: "pointer", fontSize: "20px" }}
                />
                <span>{item.quantity}</span>
                <AddBox
                  onClick={() => increaseItem(index)}
                  style={{ cursor: "pointer", fontSize: "20px" }}
                />
              </div>
            </div>
            <label>
              Price:{" "}
              <b>
                {item.product?.productVariationsList[item?.variationIndex]
                  ?.price * item?.quantity}
              </b>
            </label>
            <button
              className="checkout-cancelbtn"
              onClick={() => removeItem(index)}
            >
              Remove
            </button>
          </section>
        ))}
      </div>
      <h1>
        TOTAL PRICE: <b>{total}</b>
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* TODO */}
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Contact Number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
        />
        {/* TODO */}
        <select
          className="mode-of-payment"
          style={{ padding: "10px" }}
          onChange={(e) => setSelectedModePayment(e.target.value)}
        >
          <option value="gcash">GCash</option>
          <option value="bpi">BPI</option>
          <option value="bdo">BDO</option>
        </select>
        <button
          disabled={total === 0}
          className="checkout-btn"
          style={{ padding: "10px" }}
          onClick={handlePlaceOrder}
        >
          Checkout
        </button>
      </div>
      <Dialog open={open} onClose={handleCloseBtn}>
        <DialogContent>
          <div className="shipping-modal">
            <button className="shipping-btn-close" onClick={handleCloseBtn}>
              x
            </button>
            {selectedModePayment === "gcash" && (
              <img src={gcash} alt="" className="qrImage" />
            )}
            {selectedModePayment === "bpi" && (
              <img src={bpi} alt="" className="qrImage" />
            )}
            {selectedModePayment === "bdo" && (
              <img src={bdo} alt="" className="qrImage" />
            )}
            <span style={{ fontSize: "20px" }}>
              Please scan it or save it before closing.
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
