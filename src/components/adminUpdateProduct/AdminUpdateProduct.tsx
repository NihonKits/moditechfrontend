import "./AdminUpdateProduct.css";
import { Close, Check } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import { ProductInterface } from "../../Types";
import { toast } from "react-toastify";

interface updateProductInterface {
  toggleModalUpdateProduct: () => void;
  paramsId: string;
}

const AdminUpdateProduct = ({
  toggleModalUpdateProduct,
  paramsId,
}: updateProductInterface) => {
  const [imageFile, setImageFile] = useState<string>("");
  const [singleProductData, setSingleProductData] =
    useState<ProductInterface>();
  // const [categoryDropDown, setCategoryDropDown] = useState<CategoryInterface[]>(
  //   []
  // );

  console.log("eto ung param id", paramsId);

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/api/product/specificProduct/${paramsId}`
      );
      setSingleProductData(response.data);
    };
    fetch();
  }, [paramsId]);

  const [productInfo, setProductInfo] = useState<ProductInterface>({
    id: "",
    productName: "",
    productImage: "",
    description: "",
    price: 0,
    quantity: 0,
    category: "",
    //   sold: 0,
    //   reason: "",
  });

  useEffect(() => {
    setProductInfo({
      id: singleProductData?.id || "",
      productName: singleProductData?.productName || "",
      productImage: singleProductData?.productImage || "",
      description: singleProductData?.description || "",
      price: singleProductData?.price || 0,
      quantity: singleProductData?.quantity || 0,
      category: singleProductData?.category || "",
      // sold: 0,
      // reason: singleProductData?.reason || "",
    });
  }, [singleProductData, paramsId]);

  // useEffect(() => {
  //   const fetch = async () => {
  //     const res = await axios.get(
  //       `${import.meta.env.VITE_APP_BASE_URL}/api/category/list`
  //     );
  //     setCategoryDropDown(res.data);
  //   };
  //   fetch();
  // }, []);

  const fileTypeChecking = (e: any) => {
    var fileInput = document.getElementById("file-upload") as HTMLInputElement;
    var filePath = fileInput.value;

    // Allowing file type
    var allowedExtensions = /(\.png|\.jpg|\.jpeg)$/i;
    // |\.pdf|\.tex|\.txt|\.rtf|\.wps|\.wks|\.wpd

    if (!allowedExtensions.exec(filePath)) {
      alert("Invalid file type");
      fileInput.value = "";
      return false;
    }

    setImageFile(e.target.files[0]);
  };

  const handleUpdateProduct = async (e: any) => {
    e.preventDefault();
    try {
      if (imageFile !== "") {
        const data = new FormData();
        data.append("file", imageFile);
        data.append("upload_preset", "upload");
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/alialcantara/image/upload",
          data
        );
        const { url } = uploadRes.data;

        await axios.put(
          `${import.meta.env.VITE_APP_BASE_URL}/api/product/update/${paramsId}`,
          {
            productName: productInfo.productName,
            imageUrl: url,
            description: productInfo.description,
            price: productInfo.price,
            quantity: productInfo.quantity,
            //   category: productInfo.categoryId,
            //   reason: productInfo.reason,
          }
        );
      } else {
        await axios.put(
          `${import.meta.env.VITE_APP_BASE_URL}/api/product/update/${paramsId}`,
          {
            productName: productInfo.productName,
            productImage: singleProductData?.productImage,
            description: productInfo.description,
            price: productInfo.price,
            quantity: productInfo.quantity,
            //   category: productInfo.categoryId,
            //   reason: productInfo.reason,
          }
        );
      }

      toast(" Successfully updated the product!", {
        type: "success",
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {}
  };

  return (
    <div className="update-product">
      {/* <button
        className="addcategory-closebtn"
        onClick={() => toggleModalUpdateProduct}
      >
        x
      </button> */}

      <div className="update-product-image-container">
        <img
          src={
            imageFile
              ? URL.createObjectURL(
                  new Blob([imageFile], { type: "image/jpeg" })
                )
              : productInfo.productImage
          }
          alt="AddImage"
          className="addcategory-img"
        />
        <label htmlFor="file-upload" className="update-product-input-image">
          Upload Product Image
          <input
            type="file"
            id="file-upload"
            onChange={fileTypeChecking}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <div className="update-product-input-container">
        <div className="update-product-itemlist">
          <label>Product Name:</label>
          <input
            type="text"
            placeholder="Product Name"
            className="update-product-input"
            value={productInfo.productName}
            onChange={(e) => {
              setProductInfo((data) => ({
                ...data,
                productName: e.target.value,
              }));
            }}
          />
        </div>

        <div className="update-product-itemlist">
          <label>Product Description:</label>
          <input
            type="text"
            placeholder="description"
            className="update-product-input"
            value={productInfo.description}
            onChange={(e) => {
              setProductInfo((data) => ({
                ...data,
                description: e.target.value,
              }));
            }}
          />
        </div>

        <div className="update-product-itemlist">
          <label>Product Price:</label>
          <input
            type="number"
            placeholder="Price"
            className="update-product-input"
            value={productInfo.price}
            onChange={(e) => {
              setProductInfo((data) => ({
                ...data,
                price: parseInt(e.target.value),
              }));
            }}
          />
        </div>

        <div className="update-product-itemlist">
          <label>Product Quantity:</label>
          <input
            type="number"
            placeholder="Quantity"
            className="update-product-input"
            value={productInfo.quantity}
            onChange={(e) => {
              setProductInfo((data) => ({
                ...data,
                quantity: parseInt(e.target.value),
              }));
            }}
          />
        </div>

        {/*  <div className="update-product-itemlist">
      <select
        className="addcategory-input"
        value={productInfo.categoryId}
        onChange={(e) => {
          const selectedCategoryId = e.target.value;
          setProductInfo((data) => ({
            ...data,
            categoryId: selectedCategoryId || "",
          }));
        }}
      >
        {categoryDropDown?.map((item) => (
          <option key={item.id} value={item.id}>
            {item.categoryName}
          </option>
        ))}
      </select>
    </div> 
    
    
     <div className="update-product-itemlist">
      <input
        type="text"
        placeholder="Reason"
        className="addcategory-input"
        value={productInfo.reason}
        onChange={(e) => {
          setProductInfo((data) => ({
            ...data,
            reason: e.target.value,
          }));
        }}
      />
    </div>*/}
      </div>

      <div className="addproduct-btn-container">
        <button
          className="addproduct-btn close"
          onClick={toggleModalUpdateProduct}
        >
          <Close /> Close
        </button>
        <button className="addproduct-btn submit" onClick={handleUpdateProduct}>
          <Check /> Submit
        </button>
      </div>
    </div>
  );
};

export default AdminUpdateProduct;
