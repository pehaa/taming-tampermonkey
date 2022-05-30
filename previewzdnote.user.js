// ==UserScript==
// @name         Pajka - Preview Zendesk Notes
// @namespace    https://woothemes.zendesk.com/
// @version      0.1.1
// @description  Preview private note using a draggable details element
// @author       @pehaa
// @downloadURL  https://github.com/pehaa/taming-tampermonkey/raw/main/previewzdnote.user.js
// @updateURL    https://github.com/pehaa/taming-tampermonkey/raw/main/previewzdnote.user.js
// @match        https://woothemes.zendesk.com/agent/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zendesk.com
// @grant        GM_addStyle
// @require      https://unpkg.com/showdown/dist/showdown.min.js
// @require      https://unpkg.com/draggabilly@3/dist/draggabilly.pkgd.min.js
// ==/UserScript==

GM_addStyle(`
    #privatenote-md-preview {
      position:relative;
      z-index: 1000;
      background: #FFF6D9;
      display: inline-block;
      box-sizing: border-box;
      	border: 1px solid #EFDAA3;
        padding: 4px;
        cursor: grab;
    }
    #privatenote-md-preview summary {
      cursor: pointer;
    }
    #privatenote-md-preview[open] {
    max-width:100%;
    width: 600px;
      padding: 12px;
    }
    #privatenote-md-preview .markdown_preview {
      max-height: calc(100vh - 64px);
      overflow-y: auto;
      border: none;
    }
  `);
(function () {
  "use strict";

  let oldHref = document.location.href;

  let ids = [];
  window.onload = function () {
    const bodyList = document.querySelector("body");
    const converter = new showdown.Converter({
      simpleLineBreaks: true,
      simplifiedAutoLink: true
    });
    const addPreview = () => {
      const previewContainer = document.createElement("details");
      previewContainer.id = "privatenote-md-preview";
      previewContainer.innerHTML = "<summary>Preview note</summary>";
      const preview = document.createElement("div");
      preview.classList.add("comment", "markdown_preview");
      previewContainer.append(preview);
      document.body.append(previewContainer);
      return previewContainer;
    };
    let prev = addPreview();
    new Draggabilly(prev, {
      //handle: prev.querySelector('summary'),
      containment: true
    });
    const listener = (event) => {
      if (!ids.length) {
        ids = update();
      }
      if (ids.includes(event.target.id)) {
        setTimeout(() => {
          const text = event.target.value;
          const html = converter.makeHtml(text);
          prev.querySelector(".comment").innerHTML = html;
        }, 100);
      }
    };
    const update = () => {
      prev.querySelector(".comment").innerHTML = "";
      const labels = [
        ...document.querySelectorAll(".sidebar_box_container label")
      ];
      const PrivateNoteLabel = labels.filter(
        (el) => el.textContent.toLowerCase() === "private note"
      );
      if (PrivateNoteLabel) {
        ids = PrivateNoteLabel.map((l) => l.getAttribute("for"));
      }
      return ids;
    };
    document.addEventListener("keyup", listener);
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (oldHref != document.location.href) {
          oldHref = document.location.href;
          ids = [];
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
