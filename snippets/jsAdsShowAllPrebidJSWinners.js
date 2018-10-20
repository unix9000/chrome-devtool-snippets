// jjsAdsShowAllPrebidJSWinners.js
// See all winning bids in the console
// http://prebid.org/dev-docs/troubleshooting-tips.html#see-all-winning-bids-in-the-console
(() => {
  'use strict';
  var bids = pbjs.getHighestCpmBids();
  var output = [];
  for (var i = 0; i < bids.length; i++) {
    var b = bids[i];
    output.push({
      'adunit': b.adUnitCode,
      'adId': b.adId,
      'bidder': b.bidder,
      'time': b.timeToRespond,
      'cpm': b.cpm
    });
  }
  if (output.length) {
    if (console.table) {
      console.table(output);
    } else {
      for (var j = 0; j < output.length; j++) {
        console.log(output[j]);
      }
    }
  } else {
    console.warn('No prebid winners');
  }
})();
