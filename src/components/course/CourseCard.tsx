import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, Play } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { formatDuration } from '../../lib/utils';
import type { Course, UserProgress } from '../../types';

interface CourseCardProps {
  course: Course;
  progress?: UserProgress;
  showProgress?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  progress,
  showProgress = false
}) => {
  
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <Link to={`/course/${course?._id}`}>
        <div className="relative overflow-hidden">
          <img
            src={course?.thumbnail}
            alt={course?.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-3">
              <Play className="h-6 w-6 text-primary" />
            </div>
          </div>
          <Badge className="absolute top-3 left-3 bg-primary text-white">
            {course?.category}
          </Badge>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {course?.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {course?.description}
              </p>
            </div>

            {/* <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-6 h-6 rounded-full"
            />
            <span>{course.instructor.name}</span>
          </div> */}

            {/* <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{course.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{course.studentsCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(course.duration)}</span>
              </div>
            </div>
          </div> */}

            {showProgress && progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress.progress}%</span>
              </div>
              <Progress value={progress.progress} className="h-2" />
            </div>
          )}

            {/* <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {course.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="text-lg font-bold text-primary">
              ${course.price}
            </div>
          </div> */}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};