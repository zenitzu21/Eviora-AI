import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [district, setDistrict] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!isLogin) {
                // Register
                const res = await fetch('http://127.0.0.1:8000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        full_name: name,
                        email: email,
                        password: password,
                        district: district
                    })
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.detail || 'Registration failed');
                }

                // Immediately login after successful registration
                const loginRes = await fetch('http://127.0.0.1:8000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        full_name: name, // Fastapi schema wants full_name string even if not used in logic
                        email: email,
                        district: district,
                        password: password
                    })
                });
                const loginData = await loginRes.json();
                localStorage.setItem('skinai_token', loginData.access_token);
                localStorage.setItem('skinai_user_name', name);
                localStorage.setItem('skinai_user_email', email);
                localStorage.setItem('skinai_user_district', district);
                navigate('/dashboard');
            } else {
                // Login
                const res = await fetch('http://127.0.0.1:8000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        full_name: "Login User", // Mock for schema requirements
                        email: email,
                        district: "Generic",
                        password: password
                    })
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.detail || 'Login failed');
                }

                const data = await res.json();
                localStorage.setItem('skinai_token', data.access_token);
                if (data.user) {
                    localStorage.setItem('skinai_user_name', data.user.name);
                    localStorage.setItem('skinai_user_email', data.user.email);
                    localStorage.setItem('skinai_user_district', data.user.district);
                }
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-white flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-blue-900/10 opacity-20"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card w-full max-w-md p-10 relative"
            >
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-black tracking-tighter mb-2 bg-gradient-to-r from-primary to-cyan-300 text-transparent bg-clip-text">
                        EVIORA AI
                    </h1>
                    <p className="text-dark/60 font-medium tracking-wide text-sm">
                        {isLogin ? 'Secure Gateway Authentication' : 'Establish Encrypted Telemetry Link'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 rounded-lg bg-red-900/50 border border-red-500/50 text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-sm font-semibold text-white/80 mb-2">Full Name</label>
                                <div className="relative">
                                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" size={20} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Dr. Jane Doe"
                                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:bg-white/20 transition-all text-white placeholder-dark/30"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-white/80 mb-2">District (Tamil Nadu)</label>
                                <select
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 focus:outline-none focus:border-primary focus:bg-white/20 transition-all text-white"
                                    required
                                >
                                    <option value="" disabled className="bg-slate-900 text-white/70">Select your district</option>
                                    {[
                                        "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
                                    ].map(d => (
                                        <option key={d} value={d} className="bg-slate-800 text-white">{d}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-white/80 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="jane@example.com"
                                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:bg-white/20 transition-all text-white placeholder-dark/30"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-white/80 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:bg-white/20 transition-all text-white placeholder-dark/30"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] transform transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                        {loading ? 'Authenticating...' : (isLogin ? 'Initialize Uplink' : 'Create Access Token')}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-dark/60">
                    <p>
                        {isLogin ? "Unregistered biometrics?" : "Token already authorized?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 text-primary font-bold hover:underline"
                        >
                            {isLogin ? 'Request clearance' : 'Execute login'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
