import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DOCTORS, DEPARTMENTS } from '../data';
import { Search, Filter, Mail, Phone, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Doctors() {
  const [selectedDept, setSelectedDept] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDoctors = DOCTORS.filter(dr => {
    const matchesDept =
  selectedDept === 'all' ||
  dr.departmentId?.trim().toLowerCase() === selectedDept?.trim().toLowerCase();
    const matchesSearch = dr.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         dr.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6 text-center md:text-left">
            Our Medical <span className="text-brand-primary">Specialists</span>
          </h1>
          <p className="text-slate-600 max-w-2xl text-lg mb-10 text-center md:text-left">
            Meet our team of world-class healthcare professionals dedicated to providing the best treatment.
          </p>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search by name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => setSelectedDept('all')}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  selectedDept === 'all' 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-primary'
                }`}
              >
                All Specialists
              </button>
              {DEPARTMENTS.map(dept => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    selectedDept === dept.id 
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-primary'
                  }`}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredDoctors.map((dr, i) => (
              <motion.div
                key={dr.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group bg-[#FDFCFB] rounded-[32px] overflow-hidden border border-brand-slate/5 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
  src={dr.image} 
  alt={dr.name} 
  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
  referrerPolicy="no-referrer"
  onError={(e) => {
    e.currentTarget.src = "https://via.placeholder.com/300x200?text=Doctor";
  }}
/>
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-slate/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 bg-brand-primary text-white text-[10px] uppercase font-bold py-1 px-3 rounded-full tracking-widest">
                    {dr.experience} Exp.
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold font-serif text-brand-slate">{dr.name}</h3>
                    <p className="text-brand-secondary text-sm font-semibold italic">{dr.specialty}</p>
                  </div>
                  <div className="space-y-2 mb-6">
                    <p className="text-[10px] text-brand-slate/50 bg-brand-bg/50 p-2 rounded-lg flex items-center gap-2 uppercase tracking-tight font-bold">
                      {dr.education}
                    </p>
                    {dr.city && (
                      <p className="text-[10px] text-brand-slate/60 flex items-center gap-2 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary"></span>
                        {dr.city}
                      </p>
                    )}
                    {dr.availability && (
                      <p className="text-[10px] text-brand-secondary font-bold uppercase tracking-widest mt-1">
                        Available: {dr.availability}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <Link 
                      to="/appointment"
                      className="flex items-center justify-center gap-2 py-3 bg-brand-slate text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-slate/90 transition-colors w-full"
                    >
                      <Calendar className="h-3 w-3" /> Book Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6 text-slate-400">
              <Search className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No doctors found</h3>
            <p className="text-slate-500">Try adjusting your search filters to find a specialist.</p>
          </div>
        )}
      </div>
    </div>
  );
}
