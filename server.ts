import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "guruattend-secret-key-2026";

const db = new Database("attendance.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'teacher'
  );

  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    student_id TEXT UNIQUE NOT NULL,
    class_name TEXT NOT NULL,
    parent_name TEXT,
    parent_phone TEXT,
    address TEXT
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    session TEXT NOT NULL DEFAULT 'Harian', -- 'Harian', 'Pagi', 'Petang', etc.
    status TEXT NOT NULL, -- 'present', 'absent', 'late'
    reason TEXT, -- 'medical', 'personal', 'unexcused'
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE(student_id, date, session)
  );

  CREATE TABLE IF NOT EXISTS warning_letters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    type TEXT NOT NULL, -- 'Amaran 1', 'Amaran 2', 'Amaran 3', 'Buang Sekolah'
    date_issued TEXT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id)
  );
`);

// Seed Admin User
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  console.log("Seeding admin user...");
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)").run("admin", hashedPassword, "Administrator", "admin");
}

// Seed Dummy Data if empty
const studentCount = db.prepare("SELECT COUNT(*) as count FROM students").get() as { count: number };
if (studentCount.count === 0) {
  console.log("Seeding dummy students and attendance...");
  const insertStudent = db.prepare("INSERT INTO students (name, student_id, class_name, parent_name, parent_phone, address) VALUES (?, ?, ?, ?, ?, ?)");
  const insertAttendance = db.prepare("INSERT INTO attendance (student_id, date, session, status, reason) VALUES (?, ?, ?, ?, ?)");

  const dummyStudents = [
    ["Ahmad bin Ali", "S001", "1 Cerdik", "Ali bin Ahmad", "012-3456789", "No. 1, Jalan Melati, KL"],
    ["Siti binti Abu", "S002", "1 Cerdik", "Abu bin Bakar", "013-9876543", "No. 5, Taman Bunga, Selangor"],
    ["Chong Wei", "S003", "1 Cerdik", "Chong Ah Kow", "014-1112223", "12-3, Apartment Indah, PJ"],
    ["Muthu", "S004", "1 Cerdik", "Ramasamy", "016-5556667", "No. 8, Lorong Hijau, Ipoh"],
    ["Sarah Jane", "S005", "1 Cerdik", "John Doe", "017-8889990", "No. 10, Villa Park, Cyberjaya"],
    ["Nurul Izzah", "S006", "1 Cerdik", "Anwar", "011-2223334", "No. 2, Jalan Aman, KL"],
    ["Tan Ah Teck", "S007", "1 Cerdik", "Tan", "012-4445556", "No. 15, Taman Jaya, Selangor"],
    ["Kamala Devi", "S008", "1 Cerdik", "Govind", "013-6667778", "No. 20, Lorong Baru, Penang"],
    ["Mohd Zaki", "S009", "1 Cerdik", "Zaki", "014-8889990", "No. 3, Jalan Indah, Johor"],
    ["Lim Guan Eng", "S010", "1 Cerdik", "Lim", "015-0001112", "No. 7, Taman Sentosa, Melaka"],
    ["Fatimah Zahra", "S011", "1 Cerdik", "Zahra", "016-2223334", "No. 9, Jalan Mawar, Kedah"],
    ["Lee Chong Wei", "S012", "1 Cerdik", "Lee", "017-4445556", "No. 11, Taman Permai, Perak"],
    ["Ravi Kumar", "S013", "1 Cerdik", "Kumar", "018-6667778", "No. 13, Lorong Damai, Pahang"],
    ["Aishah Begum", "S014", "1 Cerdik", "Begum", "019-8889990", "No. 17, Jalan Bahagia, Kelantan"],
    ["Zulhelmi", "S015", "1 Cerdik", "Zul", "010-1112223", "No. 19, Taman Harmoni, Terengganu"]
  ];

  const studentIds: number[] = [];
  for (const s of dummyStudents) {
    const info = insertStudent.run(...s);
    studentIds.push(Number(info.lastInsertRowid));
  }

  const today = "2026-02-28";
  const yesterday = "2026-02-27";
  const dayBefore = "2026-02-26";

  // Today's Attendance
  insertAttendance.run(studentIds[0], today, 'Harian', 'present', null);
  insertAttendance.run(studentIds[1], today, 'Harian', 'absent', null); // Consecutive 3
  insertAttendance.run(studentIds[2], today, 'Harian', 'late', null);
  insertAttendance.run(studentIds[3], today, 'Harian', 'present', null);
  insertAttendance.run(studentIds[4], today, 'Harian', 'absent', null); // Part of 10 days

  // Yesterday's Attendance
  insertAttendance.run(studentIds[0], yesterday, 'Harian', 'present', null);
  insertAttendance.run(studentIds[1], yesterday, 'Harian', 'absent', null);
  insertAttendance.run(studentIds[2], yesterday, 'Harian', 'present', null);
  insertAttendance.run(studentIds[3], yesterday, 'Harian', 'absent', 'Sakit');
  insertAttendance.run(studentIds[4], yesterday, 'Harian', 'absent', null);

  // Day Before Yesterday
  insertAttendance.run(studentIds[0], dayBefore, 'Harian', 'present', null);
  insertAttendance.run(studentIds[1], dayBefore, 'Harian', 'absent', null);
  insertAttendance.run(studentIds[4], dayBefore, 'Harian', 'absent', null);

  // Add more for Sarah Jane (studentIds[4]) to trigger 10 days warning
  for (let i = 1; i <= 7; i++) {
    const date = `2026-02-${i.toString().padStart(2, '0')}`;
    insertAttendance.run(studentIds[4], date, 'Harian', 'absent', null);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Middleware
  const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Forbidden" });
      (req as any).user = user;
      next();
    });
  };

  // Auth Routes
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as any;

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, name: user.name, role: user.role } });
  });

  app.get("/api/auth/me", authenticateToken, (req, res) => {
    const user = (req as any).user;
    res.json(user);
  });

  // API Routes (Protected)
  app.get("/api/students", authenticateToken, (req, res) => {
    const students = db.prepare("SELECT * FROM students ORDER BY name ASC").all();
    res.json(students);
  });

  app.post("/api/students", authenticateToken, (req, res) => {
    const { name, student_id, class_name, parent_name, parent_phone, address } = req.body;
    try {
      const info = db.prepare(
        "INSERT INTO students (name, student_id, class_name, parent_name, parent_phone, address) VALUES (?, ?, ?, ?, ?, ?)"
      ).run(name, student_id, class_name, parent_name, parent_phone, address);
      res.json({ id: info.lastInsertRowid });
    } catch (err) {
      res.status(400).json({ error: "Student ID already exists or invalid data" });
    }
  });

  app.delete("/api/students/:id", authenticateToken, (req, res) => {
    db.prepare("DELETE FROM students WHERE id = ?").run(req.params.id);
    db.prepare("DELETE FROM attendance WHERE student_id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/attendance/:date", authenticateToken, (req, res) => {
    const session = req.query.session || 'Harian';
    const attendance = db.prepare(`
      SELECT s.id, s.name, s.student_id, a.status, a.reason 
      FROM students s
      LEFT JOIN attendance a ON s.id = a.student_id AND a.date = ? AND a.session = ?
    `).all(req.params.date, session);
    res.json(attendance);
  });

  app.post("/api/attendance", authenticateToken, (req, res) => {
    const { records, date, session = 'Harian' } = req.body;
    const upsert = db.transaction((recs) => {
      for (const rec of recs) {
        db.prepare(`
          INSERT INTO attendance (student_id, date, session, status, reason)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(student_id, date, session) DO UPDATE SET
            status = excluded.status,
            reason = excluded.reason
        `).run(rec.id, date, session, rec.status, rec.reason || null);
      }
    });
    upsert(records);
    res.json({ success: true });
  });

  app.get("/api/students/:id/attendance", authenticateToken, (req, res) => {
    const history = db.prepare(`
      SELECT date, session, status, reason 
      FROM attendance 
      WHERE student_id = ? 
      ORDER BY date DESC, session ASC
    `).all(req.params.id);
    res.json(history);
  });

  app.get("/api/reports/summary", authenticateToken, (req, res) => {
    const { month, year, session = 'Harian' } = req.query;
    const datePattern = `${year}-${month}%`;
    const summary = db.prepare(`
      SELECT s.name, s.student_id,
             COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_count,
             COUNT(CASE WHEN a.status = 'absent' AND a.reason IS NOT NULL THEN 1 END) as excused_count,
             COUNT(CASE WHEN a.status = 'absent' AND a.reason IS NULL THEN 1 END) as unexcused_count,
             COUNT(CASE WHEN a.status = 'late' THEN 1 END) as late_count
      FROM students s
      LEFT JOIN attendance a ON s.id = a.student_id AND a.date LIKE ? AND a.session = ?
      GROUP BY s.id
      ORDER BY s.name ASC
    `).all(datePattern, session);
    res.json(summary);
  });

  app.get("/api/reports/custom", authenticateToken, (req, res) => {
    const { startDate, endDate, status, studentId } = req.query;
    let query = `
      SELECT a.date, a.session, a.status, a.reason, s.name, s.student_id, s.class_name
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (startDate) {
      query += " AND a.date >= ?";
      params.push(startDate);
    }
    if (endDate) {
      query += " AND a.date <= ?";
      params.push(endDate);
    }
    if (status && status !== 'all') {
      if (status === 'excused') {
        query += " AND a.status = 'absent' AND a.reason IS NOT NULL";
      } else if (status === 'unexcused') {
        query += " AND a.status = 'absent' AND a.reason IS NULL";
      } else if (status === 'tardy') {
        query += " AND a.status = 'late'";
      } else {
        query += " AND a.status = ?";
        params.push(status);
      }
    }
    if (studentId && studentId !== 'all') {
      query += " AND s.id = ?";
      params.push(studentId);
    }

    query += " ORDER BY a.date DESC, s.name ASC";

    const logs = db.prepare(query).all(...params);
    res.json(logs);
  });

  // Warning Letter Logic
  app.get("/api/warning-triggers", authenticateToken, (req, res) => {
    const students = db.prepare("SELECT * FROM students").all();
    const triggers = [];
    const today = new Date().toISOString().split('T')[0];

    for (const student of students as any[]) {
      const history = db.prepare(`
        SELECT date, status, reason FROM attendance 
        WHERE student_id = ? 
        ORDER BY date DESC
      `).all(student.id) as any[];

      const issuedLetters = db.prepare(`
        SELECT type FROM warning_letters WHERE student_id = ?
      `).all(student.id) as any[];

      const letterTypes = issuedLetters.map(l => l.type);

      // Calculate consecutive unexcused absences
      let consecutiveAbsent = 0;
      for (const day of history) {
        if (day.status === 'absent' && !day.reason) {
          consecutiveAbsent++;
        } else {
          break;
        }
      }

      // Calculate total unexcused absences (all time for this student in current db)
      const totalAbsentUnexcused = history.filter(h => h.status === 'absent' && !h.reason).length;

      let nextType = "";
      let triggerReason = "";

      // Rules:
      // Consecutive: 3 (A1), 10 (A2), 17 (A3), 31 (BS)
      // Non-consecutive: 10 (A1), 20 (A2), 40 (A3), 60 (BS)

      if (consecutiveAbsent >= 31 || totalAbsentUnexcused >= 60) {
        if (!letterTypes.includes("Buang Sekolah")) {
          nextType = "Buang Sekolah";
          triggerReason = consecutiveAbsent >= 31 ? "31 Hari Berturut-turut" : "60 Hari Tidak Berturut-turut";
        }
      } else if (consecutiveAbsent >= 17 || totalAbsentUnexcused >= 40) {
        if (!letterTypes.includes("Amaran 3")) {
          nextType = "Amaran 3";
          triggerReason = consecutiveAbsent >= 17 ? "17 Hari Berturut-turut" : "40 Hari Tidak Berturut-turut";
        }
      } else if (consecutiveAbsent >= 10 || totalAbsentUnexcused >= 20) {
        if (!letterTypes.includes("Amaran 2")) {
          nextType = "Amaran 2";
          triggerReason = consecutiveAbsent >= 10 ? "10 Hari Berturut-turut" : "20 Hari Tidak Berturut-turut";
        }
      } else if (consecutiveAbsent >= 3 || totalAbsentUnexcused >= 10) {
        if (!letterTypes.includes("Amaran 1")) {
          nextType = "Amaran 1";
          triggerReason = consecutiveAbsent >= 3 ? "3 Hari Berturut-turut" : "10 Hari Tidak Berturut-turut";
        }
      }

      if (nextType) {
        triggers.push({
          id: student.id, // Using student ID as trigger ID for simplicity
          studentId: student.id,
          studentName: student.name,
          studentClass: student.class_name,
          consecutiveAbsent,
          totalAbsentUnexcused,
          reason: triggerReason,
          type: nextType,
          date: today
        });
      }
    }
    res.json(triggers);
  });

  app.post("/api/warning-letters", authenticateToken, (req, res) => {
    const { studentId, type, date } = req.body;
    try {
      db.prepare("INSERT INTO warning_letters (student_id, type, date_issued) VALUES (?, ?, ?)").run(studentId, type, date);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Gagal merekod surat amaran" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
