(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc overview
 * @name angulartics.adobe.analytics
 * Enables analytics support for Adobe Analytics (http://adobe.com/analytics)
 */
 angular.module('angulartics.adobe.analytics', ['angulartics'])
 .config(['$analyticsProvider', function ($analyticsProvider) {

   $analyticsProvider.settings.pageTracking.trackRelativePath = true;


   /**
    * Track Page Views in Adobe Analytics
    * @name pageTrack
    * @param {string} path Required 'path' (string) associated with the page being viewed
    * @param {Object} additionalProperties Optional properties to be extended on the 's' code before sending the event
    */
   $analyticsProvider.registerPageTrack(function (path, additionalProperties) {
     if (window.s) {
       s.clearVars();
       if (angular.isObject(additionalProperties) && !additionalProperties['$$path']) {
         // the additional properties are not the ones sent by angulartics but are user defined
         angular.extend(s, additionalProperties);
         if (!additionalProperties['pageName']){
           // no page name defined, use the path
           additionalProperties['pageName'] = path;
         }
         s.t(additionalProperties);
       } else {
         s.t({pageName:path});
       }
     }
   });

   /**
    * Track Event in Adobe Analytics. Allows the use of additional properties to be
    * sent to the Adobe analytics site. The 'action' by default is the 'analytics-event'
    * variable. This can be overridden by passing 'analytics-action'. The action will
    * trigger one of three types of events. 'd' for 'DOWNLOAD', 'e' for 'EXIT' or 'o' for
    * all others. The 'analytics-event' is also used as the link name by default
    * <pre>
    *   <a analytics-on
    *     analytics-event="the:action" <!-- can be 'DOWNLOAD', 'EXIT' or the link name -->
    *     analytics-action="CLICK" <!-- optional, will be used instead of the event if present -->
    *     analytics-link-name="the:link" <!-- optional, will be used instead of the event if present -->
    *     analytics-link-track-vars="prop55,eVar14" <!-- if you do not have this setup already -->
    *     analytics-link-track-events="event1,event5" <!-- if you do not have this setup already -->
    *     analytics-prop-55="your prop"
    *     analytics-e-var-14="your evar"
    *     analytics-events="event1,event5"
    *     >Click here</a>
    * @name eventTrack
    * @param {string} action Required 'action' (string) associated with the event passed by the 'analytics-event'
    * @param {Object} additionalProperties Optional properties to be extended on the 's' code before sending the event
    */
   $analyticsProvider.registerEventTrack(function (action, additionalProperties) {
     if (window.s) {
       if (angular.isObject(additionalProperties)) {
         angular.extend(s, additionalProperties);
       }
       if(action) {
         // if linkName property is passed, use that; otherwise, the action is the linkName
         var linkName = (additionalProperties['linkName'])?additionalProperties['linkName']:action;
         // if disableDelay property is passed, use that to turn off/on the 500ms delay; otherwise, it uses this
         var disableDelay = !!additionalProperties['disableDelay']?true:this;
         // if action property is passed, use that; otherwise, the action remains unchainged
         if (additionalProperties['action']) {
           action = additionalProperties['action'];
         }

         if(action.toUpperCase() === "DOWNLOAD")
           s.tl(disableDelay,'d',linkName);
         else if(action.toUpperCase() === "EXIT")
           s.tl(disableDelay,'e',linkName);
         else
           s.tl(disableDelay,'o',linkName);
       }
     }
   });

}]);

})(window, window.angular);
