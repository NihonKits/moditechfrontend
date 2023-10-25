import "./UploadReceipt.css";
import { useState } from "react";
import { FileUpload } from "@mui/icons-material";
import { OrderInterface } from "../../Types";
import axios from "axios";
import { toast } from "react-toastify";

interface uploadReceiptInterface {
  orderData: OrderInterface;
  toggleOpenUploadReceipt: any;
}

const UploadReceipt = ({
  orderData,
  toggleOpenUploadReceipt,
}: uploadReceiptInterface) => {
  const [ImageFile, setImageFile] = useState<string>("");

  const handleUploadReceipt = async (e: any) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("file", ImageFile);
      data.append("upload_preset", "upload");
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/alialcantara/image/upload",
        data
      );
      const { url } = uploadRes.data;

      await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/api/order/uploadReceipt/${
          orderData.id
        }`,
        {
          receipt: url,
        }
      );
      toast(" Successfully uploaded the receipt!", {
        type: "success",
        position: "top-center",
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

  return (
    <div className="receipt-modal-container">
      <img
        src={
          ImageFile
            ? URL.createObjectURL(new Blob([ImageFile], { type: "image/jpeg" }))
            : ""
        }
        className="receipt-image"
      />
      <label htmlFor="file-upload" className="receipt-input-image">
        <FileUpload /> Upload the image of receipt here
        <input
          type="file"
          id="file-upload"
          onChange={fileTypeChecking}
          style={{ display: "none" }}
        />
      </label>
      <div className="receipt-btn-container">
        <button
          className="upload-receipt-submitbtn"
          onClick={handleUploadReceipt}
        >
          Submit
        </button>
        <button
          className="upload-receipt-closebtn"
          onClick={toggleOpenUploadReceipt}
        >
          Close Modal
        </button>
      </div>
    </div>
  );
};

export default UploadReceipt;
