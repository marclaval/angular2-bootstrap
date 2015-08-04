exports.config = {
  multiCapabilities: [{
    "browserName": "chrome"
  }],
  onPrepare: function() {
  	browser.ignoreSynchronization = true;
  }
};