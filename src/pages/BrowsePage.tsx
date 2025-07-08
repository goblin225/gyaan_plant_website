import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { CourseCard } from '../components/course/CourseCard';
import { debounce } from '../lib/utils';
import * as Select from '@radix-ui/react-select';
import * as Popover from '@radix-ui/react-popover';
import { useQuery } from '@tanstack/react-query';
import { fetchCourses } from '../services/service';

const SkeletonCard: React.FC = () => {
  return (
    <div className="animate-pulse space-y-3 rounded-lg border p-4 shadow-sm bg-muted">
      <div className="h-40 rounded-md bg-muted-foreground/30" />
      <div className="h-4 w-3/4 bg-muted-foreground/30 rounded" />
      <div className="h-3 w-1/2 bg-muted-foreground/20 rounded" />
      <div className="h-4 w-full bg-muted-foreground/30 rounded" />
      <div className="flex space-x-2 pt-2">
        <div className="h-6 w-16 bg-muted-foreground/30 rounded" />
        <div className="h-6 w-16 bg-muted-foreground/20 rounded" />
      </div>
    </div>
  );
};

export const BrowsePage: React.FC = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });

  window.scrollTo(0, 0);

  const featuredCourses = courses?.data || [];

  const debouncedSearch = useMemo(
    () => debounce((query: string) => setSearchQuery(query), 300),
    []
  );

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(featuredCourses.map((course: { category: string }) => course.category))];
    return cats;
  }, [featuredCourses]);

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = featuredCourses?.filter((course: any) => {
      const matchesSearch = course?.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        course?.description?.toLowerCase()?.includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
      const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });

    switch (sortBy) {
      case 'popular':
        filtered.sort((a: any, b: any) => b.studentsCount - a.studentsCount);
        break;
      case 'rating':
        filtered.sort((a: any, b: any) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a: any, b: any) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a: any, b: any) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }

    return filtered;
  }, [featuredCourses, searchQuery, selectedCategory, selectedLevel, sortBy, priceRange]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Browse Courses</h1>
        <p className="text-muted-foreground">
          Discover {featuredCourses?.length} courses to advance your skills
        </p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-10"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Category Filter */}
          <Select.Root value={selectedCategory} onValueChange={setSelectedCategory}>
            <Select.Trigger className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[120px]">
              <Select.Value placeholder="Category" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                <Select.Viewport className="p-1">
                  {categories?.map((category) => (
                    <Select.Item
                      key={String(category)}
                      value={String(category)}
                      className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
                    >
                      <Select.ItemText>{category === 'all' ? 'All Categories' : String(category)}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          {/* Level Filter */}
          <Select.Root value={selectedLevel} onValueChange={setSelectedLevel}>
            <Select.Trigger className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[120px]">
              <Select.Value placeholder="Level" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                <Select.Viewport className="p-1">
                  {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
                    <Select.Item
                      key={level}
                      value={level}
                      className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
                    >
                      <Select.ItemText>{level === 'all' ? 'All Levels' : level}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          {/* Sort By */}
          <Select.Root value={sortBy} onValueChange={setSortBy}>
            <Select.Trigger className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[120px]">
              <Select.Value placeholder="Sort by" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                <Select.Viewport className="p-1">
                  {[
                    { value: 'popular', label: 'Most Popular' },
                    { value: 'rating', label: 'Highest Rated' },
                    { value: 'newest', label: 'Newest' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' }
                  ].map((option) => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
                    >
                      <Select.ItemText>{option.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          {/* More Filters */}
          <Popover.Root>
            <Popover.Trigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none"
                sideOffset={5}
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Price Range</label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          className="w-20"
                        />
                        <span>-</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="w-20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory('all')}>
              {selectedCategory} ×
            </Badge>
          )}
          {selectedLevel !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedLevel('all')}>
              {selectedLevel} ×
            </Badge>
          )}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredAndSortedCourses?.length} of {featuredCourses?.length} courses
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredAndSortedCourses?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedCourses?.map((course: any) => (
            <CourseCard key={course?.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedLevel('all');
              setPriceRange([0, 200]);
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};