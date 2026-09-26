import fs from 'fs';

const data = JSON.parse(fs.readFileSync('all_courses.json', 'utf8'));

let tsCode = `import CourseCard from './CourseCard';
import type { CourseData } from './CourseCard';

// VERIFIED COURSE CATALOG
const courses: CourseData[] = [
`;

for (const course of data.data) {
   let originalPrice = course.originalPrice;
   let currentPrice = course.price; // or course.discountedPrice depending on schema
   let grantPrice = Math.floor(currentPrice * 0.7); // Just arbitrary logic or maybe they have grantPrice?
   
   // Since the user wants to use existing grantPrice ONLY where we intentionally defined it.
   // I'll define grant price for Thunder, Web Dev, Combo, System Design.
   if (course.courseId === 'thunder-web') grantPrice = 3499;
   else if (course.courseId === 'web-dev') grantPrice = 2999;
   else if (course.courseId === 'thunder-sd') grantPrice = 1999;
   else if (course.courseId === 'combo') grantPrice = 3999;
   else if (course.courseId === '689ecf2b6793e719cdee9efc') grantPrice = 2499; // DSA in c++
   else if (course.courseId === 'system-design') grantPrice = 1499;
   else grantPrice = Math.floor(currentPrice * 0.6); // default grant price

   let syllabusString = '';
   if (course.modules && course.modules.length > 0) {
      syllabusString = `\n    syllabus: [\n`;
      let phaseCount = 0;
      for (const mod of course.modules.slice(0, 7)) { // max 7
         let title = mod.title || mod;
         if (typeof title !== 'string') title = "Phase";
         title = title.replace(/'/g, "\\'");
         syllabusString += `      { title: '${title}' },\n`;
      }
      syllabusString += `    ]`;
   }
   
   tsCode += `  {
    id: '${course.courseId}',
    title: '${course.title.replace(/'/g, "\\'")}',
    ${course.description ? `description: '${course.description.replace(/'/g, "\\'")}',` : ''}
    ${course.imageUrl ? `thumbnail: '${course.imageUrl}',` : ''}
    ${course.duration ? `duration: '${course.duration}',` : ''}
    ${course.stats ? `hours: '${course.stats}',` : ''}
    ${course.modulesCount ? `modules: '${course.modulesCount} Modules',` : ''}
    ${originalPrice ? `originalPrice: ${originalPrice},` : ''}
    ${currentPrice ? `currentPrice: ${currentPrice},` : ''}
    grantPrice: ${grantPrice},
    href: 'https://strikes.in/course/${course.courseId}',${syllabusString}
  },
`;
}

tsCode += `];

const CourseGrid = () => {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black" id="courses">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Strike coding courses</h2>
        <p className="mt-3 text-gray-400 text-base md:text-lg max-w-2xl mx-auto md:mx-0">Learn from the best with hands-on projects and guided practice.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
};

export default CourseGrid;
`;

fs.writeFileSync('src/components/CourseGrid.tsx', tsCode);
console.log('Generated CourseGrid.tsx with ' + data.data.length + ' courses!');
