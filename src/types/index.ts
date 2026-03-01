export type StudentStatus = 'Aktif' | 'Gantung' | 'Berhenti';

export interface Student {
  id: number;
  name: string;
  student_id: string;
  class_name: string;
  parent_name: string;
  parent_phone: string;
  address: string;
  status?: StudentStatus; // Optional as backend doesn't have it yet but UI uses it
  totalAbsences?: number; // Calculated field
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface Attendance {
  id?: number;
  student_id: number;
  date: string;
  session: string;
  status: AttendanceStatus;
  reason?: string | null;
  name?: string; // Joined from students
}

export interface WarningTrigger extends Student {
  consecutiveAbsent: number;
  totalAbsentUnexcused: number;
  reason: string;
}

export type ViewType = 'dashboard' | 'students' | 'attendance' | 'warnings' | 'reports';

export interface User {
  id: number;
  username: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
