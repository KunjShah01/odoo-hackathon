import { useState } from 'react';
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  MessageSquare,
  DollarSign,
  Trash2,
  Check,
  Filter,
  Calendar
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'approval' | 'rejection' | 'reminder' | 'info' | 'comment';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'approval',
    title: 'Expense Approved',
    message: 'Your expense "Client Lunch" for $125.50 has been approved by Sarah Miller.',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/dashboard',
    actionLabel: 'View Expense'
  },
  {
    id: '2',
    type: 'rejection',
    title: 'Expense Rejected',
    message: 'Your expense "Office Supplies" for $450.00 was rejected. Reason: Missing receipt.',
    timestamp: '5 hours ago',
    read: false,
    actionUrl: '/dashboard',
    actionLabel: 'View Details'
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Pending Approval',
    message: 'You have 5 expenses awaiting approval from your manager.',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/approvals',
    actionLabel: 'Review Now'
  },
  {
    id: '4',
    type: 'comment',
    title: 'New Comment',
    message: 'Sarah Miller commented on your expense "Conference Registration": "Please add the event agenda."',
    timestamp: '2 days ago',
    read: true
  },
  {
    id: '5',
    type: 'info',
    title: 'Policy Update',
    message: 'New expense policy changes effective next month. Review the updated guidelines.',
    timestamp: '3 days ago',
    read: true,
    actionUrl: '/help',
    actionLabel: 'View Policy'
  },
  {
    id: '6',
    type: 'approval',
    title: 'Expense Approved',
    message: 'Your expense "Flight to NYC" for $650.00 has been approved.',
    timestamp: '1 week ago',
    read: true,
    actionUrl: '/dashboard',
    actionLabel: 'View Expense'
  },
  {
    id: '7',
    type: 'reminder',
    title: 'Deadline Approaching',
    message: 'Expense report for Q1 is due in 3 days. Submit any outstanding expenses.',
    timestamp: '1 week ago',
    read: true
  },
];

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayedNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read) 
    : notifications;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'approval': return <CheckCircle className="text-teal-600" size={20} />;
      case 'rejection': return <XCircle className="text-red-600" size={20} />;
      case 'reminder': return <Clock className="text-amber-600" size={20} />;
      case 'comment': return <MessageSquare className="text-blue-600" size={20} />;
      case 'info': return <AlertCircle className="text-slate-600" size={20} />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'approval': return 'bg-teal-50';
      case 'rejection': return 'bg-red-50';
      case 'reminder': return 'bg-amber-50';
      case 'comment': return 'bg-blue-50';
      case 'info': return 'bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-600 mt-1">Stay updated on your expense activities</p>
        </div>
        <Button variant="secondary" onClick={clearAll} className="flex items-center gap-2">
          <Trash2 size={18} />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{notifications.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="text-blue-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Unread</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{unreadCount}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-amber-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">This Week</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {notifications.filter(n => n.timestamp.includes('hour') || n.timestamp.includes('day')).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-teal-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>{unreadCount} unread</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    filter === 'unread' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  Unread
                </button>
              </div>
              {unreadCount > 0 && (
                <Button variant="secondary" size="sm" onClick={markAllAsRead} className="flex items-center gap-2">
                  <Check size={16} />
                  Mark all read
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-slate-200">
            {displayedNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="mx-auto text-slate-300 mb-3" size={48} />
                <p className="text-slate-600">No notifications</p>
              </div>
            ) : (
              displayedNotifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`p-4 hover:bg-slate-50 transition-colors ${
                    !notification.read ? 'bg-cyan-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getBgColor(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`font-semibold text-slate-900 ${!notification.read ? '' : ''}`}>
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 inline-block w-2 h-2 bg-cyan-500 rounded-full" />
                            )}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-slate-400 mt-2">{notification.timestamp}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                              title="Mark as read"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      {notification.actionUrl && (
                        <div className="mt-3">
                          <Button variant="secondary" size="sm">
                            {notification.actionLabel}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}