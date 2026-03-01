import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { Dashboard } from '../components/Dashboard';
import { StudentManagement } from '../components/StudentManagement';
import { Attendance } from '../components/Attendance';
import { WarningTriggers } from '../components/WarningTriggers';
import { Reports } from '../components/Reports';
import { StudentHistoryModal } from '../components/StudentHistoryModal';
import { WarningLetterTemplate } from '../components/WarningLetterTemplate';
import { ViewType, Student, Attendance as AttendanceType, WarningTrigger, User } from '../types';
import { api } from '../services/api';

interface MainViewProps {
  user: User;
  onLogout: () => void;
}

export const MainView: React.FC<MainViewProps> = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceType[]>([]);
  const [warningTriggers, setWarningTriggers] = useState<WarningTrigger[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSession, setSelectedSession] = useState('Harian');
  const [loading, setLoading] = useState(false);
  
  // Report states
  const [reportType, setReportType] = useState<'standard' | 'custom'>('standard');
  const [reportMonth, setReportMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [reportYear, setReportYear] = useState(new Date().getFullYear().toString());
  const [reportData, setReportData] = useState<any[]>([]);
  const [customReportData, setCustomReportData] = useState<any[]>([]);
  
  // Modal states
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<Student | null>(null);
  const [studentHistory, setStudentHistory] = useState<AttendanceType[]>([]);
  const [printingLetterStudent, setPrintingLetterStudent] = useState<WarningTrigger | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (currentView === 'attendance') {
      fetchAttendance();
    }
  }, [selectedDate, selectedSession, currentView]);

  useEffect(() => {
    if (currentView === 'reports') {
      if (reportType === 'standard') {
        fetchReportSummary();
      }
    }
  }, [currentView, reportType, reportMonth, reportYear]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [studentsData, warningsData] = await Promise.all([
        api.students.getAll(),
        api.warnings.getTriggers()
      ]);
      setStudents(studentsData);
      setWarningTriggers(warningsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const data = await api.attendance.getByDate(selectedDate, selectedSession);
      setAttendance(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReportSummary = async () => {
    try {
      const data = await api.reports.getSummary(reportMonth, reportYear, 'Harian');
      // Map backend summary to UI format
      const mappedData = data.map(item => ({
        name: item.name,
        hadir: item.present_count,
        ponteng: item.unexcused_count,
        bersebab: item.excused_count,
        peratus: Math.round((item.present_count / (item.present_count + item.unexcused_count + item.excused_count || 1)) * 100)
      }));
      setReportData(mappedData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAttendanceStatus = (studentId: string, status: any) => {
    setAttendance(prev => {
      const existing = prev.find(a => a.student_id === Number(studentId));
      if (existing) {
        return prev.map(a => a.student_id === Number(studentId) ? { ...a, status } : a);
      } else {
        return [...prev, { student_id: Number(studentId), date: selectedDate, session: selectedSession, status }];
      }
    });
  };

  const handleSaveAttendance = async () => {
    try {
      // Prepare records for backend
      const records = attendance.map(a => ({
        id: a.student_id, // Backend expects student_id as id in this specific endpoint
        status: a.status,
        reason: a.reason
      }));
      await api.attendance.save(records as any, selectedDate, selectedSession);
      alert('Kehadiran berjaya disimpan!');
      fetchInitialData(); // Refresh warnings
    } catch (err) {
      alert('Gagal menyimpan kehadiran');
    }
  };

  const handleViewHistory = async (student: Student) => {
    try {
      const history = await api.students.getAttendanceHistory(student.id);
      setStudentHistory(history);
      setSelectedStudentForHistory(student);
    } catch (err) {
      alert('Gagal memuat sejarah');
    }
  };

  const handlePrintLetter = async (student: WarningTrigger) => {
    try {
      setPrintingLetterStudent(student);
      
      // Record the letter in the database
      await api.warnings.issueLetter(student.studentId, student.type, new Date().toISOString().split('T')[0]);
      
      // Trigger print
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          setPrintingLetterStudent(null);
          // Refresh triggers so the issued one disappears
          fetchInitialData();
        }, 500);
      }, 300);
    } catch (err) {
      alert('Gagal merekod surat amaran');
      setPrintingLetterStudent(null);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(val => `"${val}"`).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`min-h-screen bg-[#F8FAFC] flex font-sans text-[#1E293B] ${printingLetterStudent ? 'printing-letter' : ''}`}>
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        user={user}
        onLogout={onLogout}
        warningCount={warningTriggers.length}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header currentView={currentView} setIsSidebarOpen={setIsSidebarOpen} user={user} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 main-app-content">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && (
              <Dashboard 
                students={students} 
                warningTriggers={warningTriggers} 
                setCurrentView={setCurrentView} 
              />
            )}
            {currentView === 'students' && (
              <StudentManagement 
                students={students} 
                onViewHistory={handleViewHistory}
                onEdit={() => {}}
                onDelete={async (id) => {
                  if(confirm('Padam murid ini?')) {
                    await api.students.delete(Number(id));
                    fetchInitialData();
                  }
                }}
                onAdd={() => {}}
              />
            )}
            {currentView === 'attendance' && (
              <Attendance 
                students={students}
                attendance={attendance}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                onUpdateStatus={handleUpdateAttendanceStatus}
                onSave={handleSaveAttendance}
              />
            )}
            {currentView === 'warnings' && (
              <WarningTriggers 
                warningTriggers={warningTriggers} 
                onPrintLetter={handlePrintLetter} 
              />
            )}
            {currentView === 'reports' && (
              <Reports 
                students={students}
                reportType={reportType}
                setReportType={setReportType}
                reportData={reportData}
                customReportData={customReportData}
                exportToCSV={exportToCSV}
              />
            )}
          </div>
        </main>
      </div>

      <StudentHistoryModal 
        student={selectedStudentForHistory} 
        history={studentHistory} 
        onClose={() => setSelectedStudentForHistory(null)} 
      />

      {printingLetterStudent && (
        <WarningLetterTemplate student={printingLetterStudent} />
      )}

      <style>{`
        @media print {
          .no-print-section { display: none !important; }
          .printing-letter .main-app-content { display: none !important; }
          .print-only { 
            display: block !important; 
            position: relative !important;
            visibility: visible !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
          }
          body, html { background: white !important; }
          main { padding: 0 !important; margin: 0 !important; }
        }
        .print-only { display: none; }
      `}</style>
    </div>
  );
};
