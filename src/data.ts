import { Department, Doctor } from './types';

export const CITIES = [
  'Ahmedabad',
  'Surat',
  'Vadodara',
  'Rajkot',
  'Gandhinagar',
  'Bhavnagar'
];

export const DEPARTMENTS: Department[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    description: 'Expert heart care including diagnostics, treatment, and rehabilitation for all cardiac conditions.',
    icon: 'HeartPulse',
    image: 'https://images.unsplash.com/photo-1628595351029-c2bf17511435?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    description: 'Specialized care for bones, joints, and muscles, from sports injuries to complex surgeries.',
    icon: 'Bones',
    image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'neurology',
    name: 'Neurology',
    description: 'Comprehensive neurological care for brain, spine, and nerve disorders.',
    icon: 'Brain',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    description: 'Dedicated healthcare for children from infancy through adolescence in a friendly environment.',
    icon: 'Baby',
    image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'oncology',
    name: 'Oncology',
    description: 'Advanced cancer treatment and support services with a focus on personalized care.',
    icon: 'Dna',
    image: 'https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    description: 'Skin care, acne, rashes, infections, and dermatologist consultation.',
    icon: 'Stethoscope',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800',
  },
];

// Helper to generate doctors for each city/department
const generateDoctors = (): Doctor[] => {
  const doctors: Doctor[] = [
    // Main Homepage Doctors - distributed across cities
    {
      id: 'h1',
      name: 'Dr. Ananya Sharma',
      departmentId: 'cardiology',
      specialty: 'Interventional Cardiology',
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      experience: '15+ Years',
      education: 'MD, DM (Cardiology), FACC',
      city: 'Ahmedabad',
      availability: 'Mon, Wed, Fri'
    },
    {
      id: 'h2',
      name: 'Dr. Rajesh Deshmukh',
      departmentId: 'cardiology',
      specialty: 'Electrophysiology',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
      experience: '12+ Years',
      education: 'MD, DM (Cardiology), PhD',
      city: 'Surat',
      availability: 'Tue, Thu, Sat'
    },
    {
      id: 'h3',
      name: 'Dr. Meenakshi Iyer',
      departmentId: 'orthopedics',
      specialty: 'Sports Medicine',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
      experience: '10+ Years',
      education: 'MS (Ortho), Fellow Sports Medicine',
      city: 'Vadodara',
      availability: 'Mon, Tue, Wed'
    },
    {
      id: 'h4',
      name: 'Dr. Sanjay Gupta',
      departmentId: 'orthopedics',
      specialty: 'Joint Replacement',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
      experience: '20+ Years',
      education: 'MS, MCh (Ortho)',
      city: 'Rajkot',
      availability: 'Wed, Thu, Fri'
    },
    {
      id: 'h5',
      name: 'Dr. Sunita Kulkarni',
      departmentId: 'neurology',
      specialty: 'Clinical Neurology',
      image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=400',
      experience: '18+ Years',
      education: 'MD, DM (Neurology)',
      city: 'Gandhinagar',
      availability: 'Mon, Thu, Sat'
    },
    {
      id: 'h6',
      name: 'Dr. Arvind Mehra',
      departmentId: 'pediatrics',
      specialty: 'General Pediatrics',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      experience: '14+ Years',
      education: 'MD, DCH (Pediatrics)',
      city: 'Bhavnagar',
      availability: 'Tue, Fri, Sun'
    },
    {
      id: 'h7',
      name: 'Dr. Pradeep Verma',
      departmentId: 'cardiology',
      specialty: 'Clinical Cardiology',
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      experience: '22+ Years',
      education: 'MD, DM (Cardiology)',
      city: 'Ahmedabad',
      availability: 'Mon, Tue, Thu'
    },
    {
      id: 'h8',
      name: 'Dr. Shalini Mukherjee',
      departmentId: 'oncology',
      specialty: 'Medical Oncology',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400',
      experience: '16+ Years',
      education: 'MD, DM (Oncology)',
      city: 'Surat',
      availability: 'Mon, Wed, Fri'
    },
    {
      id: 'h9',
      name: 'Dr. Vivek Malhotra',
      departmentId: 'dermatology',
      specialty: 'Cosmetic Dermatology',
      image: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?ixlib=rb-4.0.3&auto=format&w=500",
      experience: '10+ Years',
      education: 'MD (Dermatology), FAAD',
      city: 'Vadodara',
      availability: 'Mon, Wed, Fri'
    },
    {
      id: 'h10',
      name: 'Dr. Kavita Reddy',
      departmentId: 'dermatology',
      specialty: 'Medical Dermatology',
      image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400',
      experience: '8+ Years',
      education: 'MD (Dermatology), DVD',
      city: 'Rajkot',
      availability: 'Tue, Thu, Sat'
    },
  ];

  // Fill in to ensure each city+dept has 2-3 doctors
  const surnames = ['Patel', 'Shah', 'Mehta', 'Trivedi', 'Joshi', 'Gajjar', 'Vyas', 'Pandya', 'Rana', 'Chauhan'];
  const firstNames = ['Amit', 'Rajesh', 'Priya', 'Deepak', 'Sneha', 'Manoj', 'Neeta', 'Suresh', 'Bhavin', 'Komal'];
  
  CITIES.forEach(city => {
    DEPARTMENTS.forEach(dept => {
      // Check current count
      const existingCount = doctors.filter(d => d.city === city && d.departmentId === dept.id).length;
      const targetCount = 2; // at least 2 per city-dept combo
      
      for (let i = existingCount; i < targetCount; i++) {
        const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const sName = surnames[Math.floor(Math.random() * surnames.length)];
        doctors.push({
          id: `gen-${city.substring(0,3)}-${dept.id}-${i}`,
          name: `Dr. ${fName} ${sName}`,
          departmentId: dept.id,
          specialty: `Specialist ${dept.name}`,
          image: `https://images.unsplash.com/photo-${1500000000000 + (Math.random() * 1000000000)}?auto=format&fit=crop&q=80&w=400`,
          experience: `${8 + Math.floor(Math.random() * 20)}+ Years`,
          education: `MD, DM (${dept.name})`,
          city: city,
          availability: 'Mon, Wed, Fri'
        });
      }
    });
  });

  return doctors;
};

export const DOCTORS: Doctor[] = generateDoctors();

