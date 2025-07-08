import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, RotateCcw, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { Badge } from '../ui/Badge';
import { quizData } from '../../data/quizData';
import { useCourseStore } from '../../store/courseStore';
import type { Quiz, Question } from '../../types';

interface QuizComponentProps {
  quizId: string;
  courseId: string;
  onComplete: (score: number, passed: boolean) => void;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ quizId, courseId, onComplete }) => {
  const quiz = quizData[quizId];
  const { addQuizScore, userProgress } = useCourseStore();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(quiz?.timeLimit || 0);
  const [showResults, setShowResults] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([]);

  const maxAttempts = quiz?.maxAttempts || 3;
  const previousScore = userProgress[courseId]?.quizScores?.[quizId] || 0;

  useEffect(() => {
    if (quiz?.timeLimit && timeRemaining > 0 && !isCompleted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleQuizComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining, isCompleted, quiz?.timeLimit]);

  if (!quiz) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Quiz Not Found</h3>
          <p className="text-muted-foreground">The requested quiz could not be loaded.</p>
        </CardContent>
      </Card>
    );
  }

  const handleAnswerSelect = (questionIndex: number, answer: any) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuizComplete = () => {
    const results: boolean[] = [];
    let totalScore = 0;
    let maxScore = 0;

    quiz.questions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index];
      const isCorrect = checkAnswer(question, userAnswer);
      results.push(isCorrect);
      
      if (isCorrect) {
        totalScore += question.points || 10;
      }
      maxScore += question.points || 10;
    });

    const finalScore = Math.round((totalScore / maxScore) * 100);
    const passed = finalScore >= quiz.passingScore;

    setCorrectAnswers(results);
    setScore(finalScore);
    setIsCompleted(true);
    setShowResults(true);
    setAttempts(prev => prev + 1);

    // Save score to store
    addQuizScore(courseId, quizId, finalScore);
    onComplete(finalScore, passed);
  };

  const checkAnswer = (question: Question, userAnswer: any): boolean => {
    switch (question.type) {
      case 'multiple-choice':
        return userAnswer === question.correctAnswer;
      case 'true-false':
        return userAnswer === question.correctAnswer;
      case 'fill-blank':
        return userAnswer?.toLowerCase().trim() === String(question.correctAnswer).toLowerCase().trim();
      default:
        return false;
    }
  };

  const resetQuiz = () => {
    if (attempts >= maxAttempts) return;
    
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setIsCompleted(false);
    setScore(0);
    setTimeRemaining(quiz.timeLimit || 0);
    setShowResults(false);
    setCorrectAnswers([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const canRetake = attempts < maxAttempts && !score || score < quiz.passingScore;

  if (isCompleted && showResults) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            {score >= quiz.passingScore ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : (
              <XCircle className="h-8 w-8 text-red-500" />
            )}
            <span>Quiz Complete!</span>
          </CardTitle>
          <div className="flex justify-center space-x-4 mt-4">
            <Badge variant={score >= quiz.passingScore ? 'default' : 'destructive'}>
              Score: {score}%
            </Badge>
            <Badge variant="outline">
              Attempt {attempts}/{maxAttempts}
            </Badge>
            {previousScore > 0 && (
              <Badge variant="secondary">
                Previous Best: {previousScore}%
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
            <p className="text-muted-foreground">
              {score >= quiz.passingScore 
                ? 'Congratulations! You passed the quiz.' 
                : `You need ${quiz.passingScore}% to pass.`
              }
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {correctAnswers.filter(Boolean).length}
              </div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {correctAnswers.filter(answer => !answer).length}
              </div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {quiz.questions.length - Object.keys(selectedAnswers).length}
              </div>
              <div className="text-sm text-muted-foreground">Skipped</div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Detailed Results</h3>
            {quiz.questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = correctAnswers[index];
              
              return (
                <Card key={question.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium">Question {index + 1}</span>
                    <Badge variant={isCorrect ? 'default' : 'destructive'}>
                      {isCorrect ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">{question.question}</p>
                    
                    {question.type === 'multiple-choice' && question.options && (
                      <div className="space-y-1">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-2 rounded text-sm ${
                              optionIndex === question.correctAnswer
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : optionIndex === userAnswer
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : 'bg-gray-50'
                            }`}
                          >
                            {option}
                            {optionIndex === question.correctAnswer && ' ✓ (Correct)'}
                            {optionIndex === userAnswer && optionIndex !== question.correctAnswer && ' ✗ (Your answer)'}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {question.type === 'fill-blank' && (
                      <div className="space-y-1">
                        <p className="text-sm">Your answer: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{userAnswer || 'No answer'}</span></p>
                        <p className="text-sm">Correct answer: <span className="font-mono bg-green-100 px-2 py-1 rounded">{question.correctAnswer}</span></p>
                      </div>
                    )}
                    
                    {question.type === 'true-false' && (
                      <div className="space-y-1">
                        <p className="text-sm">Your answer: <span className="font-semibold">{userAnswer !== undefined ? (userAnswer ? 'True' : 'False') : 'No answer'}</span></p>
                        <p className="text-sm">Correct answer: <span className="font-semibold">{question.correctAnswer ? 'True' : 'False'}</span></p>
                      </div>
                    )}
                    
                    {question.explanation && (
                      <div className="mt-2 p-2 bg-blue-50 rounded">
                        <p className="text-sm text-blue-800">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {canRetake && (
            <div className="text-center">
              <Button onClick={resetQuiz} className="mr-4">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                {maxAttempts - attempts} attempts remaining
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{quiz.title}</CardTitle>
          {quiz.timeLimit && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className={timeRemaining < 60 ? 'text-red-500 font-bold' : ''}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>
        
        {quiz.description && (
          <p className="text-sm text-muted-foreground">{quiz.description}</p>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Passing Score: {quiz.passingScore}%</span>
          <span>Attempt {attempts + 1}/{maxAttempts}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">{currentQ.question}</h3>
          
          {currentQ.type === 'multiple-choice' && currentQ.options && (
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                    selectedAnswers[currentQuestion] === index 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={index}
                    checked={selectedAnswers[currentQuestion] === index}
                    onChange={() => handleAnswerSelect(currentQuestion, index)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestion] === index 
                      ? 'border-primary bg-primary' 
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}
          
          {currentQ.type === 'true-false' && (
            <div className="space-y-3">
              {[true, false].map((value) => (
                <label
                  key={value.toString()}
                  className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                    selectedAnswers[currentQuestion] === value 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={value.toString()}
                    checked={selectedAnswers[currentQuestion] === value}
                    onChange={() => handleAnswerSelect(currentQuestion, value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestion] === value 
                      ? 'border-primary bg-primary' 
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestion] === value && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span>{value ? 'True' : 'False'}</span>
                </label>
              ))}
            </div>
          )}
          
          {currentQ.type === 'fill-blank' && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter your answer..."
                value={selectedAnswers[currentQuestion] || ''}
                onChange={(e) => handleAnswerSelect(currentQuestion, e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};