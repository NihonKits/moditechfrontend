import { useQuery } from "react-query";
import useAuthStore from "../../zustand/AuthStore";
import "./Profile.css";
import axios from "axios";
import { maxNumber, UserInterface } from "../../Types";
import { useState } from "react";
import { toast } from "react-toastify";
import ImageUploading, { ImageListType } from "react-images-uploading";

const Profile = () => {
  const user = useAuthStore((state) => state.user);

  const [image, setImage] = useState<ImageListType>([]);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");

  const updateProfile = async () => {
    try {
      if (image.length === 0) {
        console.log("there is no updated image");
      } else {
        const data = new FormData();
        data.append("file", image[0]?.file || "");
        data.append("upload_preset", "upload");
        const uploadRes = await axios.post(
          "https://api.cloudinary.com/v1_1/alialcantara/image/upload",
          data
        );
        var { url } = uploadRes.data;
      }

      await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/api/user/update/${user}`,
        {
          firstName: firstName,
          lastName: lastName,
          contactNumber: contactNumber,
          addressLine1: addressLine1,
          city: city,
          country: country,
          postalCode: postalCode,
          imageUrl: url,
        }
      );
      toast.success("Sucessfully updated profile!", {
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
      console.log(error);
    }
  };

  const { data } = useQuery<UserInterface>({
    queryKey: ["Profile"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/user/${user}`)
        .then((res) => res.data),
  });

  console.log(data);

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    console.log(imageList, addUpdateIndex);
    setImage(imageList);
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-title-container">
          <h2 className="profile-title">My Profile</h2>
          <span>Manage and protect your account</span>
        </div>
        <hr />
        <div className="profile-body-container">
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

              dragProps,
            }) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {image.length === 0 ? (
                  <img
                    src={data?.imageUrl}
                    alt=""
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "100%",
                    }}
                  />
                ) : (
                  imageList.map((image, index) => (
                    <div key={index} className="image-item">
                      <img
                        src={image["data_url"]}
                        alt=""
                        style={{
                          width: "200px",
                          height: "200px",
                          objectFit: "contain",
                          borderRadius: "100px",
                        }}
                      />
                    </div>
                  ))
                )}

                <button
                  style={{
                    border: "1px solid black",
                    padding: "10px",
                    borderRadius: "5px",
                    width: "200px",
                    margin: "10px 0",
                    cursor: "pointer",
                  }}
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  Click to Upload Image
                </button>
              </div>
            )}
          </ImageUploading>

          <label className="profile-label">
            Email:
            <span
              style={{
                border: "1px solid black",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              {data?.email}
            </span>
          </label>
          <label className="profile-label">
            First Name:
            <input
              style={{
                height: "30px",
                paddingLeft: "10px",
                borderRadius: "5px",
                width: "500px",
              }}
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              defaultValue={data?.firstName}
            />
          </label>
          <label className="profile-label">
            Last Name:
            <input
              style={{
                height: "30px",
                paddingLeft: "10px",
                borderRadius: "5px",
                width: "500px",
              }}
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              defaultValue={data?.lastName}
            />
          </label>
          <label className="profile-label">
            Contact Number:
            <input
              style={{
                height: "30px",
                paddingLeft: "10px",
                borderRadius: "5px",
                width: "500px",
              }}
              onChange={(e) => setContactNumber(e.target.value)}
              type="text"
              defaultValue={data?.contactNumber}
            />
          </label>
          <label className="profile-label">
            Address Line 1:
            <input
              style={{
                height: "30px",
                paddingLeft: "10px",
                borderRadius: "5px",
                width: "500px",
              }}
              onChange={(e) => setAddressLine1(e.target.value)}
              type="text"
              defaultValue={data?.addressLine1}
            />
          </label>
          <label className="profile-label">
            City:
            <input
              style={{
                height: "30px",
                paddingLeft: "10px",
                borderRadius: "5px",
                width: "500px",
              }}
              onChange={(e) => setCity(e.target.value)}
              type="text"
              defaultValue={data?.city}
            />
          </label>
          <label className="profile-label">
            Country:
            <input
              style={{
                height: "30px",
                paddingLeft: "10px",
                borderRadius: "5px",
                width: "500px",
              }}
              onChange={(e) => setCountry(e.target.value)}
              type="text"
              defaultValue={data?.country}
            />
          </label>
          <label className="profile-label">
            Postal Code:
            <input
              style={{
                height: "30px",
                paddingLeft: "10px",
                borderRadius: "5px",
                width: "500px",
              }}
              onChange={(e) => setPostalCode(e.target.value)}
              type="text"
              defaultValue={data?.postalCode}
            />
          </label>
          <button
            onClick={updateProfile}
            style={{
              marginTop: "10px",
              padding: "20px",
              width: "515px",
              borderRadius: "10px",
            }}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
