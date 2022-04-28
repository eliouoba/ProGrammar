const path = require('path');
const glob = require('glob');

module.exports = {
  entry: [
    "./src/scripts/theme.js", //always want theme
    "./webpack-entry-module.js" //select modules based on page
  ],
    
  //All the js files
  //glob.sync("./src/scripts/*.js"),  
  //glob.sync('.src/scripts/**.js').reduce(function(obj, el) {
    //  obj[path.parse(el).name] = el;
    //  return obj
    // },{}),

    //Build folder
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },

    // Optional and for development only. This provides the ability to
    // map the built code back to the original source format when debugging.
    devtool: 'eval-source-map',

    //for automatic npm run build
    //uncomment for local development
    //recomment when committing to GitHub
    watch: true
};