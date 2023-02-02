// ==UserScript==
// @name         Akismet Zendesk Helpers
// @namespace    http://automattic.com/zendesk/akismet/
// @version      2.0.0
// @description  Automattic upgrades to Zendesk for Akismet support, cross-browser. This scripts generates the test link that we send to the commenters that contact us regarding their comments “disappearing” or being flagged as spam. The link is copied to clipboard.
// @author       Paulina Hetman updated older version that didn't have author specified
// @downloadURL  https://github.com/pehaa/taming-tampermonkey/raw/main/akismet-helper.user.js
// @updateURL    https://github.com/pehaa/taming-tampermonkey/raw/main/akismet-helper.user.js
// @match        https://woothemes.zendesk.com/*
// @connect      mc.a8c.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @require      https://unpkg.com/clipboard@2/dist/clipboard.min.js
// @require      https://gist.githubusercontent.com/klimeryk/6eca2fff0120104a733e6e98ee1026a8/raw/172aeeff7565c933d27165f4781a4f7e7d186c1a/trackUsage

// ==/UserScript==

trackUsage("zendesk-akismet-helpers");

(function () {
	"use strict";

	// this one is only added to trigger the copy to clipboard action
	const ghostCopyButton = document.createElement("button");
	ghostCopyButton.classList.add("ghost-copy-button");
	document.body.append(ghostCopyButton);

	const requestLink = () => {
		const ticketId = location.pathname.split("/").pop();
		GM_xmlhttpRequest({
			url:
				"https://mc.a8c.com/happiness/api/make-akismet-followup-token/?ticket_id=" +
				ticketId,
			method: "GET",
			onload: function (res) {
				if (200 === res.status) {
					const token = JSON.parse(res.response).data;
					const link = `https://akismet.com/comment-test/?t=${token}&k=1`;
					ghostCopyButton.setAttribute("data-clipboard-text", link);
					ghostCopyButton.click();
					alert(
						`Comment Test Link for ticket ${ticketId} has been generated: \n${link}\nIt has been copied to your clipboard.`
					);
					console.log(ticketId, res.response, link);
				} else {
					alert(
						"Oops, could not generate link. Please make sure you are logged in to MC."
					);
				}
			},
			onerror: function (res) {
				alert(
					"Oops, could not generate link. Please make sure you are logged in to MC."
				);
			},
		});
	};

	const requestButton = document.createElement("button");
	requestButton.setAttribute("id", "jpop-request-comment-link");
	requestButton.innerHTML = "Comment Test Link";
	requestButton.addEventListener("click", requestLink);

	const enableHelpers = () => {
		const ticketId = location.pathname.split("/").pop();
		const ticketDetailPage = new RegExp("agent/tickets/[0-9]+$", "gi");
		if (ticketDetailPage.test(location.pathname)) {
			// run only on ticket's detail page
			addRequestCommentLinkButton();
		} else if (requestButton.isConnected) {
			// if we navigage to non-ticket page, remove the button from DOM and reset its ticket id
			requestButton.setAttribute("data-ticket-id", "");
			requestButton.remove();
		}
	};

	const clipboard = new ClipboardJS(ghostCopyButton);
	clipboard.on("success", function (e) {
		e.clearSelection();
		ghostCopyButton.setAttribute("data-clipboard-text", "");
	});

	const addRequestCommentLinkButton = () => {
		const ticketId = location.pathname.split("/").pop();
		// if button is added and has correct ticketId - there is nothing to do
		if (
			requestButton.isConnected &&
			requestButton.getAttribute("data-ticket-id") == ticketId
		) {
			return;
		}
		// if the button does not have the right ticket id, remove it and reset the id
		if (requestButton.getAttribute("data-ticket-id") != ticketId) {
			requestButton.setAttribute("data-ticket-id", "");
			requestButton.remove();
		}

		// let's now add the button
		const queryString = `[data-side-conversations-anchor-id="${ticketId}"] [data-test-id="omnichannel-channel-switcher-button"]`;
		const targetDiv = document.querySelector(queryString);
		if (targetDiv) {
			targetDiv.insertAdjacentElement("afterend", requestButton);
			requestButton.setAttribute("data-ticket-id", ticketId);
		}
	};

	setInterval(enableHelpers, 1000);
})();
