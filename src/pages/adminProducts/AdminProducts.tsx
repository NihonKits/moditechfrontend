import "./AdminProducts.css";
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
import { useQuery } from "react-query";
import { ProductInterface } from "../../Types";
import axios from "axios";
import { useState } from "react";
import AdminAddProduct from "../../components/adminAddProduct/AdminAddProduct";
import AdminUpdateProduct from "../../components/adminUpdateProduct/AdminUpdateProduct";

const AdminProducts = () => {
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [paramsId, setParamsId] = useState<string>("");

  const toggleModalUpdateProduct = (id: string) => {
    setParamsId(id);
    setOpenUpdate(true);
  };

  const toggleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const toggleModal = () => {
    setOpenAdd(false);
  };

  const { data } = useQuery<ProductInterface[]>({
    queryKey: ["AdminProducts"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/product/list`)
        .then((res) => res.data),
  });

  const handleDelete = async (productId: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/api/product/delete/${productId}`
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
      }}
    >
      <TableContainer
        className="product"
        style={{ maxWidth: "1100px", width: "100%" }}
      >
        <button className="product-add-btn" onClick={() => setOpenAdd(true)}>
          Add Product
        </button>
        <Table className="admin-order-table">
          <TableHead className="admin-order-table-header">
            <TableRow className="admin-order-header-table-row">
              <TableCell className="table-header" align="center">
                Name
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
                Action Button
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="product-tablebody">
            {data?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="table-header" align="center">
                  {item.productName}
                </TableCell>
                <TableCell className="table-header" align="center">
                  <img
                    src={item.productImage}
                    alt=""
                    className="product-image"
                  />
                </TableCell>
                <TableCell className="table-header" align="center">
                  {item.description}
                </TableCell>
                <TableCell className="table-header" align="center">
                  ₱{item.price}
                </TableCell>
                <TableCell className="table-header" align="center">
                  {item.quantity}
                </TableCell>
                <TableCell className="table-header" align="center">
                  <button
                    className="admin-order-btn"
                    onClick={() => toggleModalUpdateProduct(item.id)}
                    style={{ backgroundColor: "blue" }}
                  >
                    Update
                  </button>
                  <button
                    className="admin-order-btn"
                    onClick={() => handleDelete(item.id)}
                    style={{ backgroundColor: "red" }}
                  >
                    Delete
                  </button>
                </TableCell>
                <Dialog open={openUpdate} onClose={toggleCloseUpdate}>
                  <DialogContent>
                    <AdminUpdateProduct
                      toggleModalUpdateProduct={toggleCloseUpdate}
                      paramsId={paramsId}
                    />
                  </DialogContent>
                </Dialog>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openAdd} onClose={toggleModal}>
        <DialogContent>
          <AdminAddProduct toggleProductModal={toggleModal} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
