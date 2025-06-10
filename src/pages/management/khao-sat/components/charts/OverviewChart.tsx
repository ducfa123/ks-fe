import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface OverviewChartProps {
  data: {
    tong_so_phan_hoi: number;
    tong_so_nguoi_tham_gia: number;
    ty_le_hoan_thanh: number;
    phan_hoi_theo_trang_thai: Array<{
      trang_thai: string;
      so_luong: number;
    }>;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const OverviewChart: React.FC<OverviewChartProps> = ({ data }) => {
  const statusData = data.phan_hoi_theo_trang_thai?.map(item => ({
    name: item.trang_thai,
    value: item.so_luong
  })) || [];

  const summaryData = [
    { name: 'Tổng phản hồi', value: data.tong_so_phan_hoi },
    { name: 'Người tham gia', value: data.tong_so_nguoi_tham_gia }
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tổng số phản hồi
              </Typography>
              <Typography variant="h3" color="primary">
                {data.tong_so_phan_hoi?.toLocaleString() || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Người tham gia
              </Typography>
              <Typography variant="h3" color="secondary">
                {data.tong_so_nguoi_tham_gia?.toLocaleString() || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tỷ lệ hoàn thành
              </Typography>
              <Typography variant="h3" color="success.main">
                {data.ty_le_hoan_thanh?.toFixed(1) || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Distribution Pie Chart */}
        {statusData.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Phân bố theo trạng thái
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Summary Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tổng quan
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={summaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
