import fs from 'fs';

const data = JSON.parse(fs.readFileSync('all_courses.json', 'utf8'));

let tsCode = `import CourseCard from './CourseCard';
import type { CourseData } from './CourseCard';

// VERIFIED COURSE CATALOG
`;

const allCourses = [];
const paidCourses = [];
const freeCourses = [];
const upcomingCourses = [];

for (const course of data.data) {
   let originalPrice = course.originalPrice;
   let currentPrice = course.price;
   
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
   
   const courseObj = `  {
    id: '${course.courseId}',
    title: '${course.title.replace(/'/g, "\\'")}',
    ${course.description ? `description: '${course.description.replace(/'/g, "\\'")}',` : ''}
    ${course.imageUrl ? `thumbnail: '${course.imageUrl}',` : ''}
    ${course.duration ? `duration: '${course.duration}',` : ''}
    ${course.stats ? `hours: '${course.stats}',` : ''}
    ${course.modulesCount ? `modules: '${course.modulesCount} Modules',` : ''}
    ${originalPrice ? `originalPrice: ${originalPrice},` : ''}
    ${currentPrice > 0 ? `currentPrice: ${currentPrice},` : ''}
    ${grantPrice > 0 ? `grantPrice: ${grantPrice},` : ''}
    isUpcoming: ${course.isUpcoming === true},
    href: 'https://strikes.in/course/${course.courseId}',${syllabusString}
  }`;

   allCourses.push(courseObj);

   if (course.isUpcoming) {
      upcomingCourses.push(courseObj);
   } else if (currentPrice > 0) {
      paidCourses.push(courseObj);
   } else if (course.isFree) {
      freeCourses.push(courseObj);
   }
}

tsCode += `const allCourses: CourseData[] = [\n${allCourses.join(',\n')}\n];\n`;
tsCode += `const paidCourses: CourseData[] = [\n${paidCourses.join(',\n')}\n];\n`;
tsCode += `const freeCourses: CourseData[] = [\n${freeCourses.join(',\n')}\n];\n`;
tsCode += `const upcomingCourses: CourseData[] = [\n${upcomingCourses.join(',\n')}\n];\n`;

tsCode += `
const CourseGrid = () => {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black" id="courses">
      
      {/* HEADER & NAVIGATION */}
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Strike coding courses</h2>
        <p className="mt-3 text-gray-400 text-base md:text-lg max-w-2xl mx-auto md:mx-0 mb-8">
          Learn from the best with hands-on projects and guided practice.
        </p>

        {/* Category Buttons */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <a href="#all-courses" className="px-5 py-2.5 rounded-full text-sm font-bold bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary">
            All Courses
          </a>
          <a href="#paid-courses" className="px-5 py-2.5 rounded-full text-sm font-bold bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary">
            Paid Courses
          </a>
          <a href="#free-courses" className="px-5 py-2.5 rounded-full text-sm font-bold bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary">
            Free Courses
          </a>
          <a href="#upcoming-courses" className="px-5 py-2.5 rounded-full text-sm font-bold bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary">
            Upcoming Courses
          </a>
        </div>
      </div>

      {/* SECTIONS */}

      {/* ALL COURSES */}
      <div id="all-courses" className="mb-24 scroll-mt-32">
        <div className="mb-10 text-center md:text-left border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight uppercase">All Courses</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {allCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* PAID COURSES */}
      <div id="paid-courses" className="mb-24 scroll-mt-32">
        <div className="mb-10 text-center md:text-left border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Paid Courses</h2>
        </div>
        {paidCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {paidCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10 bg-[#0d0d0d] rounded-xl border border-white/5">No paid courses available.</p>
        )}
      </div>

      {/* FREE COURSES */}
      <div id="free-courses" className="mb-24 scroll-mt-32">
        <div className="mb-10 text-center md:text-left border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Free Courses</h2>
        </div>
        {freeCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {freeCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10 bg-[#0d0d0d] rounded-xl border border-white/5">No free courses currently available.</p>
        )}
      </div>

      {/* UPCOMING COURSES */}
      <div id="upcoming-courses" className="mb-10 scroll-mt-32">
        <div className="mb-10 text-center md:text-left border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Upcoming Courses</h2>
        </div>
        {upcomingCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {upcomingCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10 bg-[#0d0d0d] rounded-xl border border-white/5">No upcoming courses currently scheduled.</p>
        )}
      </div>

    </section>
  );
};

export default CourseGrid;
`;

fs.writeFileSync('src/components/CourseGrid.tsx', tsCode);
console.log('Regenerated CourseGrid.tsx with anchor navigation sections!');
