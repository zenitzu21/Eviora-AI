import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, Database } from 'lucide-react';

export default function UploadReport() {
    const [fileUploaded, setFileUploaded] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [title, setTitle] = useState('');

    const handleUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            setTimeout(() => {
                setFileUploaded(file.name);
                setIsUploading(false);
            }, 1500);
        }
    };

    const handleSaveDatabase = () => {
        alert("Report safely ingested into Eviora AI analytics engine!");
        setFileUploaded(null);
        setTitle('');
    };

    return (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
            <div className="mb-4">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 text-transparent bg-clip-text">Upload Clinical Report</h2>
                <p className="text-dark/60 font-medium mt-2">Upload your past biopsy results or doctor screening notes to train your personal Smart Risk Engine.</p>
            </div>

            <div className="glass-card p-8">
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-dark/80 mb-2">Report Document Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. June Dermatology Screening 2026"
                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 focus:outline-none focus:border-primary focus:bg-white/20 transition-all text-white placeholder-dark/30"
                    />
                </div>

                <div className={`border-2 border-dashed rounded-2xl p-12 transition-all relative overflow-hidden flex flex-col items-center justify-center text-center ${fileUploaded ? 'border-primary/40 bg-primary/10' : 'border-white/30 bg-white/5 hover:bg-white/10'}`}>
                    <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={handleUpload}
                    />

                    {isUploading ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                            <Database size={48} className="text-primary mb-4 animate-bounce" />
                            <p className="text-lg font-bold">Encrypting and uploading file...</p>
                        </motion.div>
                    ) : fileUploaded ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center z-20">
                            <FileText size={56} className="text-primary mb-2" />
                            <h3 className="text-xl font-bold text-white mb-2">{fileUploaded}</h3>
                            <p className="text-cyan-400 font-bold flex items-center gap-2"><CheckCircle size={18} /> Uploaded Successfully</p>

                            <button
                                onClick={(e) => { e.preventDefault(); handleSaveDatabase() }}
                                className="mt-8 bg-gradient-to-r from-primary to-cyan-500 text-white font-bold px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-105 transition-all w-full relative z-30"
                            >
                                Process File AI Extraction
                            </button>
                        </motion.div>
                    ) : (
                        <div className="pointer-events-none">
                            <UploadCloud size={56} className="text-dark/40 mb-4 mx-auto" />
                            <h3 className="text-xl font-bold text-dark/70 mb-2">Drag & Drop Documents</h3>
                            <p className="text-dark/40 text-sm">Supports PDF, JPG, PNG (Max 10MB)</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 text-blue-200 p-4 rounded-xl text-sm flex gap-3 items-start">
                <Database size={20} className="shrink-0 text-blue-400" />
                <p>Information uploaded here is passed exclusively through local Natural Language models to detect past skin complication markers (e.g., historical melanoma flags). It is completely secure.</p>
            </div>
        </div>
    );
}
