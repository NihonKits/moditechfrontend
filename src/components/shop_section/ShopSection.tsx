import "./ShopSection.css";
import ProductCard from "../product_card/ProductCard";
import { ProductInterface } from "../../Types";
import { useQuery } from "react-query";
import axios from "axios";
import { Search } from "@mui/icons-material";
import { useState } from "react";

const ShopSection = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data } = useQuery<ProductInterface[]>({
    queryKey: ["ShopSection"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/product/list`)
        .then((res) => res.data),
  });

  const filteredData = data?.filter((item) =>
    item?.productName?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <div className="shop-section">
      <div className="shop-section-container">
        <div
          style={{
            border: "2px solid black",
            width: "100%",
            display: "flex",
            alignItems: "center",
            paddingLeft: "20px",
            borderRadius: "20px",
            marginBottom: "20px",
          }}
        >
          <Search />
          <input
            style={{
              width: "80%",
              border: "none",
              outline: "none",
              padding: "20px",
            }}
            type="text"
            placeholder="Search for Product"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <section className="shop-products-section">
          {filteredData?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </div>
    </div>
  );
};

export default ShopSection;
