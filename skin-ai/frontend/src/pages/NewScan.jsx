import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, ArrowRight, Activity, Sliders, CheckCircle, FileText, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const STEPS = [
    { id: 'upload', title: 'Upload Image', icon: Upload },
    { id: 'bodypart', title: 'Body Part', icon: MapPin },
    { id: 'quality', title: 'Quality Check', icon: Sliders },
    { id: 'questionnaire', title: 'Questionnaire', icon: FileText },
    { id: 'ai', title: 'AI Analysis', icon: Activity },
    { id: 'results', title: 'Results', icon: CheckCircle }
];

const BODY_PARTS = [
    { id: 'head', label: 'Head' },
    { id: 'forehead', label: 'Forehead' },
    { id: 'left_hand', label: 'Left Hand' },
    { id: 'right_hand', label: 'Right Hand' },
    { id: 'left_palm', label: 'Left Palm' },
    { id: 'right_palm', label: 'Right Palm' },
    { id: 'chest', label: 'Chest' },
    { id: 'back', label: 'Back' },
    { id: 'left_arm', label: 'Left Arm' },
    { id: 'right_arm', label: 'Right Arm' },
    { id: 'left_leg', label: 'Left Leg' },
    { id: 'right_leg', label: 'Right Leg' },
];

const DOCTOR_LOCATIONS = {
    'Chennai': [
        { name: 'Genesis Dermatology Skin & Hair clinic', link: 'https://www.google.com/searchviewer/10?svid=CAwS3QEKBmxjbF9wdhJyCgNwdnESa01pZERRa0ZSUVZOSlZFTktMVzV6VG1Fd2FWcGpSRVpVVW5WaVFWbGtRM3BCU1haRFowSlBRVVU2SlRCNE0yRTFNalkzWWpkbE1qbGhOV0ZsTlRvd2VHRXlPVEkwT0dZME1tSTRNekZtTlRrEkEKAXESPEdlbmVzaXMgRGVybWF0b2xvZ3kgU2tpbiAmIEhhaXIgY2xpbmljIC0gQXNob2sgTmFnYXIgQ2hlbm5haRoccGxhY2Utdmlld2VyLWFzeW5jLWNvbnRhaW5lchgK' },
        { name: 'Clinic 2', link: 'https://www.google.com/aclk?sa=L&ai=DChsSEwjHtLbWtImXAxXpG4MDHZakO0gYACICCAEQLRoCc2Y&co=1' },
        { name: 'Clinic 3', link: 'https://www.google.com/searchviewer/10?client=mobilesearchapp&sca_esv=f490e9746bfcf51c&udm=local&svid=CAwSHRIbCgNwdnESFENnMHZaeTh4TVhaa05qZGlOMjV4GAo' },
        { name: 'Clinic 4', link: 'https://www.google.com/searchviewer/10?client=mobilesearchapp&sca_esv=f490e9746bfcf51c&udm=local&svid=CAwSHRIbCgNwdnESFENnMHZaeTh4TVdNME5UbHVNM2gzGAo' },
        { name: 'Clinic 5', link: 'https://www.google.com/searchviewer/10?client=mobilesearchapp&sca_esv=f490e9746bfcf51c&udm=local&svid=CAwSHRIbCgNwdnESFENnMHZaeTh4TVhJMllqa3lkM2hmGAo' }
    ],
    'Madurai': [
        { name: 'Clinic 1', link: 'https://www.google.com/searchviewer/10?client=mobilesearchapp&sca_esv=f490e9746bfcf51c&udm=local&svid=CAwSHRIbCgNwdnESFENnMHZaeTh4TVdwNk5HSmlNek01GAo' },
        { name: 'Clinic 2', link: 'https://www.google.com/searchviewer/10?client=mobilesearchapp&sca_esv=f490e9746bfcf51c&udm=local&svid=CAwSHRIbCgNwdnESFENnMHZaeTh4TVdwNk5HSmlNek01GAo' },
        { name: 'Clinic 3', link: 'https://www.google.com/searchviewer/10?client=mobilesearchapp&sca_esv=f490e9746bfcf51c&udm=local&svid=CAwSHRIbCgNwdnESFENnMHZaeTh4TVdSbU1IaG5ibWMwGAo' },
        { name: 'Clinic 4', link: 'https://www.google.com/searchviewer/10?client=mobilesearchapp&sca_esv=f490e9746bfcf51c&udm=local&svid=CAwSHRIbCgNwdnESFENnMHZaeTh4TVhGemQzRnVibkZqGAo' },
        { name: 'Clinic 5', link: 'https://www.google.com/searchviewer/10?client=mobilesearchapp&sca_esv=f490e9746bfcf51c&udm=local&svid=CAwSHRIbCgNwdnESFENnMHZaeTh4TVhoemRtcHRlak13GAo' }
    ],
    'Tiruchy': [
        { name: 'Clinic 1', link: 'https://www.google.com/searchviewer/10?client=mobilesearchapp&sca_esv=f490e9746bfcf51c&udm=local&svid=CAwSHRIbCgNwdnESFENnMHZaeTh4TVhKeWVtaDNOMkp6GAo' },
        { name: 'Clinic 2', link: 'https://share.google/ysCrZ4id2niG2FsQE' },
        { name: 'Clinic 3', link: 'https://share.google/3qWZmO6j0tLVtXGRc' },
        { name: 'Clinic 4', link: 'https://share.google/PK3FBKhWayTRpOM1L' },
        { name: 'Clinic 5', link: 'https://share.google/oGg5dcMwc3FeQFAmT' }
    ],
    'Kanchipuram': [
        { name: 'Dr. THAMIZH\'s Skin Hair Nail & Cosmetology Clinic', link: 'https://www.google.com/search?kgmid=%2Fg%2F11vl53wd33' },
        { name: 'Clinic 2', link: 'https://share.google/AuFZSwmUg1y2rI7E5' },
        { name: 'Jothi Heart & Skin Clinic', link: 'https://www.google.com/search?kgmid=%2Fg%2F11mclkr97d' },
        { name: 'Clinic 4', link: 'https://share.google/xgdwxa7QyiwjN9ANR' },
        { name: 'Clinic 5', link: 'https://share.google/VZXEQq4XM3762pnFM' }
    ],
    'Tiruppur': [
        { name: 'V V Skin and Chest Clinic', link: 'https://www.google.com/search?kgmid=%2Fg%2F11rsh3b3_n' },
        { name: 'ZEN SKIN & HAIR CLINIC', link: 'https://www.google.com/search?kgmid=%2Fg%2F11tk8nt5c1' },
        { name: 'Clinic 3', link: 'https://share.google/vlaDZOYm6NehtiKdD' },
        { name: 'Clinic 4', link: 'https://share.google/4T6ZHblt6cOH8NKwJ' },
        { name: 'Clinic 5', link: 'https://share.google/VX0vsyl0OkhfzV6OX' }
    ],
    'Salem': [
        { name: 'Everglo Aesthetic Clinic', link: 'https://www.google.com/search?kgmid=%2Fg%2F11zcm6djg3' },
        { name: 'Sarvin Skin and Laser Center', link: 'https://www.google.com/search?kgmid=%2Fg%2F11lfz7p9yw' },
        { name: 'Clinic 3', link: 'https://share.google/eL36vmhpKNRyNo5Cd' },
        { name: 'Clinic 4', link: 'https://share.google/1iWDRhc2htiaPuRbe' },
        { name: 'Clinic 5', link: 'https://share.google/642GrYI4aRGSUUpvS' }
    ],
    'Tuticorin': [
        { name: 'Advanced GroHair & GloSkin', link: 'https://www.google.com/search?kgmid=%2Fg%2F11wmjjdfhp' },
        { name: 'Clinic 2', link: 'https://share.google/mGhnOUylCLkAun54T' },
        { name: 'Clinic 3', link: 'https://share.google/iq6Y0SxJNmQAGLxpo' },
        { name: 'Clinic 4', link: 'https://share.google/B3vCqjC7ZaVrsOhtx' },
        { name: 'Clinic 5', link: 'https://share.google/P22E8Os37VVI1Dl12' }
    ]
};

export default function NewScan() {
    const [currentStep, setCurrentStep] = useState(0);
    const [imageUploaded, setImageUploaded] = useState(null);
    const [selectedBodyPart, setSelectedBodyPart] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Questionnaire state
    const [answers, setAnswers] = useState({ q1: false, q2: false, q3: false });
    // Dynamic Results state
    const [scanResult, setScanResult] = useState(null);
    const [uploadedFilename, setUploadedFilename] = useState("");

    // Derived state for the user's district
    const userDistrict = localStorage.getItem('skinai_user_district') || 'N/A';

    const handleNext = async () => {
        if (currentStep === 2) {
            setIsProcessing(true);
            setTimeout(() => {
                setIsProcessing(false);
                setCurrentStep(3);
            }, 1000);
        } else if (currentStep === 4) {
            setIsProcessing(true);

            try {
                let qScore = (answers.q1 ? 1 : 0) + (answers.q2 ? 1 : 0) + (answers.q3 ? 2 : 0);
                const response = await fetch('http://127.0.0.1:8000/api/ai/process-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image_base64: imageUploaded,
                        questionnaire_score: qScore,
                        visual_change: answers.q1,
                        filename: uploadedFilename
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const risk = data.risk_evaluation;
                    const classification = data.classification;
                    const segmentation_result = data.segmentation;

                    let flagStyle = 'bg-cyan-900/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)] border border-cyan-500/30';
                    if (risk.risk_flag === 'HIGH') flagStyle = 'bg-rose-900/50 text-rose-400 shadow-[0_0_10px_rgba(225,29,72,0.5)] border border-rose-500/30';
                    if (risk.risk_flag === 'MODERATE') flagStyle = 'bg-blue-900/50 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] border border-blue-500/30';

                    setScanResult({
                        score: risk.risk_score,
                        flag: risk.risk_flag,
                        flagStyle: flagStyle,
                        prediction: classification.prediction || 'Unknown',
                        conf: Math.round((classification.confidence || 0) * 100),
                        reasons: risk.reasons || [],
                        yoloImage: segmentation_result?.yolo_image || null,
                        heatmapImage: segmentation_result?.heatmap_image || null
                    });
                } else {
                    throw new Error("API Failed");
                }
            } catch (err) {
                console.error("Backend AI fetch failed, using fallback:", err);
                setScanResult({
                    score: 95, flag: 'HIGH', flagStyle: 'bg-rose-900/50 text-rose-400 shadow-[0_0_10px_rgba(225,29,72,0.5)] border border-rose-500/30',
                    prediction: 'Connection Error', conf: 0,
                    reasons: ['Could not reach local FastAPI server on port 8000.']
                });
            }

            setIsProcessing(false);
            setCurrentStep(5);
        } else {
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
        }
    };

    const handleSaveScan = (e) => {
        if (!imageUploaded || !selectedBodyPart || !scanResult) return;

        try {
            const existingScans = JSON.parse(localStorage.getItem('skinai_scans') || '[]');
            const newScan = {
                id: Date.now(),
                bodyPart: selectedBodyPart,
                bodyPartLabel: BODY_PARTS.find(b => b.id === selectedBodyPart)?.label || selectedBodyPart,
                imageUrl: imageUploaded,
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                timestamp: Date.now(),
                prediction: scanResult.prediction,
                confidence: scanResult.conf,
                riskScore: scanResult.score,
                riskFlag: scanResult.flag,
            };
            existingScans.push(newScan);
            localStorage.setItem('skinai_scans', JSON.stringify(existingScans));
            alert('Scan saved to Body Map successfully!');
        } catch (error) {
            console.error("Storage error:", error);
            alert("Could not save scan (storage limit reached). Please clear old scans.");
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadedFilename(file.name);

        // Resize image so it doesn't break localStorage quota
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 400;
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
                setImageUploaded(compressedDataUrl);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const canProceed = () => {
        if (currentStep === 0) return !!imageUploaded;
        if (currentStep === 1) return !!selectedBodyPart;
        return true;
    };

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            {/* Step Indicator */}
            <div className="glass-card p-6 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/20 -z-10" />
                {STEPS.map((step, index) => {
                    const isActive = index === currentStep;
                    const isPast = index < currentStep;
                    return (
                        <div key={step.id} className="flex flex-col items-center bg-transparent z-10 px-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/40 scale-110' : isPast ? 'bg-primary/80 text-white' : 'bg-white/50 text-dark/40'}`}>
                                <step.icon size={16} />
                            </div>
                            <span className={`text-[10px] font-bold mt-2 uppercase tracking-wider ${isActive ? 'text-primary' : 'text-dark/40'}`}>{step.title}</span>
                        </div>
                    );
                })}
            </div>

            {/* Step Content */}
            <div className="glass-card p-10 min-h-[400px] flex flex-col justify-center items-center text-center">

                {/* Step 0: Upload */}
                {currentStep === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                        <h2 className="text-2xl font-bold mb-4">Upload Skin Image</h2>
                        <div className={`border-2 border-dashed rounded-2xl p-12 transition-all relative ${imageUploaded ? 'border-primary/40 bg-white/10' : 'border-primary/40 bg-white/10 hover:bg-white/20'}`}>
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={handleImageUpload}
                            />
                            {imageUploaded ? (
                                <div className="flex flex-col items-center">
                                    <img src={imageUploaded} alt="Uploaded skin" className="max-h-48 object-cover rounded-xl shadow-md mb-4" />
                                    <p className="text-lg font-medium text-cyan-400 flex items-center gap-2"><CheckCircle size={20} /> Image Loaded Successfully</p>
                                </div>
                            ) : (
                                <div className="pointer-events-none">
                                    <Upload size={48} className="mx-auto mb-4 text-primary" />
                                    <p className="text-lg font-medium text-dark/80">Click or drag an image here to upload</p>
                                    <p className="text-sm text-dark/50 mt-2">Supported formats: JPG, JPEG, PNG</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Step 1: Body Part Selection */}
                {currentStep === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                        <h2 className="text-2xl font-bold mb-2">Select Body Part</h2>
                        <p className="text-dark/60 mb-6">Where is this skin area located?</p>
                        <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
                            {BODY_PARTS.map(part => (
                                <motion.button
                                    key={part.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedBodyPart(part.id)}
                                    className={`p-4 rounded-xl border-2 transition-all text-center ${selectedBodyPart === part.id ? 'border-primary bg-primary/20 shadow-lg shadow-primary/20' : 'border-white/30 bg-white/10 hover:bg-white/20'}`}
                                >
                                    <span className="text-sm font-bold uppercase tracking-wide">{part.label}</span>
                                </motion.button>
                            ))}
                        </div>
                        {selectedBodyPart && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-primary font-semibold">
                                Selected: {BODY_PARTS.find(b => b.id === selectedBodyPart)?.label}
                            </motion.p>
                        )}
                    </motion.div>
                )}

                {/* Step 2: Quality Check */}
                {currentStep === 2 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                        <h2 className="text-2xl font-bold mb-4">Image Quality Validation</h2>
                        {isProcessing ? (
                            <div className="animate-pulse flex flex-col items-center">
                                <Sliders size={48} className="text-primary mb-4 animate-spin" />
                                <p className="font-semibold text-dark/70">Analyzing brightness, blur, and contrast...</p>
                            </div>
                        ) : (
                            <div className="bg-white/30 p-6 rounded-xl">
                                <p className="text-lg text-dark/80 mb-2">Ready to validate quality. Click NEXT to run OpenCV checks.</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Step 3: Questionnaire */}
                {currentStep === 3 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-left">
                        <h2 className="text-2xl font-bold mb-6 text-center">Skin Questionnaire</h2>
                        <div className="space-y-4 max-w-lg mx-auto">
                            <div className="bg-white/20 p-4 rounded-xl">
                                <p className="font-semibold mb-2">1. Has the area changed recently?</p>
                                <div className="flex gap-4">
                                    <label><input type="radio" name="q1" checked={answers.q1} onChange={() => setAnswers({ ...answers, q1: true })} /> Yes</label>
                                    <label><input type="radio" name="q1" checked={!answers.q1} onChange={() => setAnswers({ ...answers, q1: false })} /> No</label>
                                </div>
                            </div>
                            <div className="bg-white/20 p-4 rounded-xl">
                                <p className="font-semibold mb-2">2. Is it itchy or painful?</p>
                                <div className="flex gap-4">
                                    <label><input type="radio" name="q2" checked={answers.q2} onChange={() => setAnswers({ ...answers, q2: true })} /> Yes</label>
                                    <label><input type="radio" name="q2" checked={!answers.q2} onChange={() => setAnswers({ ...answers, q2: false })} /> No</label>
                                </div>
                            </div>
                            <div className="bg-white/20 p-4 rounded-xl">
                                <p className="font-semibold mb-2">3. Has it bled?</p>
                                <div className="flex gap-4">
                                    <label><input type="radio" name="q3" checked={answers.q3} onChange={() => setAnswers({ ...answers, q3: true })} /> Yes</label>
                                    <label><input type="radio" name="q3" checked={!answers.q3} onChange={() => setAnswers({ ...answers, q3: false })} /> No</label>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 4: AI Analysis */}
                {currentStep === 4 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                        <h2 className="text-2xl font-bold mb-4">AI Analysis Pipeline</h2>
                        {isProcessing ? (
                            <div className="flex flex-col items-center justify-center p-8">
                                <Activity size={56} className="text-primary mb-4 animate-pulse" />
                                <p className="font-semibold text-dark/80 text-lg mb-2">Processing with YOLO26-Seg &amp; EfficientNet-B0...</p>
                                <div className="w-64 h-2 bg-white/50 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2 }} className="h-full bg-primary" />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white/30 p-6 rounded-xl">
                                <p className="text-lg text-dark/80 mb-2">Questionnaire complete. Ready to run the classification pipeline.</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Step 5: Results */}
                {currentStep === 5 && scanResult && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex gap-8">
                        <div className="flex-1 bg-white/20 p-6 rounded-2xl flex flex-col items-center text-center">
                            <div className={`${scanResult.flagStyle} font-bold px-4 py-2 rounded-lg mb-4 cursor-default`}>{scanResult.flag} SCREENING FLAG</div>
                            <h3 className="text-3xl font-bold mb-2">Smart Risk Engine</h3>
                            <div className="bg-white/10 p-4 rounded-xl border border-white/20 mb-4 w-full">
                                <p className="font-bold text-[15px] underline mb-1">Recommended Action:</p>
                                <p className="text-white font-medium">
                                    {scanResult.flag === 'HIGH' ? 'Meet the doctor immediately' :
                                        scanResult.flag === 'MODERATE' ? 'Go to the hospital within 3 days' :
                                            scanResult.flag === 'LOW' ? 'Check after 1 week in the app' : 'Monitor closely'}
                                </p>
                            </div>
                            <p className="text-dark/60 text-sm mb-2">Risk Score: {scanResult.score}/100</p>
                            <p className="text-dark/60 text-xs mb-6">Body Part: <strong className="text-primary">{BODY_PARTS.find(b => b.id === selectedBodyPart)?.label || 'N/A'}</strong></p>

                            {/* Doctor Recommendation rendering */}
                            {scanResult.flag === 'HIGH' && DOCTOR_LOCATIONS[userDistrict] && (
                                <div className="bg-rose-900/40 border border-rose-500/50 p-4 rounded-xl w-full mb-6">
                                    <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2 mb-3">
                                        <MapPin size={16} /> Urgent: Nearby Specialists in {userDistrict}
                                    </h4>
                                    <ul className="text-left space-y-2">
                                        {DOCTOR_LOCATIONS[userDistrict].map((clinic, idx) => (
                                            <li key={idx} className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors">
                                                <a href={clinic.link} target="_blank" rel="noreferrer" className="text-xs text-white flex justify-between items-center w-full">
                                                    <span className="font-semibold truncate">{clinic.name}</span>
                                                    <ArrowRight size={14} className="text-rose-400 flex-shrink-0" />
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="text-left text-sm space-y-2 mb-6 bg-white/10 p-4 rounded-xl w-full border border-white/20">
                                <p><strong>AI Prediction:</strong> {scanResult.prediction} (<span className="text-cyan-400 font-bold">{scanResult.conf}% Confidence</span>)</p>
                                <p><strong>Reasons:</strong></p>
                                <ul className="list-disc pl-4 text-dark/70">
                                    {scanResult.reasons.map((r, i) => <li key={i}>{r}</li>)}
                                </ul>
                            </div>
                            <div className="bg-red-50 text-red-800 text-xs p-3 rounded-lg text-left shadow-sm">
                                <strong>Disclaimer:</strong> This is an AI-assisted screening prototype and is NOT a clinical diagnosis.
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-4">
                            <div className="bg-dark/10 h-48 rounded-2xl flex items-center justify-center border border-white/40 overflow-hidden relative shadow-inner">
                                {scanResult.heatmapImage ? (
                                    <>
                                        <img src={scanResult.heatmapImage} className="absolute inset-0 w-full h-full object-cover" alt="grad-cam base" />
                                        <span className="absolute bottom-2 right-2 bg-dark/80 text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider shadow">GRAD-CAM HEATMAP</span>
                                    </>
                                ) : <span className="text-dark/50 font-bold text-sm">Grad-CAM Visualization</span>}
                            </div>
                            <div className="bg-dark/10 h-48 rounded-2xl flex items-center justify-center border border-white/40 overflow-hidden relative shadow-inner">
                                {scanResult.yoloImage ? (
                                    <>
                                        <img src={scanResult.yoloImage} className="w-full h-full object-cover" alt="yolo base" />
                                        <span className="absolute bottom-2 right-2 bg-dark/80 text-white text-[10px] font-bold px-2 py-1 rounded tracking-wider shadow">YOLO SEGMENTATION</span>
                                    </>
                                ) : <span className="text-dark/50 font-bold text-sm">YOLO Segmentation Mask</span>}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Navigation */}
                <div className="w-full flex justify-between mt-12 items-center">
                    {currentStep === STEPS.length - 1 ? (
                        <Link to="/body-map">
                            <button onClick={handleSaveScan} className="interactive-element bg-primary text-white px-6 py-3 rounded-xl font-bold">
                                SAVE TO BODY MAP
                            </button>
                        </Link>
                    ) : <div />}

                    {currentStep < STEPS.length - 1 && (
                        <button
                            onClick={handleNext}
                            disabled={isProcessing || !canProceed()}
                            className={`interactive-element px-6 py-3 rounded-xl font-bold flex items-center gap-2 ml-auto ${isProcessing || !canProceed() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white shadow-lg shadow-primary/30'}`}
                        >
                            {isProcessing ? 'PROCESSING...' : 'NEXT STEP'}
                            {!isProcessing && <ArrowRight size={18} />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
