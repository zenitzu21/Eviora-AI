import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, PlusCircle, Activity, FileText, Download, Bell, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const location = useLocation();
    const path = location.pathname;

    const links = [
        { name: 'Home', icon: Home, route: '/dashboard' },
        { name: 'New Scan', icon: PlusCircle, route: '/new-scan' },
        { name: 'Body Map', icon: Activity, route: '/body-map' },
        { name: 'Reports', icon: FileText, route: '/reports' },
        { name: 'Downloads', icon: Download, route: '/downloads' }
    ];

    const bottomLinks = [
        { name: 'Notifications', icon: Bell, route: '/notifications' },
        { name: 'Profile', icon: User, route: '/profile' },
        { name: 'Logout', icon: LogOut, route: '/login' }
    ];

    return (
        <div className="w-64 h-screen fixed left-0 top-0 glass-card rounded-none border-t-0 border-l-0 border-b-0 flex flex-col pt-8 pb-8 z-40">
            <div className="px-8 pb-8">
                <h2 className="text-2xl font-bold text-primary tracking-wide">EVIORA AI</h2>
            </div>

            <div className="flex-1 flex flex-col gap-2 px-4">
                {links.map((link) => {
                    const active = path === link.route;
                    return (
                        <Link key={link.name} to={link.route}>
                            <motion.div
                                whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.4)' }}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-colors ${active ? 'bg-primary/20 border border-primary/30' : ''}`}
                            >
                                <link.icon size={20} className={active ? 'text-primary' : 'text-dark/70'} />
                                <span className={`font-medium ${active ? 'text-primary' : 'text-dark/80'}`}>{link.name}</span>
                                {active && <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-md" />}
                            </motion.div>
                        </Link>
                    );
                })}
            </div>

            <div className="flex flex-col gap-2 px-4 mt-8 pt-6 border-t border-white/40">
                {bottomLinks.map((link) => {
                    const active = path === link.route;
                    return (
                        <Link key={link.name} to={link.route}>
                            <motion.div
                                whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.4)' }}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-colors ${active ? 'bg-primary/20 border border-primary/30' : ''}`}
                            >
                                <link.icon size={20} className={active ? 'text-primary' : 'text-dark/70'} />
                                <span className={`font-medium ${active ? 'text-primary' : 'text-dark/80'}`}>{link.name}</span>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;
