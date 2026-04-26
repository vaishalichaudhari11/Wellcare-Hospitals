import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Activity, Users, Award, ShieldCheck, Stethoscope, Heart, Brain, CheckCircle2, Star } from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data';

const stats = [
  { label: 'Specialist Doctors', value: '50+', icon: Users },
  { label: 'Modern Labs', value: '15+', icon: Activity },
  { label: 'Patient Recovered', value: '25k+', icon: Heart },
  { label: 'Years of Excellence', value: '25+', icon: Award },
];

// Specific doctors for the homepage as per requirements
const HOMEPAGE_DOCTOR_NAMES = [
  'Dr. Ananya Sharma',
  'Dr. Rajesh Deshmukh',
  'Dr. Meenakshi Iyer',
  'Dr. Sanjay Gupta',
  'Dr. Sunita Kulkarni',
  'Dr. Arvind Mehra',
  'Dr. Pradeep Verma',
  'Dr. Shalini Mukherjee',
  'Dr. Vivek Malhotra',
  'Dr. Kavita Reddy'
];

const homeDoctors = DOCTORS.filter(dr => HOMEPAGE_DOCTOR_NAMES.includes(dr.name));

export default function Home() {
  return (
    <div className="overflow-hidden">
      <section className="relative min-h-screen flex items-center pt-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-brand-primary/5 text-brand-primary text-[11px] font-bold uppercase tracking-[0.2em] mb-10 border border-brand-primary/10">
                  <ShieldCheck className="h-4 w-4" />
                  Trusted Healthcare in Gujarat
                </div>
                <h1 className="text-7xl md:text-8xl font-black text-brand-slate leading-[0.95] tracking-tight mb-10 selection:bg-brand-primary/20">
                  Where <span className="text-brand-primary italic font-medium">Care</span><br />
                  Meets<br />
                  Technology
                </h1>
                <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Experience the next generation of healthcare with WellCare. Our AI-powered platform makes diagnostics faster, appointments seamless, and care more personalized than ever before.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                  <Link 
                    to="/appointment" 
                    className="px-10 py-5 bg-brand-primary text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-brand-primary/30 transition-all hover:-translate-y-1 active:translate-y-0"
                  >
                    Confirm Booking
                  </Link>
                  <Link 
                    to="/departments" 
                    className="px-10 py-5 bg-slate-50 text-slate-600 rounded-2xl font-bold text-lg border border-slate-100 hover:bg-white hover:border-brand-primary transition-all"
                  >
                    Our Departments
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="flex-1 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-[48px] overflow-hidden shadow-2xl shadow-slate-200 aspect-[5/6] max-w-[500px] mx-auto">
                  <img 
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200" 
                    alt="Modern Hospital Room" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Next Slot Card Overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 20, x: 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="absolute -top-10 -right-4 md:-right-10 bg-white rounded-[32px] p-8 shadow-2xl z-20 border border-slate-50 min-w-[300px]"
                >
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                       <Activity className="h-7 w-7 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-brand-slate">Next Slot</p>
                    </div>
                  </div>
                  <div className="space-y-1 mb-6">
                    <p className="text-slate-500 font-medium text-lg">Dr. Ananya Sharma</p>
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">(Cardiology)</p>
                  </div>
                  <p className="text-brand-primary text-2xl font-black tracking-tight">Today, 4:30 PM</p>
                </motion.div>

                {/* Floating Elements */}
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-brand-accent/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl"></div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hidden md:block">
          <div className="bg-white rounded-[2rem] shadow-[0_10px_30_rgba(0,0,0,0.03)] py-8 px-12 grid grid-cols-4 gap-8 border border-brand-bg">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="bg-brand-primary/10 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                  <stat.icon className="h-6 w-6 text-brand-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-slate uppercase font-serif tracking-tight">{stat.value}</div>
                  <div className="text-[10px] text-brand-slate/50 font-bold uppercase tracking-widest">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose WellCare?</h2>
            <p className="text-slate-600">We provide a full range of medical services with a team of highly qualified specialists and the latest medical equipment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Emergency Care', desc: '24/7 emergency services with immediate response and specialized critical care units.', icon: Activity },
              { title: 'Expert Doctors', desc: 'Our team includes world-renowned specialists across all medical fields.', icon: Stethoscope },
              { title: 'Advanced Technology', desc: 'Equipped with the latest diagnostic and surgical technologies for precise treatment.', icon: ShieldCheck },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#FDFCFB] p-8 rounded-[32px] border border-brand-slate/5 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="bg-brand-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-primary transition-colors">
                  <feature.icon className="h-7 w-7 text-brand-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-serif text-brand-slate">{feature.title}</h3>
                <p className="text-brand-slate/60 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI AI Section */}
      <section className="py-24 relative overflow-hidden bg-[#FDFCFB]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-slate rounded-[48px] p-8 md:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_var(--color-brand-accent)_0%,_transparent_50%)]"></div>
            </div>
            
            <div className="flex-1 relative z-10 text-center lg:text-left mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-brand-accent text-[10px] font-bold uppercase tracking-widest mb-6">
                <Brain className="h-4 w-4" /> AI-Powered Health
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-6 leading-tight">
                Smart Symptom <span className="text-brand-accent italic">Detection</span>
              </h2>
              <p className="text-white/70 text-lg mb-10 max-w-xl">
                Can't decide which doctor to see? Upload a photo of your symptoms or injury, and our advanced AI will analyze it to recommend the right specialist for you.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  'Instant image-based analysis',
                  'Automatic department mapping',
                  'Direct specialist recommendations',
                  'Privacy-first secure handling'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/90 font-medium">
                    <div className="w-5 h-5 bg-brand-accent/20 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3 text-brand-accent" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Link 
                to="/ai-diagnosis" 
                className="inline-flex items-center gap-3 px-10 py-5 bg-brand-accent text-brand-slate rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-brand-accent/10"
              >
                Try AI Screening <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

          </div>
        </div>
      </section>
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 italic">Our Specializations</h2>
              <p className="text-slate-600">Explore our diverse range of specialized medical departments, each staffed with experts dedicated to your health.</p>
            </div>
            <Link to="/departments" className="text-brand-primary font-bold flex items-center gap-1 hover:gap-3 transition-all">
              View All Departments <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEPARTMENTS.slice(0, 4).map((dept, i) => (
              <Link to={`/departments`} key={dept.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative h-80 rounded-3xl overflow-hidden shadow-lg hover:-translate-y-2 transition-all"
                >
                  <img 
                    src={dept.image} 
                    alt={dept.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{dept.name}</h3>
                    <p className="text-white/70 text-xs line-clamp-2">{dept.description}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Our Experts Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black text-brand-slate mb-4">
                Our <span className="text-brand-primary italic">Top Specialists</span>
              </h2>
              <p className="text-slate-500 text-lg">Meet our world-class medical team dedicated to providing you with the best care.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {homeDoctors.map((dr, i) => (
              <motion.div
                key={dr.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 group hover:shadow-2xl hover:-translate-y-2 transition-all"
              >
                <div className="relative mb-6">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                    <img src={dr.image} alt={dr.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-bold text-brand-slate">4.9</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-brand-slate text-sm line-clamp-1">{dr.name}</h4>
                  <p className="text-brand-primary text-[10px] font-bold uppercase tracking-wider">
                    {DEPARTMENTS.find(d => d.id === dr.departmentId)?.name}
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <div className="w-6 h-6 bg-slate-50 rounded flex items-center justify-center">
                       <Award className="h-3 w-3 text-slate-400" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{dr.experience} Exp</span>
                  </div>
                </div>
                <Link 
                  to="/appointment" 
                  state={{ doctorId: dr.id }}
                  className="mt-6 block w-full py-3 bg-brand-primary/5 text-brand-primary rounded-xl text-center text-xs font-bold hover:bg-brand-primary hover:text-white transition-all"
                >
                  Book Visit
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-primary z-0">
           <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2000" 
            alt="Doctors" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">Ready to take the first step towards better health?</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">Skip the queue and book your consultation online today. Our specialists are here to help you.</p>
            <Link 
              to="/appointment" 
              className="inline-block px-10 py-5 bg-white text-brand-primary rounded-full font-bold text-lg shadow-xl hover:bg-brand-light transition-colors"
            >
              Book an Appointment Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
