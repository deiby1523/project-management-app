"use client";

import { useEffect, useState } from "react";
import { coursesApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

export function CourseTag({ courseId }: { courseId: number }) {
  const [courseName, setCourseName] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    
    coursesApi.getById(courseId)
      .then((course) => setCourseName(course.name))
      .catch(() => console.error(`Error loading course ${courseId}`));
  }, [courseId]);

  if (!courseName) return <h1>null</h1>;

  return (
    <div className="mt-1 flex items-center gap-1">
      <Badge variant="secondary" className="font-normal text-[10px] px-1.5 py-0">
        <BookOpen className="mr-1 h-3 w-3" />
        {courseName}
      </Badge>
    </div>
  );
}