import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQuestion,getanswer } from "../services/service";
import { useParams, Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/gyaan_logo.png";
import { X } from 'lucide-react'; // Add this import at the top
import { useNavigate } from 'react-router-dom';

type Question = {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  marks: number;
};

type Assessment = {
  _id: string;
  title: string;
  totalMarks: number;
  passPercentage: number;
  timeLimit: number;
  questions: Question[];
  course?: {
    _id?: string;
    id?: string;
  };
};

const GetQuestion = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [questionId: string]: string;
  }>({});
const [showResultDialog, setShowResultDialog] = useState(false);
const [assessmentResult, setAssessmentResult] = useState<any>(null);
const [isPassed, setIsPassed] = useState(false);
const navigate = useNavigate();



  const {
    data: questionData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["getQuestion", courseId],
    queryFn: getQuestion,
  });

  window.scroll(0, 0);

  const { selectedAssessment, allQuestions } = useMemo(() => {
    const filteredByCourse: Assessment[] =
      questionData?.data?.filter((assessment: Assessment) => {
        const assessmentCourseId =
          assessment.course?._id || assessment.course?.id;
        return assessmentCourseId === courseId;
      }) || [];

    if (filteredByCourse.length === 0) {
      return { selectedAssessment: null, allQuestions: [] };
    }

    const randomIndex = Math.floor(Math.random() * filteredByCourse.length);
    const selectedAssessment = filteredByCourse[randomIndex];

    const allQuestions = selectedAssessment.questions.map((question) => ({
      ...question,
      assessmentTitle: selectedAssessment.title,
    }));

    return { selectedAssessment, allQuestions };
  }, [questionData, courseId]);

  const isCurrentQuestionAnswered =
    !!selectedAnswers[allQuestions[currentQuestionIndex]?._id];
  const allQuestionsAnswered = useMemo(() => {
    return allQuestions.every((question) => selectedAnswers[question._id]);
  }, [allQuestions, selectedAnswers]);

  const handleOptionChange = (questionId: string, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }else{
      submitAssessment();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitAssessment = async () => {
  try {
    // Prepare answers in the required format
    const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption
    }));

    // Get the assessment ID from the selected assessment
    const assessmentId = selectedAssessment?._id;
    
    if (!assessmentId) {
      console.error("No assessment selected");
      return;
    }

    const payload = {
      userId: user?.id, 
      answers: formattedAnswers,
      // assessmentId: assessmentId
    };

    const response = await getanswer(assessmentId,payload)
     setAssessmentResult(response.data);
    setIsPassed(response.data.passed);
    setShowResultDialog(true);
        
  } catch (error) {
    console.error('Error submitting assessment:', error);
  }
};
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-12 w-12 rounded-full border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
        <p>Error loading questions: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-3">
        <img src={logo} className="w-26 h-10 pl-7 mt-3" alt="Logo" />
      </div>
      <div className="max-w-3xl mx-auto p-6">
        {allQuestions.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h1 className="text-2xl text-center mb-2 text-primary font-bold">
              QUIZ
            </h1>
            <p className="text-center text-gray-600 mb-8 font-bold text-xl">
              {selectedAssessment?.title}
            </p>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium text-gray-500">
                  QUESTION {currentQuestionIndex + 1}/{allQuestions.length}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {Object.keys(selectedAnswers).length}/{allQuestions.length}{" "}
                  answered
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${
                      (Object.keys(selectedAnswers).length /
                        allQuestions.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            <div>
              <h3 className="text-lg font-medium mb-6">
                {allQuestions[currentQuestionIndex]?.question}
              </h3>
              <div className="space-y-3">
                {allQuestions[currentQuestionIndex]?.options.map(
                  (option, i) => (
                    <label
                      key={i}
                      className={`flex items-center p-4 rounded-lg border cursor-pointer ${
                        selectedAnswers[
                          allQuestions[currentQuestionIndex]._id
                        ] === option
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${allQuestions[currentQuestionIndex]._id}`}
                        value={option}
                        checked={
                          selectedAnswers[
                            allQuestions[currentQuestionIndex]._id
                          ] === option
                        }
                        onChange={() =>
                          handleOptionChange(
                            allQuestions[currentQuestionIndex]._id,
                            option
                          )
                        }
                        className="hidden"
                      />
                      <div
                        className={`flex items-center justify-center h-5 w-5 rounded-full border mr-3 ${
                          selectedAnswers[
                            allQuestions[currentQuestionIndex]._id
                          ] === option
                            ? "border-primary bg-primary"
                            : "border-gray-400"
                        }`}
                      >
                        {selectedAnswers[
                          allQuestions[currentQuestionIndex]._id
                        ] === option && (
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="ml-1">{option}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 rounded-md ${
                  currentQuestionIndex === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                ← Previous
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={
                  (currentQuestionIndex === allQuestions.length - 1 &&
                    !allQuestionsAnswered) ||
                  (!isCurrentQuestionAnswered &&
                    currentQuestionIndex < allQuestions.length - 1)
                }
                className={`px-4 py-2 rounded-md ${
                  (currentQuestionIndex === allQuestions.length - 1 &&
                    !allQuestionsAnswered) ||
                  (!isCurrentQuestionAnswered &&
                    currentQuestionIndex < allQuestions.length - 1)
                    ? "bg-primary/50 text-white cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {currentQuestionIndex === allQuestions.length - 1
                  ? "Finish"
                  : "Next Question →"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium mt-4">No assessments found</h3>
            <p className="text-sm text-gray-500 mt-2">
              This course doesn't have any assessments yet.
            </p>
            {user?.role === "instructor" && (
              <Button asChild className="mt-4">
                <Link to={`/courses/${courseId}/assessments/create`}>
                  Create your first assessment
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
{showResultDialog && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-8 rounded-lg max-w-md w-full shadow-xl relative">
      <button 
        onClick={ ()=>window.close()  }
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5 text-gray-500" />
      </button>
      
      <div className="text-center pt-2"> 
        <div className={`text-5xl mb-4 ${isPassed ? 'text-green-500' : 'text-yellow-500'}`}>
          {isPassed ? '🎉' : '⚠️'}
        </div>
        
        <h2 className="text-2xl font-bold mb-2">
          {isPassed ? 'Congratulations!' : 'Keep Trying!'}
        </h2>
        
        <p className="mb-4">
          You scored {assessmentResult?.score}/{assessmentResult?.totalMarks}
          {isPassed ? '!' : '. Try again!'}
        </p>
        
        <div className="grid grid-cols-2 gap-2 mb-4 text-left bg-gray-50 p-4 rounded">
          <div>Percentage:</div>
          <div className="font-semibold">{assessmentResult?.percentage}%</div>
          <div>Status:</div>
          <div className={`font-semibold ${isPassed ? 'text-green-600' : 'text-yellow-600'}`}>
            {isPassed ? 'Passed' : 'Not Passed'}
          </div>
          <div>Points Earned:</div>
          <div className="font-semibold">{assessmentResult?.pointsEarned}</div>
          
        </div>
        
        {/* <button
          onClick={() => setShowResultDialog(false)}
          className={`px-6 py-2 rounded-md text-white ${
            isPassed ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'
          } transition-colors`}
        >
          {isPassed ? 'Continue' : 'Try Again'}
        </button> */}
      </div>
    </div>
  </div>
)}

    </div>
    
  );
};

export default GetQuestion;
