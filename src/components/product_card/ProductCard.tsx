import "./ProductCard.css";
import { LocalMall, Add, Remove } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { ProductInterface } from "../../Types";
import Rating from "@mui/material/Rating";
import { useCartStore } from "../../zustand/CartStore";

interface Props {
  product: ProductInterface;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (product.quantity === 0) {
      setQuantity(0);
    }
  }, [product.quantity]);

  const handleQuantity = (type: string) => {
    if (type === "dec") {
      quantity > 1 && setQuantity(quantity - 1);
    } else {
      product.quantity > 0 && setQuantity(quantity + 1);
    }

    if (quantity > product.quantity || product.quantity === 0) {
      setQuantity(0);
    }
  };

  const handleAddProductToCart = () => {
    if (quantity > 0) {
      addItem(product, quantity);
    } else {
      alert("Quantity is 0");
    }
  };

  return (
    <div className="product-card">
      <section className="product-image-container">
        <img
          className="product-image"
          src={product.productImage}
          alt={product.productName}
        />
      </section>
      <section>
        <Rating name="size-medium" defaultValue={2} />
      </section>
      <section className="product-info-container">
        <section className="product-info">
          <div className="product-name-section">
            <span className="product-name">{product.productName}</span>
          </div>
          <div className="product-price-section">
            <span className="product-price">₱{product.price}</span>
            <span className="product-quantity">{product.quantity}pcs</span>
          </div>
        </section>
        <section className="product-btns">
          <div className="product-quantity-btn">
            <Remove
              sx={{ cursor: "pointer", fontSize: "20px" }}
              onClick={() => handleQuantity("dec")}
            />
            <input
              type="number"
              className="product-amount"
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setQuantity(value);
                if (value > product.quantity) {
                  window.alert(
                    `The quantity cannot add more than ${product.quantity}`
                  );
                  setQuantity(product.quantity);
                }
              }}
              min="0"
              max={product.quantity}
              disabled={product.quantity < 1}
            />
            <Add
              sx={{ cursor: "pointer", fontSize: "20px" }}
              onClick={() => handleQuantity("inc")}
            />
          </div>
          <div onClick={handleAddProductToCart}>
            <LocalMall sx={{ fontSize: "30px", cursor: "pointer" }} />
          </div>
        </section>
      </section>
    </div>
  );
};

export default ProductCard;
