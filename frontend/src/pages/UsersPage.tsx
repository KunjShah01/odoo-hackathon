import { useState } from 'react';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { StatusTag } from '../components/ui/StatusTag';
import { useAuth } from '../context/AuthContext';
import { useExpenseStore } from '../store/useExpenseStore';
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  UserCheck, 
  UserX,
  Search,
  Mail,
  Phone,
  Building,
  Crown,
  Shield,
  User as UserIcon
} from 'lucide-react';
import { User, UserRole } from '../types';

interface TeamMember extends User {
  department?: string;
  phone?: string;
  isActive: boolean;
  lastActive?: string;
  totalExpenses?: number;
}

const DEFAULT_USERS: TeamMember[] = [
  { 
    id: '1', 
    email: 'john.doe@company.com', 
    firstName: 'John', 
    lastName: 'Doe', 
    role: 'employee',
    department: 'Engineering',
    phone: '+1 555-0101',
    isActive: true,
    lastActive: '2 hours ago',
    totalExpenses: 2500,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  { 
    id: '2', 
    email: 'sarah.manager@company.com', 
    firstName: 'Sarah', 
    lastName: 'Miller', 
    role: 'manager',
    department: 'Marketing',
    phone: '+1 555-0102',
    isActive: true,
    lastActive: '1 hour ago',
    totalExpenses: 5000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  { 
    id: '3', 
    email: 'alex.admin@company.com', 
    firstName: 'Alex', 
    lastName: 'Wilson', 
    role: 'admin',
    department: 'IT',
    phone: '+1 555-0103',
    isActive: true,
    lastActive: 'Now',
    totalExpenses: 8000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
  },
  { 
    id: '4', 
    email: 'mike.cfo@company.com', 
    firstName: 'Mike', 
    lastName: 'Johnson', 
    role: 'cfo',
    department: 'Finance',
    phone: '+1 555-0104',
    isActive: true,
    lastActive: '30 mins ago',
    totalExpenses: 15000,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'
  },
  { 
    id: '5', 
    email: 'emily.lee@company.com', 
    firstName: 'Emily', 
    lastName: 'Lee', 
    role: 'employee',
    department: 'Sales',
    phone: '+1 555-0105',
    isActive: true,
    lastActive: '3 hours ago',
    totalExpenses: 3200,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
  },
  { 
    id: '6', 
    email: 'david.brown@company.com', 
    firstName: 'David', 
    lastName: 'Brown', 
    role: 'employee',
    department: 'Engineering',
    phone: '+1 555-0106',
    isActive: false,
    lastActive: '1 month ago',
    totalExpenses: 0,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
  },
];

const ROLE_OPTIONS = [
  { value: 'employee', label: 'Employee' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'Admin' },
  { value: 'cfo', label: 'CFO' },
];

const DEPARTMENT_OPTIONS = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Finance', label: 'Finance' },
  { value: 'HR', label: 'Human Resources' },
  { value: 'IT', label: 'Information Technology' },
  { value: 'Operations', label: 'Operations' },
];

export function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<TeamMember[]>(DEFAULT_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<TeamMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'employee' as UserRole,
    department: '',
    phone: '',
    isActive: true,
  });

  const openModal = (user?: TeamMember) => {
    if (user) {
      setEditingUser(user);
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        department: user.department || '',
        phone: user.phone || '',
        isActive: user.isActive,
      });
    } else {
      setEditingUser(null);
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        role: 'employee',
        department: '',
        phone: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { 
              ...u, 
              firstName: form.firstName, 
              lastName: form.lastName, 
              email: form.email,
              role: form.role,
              department: form.department,
              phone: form.phone,
              isActive: form.isActive
            }
          : u
      ));
    } else {
      setUsers([...users, {
        id: Date.now().toString(),
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        role: form.role,
        department: form.department,
        phone: form.phone,
        isActive: form.isActive,
        lastActive: 'Never',
        totalExpenses: 0,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.firstName}`
      }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, isActive: !u.isActive } : u
    ));
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesDept = departmentFilter === 'all' || u.department === departmentFilter;
    return matchesSearch && matchesRole && matchesDept;
  });

  const roleCounts = {
    employee: users.filter(u => u.role === 'employee').length,
    manager: users.filter(u => u.role === 'manager').length,
    admin: users.filter(u => u.role === 'admin').length,
    cfo: users.filter(u => u.role === 'cfo').length,
  };

  const RoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return Shield;
      case 'manager': return Crown;
      case 'cfo': return Crown;
      default: return UserIcon;
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'manager': return 'bg-blue-100 text-blue-700';
      case 'cfo': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Team Members</h1>
          <p className="text-slate-600 mt-1">Manage your team and their permissions</p>
        </div>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <Plus size={20} />
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Users</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Employees</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{roleCounts.employee}</p>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <UserIcon className="text-slate-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Managers</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{roleCounts.manager}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Crown className="text-purple-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Admins</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{roleCounts.admin}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Shield className="text-amber-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>All Team Members</CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <Select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Roles' },
                  ...ROLE_OPTIONS
                ]}
                className="w-40"
              />
              <Select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'All Departments' },
                  ...DEPARTMENT_OPTIONS
                ]}
                className="w-40"
              />
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Department</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-900">Last Active</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-900">Expenses</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => {
                  const Icon = RoleIcon(user.role);
                  return (
                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                            {user.avatar ? (
                              <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <UserIcon className="text-slate-500" size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          <Icon size={14} />
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{user.department}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {user.isActive ? <UserCheck size={14} /> : <UserX size={14} />}
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{user.lastActive}</td>
                      <td className="py-3 px-4 text-right font-medium text-slate-900">
                        ${(user.totalExpenses || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openModal(user)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                          >
                            <Edit2 size={16} />
                          </button>
                          {user.id !== currentUser?.id && (
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Edit User' : 'Add User'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={form.firstName}
              onChange={e => setForm({ ...form, firstName: e.target.value })}
            />
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={e => setForm({ ...form, lastName: e.target.value })}
            />
          </div>
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Role"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value as UserRole })}
              options={ROLE_OPTIONS}
            />
            <Select
              label="Department"
              value={form.department}
              onChange={e => setForm({ ...form, department: e.target.value })}
              options={DEPARTMENT_OPTIONS}
            />
          </div>
          <Input
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <span className="font-medium text-slate-900">Active</span>
            <button
              onClick={() => setForm({ ...form, isActive: !form.isActive })}
              className={`w-12 h-6 rounded-full transition-colors ${
                form.isActive ? 'bg-cyan-500' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                form.isActive ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.firstName || !form.lastName || !form.email}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}