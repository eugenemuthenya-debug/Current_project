import {
  ResponsiveContainer,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
const MonthlyTrend = ({ data }) => {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 40,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            label={{
              value: "Day of month",
              position: "insideBottom",
              offset: -2,
            }}
          />
          <YAxis
            label={{
              value: "Amount spent (Ksh)",
              angle: -90,
              position: "insideLeft",
              style: {
                textAnchor: "middle",
              },
            }}
          />
          <Tooltip />
          <Line
            type="linear"
            dataKey="amount"
            stroke="#6366f1"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrend;
