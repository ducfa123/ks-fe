import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Treemap } from 'recharts';

interface UnitData {
  _id: string;
  ten_don_vi: string;
  so_phan_hoi: number;
  ma_don_vi_cha: string | null;
  cac_don_vi_con: UnitData[];
}

interface UnitChartProps {
  data: UnitData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#4ECDC4', '#45B7D1'];

export const UnitChart: React.FC<UnitChartProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Flatten hierarchy for charts
  const flattenUnits = (units: UnitData[], level = 0): Array<{name: string, value: number, level: number, id: string}> => {
    let result: Array<{name: string, value: number, level: number, id: string}> = [];
    
    units.forEach(unit => {
      result.push({
        name: unit.ten_don_vi,
        value: unit.so_phan_hoi,
        level,
        id: unit._id
      });
      
      if (unit.cac_don_vi_con && unit.cac_don_vi_con.length > 0) {
        result = result.concat(flattenUnits(unit.cac_don_vi_con, level + 1));
      }
    });
    
    return result;
  };

  // Get only top-level units for summary charts
  const topLevelData = data.map(unit => ({
    name: unit.ten_don_vi,
    'Số lượng phản hồi': unit.so_phan_hoi,
    'Tổng phản hồi con': unit.cac_don_vi_con.reduce((sum, child) => sum + child.so_phan_hoi, 0)
  }));

  const flatData = flattenUnits(data);
  const pieData = flatData.filter(item => item.value > 0);

  // Render hierarchical table
  const renderUnitHierarchy = (units: UnitData[], level = 0) => {
    return units.map((unit) => (
      <React.Fragment key={unit._id}>
        <TableRow 
          sx={{ 
            '& > *': { borderBottom: level === 0 ? '2px solid rgba(224, 224, 224, 1)' : '1px solid rgba(224, 224, 224, 1)' },
            backgroundColor: level === 0 ? 'rgba(25, 118, 210, 0.04)' : level === 1 ? 'rgba(25, 118, 210, 0.02)' : 'inherit'
          }}
        >
          <TableCell sx={{ pl: 2 + level * 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {unit.cac_don_vi_con && unit.cac_don_vi_con.length > 0 && (
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
                  {unit.ten_don_vi}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {unit._id}
                </Typography>
              </Box>
            </Box>
          </TableCell>
          <TableCell align="center">
            <Typography 
              variant="body2" 
              fontWeight={unit.so_phan_hoi > 0 ? 'bold' : 'normal'}
              color={unit.so_phan_hoi > 0 ? 'primary.main' : 'text.secondary'}
            >
              {unit.so_phan_hoi || 0}
            </Typography>
          </TableCell>
          <TableCell align="center">
            <Chip 
              label={unit.so_phan_hoi > 0 ? "Có phản hồi" : "Chưa có phản hồi"}
              color={unit.so_phan_hoi > 0 ? "success" : "default"}
              size="small"
              variant={level === 0 ? "filled" : "outlined"}
            />
          </TableCell>
        </TableRow>
        
        {unit.cac_don_vi_con && unit.cac_don_vi_con.length > 0 && 
          renderUnitHierarchy(unit.cac_don_vi_con, level + 1)
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
                Thống kê theo đơn vị cấp cao
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
                Phân bố phản hồi
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
              Bảng phân cấp đơn vị
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Tên đơn vị</strong></TableCell>
                    <TableCell align="center"><strong>Số phản hồi</strong></TableCell>
                    <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderUnitHierarchy(data)}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
