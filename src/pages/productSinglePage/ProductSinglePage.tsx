import "./ProductSinglePage.css";
import { useState, useEffect } from "react";
import { Add, Remove } from "@mui/icons-material";

import { useLocation } from "react-router-dom";
import axios from "axios";
import { ProductInterface, ProductVarianceInteface } from "../../Types";
import { useCartStore } from "../../zustand/CartStore";
import Footer from "../../components/footer/Footer";

const ProductSinglePage = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[3];

  const [productData, setProductData] = useState<ProductInterface>();
  const [selectedVariation, setSelectedVariation] =
    useState<ProductVarianceInteface | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/api/product/specificProduct/${id}`
      );
      setProductData(res.data);

      if (
        res.data.productVariationsList &&
        res.data.productVariationsList.length > 0
      ) {
        setSelectedVariation(res.data.productVariationsList[0]);
      }
    };
    fetchData();
  }, [id]);

  const handleVariationClick = (variation: ProductVarianceInteface) => {
    setSelectedVariation(variation);
    setQuantity(1);
  };

  const handleQuantity = (type: "dec" | "inc") => {
    if (type === "dec") {
      setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
    } else {
      if (selectedVariation) {
        setQuantity((prevQuantity) =>
          Math.min(prevQuantity + 1, selectedVariation.quantity)
        );
      }
    }
  };

  const handleAddToCart = () => {
    if (productData && selectedVariation) {
      // Find the index of the selected variation in the productVariationsList
      const selectedVariationIndex =
        productData.productVariationsList?.findIndex(
          (item) => item === selectedVariation
        );

      if (
        selectedVariationIndex !== undefined &&
        selectedVariationIndex !== -1
      ) {
        addItem(productData, selectedVariationIndex, quantity);
      }
    }
  };

  return (
    <>
      <div className="container">
        {productData ? (
          <>
            <div className="product-page-container">
              <div className="wrapper">
                <div className="img-container">
                  <img
                    src={selectedVariation?.imgUrl}
                    className="InnerImageZoom"
                    alt="Product Variation"
                  />
                </div>
                <div className="info-container">
                  <h1 className="variation-name">
                    {selectedVariation?.variationName}
                  </h1>
                  <p className="desc">{selectedVariation?.description}</p>

                  <div>
                    <p
                      style={{
                        fontSize: "50px",
                        color: "orange",
                        fontWeight: "bold",
                      }}
                    >
                      ₱{selectedVariation?.price}.00
                    </p>
                  </div>
                  <div className="filter-container">
                    Variations:
                    <div className="filter">
                      {productData.productVariationsList?.map((item, key) => (
                        <span
                          key={key}
                          onClick={() => handleVariationClick(item)}
                          className={
                            selectedVariation === item
                              ? "variant-active"
                              : "variant-non-active"
                          }
                        >
                          <b>{item.variationName}</b>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="add-container">
                    <div className="amount-container">
                      <Remove
                        onClick={() => handleQuantity("dec")}
                        style={{ cursor: "pointer" }}
                      />
                      <span>{quantity}</span>
                      <Add
                        onClick={() => handleQuantity("inc")}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                    <button
                      className="product-single-page-btn"
                      onClick={handleAddToCart}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="spinner"></div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductSinglePage;
