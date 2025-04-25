import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Slider,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
} from "@mui/material";
import { Search, FilterList, ShoppingCart } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slices/cartSlice";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  rating: number;
  category: string;
  brand: string;
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

const products: Product[] = [
  {
    id: 1,
    name: "iPhone 13 Pro Max",
    price: "29.990.000đ",
    image:
      "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.8,
    category: "Điện thoại",
    brand: "Apple",
  },
  {
    id: 2,
    name: "MacBook Pro M1",
    price: "39.990.000đ",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.9,
    category: "Laptop",
    brand: "Apple",
  },
  {
    id: 3,
    name: "AirPods Pro",
    price: "6.990.000đ",
    image:
      "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.7,
    category: "Phụ kiện",
    brand: "Apple",
  },
  {
    id: 4,
    name: "Apple Watch Series 7",
    price: "12.990.000đ",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.6,
    category: "Đồng hồ",
    brand: "Apple",
  },
  {
    id: 5,
    name: "Samsung Galaxy S21 Ultra",
    price: "24.990.000đ",
    image:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.7,
    category: "Điện thoại",
    brand: "Samsung",
  },
  {
    id: 6,
    name: "Dell XPS 13",
    price: "34.990.000đ",
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.8,
    category: "Laptop",
    brand: "Dell",
  },
  {
    id: 7,
    name: "Sony WH-1000XM4",
    price: "8.990.000đ",
    image:
      "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.9,
    category: "Phụ kiện",
    brand: "Sony",
  },
  {
    id: 8,
    name: "Garmin Fenix 6",
    price: "15.990.000đ",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.5,
    category: "Đồng hồ",
    brand: "Garmin",
  },
];

const combos: Combo[] = [
  {
    id: 1,
    name: "Combo Apple Premium",
    price: "45.990.000đ",
    originalPrice: "52.970.000đ",
    image:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    products: ["iPhone 13 Pro Max", "AirPods Pro"],
    discount: 15,
  },
  {
    id: 2,
    name: "Combo Làm Việc Chuyên Nghiệp",
    price: "65.990.000đ",
    originalPrice: "74.980.000đ",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    products: ["MacBook Pro M1", "Apple Watch Series 7"],
    discount: 12,
  },
  {
    id: 3,
    name: "Combo Giải Trí Cao Cấp",
    price: "35.990.000đ",
    originalPrice: "42.980.000đ",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    products: ["Samsung Galaxy S21 Ultra", "Sony WH-1000XM4"],
    discount: 16,
  },
];

const categories = ["Điện thoại", "Laptop", "Máy tính bảng", "Phụ kiện"];
const brands = ["Apple", "Samsung", "Dell", "Sony"];

export const ClientProductsPage = () => {
  const dispatch = useDispatch();
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleAddToCart = (product: Product) => {
    dispatch(
      addToCart({
        id: product.id.toString(),
        name: product.name,
        price: parseInt(product.price.replace(/[^\d]/g, "")),
        image: product.image,
        quantity: 1,
      })
    );
  };

  return (
    <Container sx={{ py: 4 }}>
      {/* Combo Section */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h4"
          sx={{ mb: 4, fontWeight: "bold", color: "#098DEE" }}
        >
          Combo Ưu Đãi
        </Typography>
        <Grid container spacing={3}>
          {combos.map((combo) => (
            <Grid item xs={12} sm={6} md={4} key={combo.id}>
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
                  image={combo.image}
                  alt={combo.name}
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {combo.products.join(" + ")}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h6" color="primary">
                      {combo.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                      }}
                    >
                      {combo.originalPrice}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() =>
                      handleAddToCart({
                        id: combo.id,
                        name: combo.name,
                        price: combo.price,
                        image: combo.image,
                        rating: 5,
                        category: "Combo",
                        brand: "Combo",
                      })
                    }
                  >
                    Thêm vào giỏ hàng
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Box sx={{ position: "sticky", top: 20 }}>
            <Typography variant="h6" gutterBottom>
              <FilterList sx={{ mr: 1 }} />
              Bộ lọc
            </Typography>

            {/* Price Range */}
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Khoảng giá</Typography>
              <Slider
                value={priceRange}
                onChange={(_, newValue) => setPriceRange(newValue as number[])}
                valueLabelDisplay="auto"
                min={0}
                max={50000000}
                valueLabelFormat={(value) => `${value.toLocaleString()}đ`}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">
                  {priceRange[0].toLocaleString()}đ
                </Typography>
                <Typography variant="body2">
                  {priceRange[1].toLocaleString()}đ
                </Typography>
              </Box>
            </Box>

            {/* Categories */}
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Danh mục</Typography>
              <FormGroup>
                {categories.map((category) => (
                  <FormControlLabel
                    key={category}
                    control={
                      <Checkbox
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                      />
                    }
                    label={category}
                  />
                ))}
              </FormGroup>
            </Box>

            {/* Brands */}
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Thương hiệu</Typography>
              <FormGroup>
                {brands.map((brand) => (
                  <FormControlLabel
                    key={brand}
                    control={
                      <Checkbox
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                      />
                    }
                    label={brand}
                  />
                ))}
              </FormGroup>
            </Box>
          </Box>
        </Grid>

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm sản phẩm..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Sắp xếp theo</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sắp xếp theo"
                    onChange={(e) => setSortBy(e.target.value as string)}
                  >
                    <MenuItem value="newest">Mới nhất</MenuItem>
                    <MenuItem value="price-asc">Giá tăng dần</MenuItem>
                    <MenuItem value="price-desc">Giá giảm dần</MenuItem>
                    <MenuItem value="rating">Đánh giá cao nhất</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
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
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {product.brand}
                    </Typography>
                    <Rating value={product.rating} readOnly sx={{ mb: 1 }} />
                    <Typography variant="h6" color="primary">
                      {product.price}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => handleAddToCart(product)}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination count={5} color="primary" />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
