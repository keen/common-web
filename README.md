# CommonWeb

*Under Construction! Documentation and code may not be in sync yet. Have a question? Just ask!*

CommonWeb is an open source JavaScript library that transforms common web user activity into a stream
of event data you can listen to and analyze. CommonWeb listens for:

+ Pageviews
+ Clicks
+ Form Submissions
+ More...

And emits a JSON representation of each, loaded with useful properties.

The data emitted by CommonWeb can be used to compute traditional web metrics like:

+ Visits and Visitors
+ Time on Site
+ Bounce Rate
+ Content Ranking
+ …and more

CommonWeb supports integrations with services like [Keen IO](https://keen.io/) that provide
 tools for analyzing and reporting on streams of event data.

### Philosophy

CommonWeb is more of a collection tool than an analysis tool. The philosophy
behind CommonWeb is that data collection is hard, but 80% of what needs to be collected
is common to everybody, and auto-collecting the 80% can enable a lot of basic reporting.

The analysis of the data, on the other hand, varies widely based on what you're trying
to learn about your users and how your product or web site works. For example, exactly how you
define a **cohort** might be very different than the company next door.

CommonWeb:

+ Automatically collects the 80% of interesting web events and properties
+ Lets you customize or add new events and properties (the 20% specific to you)
+ Send data to configurable back-ends or fire JavaScript callbacks

CommonWeb's job is to capture web analytics data in a consistent but configurable fashion.
Consistency has its advantages. For example, reporting tools built with commmon-web in mind can
be useful to anyone!

### Already a Keen IO user?

Hooray! <3 <3 CommonWeb can help level up your web analytics game. It might allow you to pare down old
tracking code, or just learn something new about your users.

CommonWeb is not a replacement for [keen-js](https://github.com/keenlabs/keen-js). Rather,
it sits on top of it, while providing a data model and higher level abstractions than `addEvent`.

### Installation

Download [common-web.js](https://github.com/keenlabs/common-web/blob/master/common-web.js) from this repository into your project and include it on your pages.

```html
<script type="text/javascript" src="/javascripts/common-web.js"></script>
```

Make sure to change `/javascripts/common-web.js` if that's not where the file is in your project.

##### Dependencies

+ [jQuery](http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js) – Required. Someday this may change, but for now jQuery is required.
+ Keen IO [JS SDK v3](http://d26b395fwzu5fz.cloudfront.net/3.0.7/keen.min.js) - Required if you're using Keen as a backend for the JSON data captured.

Include dependencies before including `common-web.js` itself. For example, here's how you'd include both jQuery and Keen IO:

``` html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="//d26b395fwzu5fz.cloudfront.net/3.0.7/keen.min.js"></script>
<script type="text/javascript" src="common-web.js"></script>
```

If you're using the Keen IO backend, you'll need to tell CommonWeb about the `Keen.Client` instance
you'd like it to use to record events and tell it to use the `CommonWeb.Keen` callback:

``` javascript
CommonWeb.Keen.Client = new Keen({
  projectId: "your_project_id",
  writeKey: "your_write_key"
});
CommonWeb.addGlobalProperties(CommonWeb.Keen.globalProperties);
CommonWeb.Callback = CommonWeb.Keen.Callback;
```

### Usage

After all of the required JavaScript has been loaded, you can begin making calls to the `CommonWeb` object.

The CommonWeb API contains several `trackXXX` methods that initialize tracking for pageviews or events on specific HTML elements.
Here's an example of each:

``` javascript
// track the pageview
CommonWeb.trackPageview();

// track clicks for each link on the page
CommonWeb.trackClicks();

// track submissions for every form on the page
CommonWeb.trackFormSubmissions();

// track clicks for non-link tags on the page, requires argument
CommonWeb.trackClicksPassive($("span"));
```

### Blocking vs. Non-Blocking

Most links (`<a>` tags) unload pages when they are clicked
because the user is being taken to a new page. Same with traditional, non-ajax form submissions.
If the page unloads before a call to record the event is finished the event may not be recorded. This
is a common issue in web analytics that often goes noticed to the detriment of accurate data.

CommonWeb's solution is to have you specify explicitly when to work around this scenario; i.e. to
tell CommonWeb what links / forms are going to unload the page. In that case CommonWeb will prevent the default
browser action, record the event with the backend, and then re-initiate the action.

The methods that alter default behavior. Here they are:

+ `trackClicks`
+ `trackFormSubmissions`

These methods are more passive, and don't interrupt any normal event flow:

+ `trackClicksPassive`
+ `trackFormSubmissionsPassive` (coming soon)

### Specify HTML Elements (Recommended)

If you only want certain elements tracked, pass them in as the first argument to the track methods:

```javascript
// track clicks on the nav
CommonWeb.trackClicks($(".nav a");

// track clicks with a specific attribute
CommonWeb.trackClicks($("a[data-track=true]");
```

The same arguments work for tracking non-link-clicks and forms:

```javascript
CommonWeb.trackClicksPassive($("span.less"));
CommonWeb.trackFormSubmissions($("form"));
```

##### Words of Caution

CommonWeb is designed to make tracking automatic, but the design is also aware that
tracking certain elements may not be desired, or worse, may cause unexpected behavior.

That's why, at least for now, explicitly passing the elements you care about is preferred
over grabbing everything.

And be careful not to wire up the same element twice!

### Specify Additional Properties

The default data model used to represent events is described in another section below. Sometimes you may
need to include more properties. For example, maybe you need to include extra user properties that allow for
further segmenting analysis down the road.

This can be done at a global level or for specific elements passed into `track` calls.

Here's how to add global properties that will be merged into each captured event on the page:

``` javascript
CommonWeb.addGlobalProperties({
  experiment: {
    id: 13983,
    variant: "A"
  }
});
```

Here's how to specific properties that will only be added to a specific element's click:

```javascript
CommonWeb.trackClicks($("span.less"), { another: "property" );
```

You can also pass a function to compute properties lazily at the time of the event:

```javascript
CommonWeb.trackClicksPassive($("span.even-more-stuff"), function(event, element) {
    return {
        event: { clientX : event.clientX },
        element: { tagNameAgain : element.tagName  }
    };
});
```

### Custom Backend

Eventually multiple backends will be supported, but for now a Backend is just a function and you
can specify your own just like this:

```javascript
CommonWeb.Callback = function(collection, properties, callback) {
  // do something with the event here!
};
```

### Data Model - Event Types

CommonWeb identifies several event types based on the interaction
- `pageviews`, `clicks`, `form-submissions`. The event type is added to the JSON
payload that represents each event so it can be used in analysis.

### Data Model - Event Properties

##### Global

These properties are sent with every event by default:

+ `page_url` - The `window.location.href` of the current page
+ `referrer_url` - The `document.referrer` of the current page

##### Events and Elements

JavaScript event and HTML element objects are turned into JSON structures and
places at the `event` and `element` top level keys respectively.

##### Keen Backend

*More documentation needed here*

Here's an example `clicks` event that shows what properties are collected:

``` json
[
  {
    "parsed_user_agent": {
      "device": {
        "family": "Other"
      },
      "os": {
        "major": "10",
        "patch_minor": null,
        "minor": "9",
        "family": "Mac OS X",
        "patch": "3"
      },
      "browser": {
        "major": "36",
        "minor": "0",
        "family": "Chrome",
        "patch": "1985"
      }
    },
    "referrer_info": {
      "source": null,
      "term": null,
      "medium": null
    },
    "parsed_page_url": {
      "path": "/Users/dzello/keen/common-web/index.html",
      "domain": "",
      "protocol": "file",
      "anchor": null
    },
    "element": {
      "style": "color: blue",
      "text": "Hello world!",
      "id": "link-0",
      "href": "./index.html",
      "tagName": "A",
      "path": "html > body > p > a#link-0.classy.classy2.classy3",
      "classes": [
        "classy",
        "classy2",
        "classy3"
      ],
      "class": "classy classy2 classy3"
    },
    "keen": {
      "timestamp": "2014-08-12T09:19:28.605Z",
      "created_at": "2014-08-12T09:19:28.605Z",
      "id": "53e9dc20c9e163024bc2c799"
    },
    "referrer_url": "",
    "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36",
    "ip_geo_info": {
      "province": "California",
      "city": "San Francisco",
      "postal_code": "94103",
      "continent": "North America",
      "country": "United States"
    },
    "ip_address": "199.247.206.130",
    "event": {
      "metaKey": false,
      "type": "click"
    },
    "page_url": "file:///Users/dzello/keen/common-web/index.html"
  }
]
```

### Further Documentation and Examples

##### Example Page w/ Keen IO Backend

Open `index.html` after cloning this project and head to the console.
It will prompt you first to fill out Keen IO project information so that
there's somewhere to capture your events. The annoying pop-ups will go away
once you've put that in. It's there so that you don't have to hand edit the file
and then accidentally end up checking your credentials in.

The example page shows you a variety of elements. You can click on each and see
the event generated by viewing the JavaScript console.

### Contributing

Please do! Right now this project needs some tests.

##### Wishlist

+ Timeout and continue if a backend takes too long
+ Session ID and session age properties
+ Capture even more common interactions (e.g. time on page)
+ Create dashboards and visualizations based on this data!
+ AJAX Form Handling
