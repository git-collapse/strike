import fs from 'fs';

const data = JSON.parse(fs.readFileSync('all_courses.json', 'utf8'));

let tsCode = `import CourseCard from './CourseCard';
import type { CourseData } from './CourseCard';

// VERIFIED COURSE CATALOG
`;

const paidCourses = [];
const freeCourses = [];
const upcomingCourses = [];
const unclassifiedCourses = [];

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

   if (course.isUpcoming) {
      upcomingCourses.push(courseObj);
   } else if (currentPrice > 0) {
      paidCourses.push(courseObj);
   } else if (course.isFree) {
      freeCourses.push(courseObj);
   } else {
      unclassifiedCourses.push(courseObj);
   }
}

tsCode += `const paidCourses: CourseData[] = [\n${paidCourses.join(',\n')}\n];\n`;
tsCode += `const freeCourses: CourseData[] = [\n${freeCourses.join(',\n')}\n];\n`;
tsCode += `const upcomingCourses: CourseData[] = [\n${upcomingCourses.join(',\n')}\n];\n`;
tsCode += `const unclassifiedCourses: CourseData[] = [\n${unclassifiedCourses.join(',\n')}\n];\n`;

tsCode += `
const CourseGrid = () => {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black" id="courses">
      
      {/* PAID COURSES */}
      {paidCourses.length > 0 && (
        <div className="mb-20">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">Paid Courses</h2>
            <p className="mt-3 text-gray-400 text-base md:text-lg max-w-2xl mx-auto md:mx-0">Premium learning paths for serious builders.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {paidCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}

      {/* FREE COURSES */}
      {freeCourses.length > 0 && (
        <div className="mb-20">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">Free Courses</h2>
            <p className="mt-3 text-gray-400 text-base md:text-lg max-w-2xl mx-auto md:mx-0">Start learning with free resources.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {freeCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}
      
      {/* UNCLASSIFIED / EXPLORE COURSES */}
      {unclassifiedCourses.length > 0 && (
        <div className="mb-20">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">Explore Courses</h2>
            <p className="mt-3 text-gray-400 text-base md:text-lg max-w-2xl mx-auto md:mx-0">Discover more coding courses from Strike.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {unclassifiedCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}

      {/* UPCOMING COURSES */}
      {upcomingCourses.length > 0 && (
        <div className="mb-10">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">Upcoming Courses</h2>
            <p className="mt-3 text-gray-400 text-base md:text-lg max-w-2xl mx-auto md:mx-0">New courses currently in development.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {upcomingCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}

    </section>
  );
};

export default CourseGrid;
`;

fs.writeFileSync('src/components/CourseGrid.tsx', tsCode);
console.log('Regenerated CourseGrid.tsx sections!');
console.log('PAID: ' + paidCourses.length);
console.log('FREE: ' + freeCourses.length);
console.log('UPCOMING: ' + upcomingCourses.length);
console.log('UNCLASSIFIED: ' + unclassifiedCourses.length);
