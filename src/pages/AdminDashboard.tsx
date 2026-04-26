import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { DEPARTMENTS, DOCTORS, CITIES } from '../data';
import { 
  Users, 
  User,
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock3, 
  Trash2, 
  Plus,
  LayoutDashboard,
  Stethoscope,
  MoreVertical,
  X,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Booking {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  city?: string;
  departmentId: string;
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
  userId?: string;
}

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'add'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // New Booking State
  const [newBooking, setNewBooking] = useState({
    patientName: '',
    email: '',
    phone: '',
    city: '',
    departmentId: '',
    doctorId: '',
    date: '',
    time: '',
    reason: 'Admin Entry',
  });

  const [availableDoctors, setAvailableDoctors] = useState(DOCTORS);

  useEffect(() => {
    let filtered = DOCTORS;
    if (newBooking.city) {
      filtered = filtered.filter(dr => dr.city === newBooking.city);
    }
    if (newBooking.departmentId) {
      filtered = filtered.filter(dr => dr.departmentId === newBooking.departmentId);
    }
    setAvailableDoctors(filtered);
    
    // Reset doctor if not in filtered list
    if (newBooking.doctorId && !filtered.find(d => d.id === newBooking.doctorId)) {
      setNewBooking(prev => ({ ...prev, doctorId: '' }));
    }
  }, [newBooking.city, newBooking.departmentId]);

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Booking[];
      setBookings(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const handleUpdateStatus = async (id: string, status: string) => {
    setIsUpdating(id);
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        ...newBooking,
        status: 'confirmed',
        createdAt: serverTimestamp(),
        adminCreated: true,
      });
      setView('list');
      setNewBooking({
        patientName: '',
        email: '',
        phone: '',
        departmentId: '',
        doctorId: '',
        date: '',
        time: '',
        reason: 'Admin Entry',
      });
    } catch (err) {
      console.error(err);
      alert('Failed to add booking');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="pt-40 text-center">Checking credentials...</div>;
  if (!isAdmin) return (
    <div className="pt-40 text-center px-4">
      <div className="max-w-md mx-auto bg-white p-12 rounded-[3rem] shadow-2xl border border-red-100">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold font-serif mb-4 text-brand-slate">Access Denied</h2>
        <p className="text-slate-500">Only authorized hospital administrators can access this portal.</p>
        <a href="/" className="mt-8 block py-4 bg-brand-primary text-white rounded-2xl font-bold">Back to Home</a>
      </div>
    </div>
  );

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || b.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-brand-slate tracking-tight flex items-center gap-4">
              <div className="bg-brand-primary p-2 rounded-2xl">
                <LayoutDashboard className="h-8 w-8 text-white" />
              </div>
              Admin <span className="text-brand-primary italic font-medium">Portal</span>
            </h1>
            <p className="text-slate-500 mt-2">Manage hospital appointments and patient records.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setView(view === 'list' ? 'add' : 'list')}
              className={cn(
                "px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl",
                view === 'list' ? "bg-brand-primary text-white hover:bg-brand-secondary" : "bg-white text-brand-slate border border-slate-200"
              )}
            >
              {view === 'list' ? (
                <><Plus className="h-5 w-5" /> Add Booking</>
              ) : (
                <><ChevronRight className="h-5 w-5 rotate-180" /> Back to Dashboard</>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              {/* Controls */}
              <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="Search by patient name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-primary/20 transition-all text-brand-slate"
                  />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl">
                    <Filter className="h-4 w-4 text-slate-400" />
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-transparent border-none text-sm font-bold text-slate-600 focus:ring-0 cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bookings Table/Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredBookings.map((booking) => (
                  <motion.div
                    layout
                    key={booking.id}
                    className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all relative group"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-brand-primary/5 rounded-2xl flex items-center justify-center">
                          <User className="h-7 w-7 text-brand-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-brand-slate">{booking.patientName}</h3>
                          <p className="text-slate-400 text-sm">{booking.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2",
                          booking.status === 'pending' ? "bg-amber-100 text-amber-700" :
                          booking.status === 'confirmed' ? "bg-emerald-100 text-emerald-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {booking.status}
                        </div>
                        <span className="text-[10px] text-slate-300 font-mono">ID: {booking.id.slice(-8)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Department</p>
                        <p className="text-sm font-bold text-brand-slate flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-brand-primary" />
                          {DEPARTMENTS.find(d => d.id === booking.departmentId)?.name || 'General'}
                        </p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Schedule</p>
                        <p className="text-sm font-bold text-brand-slate flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-brand-primary" />
                          {booking.date}
                          <span className="mx-1 text-slate-300">|</span>
                          <Clock className="h-4 w-4 text-brand-primary" />
                          {booking.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        {booking.status === 'pending' && (
                          <button 
                            onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                            className="bg-emerald-500 text-white p-2.5 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                            title="Confirm Booking"
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </button>
                        )}
                        {booking.status !== 'cancelled' && (
                          <button 
                            onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                            className="bg-amber-500 text-white p-2.5 rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20"
                            title="Cancel Booking"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(booking.id)}
                          className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          title="Delete Record"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-300 italic">Created: {booking.createdAt?.toDate ? booking.createdAt.toDate().toLocaleDateString() : 'Recently'}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="add-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-brand-slate p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                  <Plus className="h-48 w-48" />
                </div>
                
                <h3 className="text-3xl font-bold font-serif mb-12 flex items-center gap-4 relative z-10">
                  <Plus className="h-8 w-8 text-brand-accent" /> New Hospital Entry
                </h3>
                
                <form onSubmit={handleAddBooking} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-widest text-white/40 ml-1">Patient Name</label>
                      <input 
                        required
                        type="text"
                        value={newBooking.patientName}
                        onChange={(e) => setNewBooking({...newBooking, patientName: e.target.value})}
                        className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-white"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-widest text-white/40 ml-1">Email</label>
                      <input 
                        required
                        type="email"
                        value={newBooking.email}
                        onChange={(e) => setNewBooking({...newBooking, email: e.target.value})}
                        className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-white"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-widest text-white/40 ml-1">City</label>
                      <select 
                        required
                        value={newBooking.city}
                        onChange={(e) => setNewBooking({...newBooking, city: e.target.value})}
                        className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-white appearance-none"
                      >
                        <option value="" className="bg-brand-slate">Choose City</option>
                        {CITIES.map(c => <option key={c} value={c} className="bg-brand-slate">{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-widest text-white/40 ml-1">Department</label>
                      <select 
                        required
                        value={newBooking.departmentId}
                        onChange={(e) => setNewBooking({...newBooking, departmentId: e.target.value})}
                        className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-white appearance-none"
                      >
                        <option value="" className="bg-brand-slate">Choose Department</option>
                        {DEPARTMENTS.map(d => <option key={d.id} value={d.id} className="bg-brand-slate">{d.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-widest text-white/40 ml-1">Preferred Doctor</label>
                      <select 
                        required
                        value={newBooking.doctorId}
                        onChange={(e) => setNewBooking({...newBooking, doctorId: e.target.value})}
                        className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-white appearance-none"
                      >
                        <option value="" className="bg-brand-slate">Choose Doctor</option>
                        {availableDoctors.map(dr => <option key={dr.id} value={dr.id} className="bg-brand-slate">{dr.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-widest text-white/40 ml-1">Phone</label>
                      <input 
                        required
                        type="tel"
                        value={newBooking.phone}
                        onChange={(e) => setNewBooking({...newBooking, phone: e.target.value})}
                        className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-white"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-widest text-white/40 ml-1">Date</label>
                      <input 
                        required
                        type="date"
                        value={newBooking.date}
                        onChange={(e) => setNewBooking({...newBooking, date: e.target.value})}
                        className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-white inverted-date-picker"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[12px] font-bold uppercase tracking-widest text-white/40 ml-1">Time Slot</label>
                      <select 
                        required
                        value={newBooking.time}
                        onChange={(e) => setNewBooking({...newBooking, time: e.target.value})}
                        className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-white appearance-none"
                      >
                        <option value="" className="bg-brand-slate">Choose Time</option>
                        <option value="09:00 AM" className="bg-brand-slate">09:00 AM</option>
                        <option value="10:00 AM" className="bg-brand-slate">10:00 AM</option>
                        <option value="11:00 AM" className="bg-brand-slate">11:00 AM</option>
                        <option value="02:00 PM" className="bg-brand-slate">02:00 PM</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="pt-12 flex justify-end">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="px-16 py-6 bg-brand-accent text-brand-slate rounded-3xl font-black text-xl hover:scale-[1.02] transition-all shadow-2xl shadow-brand-accent/20 disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Create Confirmed Booking'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
