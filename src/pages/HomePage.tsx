import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { CourseCard } from '../components/course/CourseCard';
import { useQuery } from '@tanstack/react-query';
import { fetchCourses } from '../services/service';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {

  const { isAuthenticated } = useAuth();

  const { data: courses, isLoading, isError } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  const featuredCourses = Array.isArray(courses?.data)
    ? courses.data.slice(0, 6)
    : [];

  const features = [
    {
      icon: BookOpen,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with real-world experience'
    },
    {
      icon: Users,
      title: 'Interactive Learning',
      description: 'Engage with peers and instructors through discussions and projects'
    },
    {
      icon: Award,
      title: 'Certificates',
      description: 'Earn recognized certificates upon completion of courses'
    }
  ];

  const stats = [
    { label: 'Active Students', value: '50,000+' },
    { label: 'Expert Instructors', value: '500+' },
    { label: 'Courses Available', value: '1,200+' },
    { label: 'Success Rate', value: '95%' }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="container mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Master New Skills With
              <span className="text-primary"> Gyaan Plant</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of learners advancing their careers with our comprehensive
              online courses taught by industry experts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/browse">
                Explore Courses
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/resumedashboard" >
                Build My Resume
              </Link>
            </Button>
          </div>

          {/* Stats */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose Gyaan Plant?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide the tools and support you need to succeed in your learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 px-4 bg-white dark:bg-gray-950">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Courses</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular courses chosen by thousands of students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course: any) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/browse">
              <Button size="lg" variant="outline" asChild>
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">What Our Students Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real stories from learners who transformed their careers with Gyaan Plant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Frontend Developer',
                avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
                content: 'Gyaan Plant helped me transition from marketing to web development. The courses are practical and the community is incredibly supportive.',
                rating: 5
              },
              {
                name: 'Michael Chen',
                role: 'Data Scientist',
                avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
                content: 'The quality of instruction is outstanding. I landed my dream job after completing the data science track.',
                rating: 5
              },
              {
                name: 'Emily Rodriguez',
                role: 'UX Designer',
                avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150',
                content: 'Practical projects and real-world examples made all the difference. Highly recommend Gyaan Plant to anyone looking to upskill.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Learning?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join our community of learners and start building the skills you need for your future career.
          </p>
          {!isAuthenticated && (
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-foreground hover:bg-accent hover:text-accent-foreground dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground"
            >
              <Link to="/login">Get Started Today</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};