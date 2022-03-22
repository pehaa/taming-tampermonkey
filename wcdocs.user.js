// ==UserScript==
// @name         Pajka - Clipboard.js for WooCommerce Docs
// @namespace    https://woocommerce.com/document
// @version      0.2
// @description  Adds a copy button to each anchor tag
// @author       @pehaa
// @downloadURL  https://github.com/pehaa/taming-tampermonkey/raw/main/wcdocs.user.js
// @updateURL    https://github.com/pehaa/taming-tampermonkey/raw/main/wcdocs.user.js
// @match        https://woocommerce.com/document/*
// @grant        GM_addStyle
// @require      https://unpkg.com/clipboard@2/dist/clipboard.min.js
// ==/UserScript==

// temporarily disable tracking
// @require      https://gist.githubusercontent.com/klimeryk/6eca2fff0120104a733e6e98ee1026a8/raw/172aeeff7565c933d27165f4781a4f7e7d186c1a/trackUsage
// trackUsage("woo-docs-clipboard");

/**
 * Adds a copy-to-clipboard button for each heading in the WooCommerce Docs.
 */

// load styles

GM_addStyle(`
    article.post .copy-button img {
      margin: 0;
      padding: 0;
      border: 0;
    }
    button.copy-button {
      background-color: #f3f6f8;
      padding: 1px;
      border-radius: 0;
      margin-left: 7px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      font-size: 12px;
	  display: inline-flex;
	  align-items: center;
	  margin-bottom: 0;
	  vertical-align: middle;
    }
    button.copy-button img {
      width: 20px;
    }
    .copy-button:focus { outline: 2px solid #3c3c3c !important;}
    .copy-button:focus + .copied{ display: inline; }
    .copied {
      display: none;
      font-size: 11px;
      opacity: 0.7;
      color: white;
      margin-left: 8px;
      vertical-align: middle;
      background: #333;
      border-radius: 10px;
      padding: 2px 10px;
    }
  `)
;(function () {
  "use strict"

  // select all h1..h4 that have an attribute id
  // I'm going to loop them as an array so I transform the selection to an array [...Selection]
  const headings = [
    ...document.querySelectorAll("h1[id], h2[id], h3[id], h4[id]"),
  ]

  const imgHTML =
    '<img src="https://s0.wp.com/wp-content/themes/a8c/wpsupport2/i/clipboard.svg" alt="Copy to clipboard" scale="0">'
  const toolTipHTML = '<div class="copied">Copied!</div>'

  for (const heading of headings) {
    // href from the heading.id
    const href = `${location.protocol}//${location.host}${location.pathname}#${heading.id}`

    // Insert button1
    const toBeCopied1 = href
    const button1 = `<button class="copy-button" data-clipboard-text="${toBeCopied1}">${imgHTML}</button>${toolTipHTML}`
    heading.insertAdjacentHTML("beforeend", button1)

    // insert button2
    const toBeCopied2 = `You can read more in the ["${heading.childNodes[0].textContent}" section of our documentation.](${href})`
    const button2 = `<button class="copy-button" data-clipboard-text='${toBeCopied2}'>md${imgHTML}</button>${toolTipHTML}`
    heading.insertAdjacentHTML("beforeend", button2)
  }

  // See https://www.npmjs.com/package/clipboard - Setup and Copy text from attribute
  const clipboard = new ClipboardJS(".copy-button")
  clipboard.on("success", function (e) {
    e.clearSelection()
  })
})()
