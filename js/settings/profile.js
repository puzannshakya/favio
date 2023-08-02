let userDocId = sessionStorage.getItem("userDocId");
let isDriverFlag = sessionStorage.getItem("isDriver");
let imageURL = "";

const defaultImageURL = "./../../img/bike.svg"; // Default image URL

async function getUserData() {
  let data = await firebase.firestore().collection("delivery_request_tests").doc(userDocId).get();
  return data.data(); // Assuming the image URL is stored in the `rider_img` field of the document.
}

async function addImage() {
  try {
    let userData = await getUserData();
    if (isDriverFlag === "true") {
      imageURL = userData && userData.rider_img ? userData.rider_img : defaultImageURL;
    } else {
      imageURL = userData && userData.seeker_img ? userData.seeker_img : defaultImageURL;
    }

    let img = document.createElement("img");
    img.className = "profile-pic";
    img.src = imageURL;
    document.getElementById("profilePic").appendChild(img);
  } catch (error) {
    console.error("Error adding image:", error);
  }
}

// Wait for the data to be fetched before calling the addImage function
async function init() {
  await addImage();
}

// Call the init function when the window loads.
window.onload = init;
