// Function to insert user's information into the YouTube search results page
function insertUserInfo() {
  // console.log(window.location.href);
  // Check if the URL contains "https://www.youtube.com/results?search_query="
  if (!window.location.href.includes("youtube.com")) {
    alert("Please go to the Youtube Search Results Page or the Youtube Home Page");
    console.log(window.location.href);
    return;
  }

  chrome.storage.local.get("userInfo", (result) => {
    // Get user's information from local storage
    const userThumbnail = result.userInfo.userThumbnail;
    const userTitle = result.userInfo.userTitle;
    const userName = result.userInfo.userName;
    const userDescription = result.userInfo.userDescription;

    console.log("got info from storage");
    console.log("url" + window.location.href);

    if(window.location.href.includes('results?search_query'))
    {
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
    }

    if (window.location.href === 'https://www.youtube.com/')
    {
      // Find the list of results
      const list = document.getElementsByTagName("ytd-rich-item-renderer");
      console.log(list);

      // If the list is not found or it has less than 3 items, return
      if (!list || list.length < 3) {
        return;
      }

      // Get the third component in the list
      const thirdComponent = list[2];

      // Replace the thumbnail, title, and name with the user's information
      thirdComponent.querySelector("#thumbnail > yt-image > img").src = userThumbnail;
      thirdComponent.querySelector("yt-formatted-string#video-title").textContent = userTitle;
      thirdComponent.querySelector("yt-formatted-string#video-title").ariaLabel = userTitle;
      thirdComponent.querySelector("yt-formatted-string#text").textContent = userName;
      console.log(thirdComponent);
      ytElement = thirdComponent.querySelector("div > div > div:nth-of-type(3) > yt-formatted-string");
      console.log(ytElement)
      replaceYtFormattedString(ytElement, userDescription);
    }
    
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
      console.log("received message");
      insertUserInfo();
      sendResponse({status: "done"});
    }
  }
);
