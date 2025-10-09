export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  location: { lat: number; lng: number };
}

export interface CheckIn {
  id: string;
  doctorId: string;
  employeeId: string;
  timestamp: string;
  location: { lat: number; lng: number };
}


