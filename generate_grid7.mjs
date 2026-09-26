import fs from 'fs';

const data = JSON.parse(fs.readFileSync('all_courses.json', 'utf8'));

let tsCode = `import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import CourseCard from './CourseCard';
import type { CourseData } from './CourseCard';

// VERIFIED COURSE CATALOG
`;

const allCourses = [];

for (const course of data.data) {
   let originalPrice = course.originalPrice;
   let currentPrice = course.price;
   let isUpcoming = course.isUpcoming === true;
   let ytLink = '';
   
   let grantPrice = 0;
   if (currentPrice > 0) {
      if (course.courseId === 'thunder-web') grantPrice = 3499;
      else if (course.courseId === 'web-dev') grantPrice = 2999;
      else if (course.courseId === 'thunder-sd') grantPrice = 1999;
      else if (course.courseId === 'combo') grantPrice = 3999;
      else if (course.courseId === '689ecf2b6793e719cdee9efc') grantPrice = 2499; 
      else if (course.courseId === 'system-design') grantPrice = 1499;
      else grantPrice = Math.floor(currentPrice * 0.6); 
   }

   let explicitCategory = 'upcoming';

   // Rules for Web Dev and Blockchain (Force into Paid since they are premium courses missing price)
   if (course.courseId === 'nexus-webdev' || course.courseId === 'nexus-blockchain') {
      explicitCategory = 'paid';
      isUpcoming = false;
      if (currentPrice === 0) currentPrice = undefined; // Force "View Price" instead of "FREE"
   }
   
   // Rules for Free YouTube Courses
   let isYouTubeFree = false;
   if (course.title.includes('LLD: Low Level Design') || course.courseId === 'lld') {
      explicitCategory = 'free';
      isUpcoming = false;
      isYouTubeFree = true;
      course.title = 'System Design'; // Renamed as requested
      ytLink = 'https://youtube.com/playlist?list=PLQEaRBV9gAFvzp6XhcNFpk1WdOcyVo9qT';
   } else if (course.title === 'Data Structures & Algorithms in C++' || course.courseId === 'dsa-cpp') {
      explicitCategory = 'free';
      isUpcoming = false;
      isYouTubeFree = true;
      ytLink = 'https://www.youtube.com/playlist?list=PLQEaRBV9gAFu4ovJ41PywklqI7IyXwr01';
   } else if (course.courseId === 'system-design' || course.courseId === 'dsa-premium') {
      // The other HLD/DSA courses that had price 0 but are premium
      explicitCategory = 'paid'; 
      isUpcoming = false;
      if (currentPrice === 0) currentPrice = undefined; // Force "View Price" instead of "FREE"
   } else {
      // Standard mapping (HLD is restored to standard mapping -> which will leave it as Upcoming!)
      if (!isUpcoming) {
         if (explicitCategory !== 'paid') { // Keep the manual overrides above
            if (currentPrice !== undefined && currentPrice !== null && currentPrice > 0) {
               explicitCategory = 'paid';
            } else if (currentPrice === 0) {
               explicitCategory = 'free';
            }
         }
      }
   }

   let syllabusString = '';
   if (course.modules && course.modules.length > 0) {
      syllabusString = `\n    syllabus: [\n`;
      for (const mod of course.modules.slice(0, 7)) {
         let title = mod.title || mod;
         if (typeof title !== 'string') title = "Phase";
         title = title.replace(/'/g, "\\'");
         syllabusString += `      { title: '${title}' },\n`;
      }
      syllabusString += `    ]`;
   }
   
   // Route all non-YouTube courses to their actual STRIKE course page
   const finalHref = ytLink || `https://strikes.in/course/${encodeURIComponent(course.courseId)}`;
   
   const courseObj = `  {
    id: '${course.courseId}',
    title: '${course.title.replace(/'/g, "\\'")}',
    ${course.description ? `description: '${course.description.replace(/'/g, "\\'")}',` : ''}
    ${course.imageUrl ? `thumbnail: '${course.imageUrl}',` : ''}
    ${course.duration ? `duration: '${course.duration}',` : ''}
    ${course.stats ? `hours: '${course.stats}',` : ''}
    ${course.modulesCount ? `modules: '${course.modulesCount} Modules',` : ''}
    ${originalPrice !== undefined && originalPrice !== null ? `originalPrice: ${originalPrice},` : ''}
    ${currentPrice !== undefined && currentPrice !== null && !isYouTubeFree ? `currentPrice: ${currentPrice},` : ''}
    ${grantPrice > 0 ? `grantPrice: ${grantPrice},` : ''}
    isUpcoming: ${isUpcoming},
    category: '${explicitCategory}',
    ${isYouTubeFree ? `isYouTubeFree: true,` : ''}
    href: '${finalHref}',${syllabusString}
  }`;

   allCourses.push(courseObj);
}

tsCode += `const allCourses: CourseData[] = [\n${allCourses.join(',\n')}\n];\n`;

tsCode += `
const CourseGrid = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'free' | 'upcoming'>('all');

  const filteredCourses = allCourses.filter(course => {
    if (activeTab === 'all') return true;
    return course.category === activeTab;
  });

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black min-h-screen" id="courses">
      
      {/* HEADER & FILTER BAR */}
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Strike coding courses</h2>
        <p className="mt-3 text-gray-400 text-base md:text-lg max-w-2xl mx-auto md:mx-0 mb-8">
          Learn from the best with hands-on projects and guided practice.
        </p>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          {[
            { id: 'all', label: 'All Courses' },
            { id: 'paid', label: 'Paid Courses' },
            { id: 'free', label: 'Free Courses' },
            { id: 'upcoming', label: 'Upcoming Courses' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={twMerge(
                clsx(
                  "px-5 py-2.5 rounded-full text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black",
                  activeTab === tab.id 
                    ? "bg-white text-black border border-white" 
                    : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                )
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SINGLE DYNAMIC GRID */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch animate-in fade-in duration-300">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#111] rounded-2xl border border-white/5 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <p className="text-xl font-bold text-gray-300 mb-2">No courses found</p>
          <p className="text-gray-500">There are currently no courses matching this category.</p>
          <button 
            onClick={() => setActiveTab('all')} 
            className="mt-6 text-accent-primary hover:text-white transition-colors text-sm font-bold"
          >
            Clear Filter
          </button>
        </div>
      )}

    </section>
  );
};

export default CourseGrid;
`;

fs.writeFileSync('src/components/CourseGrid.tsx', tsCode);
console.log('Regenerated CourseGrid.tsx with direct checkout links!');
