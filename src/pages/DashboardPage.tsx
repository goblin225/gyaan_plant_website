import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Trophy, TrendingUp, Play, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CourseCard } from '../components/course/CourseCard';
import { formatDuration } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getEnrollCourse } from '../services/service';

export const DashboardPage: React.FC = () => {

  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: () => getEnrollCourse(user!.id),
    enabled: !!user?.id,
  });

  const enrolledCourses = React.useMemo(() => {
    return data?.data?.map((enrollment: any) => ({
      id: enrollment.course._id,
      title: enrollment.course.title,
      thumbnail: enrollment.course.thumbnail,
      category: enrollment.course.category,
      description: enrollment.course.description,
      lessons: enrollment.course.lessons || [],
      enrolledAt: enrollment.enrolledAt,
      progress: {
        completedLessons: enrollment.progress?.completedLessons || [],
        startedAt: enrollment.progress?.startedAt,
        updatedAt: enrollment.progress?.updatedAt,
        progress: enrollment.progress?.completionPercent || 0,
      },
    })) || [];
  }, [data]);

  const completedCourses = React.useMemo(() => {
    return enrolledCourses.filter((c: { progress: { progress: number; }; }) => c.progress.progress === 100);
  }, [enrolledCourses]);

  const recentActivity = React.useMemo(() => {
    return enrolledCourses
      .map((course: { progress: { updatedAt: any; startedAt: any; }; enrolledAt: any; }) => ({
        course,
        progress: course.progress,
        lastAccessed: new Date(course.progress.updatedAt || course.progress.startedAt || course.enrolledAt),
      }))
      .sort((a: { lastAccessed: { getTime: () => number; }; }, b: { lastAccessed: { getTime: () => number; }; }) => b.lastAccessed.getTime() - a.lastAccessed.getTime())
      .slice(0, 3);
  }, [enrolledCourses]);

  const totalTimeSpent = React.useMemo(() => {
    return enrolledCourses.reduce((sum: any, course: { progress: { timeSpent: any; }; }) => {
      return sum + (course.progress?.timeSpent || 0);
    }, 0);
  }, [enrolledCourses]);

  const averageProgress = React.useMemo(() => {
    if (enrolledCourses.length === 0) return 0;
    const totalProgress = enrolledCourses.reduce((sum: any, course: { progress: { progress: any; }; }) => {
      return sum + (course.progress?.progress || 0);
    }, 0);
    return Math.round(totalProgress / enrolledCourses.length);
  }, [enrolledCourses]);

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please log in to view your dashboard</h1>
          <Button asChild className="mt-4">
            <Link to="/login">Log In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">Continue your learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrolledCourses?.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedCourses.length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(totalTimeSpent)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProgress}%</div>
            <Progress value={averageProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          {/* <CardContent>
            <div className="text-2xl font-bold">{user.achievements?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Badges earned</p>
          </CardContent> */}
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Continue Learning</h2>
          <Button variant="outline" asChild>
            <Link to="/my-learning">View All</Link>
          </Button>
        </div>

        {recentActivity.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentActivity?.map(({ course, progress }: any) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={progress}
                showProgress={true}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
              <p className="text-muted-foreground mb-4">
                Start your learning journey by enrolling in a course
              </p>
              <Button asChild>
                <Link to="/browse">Browse Courses</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <Card>
          <CardContent className="p-6">
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map(({ course, progress }: any) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Last accessed {new Date(progress.updatedAt || progress.startedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{progress.progress}% complete</p>
                        <Progress
                          value={progress.progress}
                          className={`w-24 h-2 ${progress.progress === 100
                            ? 'bg-green-500'
                            : progress.progress >= 50
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                            }`}
                        />
                      </div>
                      <Button size="sm" asChild>
                        <Link to={`/course/${course.id}`}>
                          {/* <Play className="h-4 w-4 mr-1" /> */}
                          Continue
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
