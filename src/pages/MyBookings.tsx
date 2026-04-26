import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { DEPARTMENTS, DOCTORS } from '../data';
import { Calendar, Clock, User, Stethoscope, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Booking {
  id: string;
  patientName: string;
  departmentId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
}

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      setBookings(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getDepartmentName = (id: string) => {
    return DEPARTMENTS.find(d => d.id === id)?.name || id;
  };

  const getDoctorName = (id: string) => {
    return DOCTORS.find(d => d.id === id)?.name || 'General Physician';
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-brand-slate tracking-tight mb-4">My <span className="text-brand-primary italic font-medium">Appointments</span></h1>
          <p className="text-slate-500">Track and manage your upcoming medical visits.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-brand-primary animate-spin mb-4" />
            <p className="text-slate-400 font-medium tracking-wide uppercase text-xs">Loading appointments...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-slate-50 rounded-[40px] p-16 text-center border border-slate-100 flex flex-col items-center">
             <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
                <Calendar className="h-10 w-10 text-slate-300" />
             </div>
             <h2 className="text-2xl font-bold text-brand-slate mb-3">No Appointments Found</h2>
             <p className="text-slate-500 max-w-sm mb-8">You haven't scheduled any medical visits yet. Our specialists are ready to help.</p>
             <a 
              href="/appointment" 
              className="px-10 py-4 bg-brand-primary text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-brand-primary/20 transition-all"
             >
               Book Your First Slot
             </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings.map((booking, i) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                  <Stethoscope className="h-24 w-24" />
                </div>

                <div className="flex justify-between items-start mb-6">
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    booking.status === 'pending' ? "bg-amber-100 text-amber-700" :
                    booking.status === 'confirmed' ? "bg-emerald-100 text-emerald-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {booking.status}
                  </div>
                  <span className="text-slate-400 text-xs font-bold font-mono">
                    {booking.createdAt?.toDate ? booking.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-4">
                   <div>
                      <h3 className="text-2xl font-bold text-brand-slate mb-1">{getDepartmentName(booking.departmentId)}</h3>
                      <p className="text-slate-500 font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-brand-primary/50" />
                        {getDoctorName(booking.doctorId)}
                      </p>
                   </div>

                   <div className="pt-4 border-t border-slate-50 space-y-3">
                      <div className="flex items-center gap-3 text-slate-600">
                         <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-brand-primary" />
                         </div>
                         <span className="font-bold text-sm tracking-tight">{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                         <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
                            <Clock className="h-4 w-4 text-brand-primary" />
                         </div>
                         <span className="font-bold text-sm tracking-tight">{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                         <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
                            <User className="h-4 w-4 text-brand-primary" />
                         </div>
                         <span className="font-bold text-sm tracking-tight">{booking.patientName}</span>
                      </div>
                   </div>
                </div>

                {booking.status === 'pending' && (
                  <div className="mt-8 flex items-center gap-2 p-3 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <AlertCircle className="h-4 w-4 text-brand-primary/60" />
                    <p className="text-[10px] text-slate-500 font-medium italic">Our team will call to confirm.</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
