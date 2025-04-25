import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
} from "@mui/material";
import { ClientLayout } from "../../../layouts/ClientLayout";

const featuredProducts = [
  {
    id: 1,
    name: "iPhone 13 Pro Max",
    price: 29990000,
    image: "/products/iphone.jpg",
    rating: 4.5,
    category: "Điện thoại",
  },
  {
    id: 2,
    name: "MacBook Pro M1",
    price: 39990000,
    image: "/products/macbook.jpg",
    rating: 4.8,
    category: "Laptop",
  },
  {
    id: 3,
    name: "iPad Pro 2022",
    price: 24990000,
    image: "/products/ipad.jpg",
    rating: 4.6,
    category: "Máy tính bảng",
  },
  {
    id: 4,
    name: "AirPods Pro",
    price: 5990000,
    image: "/products/airpods.jpg",
    rating: 4.7,
    category: "Phụ kiện",
  },
];

const categories = [
  { name: "Điện thoại", image: "/categories/phone.jpg" },
  { name: "Laptop", image: "/categories/laptop.jpg" },
  { name: "Máy tính bảng", image: "/categories/tablet.jpg" },
  { name: "Phụ kiện", image: "/categories/accessories.jpg" },
];

export const ClientHomePage = () => {
  return (
    <ClientLayout>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: "url('/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "500px",
          display: "flex",
          alignItems: "center",
          color: "white",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
          },
        }}
      >
        <Container>
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography variant="h2" gutterBottom>
              Khám phá thế giới công nghệ
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
              Sản phẩm chất lượng với giá cả phải chăng
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mr: 2 }}
            >
              Mua ngay
            </Button>
            <Button variant="outlined" color="inherit" size="large">
              Tìm hiểu thêm
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          Danh mục sản phẩm
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.name}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={category.image}
                  alt={category.name}
                />
                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                  <Typography variant="h6">{category.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products */}
      <Box sx={{ bgcolor: "background.default", py: 8 }}>
        <Container>
          <Typography variant="h4" gutterBottom align="center">
            Sản phẩm nổi bật
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Rating value={product.rating} readOnly sx={{ mb: 1 }} />
                    <Typography variant="h6" color="primary">
                      {product.price.toLocaleString()}đ
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" gutterBottom>
                Giao hàng nhanh chóng
              </Typography>
              <Typography color="text.secondary">
                Giao hàng toàn quốc trong 24h
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" gutterBottom>
                Bảo hành chính hãng
              </Typography>
              <Typography color="text.secondary">
                Bảo hành 12 tháng tại các trung tâm
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" gutterBottom>
                Hỗ trợ 24/7
              </Typography>
              <Typography color="text.secondary">
                Đội ngũ hỗ trợ nhiệt tình
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ClientLayout>
  );
}; 