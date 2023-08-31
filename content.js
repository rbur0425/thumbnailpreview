// Function to insert user's information into the YouTube search results page
function insertUserInfo() {
  // Check if the URL contains "https://www.youtube.com/results?search_query="
  if (!window.location.href.includes("https://www.youtube.com/results?search_query=")) {
    alert("Please go to the Youtube Search Results Page");
    return;
  }

  chrome.storage.local.get("userInfo", (result) => {
    // Get user's information from local storage
    const userThumbnail = result.userInfo.userThumbnail;
    const userTitle = result.userInfo.userTitle;
    const userName = result.userInfo.userName;
    const userDescription = result.userInfo.userDescription;

    // Find the list of results
    const list = document.getElementsByTagName("ytd-video-renderer");

    // If the list is not found or it has less than 3 items, return
    if (!list || list.length < 3) {
      return;
    }

    // Get the third component in the list
    const thirdComponent = list[2];

    // Replace the thumbnail, title, and name with the user's information
    thirdComponent.querySelector("#thumbnail > yt-image > img").src = userThumbnail;
    thirdComponent.querySelector("#video-title > yt-formatted-string").textContent = userTitle;
    thirdComponent.querySelector("#video-title > yt-formatted-string").ariaLabel = userTitle;
    thirdComponent.querySelector("#channel-info > #channel-name > #container > #text-container > #text > a").textContent = userName;
    console.log(thirdComponent);
    ytElement = thirdComponent.querySelector("div > div > div:nth-of-type(3) > yt-formatted-string");
    console.log(ytElement)
    replaceYtFormattedString(ytElement, userDescription);
    });
  };

function replaceYtFormattedString(ytElement, newText) {
  //remove is-empty attribute if needed
  if(ytElement.hasAttribute("is-empty"))
  {
    ytElement.removeAttribute("is-empty");
  }
  // Check if the ytElement contains any <span> tags
  const hasSpan = ytElement.querySelector('span');

  if (hasSpan) {
    // Remove all span elements
    while (ytElement.firstChild) {
      ytElement.removeChild(ytElement.firstChild);
    }
  }

  // Replace the textContent with the new text
  ytElement.textContent = newText;
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "insertUserInfo") {
      insertUserInfo();
      sendResponse({status: "done"});
    }
  }
);
