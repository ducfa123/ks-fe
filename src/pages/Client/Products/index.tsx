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
} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";

const products = [
  {
    id: 1,
    name: "iPhone 13 Pro Max",
    price: 29990000,
    image: "/products/iphone.jpg",
    rating: 4.5,
    category: "Điện thoại",
    brand: "Apple",
  },
  {
    id: 2,
    name: "MacBook Pro M1",
    price: 39990000,
    image: "/products/macbook.jpg",
    rating: 4.8,
    category: "Laptop",
    brand: "Apple",
  },
  {
    id: 3,
    name: "iPad Pro 2022",
    price: 24990000,
    image: "/products/ipad.jpg",
    rating: 4.6,
    category: "Máy tính bảng",
    brand: "Apple",
  },
  {
    id: 4,
    name: "AirPods Pro",
    price: 5990000,
    image: "/products/airpods.jpg",
    rating: 4.7,
    category: "Phụ kiện",
    brand: "Apple",
  },
  {
    id: 5,
    name: "Samsung Galaxy S22",
    price: 22990000,
    image: "/products/samsung.jpg",
    rating: 4.4,
    category: "Điện thoại",
    brand: "Samsung",
  },
  {
    id: 6,
    name: "Dell XPS 13",
    price: 34990000,
    image: "/products/dell.jpg",
    rating: 4.7,
    category: "Laptop",
    brand: "Dell",
  },
  {
    id: 7,
    name: "Samsung Galaxy Tab S8",
    price: 19990000,
    image: "/products/samsung-tab.jpg",
    rating: 4.5,
    category: "Máy tính bảng",
    brand: "Samsung",
  },
  {
    id: 8,
    name: "Sony WH-1000XM4",
    price: 6990000,
    image: "/products/sony.jpg",
    rating: 4.8,
    category: "Phụ kiện",
    brand: "Sony",
  },
];

const categories = ["Điện thoại", "Laptop", "Máy tính bảng", "Phụ kiện"];
const brands = ["Apple", "Samsung", "Dell", "Sony"];

export const ClientProductsPage = () => {
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
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  return (
    <Container sx={{ py: 4 }}>
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
                      {product.price.toLocaleString()}đ
                    </Typography>
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