import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Calendar, Edit2, Shield, Activity } from 'lucide-react';

export default function Profile() {
    const [profile, setProfile] = useState({
        name: 'Demo User',
        email: 'demo@example.com',
        age: 'N/A',
        district: 'N/A'
    });

    useEffect(() => {
        setProfile({
            name: localStorage.getItem('skinai_user_name') || 'Demo User',
            email: localStorage.getItem('skinai_user_email') || 'demo@example.com',
            age: localStorage.getItem('skinai_user_age') || 'N/A',
            district: localStorage.getItem('skinai_user_district') || 'N/A'
        });
    }, []);

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-300 text-transparent bg-clip-text">Account Profile</h2>
                    <p className="text-dark/60 font-medium">Manage your personal information and application preferences.</p>
                </div>
                <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl flex items-center gap-2 transition-colors border border-white/10">
                    <Edit2 size={16} />
                    Edit Profile
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="glass-card p-8 col-span-1 md:col-span-1 flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-blue-600 mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.4)]">
                        <User size={64} className="text-white opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{profile.name}</h3>
                    <p className="text-dark/50 text-sm font-semibold mb-6 uppercase tracking-wider">Primary Patient</p>

                    <div className="w-full h-px bg-white/10 mb-6" />

                    <div className="w-full space-y-4">
                        <div className="flex items-center gap-3 text-dark/70 text-sm">
                            <Mail size={16} className="text-primary" />
                            <span>{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-dark/70 text-sm">
                            <Calendar size={16} className="text-primary" />
                            <span>{profile.age} years old</span>
                        </div>
                        <div className="flex items-center gap-3 text-dark/70 text-sm">
                            <MapPin size={16} className="text-primary" />
                            <span>District: {profile.district}</span>
                        </div>
                    </div>
                </div>

                {/* Account Details & Settings */}
                <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
                    <div className="glass-card p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Shield size={120} />
                        </div>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                            <Shield size={20} className="text-primary" /> Security Overview
                        </h3>
                        <p className="text-dark/70 text-sm mb-4 leading-relaxed">
                            Your account is protected using industry-standard JWT protocols. Clinical imaging data is heavily encrypted before it hits our PostgreSQL storage blobs.
                        </p>
                        <div className="flex gap-4">
                            <button className="text-sm font-bold text-primary hover:underline">Change Password</button>
                            <button className="text-sm font-bold text-primary hover:underline">Setup 2FA</button>
                        </div>
                    </div>

                    <div className="glass-card p-8 relative overflow-hidden">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                            <Activity size={20} className="text-cyan-400" /> Platform AI Metrics
                        </h3>
                        <p className="text-dark/70 text-sm mb-4 leading-relaxed">
                            Your Eviora AI framework currently bridges directly to our <strong>FastAPI Backend</strong> pulling from PAD-UFES-20 localized classification weights.
                        </p>
                        <ul className="text-sm space-y-2 text-dark/60 font-semibold list-disc pl-4">
                            <li><strong className="text-primary">Regional Adjustments:</strong> The District ({profile.district}) allows us to sync environmental risk variables (e.g. UV Index) locally.</li>
                            <li><strong className="text-primary">Age Demographics:</strong> Advanced age vectors ({profile.age} yrs) are parsed natively into the Smart Risk Engine weighting.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
