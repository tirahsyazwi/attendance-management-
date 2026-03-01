import { Student, Attendance, WarningTrigger, User, AuthResponse } from '../types';

const getHeaders = () => {
  const token = localStorage.getItem('guruattend_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const api = {
  auth: {
    login: async (username: string, password: string): Promise<AuthResponse> => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Log masuk gagal');
      }
      return res.json();
    },
    me: async (): Promise<User> => {
      const res = await fetch('/api/auth/me', {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    }
  },
  students: {
    getAll: async (): Promise<Student[]> => {
      const res = await fetch('/api/students', {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Gagal memuat senarai murid');
      return res.json();
    },
    create: async (student: Partial<Student>): Promise<{ id: number }> => {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(student)
      });
      if (!res.ok) throw new Error('Gagal menambah murid');
      return res.json();
    },
    delete: async (id: number): Promise<void> => {
      const res = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Gagal memadam murid');
    },
    getAttendanceHistory: async (id: number): Promise<Attendance[]> => {
      const res = await fetch(`/api/students/${id}/attendance`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Gagal memuat sejarah kehadiran');
      return res.json();
    }
  },
  attendance: {
    getByDate: async (date: string, session: string): Promise<Attendance[]> => {
      const res = await fetch(`/api/attendance/${date}?session=${session}`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Gagal memuat rekod kehadiran');
      return res.json();
    },
    save: async (records: Attendance[], date: string, session: string): Promise<void> => {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ records, date, session })
      });
      if (!res.ok) throw new Error('Gagal menyimpan kehadiran');
    }
  },
  warnings: {
    getTriggers: async (): Promise<WarningTrigger[]> => {
      const res = await fetch('/api/warning-triggers', {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Gagal memuat amaran');
      return res.json();
    },
    issueLetter: async (studentId: number, type: string, date: string): Promise<void> => {
      const res = await fetch('/api/warning-letters', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ studentId, type, date })
      });
      if (!res.ok) throw new Error('Gagal merekod surat amaran');
    }
  },
  reports: {
    getSummary: async (month: string, year: string, session: string): Promise<any[]> => {
      const res = await fetch(`/api/reports/summary?month=${month}&year=${year}&session=${session}`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Gagal memuat ringkasan laporan');
      return res.json();
    },
    getCustom: async (startDate: string, endDate: string, status: string, studentId: string): Promise<any[]> => {
      const res = await fetch(`/api/reports/custom?startDate=${startDate}&endDate=${endDate}&status=${status}&studentId=${studentId}`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Gagal memuat laporan kustom');
      return res.json();
    }
  }
};
