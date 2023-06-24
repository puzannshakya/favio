var db = firebase.firestore();

db.collection("courier-option").get().then(function(query) {
    var data = [];
    query.forEach(function(doc) {
        
        console.log(doc);
        console.log(doc.data());
        console.log(doc.data()['courier-options-name']);

        data.push(doc.data());
    });
    generateContent(data);
}).catch(function(error) {
    console.log("Error getting documents: ", error);
});

function selectObject(array, propertyName, value) {
    return array.find(function(object) {
      return object[propertyName] === value;
    });
}

function generateContent(data) {
  const option_name_from_db = ['Walk', 'Bikes or Scooters', 'Cars', 'Transit'];
  const option_img_name = ['walk', 'bike', 'car', 'transportation'];

  const courier_option = document.getElementById('courier-option');
  const courier_option_head = document.createElement("h2");
  courier_option_head.textContent = "Courier Options";
  courier_option.insertBefore(courier_option_head, courier_option.firstChild);
  const courier_form = document.createElement("form");
  courier_option.appendChild(courier_form);

  option_name_from_db.forEach((option, index) => {
      const courier_item = selectObject(data, 'courier-options-name', option);

      const radioContainer = document.createElement("div");
      radioContainer.classList.add("form-courier-options");
      courier_form.appendChild(radioContainer);

      const radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.id = `radio-${option}`;
      radioInput.name = "courier-option-radio";
      radioInput.value = option;
      radioContainer.appendChild(radioInput);

      const radioLabel = document.createElement("label");
      radioLabel.htmlFor = `radio-${option}`;
      radioLabel.textContent = option;
      radioContainer.appendChild(radioLabel);

      const courierIcon = document.createElement("div");
      courierIcon.classList.add("courier-icon");
      radioContainer.appendChild(courierIcon);

      const courierIconImg = document.createElement("img");
      courierIconImg.src = `./../../img/${option_img_name[index]}.svg`;
      courierIconImg.alt = `${option}-img`;
      courierIcon.appendChild(courierIconImg);

      const courierInfo = document.createElement("div");
      courierInfo.classList.add("form-option");
      radioContainer.appendChild(courierInfo);

      const courierInfoText = document.createElement("div");
      courierInfoText.classList.add("courier-info");
      courierInfo.appendChild(courierInfoText);

      const weightSizeLimits = document.createElement("p");
      weightSizeLimits.innerHTML = `0kg - ${courier_item['weight-limit']}kg <br> ${courier_item['size-limit']} X ${courier_item['size-limit']} X ${courier_item['size-limit']} Centimeters`;
      courierInfoText.appendChild(weightSizeLimits);

      const description = document.createElement("p");
      description.textContent = "Cheapest and most sustainable delivery option: earn points every time you use sustainable delivery.";
      courierInfoText.appendChild(description);
  });
  // const submitButton = document.createElement("button");
  // submitButton.type = "submit";
  // submitButton.id = "submit-courier";
  // submitButton.textContent = "Select courier";
  // courier_form.appendChild(submitButton);
}