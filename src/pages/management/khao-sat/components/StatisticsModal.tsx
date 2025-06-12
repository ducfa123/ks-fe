import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Box, Button, Tabs, Tab, CircularProgress, IconButton
} from "@mui/material";
import { Assessment, Close as CloseIcon } from "@mui/icons-material";
import { OverviewChart, UnitChart, RegionChart, QuestionChart, TimeChart } from './charts';
import { GenderChart } from './charts/GenderChart';

interface StatisticsModalProps {
  open: boolean;
  onClose: () => void;
  activeTab: number;
  onTabChange: (tab: number) => void;
  loading: boolean;
  thongKeTongQuan: any;
  thongKeTheoDonVi: any[];
  thongKeTheoVungMien: any[];
  thongKeTheoCauHoi: any[];
  thongKeThoiGian: any[];
  thongKeTheoGioiTinh: any;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({
  open,
  onClose,
  activeTab,
  onTabChange,
  loading,
  thongKeTongQuan,
  thongKeTheoDonVi,
  thongKeTheoVungMien,
  thongKeTheoCauHoi,
  thongKeThoiGian,
  thongKeTheoGioiTinh
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ '& .MuiDialog-paper': { height: '90vh' } }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Assessment sx={{ mr: 1 }} />
          Thống kê khảo sát
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={(e, newValue) => onTabChange(newValue)}>
              <Tab label="Tổng quan" />
              <Tab label="Theo đơn vị" />
              <Tab label="Theo vùng miền" />
              <Tab label="Theo câu hỏi" />
              <Tab label="Theo thời gian" />
              <Tab label="Theo giới tính" />
            </Tabs>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Đang tải dữ liệu thống kê...</Typography>
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              {activeTab === 0 && thongKeTongQuan && (
                <OverviewChart data={thongKeTongQuan} />
              )}
              
              {activeTab === 1 && (
                <UnitChart data={thongKeTheoDonVi} />
              )}
              
              {activeTab === 2 && (
                <RegionChart data={thongKeTheoVungMien} />
              )}
              
              {activeTab === 3 && (
                <QuestionChart data={thongKeTheoCauHoi} />
              )}
              
              {activeTab === 4 && (
                <TimeChart data={thongKeThoiGian} />
              )}

              {activeTab === 5 && (
                <Box>
                  {thongKeTheoGioiTinh && typeof thongKeTheoGioiTinh === 'object' && thongKeTheoGioiTinh.tong_cong !== undefined ? (
                    <GenderChart data={thongKeTheoGioiTinh} />
                  ) : (
                    <Typography>Không có dữ liệu thống kê theo giới tính</Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};
