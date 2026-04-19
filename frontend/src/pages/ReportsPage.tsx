import { useState, useEffect } from 'react';
import { useExpenseStore } from '../store/useExpenseStore';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { Download } from 'lucide-react';
import { format } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function ReportsPage() {
  const { reportData, fetchReports, loading } = useExpenseStore();
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const exportToCSV = () => {
    if (!reportData) return;
    setExporting(true);
    const csv = [
      'Metric,Value',
      `Total Expenses,${reportData.total.toFixed(2)}`,
      `Period,${reportData.period}`,
      '',
      'Top Merchants',
      ...reportData.topMerchants.map(m => `"${m.merchant}",${m.total.toFixed(2)}`),
      '',
      'Monthly Trend',
      ...reportData.monthlyTrend.map(t => `"${t.month}",${t.amount.toFixed(2)}`)
    ].join('\\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  if (loading) {
    return <div>Loading reports...</div>;
  }

  if (!reportData) {
    return <div>No report data available</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-600 mt-1">Expense insights and trends</p>
        </div>
        <Button onClick={exportToCSV} disabled={exporting} className="flex items-center gap-2">
          <Download size={20} />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-900">Monthly Expenses Trend</h3>
            <p className="mt-1 text-sm text-slate-600">Last 6 months</p>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-900">Expenses by Category</h3>
            <p className="mt-1 text-sm text-slate-600">Breakdown</p>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(reportData.byCategory).map(([name, value]) => ({ name, value }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {Object.entries(reportData.byCategory).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-900">Top Merchants</h3>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Merchant</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-900">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {reportData.topMerchants.map((merchant, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{merchant.merchant}</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900">${merchant.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-900">Summary</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-slate-900">${reportData.total.toFixed(2)}</p>
              <p className="text-slate-600 mt-1">Total Expenses ({reportData.period})</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-teal-600">{Object.keys(reportData.byCategory).length}</p>
              <p className="text-slate-600 mt-1">Categories Used</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-600">{reportData.topMerchants.length}</p>
              <p className="text-slate-600 mt-1">Top Merchants</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

