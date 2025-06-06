import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, CardActions, 
  Button, Pagination, CircularProgress, Chip, 
  Container, TextField, InputAdornment, Paper
} from '@mui/material';
import { 
  AccessTime as AccessTimeIcon, 
  Search as SearchIcon, 
  ArrowForward as ArrowForwardIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { APIServices } from '../../../utils';
import { KhaoSatUI } from '../../management/khao-sat/types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNotifier } from '../../../provider/NotificationProvider';

interface PaginationInfo {
  page: number;
  size: number;
  total: number;
  offset: number;
}

export const KhaoSatPage: React.FC = () => {
  const [khaoSats, setKhaoSats] = useState<KhaoSatUI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [keyword, setKeyword] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    size: 10,
    total: 0,
    offset: 0
  });
  const navigate = useNavigate();
  const { error } = useNotifier();

  const loadKhaoSats = async (page = 1, searchTerm = '') => {
    try {
      setLoading(true);
      const response = await APIServices.KhaoSatService.getListEntity(page, pagination.size, searchTerm);
      
      console.log("Raw API Response:", response);
      
      if (response && response.status === "Success") {
        // Log the data structure to help diagnose the issue
        console.log("Response data structure:", response.data);
        
        // Check if response.data is directly an array (old format)
        if (Array.isArray(response.data)) {
          console.log("Response uses old format (direct array)");
          setKhaoSats(response.data);
          setPagination({
            ...pagination,
            page: page,
            total: response.data.length
          });
        } 
        // Check if response.data has danh_sach_khao_sat property (new format)
        else if (response.data && response.data.danh_sach_khao_sat && Array.isArray(response.data.danh_sach_khao_sat)) {
          console.log("Response uses new format (nested structure)");
          setKhaoSats(response.data.danh_sach_khao_sat);
          
          if (response.data.pagination) {
            setPagination(response.data.pagination);
          } else {
            setPagination({
              page: page,
              size: pagination.size,
              total: response.data.danh_sach_khao_sat.length,
              offset: 0
            });
          }
        } 
        // If none of the expected formats match
        else {
          console.error("Unrecognized data structure:", response.data);
          error("Định dạng dữ liệu không hợp lệ");
          setKhaoSats([]);
        }
      } else {
        console.error("Failed to load surveys:", response);
        error("Không thể tải danh sách khảo sát");
        setKhaoSats([]);
      }
    } catch (err) {
      console.error("Error loading surveys:", err);
      error("Đã xảy ra lỗi khi tải danh sách khảo sát");
      setKhaoSats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKhaoSats(pagination.page, keyword);
  }, []);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    loadKhaoSats(page, keyword);
  };

  const handleSearch = () => {
    loadKhaoSats(1, keyword);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const isActiveKhaoSat = (khaoSat: KhaoSatUI): boolean => {
    if (!khaoSat.trang_thai) return false;
    
    const now = new Date();
    const startDate = new Date(khaoSat.thoi_gian_bat_dau);
    const endDate = new Date(khaoSat.thoi_gian_ket_thuc);
    
    return now >= startDate && now <= endDate;
  };

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" fontWeight="bold" sx={{ mb: 3 }}>
          Danh sách khảo sát
        </Typography>
        
        <Box sx={{ mb: 3, display: 'flex' }}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm khảo sát..."
            variant="outlined"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{ maxWidth: 500, mr: 2 }}
          />
          <Button 
            variant="contained" 
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </Box>
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : khaoSats.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">
            Không tìm thấy khảo sát nào
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {khaoSats.map((khaoSat) => (
              <Grid item xs={12} sm={6} md={4} key={khaoSat._id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                    },
                    opacity: isActiveKhaoSat(khaoSat) ? 1 : 0.7
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {khaoSat.tieu_de}
                      </Typography>
                      <Chip 
                        label={isActiveKhaoSat(khaoSat) ? "Đang mở" : "Đã đóng"}
                        color={isActiveKhaoSat(khaoSat) ? "success" : "default"}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                      {khaoSat.mo_ta?.length > 100 
                        ? `${khaoSat.mo_ta.substring(0, 100)}...` 
                        : khaoSat.mo_ta}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Bắt đầu: {formatDate(khaoSat.thoi_gian_bat_dau)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Kết thúc: {formatDate(khaoSat.thoi_gian_ket_thuc)}
                      </Typography>
                    </Box>
                    
                    {khaoSat.ma_nguoi_tao && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Người tạo: {khaoSat.ma_nguoi_tao.ten_nguoi_dung}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button 
                      variant="contained" 
                      size="medium" 
                      endIcon={<ArrowForwardIcon />}
                      disabled={!isActiveKhaoSat(khaoSat)}
                      onClick={() => navigate(`/khao-sat/${khaoSat._id}`)}
                      fullWidth
                      sx={{
                        borderRadius: 1,
                        py: 1
                      }}
                    >
                      Tham gia khảo sát
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {pagination.total > pagination.size && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={Math.ceil(pagination.total / pagination.size)} 
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton 
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};
