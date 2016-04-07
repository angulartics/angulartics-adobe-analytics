(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc overview
 * @name angulartics.adobe.analytics
 * Enables analytics support for Adobe Analytics (http://adobe.com/analytics)
 */
 angular.module('angulartics.adobe.analytics', ['angulartics'])
 .config(['$analyticsProvider', function ($analyticsProvider) {

   $analyticsProvider.settings.pageTracking.trackRelativePath = true;

   $analyticsProvider.registerPageTrack(function (path) {
     if (window.s) s.t({pageName:path});
   });

   /**
    * Track Event in Adobe Analytics
    * @name eventTrack
    * @param {string} action Required 'action' (string) associated with the event
    * @param {Object} [additionalProperties] Optional properties to be extended on the 's' code before sending the event
    */
   $analyticsProvider.registerEventTrack(function (action, additionalProperties) {
     if (window.s) {
       s.clearVars();
       if (angular.isObject(additionalProperties)) {
         var linkTrackVars = Object.keys(additionalProperties).join(',');
         s.linkTrackVars = linkTrackVars;
         angular.extend(s, additionalProperties);
       }
       if(action) {
         if(action.toUpperCase() === "DOWNLOAD")
           s.tl(this,'d',action);
         else if(action.toUpperCase() === "EXIT")
           s.tl(this,'e',action);
         else
           s.tl(this,'o',action);
       }
       s.clearVars();
     }
   });

}]);

})(window, window.angular);
