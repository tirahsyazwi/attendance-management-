import { Student, Attendance, WarningTrigger } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  { id: 1, name: 'Ahmad bin Ali', student_id: 'S001', class_name: '5 Cekal', parent_name: 'Ali bin Abu', parent_phone: '012-3456789', address: 'No 1 KL', status: 'Aktif', totalAbsences: 3 },
  { id: 2, name: 'Siti Aminah binti Hassan', student_id: 'S002', class_name: '5 Cekal', parent_name: 'Hassan bin Omar', parent_phone: '013-9876543', address: 'No 2 KL', status: 'Aktif', totalAbsences: 0 },
  { id: 3, name: 'Chong Wei Ming', student_id: 'S003', class_name: '5 Cekal', parent_name: 'Chong Hock Seng', parent_phone: '014-1112223', address: 'No 3 KL', status: 'Aktif', totalAbsences: 1 },
];

export const INITIAL_ATTENDANCE: Attendance[] = [
  { id: 1, student_id: 1, date: '2024-03-01', session: 'Harian', status: 'present' },
  { id: 2, student_id: 2, date: '2024-03-01', session: 'Harian', status: 'present' },
  { id: 3, student_id: 3, date: '2024-03-01', session: 'Harian', status: 'present' },
];

export const INITIAL_WARNING_TRIGGERS: WarningTrigger[] = [
  { 
    id: 4, 
    studentId: 4,
    studentName: 'Muthu a/l Subramaniam', 
    studentClass: '5 Cekal', 
    consecutiveAbsent: 3,
    totalAbsentUnexcused: 3,
    reason: 'Ponteng 3 hari berturut-turut',
    type: 'Amaran 1',
    date: '2026-02-28'
  },
];
