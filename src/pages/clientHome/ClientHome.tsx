import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import IsAdProducts from "../../components/isAdProducts/IsAdProducts";
import RecommendedProducts from "../../components/recommendedProducts.tsx/RecommendedProducts";

const ClientHome = () => {
  return (
    <>
      <Header />
      <RecommendedProducts />
      <IsAdProducts />
      <Footer />
    </>
  );
};

export default ClientHome;
