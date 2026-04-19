import { useState } from 'react';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { 
  Folder, 
  Plus, 
  Edit2, 
  Trash2, 
  Tag, 
  DollarSign, 
  ShoppingBag, 
  Car, 
  Utensils, 
  Plane,
  FlaskConical,
  Gift,
  MoreHorizontal,
  Briefcase
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  budget?: number;
  isActive: boolean;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Travel', color: '#3B82F6', icon: 'Plane', isActive: true, budget: 5000 },
  { id: '2', name: 'Meals', color: '#F59E0B', icon: 'Utensils', isActive: true, budget: 1000 },
  { id: '3', name: 'Transportation', color: '#10B981', icon: 'Car', isActive: true, budget: 2000 },
  { id: '4', name: 'Office Supplies', color: '#8B5CF6', icon: 'ShoppingBag', isActive: true, budget: 500 },
  { id: '5', name: 'Equipment', color: '#EC4899', icon: 'Briefcase', isActive: true, budget: 10000 },
  { id: '6', name: 'Software', color: '#06B6D4', icon: 'FlaskConical', isActive: true, budget: 5000 },
  { id: '7', name: 'Training', color: '#F97316', icon: 'Gift', isActive: true, budget: 3000 },
  { id: '8', name: 'Other', color: '#6B7280', icon: 'MoreHorizontal', isActive: true, budget: 1000 },
];

const ICON_MAP: Record<string, LucideIcon> = {
  Plane,
  Utensils,
  Car,
  ShoppingBag,
  Briefcase,
  FlaskConical,
  Gift,
  MoreHorizontal,
  DollarSign,
  Folder,
  Tag,
};

const COLOR_OPTIONS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
  '#EC4899', '#06B6D4', '#F97316', '#14B8A6', '#6366F1',
];

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    name: '',
    color: '#3B82F6',
    icon: 'Folder',
    budget: '',
    isActive: true,
  });

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setForm({
        name: category.name,
        color: category.color,
        icon: category.icon,
        budget: category.budget?.toString() || '',
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setForm({
        name: '',
        color: '#3B82F6',
        icon: 'Folder',
        budget: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, name: form.name, color: form.color, icon: form.icon, budget: form.budget ? Number(form.budget) : undefined, isActive: form.isActive }
          : c
      ));
    } else {
      setCategories([...categories, {
        id: Date.now().toString(),
        name: form.name,
        color: form.color,
        icon: form.icon,
        budget: form.budget ? Number(form.budget) : undefined,
        isActive: form.isActive,
      }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setCategories(categories.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBudget = categories.reduce((sum, c) => sum + (c.budget || 0), 0);
  const activeCategories = categories.filter(c => c.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-600 mt-1">Manage expense categories and budgets</p>
        </div>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <Plus size={20} />
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Categories</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{categories.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Folder className="text-blue-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Active Categories</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{activeCategories}</p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Tag className="text-teal-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Budget</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">${totalBudget.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <DollarSign className="text-amber-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Categories</CardTitle>
              <CardDescription>View and manage your expense categories</CardDescription>
            </div>
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map(category => {
              const Icon = ICON_MAP[category.icon] || Folder;
              return (
                <div
                  key={category.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    category.isActive 
                      ? 'border-slate-200 hover:border-slate-300' 
                      : 'border-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        <Icon size={20} style={{ color: category.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{category.name}</p>
                        <p className="text-xs text-slate-500">
                          {category.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openModal(category)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Budget:</span>
                    <span className="font-medium text-slate-900">
                      ${(category.budget || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-end">
                    <button
                      onClick={() => toggleActive(category.id)}
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        category.isActive 
                          ? 'bg-teal-100 text-teal-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {category.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? 'Edit Category' : 'Add Category'}>
        <div className="space-y-4">
          <Input
            label="Category Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g., Travel, Meals, Office"
          />
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map(color => (
                <button
                  key={color}
                  onClick={() => setForm({ ...form, color })}
                  className={`w-8 h-8 rounded-lg transition-transform ${
                    form.color === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <Input
            label="Monthly Budget (optional)"
            type="number"
            value={form.budget}
            onChange={e => setForm({ ...form, budget: e.target.value })}
            placeholder="500"
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
            <Button onClick={handleSave} disabled={!form.name}>Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}