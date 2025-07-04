import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Link,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RouterLink } from "../../../routers/routers";
import { ShoppingCart } from "@mui/icons-material";
import { formatCurrency } from "../../../utils/formatCurrency";
import { ClientService } from "../../../utils/apis/client";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slices/cartSlice";

interface Product {
  _id: string;
  ten: string;
  mo_ta: string;
  gia: number;
  hinh_anh: string[];
  danh_muc_detail: {
    ten: string;
  };
}

interface Combo {
  _id: string;
  ten: string;
  mo_ta: string;
  gia_combo: number;
  danh_sach_san_pham_detail: Product[];
}

export const ClientHomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, combosData] = await Promise.all([
          ClientService.getListProducts(1, 8),
          ClientService.getListCombos(1, 8),
        ]);
        setProducts(productsData?.items || []);
        setCombos(combosData?.items || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (item: Product | Combo) => {
    if ("gia_combo" in item) {
      // It's a combo
      dispatch(
        addToCart({
          id: item._id,
          name: item.ten,
          price: item.gia_combo,
          image: item.danh_sach_san_pham_detail[0]?.hinh_anh[0] || "",
          quantity: 1,
          isCombo: true,
          danh_sach_san_pham_detail: item.danh_sach_san_pham_detail,
        })
      );
    } else {
      // It's a product
      dispatch(
        addToCart({
          id: item._id,
          name: item.ten,
          price: item.gia,
          image: item.hinh_anh[0],
          quantity: 1,
        })
      );
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ py: 8, bgcolor: "#098DEE" }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ color: "white", mb: 2 }}>
                Công cụ hỗ trợ làm việc và học tập
              </Typography>
              <Typography variant="h5" sx={{ color: "white", mb: 4 }}>
                Nâng cao hiệu suất với các công cụ hiện đại
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "white",
                  color: "#098DEE",
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
                onClick={() => navigate(RouterLink.CLIENT_PRODUCTS)}
              >
                Xem sản phẩm
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/hero-tools.png"
                alt="Hero"
                sx={{ width: "100%", borderRadius: 2 }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Box sx={{ py: 8 }}>
        <Container>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#098DEE" }}
            >
              Sản phẩm nổi bật
            </Typography>
            <Link
              component="button"
              variant="body1"
              onClick={() => navigate(RouterLink.CLIENT_PRODUCTS)}
              sx={{ color: "#098DEE", cursor: "pointer", fontWeight: "bold" }}
            >
              Xem tất cả
            </Link>
          </Box>
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 3,
                    },
                  }}
                  onClick={() =>
                    navigate(
                      `${RouterLink.CLIENT_PRODUCTS}?product=${product._id}`
                    )
                  }
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.hinh_anh[0]}
                    alt={product.ten}
                    sx={{ objectFit: "contain", p: 2 }}
                  />
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="div">
                        {product.ten}
                      </Typography>
                      <Chip
                        label={product.danh_muc_detail.ten}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {product.mo_ta}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {formatCurrency(product.gia)}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Combo Section */}
      <Box sx={{ py: 8, bgcolor: "#f5f5f5" }}>
        <Container>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#098DEE" }}
            >
              Combo Ưu Đãi
            </Typography>
            <Link
              component="button"
              variant="body1"
              onClick={() => navigate(RouterLink.CLIENT_PRODUCTS)}
              sx={{ color: "#098DEE", cursor: "pointer", fontWeight: "bold" }}
            >
              Xem tất cả
            </Link>
          </Box>
          <Grid container spacing={4}>
            {combos.map((combo) => {
              const totalOriginalPrice = combo.danh_sach_san_pham_detail.reduce(
                (sum, product) => sum + product.gia,
                0
              );
              const discount =
                ((totalOriginalPrice - combo.gia_combo) / totalOriginalPrice) *
                100;

              return (
                <Grid item xs={12} sm={6} md={4} key={combo._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 3,
                      },
                    }}
                    onClick={() =>
                      navigate(
                        `${RouterLink.CLIENT_PRODUCTS}?combo=${combo._id}`
                      )
                    }
                  >
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <Chip
                          label={`Tiết kiệm ${Math.round(discount)}%`}
                          color="error"
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="h6" gutterBottom>
                          {combo.ten}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {combo.mo_ta}
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            Sản phẩm trong combo:
                          </Typography>
                          <Grid container spacing={1}>
                            {combo.danh_sach_san_pham_detail.map((product) => (
                              <Grid item xs={6} key={product._id}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    p: 1,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 1,
                                  }}
                                >
                                  <Box
                                    component="img"
                                    src={product.hinh_anh[0]}
                                    alt={product.ten}
                                    sx={{
                                      width: "100%",
                                      height: 80,
                                      objectFit: "contain",
                                      mb: 1,
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{ textAlign: "center" }}
                                  >
                                    {product.ten}
                                  </Typography>
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textDecoration: "line-through" }}
                          >
                            {formatCurrency(totalOriginalPrice)}
                          </Typography>
                          <Typography variant="h6" color="primary">
                            {formatCurrency(combo.gia_combo)}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        startIcon={<ShoppingCart />}
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(combo);
                        }}
                      >
                        Thêm vào giỏ hàng
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, bgcolor: "#098DEE" }}>
        <Container>
          <Box sx={{ textAlign: "center", color: "white" }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
              Bạn đã sẵn sàng nâng cấp công cụ làm việc?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4 }}>
              Khám phá ngay các sản phẩm và combo ưu đãi
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "white",
                color: "#098DEE",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
              onClick={() => navigate(RouterLink.CLIENT_PRODUCTS)}
            >
              Xem sản phẩm
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
