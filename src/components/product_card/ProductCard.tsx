import "./ProductCard.css";
import { ProductInterface } from "../../Types";
import { useNavigate } from "react-router-dom";

interface Props {
  product: ProductInterface;
}

const ProductCard = ({ product }: Props) => {
  const navigate = useNavigate();

  const handleAddProductToCart = (id: string) => {
    navigate(`/client/product/${id}`);
  };

  return (
    <div
      className="product-card"
      onClick={() => handleAddProductToCart(product.id)}
    >
      <section className="product-image-container">
        <img
          className="product-image"
          src={product.productImage}
          alt={product.productName}
        />
      </section>
      <section className="product-info-container">
        <section className="product-info">
          <div className="product-name-section">
            <span className="product-name">{product.productName}</span>
          </div>
        </section>
        <div className="product-name-section">
          <span style={{ color: "gray", textTransform: "lowercase" }}>
            {product.description}
          </span>
        </div>
        <div className="product-name-section" style={{ paddingTop: "10px" }}>
          <span className="product-name">
            {product.totalSold ? product.totalSold : 0} sold
          </span>
        </div>
      </section>
    </div>
  );
};

export default ProductCard;
