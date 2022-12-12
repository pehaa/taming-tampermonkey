// ==UserScript==
// @name         Pajka - Highlight Product Links without affiliate link
// @namespace    https://woothemes.zendesk.com/
// @version      0.0.3
// @description  Highlights links withoug affiliate link with a magenta border. Styles are applied only in Zendesk, via CSS, message is not affected.
// @author       @pehaa
// @downloadURL  https://github.com/pehaa/taming-tampermonkey/raw/main/wooaff.user.js
// @updateURL    https://github.com/pehaa/taming-tampermonkey/raw/main/wooaff.user.js
// @match        https://woothemes.zendesk.com/agent/*
// @grant        GM_addStyle
// ==/UserScript==

/**
 * Adds css style for links that start with https://woocommerce.com/products/ and do not end with ?aff=10486&cid=1131038 or don't contain utm_campaign.
 */

// load styles

GM_addStyle(`
.grid-main-conversation-panel a[href^="https://woocommerce.com/products/"]:not([href$="?aff=10486&cid=1131038"]):not([href*="utm_campaign"]),
.grid-main-conversation-panel a[href^="http://woocommerce.com/products/"]:not([href$="?aff=10486&cid=1131038"]):not([href*="utm_campaign"])
  {
    border: 1px solid magenta !important;
  }
`);
