/* eslint-disable no-undef */
// https://app.segment.com/acapela-analytics/sources/development/overview

const IS_PROD = !window.electronBridge?.env?.isDev;

const SEGMENT_KEY = IS_PROD ? "s40GL4Wcl4uYgcy2MdDNFfw9ajeN192y" : "HoxOQAFv8u7an2BwA5nAWKmmiCN0Fb2C";

!(function () {
  var analytics = (window.analytics = window.analytics || []);
  if (!analytics.initialize)
    if (analytics.invoked) window.console && console.error && console.error("Segment snippet included twice.");
    else {
      analytics.invoked = !0;
      analytics.methods = [
        "trackSubmit",
        "trackClick",
        "trackLink",
        "trackForm",
        "pageview",
        "identify",
        "reset",
        "group",
        "track",
        "ready",
        "alias",
        "debug",
        "page",
        "once",
        "off",
        "on",
        "addSourceMiddleware",
        "addIntegrationMiddleware",
        "setAnonymousId",
        "addDestinationMiddleware",
      ];
      analytics.factory = function (e) {
        return function () {
          var t = Array.prototype.slice.call(arguments);
          t.unshift(e);
          analytics.push(t);
          return analytics;
        };
      };
      for (var e = 0; e < analytics.methods.length; e++) {
        var key = analytics.methods[e];
        analytics[key] = analytics.factory(key);
      }
      analytics.load = function (key, e) {
        var t = document.createElement("script");
        t.type = "text/javascript";
        t.async = !0;
        t.src = "https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";
        var n = document.getElementsByTagName("script")[0];
        n.parentNode.insertBefore(t, n);
        analytics._loadOptions = e;
      };
      analytics._writeKey = SEGMENT_KEY;
      analytics.SNIPPET_VERSION = "4.15.3";
      analytics.load(SEGMENT_KEY);
      analytics.page();
    }
})();