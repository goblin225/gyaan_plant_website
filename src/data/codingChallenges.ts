import type { CodingChallenge } from '../types';

export const codingChallenges: Record<string, CodingChallenge> = {
  'coding-hello-world': {
    id: 'coding-hello-world',
    title: 'Create a Hello World React Component',
    description: 'Create a simple React functional component that displays "Hello, World!" message with proper JSX syntax.',
    difficulty: 'easy',
    language: 'javascript',
    starterCode: `import React from 'react';

// Create a functional component called HelloWorld
function HelloWorld() {
  // Return JSX that displays "Hello, World!"
  return (
    // Your code here
  );
}

export default HelloWorld;`,
    solution: `import React from 'react';

function HelloWorld() {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
}

export default HelloWorld;`,
    testCases: [
      {
        input: 'HelloWorld component render',
        expectedOutput: 'Hello, World!',
        description: 'Component should render "Hello, World!" text'
      },
      {
        input: 'JSX structure check',
        expectedOutput: 'valid JSX',
        description: 'Component should return valid JSX'
      }
    ],
    hints: [
      'Use a functional component syntax',
      'Return JSX wrapped in a div or fragment',
      'Include an h1 tag with the text "Hello, World!"'
    ],
    timeLimit: 1800 // 30 minutes
  },

  'coding-profile-card': {
    id: 'coding-profile-card',
    title: 'Build a User Profile Card Component',
    description: 'Create a reusable UserProfile component that accepts props for name, email, avatar, and role, then displays them in a card format.',
    difficulty: 'medium',
    language: 'javascript',
    starterCode: `import React from 'react';

// Create a UserProfile component that accepts props
function UserProfile({ name, email, avatar, role }) {
  return (
    <div className="profile-card">
      {/* Display user information here */}
      {/* Include: avatar image, name, email, and role */}
    </div>
  );
}

// Example usage (don't modify this part)
function App() {
  return (
    <UserProfile 
      name="John Doe"
      email="john@example.com"
      avatar="https://example.com/avatar.jpg"
      role="Developer"
    />
  );
}

export default UserProfile;`,
    solution: `import React from 'react';

function UserProfile({ name, email, avatar, role }) {
  return (
    <div className="profile-card">
      <img src={avatar} alt={name} className="avatar" />
      <h2>{name}</h2>
      <p>{email}</p>
      <span className="role">{role}</span>
    </div>
  );
}

function App() {
  return (
    <UserProfile 
      name="John Doe"
      email="john@example.com"
      avatar="https://example.com/avatar.jpg"
      role="Developer"
    />
  );
}

export default UserProfile;`,
    testCases: [
      {
        input: 'Props: name="John Doe", email="john@example.com"',
        expectedOutput: 'Displays John Doe and john@example.com',
        description: 'Component should display the name and email from props'
      },
      {
        input: 'Props: avatar and role',
        expectedOutput: 'Shows avatar image and role badge',
        description: 'Component should display avatar image and role information'
      }
    ],
    hints: [
      'Use destructuring to extract props',
      'Display the avatar using an img tag',
      'Show name in an h2 tag',
      'Display email and role in appropriate tags'
    ],
    timeLimit: 2400 // 40 minutes
  },

  'coding-todo-app': {
    id: 'coding-todo-app',
    title: 'Build a Todo App with React Hooks',
    description: 'Create a fully functional todo application using useState and useEffect hooks. Include add, delete, and toggle functionality.',
    difficulty: 'hard',
    language: 'javascript',
    starterCode: `import React, { useState, useEffect } from 'react';

function TodoApp() {
  // State for todos array and input value
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Load todos from localStorage on component mount
  useEffect(() => {
    // Your code here
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    // Your code here
  }, [todos]);

  // Function to add a new todo
  const addTodo = () => {
    // Your code here
  };

  // Function to delete a todo
  const deleteTodo = (id) => {
    // Your code here
  };

  // Function to toggle todo completion
  const toggleTodo = (id) => {
    // Your code here
  };

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {/* Render todos here */}
      </ul>
    </div>
  );
}

export default TodoApp;`,
    solution: `import React, { useState, useEffect } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
        completed: false
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;`,
    testCases: [
      {
        input: 'Add todo "Learn React"',
        expectedOutput: 'Todo appears in list',
        description: 'Should add new todo to the list'
      },
      {
        input: 'Click on todo text',
        expectedOutput: 'Todo toggles completed state',
        description: 'Should toggle todo completion status'
      },
      {
        input: 'Click delete button',
        expectedOutput: 'Todo is removed from list',
        description: 'Should remove todo from the list'
      },
      {
        input: 'Refresh page',
        expectedOutput: 'Todos persist',
        description: 'Should save and load todos from localStorage'
      }
    ],
    hints: [
      'Use Date.now() for unique todo IDs',
      'Use the spread operator to add new todos',
      'Use filter() to remove todos',
      'Use map() to update specific todos',
      'Use JSON.stringify/parse for localStorage'
    ],
    timeLimit: 5400 // 90 minutes
  },

  'coding-complexity-analysis': {
    id: 'coding-complexity-analysis',
    title: 'Analyze Algorithm Complexity',
    description: 'Write functions and analyze their time complexity. Implement both O(n) and O(n²) solutions for comparison.',
    difficulty: 'medium',
    language: 'javascript',
    starterCode: `// Implement a function to find duplicates in an array
// Provide both O(n²) and O(n) solutions

// O(n²) solution using nested loops
function findDuplicatesNaive(arr) {
  const duplicates = [];
  // Your code here - use nested loops
  return duplicates;
}

// O(n) solution using a hash map/set
function findDuplicatesOptimal(arr) {
  const duplicates = [];
  // Your code here - use a Set or Map
  return duplicates;
}

// Test the functions
const testArray = [1, 2, 3, 2, 4, 5, 1, 6];
console.log("Naive:", findDuplicatesNaive(testArray));
console.log("Optimal:", findDuplicatesOptimal(testArray));`,
    solution: `function findDuplicatesNaive(arr) {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}

function findDuplicatesOptimal(arr) {
  const seen = new Set();
  const duplicates = new Set();
  
  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }
  
  return Array.from(duplicates);
}

const testArray = [1, 2, 3, 2, 4, 5, 1, 6];
console.log("Naive:", findDuplicatesNaive(testArray));
console.log("Optimal:", findDuplicatesOptimal(testArray));`,
    testCases: [
      {
        input: '[1, 2, 3, 2, 4, 5, 1, 6]',
        expectedOutput: '[1, 2]',
        description: 'Should find duplicates 1 and 2'
      },
      {
        input: '[1, 1, 1, 1]',
        expectedOutput: '[1]',
        description: 'Should handle multiple occurrences of same element'
      },
      {
        input: '[1, 2, 3, 4, 5]',
        expectedOutput: '[]',
        description: 'Should return empty array when no duplicates'
      }
    ],
    hints: [
      'For O(n²): use nested loops to compare each element with every other element',
      'For O(n): use a Set to track seen elements',
      'Avoid adding the same duplicate multiple times',
      'Consider using Set for the duplicates as well to avoid duplicates in result'
    ],
    timeLimit: 4500 // 75 minutes
  },

  'coding-quicksort': {
    id: 'coding-quicksort',
    title: 'Implement Quick Sort Algorithm',
    description: 'Implement the Quick Sort algorithm from scratch with proper partitioning and recursive calls.',
    difficulty: 'hard',
    language: 'javascript',
    starterCode: `// Implement Quick Sort algorithm
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Partition the array and get pivot index
    const pivotIndex = partition(arr, low, high);
    
    // Recursively sort elements before and after partition
    // Your code here
  }
  return arr;
}

// Partition function - places pivot in correct position
function partition(arr, low, high) {
  // Choose the rightmost element as pivot
  const pivot = arr[high];
  let i = low - 1; // Index of smaller element
  
  for (let j = low; j < high; j++) {
    // If current element is smaller than or equal to pivot
    if (arr[j] <= pivot) {
      i++;
      // Swap elements
      // Your code here
    }
  }
  
  // Place pivot in correct position
  // Your code here
  
  return i + 1; // Return pivot index
}

// Helper function to swap elements
function swap(arr, i, j) {
  // Your code here
}

// Test the implementation
const testArray = [64, 34, 25, 12, 22, 11, 90];
console.log("Original:", testArray);
console.log("Sorted:", quickSort([...testArray]));`,
    solution: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      swap(arr, i, j);
    }
  }
  
  swap(arr, i + 1, high);
  return i + 1;
}

function swap(arr, i, j) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

const testArray = [64, 34, 25, 12, 22, 11, 90];
console.log("Original:", testArray);
console.log("Sorted:", quickSort([...testArray]));`,
    testCases: [
      {
        input: '[64, 34, 25, 12, 22, 11, 90]',
        expectedOutput: '[11, 12, 22, 25, 34, 64, 90]',
        description: 'Should sort array in ascending order'
      },
      {
        input: '[5, 4, 3, 2, 1]',
        expectedOutput: '[1, 2, 3, 4, 5]',
        description: 'Should handle reverse sorted array'
      },
      {
        input: '[1]',
        expectedOutput: '[1]',
        description: 'Should handle single element array'
      },
      {
        input: '[]',
        expectedOutput: '[]',
        description: 'Should handle empty array'
      }
    ],
    hints: [
      'The partition function should place the pivot in its correct position',
      'Elements smaller than pivot go to the left, larger to the right',
      'Recursively sort the sub-arrays before and after the pivot',
      'Remember to swap elements correctly in the partition function'
    ],
    timeLimit: 6600 // 110 minutes
  },

  'coding-data-analysis': {
    id: 'coding-data-analysis',
    title: 'Data Analysis with Python Fundamentals',
    description: 'Create a Python script to analyze a dataset using basic Python data structures and functions.',
    difficulty: 'medium',
    language: 'python',
    starterCode: `# Data Analysis Script
# Analyze student grades data

# Sample data: list of dictionaries representing students
students = [
    {"name": "Alice", "grades": [85, 92, 78, 96, 88]},
    {"name": "Bob", "grades": [79, 85, 91, 82, 87]},
    {"name": "Charlie", "grades": [92, 88, 95, 89, 93]},
    {"name": "Diana", "grades": [76, 82, 79, 85, 80]},
    {"name": "Eve", "grades": [88, 91, 87, 94, 90]}
]

def calculate_average(grades):
    """Calculate the average of a list of grades"""
    # Your code here
    pass

def find_highest_average(students):
    """Find the student with the highest average grade"""
    # Your code here
    pass

def get_grade_statistics(students):
    """Calculate overall statistics for all students"""
    # Return a dictionary with: total_students, overall_average, highest_grade, lowest_grade
    # Your code here
    pass

def students_above_average(students, threshold=85):
    """Find students with average grade above threshold"""
    # Your code here
    pass

# Test your functions
print("Student averages:")
for student in students:
    avg = calculate_average(student["grades"])
    print(f"{student['name']}: {avg:.2f}")

print(f"\\nHighest average: {find_highest_average(students)}")
print(f"Statistics: {get_grade_statistics(students)}")
print(f"Students above 85: {students_above_average(students, 85)}")`,
    solution: `students = [
    {"name": "Alice", "grades": [85, 92, 78, 96, 88]},
    {"name": "Bob", "grades": [79, 85, 91, 82, 87]},
    {"name": "Charlie", "grades": [92, 88, 95, 89, 93]},
    {"name": "Diana", "grades": [76, 82, 79, 85, 80]},
    {"name": "Eve", "grades": [88, 91, 87, 94, 90]}
]

def calculate_average(grades):
    """Calculate the average of a list of grades"""
    if not grades:
        return 0
    return sum(grades) / len(grades)

def find_highest_average(students):
    """Find the student with the highest average grade"""
    if not students:
        return None
    
    highest_student = students[0]
    highest_avg = calculate_average(highest_student["grades"])
    
    for student in students[1:]:
        avg = calculate_average(student["grades"])
        if avg > highest_avg:
            highest_avg = avg
            highest_student = student
    
    return {"name": highest_student["name"], "average": highest_avg}

def get_grade_statistics(students):
    """Calculate overall statistics for all students"""
    if not students:
        return {}
    
    all_grades = []
    for student in students:
        all_grades.extend(student["grades"])
    
    return {
        "total_students": len(students),
        "overall_average": sum(all_grades) / len(all_grades),
        "highest_grade": max(all_grades),
        "lowest_grade": min(all_grades)
    }

def students_above_average(students, threshold=85):
    """Find students with average grade above threshold"""
    result = []
    for student in students:
        avg = calculate_average(student["grades"])
        if avg > threshold:
            result.append({"name": student["name"], "average": avg})
    return result

# Test your functions
print("Student averages:")
for student in students:
    avg = calculate_average(student["grades"])
    print(f"{student['name']}: {avg:.2f}")

print(f"\\nHighest average: {find_highest_average(students)}")
print(f"Statistics: {get_grade_statistics(students)}")
print(f"Students above 85: {students_above_average(students, 85)}")`,
    testCases: [
      {
        input: 'Alice grades: [85, 92, 78, 96, 88]',
        expectedOutput: 'Average: 87.8',
        description: 'Should calculate correct average for Alice'
      },
      {
        input: 'Find highest average student',
        expectedOutput: 'Charlie with average 91.4',
        description: 'Should identify Charlie as highest average student'
      },
      {
        input: 'Overall statistics calculation',
        expectedOutput: 'Correct total students, overall average, min/max grades',
        description: 'Should calculate correct overall statistics'
      },
      {
        input: 'Students above threshold 85',
        expectedOutput: 'Alice, Charlie, Eve',
        description: 'Should find students with average above 85'
      }
    ],
    hints: [
      'Use sum() and len() functions to calculate averages',
      'Iterate through students to find the highest average',
      'Use extend() to combine all grades into one list',
      'Use list comprehension or loops to filter students above threshold'
    ],
    timeLimit: 12000 // 200 minutes
  }
};