import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, BookOpen, Play, CheckCircle, PlayCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { VideoPlayer } from "../components/course/VideoPlayer";
import { useCourseStore } from "../store/courseStore";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  courseById,
  enrollInCourse,
  lessonEnd,
  lessonStart,
} from "../services/service";
import toast from "react-hot-toast";

export const CoursePage: React.FC = () => {
  const queryClient = useQueryClient();
  const { courseId } = useParams<{ courseId: string }>();
  const { markLessonComplete } = useCourseStore();
  const { isAuthenticated } = useAuth();
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userId = user?.id || "";
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const logIdRef = useRef<string | null>(null);

  const {
    data: courseData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => courseById(courseId!, userId!),
    enabled: !!courseId,
  });

  const course = courseData?.data || {};
  const isEnrolled = course?.isEnrolled ?? false;

  useEffect(() => {
    if (!selectedLesson && course?.lessons?.length > 0) {
      setSelectedLesson(course.lessons[0]._id);
    }
  }, [selectedLesson, course?.lessons]);

  const selectedLessonData = useMemo(() => {
    return (
      course?.lessons?.find((lesson: any) => lesson._id === selectedLesson) ||
      null
    );
  }, [selectedLesson, course?.lessons]);

  const handleLessonComplete = (lessonId: string) => {
    if (course?.id) markLessonComplete(course.id, lessonId);
  };

  const enrollMutation = useMutation({
    mutationFn: () => {
      if (!courseId || !user?.id)
        throw new Error("Missing courseId or user id");
      return enrollInCourse(courseId, user.id);
    },
    onSuccess: () => {
      toast.success("Successfully enrolled in the course!");
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      setTimeout(() => {
        refetch();
      }, 300);
    },
    onError: (error) => {
      console.error("Enrollment failed:", error);
    },
  });

  const startLessonMutation = useMutation({
    mutationFn: lessonStart,
    onSuccess: (data) => {
      console.log("Lesson start success:", data.data);
      logIdRef.current = data.data;
    },
    onError: (error) => {
      console.error("Lesson start failed:", error);
    },
  });

  const endLessonMutation = useMutation({
    mutationFn: lessonEnd,
    onSuccess: () => {
      if (selectedLessonData) {
        markLessonComplete(course?.id, selectedLessonData._id);
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      }
    },
    onError: (error) => {
      console.error("Lesson end failed:", error);
    },
  });

  const handleEnroll = () => {
    if (!courseId) return;
    enrollMutation.mutate();
  };

  if (isLoading) return <p className="text-center py-20">Loading course...</p>;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Badge className="mb-4">{course?.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {course?.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {course?.description}
              </p>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                    <img
                      src={course?.thumbnail}
                      alt={course?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {!isAuthenticated && (
                    <div className="space-y-3">
                      <Button className="w-full" size="lg" asChild>
                        <Link to="/signup">Sign Up to Enroll</Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link to="/login">Login</Link>
                      </Button>
                    </div>
                  )}

                  {isAuthenticated && !isEnrolled && (
                    <Button
                      className="w-full mt-4"
                      size="lg"
                      onClick={handleEnroll}
                      disabled={enrollMutation.isPending}
                    >
                      {enrollMutation.isPending
                        ? "Enrolling..."
                        : "Enroll in this Course"}
                    </Button>
                  )}

                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{course?.lessons?.length || 0} lessons</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{course?.duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {selectedLessonData ? (
              isEnrolled ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {selectedLessonData.title}
                    </h2>
                    <p className="text-muted-foreground">
                      {selectedLessonData.description}
                    </p>
                  </div>
                  <VideoPlayer
                    key={selectedLessonData?._id}
                    src={selectedLessonData?.videoUrl}
                    title={selectedLessonData?.title}
                    courseId={course?._id}
                    lessonId={selectedLessonData._id}
                    onStart={() => {
                      startLessonMutation.mutate({
                        userId,
                        courseId: courseId,
                        lessonId: selectedLessonData?._id,
                      });
                    }}
                    onEnd={() => {
                      if (logIdRef.current) {
                        endLessonMutation.mutate({ logId: logIdRef.current });
                      } else {
                        console.warn("⚠️ No logId to end!");
                      }
                    }}
                    onComplete={() =>
                      handleLessonComplete(selectedLessonData._id)
                    }
                  />
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Enroll to access this lesson
                    </h3>
                    <p className="text-muted-foreground">
                      Please enroll in the course to watch the videos.
                    </p>
                    <Button className="mt-4" onClick={handleEnroll}>
                      Enroll Now
                    </Button>
                  </CardContent>
                </Card>
              )
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Select a lesson to start learning
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a lesson from the list to begin your learning
                    journey.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1 sticky top-20 h-full overflow-y-auto max-h-[80vh] space-y-2">
            <h3 className="text-lg font-semibold mb-2">Lessons</h3>
            {course?.lessons?.map((lesson: any) => {
              const isCompleted =
                lesson.isCompleted ||
                courseData?.data?.completedLessons?.includes(lesson._id);
              const isSelected = selectedLesson === lesson._id;

              return (
                <button
                  key={lesson._id}
                  onClick={() => isEnrolled && setSelectedLesson(lesson._id)}
                  disabled={!isEnrolled}
                  className={`block w-full text-left p-2 rounded-md text-sm border flex items-center justify-between transition
        ${!isEnrolled ? "opacity-50 cursor-not-allowed" : ""}
        ${
          isCompleted && !isSelected
            ? "border-green-600 text-green-700 font-semibold"
            : ""
        }
        ${isSelected ? "bg-primary text-white border-primary" : ""}
      `}
                >
                  <div className="flex items-center space-x-2">
                    {isCompleted ? (
                      <CheckCircle
                        className={`h-4 w-4 ${
                          isCompleted && !isSelected
                            ? "border-green-600 text-green-700 font-semibold"
                            : ""
                        }`}
                      />
                    ) : (
                      <PlayCircle
                        className={`h-4 w-4 ${
                          !isSelected
                            ? "border-green-600 text-gray-600 font-semibold"
                            : ""
                        }`}
                      />
                    )}
                    <span>{lesson.title}</span>
                  </div>
                  <span className="text-xs">{lesson.duration}</span>
                </button>
              );
            })}
          {course.lessons?.length > 0 &&
 course.lessons.every((lesson:any) => lesson.isCompleted) ? (
   <Link 
    to={`/question/${courseId}`}
    target="blank"
    className="bg-primary hover:bg-primary text-white font-semibold py-2 px-4 rounded shadow-md transition duration-300 inline-block text-center"
  >
    Start Quiz
  </Link>
) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
