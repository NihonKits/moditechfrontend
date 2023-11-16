import "./IsAdProducts.css";
import ProductCard from "../product_card/ProductCard";
import { ProductInterface } from "../../Types";
import { useQuery } from "react-query";
import axios from "axios";

const IsAdProducts = () => {
  const { data } = useQuery<ProductInterface[]>({
    queryKey: ["IsAdProducts"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/product/isAd`)
        .then((res) => res.data),
  });

  return (
    <div className="shop-section">
      <div className="shop-section-container">
        <h1 className="shop-section-title" style={{ paddingBottom: "20px" }}>
          PRODUCTS THAT ARE ON SALE
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

export default IsAdProducts;
