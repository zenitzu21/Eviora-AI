import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeftRight, Clock, AlertTriangle, Download } from 'lucide-react';
import jsPDF from 'jspdf';

const bodyRegions = [
    { id: 'head', label: 'Head', top: '2%', left: '40%', width: '20%', height: '12%' },
    { id: 'forehead', label: 'Forehead', top: '3%', left: '43%', width: '14%', height: '5%' },
    { id: 'chest', label: 'Chest', top: '16%', left: '33%', width: '34%', height: '20%' },
    { id: 'back', label: 'Back', top: '16%', left: '33%', width: '34%', height: '20%' },
    { id: 'left_arm', label: 'Left Arm', top: '16%', left: '12%', width: '18%', height: '25%' },
    { id: 'right_arm', label: 'Right Arm', top: '16%', left: '70%', width: '18%', height: '25%' },
    { id: 'left_hand', label: 'Left Hand', top: '38%', left: '8%', width: '14%', height: '10%' },
    { id: 'right_hand', label: 'Right Hand', top: '38%', left: '78%', width: '14%', height: '10%' },
    { id: 'left_palm', label: 'Left Palm', top: '40%', left: '10%', width: '10%', height: '8%' },
    { id: 'right_palm', label: 'Right Palm', top: '40%', left: '80%', width: '10%', height: '8%' },
    { id: 'left_leg', label: 'Left Leg', top: '55%', left: '33%', width: '16%', height: '30%' },
    { id: 'right_leg', label: 'Right Leg', top: '55%', left: '51%', width: '16%', height: '30%' },
];

const FLAG_STYLES = {
    LOW: 'bg-cyan-900/50 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.5)]',
    MODERATE: 'bg-blue-900/50 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.5)]',
    HIGH: 'bg-rose-900/50 text-rose-400 border border-rose-500/30 shadow-[0_0_10px_rgba(225,29,72,0.5)]',
};

export default function BodyMap() {
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [scans, setScans] = useState([]);
    const [compareMode, setCompareMode] = useState(false);
    const [compareScans, setCompareScans] = useState([null, null]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('skinai_scans') || '[]');
        setScans(stored);
    }, []);

    const regionScans = scans.filter(s => s.bodyPart === selectedRegion);
    const regionInfo = bodyRegions.find(r => r.id === selectedRegion);

    const hasScansForRegion = (regionId) => scans.some(s => s.bodyPart === regionId);

    const generatePDF = (scan) => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(0, 240, 255);
        doc.text('Eviora AI - Scan Report', 20, 20);

        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        doc.text(`Date of Scan: ${scan.date}`, 20, 40);
        doc.text(`Body Region: ${scan.bodyPartLabel}`, 20, 50);
        doc.text(`AI Prediction: ${scan.prediction}`, 20, 60);
        doc.text(`Confidence Level: ${scan.confidence}%`, 20, 70);

        doc.setFontSize(14);
        if (scan.riskFlag === 'HIGH') doc.setTextColor(225, 29, 72);
        else if (scan.riskFlag === 'MODERATE') doc.setTextColor(59, 130, 246);
        else doc.setTextColor(6, 182, 212);

        doc.text(`Risk Flag: ${scan.riskFlag}`, 20, 90);
        doc.text(`Risk Score: ${scan.riskScore} / 100`, 20, 100);

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Disclaimer: This is an AI-assisted screening prototype and is NOT a clinical diagnosis.', 20, 120, { maxWidth: 170 });

        if (scan.imageUrl) {
            try {
                const imgFormat = scan.imageUrl.includes('png') ? 'PNG' : 'JPEG';
                doc.addImage(scan.imageUrl, imgFormat, 20, 135, 120, 120);
            } catch (e) {
                console.error('Could not add image to PDF:', e);
            }
        }

        doc.save(`Eviora_AI_Scan_${scan.bodyPartLabel}_${scan.date.replace(/ /g, '_')}.pdf`);
    };

    const toggleCompare = (scan) => {
        if (compareScans[0]?.id === scan.id) {
            setCompareScans([null, compareScans[1]]);
        } else if (compareScans[1]?.id === scan.id) {
            setCompareScans([compareScans[0], null]);
        } else if (!compareScans[0]) {
            setCompareScans([scan, compareScans[1]]);
        } else if (!compareScans[1]) {
            setCompareScans([compareScans[0], scan]);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Compare Modal */}
            <AnimatePresence>
                {compareMode && compareScans[0] && compareScans[1] && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8"
                        onClick={() => { setCompareMode(false); setCompareScans([null, null]); }}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            className="glass-card bg-[#0b1426]/95 border-2 border-primary/30 rounded-3xl p-8 max-w-4xl w-full shadow-[0_0_50px_rgba(0,240,255,0.15)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-300 text-transparent bg-clip-text">Image Comparison</h2>
                                <button onClick={() => { setCompareMode(false); setCompareScans([null, null]); }}
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex gap-6">
                                {compareScans.map((scan, i) => (
                                    <div key={i} className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col">
                                        <div className="rounded-xl overflow-hidden border-2 border-white/10 mb-4 h-64 bg-black/50">
                                            <img src={scan.imageUrl} alt={`Scan ${i + 1}`} className="w-full h-full object-contain" />
                                        </div>
                                        <p className="font-bold text-lg text-white mb-1">{scan.date}</p>
                                        <p className="text-sm text-primary font-semibold mb-2">{scan.bodyPartLabel}</p>
                                        <div className="bg-black/30 p-3 rounded-lg border border-white/5 mb-2">
                                            <p className="text-sm text-white/80">Prediction: <span className="font-bold text-white">{scan.prediction}</span> ({scan.confidence}%)</p>
                                        </div>
                                        <div className="mt-auto pt-2">
                                            <span className={`inline-block text-xs uppercase font-bold px-3 py-1.5 rounded-lg border shadow-sm ${FLAG_STYLES[scan.riskFlag] || 'bg-gray-100 text-dark'}`}>
                                                {scan.riskFlag} RISK — Score {scan.riskScore}/100
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-xl text-sm text-white/80 flex items-center gap-4">
                                <AlertTriangle className="text-primary flex-shrink-0" size={24} />
                                <p><strong>Comparison Note:</strong> Review visual changes in size, color, border regularity, and symmetry between the two scans. If the lesion has evolved significantly, consult your dermatologist.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Layout */}
            <div className="flex gap-8">
                {/* Body Map */}
                <div className="glass-card flex-1 p-8 h-[700px] flex justify-center items-center relative">
                    <div className="relative w-80 h-[600px] border border-white/20 rounded-3xl bg-white/5 flex justify-center overflow-hidden">
                        {/* Human Body SVG */}
                        <svg viewBox="0 0 200 500" className="w-full h-full opacity-30 absolute top-0 pointer-events-none">
                            {/* Head */}
                            <ellipse cx="100" cy="40" rx="25" ry="30" fill="none" stroke="currentColor" strokeWidth="2" />
                            {/* Neck */}
                            <rect x="90" y="68" width="20" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" />
                            {/* Torso */}
                            <path d="M65 83 L135 83 L140 200 L60 200 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                            {/* Left Arm */}
                            <path d="M65 83 L30 130 L20 200 L35 200 L45 140 L60 100" fill="none" stroke="currentColor" strokeWidth="2" />
                            {/* Right Arm */}
                            <path d="M135 83 L170 130 L180 200 L165 200 L155 140 L140 100" fill="none" stroke="currentColor" strokeWidth="2" />
                            {/* Left Hand */}
                            <ellipse cx="22" cy="210" rx="12" ry="16" fill="none" stroke="currentColor" strokeWidth="1.5" />
                            {/* Right Hand */}
                            <ellipse cx="178" cy="210" rx="12" ry="16" fill="none" stroke="currentColor" strokeWidth="1.5" />
                            {/* Left Leg */}
                            <path d="M60 200 L55 350 L50 440 L70 440 L75 350 L85 200" fill="none" stroke="currentColor" strokeWidth="2" />
                            {/* Right Leg */}
                            <path d="M115 200 L125 350 L130 440 L150 440 L145 350 L140 200" fill="none" stroke="currentColor" strokeWidth="2" />
                            {/* Left Foot */}
                            <ellipse cx="60" cy="450" rx="15" ry="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                            {/* Right Foot */}
                            <ellipse cx="140" cy="450" rx="15" ry="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        </svg>

                        {/* Clickable Regions */}
                        {bodyRegions.map(region => {
                            const hasScan = hasScansForRegion(region.id);
                            return (
                                <motion.div
                                    key={region.id}
                                    className={`absolute cursor-pointer border-2 transition-all flex items-center justify-center
                    ${selectedRegion === region.id
                                            ? 'border-primary bg-primary/30 z-10 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                                            : hasScan
                                                ? 'border-cyan-400/60 bg-cyan-400/20 hover:bg-cyan-400/30'
                                                : 'border-transparent hover:border-white/50 hover:bg-white/15'
                                        }`}
                                    style={{
                                        top: region.top, left: region.left, width: region.width, height: region.height, borderRadius: '40%'
                                    }}
                                    onClick={() => setSelectedRegion(region.id)}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {hasScan && (
                                        <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Panel */}
                <div className="glass-card w-[380px] p-8 h-[700px] flex flex-col overflow-y-auto">
                    {selectedRegion ? (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col">
                            <h2 className="text-2xl font-bold mb-2 text-primary border-b border-primary/20 pb-4">
                                {regionInfo?.label}
                            </h2>

                            {regionScans.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center text-dark/50 p-4">
                                    <AlertTriangle size={32} className="mb-3 opacity-50" />
                                    <p className="text-sm">No scans recorded for this body part yet.</p>
                                    <p className="text-xs mt-2">Use the <strong>New Scan</strong> workflow to add a scan here.</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-dark/70 font-medium text-sm mb-4 flex items-center gap-2">
                                        <Clock size={14} /> {regionScans.length} scan{regionScans.length > 1 ? 's' : ''} recorded
                                    </p>

                                    {regionScans.length >= 2 && (
                                        <button
                                            onClick={() => {
                                                setCompareScans([regionScans[regionScans.length - 1], regionScans[regionScans.length - 2]]);
                                                setCompareMode(true);
                                            }}
                                            className="mb-4 w-full bg-primary/10 border border-primary/30 text-primary font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/20 transition-all"
                                        >
                                            <ArrowLeftRight size={16} /> Compare Latest Two
                                        </button>
                                    )}

                                    <div className="flex flex-col gap-3">
                                        {regionScans.slice().reverse().map((scan, idx) => (
                                            <motion.div
                                                key={scan.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="bg-white/20 rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all"
                                            >
                                                <div className="flex gap-3">
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/40 flex-shrink-0">
                                                        <img src={scan.imageUrl} alt="Scan" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="font-bold text-sm">{scan.date}</span>
                                                            <div className="flex items-center gap-2">
                                                                <button onClick={() => generatePDF(scan)} title="Download PDF Report" className="text-dark/40 hover:text-primary transition-colors p-1 bg-white/20 hover:bg-white/40 rounded">
                                                                    <Download size={14} />
                                                                </button>
                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${FLAG_STYLES[scan.riskFlag] || 'bg-gray-100'}`}>
                                                                    {scan.riskFlag}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-dark/70">{scan.prediction} ({scan.confidence}%)</p>
                                                        <p className="text-xs text-dark/50">Score: {scan.riskScore}/100</p>
                                                    </div>
                                                </div>

                                                {regionScans.length >= 2 && (
                                                    <button
                                                        onClick={() => {
                                                            toggleCompare(scan);
                                                            if (compareScans[0] && !compareScans[1]) {
                                                                setCompareScans([compareScans[0], scan]);
                                                                setCompareMode(true);
                                                            } else {
                                                                setCompareScans([scan, null]);
                                                            }
                                                        }}
                                                        className="mt-2 text-primary font-semibold text-xs hover:underline"
                                                    >
                                                        Select for Comparison
                                                    </button>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center text-dark/50 p-8">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <MapPin size={24} className="text-primary" />
                            </div>
                            <p className="font-medium">Select a body region</p>
                            <p className="text-sm mt-2 text-dark/40">Click on the interactive body map to view scan history and compare images.</p>
                            <div className="mt-6 text-xs text-dark/30 space-y-1">
                                <p className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-cyan-400 rounded-full inline-block shadow-[0_0_8px_rgba(6,182,212,0.8)]" /> Regions with scans</p>
                                <p className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-white/50 rounded-full inline-block border border-dark/20" /> No scans yet</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MapPin({ size = 24, className = '' }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
        </svg>
    );
}
