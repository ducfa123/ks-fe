import React, { useState, useEffect, useCallback } from "react";
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
  IconButton,
} from "@mui/material";
import { Search, ShoppingCart, Clear } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slices/cartSlice";
import { formatCurrency } from "../../../utils/formatCurrency";
import { ClientService } from "../../../utils/apis/client";
import { debounce } from "lodash";

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
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
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

  const discount =
    ((totalOriginalPrice - combo.gia_combo) / totalOriginalPrice) * 100;

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
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
                    <Typography variant="body2" sx={{ textAlign: "center" }}>
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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);
  const [productPage, setProductPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchProducts = async (
    page: number,
    limit: number,
    keyword?: string
  ) => {
    try {
      const productsData = await ClientService.getListProducts(
        page,
        limit,
        keyword
      );
      if (page === 1) {
        setProducts(productsData?.items || []);
      } else {
        setProducts((prev) => [...prev, ...(productsData?.items || [])]);
      }
      setHasMoreProducts((productsData?.items?.length || 0) === limit);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(productsData?.items?.map((p) => p.danh_muc_detail.ten) || [])
      ) as string[];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCombos = async (page: number, limit: number) => {
    try {
      const combosData = await ClientService.getListCombos(page, limit);
      setCombos(combosData?.items || []);
    } catch (error) {
      console.error("Error fetching combos:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchProducts(1, 6), fetchCombos(1, 6)]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setLoading(true);
      setProductPage(1);
      fetchProducts(1, 6, value).finally(() => setLoading(false));
    }, 500),
    []
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const loadMoreProducts = async () => {
    if (loadingMore || !hasMoreProducts) return;

    setLoadingMore(true);
    try {
      const nextPage = productPage + 1;
      await fetchProducts(nextPage, 6, searchTerm);
      setProductPage(nextPage);
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.ten
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.danh_muc_detail.ten === selectedCategory;
    const matchesPrice =
      product.gia >= priceRange[0] && product.gia <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const filteredCombos = combos.filter((combo) => {
    const matchesSearch = combo.ten
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPrice =
      combo.gia_combo >= priceRange[0] && combo.gia_combo <= priceRange[1];
    return matchesSearch && matchesPrice;
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton 
                  onClick={() => handleSearch("")}
                  size="small"
                >
                  <Clear />
                </IconButton>
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
              onChange={(_, newValue) =>
                setPriceRange(newValue as [number, number])
              }
              valueLabelDisplay="auto"
              min={0}
              max={10000000}
              valueLabelFormat={(value) => formatCurrency(value)}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          {/* Products Section */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
              Sản Phẩm
            </Typography>
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
            {hasMoreProducts && filteredProducts.length > 0 && (
              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Button
                  variant="outlined"
                  onClick={loadMoreProducts}
                  disabled={loadingMore}
                  sx={{ minWidth: 200 }}
                >
                  {loadingMore ? "Đang tải..." : "Xem thêm sản phẩm"}
                </Button>
              </Box>
            )}
          </Box>

          {/* Combo Section */}
          {filteredCombos.length > 0 && (
            <Box>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
                Combo Ưu Đãi
              </Typography>
              <Grid container spacing={3}>
                {filteredCombos.map((combo) => (
                  <Grid item xs={12} sm={6} md={4} key={combo._id}>
                    <ComboCard combo={combo} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
