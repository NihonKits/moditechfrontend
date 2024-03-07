import "./AdminUpdateProduct.css";
import { Close, Check } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import { ProductInterface } from "../../Types";
import { toast } from "react-toastify";
import ImageUploading, { ImageListType } from "react-images-uploading";

interface updateProductInterface {
  toggleModalUpdateProduct: () => void;
  paramsId: string;
}

const AdminUpdateProduct = ({
  toggleModalUpdateProduct,
  paramsId,
}: updateProductInterface) => {
  const [image, setImage] = useState<ImageListType>([]);
  const [singleProductData, setSingleProductData] =
    useState<ProductInterface>();
  const [loading, setLoading] = useState<boolean>(false);

  const [barcode, setBarcode] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [productImage, setProductImage] = useState<string>("");
  const [isAd, setIsAd] = useState<string>("");
  const maxNumber = 1;

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

  // const fileTypeChecking = (e: any) => {
  //   var fileInput = document.getElementById("file-upload") as HTMLInputElement;
  //   var filePath = fileInput.value;

  //   var allowedExtensions = /(\.png|\.jpg|\.jpeg)$/i;

  //   if (!allowedExtensions.exec(filePath)) {
  //     alert("Invalid file type");
  //     fileInput.value = "";
  //     return false;
  //   }

  //   setImageFile(e.target.files[0]);
  // };

  console.log("image length: ", image.length);

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImage(imageList);
  };

  const handleUpdateProduct = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    try {
      if (image.length !== 0) {
        const data = new FormData();
        data.append("file", image[0]?.file || "");
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
            productImage: url,
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
    <div className="update-product" style={{ width: "400px" }}>
      {/* <div className="update-product-image-container">
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
      </div> */}

      <ImageUploading
        multiple
        value={image}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <button
              className="text-xs text-center w-[300px] p-3 border-dashed border-[1px] mt-2 mb-2"
              style={isDragging ? { color: "red" } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click to Upload Image
            </button>
            {image.length === 0 ? (
              <img src={productImage} alt="" className="addcategory-img" />
            ) : (
              imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <img
                    src={image["data_url"]}
                    alt=""
                    className="addcategory-img"
                  />
                  <div
                    className="image-item__btn-wrapper"
                    style={{ display: "flex", gap: "10px" }}
                  >
                    <button onClick={() => onImageUpdate(index)}>Update</button>
                    <button onClick={() => onImageRemove(index)}>Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </ImageUploading>

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
