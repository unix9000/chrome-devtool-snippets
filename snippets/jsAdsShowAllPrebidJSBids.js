// jsAdsShowAllPrebidJSBids.js
// See all bids in the console
// http://prebid.org/dev-docs/troubleshooting-tips.html#see-all-bids-in-the-console

(() => {
  'use strict';
  var responses = pbjs.getBidResponses();
  var winners = pbjs.getAllWinningBids();
  var output = [];
  Object.keys(responses).forEach(function(adUnitCode) {
    var response = responses[adUnitCode];
    response.bids.forEach(function(bid) {
      output.push({
        bid: bid,
        adunit: adUnitCode,
        adId: bid.adId,
        bidder: bid.bidder,
        time: bid.timeToRespond,
        cpm: bid.cpm,
        msg: bid.statusMessage,
        rendered: !!winners.find(function(winner) {
          return winner.adId==bid.adId;
        })
      });
    });
  });
  if (output.length) {
    if (console.table) {
      console.table(output);
    } else {
      for (var j = 0; j < output.length; j++) {
        console.log(output[j]);
      }
    }
  } else {
    console.warn('NO prebid responses');
  }
})();
