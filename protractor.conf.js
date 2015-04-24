exports.config = {
  specs: ["test-e2e/**/*_spec.js"],
  multiCapabilities: [{
    "browserName": "chrome"
  }/*, {
    "browserName": "ie"
  }*/],
  onPrepare: function() {
  	browser.ignoreSynchronization = true;
  },
  baseUrl: "http://localhost:9000/"
};