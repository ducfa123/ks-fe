import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
} from "@mui/material";
import { Search, ShoppingCart } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slices/cartSlice";
import { formatCurrency } from "../../../utils/formatCurrency";
import { mockProducts, mockCombos } from "../../../utils/mock-data";

export interface Product {
  _id: string;
  ten: string;
  ma_san_pham: string;
  hinh_anh: string[];
  mo_ta: string;
  gia: number;
  danh_muc: string;
  danh_muc_detail: {
    _id: string;
    ten: string;
  };
}

export interface Combo {
  _id: string;
  ten: string;
  mo_ta: string;
  danh_sach_san_pham: string[];
  gia_combo: number;
  danh_sach_san_pham_detail: Product[];
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product._id,
        name: product.ten,
        price: product.gia,
        image: product.hinh_anh[0],
        quantity: 1,
      })
    );
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        height="200"
        image={product.hinh_anh[0]}
        alt={product.ten}
        sx={{ objectFit: "contain", p: 1 }}
      />
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div">
            {product.ten}
          </Typography>
          <Chip label={product.danh_muc_detail.ten} size="small" sx={{ mb: 1 }} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {product.mo_ta}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
            {formatCurrency(product.gia)}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          fullWidth
        >
          Thêm vào giỏ
        </Button>
      </CardContent>
    </Card>
  );
};

const ComboCard: React.FC<{ combo: Combo }> = ({ combo }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: combo._id,
        name: combo.ten,
        price: combo.gia_combo,
        image: combo.danh_sach_san_pham_detail[0]?.hinh_anh[0] || "",
        quantity: 1,
        isCombo: true,
        danh_sach_san_pham_detail: combo.danh_sach_san_pham_detail,
      })
    );
  };

  const totalOriginalPrice = combo.danh_sach_san_pham_detail.reduce(
    (sum, product) => sum + product.gia,
    0
  );

  const discount = ((totalOriginalPrice - combo.gia_combo) / totalOriginalPrice) * 100;

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Chip
            label={`Tiết kiệm ${Math.round(discount)}%`}
            color="error"
            size="small"
            sx={{ mb: 1 }}
          />
          <Typography gutterBottom variant="h6" component="div">
            {combo.ten}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {combo.mo_ta}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Sản phẩm trong combo:
            </Typography>
            <Grid container spacing={1}>
              {combo.danh_sach_san_pham_detail.map((product) => (
                <Grid item xs={6} key={product._id}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    p: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1
                  }}>
                    <Box
                      component="img"
                      src={product.hinh_anh[0]}
                      alt={product.ten}
                      sx={{ 
                        width: '100%',
                        height: 80,
                        objectFit: 'contain',
                        mb: 1
                      }}
                    />
                    <Typography variant="body2" sx={{ textAlign: 'center' }}>
                      {product.ten}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
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
          onClick={handleAddToCart}
          fullWidth
        >
          Thêm vào giỏ
        </Button>
      </CardContent>
    </Card>
  );
};

export const ClientProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [categories, setCategories] = useState<string[]>([]);
  const [products] = useState<Product[]>(mockProducts);
  const [combos] = useState<Combo[]>(mockCombos);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Bộ lọc
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Danh mục"
              >
                <MenuItem value="">Tất cả</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography gutterBottom>Khoảng giá</Typography>
            <Slider
              value={priceRange}
              onChange={(_, newValue) => setPriceRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={0}
              max={1000000}
              step={10000}
              valueLabelFormat={(value) => formatCurrency(value)}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Typography variant="h4" component="h1" gutterBottom>
            Combo sản phẩm
          </Typography>
          <Grid container spacing={3}>
            {combos.map((combo) => (
              <Grid item xs={12} sm={6} md={4} key={combo._id}>
                <ComboCard combo={combo} />
              </Grid>
            ))}
          </Grid>

          <Typography variant="h4" component="h1" sx={{ mt: 6, mb: 3 }}>
            Sản phẩm
          </Typography>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};
