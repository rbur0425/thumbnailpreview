// Accessing the form elements using their IDs
const form = document.getElementById('form');
const thumbnailInput = document.getElementById('thumbnail-input');
const titleInput = document.getElementById('title-input');
const nameInput = document.getElementById('name-input');
const descriptionInput = document.getElementById('description-input');
const submitButton = document.getElementById('submit-button');
const showMeInListButton = document.getElementById('show-me-in-list-button');

// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault();

  document.getElementById("error").textContent = "";

   // Get the file from the input
   const file = thumbnailInput.files[0];

   // Check the file type
   if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg') {
     alert('Please upload a valid .jpg, .jpeg, or .png file.');
     return;
   }

  // Create a FileReader to read the file input
  const reader = new FileReader();
  
  reader.onloadend = function() {
    // Create an object to store the user's information
    const userInfo = {
      userThumbnail: reader.result,
      userTitle: titleInput.value,
      userName: nameInput.value,
      userDescription: descriptionInput.value,
    };

    // Store the user's information into local storage
    chrome.storage.local.set({userInfo});
  };

  // Read the file as Data URL
  reader.readAsDataURL(file);

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    console.log("sending message");
    chrome.tabs.sendMessage(tabs[0].id, {action: "insertUserInfo"}, function(response) {
      if(!response)
      {
        document.getElementById("error").textContent = "Please go to the Youtube Search Results Page https://www.youtube.com/results?search_query=";
        return;
      }
      console.log(response);
    });
  });
}

form.addEventListener('submit', handleSubmit);
