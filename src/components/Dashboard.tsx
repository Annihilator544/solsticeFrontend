import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import DemoPage from './table/table';
import { useMaxSpend } from '@/store/use-max-spend';
import { useEffect } from 'react';
import MaxSpends from './MaxSpends';
import { toast } from 'sonner';
import { ModeToggle } from './ModeToggle';
import { useTableData } from '@/store/use-table-data';

const PaymentDashboard = () => {
  // Original payment dummyData
    // const { userPreference } = useUserPreference();
    // console.log(userPreference);
  const { tableData } = useTableData();
  const { setSpend, spend, userMaxSpend } = useMaxSpend();
  // Process data for class distribution
  const classSummary = tableData.reduce(
    (acc: Record<string, { name: string; count: number; total: number }>, item) => {
      if (!acc[item.class]) {
        acc[item.class] = {
          name: item.class.charAt(0).toUpperCase() + item.class.slice(1),
          count: 0,
          total: 0,
        };
      }
      acc[item.class].count += 1;
      acc[item.class].total += item.amount;
      return acc;
    },
    {}
  );
    // Set the processed data to Zustand store
    useEffect(() => {
        setSpend(classSummary);
      }, []);

      useEffect(() => {
        Object.entries(spend).forEach(([key]) => {
            userMaxSpend.forEach((item) => {
                if (item.name.toLowerCase() === key && spend[key].total >= item.total) {
                    toast("You have exceeded your max spend limit for " + item.name, {
                        description: "You have spent ₹" + (spend[key].total - item.total) + " extra on " + item.name,
                        duration: 50000,
                    }
                    )
                }
            }
        );
      })}, [spend]);

  const classDistribution = Object.values(classSummary);

  // Process data for payment receivers (top recipients)
  const receiverSummary = tableData.reduce(
    (
      acc: Record<string, { name: string; fullName: string; count: number; total: number }>,
      item
    ) => {
      const receiverShortName = item.receiver.split(' ')[0];
      if (!acc[item.receiver]) {
        acc[item.receiver] = {
          name: receiverShortName,
          fullName: item.receiver,
          count: 0,
          total: 0,
        };
      }
      acc[item.receiver].count += 1;
      acc[item.receiver].total += item.amount;
      return acc;
    },
    {}
  );

  const topReceivers = Object.values(receiverSummary)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Date summary
  const dateSummary = tableData.reduce(
    (acc: Record<string, { name: string; count: number; total: number }>, item) => {
      if (!acc[item.date]) {
        acc[item.date] = {
          name: item.date,
          count: 0,
          total: 0,
        };
      }
      acc[item.date].count += 1;
      acc[item.date].total += item.amount;
      return acc;
    },
    {}
  );

  const dailyTotals = Object.values(dateSummary);

  // Chart color variables
  // Replace the old COLORS array with references to your ShadCN variables
  const CHART_COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  // Calculate total spent
  const totalSpent = tableData.reduce((sum, item) => sum + item.amount, 0);
  const totalTransactions = tableData.length;
  const averageTransaction = Math.round(totalSpent / totalTransactions);

  return (
    <div className="p-10 space-y-6">
      <ModeToggle />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSpent}</div>
            <p className="text-xs text-muted-foreground">Over {totalTransactions} transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{averageTransaction}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Largest Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{Math.max(...tableData.map((item) => item.amount))}
            </div>
            <p className="text-xs text-muted-foreground">
              {
                tableData.find(
                  (item) =>
                    item.amount === Math.max(...tableData.map((item) => item.amount))
                )?.receiver || 'N/A'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      <DemoPage />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="recipient">By Recipient</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Daily Spending</CardTitle>
              <CardDescription>Transaction amounts aggregated by date</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyTotals}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number, name: string) => {
                        return name === 'Total Amount'
                          ? [`₹${value}`, name]
                          : [value, name];
                      }} />
                  <Legend />
                  {/* Replace fill="#8884d8" and fill="#82ca9d" */}
                  <Bar dataKey="total" name="Total Amount" fill={CHART_COLORS[0]} />
                  <Bar dataKey="count" name="Transaction Count" fill={CHART_COLORS[1]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>Total amount spent per category</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={classDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="hsl(var(--chart-1))"
                      dataKey="total"
                      nameKey="name"
                      label={({
                        name,
                        percent,
                      }: {
                        name: string;
                        percent: number;
                      }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {classDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number, name: string) => {
                        return name === 'Total Amount'
                          ? [`₹${value}`, name]
                          : [value, name];
                      }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Analysis</CardTitle>
                <CardDescription>Comparing count vs amount</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        return name === 'Total Amount'
                          ? [`₹${value}`, name]
                          : [value, name];
                      }}
                    />
                    <Legend />
                    {/* Replace fill="#8884d8" and fill="#82ca9d" */}
                    <Bar
                      yAxisId="left"
                      dataKey="total"
                      name="Total Amount"
                      fill={CHART_COLORS[2]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="count"
                      name="Transaction Count"
                      fill={CHART_COLORS[3]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recipient">
          <Card>
            <CardHeader>
              <CardTitle>Top Recipients</CardTitle>
              <CardDescription>Top 5 recipients by total amount</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    topReceivers as {
                      name: string;
                      fullName: string;
                      count: number;
                      total: number;
                    }[]
                  }
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      return name === 'Total' ? [`₹${value}`, name] : [value, name];
                    }}
                    labelFormatter={(value: string) =>
                      topReceivers.find((r) => r.name === value)?.fullName || value
                    }
                  />
                  <Legend />
                  {/* Replace fill="#8884d8" and fill="#82ca9d" */}
                  <Bar dataKey="total" name="Total" fill={CHART_COLORS[0]} />
                  <Bar dataKey="count" name="Count" fill={CHART_COLORS[1]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <MaxSpends />
    </div>
  );
};

export default PaymentDashboard;
