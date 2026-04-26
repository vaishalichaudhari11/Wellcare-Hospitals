import { motion } from 'motion/react';
import { DEPARTMENTS } from '../data';
import { HeartPulse, Bone, Brain, Baby, Dna, Activity, Stethoscope } from 'lucide-react';

const iconMap: Record<string, any> = {
  HeartPulse,
  Bones: Bone,
  Brain,
  Baby,
  Dna,
  Stethoscope,
};

export default function Departments() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-serif mb-6"
          >
            Specialized <span className="text-brand-primary">Departments</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-lg"
          >
            We offer a comprehensive range of medical services across various specialized departments, all integrated to provide you with the best possible care.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DEPARTMENTS.map((dept, i) => {
            const IconComponent = iconMap[dept.icon] || Activity;
            return (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#FDFCFB] rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all border border-brand-slate/5 group"
              >
                <div className="h-52 overflow-hidden relative">
                  <img 
                    src={dept.image} 
                    alt={dept.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                    <IconComponent className="h-6 w-6 text-brand-primary" />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4 font-serif text-brand-slate">{dept.name}</h3>
                  <p className="text-brand-slate/60 mb-6 leading-relaxed line-clamp-3">
                    {dept.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['Specialized Care', 'Advanced Tech', 'Expert Team'].map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase rounded-lg tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="w-full py-4 border border-brand-slate/10 rounded-2xl text-brand-slate font-bold hover:bg-brand-primary/5 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[11px]">
                    Learn More
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
