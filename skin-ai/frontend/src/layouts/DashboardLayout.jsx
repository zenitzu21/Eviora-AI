import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CursorGlow from '../components/CursorGlow';

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-background">
            <CursorGlow />
            <Sidebar />
            <div className="flex-1 ml-64 p-8 relative z-10">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold text-dark/90">Welcome back</h1>

                </div>
                <main className="max-w-7xl mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
