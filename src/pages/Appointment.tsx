import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, Link } from 'react-router-dom';
import { DEPARTMENTS, DOCTORS, CITIES } from '../data';
import { CheckCircle2, AlertCircle, Calendar, Clock, User, Mail, Phone, MessageSquare, ChevronRight, Stethoscope, Lock, MapPin } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import AuthModal from '../components/auth/AuthModal';

export default function Appointment() {
  const location = useLocation();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    phone: '',
    city: '',
    departmentId: '',
    doctorId: '',
    date: '',
    time: '',
    reason: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        patientName: user.displayName || prev.patientName,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    const state = location.state as { doctorId?: string; departmentId?: string; symptom?: string };
    if (state) {
      const doctor = state.doctorId ? DOCTORS.find(d => d.id === state.doctorId) : null;
      setFormData(prev => ({
        ...prev,
        doctorId: state.doctorId || '',
        departmentId: state.departmentId || doctor?.departmentId || '',
        city: doctor?.city || prev.city,
        reason: state.symptom ? `Auto-suggested based on: ${state.symptom}` : prev.reason
      }));
      if (state.doctorId || (state.departmentId && doctor?.city)) {
        setStep(2);
      }
    }
  }, [location.state]);

  const [availableDoctors, setAvailableDoctors] = useState(DOCTORS);

  useEffect(() => {
    let filtered = DOCTORS;
    if (formData.city) {
      filtered = filtered.filter(dr => dr.city === formData.city);
    }
    if (formData.departmentId) {
      filtered = filtered.filter(dr => dr.departmentId === formData.departmentId);
    }
    setAvailableDoctors(filtered);

    // Reset doctor if not in filtered list
    if (formData.doctorId && !filtered.find(d => d.id === formData.doctorId)) {
      setFormData(prev => ({ ...prev, doctorId: '' }));
    }
  }, [formData.city, formData.departmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        ...formData,
        userId: user.uid,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setIsSuccess(true);
    } catch (err) {
      console.error('Error saving booking:', err);
      alert('Failed to save appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  if (isSuccess) {
    return (
      <div className="pt-40 pb-24 min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl text-center max-w-lg mx-4 border border-slate-100"
        >
          <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-10 w-10 text-brand-primary" />
          </div>
          <h2 className="text-3xl font-bold font-serif mb-4 text-brand-slate">Appointment Confirmed!</h2>
          <p className="text-slate-600 mb-8">
            Thank you, <span className="font-bold text-slate-800">{formData.patientName}</span>. Your appointment has been scheduled for <span className="font-bold text-slate-800">{formData.date}</span> at <span className="font-bold text-slate-800">{formData.time}</span>.
          </p>
          <Link 
            to="/"
            className="block w-full py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-primary/90 transition-colors shadow-lg"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-brand-slate leading-tight mb-4 tracking-tighter">
            Book an <span className="text-brand-primary italic font-medium">Appointment</span>
          </h1>
          <p className="text-slate-500 text-lg">Quick and easy online scheduling with our experts.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-4 mb-16">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all border-2",
                step === s ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20" : 
                step > s ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-slate-300 border-slate-100"
              )}>
                {step > s ? <CheckCircle2 className="h-6 w-6" /> : s}
              </div>
              {s < 4 && (
                <div className={cn(
                  "w-16 h-1 mx-2 rounded-full",
                  step > s ? "bg-emerald-500" : "bg-slate-100"
                )} />
              )}
            </div>
          ))}
        </div>

        {!user && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Lock className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <p className="font-bold text-brand-slate">Sign in is required</p>
                <p className="text-sm text-slate-500 italic">Please log in to your account to continue with the booking.</p>
              </div>
            </div>
            <button 
              onClick={() => setAuthModalOpen(true)}
              className="px-6 py-2.5 bg-brand-primary text-white rounded-xl font-bold text-sm shadow-md"
            >
              Sign In Now
            </button>
          </motion.div>
        )}

        <div className="bg-brand-slate rounded-[40px] shadow-2xl overflow-hidden text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Calendar className="h-32 w-32" />
          </div>
          
          <form onSubmit={handleSubmit} className="p-10 md:p-14 relative z-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h3 className="text-3xl font-bold font-serif mb-8 flex items-center gap-4">
                    <MapPin className="h-8 w-8 text-brand-accent" /> Location & Specialty
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/50 ml-1">Select City</label>
                      <select 
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-white appearance-none"
                      >
                        <option value="" className="bg-brand-slate">Choose City</option>
                        {CITIES.map(city => (
                          <option key={city} value={city} className="bg-brand-slate">{city}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/50 ml-1">Medical Department</label>
                      <select 
                        required
                        value={formData.departmentId}
                        onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                        className="w-full px-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-white appearance-none"
                      >
                        <option value="" className="bg-brand-slate">Choose Department</option>
                        {DEPARTMENTS.map(dept => (
                          <option key={dept.id} value={dept.id} className="bg-brand-slate">{dept.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="pt-8 flex justify-end">
                    <button 
                      type="button"
                      onClick={handleNext}
                      disabled={!formData.city || !formData.departmentId}
                      className="px-12 py-5 bg-brand-primary text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-xl shadow-brand-primary/20"
                    >
                      Choose Doctor <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h3 className="text-3xl font-bold font-serif mb-8 flex items-center gap-4">
                    <Stethoscope className="h-8 w-8 text-brand-accent" /> Available Doctors
                  </h3>
                  <div className="space-y-4">
                    <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/50 ml-1">Select Your Doctor</label>
                    <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {availableDoctors.map(dr => (
                        <div 
                          key={dr.id}
                          onClick={() => setFormData({ ...formData, doctorId: dr.id })}
                          className={cn(
                            "p-6 rounded-2xl border transition-all cursor-pointer flex items-center gap-6",
                            formData.doctorId === dr.id ? "bg-brand-primary border-brand-primary" : "bg-white/5 border-white/10 hover:bg-white/10"
                          )}
                        >
                          <img src={dr.image} alt={dr.name} className="w-16 h-16 rounded-xl object-cover" />
                          <div className="flex-1">
                            <p className="font-bold text-lg">{dr.name}</p>
                            <p className="text-white/60 text-sm">{dr.specialty}</p>
                            <p className="text-brand-accent text-xs mt-1">{dr.experience}</p>
                          </div>
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                            formData.doctorId === dr.id ? "bg-white border-white" : "border-white/20"
                          )}>
                            {formData.doctorId === dr.id && <CheckCircle2 className="h-4 w-4 text-brand-primary" />}
                          </div>
                        </div>
                      ))}
                      {availableDoctors.length === 0 && (
                        <div className="p-8 text-center bg-white/5 border border-white/10 rounded-2xl">
                          <p className="text-white/60">No doctors found in {formData.city} for {DEPARTMENTS.find(d => d.id === formData.departmentId)?.name}.</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="pt-8 flex justify-between">
                    <button 
                      type="button"
                      onClick={handleBack}
                      className="px-8 py-4 text-white/40 hover:text-white transition-all font-bold text-lg"
                    >
                      Back
                    </button>
                    <button 
                      type="button"
                      onClick={handleNext}
                      disabled={!formData.doctorId}
                      className="px-12 py-5 bg-brand-primary text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-brand-primary/90 transition-all disabled:opacity-50 text-lg"
                    >
                      Next Step <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h3 className="text-3xl font-bold font-serif mb-8 flex items-center gap-4">
                    <User className="h-8 w-8 text-brand-accent" /> Patient Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/50 ml-1">Full Name</label>
                      <input 
                        required
                        type="text"
                        placeholder="e.g. John Doe"
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        className="w-full px-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-white placeholder:text-white/20"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/50 ml-1">Phone Number</label>
                      <input 
                        required
                        type="tel"
                        placeholder="+91 0000000000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-white placeholder:text-white/20"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/50 ml-1">Email Address</label>
                      <input 
                        required
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-white placeholder:text-white/20"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/50 ml-1">Additional Reason/Symptoms</label>
                      <textarea 
                        placeholder="Briefly describe your health concern..."
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        rows={4}
                        className="w-full px-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-white placeholder:text-white/20 resize-none"
                      />
                    </div>
                  </div>
                  <div className="pt-8 flex justify-between">
                    <button 
                      type="button"
                      onClick={handleBack}
                      className="px-8 py-4 text-white/40 hover:text-white transition-all font-bold text-lg"
                    >
                      Back
                    </button>
                    <button 
                      type="button"
                      onClick={handleNext}
                      disabled={!formData.patientName || !formData.email || !formData.phone}
                      className="px-12 py-5 bg-brand-primary text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-brand-primary/90 transition-all disabled:opacity-50 text-lg shadow-xl shadow-brand-primary/20"
                    >
                      Select Schedule <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h3 className="text-3xl font-bold font-serif mb-8 flex items-center gap-4">
                    <Calendar className="h-8 w-8 text-brand-accent" /> Select Slot
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/50 ml-1">Appointment Date</label>
                      <input 
                        required
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-white inverted-date-picker"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/50 ml-1">Time Slot</label>
                      <select 
                        required
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full px-6 py-4.5 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all text-white appearance-none"
                      >
                        <option value="" className="bg-brand-slate">Choose Time</option>
                        <option value="09:00 AM" className="bg-brand-slate">09:00 AM</option>
                        <option value="10:00 AM" className="bg-brand-slate">10:00 AM</option>
                        <option value="11:00 AM" className="bg-brand-slate">11:00 AM</option>
                        <option value="12:00 PM" className="bg-brand-slate">12:00 PM</option>
                        <option value="02:00 PM" className="bg-brand-slate">02:00 PM</option>
                        <option value="03:00 PM" className="bg-brand-slate">03:00 PM</option>
                        <option value="04:00 PM" className="bg-brand-slate">04:00 PM</option>
                        <option value="05:00 PM" className="bg-brand-slate">05:00 PM</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-8 flex justify-between">
                    <button 
                      type="button"
                      onClick={handleBack}
                      className="px-8 py-4 text-white/40 hover:text-white transition-all font-bold text-lg"
                    >
                      Back
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting || !formData.date || !formData.time}
                      className="px-14 py-5 bg-brand-primary text-white rounded-2xl font-bold shadow-2xl shadow-brand-primary/30 flex items-center justify-center gap-3 hover:bg-brand-primary/90 transition-all disabled:opacity-50 text-xl"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          Scheduling...
                        </>
                      ) : 'Confirm Booking'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Note */}
        <div className="mt-12 flex items-start gap-5 p-8 bg-blue-50/50 rounded-[32px] border border-blue-100/50">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            <AlertCircle className="h-6 w-6 text-brand-primary" />
          </div>
          <p className="text-slate-500 leading-relaxed italic text-sm">
             <strong>Note:</strong> Online appointments are subject to final verification. Our team will contact you shortly to confirm your booked slot. For emergencies, please contact our 24/7 helpline immediately.
          </p>
        </div>
      </div>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialMode="login"
      />
    </div>
  );
}
