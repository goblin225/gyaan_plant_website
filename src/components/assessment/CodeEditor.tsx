import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';

interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  language: string;
  starterCode: string;
  testCases: TestCase[];
  difficulty: 'easy' | 'medium' | 'hard';
}

const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Hello World',
    description: 'Return the string "Hello World".',
    language: 'javascript',
    starterCode: `function greet() {
  return "";
}`,
    difficulty: 'easy',
    testCases: [
      { input: '', expectedOutput: 'Hello World', description: 'Should return Hello World' },
    ],
  },
  {
    id: '2',
    title: 'Add Two Numbers',
    description: 'Return the sum of two numbers.',
    language: 'javascript',
    starterCode: `function add(a, b) {
  return 0;
}`,
    difficulty: 'easy',
    testCases: [
      { input: '2, 3', expectedOutput: '5', description: 'Should return 5' },
      { input: '-1, 4', expectedOutput: '3', description: 'Should return 3' },
    ],
  },
  {
    id: '3',
    title: 'Is Even',
    description: 'Return true if a number is even, false otherwise.',
    language: 'javascript',
    starterCode: `function isEven(n) {
  return false;
}`,
    difficulty: 'medium',
    testCases: [
      { input: '4', expectedOutput: 'true', description: '4 is even' },
      { input: '7', expectedOutput: 'false', description: '7 is not even' },
    ],
  },
  {
    id: '4',
    title: 'Reverse String',
    description: 'Reverse the given string.',
    language: 'javascript',
    starterCode: `function reverseStr(str) {
  return "";
}`,
    difficulty: 'medium',
    testCases: [
      { input: '"abc"', expectedOutput: 'cba', description: 'Reverse abc' },
      { input: '"hello"', expectedOutput: 'olleh', description: 'Reverse hello' },
    ],
  },
  {
    id: '5',
    title: 'Factorial',
    description: 'Return the factorial of a number.',
    language: 'javascript',
    starterCode: `function factorial(n) {
  return 1;
}`,
    difficulty: 'hard',
    testCases: [
      { input: '3', expectedOutput: '6', description: '3! = 6' },
      { input: '5', expectedOutput: '120', description: '5! = 120' },
    ],
  },
];

const CodeEditorWithMultipleQuestions = () => {
  const [selectedId, setSelectedId] = useState('1');
  const challenge = challenges.find(c => c.id === selectedId)!;

  const [code, setCode] = useState(challenge.starterCode);
  const [results, setResults] = useState<{ passed: boolean; actual: string }[]>([]);
  const [showResults, setShowResults] = useState(false);

  // const runCode = () => {
  //   setShowResults(false);

  //   // Dummy logic — in real apps this would use actual evaluation
  //   const lowerCode = code.toLowerCase();
  //   const validations = challenge.testCases.map((tc) => {
  //     let actual = 'Wrong';
  //     let passed = false;

  //     switch (challenge.id) {
  //       case '1':
  //         actual = 'Hello World';
  //         break;
  //       case '2':
  //         actual = eval(`(${code}); add(${tc.input})`).toString();
  //         break;
  //       case '3':
  //         actual = eval(`(${code}); isEven(${tc.input})`).toString();
  //         break;
  //       case '4':
  //         actual = eval(`(${code}); reverseStr(${tc.input})`).toString();
  //         break;
  //       case '5':
  //         actual = eval(`(${code}); factorial(${tc.input})`).toString();
  //         break;
  //     }

  //     passed = actual === tc.expectedOutput;
  //     return { passed, actual };
  //   });

  //   setResults(validations);
  //   setShowResults(true);
  // };

  const runCode = () => {
  setShowResults(false);

  const validate = (fnName: string, inputs: string): { actual: string; error?: string } => {
    try {
      // Define function safely and call it
      const fullCode = `${code}; result = ${fnName}(${inputs});`;
      let result: any;
      eval(fullCode);
      return { actual: String(result) };
    } catch (err: any) {
      return { actual: 'Error', error: err.message };
    }
  };

  const validations = challenge.testCases.map((tc) => {
    let fnName = '';

    switch (challenge.id) {
      case '2':
        fnName = 'add';
        break;
      case '3':
        fnName = 'isEven';
        break;
      case '4':
        fnName = 'reverseStr';
        break;
      case '5':
        fnName = 'factorial';
        break;
      default:
        return {
          passed: code.toLowerCase().includes('hello world'),
          actual: 'Hello World',
        };
    }

    const { actual } = validate(fnName, tc.input);
    const passed = actual === tc.expectedOutput;
    return { passed, actual };
  });

  setResults(validations);
  setShowResults(true);
};

  const handleChangeChallenge = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    const newChallenge = challenges.find(c => c.id === newId)!;
    setSelectedId(newId);
    setCode(newChallenge.starterCode);
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 max-w-7xl mx-auto">
      {/* Left Side - Editor */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{challenge.title}</CardTitle>
              <select
                value={selectedId}
                onChange={handleChangeChallenge}
                className="border rounded px-2 py-1 text-sm"
              >
                {challenges.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <p className="text-sm text-muted-foreground">{challenge.description}</p>
          </CardHeader>
          <CardContent>
            <Editor
              height="400px"
              language={challenge.language}
              value={code}
              onChange={(val) => setCode(val || '')}
              theme="vs-dark"
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </CardContent>
        </Card>

        <Button onClick={runCode} className="flex items-center space-x-2">
          <Play className="h-4 w-4" />
          <span>Run & Validate</span>
        </Button>
      </div>

      {/* Right Side - Results */}
      <div className="space-y-4">
        {showResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Test Results
                <Badge variant={results.every(r => r.passed) ? 'default' : 'destructive'}>
                  {results.filter(r => r.passed).length}/{results.length} Passed
                </Badge>
              </CardTitle>
              <Progress
                value={(results.filter(r => r.passed).length / results.length) * 100}
                className="h-2"
              />
            </CardHeader>
            <CardContent className="space-y-2">
              {results.map((res, i) => (
                <div key={i} className="flex items-center justify-between border p-2 rounded">
                  <div>
                    <p className="text-sm">{challenge.testCases[i].description}</p>
                    <p className="text-xs text-muted-foreground">Expected: {challenge.testCases[i].expectedOutput}</p>
                    <p className="text-xs">Actual: {res.actual}</p>
                  </div>
                  <Badge variant={res.passed ? 'default' : 'destructive'}>
                    {res.passed ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    {res.passed ? 'Passed' : 'Failed'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CodeEditorWithMultipleQuestions;
