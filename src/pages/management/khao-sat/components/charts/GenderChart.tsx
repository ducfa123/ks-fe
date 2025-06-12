import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Grid } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface GenderData {
  nam: number;
  nu: number;
  an_danh: number;
  tong_cong: number;
}

interface GenderChartProps {
  data: GenderData;
}

const GENDER_COLORS = {
  'Nam': '#2196F3',
  'Nữ': '#E91E63',
  'Ẩn danh': '#FF9800',
  'Tổng cộng': '#9E9E9E'
};

const getColorByGender = (genderName: string): string => {
  return GENDER_COLORS[genderName as keyof typeof GENDER_COLORS] || '#9C27B0';
};

export const GenderChart: React.FC<GenderChartProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Transform data for charts
  const genderStats = [
    { name: 'Nam', value: data.nam, percentage: data.tong_cong > 0 ? (data.nam / data.tong_cong * 100) : 0, key: 'nam' },
    { name: 'Nữ', value: data.nu, percentage: data.tong_cong > 0 ? (data.nu / data.tong_cong * 100) : 0, key: 'nu' },
    { name: 'Ẩn danh', value: data.an_danh, percentage: data.tong_cong > 0 ? (data.an_danh / data.tong_cong * 100) : 0, key: 'an_danh' }
  ];

  // Filter out genders with 0 responses for pie chart
  const chartData = genderStats.filter(item => item.value > 0);

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name, percentage }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${percentage.toFixed(1)}%`}
      </text>
    );
  };

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Biểu đồ tổng quan" />
          <Tab label="Phân tích chi tiết" />
          <Tab label="Bảng thống kê" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {genderStats.map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={item.key}>
                  <Card sx={{ 
                    height: '100%',
                    border: `2px solid ${getColorByGender(item.name)}`,
                    '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
                  }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color={getColorByGender(item.name)} gutterBottom>
                        {item.name}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {item.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.percentage.toFixed(1)}% tổng số
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ 
                  height: '100%',
                  border: `2px solid ${getColorByGender('Tổng cộng')}`,
                  backgroundColor: 'rgba(0, 0, 0, 0.02)'
                }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color={getColorByGender('Tổng cộng')} gutterBottom>
                      Tổng cộng
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {data.tong_cong}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tổng phản hồi
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Charts */}
          {chartData.length > 0 && (
            <>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: 400 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Biểu đồ tròn phân bố giới tính
                    </Typography>
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomLabel}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getColorByGender(entry.name)} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => [`${value} phản hồi`, 'Số lượng']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: 400 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Biểu đồ cột so sánh
                    </Typography>
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={genderStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value: any) => [`${value} phản hồi`, 'Số lượng']} />
                        <Bar dataKey="value" fill="#8884d8">
                          {genderStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getColorByGender(entry.name)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}

          {chartData.length === 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    Chưa có dữ liệu phản hồi theo giới tính
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Biểu đồ donut chi tiết
                </Typography>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={140}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getColorByGender(entry.name)} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any, name: any, props: any) => [
                        `${value} phản hồi (${props.payload.percentage.toFixed(1)}%)`,
                        'Số lượng'
                      ]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Chưa có dữ liệu để hiển thị biểu đồ
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thống kê tổng quan
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Tổng phản hồi:</strong> {data.tong_cong}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Số nhóm giới tính:</strong> {genderStats.filter(g => g.value > 0).length}
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Chi tiết từng nhóm:
                    </Typography>
                    {genderStats.map((item) => (
                      <Box key={item.key} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box 
                          sx={{ 
                            width: 16, 
                            height: 16, 
                            backgroundColor: getColorByGender(item.name),
                            borderRadius: 1,
                            mr: 1 
                          }} 
                        />
                        <Typography variant="body2">
                          {item.name}: {item.value} ({item.percentage.toFixed(1)}%)
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bảng thống kê chi tiết theo giới tính
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Giới tính</strong></TableCell>
                    <TableCell align="center"><strong>Số phản hồi</strong></TableCell>
                    <TableCell align="center"><strong>Tỷ lệ (%)</strong></TableCell>
                    <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                    <TableCell align="center"><strong>Màu đại diện</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {genderStats.map((item) => (
                    <TableRow key={item.key} hover>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Key: {item.key}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="h6" color="primary">
                          {item.value}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" fontWeight="medium">
                          {item.percentage.toFixed(2)}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={item.value > 0 ? "Có phản hồi" : "Chưa có phản hồi"}
                          color={item.value > 0 ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: getColorByGender(item.name),
                            borderRadius: 1,
                            mx: 'auto',
                            border: '1px solid #ddd'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Summary row */}
                  <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold">
                        Tổng cộng
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {data.tong_cong}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" fontWeight="bold">
                        100.00%
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label="Tổng hợp"
                        color="info"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          backgroundColor: getColorByGender('Tổng cộng'),
                          borderRadius: 1,
                          mx: 'auto',
                          border: '1px solid #ddd'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
