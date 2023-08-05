  let userDocId = sessionStorage.getItem("userDocId");

  async function getUserData() {
    const data = await firebase.firestore().collection("users_tests").doc(userDocId).get();
    return data.data(); // Assuming the image URL is stored in the `img` field of the document.
  }

  async function addImage() {
    try {
      const userData = await getUserData();
      const imageURL = userData.img || "./../../img/bike.svg"; // Default image URL
      const img = document.createElement("img");
      img.className = "profile-pic";
      img.src = imageURL;
      document.getElementById("profilePic").appendChild(img);
    } catch (error) {
      console.error("Error adding image:", error);
    }
  }

  async function init() {
    await addImage();
  }

  window.onload = init;

  document.addEventListener("DOMContentLoaded", function () {
    const profileForm = document.getElementById("profileForm");
    profileForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(profileForm);
      const userData = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        selected_vehicle: formData.get("vehicle"),
      };

      const firestore = firebase.firestore();
      firestore
        .collection("users_tests")
        .doc(userDocId)
        .update(userData)
        .then(function () {
          // Optionally, you can show a success message or redirect the user after successful submission.
        })
        .catch(function (error) {
          console.error("Error updating document: ", error);
          // Optionally, you can show an error message to the user.
        });
    });
  });
