// Mock data for the Staff Utility App

export const mockStaffProfile = {
  id: 1,
  name: "Dr. Sarah Johnson",
  role: "Senior Mathematics Teacher",
  employeeId: "EMP001",
  department: "Mathematics Department",
  subjects: ["Advanced Calculus", "Statistics", "Algebra II"],
  email: "sarah.johnson@school.edu",
  phone: "+1 (555) 123-4567",
  joinDate: "2018-09-15",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b67d62b9?w=150&h=150&fit=crop&crop=face"
};

export const mockSchedule = [
  {
    id: 1,
    time: "08:00 - 09:00",
    subject: "Advanced Calculus",
    class: "Grade 12A",
    room: "Math Lab 1",
    day: "Monday",
    status: "scheduled"
  },
  {
    id: 2,
    time: "09:15 - 10:15",
    subject: "Statistics",
    class: "Grade 11B",
    room: "Room 204",
    day: "Monday",
    status: "scheduled"
  },
  {
    id: 3,
    time: "10:30 - 11:30",
    subject: "Algebra II",
    class: "Grade 10C",
    room: "Room 105",
    day: "Monday",
    status: "substitution_needed"
  },
  {
    id: 4,
    time: "13:00 - 14:00",
    subject: "Advanced Calculus",
    class: "Grade 12B",
    room: "Math Lab 2",
    day: "Monday",
    status: "scheduled"
  }
];

export const mockAttendance = [
  {
    id: 1,
    className: "Grade 12A - Advanced Calculus",
    date: "2025-01-15",
    totalStudents: 28,
    present: 26,
    absent: 2,
    late: 0,
    students: [
      { id: 1, name: "Alice Cooper", status: "present" },
      { id: 2, name: "Bob Smith", status: "present" },
      { id: 3, name: "Charlie Brown", status: "absent" },
      { id: 4, name: "Diana Ross", status: "present" },
      { id: 5, name: "Edward Norton", status: "absent" }
    ]
  }
];

export const mockTemplates = [
  {
    id: 1,
    name: "Lesson Plan Template",
    category: "Academic",
    fields: [
      { name: "subject", label: "Subject", type: "text", required: true },
      { name: "grade", label: "Grade Level", type: "select", options: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"], required: true },
      { name: "topic", label: "Lesson Topic", type: "text", required: true },
      { name: "objectives", label: "Learning Objectives", type: "textarea", required: true },
      { name: "duration", label: "Duration (minutes)", type: "number", required: true },
      { name: "materials", label: "Required Materials", type: "textarea", required: false },
      { name: "activities", label: "Learning Activities", type: "textarea", required: true },
      { name: "assessment", label: "Assessment Method", type: "textarea", required: true }
    ]
  },
  {
    id: 2,
    name: "Student Progress Report",
    category: "Assessment",
    fields: [
      { name: "studentName", label: "Student Name", type: "text", required: true },
      { name: "studentId", label: "Student ID", type: "text", required: true },
      { name: "subject", label: "Subject", type: "text", required: true },
      { name: "period", label: "Reporting Period", type: "select", options: ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"], required: true },
      { name: "grade", label: "Current Grade", type: "select", options: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"], required: true },
      { name: "strengths", label: "Student Strengths", type: "textarea", required: true },
      { name: "improvements", label: "Areas for Improvement", type: "textarea", required: true },
      { name: "recommendations", label: "Recommendations", type: "textarea", required: true }
    ]
  },
  {
    id: 3,
    name: "Meeting Minutes Template",
    category: "Administrative",
    fields: [
      { name: "meetingTitle", label: "Meeting Title", type: "text", required: true },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "time", label: "Time", type: "time", required: true },
      { name: "attendees", label: "Attendees", type: "textarea", required: true },
      { name: "agenda", label: "Agenda Items", type: "textarea", required: true },
      { name: "discussions", label: "Key Discussions", type: "textarea", required: true },
      { name: "decisions", label: "Decisions Made", type: "textarea", required: true },
      { name: "actionItems", label: "Action Items", type: "textarea", required: true }
    ]
  }
];

export const mockDashboardData = {
  todaySchedule: mockSchedule.slice(0, 3),
  upcomingTasks: [
    { id: 1, task: "Grade midterm exams", priority: "high", dueDate: "2025-01-18" },
    { id: 2, task: "Prepare lesson plan for Statistics", priority: "medium", dueDate: "2025-01-17" },
    { id: 3, task: "Parent-teacher meeting with Johnson family", priority: "high", dueDate: "2025-01-19" },
    { id: 4, task: "Submit quarterly progress reports", priority: "medium", dueDate: "2025-01-20" }
  ],
  recentActivities: [
    { id: 1, activity: "Completed attendance for Grade 12A", time: "2 hours ago" },
    { id: 2, activity: "Updated lesson plan for Advanced Calculus", time: "4 hours ago" },
    { id: 3, activity: "Submitted grade reports for Statistics", time: "Yesterday" }
  ],
  announcements: [
    { id: 1, title: "Staff Meeting", content: "Monthly staff meeting scheduled for Friday at 3:00 PM", date: "2025-01-15" },
    { id: 2, title: "New Grading System", content: "Please familiarize yourself with the updated grading guidelines", date: "2025-01-14" }
  ]
};

// Voice transcription samples for demo
export const mockVoiceTranscriptions = [
  "I need to create a lesson plan for Grade 12 Advanced Calculus on derivatives. The lesson should focus on the chain rule and product rule with practical applications. Duration should be 60 minutes with graphing calculators as materials.",
  "Please generate a progress report for student John Smith, ID 12345, in Mathematics for Quarter 2. His current grade is B+ and he shows strong analytical skills but needs improvement in showing work steps.",
  "Create meeting minutes for the Mathematics Department meeting on January 16th at 2:00 PM. Attendees include Dr. Johnson, Mr. Peterson, and Ms. Chen. We discussed new curriculum standards and decided to implement weekly assessments."
];