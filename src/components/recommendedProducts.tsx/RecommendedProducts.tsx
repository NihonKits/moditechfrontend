import "./RecommendedProducts.css";
import ProductCard from "../product_card/ProductCard";
import { ProductInterface } from "../../Types";
import { useQuery } from "react-query";
import axios from "axios";

const RecommendedProducts = () => {
  const { data } = useQuery<ProductInterface[]>({
    queryKey: ["RecommendedProducts"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/product/bestProducts`)
        .then((res) => res.data),
  });

  return (
    <div className="shop-section">
      <div className="shop-section-container">
        <h1 className="shop-section-title" style={{ paddingBottom: "20px" }}>
          RECOMMENDED PRODUCTS
        </h1>
        <section className="shop-products-section">
          {data?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </div>
    </div>
  );
};

export default RecommendedProducts;
