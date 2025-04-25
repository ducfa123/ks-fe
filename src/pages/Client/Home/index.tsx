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
  Link,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RouterLink } from "../../../routers/routers";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slices/cartSlice";
import { ShoppingCart } from "@mui/icons-material";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  rating: number;
  category: string;
}

interface Combo {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  products: string[];
  discount: number;
}

const featuredProducts: Product[] = [
  {
    id: 1,
    name: "iPhone 13 Pro Max",
    price: "29.990.000đ",
    image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.8,
    category: "Điện thoại",
  },
  {
    id: 2,
    name: "MacBook Pro M1",
    price: "39.990.000đ",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.9,
    category: "Laptop",
  },
  {
    id: 3,
    name: "AirPods Pro",
    price: "6.990.000đ",
    image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.7,
    category: "Phụ kiện",
  },
  {
    id: 4,
    name: "Apple Watch Series 7",
    price: "12.990.000đ",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.6,
    category: "Đồng hồ",
  },
];

const combos: Combo[] = [
  {
    id: 1,
    name: "Combo Apple Premium",
    price: "45.990.000đ",
    originalPrice: "52.970.000đ",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    products: ["iPhone 13 Pro Max", "AirPods Pro"],
    discount: 15,
  },
  {
    id: 2,
    name: "Combo Làm Việc Chuyên Nghiệp",
    price: "65.990.000đ",
    originalPrice: "74.980.000đ",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    products: ["MacBook Pro M1", "Apple Watch Series 7"],
    discount: 12,
  },
];

export const ClientHomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      id: product.id.toString(),
      name: product.name,
      price: parseInt(product.price.replace(/[^\d]/g, '')),
      image: product.image,
      quantity: 1
    }));
  };

  return (
    <>
      <Box
        sx={{
          background: "linear-gradient(135deg, #098DEE 0%, #63B3ED 100%)",
          py: 15,
          color: "white",
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" sx={{ mb: 2, fontWeight: "bold" }}>
                Chào mừng đến với IntX shop
              </Typography>
              <Typography variant="h5" sx={{ mb: 4 }}>
                Nơi cung cấp các sản phẩm công nghệ chất lượng cao với giá cả phải chăng
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{ 
                  bgcolor: "#098DEE", 
                  "&:hover": { bgcolor: "#2B6CB0" },
                  px: 4,
                  py: 1.5,
                  borderRadius: 2
                }}
                onClick={() => navigate(RouterLink.CLIENT_PRODUCTS)}
              >
                Mua sắm ngay
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Hero"
                sx={{ width: "100%", borderRadius: 2, boxShadow: 3 }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: "#f5f5f5" }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ mb: 2, color: "#098DEE" }}>
                  Giao hàng nhanh
                </Typography>
                <Typography>
                  Giao hàng toàn quốc trong 24h với đơn hàng trên 1 triệu đồng
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ mb: 2, color: "#098DEE" }}>
                  Bảo hành dài hạn
                </Typography>
                <Typography>
                  Bảo hành 12 tháng cho tất cả sản phẩm chính hãng
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ mb: 2, color: "#098DEE" }}>
                  Hỗ trợ 24/7
                </Typography>
                <Typography>
                  Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Box sx={{ py: 8 }}>
        <Container>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#098DEE" }}>
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
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
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
                  onClick={() => navigate(`${RouterLink.CLIENT_PRODUCTS}/${product.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: "contain", p: 2 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {product.category}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Rating value={product.rating} precision={0.1} readOnly />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({product.rating})
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary">
                      {product.price}
                    </Typography>
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
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#098DEE" }}>
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
            {combos.map((combo) => (
              <Grid item xs={12} sm={6} md={4} key={combo.id}>
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
                  onClick={() => navigate(`${RouterLink.CLIENT_PRODUCTS}?combo=${combo.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={combo.image}
                    alt={combo.name}
                    sx={{ objectFit: "contain", p: 2 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Chip
                      label={`Giảm ${combo.discount}%`}
                      color="error"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {combo.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {combo.products.join(" + ")}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="h6" color="primary">
                        {combo.price}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ textDecoration: "line-through", color: "text.secondary" }}
                      >
                        {combo.originalPrice}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart({
                          id: combo.id,
                          name: combo.name,
                          price: combo.price,
                          image: combo.image,
                          rating: 5,
                          category: "Combo"
                        });
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

      {/* CTA Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          py: 8,
        }}
      >
        <Container>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "#098DEE" }}>
              Bạn đã sẵn sàng mua sắm?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4 }}>
              Khám phá ngay bộ sưu tập sản phẩm mới nhất của chúng tôi
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{ 
                bgcolor: "#098DEE", 
                "&:hover": { bgcolor: "#2B6CB0" },
                px: 4,
                py: 1.5,
                borderRadius: 2
              }}
              onClick={() => navigate(RouterLink.CLIENT_PRODUCTS)}
            >
              Xem tất cả sản phẩm
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};
