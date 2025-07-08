import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, CheckCircle, XCircle, Lightbulb, Clock, Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { useThemeStore } from '../../store/themeStore';
import { codingChallenges } from '../../data/codingChallenges';
import type { TestResult, CodingChallenge } from '../../types';

interface CodeEditorProps {
  challengeId: string;
  onComplete: (passed: boolean, score: number) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ challengeId, onComplete }) => {
  const { theme } = useThemeStore();
  const challenge = codingChallenges[challengeId];
  
  const [code, setCode] = useState(challenge?.starterCode || '// Write your solution here\n');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!challenge) {
    return (
      <Card className="max-w-6xl mx-auto">
        <CardContent className="p-8 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Challenge Not Found</h3>
          <p className="text-muted-foreground">The requested coding challenge could not be loaded.</p>
        </CardContent>
      </Card>
    );
  }

  const runCode = async () => {
    setIsRunning(true);
    setShowResults(false);
    setOutput('Running code...');
    
    try {
      // Simulate code execution and testing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock test execution - in a real app, this would send code to a backend service
      const results: TestResult[] = challenge.testCases.map((testCase, index) => {
        // Simple simulation based on code content
        const codeContent = code.toLowerCase();
        let passed = false;
        
        // Basic pattern matching for different challenges
        if (challengeId === 'coding-hello-world') {
          passed = codeContent.includes('hello') && codeContent.includes('world') && codeContent.includes('return');
        } else if (challengeId === 'coding-profile-card') {
          passed = codeContent.includes('name') && codeContent.includes('email') && codeContent.includes('avatar');
        } else if (challengeId === 'coding-todo-app') {
          passed = codeContent.includes('usestate') && codeContent.includes('map') && codeContent.includes('filter');
        } else {
          // For other challenges, use a more sophisticated check
          passed = Math.random() > 0.3; // 70% chance of passing for demo
        }
        
        return {
          passed,
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: passed ? testCase.expectedOutput : 'Incorrect output',
          description: testCase.description,
          executionTime: Math.random() * 100
        };
      });

      const passedTests = results.filter(r => r.passed).length;
      const totalTests = results.length;
      const calculatedScore = Math.round((passedTests / totalTests) * 100);
      
      setTestResults(results);
      setScore(calculatedScore);
      setOutput(`Code executed successfully!\nPassed ${passedTests}/${totalTests} tests\nScore: ${calculatedScore}%`);
      setShowResults(true);
      
      const allPassed = results.every(r => r.passed);
      if (allPassed) {
        setIsCompleted(true);
        onComplete(true, calculatedScore);
      }
    } catch (error) {
      setOutput('Error executing code: ' + (error as Error).message);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(challenge.starterCode);
    setOutput('');
    setTestResults([]);
    setShowResults(false);
    setIsCompleted(false);
    setScore(0);
  };

  const saveCode = () => {
    localStorage.setItem(`code-${challengeId}`, code);
    setOutput('Code saved locally!');
  };

  const loadSavedCode = () => {
    const savedCode = localStorage.getItem(`code-${challengeId}`);
    if (savedCode) {
      setCode(savedCode);
      setOutput('Saved code loaded!');
    }
  };

  const showNextHint = () => {
    if (currentHint < (challenge.hints?.length || 0) - 1) {
      setCurrentHint(prev => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Challenge Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-3">
                <span>{challenge.title}</span>
                <Badge className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty.toUpperCase()}
                </Badge>
                {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
              </CardTitle>
              <p className="text-muted-foreground mt-2">{challenge.description}</p>
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeSpent)}</span>
              </div>
              {challenge.timeLimit && (
                <div className="text-sm text-muted-foreground">
                  Limit: {formatTime(challenge.timeLimit)}
                </div>
              )}
              {score > 0 && (
                <Badge variant={score >= 70 ? 'default' : 'destructive'}>
                  Score: {score}%
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Code Editor</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadSavedCode}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Load</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={saveCode}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetCode}
                className="flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </Button>
              <Button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>{isRunning ? 'Running...' : 'Run Code'}</span>
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Editor
              height="500px"
              defaultLanguage={challenge.language}
              theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                renderLineHighlight: 'all',
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                cursorStyle: 'line',
              }}
            />
          </div>

          {/* Hints Section */}
          {challenge.hints && challenge.hints.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5" />
                    <span>Hints</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHints(!showHints)}
                  >
                    {showHints ? 'Hide' : 'Show'} Hints
                  </Button>
                </div>
              </CardHeader>
              {showHints && (
                <CardContent>
                  <div className="space-y-3">
                    {challenge.hints.slice(0, currentHint + 1).map((hint, index) => (
                      <div key={index} className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Hint {index + 1}:</strong> {hint}
                        </p>
                      </div>
                    ))}
                    {currentHint < challenge.hints.length - 1 && (
                      <Button variant="outline" size="sm" onClick={showNextHint}>
                        Show Next Hint
                      </Button>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </div>

        {/* Output and Test Results */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Output & Test Results</h3>
          
          {/* Console Output */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Console Output</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-4 rounded-lg min-h-[100px] font-mono">
                {output || 'Click "Run Code" to see output'}
              </pre>
            </CardContent>
          </Card>

          {/* Test Results */}
          {showResults && testResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Test Results</span>
                  <Badge variant={testResults.every(r => r.passed) ? 'default' : 'destructive'}>
                    {testResults.filter(r => r.passed).length}/{testResults.length} Passed
                  </Badge>
                </CardTitle>
                <Progress 
                  value={(testResults.filter(r => r.passed).length / testResults.length) * 100} 
                  className="h-2" 
                />
              </CardHeader>
              <CardContent className="space-y-3">
                {testResults.map((result, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Test Case {index + 1}</span>
                      <Badge variant={result.passed ? 'default' : 'destructive'}>
                        {result.passed ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {result.passed ? 'Passed' : 'Failed'}
                      </Badge>
                    </div>
                    <div className="text-xs space-y-1">
                      <div><strong>Input:</strong> {result.input}</div>
                      <div><strong>Expected:</strong> {result.expected}</div>
                      <div><strong>Actual:</strong> {result.actual}</div>
                      {result.description && (
                        <div><strong>Description:</strong> {result.description}</div>
                      )}
                      {result.executionTime && (
                        <div><strong>Execution Time:</strong> {result.executionTime.toFixed(2)}ms</div>
                      )}
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Challenge Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Challenge Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><strong>Language:</strong> {challenge.language}</div>
              <div><strong>Difficulty:</strong> {challenge.difficulty}</div>
              <div><strong>Test Cases:</strong> {challenge.testCases.length}</div>
              {challenge.timeLimit && (
                <div><strong>Time Limit:</strong> {formatTime(challenge.timeLimit)}</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};