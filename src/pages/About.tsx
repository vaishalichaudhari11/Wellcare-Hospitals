import { motion } from 'motion/react';
import { Target, Eye, Heart, Award, CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold font-serif mb-6"
          >
            Excellence in <span className="text-brand-primary">Healthcare</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 max-w-2xl mx-auto text-lg"
          >
            Founded in 1998, WellCare Hospitals has been at the forefront of medical innovation for over two decades, serving millions with care and dedication.
          </motion.p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 font-serif">Our Hospital Story</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              WellCare Hospitals started as a small clinic with a vision to make quality healthcare accessible to everyone. Today, we have grown into one of the region's leading multi-specialty healthcare providers.
            </p>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Our journey is defined by our commitment to patient-centric care, continuous improvement, and the adoption of cutting-edge technology. We believe that every patient deserves high-quality medical attention delivered with warmth and empathy.
            </p>
            <div className="space-y-4">
              {[
                'Accredited by National Health Board',
                'Awarded "Best Multi-specialty Hospital" 2023',
                'Advanced 24/7 Trauma Care Center',
                'Pioneer in Robotic Assisted Surgery'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-brand-accent" />
                  <span className="font-medium text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1200" 
              alt="Hospital building" 
              className="rounded-3xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-xl hidden md:block">
              <div className="text-4xl font-bold text-brand-primary mb-1">25+</div>
              <div className="text-slate-500 font-medium italic">Years of Trust</div>
            </div>
          </motion.div>
        </div>

        {/* Mission/Vision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: 'Our Mission', 
              desc: 'To provide high-quality healthcare services that are accessible, affordable, and focused on the safety and well-being of our patients.', 
              icon: Target,
              color: 'bg-brand-primary/10 text-brand-primary'
            },
            { 
              title: 'Our Vision', 
              desc: 'To be the most trusted and globally recognized healthcare provider, setting new benchmarks in medical excellence and patient care.', 
              icon: Eye,
              color: 'bg-brand-secondary/10 text-brand-secondary'
            },
            { 
              title: 'Our Values', 
              desc: 'Integrity, Compassion, Innovation, and Excellence are the pillars that guide every decision and action at WellCare.', 
              icon: Heart,
              color: 'bg-brand-accent/20 text-brand-slate'
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[32px] bg-[#FDFCFB] border border-brand-slate/5 shadow-sm hover:shadow-xl transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${item.color}`}>
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-serif">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed italic">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
