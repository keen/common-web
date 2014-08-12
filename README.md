# Common Web

** UNDER CONSTRUCTION **

Drop-in tracking of common web analytics events.

Common Web listens to JavaScript clicks and submits and converts them into
JSON that can be sent to analytics services *or* plain old callbacks.

### Usage

Download `common-web.js` and any plugins you require into your project
and include them on your pages. (Note: at this time, jQuery is required).

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="//d26b395fwzu5fz.cloudfront.net/3.0.7/keen.min.js"></script>
<script type="text/javascript" src="common-web.js"></script>
<script type="text/javascript" src="common-web-keen.js"></script>
```

##### Track Everything

```javascript
CommonWeb.track();
```

This will track all page views, link clicks, and form submissions.

Common Web identifies several event types based on the interaction
- `viewed-page`, `clicked-link`, `clicked-other`, and `submitted-form`.
These events types are passed into the `CommonWeb.callback` and
can be used as input into working with the events.

##### Track Specific Things

It's probably more practical right now to specify broadly what you want to track:

```javascript
// track pageviews
CommonWeb.trackPageviews();

// track link clicks
CommonWeb.trackLinkClicks();
```

You can get even more granular by scoping to certain elements:

```javascript
// track certain clicks
CommonWeb.trackLinkClicks($("a[data-track=true]");
```

The same arguments work for tracking non-link-clicks and forms:

```javascript
CommonWeb.trackOtherClicks($("span.less"));
CommonWeb.trackFormSubmissions($("form"));
```

You can specify additional properties to include in event bodies:

```javascript
CommonWeb.trackLinkClicks($("span.less"), { another: "property" );
```

And even do so using a function that receives the current event and element:

```javascript
CommonWeb.trackOtherClicks($("span.even-more-stuff"), function(event, element) {
    return {
        event: { clientX : event.clientX },
        element: { tagNameAgain : element.tagName  }
    };
});
```

##### WARNING About Duplication

Make sure not to pass the same HTML element twice into a `track...` method.
Duplicate tracking events will get fired and you might not want that.
Someday the library can de-dupe, but watch out for now.

##### Track Link Clicks vs. Track Other Clicks

Some links unload pages when they are clicked. Same with form submissions. That makes the analytics call
get interrupted and not go through. To work around that, this library intercepts
the click/submit events, records the event, then re-clicks/submits the element.
This causes a slight delay. It's mostly unnoticeable. However, if you know you
have an element that won't unload the current page, you should just use the
`trackOtherClicks` and `trackAjaxForm` (coming soon) alternatives.



### Example Page

Open `index.html` after cloning this project and head to the console.
It will prompt you first to fill out Keen IO project information so that
there's somewhere to capture your events. The annoying pop-ups will go away
once you've put that in. It's there so that you don't have to hand edit the file
and then accidentally end up checking your credentials in.

To see things work, you'll need to put your Keen IO credentials into the
JavaScript section, or enter them at the prompts.

### Plugins

##### Common Web Keen

Common Web Keen configured Common Web to publish captured events
via a keen-js client object.

It also sets the Common Web default parameters to include IP address
and user agent information as well as instructions for Keen IO to parse
that data into queryable properties.

Here's an example `clicked-link` event that shows what properties are collected:

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
    "areWeHavingFunYet": true,
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
      "data-four": "four",
      "classes": [
        "more-stuff"
      ],
      "class": "more-stuff",
      "tagName": "SPAN",
      "id": "span-1"
    },
    "keen": {
      "timestamp": "2014-08-12T07:40:49.757Z",
      "created_at": "2014-08-12T07:40:49.757Z",
      "id": "53e9c501e875962622675dff"
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

##### Performance Note

As with anything on the web, going over HTTP is faster than HTTPS. If
you're not sending highly secure data, you might want to use HTTP to minimize
any delay users get as they click around your site. Just do this after configuring
a Keen client:

```javascript
CommonWeb.Keen.Client = new Keen({
  projectId : "<project-id>",
  writeKey : "<write-key>",
  protocol : "http"
});
```

### Contributing

Please do! Right now this project needs some tests.

##### Wishlist

+ Make the timeout actually do something
+ Capture even more common interactions (e.g. time on page)
+ Create dashboards and visualizations based on this data
