import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Camera, Brain, AlertCircle, Calendar, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { analyzeSymptomImage, AIDiagnosisResult } from '../services/aiDiagnosis';
import { DEPARTMENTS, DOCTORS } from '../data';
import { cn } from '../lib/utils';

export default function AIScreening() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIDiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size too large. Please upload an image smaller than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setError(null);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      const analysis = await analyzeSymptomImage(base64Data, mimeType);
      setResult(analysis);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-emerald-500 bg-emerald-50';
      case 'Medium': return 'text-amber-500 bg-amber-50';
      case 'Low': return 'text-rose-500 bg-rose-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-bold mb-6 uppercase tracking-widest"
          >
            <Brain className="h-4 w-4" /> AI Healthcare
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">
            Smart Disease <span className="text-brand-primary">Detection</span>
          </h1>
          <p className="text-slate-600 text-lg">
            Upload a clear image of your visible symptoms for an instant AI-powered health assessment and doctor recommendation.
          </p>
        </div>

        {!result ? (
          <motion.div 
            layout
            className="bg-[#FDFCFB] border border-brand-slate/5 rounded-[32px] p-8 md:p-12 shadow-xl shadow-brand-slate/5 overflow-hidden"
          >
            <div className="flex flex-col items-center">
              {!image ? (
                <div className="w-full">
                  <label className="group relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-brand-slate/10 rounded-[2rem] cursor-pointer hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Upload className="h-10 w-10 text-brand-primary" />
                      </div>
                      <p className="text-xl font-bold font-serif mb-2 text-brand-slate">Drop your image here</p>
                      <p className="text-slate-500 text-sm">or click to browse gallery (Max 5MB)</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                  
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { icon: Camera, title: 'Clear Quality', desc: 'Ensure good lighting' },
                      { icon: AlertCircle, title: 'Single Symptom', desc: 'Focus on one area' },
                      { icon: CheckCircle2, title: 'Fixed Focus', desc: 'Keep image sharp' },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white border border-brand-slate/5">
                        <item.icon className="h-6 w-6 text-brand-secondary shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-brand-slate">{item.title}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <div className="relative rounded-[2rem] overflow-hidden group shadow-2xl mb-8">
                    <img src={image} alt="Upload preview" className="w-full h-auto max-h-[500px] object-contain bg-brand-slate/5" />
                    <button 
                      onClick={() => setImage(null)}
                      className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-600 hover:text-rose-500 shadow-lg transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-brand-slate/40 backdrop-blur-md flex flex-col items-center justify-center text-white">
                        <div className="relative">
                           <RefreshCw className="h-16 w-16 animate-spin text-brand-accent mb-6" />
                           <motion.div 
                             initial={{ scale: 0 }}
                             animate={{ scale: [1, 1.2, 1] }}
                             transition={{ repeat: Infinity, duration: 1.5 }}
                             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                           >
                             <Brain className="h-6 w-6 text-white" />
                           </motion.div>
                        </div>
                        <p className="text-2xl font-bold font-serif mb-2">Analyzing Symptoms...</p>
                        <p className="text-white/80 animate-pulse">Running advanced AI diagnostics</p>
                        
                        {/* Fake steps for progress */}
                        <div className="mt-8 flex gap-8">
                           <div className="flex flex-col items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
                             <span className="text-[10px] font-bold uppercase tracking-widest">Scanning</span>
                           </div>
                           <div className="flex flex-col items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-brand-accent animate-ping"></div>
                             <span className="text-[10px] font-bold uppercase tracking-widest">Processing</span>
                           </div>
                           <div className="flex flex-col items-center gap-2 opacity-40">
                             <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
                             <span className="text-[10px] font-bold uppercase tracking-widest">Mapping</span>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {!isAnalyzing && (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={startAnalysis}
                        className="flex-1 py-5 bg-brand-primary text-white rounded-2xl font-bold text-lg hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-brand-primary/20"
                      >
                        <Brain className="h-6 w-6" /> Analyze Now
                      </button>
                      <button 
                        onClick={() => setImage(null)}
                        className="px-8 py-5 border-2 border-brand-slate/10 rounded-2xl font-bold text-slate-600 hover:bg-brand-slate/5 transition-all"
                      >
                        Retake
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
                  <img src={image!} alt="Original upload" className="w-full h-auto aspect-square object-cover" />
                </div>
                <button 
                  onClick={() => {setResult(null); setImage(null);}}
                  className="w-full mt-6 py-4 flex items-center justify-center gap-2 text-brand-slate font-bold border border-brand-slate/10 rounded-2xl hover:bg-brand-slate/5 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" /> Start New Test
                </button>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div className="bg-white border border-brand-slate/5 rounded-[32px] p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      getConfidenceColor(result.confidence)
                    )}>
                      {result.confidence} Confidence
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">AI Analysis Result</span>
                  </div>
                  <h2 className="text-3xl font-bold font-serif text-brand-slate mb-4 italic">{result.condition}</h2>
                  
                  <div className="space-y-4 mb-6">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Detected Symptoms</p>
                    <div className="flex flex-wrap gap-2">
                      {result.symptoms.map((s, idx) => (
                        <div key={idx} className="px-4 py-2 bg-brand-bg rounded-xl text-brand-slate font-medium text-sm flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-brand-primary" /> {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recommended Precautions</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {result.precautions.map((p, idx) => (
                        <div key={idx} className="p-3 bg-brand-primary/5 border border-brand-primary/10 rounded-xl text-brand-slate text-xs flex gap-3 italic">
                          <span className="text-brand-primary font-bold">•</span>
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-brand-secondary/5 border border-brand-secondary/10 rounded-2xl flex gap-4">
                    <AlertCircle className="h-5 w-5 text-brand-secondary shrink-0" />
                    <p className="text-xs text-brand-secondary font-medium italic">{result.disclaimer}</p>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-brand-slate text-white rounded-[32px] p-8 shadow-xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                       <Brain className="h-6 w-6 text-brand-accent" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-accent/60">Recommended Action</p>
                      <p className="text-xl font-bold font-serif">Consult a specialist in {DEPARTMENTS.find(d => d.id === result.departmentId)?.name || 'General Medicine'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.suggestedDoctors.map((drId) => {
                      const dr = DOCTORS.find(d => d.id === drId);
                      if (!dr) return null;
                      return (
                        <motion.div 
                          key={dr.id}
                          className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 group hover:bg-white/10 transition-colors"
                        >
                          <img src={dr.image} alt={dr.name} className="w-16 h-16 rounded-xl object-cover" />
                          <div className="flex flex-col justify-between">
                            <div>
                              <p className="text-sm font-bold">{dr.name}</p>
                              <p className="text-[10px] text-white/60">{dr.specialty}</p>
                            </div>
                            <button 
                              onClick={() => navigate('/appointment', { state: { doctorId: dr.id, departmentId: dr.departmentId }})}
                              className="text-[10px] font-bold uppercase tracking-widest text-brand-accent mt-2 flex items-center gap-1 hover:underline"
                            >
                              <Calendar className="h-3 w-3" /> Book Now
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-600"
          >
            <AlertCircle className="h-5 w-5" />
            <p className="font-semibold">{error}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
