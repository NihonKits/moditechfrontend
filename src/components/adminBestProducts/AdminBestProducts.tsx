import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ProductInterface } from "../../Types";
import { useQuery } from "react-query";
import axios from "axios";

const AdminBestProducts = () => {
  const { data } = useQuery<ProductInterface[]>({
    queryKey: ["AdminBestProducts"],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_APP_BASE_URL}/api/product/bestProducts`)
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
      }}
    >
      <h1>Best Selling Products</h1>
      <TableContainer
        className="product"
        style={{ maxWidth: "1100px", width: "100%" }}
      >
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
                Total Product Solds
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="product-tablebody">
            {data?.map((item) => (
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
                  {item.totalSold}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminBestProducts;
