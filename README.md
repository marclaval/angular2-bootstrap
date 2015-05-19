!!! This is a sandbox repo, not a real project (yet)!!!
========================

Project started from: https://github.com/pkozlowski-opensource/ng2-play  
But it may contain modified versions of the libraries (angular2, zone.js, ...)
  
**Demo available here:** http://mlaval.github.io/angular2-bootstrap/  

## Development

### Preparing your environment

- install Gulp  globally: `npm install -g gulp protractor`
- install local npm modules: `npm install`

### Running scripts
<!---
For jshint validation:

- run `gulp checkstyle`

To run the tests:

- run `gulp test`
-->
To use the project in **dev** mode:

- run `gulp` to build it
- run `gulp play` to build it and start a webserver which watches source files at http://localhost:9000  

<!---
- run `gulp play tdd` to work in the TDD mode (i.e. watch source files to build and run all tests)

To use the project in **production** mode:

- run `gulp` or `gulp package` to package it
- run `gulp www` to package it and start a webserver at http://localhost:8080
-->
To clean all files created during builds:

- run `gulp clean`

To run end to end tests:

- run `protractor`
