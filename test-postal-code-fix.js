/**
 * Test for the postal code and city field issue
 */

console.log('=== POSTAL CODE AND CITY FIELD TEST ===');
console.log('=======================================');

// Simulate the regex patterns
const testAddresses = [
  "Keskuskatu 15, 00100 Helsinki",
  "Mannerheimintie 12 A, 00170 Helsinki", 
  "Hämeentie 155, 00560 Helsinki",
  "Test Street 123, 12345 Test City"
];

console.log('\n🧪 TESTING POSTAL CODE REGEX PATTERNS:');

testAddresses.forEach((address, index) => {
  console.log(`\nTest ${index + 1}: "${address}"`);
  
  const parts = address.split(',').map(part => part.trim());
  console.log('Parts:', parts);
  
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1];
    console.log('Last part:', lastPart);
    
    // Test the old (broken) regex
    const oldRegex = /\\b(\\d{5})\\s+(.+)/;
    const oldMatch = lastPart.match(oldRegex);
    console.log('Old regex match:', oldMatch);
    
    // Test the new (fixed) regex
    const newRegex = /\b(\d{5})\s+(.+)/;
    const newMatch = lastPart.match(newRegex);
    console.log('New regex match:', newMatch);
    
    if (newMatch) {
      console.log(`✅ Postal code: "${newMatch[1]}", City: "${newMatch[2]}"`);
    } else {
      console.log(`❌ No match - city would be: "${lastPart}"`);
    }
  }
});

console.log('\n🔧 TESTING POSTAL CODE CLEANING:');

const testInputs = ["12345", "123a45", "12 34 5", "abcd12345xyz", "123456"];

testInputs.forEach(input => {
  // Test old (broken) pattern
  const oldCleaned = input.replace(/\\D/g, '').slice(0, 5);
  // Test new (fixed) pattern
  const newCleaned = input.replace(/\D/g, '').slice(0, 5);
  
  console.log(`Input: "${input}" -> Old: "${oldCleaned}", New: "${newCleaned}"`);
});

console.log('\n🎯 DIAGNOSIS:');
console.log('The issue was with escaped regex patterns in JavaScript strings:');
console.log('❌ Wrong: /\\\\b(\\\\d{5})\\\\s+(.+)/ (double-escaped)');
console.log('✅ Correct: /\\b(\\d{5})\\s+(.+)/ (properly escaped)');
console.log('');
console.log('❌ Wrong: replace(/\\\\D/g, \'\') (double-escaped)');
console.log('✅ Correct: replace(/\\D/g, \'\') (properly escaped)');

console.log('\n✅ FIX APPLIED:');
console.log('Updated regex patterns in:');
console.log('1. parseInitialAddress() function');
console.log('2. handlePostalCodeChange() function');

console.log('\n🚀 EXPECTED BEHAVIOR AFTER FIX:');
console.log('- Postal codes will be correctly extracted from addresses');
console.log('- City field will only contain city name, not postal code');
console.log('- Manual postal code entry will work correctly');
console.log('- Address auto-completion will populate fields correctly');
