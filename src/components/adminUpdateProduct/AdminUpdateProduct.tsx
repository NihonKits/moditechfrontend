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
  const [loading, setLoading] = useState<boolean>(false);

  const [barcode, setBarcode] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [productImage, setProductImage] = useState<string>("");
  const [isAd, setIsAd] = useState<string>("");

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

  useEffect(() => {
    setBarcode(singleProductData?.barcode || "");
    setProductName(singleProductData?.productName || "");
    setProductImage(singleProductData?.productImage || "");
    setDescription(singleProductData?.description || "");
    setIsAd(singleProductData?.isAd || "false");
  }, [singleProductData, paramsId]);

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
    setLoading(true);
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
            barcode: barcode,
            productName: productName,
            imageUrl: url,
            description: description,
            isAd: isAd,
          }
        );
      } else {
        await axios.put(
          `${import.meta.env.VITE_APP_BASE_URL}/api/product/update/${paramsId}`,
          {
            barcode: barcode,
            productName: productName,
            description: description,
            isAd: isAd,
          }
        );
      }
      setLoading(false);
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
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="update-product">
      <div className="update-product-image-container">
        <img
          src={
            imageFile
              ? URL.createObjectURL(
                  new Blob([imageFile], { type: "image/jpeg" })
                )
              : productImage
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
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        {/*  */}
        <div className="update-product-itemlist">
          <label>Barcode:</label>
          <input
            type="text"
            placeholder="Barcode"
            className="update-product-input"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />
        </div>

        <div className="update-product-itemlist">
          <label>Put as an Ad:</label>
          <select
            className="update-product-input"
            style={{ height: "45px", width: "100%" }}
            value={isAd}
            onChange={(e) => setIsAd(e.target.value)}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        <div className="update-product-itemlist">
          <label>Product Description:</label>
          <input
            type="text"
            placeholder="description"
            className="update-product-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="addproduct-btn-container">
        <button
          className="addproduct-btn close"
          onClick={toggleModalUpdateProduct}
        >
          <Close /> Close
        </button>
        <button className="addproduct-btn submit" onClick={handleUpdateProduct}>
          <Check /> {loading ? "Please wait" : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default AdminUpdateProduct;
