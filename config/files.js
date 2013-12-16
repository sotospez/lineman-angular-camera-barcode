/* Exports a function which returns an object that overrides the default &
 *   plugin file patterns (used widely through the app configuration)
 *
 * To see the default definitions for Lineman's file paths and globs, see:
 *
 *   - https://github.com/testdouble/lineman/blob/master/config/files.coffee
 */
module.exports = function(lineman) {
  //Override file patterns here
  return {

    // As an example, to override the file patterns for
    // the order in which to load third party JS libs:
    //
    // js: {
    //   vendor: [
    //     "vendor/js/underscore.js",
    //     "vendor/js/**/*.js"
    //   ]
    // }
   js: {
    vendor: [
      "vendor/js/angular.js",
      "vendor/js/**/*.js"
    ],
    app: [
      "app/js/app.js",
      "app/js/services/services.js",
      "app/js/controllers/controllers.js",
      "app/js/directives/directives.js",
      "app/js/filters/filters.js",
      "app/js/**/*.js"
    ]
  }
  ,
  
  less: {
    compile: {
      options: {
        paths: ["vendor/css/normalize.css", "vendor/css/**/*.css", "app/css/**/*.less"]
      }
    }
  }
  };
};
