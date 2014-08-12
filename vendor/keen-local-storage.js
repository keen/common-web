(function () {

  var KeenLocalStorage = {

    // set the root before using!
    root: null,

    get: function () {
      var projectId = localStorage.getItem(this.root + "/project-id");
      var writeKey = localStorage.getItem(this.root + "/write-key");
      return {
        projectId : projectId,
        writeKey : writeKey
      }
    },

    set: function (configuration) {
      localStorage.setItem(this.root + "/project-id", configuration.projectId);
      localStorage.setItem(this.root + "/write-key", configuration.writeKey);
    },

    clear: function () {
      localStorage.removeItem(this.root + "/project-id");
      localStorage.removeItem(this.root + "/write-key");
    },

    prompt: function () {
      if (this.get()['projectId'] === null) {
        var projectId = prompt("Please specify Keen Project ID:");
        var writeKey = prompt("Please specify Keen Write Key:");
        return this.set({
          projectId: projectId,
          writeKey: writeKey
        });
      }
    }
  };

  // export to make functions available
  window.KeenLocalStorage = KeenLocalStorage;

})();