// ==UserScript==
// @name         Jetpack Debugger - Sticky Right Sidebar
// @namespace    http://automattic.com/
// @version      0.1
// @description  This script adds CSS styles that make the right sidebar (navigation to different debug sections) sticky on scroll
// @author       Paulina Hetman
// @match        https://tools.jetpack.com/debug/?url=*
// @match        https://jptools.wordpress.com/debug/?url=*
// @downloadURL  https://github.com/pehaa/taming-tampermonkey/raw/main/jpdebuggerstickysections.user.js
// @updateURL    https://github.com/pehaa/taming-tampermonkey/raw/main/jpdebuggerstickysections.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wordpress.com
// @grant        GM_addStyle
// ==/UserScript==

/**
 * Adds CSS style for right sidebar to keep it sticky
 */

// load styles

GM_addStyle(`
  .r-side {
    position: sticky;
    top: 8rem;
  }
  /* if .mast is hidden with the Jetpack Debugger - Remove Navigation userscript */
  .mast[style="display: none;"] + div .r-side {
    top: 1.5rem;
  }
`);
