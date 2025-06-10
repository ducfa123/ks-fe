import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Treemap } from 'recharts';

interface RegionData {
  _id: string;
  ten_vung_mien: string;
  so_phan_hoi: number;
  ma_vung_mien_cha: string | null;
  cac_vung_mien_con: RegionData[];
}

interface RegionChartProps {
  data: RegionData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#4ECDC4', '#45B7D1'];

export const RegionChart: React.FC<RegionChartProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Flatten hierarchy for charts
  const flattenRegions = (regions: RegionData[], level = 0): Array<{name: string, value: number, level: number, id: string}> => {
    let result: Array<{name: string, value: number, level: number, id: string}> = [];
    
    regions.forEach(region => {
      result.push({
        name: region.ten_vung_mien,
        value: region.so_phan_hoi,
        level,
        id: region._id
      });
      
      if (region.cac_vung_mien_con && region.cac_vung_mien_con.length > 0) {
        result = result.concat(flattenRegions(region.cac_vung_mien_con, level + 1));
      }
    });
    
    return result;
  };

  // Get only top-level regions for summary charts
  const topLevelData = data.map(region => ({
    name: region.ten_vung_mien,
    'Số lượng phản hồi': region.so_phan_hoi,
    'Tổng phản hồi con': region.cac_vung_mien_con.reduce((sum, child) => sum + child.so_phan_hoi, 0)
  }));

  const flatData = flattenRegions(data);
  const pieData = flatData.filter(item => item.value > 0);

  // Render hierarchical table
  const renderRegionHierarchy = (regions: RegionData[], level = 0) => {
    return regions.map((region) => (
      <React.Fragment key={region._id}>
        <TableRow 
          sx={{ 
            '& > *': { borderBottom: level === 0 ? '2px solid rgba(224, 224, 224, 1)' : '1px solid rgba(224, 224, 224, 1)' },
            backgroundColor: level === 0 ? 'rgba(25, 118, 210, 0.04)' : level === 1 ? 'rgba(25, 118, 210, 0.02)' : 'inherit'
          }}
        >
          <TableCell sx={{ pl: 2 + level * 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {region.cac_vung_mien_con && region.cac_vung_mien_con.length > 0 && (
                <Box sx={{ width: 20, height: 20, mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      backgroundColor: level === 0 ? 'primary.main' : level === 1 ? 'secondary.main' : 'grey.500',
                      borderRadius: '50%'
                    }} 
                  />
                </Box>
              )}
              <Box>
                <Typography 
                  variant="body2" 
                  fontWeight={level === 0 ? 'bold' : level === 1 ? 'medium' : 'normal'}
                  sx={{ color: level === 0 ? 'primary.main' : 'inherit' }}
                >
                  {region.ten_vung_mien}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {region._id}
                </Typography>
              </Box>
            </Box>
          </TableCell>
          <TableCell align="center">
            <Typography 
              variant="body2" 
              fontWeight={region.so_phan_hoi > 0 ? 'bold' : 'normal'}
              color={region.so_phan_hoi > 0 ? 'primary.main' : 'text.secondary'}
            >
              {region.so_phan_hoi || 0}
            </Typography>
          </TableCell>
          <TableCell align="center">
            <Chip 
              label={region.so_phan_hoi > 0 ? "Có phản hồi" : "Chưa có phản hồi"}
              color={region.so_phan_hoi > 0 ? "success" : "default"}
              size="small"
              variant={level === 0 ? "filled" : "outlined"}
            />
          </TableCell>
        </TableRow>
        
        {region.cac_vung_mien_con && region.cac_vung_mien_con.length > 0 && 
          renderRegionHierarchy(region.cac_vung_mien_con, level + 1)
        }
      </React.Fragment>
    ));
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Biểu đồ tổng quan" />
          <Tab label="Phân bố chi tiết" />
          <Tab label="Bảng phân cấp" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {/* Bar Chart */}
          <Card sx={{ flex: 1, minWidth: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thống kê theo vùng miền cấp cao
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={topLevelData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Số lượng phản hồi" fill="#8884d8" />
                  <Bar dataKey="Tổng phản hồi con" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      )}

      {activeTab === 1 && pieData.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {/* Pie Chart */}
          <Card sx={{ flex: 1, minWidth: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Phân bố phản hồi theo vùng miền
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Treemap */}
          <Card sx={{ flex: 1, minWidth: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sơ đồ cây phản hồi
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <Treemap
                  data={pieData}
                  dataKey="value"
                  stroke="#fff"
                  fill="#8884d8"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Treemap>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      )}

      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bảng phân cấp vùng miền
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Tên vùng miền</strong></TableCell>
                    <TableCell align="center"><strong>Số phản hồi</strong></TableCell>
                    <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderRegionHierarchy(data)}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
