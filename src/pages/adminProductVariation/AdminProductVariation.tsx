import {
  Dialog,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ProductInterface } from "../../Types";
import axios from "axios";
import { useQuery } from "react-query";
import AdminAddProductVariation from "../../components/adminAddProductVariation/AdminAddProductVariation";
import AdminUpdateProductVariation from "../../components/adminUpdateProductVariation/AdminUpdateProductVariation";

const AdminProductVariation = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [variationName, setVariationName] = useState<string>("");

  const toggleModalUpdateProduct = (id: string) => {
    setVariationName(id);
    setOpenUpdate(true);
  };

  const toggleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const toggleModal = () => {
    setOpenAdd(false);
  };

  const { data } = useQuery<ProductInterface>({
    queryKey: ["AdminProductVariation"],
    queryFn: () =>
      axios
        .get(
          `${
            import.meta.env.VITE_APP_BASE_URL
          }/api/product/specificProduct/${id}`
        )
        .then((res) => res.data),
  });

  const handleDelete = async (varationName: string) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/api/product/${id}/variations/${varationName}`
      );
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        marginTop: "20px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        paddingBottom: "50px",
      }}
    >
      <TableContainer
        className="product"
        style={{ maxWidth: "1100px", width: "100%" }}
      >
        <button
          style={{
            border: "none",
            padding: "20px 40px",
            borderRadius: "10px",
            marginBottom: "10px",
          }}
          className="product-add-btn"
          onClick={() => setOpenAdd(true)}
        >
          Add Product Variation
        </button>
        <Table className="admin-order-table">
          <TableHead className="admin-order-table-header">
            <TableRow className="admin-order-header-table-row">
              <TableCell className="table-header" align="center">
                Variation Name
              </TableCell>
              <TableCell className="table-header" align="center">
                Image
              </TableCell>
              <TableCell className="table-header" align="center">
                Description
              </TableCell>
              <TableCell className="table-header" align="center">
                Price
              </TableCell>
              <TableCell className="table-header" align="center">
                Quantity
              </TableCell>
              <TableCell className="table-header" align="center">
                Sold
              </TableCell>
              <TableCell className="table-header" align="center">
                Total Sales
              </TableCell>
              <TableCell className="table-header" align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="product-tablebody">
            {data?.productVariationsList !== null ? (
              data?.productVariationsList.map((variation, key) => (
                <TableRow key={key}>
                  <TableCell className="table-header" align="center">
                    {variation?.variationName}
                  </TableCell>
                  <TableCell className="table-header" align="center">
                    <img
                      src={variation?.imgUrl}
                      alt=""
                      className="product-image"
                    />
                  </TableCell>
                  <TableCell className="table-header" align="center">
                    {variation?.description}
                  </TableCell>
                  <TableCell className="table-header" align="center">
                    {variation?.price}
                  </TableCell>
                  <TableCell
                    className="table-header"
                    align="center"
                    style={{
                      color:
                        variation.quantity <= 5
                          ? "red"
                          : variation.quantity <= 10
                          ? "orange"
                          : "green",
                    }}
                  >
                    {variation?.quantity}
                  </TableCell>
                  <TableCell className="table-header" align="center">
                    {variation.sold}
                  </TableCell>
                  <TableCell className="table-header" align="center">
                    {variation.price * variation.sold}
                  </TableCell>
                  <TableCell className="table-header" align="center">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <button
                        className="admin-order-btn"
                        onClick={() =>
                          toggleModalUpdateProduct(variation.variationName)
                        }
                        style={{ backgroundColor: "blue" }}
                      >
                        Update
                      </button>
                      <button
                        className="admin-order-btn"
                        onClick={() => handleDelete(variation.variationName)}
                        style={{ backgroundColor: "red" }}
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                  <span>There is no variation for this product</span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openAdd} onClose={toggleModal}>
        <DialogContent>
          <AdminAddProductVariation toggleModal={toggleModal} />
        </DialogContent>
      </Dialog>
      <Dialog open={openUpdate} onClose={toggleCloseUpdate}>
        <DialogContent>
          <AdminUpdateProductVariation
            toggleModal={toggleCloseUpdate}
            paramsId={id}
            name={variationName}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProductVariation;
