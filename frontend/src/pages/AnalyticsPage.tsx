import { useState } from 'react';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
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
  Cell, 
  BarChart, 
  Bar,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download
} from 'lucide-react';

interface TrendData {
  month: string;
  amount: number;
  approved: number;
  rejected: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface DepartmentData {
  name: string;
  expenses: number;
  budget: number;
}

const MONTHLY_TREND_DATA: TrendData[] = [
  { month: 'Jan', amount: 12500, approved: 11200, rejected: 1300 },
  { month: 'Feb', amount: 15800, approved: 14500, rejected: 1300 },
  { month: 'Mar', amount: 18200, approved: 16800, rejected: 1400 },
  { month: 'Apr', amount: 14300, approved: 13200, rejected: 1100 },
  { month: 'May', amount: 19500, approved: 18000, rejected: 1500 },
  { month: 'Jun', amount: 22100, approved: 20500, rejected: 1600 },
];

const CATEGORY_DATA: CategoryData[] = [
  { name: 'Travel', value: 35000, color: '#3B82F6' },
  { name: 'Meals', value: 18000, color: '#F59E0B' },
  { name: 'Equipment', value: 25000, color: '#8B5CF6' },
  { name: 'Software', value: 15000, color: '#06B6D4' },
  { name: 'Office', value: 12000, color: '#10B981' },
  { name: 'Other', value: 8000, color: '#6B7280' },
];

const DEPARTMENT_DATA: DepartmentData[] = [
  { name: 'Engineering', expenses: 45000, budget: 50000 },
  { name: 'Marketing', expenses: 32000, budget: 35000 },
  { name: 'Sales', expenses: 28000, budget: 30000 },
  { name: 'Operations', expenses: 18000, budget: 20000 },
  { name: 'Finance', expenses: 12000, budget: 15000 },
];

const APPROVAL_TIME_DATA = [
  { day: 'Mon', hours: 4.2 },
  { day: 'Tue', hours: 3.8 },
  { day: 'Wed', hours: 5.1 },
  { day: 'Thu', hours: 4.5 },
  { day: 'Fri', hours: 6.2 },
];



export function AnalyticsPage() {
  const [period, setPeriod] = useState('month');

  const totalExpenses = MONTHLY_TREND_DATA.reduce((sum, d) => sum + d.amount, 0);
  const totalApproved = MONTHLY_TREND_DATA.reduce((sum, d) => sum + d.approved, 0);
  const totalRejected = MONTHLY_TREND_DATA.reduce((sum, d) => sum + d.rejected, 0);
  const approvalRate = ((totalApproved / totalExpenses) * 100).toFixed(1);
  const avgApprovalTime = APPROVAL_TIME_DATA.reduce((sum, d) => sum + d.hours, 0) / APPROVAL_TIME_DATA.length;

  const topCategory = CATEGORY_DATA.reduce((max, d) => d.value > max.value ? d : max, CATEGORY_DATA[0]);
  const departmentOverspent = DEPARTMENT_DATA.filter(d => d.expenses > d.budget);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-600 mt-1">Deep insights into your expense data</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            options={[
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'quarter', label: 'This Quarter' },
              { value: 'year', label: 'This Year' },
            ]}
            className="w-40"
          />
          <Button className="flex items-center gap-2">
            <Download size={18} />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Expenses</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">${totalExpenses.toLocaleString()}</p>
                <p className="text-xs text-teal-600 flex items-center gap-1 mt-1">
                  <TrendingUp size={14} />
                  +12.5% vs last period
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-blue-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Approval Rate</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{approvalRate}%</p>
                <p className="text-xs text-teal-600 flex items-center gap-1 mt-1">
                  <TrendingUp size={14} />
                  +2.3% vs last period
                </p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-teal-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Avg. Approval Time</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{avgApprovalTime.toFixed(1)}h</p>
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <TrendingUp size={14} />
                  +0.8h vs last period
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="text-purple-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Rejection Rate</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{((totalRejected / totalExpenses) * 100).toFixed(1)}%</p>
                <p className="text-xs text-teal-600 flex items-center gap-1 mt-1">
                  <TrendingDown size={14} />
                  -1.2% vs last period
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="text-red-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Trend</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={MONTHLY_TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Area type="monotone" dataKey="approved" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Approved" />
                <Area type="monotone" dataKey="rejected" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Rejected" />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Distribution</CardDescription>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {CATEGORY_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Department Budget vs Expenses</CardTitle>
            <CardDescription>Current period</CardDescription>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={DEPARTMENT_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => `${Number(value).toLocaleString()}`} />
                <Legend />
                <Bar dataKey="budget" fill="#E5E7EB" name="Budget" radius={[0, 4, 4, 0]} />
                <Bar dataKey="expenses" fill="#3B82F6" name="Expenses" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Approval Time by Day</CardTitle>
            <CardDescription>Hours to approve</CardDescription>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={APPROVAL_TIME_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(1)} hours`, 'Avg Approval Time']} />
                <Line type="monotone" dataKey="hours" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Spending Categories</CardTitle>
            <CardDescription>By total amount</CardDescription>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {CATEGORY_DATA.sort((a, b) => b.value - a.value).map((category, index) => (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-900">{index + 1}. {category.name}</span>
                    <span className="text-slate-900 font-semibold">${category.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all" 
                      style={{ 
                        width: `${(category.value / topCategory.value) * 100}%`,
                        backgroundColor: category.color 
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts & Insights</CardTitle>
            <CardDescription>Action items</CardDescription>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {departmentOverspent.map(dept => (
                <div key={dept.name} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-medium text-red-900">{dept.name} over budget</p>
                    <p className="text-sm text-red-700">
                      ${dept.expenses.toLocaleString()} of ${dept.budget.toLocaleString()} used
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <Clock className="text-amber-600 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium text-amber-900">Friday approval times high</p>
                  <p className="text-sm text-amber-700">Avg 6.2h - consider redistributing workload</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                <TrendingUp className="text-teal-600 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium text-teal-900">Travel expenses up 25%</p>
                  <p className="text-sm text-teal-700">Consider reviewing travel policy</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}