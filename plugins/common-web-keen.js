(function () {

  // initialize a keen namespace
  // make sure to set a client on this!
  CommonWeb.Keen = {
    Client: null,
    Debug: false
  };

  // send tracking events to the keen client
  CommonWeb.callback = function (collection, properties, callback) {

    CommonWeb.Keen.Client.addEvent(collection, properties, function() {

      if (CommonWeb.Keen.Debug) {
        console.log(collection + ": " + JSON.stringify(properties));
      }

      if (callback) {
        callback();
      }

    });

  };

  // set up properties that will go with every event
  $.extend(CommonWeb.options.defaultProperties, {
    keen: {
      addons: [
        {
          "name": "keen:ip_to_geo",
          "input": {
            "ip": "ip_address"
          },
          "output": "ip_geo_info"
        },
        {
          "name": "keen:ua_parser",
          "input": {
            "ua_string": "user_agent"
          },
          "output": "parsed_user_agent"
        },
        {
          "name": "keen:url_parser",
          "input": {
            "url": "page_url"
          },
          "output": "parsed_page_url"
        },
        {
          "name": "keen:referrer_parser",
          "input": {
            "referrer_url": "referrer_url",
            "page_url": "page_url"
          },
          "output": "referrer_info"
        }
      ]
    },
    ip_address: "${keen.ip}",
    user_agent: "${keen.user_agent}"
  });

})();
