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
import { Link } from "react-router-dom";
import { Search } from "@mui/icons-material";

const AdminProducts = () => {
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [paramsId, setParamsId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  const filtered = data?.filter(
    (item) =>
      item?.barcode?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      item?.productName?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  console.log("productTable:", data);

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
        <button
          style={{ border: "none", padding: "20px 40px", borderRadius: "10px" }}
          className="product-add-btn"
          onClick={() => setOpenAdd(true)}
        >
          Add Product
        </button>
        <div
          style={{
            border: "2px solid black",
            width: "96%",
            display: "flex",
            alignItems: "center",
            paddingLeft: "20px",
            borderRadius: "20px",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        >
          <Search />
          <input
            style={{
              width: "80%",
              border: "none",
              outline: "none",
              padding: "20px",
            }}
            type="text"
            placeholder="Search using barcode"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <span style={{ fontSize: "18px" }}>
          {filtered ? filtered?.length : 0} products count
        </span>
        <Table className="admin-order-table">
          <TableHead className="admin-order-table-header">
            <TableRow className="admin-order-header-table-row">
              <TableCell className="table-header" align="center">
                Barcode
              </TableCell>
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
                Ad
              </TableCell>
              <TableCell className="table-header" align="center">
                Action Button
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="product-tablebody">
            {filtered?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="table-header" align="center">
                  {item.barcode}
                </TableCell>
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
                  {item.isAd === "false" ? "No" : "Yes"}
                </TableCell>
                <TableCell className="table-header" align="center">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Link
                      style={{ textDecoration: "none", color: "black" }}
                      to={`/admin/products/${item.id}`}
                    >
                      <button
                        className="admin-order-btn"
                        style={{ backgroundColor: "green" }}
                      >
                        View Product
                      </button>
                    </Link>
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
                  </div>
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
