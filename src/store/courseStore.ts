import { create } from 'zustand';
import type { Course, Module, Lesson, UserProgress } from '../types';

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  userProgress: Record<string, UserProgress>;
  loading: boolean;
  error: string | null;
  setCourses: (courses: Course[]) => void;
  setCurrentCourse: (course: Course | null) => void;
  updateProgress: (courseId: string, lessonId: string, progress: Partial<UserProgress>) => void;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  updateVideoProgress: (courseId: string, lessonId: string, currentTime: number, duration: number) => void;
  addQuizScore: (courseId: string, quizId: string, score: number) => void;
}

// Enhanced mock course data with comprehensive content
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Complete React Developer Course 2024',
    description: 'Master React from basics to advanced concepts with real-world projects. Build modern web applications using React 18, hooks, context, and more.',
    instructor: {
      id: 'inst1',
      name: 'Sarah Johnson',
      email: 'sarah@instructor.com',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'instructor',
      createdAt: new Date(),
      enrolledCourses: [],
      completedCourses: [],
      achievements: []
    },
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: 43200, // 12 hours
    level: 'intermediate',
    category: 'Web Development',
    tags: ['React', 'JavaScript', 'Frontend', 'Hooks', 'JSX'],
    rating: 4.8,
    studentsCount: 12540,
    price: 89.99,
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'm1',
        title: 'Getting Started with React',
        description: 'Learn the fundamentals of React and set up your development environment.',
        order: 1,
        duration: 10800, // 3 hours
        lessons: [
          {
            id: 'l1',
            title: 'What is React?',
            description: 'Understanding React and its ecosystem, virtual DOM, and component-based architecture',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duration: 1800, // 30 minutes
            order: 1
          },
          {
            id: 'l2',
            title: 'Setting up Development Environment',
            description: 'Install Node.js, create-react-app, and VS Code setup with essential extensions',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            duration: 2400, // 40 minutes
            order: 2
          },
          {
            id: 'l3',
            title: 'Your First React Component',
            description: 'Create your first functional component and understand JSX syntax',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration: 2100, // 35 minutes
            order: 3
          },
          {
            id: 'l4',
            title: 'React Basics Quiz',
            description: 'Test your understanding of React fundamentals',
            type: 'quiz',
            content: 'quiz-react-basics',
            duration: 900, // 15 minutes
            order: 4
          },
          {
            id: 'l5',
            title: 'Build a Hello World Component',
            description: 'Hands-on coding exercise to create your first React component',
            type: 'coding',
            content: 'coding-hello-world',
            duration: 1800, // 30 minutes
            order: 5
          }
        ]
      },
      {
        id: 'm2',
        title: 'Components and Props',
        description: 'Deep dive into React components, props, and component composition.',
        order: 2,
        duration: 14400, // 4 hours
        lessons: [
          {
            id: 'l6',
            title: 'Understanding Props',
            description: 'Learn how to pass data between components using props',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            duration: 2700, // 45 minutes
            order: 1
          },
          {
            id: 'l7',
            title: 'Component Composition',
            description: 'Master the art of composing components for reusable UI',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duration: 3000, // 50 minutes
            order: 2
          },
          {
            id: 'l8',
            title: 'Props and State Quiz',
            description: 'Test your knowledge of props and component state',
            type: 'quiz',
            content: 'quiz-props-state',
            duration: 1200, // 20 minutes
            order: 3
          },
          {
            id: 'l9',
            title: 'Build a User Profile Card',
            description: 'Create a reusable user profile component with props',
            type: 'coding',
            content: 'coding-profile-card',
            duration: 2400, // 40 minutes
            order: 4
          }
        ]
      },
      {
        id: 'm3',
        title: 'State Management and Hooks',
        description: 'Master React hooks and state management patterns.',
        order: 3,
        duration: 18000, // 5 hours
        lessons: [
          {
            id: 'l10',
            title: 'useState Hook Deep Dive',
            description: 'Master the useState hook for managing component state',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            duration: 3600, // 60 minutes
            order: 1
          },
          {
            id: 'l11',
            title: 'useEffect and Side Effects',
            description: 'Handle side effects and lifecycle methods with useEffect',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            duration: 4200, // 70 minutes
            order: 2
          },
          {
            id: 'l12',
            title: 'Custom Hooks',
            description: 'Create reusable logic with custom React hooks',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            duration: 3000, // 50 minutes
            order: 3
          },
          {
            id: 'l13',
            title: 'Hooks Mastery Quiz',
            description: 'Advanced quiz on React hooks and state management',
            type: 'quiz',
            content: 'quiz-hooks-advanced',
            duration: 1800, // 30 minutes
            order: 4
          },
          {
            id: 'l14',
            title: 'Build a Todo App with Hooks',
            description: 'Create a fully functional todo application using React hooks',
            type: 'coding',
            content: 'coding-todo-app',
            duration: 5400, // 90 minutes
            order: 5
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'JavaScript Algorithms & Data Structures Masterclass',
    description: 'Master coding interviews with comprehensive algorithms and data structures course. Learn Big O notation, sorting algorithms, and advanced problem-solving techniques.',
    instructor: {
      id: 'inst2',
      name: 'Mike Chen',
      email: 'mike@instructor.com',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'instructor',
      createdAt: new Date(),
      enrolledCourses: [],
      completedCourses: [],
      achievements: []
    },
    thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: 54000, // 15 hours
    level: 'advanced',
    category: 'Computer Science',
    tags: ['JavaScript', 'Algorithms', 'Data Structures', 'Big O', 'Problem Solving'],
    rating: 4.9,
    studentsCount: 8920,
    price: 129.99,
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'm4',
        title: 'Big O Notation and Analysis',
        description: 'Understanding time and space complexity analysis.',
        order: 1,
        duration: 10800, // 3 hours
        lessons: [
          {
            id: 'l15',
            title: 'Introduction to Big O',
            description: 'Learn the fundamentals of algorithmic complexity analysis',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: 2400, // 40 minutes
            order: 1
          },
          {
            id: 'l16',
            title: 'Time vs Space Complexity',
            description: 'Understanding the trade-offs between time and space',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
            duration: 2700, // 45 minutes
            order: 2
          },
          {
            id: 'l17',
            title: 'Big O Analysis Quiz',
            description: 'Test your understanding of complexity analysis',
            type: 'quiz',
            content: 'quiz-big-o',
            duration: 1200, // 20 minutes
            order: 3
          },
          {
            id: 'l18',
            title: 'Analyze Algorithm Complexity',
            description: 'Practice analyzing the complexity of different algorithms',
            type: 'coding',
            content: 'coding-complexity-analysis',
            duration: 4500, // 75 minutes
            order: 4
          }
        ]
      },
      {
        id: 'm5',
        title: 'Sorting Algorithms',
        description: 'Master various sorting algorithms and their implementations.',
        order: 2,
        duration: 16200, // 4.5 hours
        lessons: [
          {
            id: 'l19',
            title: 'Bubble Sort and Selection Sort',
            description: 'Learn basic sorting algorithms and their implementations',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
            duration: 3600, // 60 minutes
            order: 1
          },
          {
            id: 'l20',
            title: 'Merge Sort and Quick Sort',
            description: 'Advanced sorting algorithms with divide and conquer approach',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duration: 4200, // 70 minutes
            order: 2
          },
          {
            id: 'l21',
            title: 'Sorting Algorithms Quiz',
            description: 'Comprehensive quiz on sorting algorithms',
            type: 'quiz',
            content: 'quiz-sorting',
            duration: 1800, // 30 minutes
            order: 3
          },
          {
            id: 'l22',
            title: 'Implement Quick Sort',
            description: 'Code a complete quick sort algorithm from scratch',
            type: 'coding',
            content: 'coding-quicksort',
            duration: 6600, // 110 minutes
            order: 4
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'UI/UX Design Fundamentals & Figma Mastery',
    description: 'Learn the principles of user interface and user experience design. Master Figma, design systems, and create stunning user interfaces.',
    instructor: {
      id: 'inst3',
      name: 'Emma Wilson',
      email: 'emma@instructor.com',
      avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'instructor',
      createdAt: new Date(),
      enrolledCourses: [],
      completedCourses: [],
      achievements: []
    },
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: 28800, // 8 hours
    level: 'beginner',
    category: 'Design',
    tags: ['UI', 'UX', 'Design', 'Figma', 'Prototyping'],
    rating: 4.7,
    studentsCount: 15630,
    price: 69.99,
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'm6',
        title: 'Design Principles and Theory',
        description: 'Learn fundamental design principles and color theory.',
        order: 1,
        duration: 14400, // 4 hours
        lessons: [
          {
            id: 'l23',
            title: 'Design Principles Overview',
            description: 'Understanding balance, contrast, hierarchy, and alignment',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            duration: 3000, // 50 minutes
            order: 1
          },
          {
            id: 'l24',
            title: 'Color Theory and Typography',
            description: 'Master color combinations and typography in design',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration: 3600, // 60 minutes
            order: 2
          },
          {
            id: 'l25',
            title: 'Design Principles Quiz',
            description: 'Test your knowledge of fundamental design principles',
            type: 'quiz',
            content: 'quiz-design-principles',
            duration: 1200, // 20 minutes
            order: 3
          },
          {
            id: 'l26',
            title: 'Create a Color Palette',
            description: 'Design a cohesive color palette for a brand',
            type: 'text',
            content: 'Create a comprehensive color palette including primary, secondary, and accent colors for a fictional tech startup. Consider accessibility and brand personality.',
            duration: 6600, // 110 minutes
            order: 4
          }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'Python for Data Science and Machine Learning',
    description: 'Complete Python course covering data analysis, visualization, and machine learning with pandas, numpy, matplotlib, and scikit-learn.',
    instructor: {
      id: 'inst4',
      name: 'Dr. Alex Rodriguez',
      email: 'alex@instructor.com',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: 'instructor',
      createdAt: new Date(),
      enrolledCourses: [],
      completedCourses: [],
      achievements: []
    },
    thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    duration: 64800, // 18 hours
    level: 'intermediate',
    category: 'Data Science',
    tags: ['Python', 'Data Science', 'Machine Learning', 'Pandas', 'NumPy'],
    rating: 4.9,
    studentsCount: 23450,
    price: 149.99,
    createdAt: new Date(),
    updatedAt: new Date(),
    modules: [
      {
        id: 'm7',
        title: 'Python Fundamentals for Data Science',
        description: 'Essential Python concepts for data analysis.',
        order: 1,
        duration: 21600, // 6 hours
        lessons: [
          {
            id: 'l27',
            title: 'Python Data Types and Structures',
            description: 'Lists, dictionaries, sets, and tuples for data manipulation',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            duration: 4200, // 70 minutes
            order: 1
          },
          {
            id: 'l28',
            title: 'Control Flow and Functions',
            description: 'Loops, conditionals, and function creation in Python',
            type: 'video',
            content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duration: 3600, // 60 minutes
            order: 2
          },
          {
            id: 'l29',
            title: 'Python Fundamentals Quiz',
            description: 'Comprehensive quiz on Python basics',
            type: 'quiz',
            content: 'quiz-python-fundamentals',
            duration: 1800, // 30 minutes
            order: 3
          },
          {
            id: 'l30',
            title: 'Data Analysis with Python',
            description: 'Build a data analysis script using Python fundamentals',
            type: 'coding',
            content: 'coding-data-analysis',
            duration: 12000, // 200 minutes
            order: 4
          }
        ]
      }
    ]
  }
];

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: mockCourses,
  currentCourse: null,
  userProgress: {},
  loading: false,
  error: null,

  setCourses: (courses) => set({ courses }),

  setCurrentCourse: (course) => set({ currentCourse: course }),

  updateProgress: (courseId, lessonId, progress) => {
    const { userProgress } = get();
    const existing = userProgress[courseId] || {
      userId: '1',
      courseId,
      completedLessons: [],
      progress: 0,
      lastAccessedAt: new Date(),
      timeSpent: 0,
      quizScores: {},
      videoProgress: {}
    };

    set({
      userProgress: {
        ...userProgress,
        [courseId]: { ...existing, ...progress, lastAccessedAt: new Date() }
      }
    });
  },

  updateVideoProgress: (courseId, lessonId, currentTime, duration) => {
    const { userProgress } = get();
    const existing = userProgress[courseId] || {
      userId: '1',
      courseId,
      completedLessons: [],
      progress: 0,
      lastAccessedAt: new Date(),
      timeSpent: 0,
      quizScores: {},
      videoProgress: {}
    };

    const videoProgress = {
      ...existing.videoProgress,
      [lessonId]: { currentTime, duration, watchedPercentage: (currentTime / duration) * 100 }
    };

    // Auto-complete lesson if watched 90% or more
    const completedLessons = [...existing.completedLessons];
    if ((currentTime / duration) >= 0.9 && !completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }

    // Calculate overall course progress
    const course = get().courses.find(c => c.id === courseId);
    const totalLessons = course?.modules.reduce((acc, module) => acc + module.lessons.length, 0) || 0;
    const progress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

    set({
      userProgress: {
        ...userProgress,
        [courseId]: {
          ...existing,
          videoProgress,
          completedLessons,
          progress,
          currentLesson: lessonId,
          lastAccessedAt: new Date(),
          timeSpent: existing.timeSpent + 1 // Increment time spent
        }
      }
    });
  },

  markLessonComplete: (courseId, lessonId) => {
    const { userProgress, courses } = get();
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const existing = userProgress[courseId] || {
      userId: '1',
      courseId,
      completedLessons: [],
      progress: 0,
      lastAccessedAt: new Date(),
      timeSpent: 0,
      quizScores: {},
      videoProgress: {}
    };

    const completedLessons = [...existing.completedLessons];
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }

    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    const progress = Math.round((completedLessons.length / totalLessons) * 100);

    set({
      userProgress: {
        ...userProgress,
        [courseId]: {
          ...existing,
          completedLessons,
          progress,
          currentLesson: lessonId,
          lastAccessedAt: new Date()
        }
      }
    });
  },

  addQuizScore: (courseId, quizId, score) => {
    const { userProgress } = get();
    const existing = userProgress[courseId] || {
      userId: '1',
      courseId,
      completedLessons: [],
      progress: 0,
      lastAccessedAt: new Date(),
      timeSpent: 0,
      quizScores: {},
      videoProgress: {}
    };

    set({
      userProgress: {
        ...userProgress,
        [courseId]: {
          ...existing,
          quizScores: {
            ...existing.quizScores,
            [quizId]: score
          },
          lastAccessedAt: new Date()
        }
      }
    });
  }
}));