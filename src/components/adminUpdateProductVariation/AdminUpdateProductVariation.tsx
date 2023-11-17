import { Close, Check } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ProductVarianceInteface } from "../../Types";

interface updateProductInterface {
  toggleModal: () => void;
  paramsId: string;
  name: string;
}

const AdminUpdateProductVariation = ({
  toggleModal,
  paramsId,
  name,
}: updateProductInterface) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<string>("");
  const [variationName, setVariationName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [variationData, setVariationData] = useState<ProductVarianceInteface>();

  console.log("variationName", name);

  console.log("new variationName:", variationName);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/api/product/${paramsId}/variations/${name.trim()}`
      );
      setVariationData(res.data);
    };
    fetchData();
  }, [paramsId]);

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

  const handleUpdateProduct = async () => {
    setLoading(true);
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
          `${
            import.meta.env.VITE_APP_BASE_URL
          }/api/product/${paramsId}/variations/${variationData?.variationName}`,
          {
            variationName: variationName
              ? variationName
              : variationData?.variationName,
            price: price ? price : variationData?.price,
            imgUrl: url,
            quantity: quantity,
            description: description,
          }
        );
      } else {
        await axios.put(
          `${
            import.meta.env.VITE_APP_BASE_URL
          }/api/product/${paramsId}/variations/${variationData?.variationName}`,
          {
            variationName: variationName
              ? variationName
              : variationData?.variationName,
            price: price ? price : variationData?.price,
            imgUrl: variationData?.imgUrl,
            quantity: quantity ? quantity : variationData?.quantity,
            description: description ? description : variationData?.description,
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
              : variationData?.imgUrl
          }
          alt="AddImage"
          className="addcategory-img"
        />
        <label htmlFor="file-upload" className="update-product-input-image">
          Upload Product Variation Image
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
          <label>Variation Name:</label>
          <input
            type="text"
            placeholder="Product Variation Name"
            className="update-product-input"
            defaultValue={variationData?.variationName}
            onChange={(e) => setVariationName(e.target.value)}
          />
        </div>

        <div className="update-product-itemlist">
          <label>Description:</label>
          <input
            type="text"
            placeholder="Description"
            className="update-product-input"
            defaultValue={variationData?.description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/*  */}
        <div className="update-product-itemlist">
          <label>Quantity</label>
          <input
            type="number"
            placeholder="Quantity"
            className="update-product-input"
            defaultValue={variationData?.quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>

        <div className="update-product-itemlist">
          <label>Price: </label>
          <input
            type="text"
            placeholder="Price"
            name="price"
            className="update-product-input"
            defaultValue={variationData?.price}
            onChange={(e) => setPrice(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="addproduct-btn-container">
        <button className="addproduct-btn close" onClick={toggleModal}>
          <Close /> Close
        </button>
        <button className="addproduct-btn submit" onClick={handleUpdateProduct}>
          <Check /> {loading ? "Please wait" : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default AdminUpdateProductVariation;
