import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-brand-accent p-1.5 rounded-lg">
                <Heart className="h-5 w-5 text-white" fill="currentColor" />
              </div>
              <span className="text-xl font-bold font-serif tracking-tight text-white">WellCare <span className="text-brand-accent">Hospitals</span></span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Dedicated to providing world-class healthcare with compassion and excellence. Our team of specialists is committed to your well-being.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-brand-accent transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-brand-accent transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-brand-accent transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-brand-accent transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-serif font-semibold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-brand-accent transition-colors">About Us</Link></li>
              <li><Link to="/departments" className="hover:text-brand-accent transition-colors">Our Departments</Link></li>
              <li><Link to="/doctors" className="hover:text-brand-accent transition-colors">Our Doctors</Link></li>
              <li><Link to="/appointment" className="hover:text-brand-accent transition-colors">Book Appointment</Link></li>
              <li><Link to="#" className="hover:text-brand-accent transition-colors">Career Opportunities</Link></li>
            </ul>
          </div>

          {/* Departments */}
          <div>
            <h3 className="text-white font-serif font-semibold text-lg mb-6">Popular Departments</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/departments" className="hover:text-brand-accent transition-colors">Cardiology</Link></li>
              <li><Link to="/departments" className="hover:text-brand-accent transition-colors">Orthopedics</Link></li>
              <li><Link to="/departments" className="hover:text-brand-accent transition-colors">Neurology</Link></li>
              <li><Link to="/departments" className="hover:text-brand-accent transition-colors">Pediatrics</Link></li>
              <li><Link to="/departments" className="hover:text-brand-accent transition-colors">Laboratory</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-serif font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-accent shrink-0" />
                <span>123 Medical Wellness Ave,<br />Healthcare City, HC 45678</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-accent shrink-0" />
                <span>+1 (800) WELLCARE</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-accent shrink-0" />
                <span>contact@wellcarehospitals.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} WellCare Hospitals. All rights reserved. Designed for excellence in healthcare.</p>
        </div>
      </div>
    </footer>
  );
}
