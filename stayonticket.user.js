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
  "use strict"
  console.log("Pajka always stay on ticket loaded")

  if (window.onurlchange === null) {
    window.addEventListener("urlchange", (info) => {
      console.log("TM url changed", document.location.href)
      window.addEventListener("load", () => {
        const button = document.querySelector(
          'button[data-test-id="ticket-footer-post-save-actions-menu-button"]'
        )
        button?.click()
        setTimeout(() => {
          const option = document.querySelector(
            'li[data-test-action="stay_on_ticket"]'
          )
          option?.click()
        })
      })
    })
  }
})()
