import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Tabs, Tab, Box, Typography, Grid, Card, CardContent,
  TextField, Paper, IconButton, TableContainer, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, Divider
} from "@mui/material";
import { ChevronRight, ExpandLess, Delete } from "@mui/icons-material";

interface VungMienTreeItemProps {
  vungMien: any;
  level: number;
  onSelect: (vm: any) => void;
  selected: boolean;
}

interface DonViTreeItemProps {
  donVi: any;
  level: number;
  onSelect: (dv: any) => void;
  selected: boolean;
}

interface LimitConfigModalProps {
  open: boolean;
  onClose: () => void;
  activeTab: number;
  onTabChange: (tab: number) => void;
  // Region limits
  danhSachGioiHanVungMien: any[];
  vungMienHierarchy: any[];
  selectedVungMien: any;
  showVungMienSelector: boolean;
  formGioiHanVungMien: {
    ma_vung_mien: string;
    so_luong_phan_hoi_toi_da: number;
  };
  onVungMienSelect: (vm: any) => void;
  onToggleVungMienSelector: () => void;
  onFormGioiHanVungMienChange: (form: any) => void;
  onAddGioiHanVungMien: () => void;
  onDeleteGioiHanVungMien: (id: string, name: string) => void;
  // Unit limits
  danhSachGioiHanDonVi: any[];
  donViHierarchy: any[];
  selectedDonVi: any;
  showDonViSelector: boolean;
  formGioiHanDonVi: {
    ma_don_vi: string;
    so_luong_phan_hoi_toi_da: number;
  };
  onDonViSelect: (dv: any) => void;
  onToggleDonViSelector: () => void;
  onFormGioiHanDonViChange: (form: any) => void;
  onAddGioiHanDonVi: () => void;
  onDeleteGioiHanDonVi: (id: string, name: string) => void;
}

const VungMienTreeItem: React.FC<VungMienTreeItemProps> = ({ vungMien, level, onSelect, selected }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = vungMien.children && vungMien.children.length > 0;
  
  const getVungMienPath = (vm: any) => {
    const path = [vm.ten_vung_mien];
    let current = vm;
    while (current.ma_vung_mien_cha) {
      path.unshift(current.ma_vung_mien_cha.ten_vung_mien);
      current = current.ma_vung_mien_cha;
    }
    return path.join(' > ');
  };
  
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          pl: 2 + level * 2,
          cursor: 'pointer',
          backgroundColor: selected ? 'primary.light' : 'transparent',
          color: selected ? 'white' : 'inherit',
          '&:hover': {
            backgroundColor: selected ? 'primary.main' : 'grey.100'
          },
          borderRadius: 1,
          mb: 0.5
        }}
        onClick={() => onSelect(vungMien)}
      >
        {hasChildren && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            sx={{ mr: 1, color: 'inherit' }}
          >
            {expanded ? <ExpandLess /> : <ChevronRight />}
          </IconButton>
        )}
        {!hasChildren && <Box sx={{ width: 40 }} />}
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" fontWeight={level === 0 ? 'bold' : 'normal'}>
            {vungMien.ten_vung_mien}
          </Typography>
          {level > 0 && (
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {getVungMienPath(vungMien)}
            </Typography>
          )}
        </Box>
      </Box>
      
      {hasChildren && expanded && (
        <Box>
          {vungMien.children.map((child: any) => (
            <VungMienTreeItem 
              key={child._id} 
              vungMien={child} 
              level={level + 1}
              onSelect={onSelect}
              selected={selected}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

const DonViTreeItem: React.FC<DonViTreeItemProps> = ({ donVi, level, onSelect, selected }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = donVi.children && donVi.children.length > 0;
  
  const getDonViPath = (dv: any) => {
    const path = [dv.ten_don_vi];
    let current = dv;
    while (current.ma_don_vi_cha) {
      path.unshift(current.ma_don_vi_cha.ten_don_vi);
      current = current.ma_don_vi_cha;
    }
    return path.join(' > ');
  };
  
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          pl: 2 + level * 2,
          cursor: 'pointer',
          backgroundColor: selected ? 'primary.light' : 'transparent',
          color: selected ? 'white' : 'inherit',
          '&:hover': {
            backgroundColor: selected ? 'primary.main' : 'grey.100'
          },
          borderRadius: 1,
          mb: 0.5
        }}
        onClick={() => onSelect(donVi)}
      >
        {hasChildren && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            sx={{ mr: 1, color: 'inherit' }}
          >
            {expanded ? <ExpandLess /> : <ChevronRight />}
          </IconButton>
        )}
        {!hasChildren && <Box sx={{ width: 40 }} />}
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" fontWeight={level === 0 ? 'bold' : 'normal'}>
            {donVi.ten_don_vi}
          </Typography>
          {level > 0 && (
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {getDonViPath(donVi)}
            </Typography>
          )}
        </Box>
      </Box>
      
      {hasChildren && expanded && (
        <Box>
          {donVi.children.map((child: any) => (
            <DonViTreeItem 
              key={child._id} 
              donVi={child} 
              level={level + 1}
              onSelect={onSelect}
              selected={selected}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export const LimitConfigModal: React.FC<LimitConfigModalProps> = ({
  open,
  onClose,
  activeTab,
  onTabChange,
  // Region limits
  danhSachGioiHanVungMien,
  vungMienHierarchy,
  selectedVungMien,
  showVungMienSelector,
  formGioiHanVungMien,
  onVungMienSelect,
  onToggleVungMienSelector,
  onFormGioiHanVungMienChange,
  onAddGioiHanVungMien,
  onDeleteGioiHanVungMien,
  // Unit limits
  danhSachGioiHanDonVi,
  donViHierarchy,
  selectedDonVi,
  showDonViSelector,
  formGioiHanDonVi,
  onDonViSelect,
  onToggleDonViSelector,
  onFormGioiHanDonViChange,
  onAddGioiHanDonVi,
  onDeleteGioiHanDonVi
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Cấu hình giới hạn</DialogTitle>
      <DialogContent>
        <Tabs value={activeTab} onChange={(_, newValue) => onTabChange(newValue)} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tab label="Giới hạn theo vùng miền" />
          <Tab label="Giới hạn theo đơn vị" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Thêm giới hạn vùng miền mới</Typography>
              <Grid container spacing={2} alignItems="flex-start">
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Vùng miền</Typography>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      minHeight: 56,
                      display: 'flex',
                      alignItems: 'center',
                      px: 2,
                      backgroundColor: showVungMienSelector ? 'action.selected' : 'inherit'
                    }}
                    onClick={onToggleVungMienSelector}
                  >
                    <CardContent sx={{ p: '8px !important', flexGrow: 1 }}>
                      {selectedVungMien ? (
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {selectedVungMien.ten_vung_mien}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {(() => {
                              const path = [selectedVungMien.ten_vung_mien];
                              let current = selectedVungMien;
                              while (current.ma_vung_mien_cha) {
                                path.unshift(current.ma_vung_mien_cha.ten_vung_mien);
                                current = current.ma_vung_mien_cha;
                              }
                              return path.join(' > ');
                            })()}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Chọn vùng miền...
                        </Typography>
                      )}
                    </CardContent>
                    <IconButton size="small">
                      {showVungMienSelector ? <ExpandLess /> : <ChevronRight />}
                    </IconButton>
                  </Card>
                  
                  {showVungMienSelector && (
                    <Paper variant="outlined" sx={{ mt: 1, maxHeight: 300, overflow: 'auto', p: 1 }}>
                      {vungMienHierarchy.length > 0 ? (
                        vungMienHierarchy.map((vungMien) => (
                          <VungMienTreeItem 
                            key={vungMien._id} 
                            vungMien={vungMien} 
                            level={0}
                            onSelect={onVungMienSelect}
                            selected={selectedVungMien?._id === vungMien._id}
                          />
                        ))
                      ) : (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Đang tải dữ liệu vùng miền...
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  )}
                </Grid>
                
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Số lượng phản hồi tối đa</Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={formGioiHanVungMien.so_luong_phan_hoi_toi_da}
                    onChange={(e) => onFormGioiHanVungMienChange({
                      ...formGioiHanVungMien, 
                      so_luong_phan_hoi_toi_da: parseInt(e.target.value) || 0
                    })}
                    inputProps={{ min: 1 }}
                    helperText="Số lượng phản hồi tối đa cho vùng miền này"
                  />
                </Grid>
                
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0 }}>Action</Typography>
                  <Button
                    variant="contained"
                    onClick={onAddGioiHanVungMien}
                    disabled={!formGioiHanVungMien.ma_vung_mien || formGioiHanVungMien.so_luong_phan_hoi_toi_da <= 0}
                    fullWidth
                    sx={{ height: 56 }}
                  >
                    Thêm giới hạn
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Danh sách giới hạn vùng miền
              {danhSachGioiHanVungMien.length > 0 && (
                <Chip label={`${danhSachGioiHanVungMien.length} vùng miền`} size="small" color="primary" sx={{ ml: 1 }} />
              )}
            </Typography>
            
            {danhSachGioiHanVungMien.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <Typography variant="body1" sx={{ mb: 2 }}>Chưa có giới hạn vùng miền nào</Typography>
                <Typography variant="body2">Thêm giới hạn để kiểm soát số lượng phản hồi theo từng vùng miền</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width="10%">STT</TableCell>
                      <TableCell width="50%">Vùng miền</TableCell>
                      <TableCell align="center" width="30%">Giới hạn phản hồi</TableCell>
                      <TableCell align="center" width="10%">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {danhSachGioiHanVungMien.map((gioiHan, index) => {
                      const vungMien = gioiHan.ma_vung_mien;
                      return (
                        <TableRow key={gioiHan._id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {vungMien?.ten_vung_mien || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {vungMien?._id || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight="bold">
                              {gioiHan.so_luong_phan_hoi_toi_da} phản hồi
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => onDeleteGioiHanVungMien(gioiHan._id, vungMien?.ten_vung_mien || 'N/A')}
                              title={`Xóa giới hạn cho ${vungMien?.ten_vung_mien}`}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Thêm giới hạn đơn vị mới</Typography>
              <Grid container spacing={2} alignItems="flex-start">
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Đơn vị</Typography>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer',
                      minHeight: 56,
                      display: 'flex',
                      alignItems: 'center',
                      px: 2,
                      backgroundColor: showDonViSelector ? 'action.selected' : 'inherit'
                    }}
                    onClick={onToggleDonViSelector}
                  >
                    <CardContent sx={{ p: '8px !important', flexGrow: 1 }}>
                      {selectedDonVi ? (
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {selectedDonVi.ten_don_vi}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {(() => {
                              const path = [selectedDonVi.ten_don_vi];
                              let current = selectedDonVi;
                              while (current.ma_don_vi_cha) {
                                path.unshift(current.ma_don_vi_cha.ten_don_vi);
                                current = current.ma_don_vi_cha;
                              }
                              return path.join(' > ');
                            })()}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Chọn đơn vị...
                        </Typography>
                      )}
                    </CardContent>
                    <IconButton size="small">
                      {showDonViSelector ? <ExpandLess /> : <ChevronRight />}
                    </IconButton>
                  </Card>
                  
                  {showDonViSelector && (
                    <Paper variant="outlined" sx={{ mt: 1, maxHeight: 300, overflow: 'auto', p: 1 }}>
                      {donViHierarchy.length > 0 ? (
                        donViHierarchy.map((donVi) => (
                          <DonViTreeItem 
                            key={donVi._id} 
                            donVi={donVi} 
                            level={0}
                            onSelect={onDonViSelect}
                            selected={selectedDonVi?._id === donVi._id}
                          />
                        ))
                      ) : (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Đang tải dữ liệu đơn vị...
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  )}
                </Grid>
                
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Số lượng phản hồi tối đa</Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={formGioiHanDonVi.so_luong_phan_hoi_toi_da}
                    onChange={(e) => onFormGioiHanDonViChange({
                      ...formGioiHanDonVi, 
                      so_luong_phan_hoi_toi_da: parseInt(e.target.value) || 0
                    })}
                    inputProps={{ min: 1 }}
                    helperText="Số lượng phản hồi tối đa cho đơn vị này"
                  />
                </Grid>
                
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0 }}>Action</Typography>
                  <Button
                    variant="contained"
                    onClick={onAddGioiHanDonVi}
                    disabled={!formGioiHanDonVi.ma_don_vi || formGioiHanDonVi.so_luong_phan_hoi_toi_da <= 0}
                    fullWidth
                    sx={{ height: 56 }}
                  >
                    Thêm giới hạn
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Danh sách giới hạn đơn vị
              {danhSachGioiHanDonVi.length > 0 && (
                <Chip label={`${danhSachGioiHanDonVi.length} đơn vị`} size="small" color="primary" sx={{ ml: 1 }} />
              )}
            </Typography>
            
            {danhSachGioiHanDonVi.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <Typography variant="body1" sx={{ mb: 2 }}>Chưa có giới hạn đơn vị nào</Typography>
                <Typography variant="body2">Thêm giới hạn để kiểm soát số lượng phản hồi theo từng đơn vị</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width="10%">STT</TableCell>
                      <TableCell width="50%">Đơn vị</TableCell>
                      <TableCell align="center" width="30%">Giới hạn phản hồi</TableCell>
                      <TableCell align="center" width="10%">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {danhSachGioiHanDonVi.map((gioiHan, index) => {
                      const donVi = gioiHan.ma_don_vi;
                      return (
                        <TableRow key={gioiHan._id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {donVi?.ten_don_vi || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {donVi?._id || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight="bold">
                              {gioiHan.so_luong_phan_hoi_toi_da} phản hồi
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => onDeleteGioiHanDonVi(gioiHan._id, donVi?.ten_don_vi || 'N/A')}
                              title={`Xóa giới hạn cho ${donVi?.ten_don_vi}`}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};
