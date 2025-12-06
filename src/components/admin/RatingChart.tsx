import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface RatingChartProps {
  data: { rating: number; count: number }[];
}

const RatingChart = ({ data }: RatingChartProps) => {
  const colors = {
    1: "hsl(0, 84%, 60%)",
    2: "hsl(25, 90%, 55%)",
    3: "hsl(45, 90%, 50%)",
    4: "hsl(100, 60%, 45%)",
    5: "hsl(142, 70%, 45%)",
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Rating Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="rating" 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 14 }}
                tickFormatter={(value) => `${value} ★`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-popover border rounded-lg px-3 py-2 shadow-lg">
                        <p className="font-medium">{payload[0].value} reviews</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.rating} fill={colors[entry.rating as keyof typeof colors]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingChart;
