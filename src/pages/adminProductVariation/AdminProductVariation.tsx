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

const AdminProductVariation = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[3];
  const [openAdd, setOpenAdd] = useState<boolean>(false);

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
        <button className="product-add-btn" onClick={() => setOpenAdd(true)}>
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
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    {variation?.quantity}
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
    </div>
  );
};

export default AdminProductVariation;
