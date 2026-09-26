const fs = require('fs');
let content = fs.readFileSync('src/components/MembershipPlans.tsx', 'utf8');

const target = `<div className="flex items-end gap-3 mb-8">
                <PriceReveal 
                  normalPrice={variant.sellingPrice}
                  overclockedPrice={finalPrice}
                  isOverclocked={isOverclocked}
                  className="text-5xl h-14 w-40"
                />
                <div className="flex flex-col mb-1">
                  <span className="text-gray-500 line-through text-sm font-medium">₹{variant.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="text-accent-primary font-bold text-sm">{discountPercent}% OFF</span>
                </div>
              </div>`;

const replacement = `<div className="flex flex-row items-center gap-4 sm:gap-5 mb-8">
                <PriceReveal 
                  normalPrice={variant.sellingPrice}
                  overclockedPrice={finalPrice}
                  isOverclocked={isOverclocked}
                  className="text-4xl sm:text-5xl"
                />
                <div className="flex flex-col justify-center">
                  <span className="text-gray-500 line-through text-sm sm:text-base font-medium mb-1">
                    ₹{variant.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-accent-primary font-bold text-xs sm:text-sm bg-accent-primary/10 border border-accent-primary/20 px-2.5 py-0.5 rounded-full w-fit whitespace-nowrap">
                    {discountPercent}% OFF
                  </span>
                </div>
              </div>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/MembershipPlans.tsx', content);
  console.log("Success");
} else {
  console.log("Target not found");
}
