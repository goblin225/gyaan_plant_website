export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'instructor' | 'admin';
  createdAt: Date;
  enrolledCourses: string[];
  completedCourses: string[];
  achievements: Achievement[];
}

export interface Course {
  _id: string;
  id: string;
  title: string;
  description: string;
  instructor: User;
  thumbnail: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  rating: number;
  studentsCount: number;
  price: number;
  modules: Module[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  duration: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'quiz' | 'coding';
  content: string;
  duration: number;
  order: number;
  isCompleted?: boolean;
  resources?: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'file';
  url: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  timeLimit?: number;
  passingScore: number;
  attempts?: number;
  maxAttempts?: number;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'coding' | 'true-false' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  explanation?: string;
  code?: string;
  testCases?: TestCase[];
  points?: number;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
  hidden?: boolean;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  currentLesson?: string;
  progress: number;
  lastAccessedAt: Date;
  timeSpent: number;
  quizScores: Record<string, number>;
  videoProgress?: Record<string, VideoProgress>;
}

export interface VideoProgress {
  currentTime: number;
  duration: number;
  watchedPercentage: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface Note {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  content: string;
  timestamp: number;
  createdAt: Date;
}

export interface Bookmark {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  timestamp: number;
  title: string;
  createdAt: Date;
}

export interface DiscussionThread {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  content: string;
  author: User;
  replies: Reply[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Reply {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  likes: number;
}

export interface CodeExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  testResults?: TestResult[];
  executionTime?: number;
}

export interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  description?: string;
  executionTime?: number;
}

export interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  starterCode: string;
  solution: string;
  testCases: TestCase[];
  hints?: string[];
  timeLimit?: number;
}