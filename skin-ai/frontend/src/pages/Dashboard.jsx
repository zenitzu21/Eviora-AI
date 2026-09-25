import { useState, useEffect } from 'react';
import { Activity, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [scans, setScans] = useState([]);

    useEffect(() => {
        const savedScans = JSON.parse(localStorage.getItem('skinai_scans') || '[]');
        setScans(savedScans.reverse()); // Show newest first
    }, []);

    const highRiskCount = scans.filter(s => s.riskFlag === 'HIGH').length;
    const modRiskCount = scans.filter(s => s.riskFlag === 'MODERATE').length;

    return (
        <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text mb-4">Command Center</h1>

            <div className="grid grid-cols-3 gap-6">
                <div className="glass-card p-6 flex items-center justify-between">
                    <div>
                        <p className="text-dark/60 text-sm font-bold uppercase tracking-wider mb-2">Total Scans</p>
                        <h2 className="text-4xl font-black text-white">{scans.length}</h2>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex flex-col items-center justify-center text-primary border border-primary/30 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                        <Activity size={28} />
                    </div>
                </div>

                <div className="glass-card p-6 flex items-center justify-between">
                    <div>
                        <p className="text-dark/60 text-sm font-bold uppercase tracking-wider mb-2">High Risk Flags</p>
                        <h2 className="text-4xl font-black text-red-400">{highRiskCount}</h2>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex flex-col items-center justify-center text-red-400 border border-red-500/30">
                        <ShieldAlert size={28} />
                    </div>
                </div>

                <div className="glass-card p-6 flex items-center justify-between">
                    <div>
                        <p className="text-dark/60 text-sm font-bold uppercase tracking-wider mb-2">Moderate Flags</p>
                        <h2 className="text-4xl font-black text-yellow-400">{modRiskCount}</h2>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex flex-col items-center justify-center text-yellow-400 border border-yellow-500/30">
                        <Clock size={28} />
                    </div>
                </div>
            </div>

            <div className="glass-card p-8 mt-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Recent Diagnostics</h2>
                    <Link to="/new-scan">
                        <button className="interactive-element bg-primary/20 text-primary border border-primary/50 px-4 py-2 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:bg-primary/40">
                            + NEW SCAN
                        </button>
                    </Link>
                </div>

                {scans.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-dark/40">
                        <Activity size={48} className="mb-4 opacity-50" />
                        <p className="text-lg">No telemetry data recorded.</p>
                        <p className="text-sm">Initiate a new scan to begin tracking geometry.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {scans.slice(0, 5).map(scan => (
                            <div key={scan.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <img src={scan.imageUrl} alt="scan" className="w-16 h-16 object-cover rounded-xl border border-white/20" />
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{scan.bodyPartLabel}</h3>
                                        <p className="text-dark/70 text-sm">{scan.date} • {scan.prediction}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold text-lg ${scan.riskFlag === 'HIGH' ? 'text-red-400' : scan.riskFlag === 'MODERATE' ? 'text-yellow-400' : 'text-green-400'}`}>
                                        {scan.riskScore}/100
                                    </p>
                                    <p className="text-xs font-semibold text-dark/60 tracking-wider">{scan.riskFlag} RISK</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
