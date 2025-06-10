import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface TimeChartProps {
  data: Array<{
    ngay: string;
    so_luong_phan_hoi: number;
    so_luong_phan_hoi_luy_ke: number;
  }>;
}

export const TimeChart: React.FC<TimeChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    date: new Date(item.ngay).toLocaleDateString('vi-VN'),
    'Phản hồi trong ngày': item.so_luong_phan_hoi,
    'Tổng lũy kế': item.so_luong_phan_hoi_luy_ke
  }));

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Thống kê theo thời gian
          </Typography>
          
          {/* Line Chart for daily responses */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Phản hồi hàng ngày
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Phản hồi trong ngày" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          {/* Area Chart for cumulative responses */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Tổng lũy kế theo thời gian
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="Tổng lũy kế" 
                  stroke="#82ca9d" 
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
