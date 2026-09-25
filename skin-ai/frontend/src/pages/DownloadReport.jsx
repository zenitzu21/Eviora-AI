import React from 'react';
import { motion } from 'framer-motion';
import { FileDown, FileText, Download } from 'lucide-react';

const MOCK_REPORTS = [
    {
        id: 1,
        title: 'Comprehensive Screening Report (June 2026)',
        date: 'June 15, 2026',
        size: '1.2 MB',
        type: 'Automated AI Summary',
        flag: 'HIGH',
    },
    {
        id: 2,
        title: 'Quarterly Body Map Delta',
        date: 'March 10, 2026',
        size: '4.5 MB',
        type: 'Visual Scan Output',
        flag: 'LOW',
    },
    {
        id: 3,
        title: 'Dermatologist Baseline Upload',
        date: 'January 5, 2026',
        size: '800 KB',
        type: 'Manual Upload (PDF)',
        flag: 'MODERATE',
    }
];

export default function DownloadReport() {

    const handleDownload = (title) => {
        alert(`Downloading ${title}... (PDF generation simulation)`);
    };

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 text-transparent bg-clip-text">Report Archive</h2>
                    <p className="text-dark/60 font-medium">Download historically generated PDF diagnostics and analysis records.</p>
                </div>
                <button className="bg-primary/20 text-primary font-bold px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/40 transition-colors">
                    <FileDown size={20} />
                    Generate New Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_REPORTS.map((report, i) => (
                    <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 flex flex-col justify-between hover:border-primary/50 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-xl">
                                    <FileText size={32} className="text-white opacity-70 group-hover:text-primary transition-colors" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight mb-1">{report.title}</h3>
                                    <p className="text-xs text-dark/40 font-semibold">{report.type}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-white/50">{report.date}</span>
                                <span className="text-[10px] uppercase font-bold tracking-wider opacity-40">{report.size}</span>
                            </div>

                            <button
                                onClick={() => handleDownload(report.title)}
                                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-md group-hover:scale-110"
                            >
                                <Download size={20} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
