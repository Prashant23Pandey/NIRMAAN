import React from 'react';
import { X, Bell, CheckCheck, Briefcase, Award, CheckCircle2, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    t,
  } = useApp();

  if (!isNotificationDrawerOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'job':
        return <Briefcase size={16} className="text-primary" />;
      case 'milestone':
        return <Award size={16} className="text-secondary-dark" />;
      case 'checkin':
        return <CheckCircle2 size={16} className="text-success" />;
      case 'passport':
        return <Award size={16} className="text-primary" />;
      case 'review':
        return <Star size={16} className="text-amber-500 fill-amber-500" />;
      default:
        return <Bell size={16} className="text-primary" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsNotificationDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Bell size={18} />
              </div>
              <div>
                <h3 className="font-bold text-charcoal text-base">{t.notifications}</h3>
                <span className="text-xs text-charcoal-muted">
                  {notifications.filter((n) => !n.read).length} unread updates
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllNotificationsRead}
                title={t.markAllRead}
                className="p-2 text-stone-500 hover:text-primary rounded-lg text-xs font-semibold flex items-center gap-1 touch-target"
              >
                <CheckCheck size={16} />
                <span className="hidden sm:inline">{t.markAllRead}</span>
              </button>
              <button
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-lg touch-target"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* List of Notifications */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100 p-2">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationRead(item.id)}
                className={`p-4 rounded-xl transition-colors cursor-pointer flex items-start gap-3.5 ${
                  !item.read ? 'bg-primary-50/40 hover:bg-primary-50/60' : 'hover:bg-stone-50'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 shadow-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h4 className="text-xs sm:text-sm font-bold text-charcoal truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-stone-400 whitespace-nowrap">{item.time}</span>
                  </div>
                  <p className="text-xs text-charcoal-muted leading-relaxed">{item.message}</p>
                </div>
                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="p-3 text-center border-t border-stone-100 bg-[#FAF8F2] text-[11px] text-stone-500">
            Real-time simulated site triggers • NIRMAAN 2.0
          </div>
        </div>
      </div>
    </div>
  );
};
