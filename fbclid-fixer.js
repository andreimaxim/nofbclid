function fbclidStrip(req) {

    var param = "fbclid";

    // Early check to avoid running a RegExp on every URL
    if (req.url.indexOf(param + "=") !== -1) {
        /*
          Unfortunately, the current URLSearchParams  object does not take into
          account cases where the query string can be just a param without a
          value, even though the URI RFC does not specify a structure.

          See more at:

          http://tools.ietf.org/html/rfc3986#section-3.4
        */
        var regExp = new RegExp("[?&](" + param + "=[^&]+).");
        var results = req.url.replace(regExp, function (match, p, offset, str) {
            /*
              Current test cases:

              * "https://example.com?fbclid=xxx",
              * "https://example.com?foo&fbclid=xxx",
              * "https://example.com?fbclid=xxx&foo=bar",
              * "https://example.com?foo=bar&fbclid=xxx",
              * "https://example.com?foo=bar&fbclid=xxx&bar=baz"
              */
            if (match.indexOf('?') == 0 && match.indexOf('&') !== -1) {
                /*
                  Keep the ? when fbclid is at the beggining of the query
                  params
                */
                return '?';
            } else if (match.indexOf('&') == 0 && match.lastIndexOf('&') !== 0) {
                /*
                  Keep one of the & when fbclid is in the middle of the query
                  params.
                */
                return '&';
            } else {
                // Otherwise, just remove the entire matched string.
                return '';
            }
        });

        return {
            redirectUrl: results
        };
    }
}

browser.webRequest.onBeforeRequest.addListener(
    fbclidStrip,
    { urls: ["<all_urls>"] },
    ["blocking"]
)
