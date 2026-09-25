import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileDown, FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';

export default function DownloadReport() {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('skinai_scans') || '[]');
        setReports(stored.slice().reverse()); // Show newest first
    }, []);

    const handleDownload = (scan) => {
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
                {reports.length === 0 ? (
                    <div className="col-span-full text-center text-dark/50 py-12">
                        <FileText size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="text-lg">No reports available yet.</p>
                        <p className="text-sm">Complete a new scan and save it to the body map to generate a report.</p>
                    </div>
                ) : reports.map((report, i) => (
                    <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 flex flex-col justify-between hover:border-primary/50 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/10 rounded-xl overflow-hidden w-16 h-16 flex-shrink-0">
                                    {report.imageUrl ? (
                                        <img src={report.imageUrl} className="w-full h-full object-cover rounded" alt="Scan thumbnail" />
                                    ) : (
                                        <FileText size={32} className="text-white opacity-70 group-hover:text-primary transition-colors" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight mb-1">Scan: {report.bodyPartLabel}</h3>
                                    <p className="text-xs text-dark/70 font-semibold">{report.prediction} / Score: {report.riskScore}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-white/50">{report.date}</span>
                                <span className="text-[10px] uppercase font-bold tracking-wider opacity-40">{report.riskFlag} RISK IDENTIFIED</span>
                            </div>

                            <button
                                onClick={() => handleDownload(report)}
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
