import "./ShopSection.css";
import ProductCard from "../product_card/ProductCard";
import { ProductInterface } from "../../Types";
import { useQuery } from "react-query";
import axios from "axios";

const ShopSection = () => {
  const { data } = useQuery<ProductInterface[]>({
    queryKey: ["client-products"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/product/list`)
        .then((res) => res.data),
  });

  return (
    <div className="shop-section">
      <div className="shop-section-container">
        <h1 className="shop-section-title">BEST SELLING PRODUCTS</h1>
        <p className="shop-section-description">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
        <section className="shop-products-section">
          {data?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </div>
    </div>
  );
};

export default ShopSection;
