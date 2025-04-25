import React from "react";
import { Box, Grid, Paper, Typography, Card, CardContent } from "@mui/material";
import { TChart } from "./tChart";

const salesData = [
  { month: "Tháng 1", sales: 4000, revenue: 2400, profit: 2400 },
  { month: "Tháng 2", sales: 3000, revenue: 1398, profit: 2210 },
  { month: "Tháng 3", sales: 2000, revenue: 9800, profit: 2290 },
  { month: "Tháng 4", sales: 2780, revenue: 3908, profit: 2000 },
  { month: "Tháng 5", sales: 1890, revenue: 4800, profit: 2181 },
  { month: "Tháng 6", sales: 2390, revenue: 3800, profit: 2500 },
];

const productData = [
  { name: "Điện thoại", value: 4000 },
  { name: "Laptop", value: 3000 },
  { name: "Máy tính bảng", value: 2000 },
  { name: "Phụ kiện", value: 2780 },
  { name: "Đồ gia dụng", value: 1890 },
];

const performanceData = [
  { subject: "Marketing", A: 120, B: 110 },
  { subject: "Bán hàng", A: 98, B: 130 },
  { subject: "Tài chính", A: 86, B: 130 },
  { subject: "Nhân sự", A: 99, B: 100 },
  { subject: "IT", A: 85, B: 90 },
];

const radialData = [
  { name: "Mục tiêu", value: 80 },
  { name: "Hiện tại", value: 60 },
];

const scatterData = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
];

const treemapData = [
  { name: "Hà Nội", value: 4000 },
  { name: "TP.HCM", value: 3000 },
  { name: "Đà Nẵng", value: 2000 },
  { name: "Hải Phòng", value: 1000 },
  { name: "Cần Thơ", value: 500 },
  { name: "Nghệ An", value: 300 },
  { name: "Thanh Hóa", value: 200 },
];

const StatCard = ({
  title,
  value,
  unit,
}: {
  title: string;
  value: number;
  unit?: string;
}) => (
  <Card>
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4">
        {value.toLocaleString()}
        {unit && (
          <Typography component="span" variant="h6">
            {" "}
            {unit}
          </Typography>
        )}
      </Typography>
    </CardContent>
  </Card>
);

export const ChartDashboard: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tổng số người dùng" value={12500} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tổng số sản phẩm" value={8500} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tổng số đơn hàng" value={3200} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tổng doanh thu" value={1250000000} unit="đ" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Line Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Xu hướng bán hàng
            </Typography>
            <TChart
              type="line"
              data={salesData}
              xKey="month"
              dataKeys={[
                { key: "sales", label: "Doanh số", color: "#8884d8" },
                { key: "revenue", label: "Doanh thu", color: "#82ca9d" },
              ]}
              height={300}
            />
          </Paper>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Hiệu suất hàng tháng
            </Typography>
            <TChart
              type="bar"
              data={salesData}
              xKey="month"
              dataKeys={[
                { key: "profit", label: "Lợi nhuận", color: "#ffc658" },
              ]}
              height={300}
            />
          </Paper>
        </Grid>

        {/* Area Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tăng trưởng doanh thu
            </Typography>
            <TChart
              type="area"
              data={salesData}
              xKey="month"
              dataKeys={[
                { key: "revenue", label: "Doanh thu", color: "#82ca9d" },
              ]}
              height={300}
            />
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Phân phối sản phẩm
            </Typography>
            <TChart
              type="pie"
              data={productData}
              xKey="name"
              dataKeys={[{ key: "value", label: "Giá trị" }]}
              height={300}
            />
          </Paper>
        </Grid>

        {/* Radar Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Hiệu suất phòng ban
            </Typography>
            <TChart
              type="radar"
              data={performanceData}
              xKey="subject"
              dataKeys={[
                { key: "A", label: "Hiện tại", color: "#8884d8" },
                { key: "B", label: "Mục tiêu", color: "#82ca9d" },
              ]}
              height={300}
            />
          </Paper>
        </Grid>

        {/* Radial Bar Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tổng quan tiến độ
            </Typography>
            <TChart
              type="radialBar"
              data={radialData}
              dataKeys={[{ key: "value", label: "Tiến độ", color: "#8884d8" }]}
              height={300}
            />
          </Paper>
        </Grid>

        {/* Scatter Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Phân phối dữ liệu
            </Typography>
            <TChart
              type="scatter"
              data={scatterData}
              dataKeys={[{ key: "y", label: "Giá trị Y", color: "#8884d8" }]}
              height={300}
            />
          </Paper>
        </Grid>

        {/* Composed Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Chỉ số tổng hợp
            </Typography>
            <TChart
              type="composed"
              data={salesData}
              xKey="month"
              dataKeys={[
                { key: "sales", label: "Doanh số", color: "#8884d8" },
                { key: "revenue", label: "Doanh thu", color: "#82ca9d" },
                { key: "profit", label: "Lợi nhuận", color: "#ffc658" },
              ]}
              height={300}
            />
          </Paper>
        </Grid>

        {/* Treemap Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Phân phối theo khu vực
            </Typography>
            <TChart
              type="treemap"
              data={treemapData}
              xKey="name"
              dataKeys={[{ key: "value", label: "Giá trị" }]}
              height={300}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
