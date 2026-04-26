export interface Doctor {
  id: string;
  name: string;
  departmentId: string;
  specialty: string;
  image: string;
  experience: string;
  education: string;
  city: string;
  availability: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  departmentId: string;
  doctorId: string;
  date: string;
  time: string;
  reason: string;
}
