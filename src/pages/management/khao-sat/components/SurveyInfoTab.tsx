import { Box, Typography, Paper, Grid, Chip, Divider } from "@mui/material";
import { KhaoSatUI } from "../types";

interface SurveyInfoTabProps {
  khaoSat: KhaoSatUI;
}

export const SurveyInfoTab: React.FC<SurveyInfoTabProps> = ({ khaoSat }) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {khaoSat.tieu_de}
        </Typography>
        <Chip 
          label={khaoSat.trang_thai ? "Hoạt động" : "Không hoạt động"} 
          color={khaoSat.trang_thai ? "success" : "error"} 
          size="small"
        />
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="medium">Mô tả</Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mt: 1, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            {khaoSat.mo_ta || "Không có mô tả"}
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Người tạo</Typography>
            <Typography variant="body1" fontWeight="medium">
              {khaoSat.ma_nguoi_tao?.ten_nguoi_dung || "Không xác định"}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Giới hạn phản hồi</Typography>
            <Typography variant="body1" fontWeight="medium">
              {khaoSat.gioi_han_phan_hoi > 0 
                ? `${khaoSat.so_phan_hoi_hien_tai || 0}/${khaoSat.gioi_han_phan_hoi}`
                : "Không giới hạn"}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Thời gian bắt đầu</Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatDate(khaoSat.thoi_gian_bat_dau)}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Thời gian kết thúc</Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatDate(khaoSat.thoi_gian_ket_thuc)}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Cho phép trả lời nhiều lần</Typography>
            <Typography variant="body1" fontWeight="medium">
              {khaoSat.cho_phep_tra_loi_nhieu_lan ? "Có" : "Không"}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Cho phép ẩn danh</Typography>
            <Typography variant="body1" fontWeight="medium">
              {khaoSat.cho_phep_an_danh ? "Có" : "Không"}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Ngày tạo</Typography>
            <Typography variant="body1">
              {formatDate(khaoSat.createdAt)}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Cập nhật lần cuối</Typography>
            <Typography variant="body1">
              {formatDate(khaoSat.updatedAt)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
