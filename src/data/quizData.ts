import type { Quiz } from '../types';

export const quizData: Record<string, Quiz> = {
  'quiz-react-basics': {
    id: 'quiz-react-basics',
    title: 'React Fundamentals Quiz',
    description: 'Test your understanding of React basics, components, and JSX',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'What is React?',
        options: [
          'A JavaScript library for building user interfaces',
          'A database management system',
          'A web server framework',
          'A CSS preprocessor'
        ],
        correctAnswer: 0,
        explanation: 'React is a JavaScript library developed by Facebook for building user interfaces, particularly web applications.',
        points: 10
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'What is JSX?',
        options: [
          'A JavaScript extension',
          'A syntax extension for JavaScript that looks similar to HTML',
          'A CSS framework',
          'A database query language'
        ],
        correctAnswer: 1,
        explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.',
        points: 10
      },
      {
        id: 'q3',
        type: 'true-false',
        question: 'React components must always return a single parent element.',
        correctAnswer: false,
        explanation: 'With React Fragments or React 16+, components can return multiple elements without a wrapper.',
        points: 5
      },
      {
        id: 'q4',
        type: 'multiple-choice',
        question: 'Which method is used to render a React component?',
        options: [
          'React.render()',
          'ReactDOM.render()',
          'React.display()',
          'ReactDOM.show()'
        ],
        correctAnswer: 1,
        explanation: 'ReactDOM.render() is used to render React components to the DOM.',
        points: 10
      },
      {
        id: 'q5',
        type: 'fill-blank',
        question: 'The _____ hook is used to add state to functional components.',
        correctAnswer: 'useState',
        explanation: 'The useState hook allows you to add state to functional components.',
        points: 15
      }
    ],
    timeLimit: 900, // 15 minutes
    passingScore: 70,
    maxAttempts: 3
  },

  'quiz-props-state': {
    id: 'quiz-props-state',
    title: 'Props and State Management Quiz',
    description: 'Advanced quiz on React props, state, and component communication',
    questions: [
      {
        id: 'q6',
        type: 'multiple-choice',
        question: 'How do you pass data from a parent component to a child component?',
        options: [
          'Using state',
          'Using props',
          'Using context',
          'Using refs'
        ],
        correctAnswer: 1,
        explanation: 'Props are used to pass data from parent components to child components.',
        points: 10
      },
      {
        id: 'q7',
        type: 'multiple-choice',
        question: 'What happens when state is updated in a React component?',
        options: [
          'Nothing happens',
          'The component re-renders',
          'The page refreshes',
          'An error occurs'
        ],
        correctAnswer: 1,
        explanation: 'When state is updated, React triggers a re-render of the component.',
        points: 10
      },
      {
        id: 'q8',
        type: 'true-false',
        question: 'Props can be modified by the child component that receives them.',
        correctAnswer: false,
        explanation: 'Props are read-only and cannot be modified by the child component.',
        points: 10
      },
      {
        id: 'q9',
        type: 'multiple-choice',
        question: 'Which is the correct way to update state in a functional component?',
        options: [
          'state = newValue',
          'setState(newValue)',
          'useState(newValue)',
          'setStateValue(newValue)'
        ],
        correctAnswer: 3,
        explanation: 'In functional components, you use the setter function returned by useState to update state.',
        points: 15
      }
    ],
    timeLimit: 1200, // 20 minutes
    passingScore: 75,
    maxAttempts: 2
  },

  'quiz-hooks-advanced': {
    id: 'quiz-hooks-advanced',
    title: 'Advanced React Hooks Quiz',
    description: 'Master-level quiz on React hooks, custom hooks, and advanced patterns',
    questions: [
      {
        id: 'q10',
        type: 'multiple-choice',
        question: 'When does useEffect run by default?',
        options: [
          'Before every render',
          'After every render',
          'Only on mount',
          'Only on unmount'
        ],
        correctAnswer: 1,
        explanation: 'useEffect runs after every render by default, including the initial render.',
        points: 10
      },
      {
        id: 'q11',
        type: 'multiple-choice',
        question: 'How do you prevent useEffect from running on every render?',
        options: [
          'Use useCallback',
          'Use useMemo',
          'Provide a dependency array',
          'Use useRef'
        ],
        correctAnswer: 2,
        explanation: 'Providing a dependency array as the second argument controls when useEffect runs.',
        points: 15
      },
      {
        id: 'q12',
        type: 'true-false',
        question: 'Custom hooks must start with the word "use".',
        correctAnswer: true,
        explanation: 'Custom hooks must start with "use" to follow React\'s naming convention and enable hook rules.',
        points: 10
      },
      {
        id: 'q13',
        type: 'multiple-choice',
        question: 'What is the purpose of the cleanup function in useEffect?',
        options: [
          'To update state',
          'To prevent memory leaks and cancel subscriptions',
          'To render components',
          'To handle errors'
        ],
        correctAnswer: 1,
        explanation: 'The cleanup function prevents memory leaks by canceling subscriptions, timers, or other side effects.',
        points: 20
      }
    ],
    timeLimit: 1800, // 30 minutes
    passingScore: 80,
    maxAttempts: 2
  },

  'quiz-big-o': {
    id: 'quiz-big-o',
    title: 'Big O Notation and Complexity Analysis',
    description: 'Test your understanding of algorithmic complexity and Big O notation',
    questions: [
      {
        id: 'q14',
        type: 'multiple-choice',
        question: 'What is the time complexity of accessing an element in an array by index?',
        options: [
          'O(1)',
          'O(log n)',
          'O(n)',
          'O(n²)'
        ],
        correctAnswer: 0,
        explanation: 'Array access by index is constant time O(1) because arrays provide direct access to elements.',
        points: 10
      },
      {
        id: 'q15',
        type: 'multiple-choice',
        question: 'What is the time complexity of binary search?',
        options: [
          'O(1)',
          'O(log n)',
          'O(n)',
          'O(n log n)'
        ],
        correctAnswer: 1,
        explanation: 'Binary search has O(log n) time complexity because it eliminates half of the search space in each iteration.',
        points: 15
      },
      {
        id: 'q16',
        type: 'true-false',
        question: 'O(2n) is the same as O(n) in Big O notation.',
        correctAnswer: true,
        explanation: 'In Big O notation, constants are dropped, so O(2n) simplifies to O(n).',
        points: 10
      }
    ],
    timeLimit: 1200, // 20 minutes
    passingScore: 70,
    maxAttempts: 3
  },

  'quiz-sorting': {
    id: 'quiz-sorting',
    title: 'Sorting Algorithms Mastery Quiz',
    description: 'Comprehensive quiz on various sorting algorithms and their properties',
    questions: [
      {
        id: 'q17',
        type: 'multiple-choice',
        question: 'What is the average time complexity of Quick Sort?',
        options: [
          'O(n)',
          'O(n log n)',
          'O(n²)',
          'O(log n)'
        ],
        correctAnswer: 1,
        explanation: 'Quick Sort has an average time complexity of O(n log n), though worst case is O(n²).',
        points: 15
      },
      {
        id: 'q18',
        type: 'multiple-choice',
        question: 'Which sorting algorithm is stable?',
        options: [
          'Quick Sort',
          'Heap Sort',
          'Merge Sort',
          'Selection Sort'
        ],
        correctAnswer: 2,
        explanation: 'Merge Sort is stable, meaning it preserves the relative order of equal elements.',
        points: 10
      },
      {
        id: 'q19',
        type: 'true-false',
        question: 'Bubble Sort has a time complexity of O(n²) in all cases.',
        correctAnswer: false,
        explanation: 'Bubble Sort has O(n) best case when the array is already sorted, O(n²) average and worst case.',
        points: 10
      }
    ],
    timeLimit: 1500, // 25 minutes
    passingScore: 75,
    maxAttempts: 2
  },

  'quiz-design-principles': {
    id: 'quiz-design-principles',
    title: 'Design Principles and Theory Quiz',
    description: 'Test your knowledge of fundamental design principles and color theory',
    questions: [
      {
        id: 'q20',
        type: 'multiple-choice',
        question: 'Which design principle creates visual interest and draws attention?',
        options: [
          'Balance',
          'Contrast',
          'Alignment',
          'Repetition'
        ],
        correctAnswer: 1,
        explanation: 'Contrast creates visual interest by using opposing elements like light vs dark, large vs small.',
        points: 10
      },
      {
        id: 'q21',
        type: 'multiple-choice',
        question: 'What are complementary colors?',
        options: [
          'Colors next to each other on the color wheel',
          'Colors opposite each other on the color wheel',
          'Different shades of the same color',
          'Black and white'
        ],
        correctAnswer: 1,
        explanation: 'Complementary colors are opposite each other on the color wheel and create high contrast.',
        points: 10
      },
      {
        id: 'q22',
        type: 'true-false',
        question: 'White space (negative space) is wasted space in design.',
        correctAnswer: false,
        explanation: 'White space is crucial for readability, focus, and creating a clean, professional design.',
        points: 10
      }
    ],
    timeLimit: 900, // 15 minutes
    passingScore: 70,
    maxAttempts: 3
  },

  'quiz-python-fundamentals': {
    id: 'quiz-python-fundamentals',
    title: 'Python Fundamentals for Data Science',
    description: 'Essential Python concepts and data structures for data analysis',
    questions: [
      {
        id: 'q23',
        type: 'multiple-choice',
        question: 'Which Python data structure is ordered and mutable?',
        options: [
          'Tuple',
          'Set',
          'List',
          'Dictionary'
        ],
        correctAnswer: 2,
        explanation: 'Lists are ordered and mutable, allowing you to change, add, and remove items.',
        points: 10
      },
      {
        id: 'q24',
        type: 'multiple-choice',
        question: 'What is the correct way to create a dictionary in Python?',
        options: [
          '{"key": "value"}',
          '["key", "value"]',
          '("key", "value")',
          'key: value'
        ],
        correctAnswer: 0,
        explanation: 'Dictionaries are created using curly braces with key-value pairs separated by colons.',
        points: 10
      },
      {
        id: 'q25',
        type: 'fill-blank',
        question: 'The _____ function is used to get the length of a list in Python.',
        correctAnswer: 'len',
        explanation: 'The len() function returns the number of items in a sequence or collection.',
        points: 10
      }
    ],
    timeLimit: 1800, // 30 minutes
    passingScore: 70,
    maxAttempts: 3
  }
};