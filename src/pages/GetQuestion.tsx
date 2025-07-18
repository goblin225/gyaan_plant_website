import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQuestion, getanswer, executeCode } from "../services/service";
import { useParams, Link } from "react-router-dom";
import { BookOpen, X, Play, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/gyaan_logo.png";
import logoDark from "../assets/images/GyaanPlant_dark.png";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";

// Updated Question type to include code question fields
type Question = {
  _id: string;
  type: "mcq" | "code";
  question: string;
  options?: string[];
  correctAnswer?: string;
  codeTemplate?: string;
  language?: string;
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
  const [codeAnswers, setCodeAnswers] = useState<{
    [questionId: string]: string;
  }>({});
  const [codeResults, setCodeResults] = useState<{
    [questionId: string]: { output: string; error?: string; success: boolean };
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

  const currentQuestion = allQuestions[currentQuestionIndex];
  const isCurrentQuestionAnswered =
    currentQuestion?.type === "mcq"
      ? !!selectedAnswers[currentQuestion?._id]
      : !!codeAnswers[currentQuestion?._id];

  const allQuestionsAnswered = useMemo(() => {
    return allQuestions.every((question) => {
      if (question.type === "mcq") {
        return selectedAnswers[question._id];
      } else {
        return codeAnswers[question._id];
      }
    });
  }, [allQuestions, selectedAnswers, codeAnswers]);

  const handleOptionChange = (questionId: string, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleCodeChange = (questionId: string, code: string) => {
    setCodeAnswers((prev) => ({
      ...prev,
      [questionId]: code,
    }));
  };

  const runCode = async (questionId: string) => {
    const code = codeAnswers[questionId] || "";
    const language = currentQuestion?.language || "javascript";

    try {
      const result = (await executeCode(code, language)) as {
        success: boolean;
        output: string;
        error?: string;
      };

      setCodeResults((prev) => ({
        ...prev,
        [questionId]: {
          output: result.success ? result.output : "",
          error: result.success ? undefined : result.error,
          success: result.success,
        },
      }));
    } catch (error: any) {
      setCodeResults((prev) => ({
        ...prev,
        [questionId]: {
          output: "",
          error: error.message,
          success: false,
        },
      }));
    }
    setCodeAnswers((prev) => ({
      ...prev,
      [questionId]: code,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
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
      debugger;
      // Prepare answers in the required format
      const formattedAnswers = [
        ...Object.entries(selectedAnswers).map(
          ([questionId, selectedOption]) => ({
            questionId,
            selectedOption,
          })
        ),
        ...Object.entries(codeAnswers).map(([questionId, output]) => ({
          questionId,
          output: codeResults[questionId].output?.trim() || "",
        })),
      ];

      // Get the assessment ID from the selected assessment
      const assessmentId = selectedAssessment?._id;

      if (!assessmentId) {
        console.error("No assessment selected");
        return;
      }

      const payload = {
        userId: user?.id,
        answers: formattedAnswers,
      };

      const response = await getanswer(assessmentId, payload);
      setAssessmentResult(response.data);
      setIsPassed(response.data.passed);
      setShowResultDialog(true);
    } catch (error) {
      console.error("Error submitting assessment:", error);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2 mt-3 ml-3">
          <img
            src={logo}
            className="w-16 h-10 block dark:hidden"
            alt="Logo Light"
          />
          <img
            src={logoDark}
            className="w-16 h-10 hidden dark:block"
            alt="Logo Dark"
          />
        </div>
      </div>
      <div className="max-w-3xl mx-auto p-6">
        {allQuestions.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md p-4 dark:bg-gray-950">
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
                  {Object.keys(selectedAnswers).length +
                    Object.keys(codeAnswers).length}
                  /{allQuestions.length} answered
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${
                      ((Object.keys(selectedAnswers).length +
                        Object.keys(codeAnswers).length) /
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
                {currentQuestion?.question}
              </h3>

              {currentQuestion?.type === "mcq" ? (
                <div className="space-y-3">
                  {currentQuestion?.options?.map((option, i) => (
                    <label
                      key={i}
                      className={`flex items-center p-4 rounded-lg border cursor-pointer ${
                        selectedAnswers[currentQuestion._id] === option
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-gray-200 hover:bg-gray-200 dark:bg-gray-950 dark:hover:bg-gray-900"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion._id}`}
                        value={option}
                        checked={
                          selectedAnswers[currentQuestion._id] === option
                        }
                        onChange={() =>
                          handleOptionChange(currentQuestion._id, option)
                        }
                        className="hidden"
                      />
                      <div
                        className={`flex items-center justify-center h-5 w-5 rounded-full border mr-3 ${
                          selectedAnswers[currentQuestion._id] === option
                            ? "border-primary bg-primary"
                            : "border-gray-400"
                        }`}
                      >
                        {selectedAnswers[currentQuestion._id] === option && (
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="ml-1">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">
                      {currentQuestion?.codeTemplate}
                    </pre>
                  </div>

                  {/* Monaco Code Editor */}
                  <div className="border rounded-lg overflow-hidden">
                    <Editor
                      height="300px"
                      language={currentQuestion?.language || "javascript"}
                      value={
                        codeAnswers[currentQuestion._id] ||
                        currentQuestion?.codeTemplate ||
                        ""
                      }
                      onChange={(value) =>
                        handleCodeChange(currentQuestion._id, value || "")
                      }
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  </div>

                  {/* Run Code Button */}
                  <div className="flex justify-between items-center">
                    <Button
                      onClick={() => runCode(currentQuestion._id)}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4" />
                      <span>Run Code</span>
                    </Button>
                  </div>

                  {/* Code Output */}
                  {codeResults[currentQuestion._id] && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        {codeResults[currentQuestion._id].success ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mr-2" />
                        )}
                        Output:
                      </h4>
                      <div
                        className={`p-3 rounded-lg border text-sm font-mono ${
                          codeResults[currentQuestion._id].success
                            ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
                            : "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
                        }`}
                      >
                        {codeResults[currentQuestion._id].success
                          ? codeResults[currentQuestion._id].output
                          : codeResults[currentQuestion._id].error}
                      </div>
                    </div>
                  )}
                </div>
              )}
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
              onClick={() => window.close()}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            <div className="text-center pt-2">
              <div
                className={`text-5xl mb-4 ${
                  isPassed ? "text-green-500" : "text-yellow-500"
                }`}
              >
                {isPassed ? "🎉" : "⚠️"}
              </div>

              <h2 className="text-2xl font-bold mb-2">
                {isPassed ? "Congratulations!" : "Keep Trying!"}
              </h2>

              <p className="mb-4">
                You scored {assessmentResult?.score}/
                {assessmentResult?.totalMarks}
                {isPassed ? "!" : ". Try again!"}
              </p>

              <div className="grid grid-cols-2 gap-2 mb-4 text-left bg-gray-50 p-4 rounded">
                <div>Percentage:</div>
                <div className="font-semibold">
                  {assessmentResult?.percentage}%
                </div>
                <div>Status:</div>
                <div
                  className={`font-semibold ${
                    isPassed ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {isPassed ? "Passed" : "Not Passed"}
                </div>
                <div>Points Earned:</div>
                <div className="font-semibold">
                  {assessmentResult?.pointsEarned}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetQuestion;
