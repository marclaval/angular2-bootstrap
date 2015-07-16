!!! Work in progress !!!
========================

Project started from: https://github.com/mgechev/angular2-seed  
  
**Demo available here:** http://mlaval.github.io/angular2-bootstrap/  

## Development

### Preparing your environment

- install Gulp and Protractor globally: `npm install -g gulp protractor`
- update the webdriver: `webdriver-manager update`
- install local npm modules: `npm install`

### Running scripts
<!---
For jshint validation:

- run `gulp checkstyle`

To run the tests:

- run `gulp test`
-->
To use the project:

- run `gulp build.dev` or `gulp build.prod` to build it into **dist** folder
- run `gulp serve.dev` or `gulp.serve.prod` to build it and start a webserver which watches source files at http://localhost:5555  

<!---
- run `gulp play tdd` to work in the TDD mode (i.e. watch source files to build and run all tests)
-->
To clean all files created during builds:

- run `gulp clean`

To run end to end tests:
- run `gulp serve.dev` or `gulp.serve.prod` in a first terminal,
- then run `protractor` in a second one
