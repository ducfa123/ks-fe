import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Bar,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  Scatter,
  ScatterChart,
  Treemap,
  ZAxis,
} from "recharts";
import { Box, Typography, CircularProgress } from "@mui/material";

type ChartType =
  | "line"
  | "bar"
  | "area"
  | "pie"
  | "radar"
  | "radialBar"
  | "composed"
  | "scatter"
  | "treemap";

interface TChartProps {
  type: ChartType;
  data: any[];
  xKey?: string;
  dataKeys: { key: string; label?: string; color?: string }[];
  title?: string;
  height?: number;
  loading?: boolean;
}

export const TChart: React.FC<TChartProps> = ({
  type,
  data,
  xKey,
  dataKeys,
  title,
  height = 300,
  loading = false,
}) => {
  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map(({ key, label, color }) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color || "#8884d8"}
                name={label}
              />
            ))}
          </LineChart>
        );
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map(({ key, label, color }) => (
              <Bar
                key={key}
                dataKey={key}
                fill={color || "#8884d8"}
                name={label}
              />
            ))}
          </BarChart>
        );
      case "area":
        return (
          <AreaChart data={data}>
            <defs>
              {dataKeys.map(({ key, color }) => (
                <linearGradient
                  key={key}
                  id={`color-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={color || "#8884d8"}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={color || "#8884d8"}
                    stopOpacity={0}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map(({ key, label, color }) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color || "#8884d8"}
                fillOpacity={1}
                fill={`url(#color-${key})`}
                name={label}
              />
            ))}
          </AreaChart>
        );
      case "pie": {
        const niceColors = [
          "#4E79A7",
          "#F28E2B",
          "#E15759",
          "#76B7B2",
          "#59A14F",
          "#EDC949",
          "#AF7AA1",
          "#FF9DA7",
          "#9C755F",
          "#BAB0AC",
        ];

        const usedLabels = new Set<string>();
        const labelToColor = new Map<string, string>();

        // Tự động gán màu cho mỗi label khác nhau
        data.forEach((entry, index) => {
          const label = entry[xKey || ""] || `${index}`;
          if (!usedLabels.has(label)) {
            labelToColor.set(
              label,
              niceColors[labelToColor.size % niceColors.length]
            );
            usedLabels.add(label);
          }
        });

        return (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={data}
              dataKey={dataKeys[0].key}
              nameKey={xKey}
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={labelToColor.get(entry[xKey || ""] || `${index}`)}
                />
              ))}
            </Pie>
          </PieChart>
        );
      }

      case "radar":
        return (
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey={xKey} />
            <PolarRadiusAxis />
            <Radar
              dataKey={dataKeys[0].key}
              stroke={dataKeys[0].color || "#8884d8"}
              fill={dataKeys[0].color || "#8884d8"}
              fillOpacity={0.6}
              name={dataKeys[0].label}
            />
            <Legend />
          </RadarChart>
        );
      case "radialBar":
        return (
          <RadialBarChart
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="10%"
            outerRadius="80%"
            barSize={10}
          >
            <RadialBar
              background
              dataKey={dataKeys[0].key}
              fill={dataKeys[0].color || "#8884d8"}
              name={dataKeys[0].label}
            />
            <Legend />
            <Tooltip />
          </RadialBarChart>
        );
      case "composed":
        return (
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map(({ key, label, color }, index) => {
              if (index % 3 === 0)
                return (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    fill={color || "#8884d8"}
                    stroke={color || "#8884d8"}
                    name={label}
                  />
                );
              if (index % 3 === 1)
                return (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={color || "#43A047"}
                    name={label}
                  />
                );
              return (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color || "#E53935"}
                  name={label}
                />
              );
            })}
          </ComposedChart>
        );

      case "scatter":
        return (
          <ScatterChart>
            <CartesianGrid />
            <XAxis dataKey={xKey} name="X" />
            <YAxis dataKey={dataKeys[0].key} name="Y" />
            <ZAxis range={[100]} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            <Scatter
              name={dataKeys[0].label || dataKeys[0].key}
              data={data}
              fill={dataKeys[0].color || "#8884d8"}
            />
          </ScatterChart>
        );

      case "treemap":
        return (
          <Treemap
            data={data}
            dataKey={dataKeys[0].key}
            nameKey={xKey}
            stroke="#fff"
            fill={dataKeys[0].color || "#8884d8"}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        p: 2,
        borderRadius: 2,
        width: "100%",
        height: height + 60,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {title && (
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
        >
          {title}
        </Typography>
      )}
      {loading ? (
        <Box
          sx={{
            height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      )}
    </Box>
  );
};
