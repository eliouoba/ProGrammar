const string1 = 'JavaScript Program';
const string2 = 'javascript program';
const result = string1.toUpperCase() === string2.toUpperCase();

if(result) {
    console.log('The strings are similar.');
} else {
    console.log('The strings are not similar.');
}