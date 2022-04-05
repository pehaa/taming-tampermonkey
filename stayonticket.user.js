// ==UserScript==
// @name         Pajka - Always stay on ticket
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Switches the footer button "Stay on Ticket" in Zendesk
// @author       @pehaa
// @downloadURL  https://github.com/pehaa/taming-tampermonkey/raw/main/stayonticket.user.js
// @updateURL    https://github.com/pehaa/taming-tampermonkey/raw/main/stayonticket.user.js
// @match        https://woothemes.zendesk.com/agent/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zendesk.com
// @grant window.onurlchange
// ==/UserScript==

;(function () {
  "use strict";
  console.log("TM: Pajka - Always stay on ticket loaded");

  let oldHref = document.location.href;

  console.log(oldHref);

  window.onload = function () {
    const bodyList = document.querySelector("body");

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (oldHref != document.location.href) {
          console.log("TM: url changed", document.location.href);
          oldHref = document.location.href;
          const button = document.querySelector(
            'button[data-test-id="ticket-footer-post-save-actions-menu-button"]'
          );
          button?.click();
          setTimeout(() => {
            const option = document.querySelector(
              'li[data-test-action="stay_on_ticket"]'
            );
            option?.click();
          });
        }
      });
    });

    const config = {
      childList: true,
      subtree: true
    };

    observer.observe(bodyList, config);
  };
})();
