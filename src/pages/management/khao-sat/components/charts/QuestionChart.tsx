import React from 'react';
import { Box, Typography, Card, CardContent, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface QuestionChartProps {
  data: Array<{
    noi_dung_cau_hoi: string;
    loai_cau_hoi: string;
    thong_ke_dap_an: Array<{
      gia_tri_dap_an: string;
      so_luong_chon: number;
      ty_le: number;
    }>;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#4ECDC4', '#45B7D1'];

export const QuestionChart: React.FC<QuestionChartProps> = ({ data }) => {
  return (
    <Box>
      {data.map((question, index) => {
        const chartData = question.thong_ke_dap_an.map(answer => ({
          name: answer.gia_tri_dap_an,
          value: answer.so_luong_chon,
          percentage: answer.ty_le
        }));

        return (
          <Accordion key={index} defaultExpanded={index === 0}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">
                Câu hỏi {index + 1}: {question.noi_dung_cau_hoi}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {/* Bar Chart */}
                <Card sx={{ flex: 1, minWidth: 400 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Số lượng lựa chọn
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [value, 'Số lượng']}
                        />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Pie Chart */}
                <Card sx={{ flex: 1, minWidth: 300 }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Tỷ lệ phần trăm
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};
