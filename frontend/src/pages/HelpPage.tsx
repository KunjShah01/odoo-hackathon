import { useState } from 'react';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Mail, 
  Phone, 
  Video, 
  FileText,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Search,
  Send,
  Twitter,
  MessageSquare,
  Clock,
  CheckCircle
} from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQ[] = [
  {
    question: 'How do I submit an expense?',
    answer: 'Click the "Add Expense" button on your dashboard. Fill in the details including amount, category, date, and description. You can attach a receipt photo if available. Click Submit to send it for approval.',
    category: 'Getting Started'
  },
  {
    question: 'What happens after I submit an expense?',
    answer: 'Your expense goes to your manager for review. You\'ll receive notifications when it\'s approved or rejected. You can track its status on your dashboard.',
    category: 'Approvals'
  },
  {
    question: 'Why was my expense rejected?',
    answer: 'Common reasons include: missing receipt, amount exceeds policy limits, wrong category, or incomplete information. Check the rejection reason in your notifications and resubmit with corrections.',
    category: 'Approvals'
  },
  {
    question: 'How do I attach a receipt?',
    answer: 'When creating an expense, click the "Attach Receipt" button to upload a photo or file. Supported formats: JPG, PNG, PDF. Maximum file size: 5MB.',
    category: 'Receipts'
  },
  {
    question: 'What expense categories are available?',
    answer: 'Categories include: Travel, Meals, Transportation, Office Supplies, Equipment, Software, Medical, and Other. Admins can manage categories in the Admin panel.',
    category: 'Categories'
  },
  {
    question: 'Can I edit a submitted expense?',
    answer: 'You can edit expenses that are still in "draft" or "rejected" status. Once submitted for approval, contact your manager to reject it first before making changes.',
    category: 'Getting Started'
  },
  {
    question: 'How do I check my expense history?',
    answer: 'View all your submitted expenses on the Dashboard. Use filters to sort by status, date, or category. The Reports page shows aggregate data.',
    category: 'Reports'
  },
  {
    question: 'What is the approval workflow?',
    answer: 'Expenses are routed based on your company\'s approval flow. Small expenses may auto-approve, while larger ones require manager or finance approval. Check with your admin for details.',
    category: 'Approvals'
  },
  {
    question: 'How do I reset my password?',
    answer: 'Go to Settings > Security > Change Password. Enter your current password and new password. Forgot password? Use the login page reset link.',
    category: 'Account'
  },
  {
    question: 'Can I export my expenses?',
    answer: 'Yes! Use the "Export CSV" button on the Reports page to download your expense data. Great for tax or accounting purposes.',
    category: 'Reports'
  },
];

const CATEGORIES = ['Getting Started', 'Approvals', 'Receipts', 'Categories', 'Reports', 'Account'];

export function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq');

  const filteredFAQs = FAQS.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || faq.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitContact = () => {
    alert('Support request submitted! We\'ll get back to you within 24 hours.');
    setContactForm({ subject: '', message: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Help & Support</h1>
        <p className="text-slate-600 mt-1">Find answers and get help</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <Card>
            <CardBody className="p-2">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'faq'
                      ? 'bg-cyan-500/20 text-cyan-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <HelpCircle size={18} />
                  FAQ
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'contact'
                      ? 'bg-cyan-500/20 text-cyan-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <MessageCircle size={18} />
                  Contact Support
                </button>
              </nav>
            </CardBody>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Quick Links</CardTitle>
            </CardHeader>
            <CardBody className="p-2 space-y-2">
              <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg">
                <Book size={16} />
                User Guide
                <ExternalLink size={14} className="ml-auto text-slate-400" />
              </a>
              <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg">
                <Video size={16} />
                Video Tutorials
                <ExternalLink size={14} className="ml-auto text-slate-400" />
              </a>
              <a href="#" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg">
                <FileText size={16} />
                Expense Policy
                <ExternalLink size={14} className="ml-auto text-slate-400" />
              </a>
            </CardBody>
          </Card>
        </div>

        <div className="flex-1">
          {activeTab === 'faq' && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle>Frequently Asked Questions</CardTitle>
                      <CardDescription>{FAQS.length} questions</CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="text"
                          placeholder="Search FAQ..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
                        />
                      </div>
                      <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="all">All Categories</option>
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="p-0">
                  <div className="divide-y divide-slate-200">
                    {filteredFAQs.map(faq => (
                      <div key={faq.question}>
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === faq.question ? null : faq.question)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {expandedFAQ === faq.question ? (
                              <ChevronDown size={20} className="text-cyan-600" />
                            ) : (
                              <ChevronRight size={20} className="text-slate-400" />
                            )}
                            <span className="font-medium text-slate-900">{faq.question}</span>
                          </div>
                          <span className="text-xs text-slate-500 px-2 py-1 bg-slate-100 rounded-full">
                            {faq.category}
                          </span>
                        </button>
                        {expandedFAQ === faq.question && (
                          <div className="px-4 pb-4 pl-11 text-slate-600">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </>
          )}

          {activeTab === 'contact' && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>We typically respond within 24 hours</CardDescription>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg text-center">
                    <Mail className="mx-auto text-cyan-600 mb-2" size={24} />
                    <p className="font-medium text-slate-900">Email</p>
                    <p className="text-sm text-slate-600">support@expenseflow.com</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg text-center">
                    <Phone className="mx-auto text-cyan-600 mb-2" size={24} />
                    <p className="font-medium text-slate-900">Phone</p>
                    <p className="text-sm text-slate-600">1-800-EXPENSE</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg text-center">
                    <MessageSquare className="mx-auto text-cyan-600 mb-2" size={24} />
                    <p className="font-medium text-slate-900">Live Chat</p>
                    <p className="text-sm text-slate-600">Mon-Fri 9am-5pm</p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-semibold text-slate-900 mb-4">Send a Message</h4>
                  <div className="space-y-4">
                    <Input
                      label="Subject"
                      value={contactForm.subject}
                      onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="Brief description of your issue"
                    />
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                      <textarea
                        value={contactForm.message}
                        onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Describe your issue in detail..."
                        rows={5}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                      />
                    </div>
                    <Button onClick={handleSubmitContact} disabled={!contactForm.subject || !contactForm.message} className="flex items-center gap-2">
                      <Send size={18} />
                      Send Message
                    </Button>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="font-semibold text-slate-900 mb-4">Follow Us</h4>
                  <div className="flex items-center gap-3">
                    <Button variant="secondary" className="flex items-center gap-2">
                      <Twitter size={18} />
                      @ExpenseFlow
                    </Button>
                    <Button variant="secondary" className="flex items-center gap-2">
                      <MessageSquare size={18} />
                      @ExpenseFlowHQ
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}