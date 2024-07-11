import axios from "axios";
import "./AdminAddProduct.css";
import { Close, Check } from "@mui/icons-material";
import { useState } from "react";
import { toast } from "react-toastify";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { maxNumber } from "../../Types";

interface props {
  toggleProductModal: () => void;
}

const AdminAddProduct = ({ toggleProductModal }: props) => {
  // const [ImageFile, setImageFile] = useState<string>("");
  const [image, setImage] = useState<ImageListType>([]);
  // const [addProductInfo, setAddProductInfo] = useState<ProductInterface>({
  //   id: "",
  //   productName: "",
  //   productImage: "",
  //   description: "",
  //   category: "",
  //   quantity: 0,
  //   price: 0,
  //   barcode: "",
  //   isAd: "false",
  // });
  const [barcode, setBarcode] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  // const onChangeHandler = (
  //   event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { value, name } = event.target;

  //   setAddProductInfo((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImage(imageList);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("file", image[0]?.file || "");
      data.append("upload_preset", "upload");
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/alialcantara/image/upload",
        data
      );
      const { url } = uploadRes.data;

      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/api/product/create`,
        {
          barcode: barcode,
          productName: productName,
          description: description,
          productImage: url,
        }
      );
      setLoading(false);
      toast.success("Sucessfully added product!", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

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

  return (
    <div className="addproduct">
      <div style={{ padding: "10px 0", fontSize: "20px" }}>Add Product</div>
      <hr style={{ marginBottom: "20px" }} />
      {/* <div className="upload-image-container">
        <img
          src={
            ImageFile
              ? URL.createObjectURL(
                  new Blob([ImageFile], { type: "image/jpeg" })
                )
              : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
          }
          alt="AddImage"
          className="addcategory-img"
        />
        <label htmlFor="file-upload" className="receipt-input-image">
          Upload the image of category here..
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

            {imageList.map((image, index) => (
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
            ))}
          </div>
        )}
      </ImageUploading>

      <section
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          margin: "10px 0",
        }}
      >
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            height: "60px",
          }}
        >
          Barcode
          <input
            className="addproduct-input"
            style={{ width: "95%", height: "50px" }}
            type="text"
            name="productName"
            defaultValue={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />
        </label>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            width: "50%",
            height: "60px",
          }}
        >
          Product Name
          <input
            className="addproduct-input"
            style={{ width: "95%", height: "50px" }}
            type="text"
            name="productName"
            defaultValue={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </label>
      </section>

      <section className="addproduct-item-list" style={{ width: "100%" }}>
        <label
          style={{ display: "flex", flexDirection: "column", height: "63px" }}
        >
          Description
          <input
            className="addproduct-input"
            type="text"
            name="description"
            defaultValue={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </section>

      <hr style={{ marginTop: "20px" }} />
      <div className="addproduct-btn-container">
        <button className="addproduct-btn close" onClick={toggleProductModal}>
          <Close /> Close
        </button>
        <button className="addproduct-btn submit" onClick={handleSubmit}>
          <Check /> {loading ? "Please wait" : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default AdminAddProduct;
