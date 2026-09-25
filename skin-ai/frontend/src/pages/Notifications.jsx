import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, CheckCircle, Activity, CalendarClock } from 'lucide-react';

const mockNotifications = [
    {
        id: 1,
        type: 'alert',
        title: 'High Risk Scan Detected',
        message: 'Your recent scan on the Forehead returned a HIGH risk flag. Please consult a dermatologist immediately.',
        time: '2 hours ago',
        read: false,
        icon: AlertTriangle,
        color: 'text-rose-400',
        bg: 'bg-rose-900/50 shadow-[0_0_10px_rgba(225,29,72,0.5)]'
    },
    {
        id: 2,
        type: 'reminder',
        title: 'Follow-up Scan Due',
        message: 'It has been 30 days since your left arm scan. Please perform a follow-up scan to track changes.',
        time: '1 day ago',
        read: false,
        icon: CalendarClock,
        color: 'text-blue-400',
        bg: 'bg-blue-900/50 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
    },
    {
        id: 3,
        type: 'system',
        title: 'System Update Complete',
        message: 'Eviora AI AI engine just updated to version 2.1 mapping PAD-UFES-20 model accuracy constraints.',
        time: '2 days ago',
        read: true,
        icon: Activity,
        color: 'text-cyan-400',
        bg: 'bg-cyan-900/50 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
    },
    {
        id: 4,
        type: 'success',
        title: 'First Report Downloaded',
        message: 'Your screening report for June 2026 was successfully stored in the downloads cache.',
        time: '1 week ago',
        read: true,
        icon: CheckCircle,
        color: 'text-primary',
        bg: 'bg-primary/20 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
    }
];

export default function Notifications() {
    const [notifications, setNotifications] = useState(mockNotifications);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-300 text-transparent bg-clip-text">System Alerts</h2>
                    <p className="text-dark/60 font-medium">Review your recent screening highlights and system updates.</p>
                </div>
                <button
                    onClick={markAllRead}
                    className="text-sm font-semibold text-primary hover:text-white transition-colors bg-white/5 hover:bg-white/20 px-4 py-2 rounded-xl"
                >
                    Mark all as read
                </button>
            </div>

            <div className="space-y-4">
                {notifications.map((n, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={n.id}
                        className={`glass-card p-6 flex gap-6 items-center transition-all ${n.read ? 'opacity-60 grayscale-[50%]' : 'border-l-4 border-l-primary shadow-lg shadow-white/5'}`}
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${n.bg}`}>
                            <n.icon size={28} className={n.color} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="text-xl font-bold">{n.title}</h3>
                                <span className="text-xs font-semibold text-dark/40 tracking-wider uppercase">{n.time}</span>
                            </div>
                            <p className="text-dark/70 text-sm leading-relaxed">{n.message}</p>
                        </div>
                        {!n.read && <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)] shrink-0"></div>}
                    </motion.div>
                ))}
            </div>

            {notifications.length === 0 && (
                <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
                    <Bell size={48} className="text-dark/30 mb-4" />
                    <h3 className="text-2xl font-bold text-dark/50">You're all caught up!</h3>
                    <p className="text-dark/40">No new notifications at this time.</p>
                </div>
            )}
        </div>
    );
}
