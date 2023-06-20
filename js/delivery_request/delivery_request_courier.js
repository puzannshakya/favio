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
    const option_order = ['Walking', 'Bikes or Scooters', 'Cars', 'Transit'];

    option_order.forEach((option) => {
        const courier_item = selectObject(data, 'courier-options-name', option);
        const show = document.getElementById(`courier-${option.slice(0, 4).toLowerCase()}`);
        const img = document.createElement("img");
        img.src = "../../img/" + courier_item['courier-options-name'] + ".png";
        img.alt = "Image";
        show.appendChild(img);
        
        const courier_option = document.createElement("p");
        courier_option.textContent = courier_item['courier-options-name'];
        show.appendChild(courier_option);
        const weight = document.createElement("p");
        weight.textContent = `Weight `+courier_item['weight-limit'];
        show.appendChild(weight);
        const size = document.createElement("p");
        size.textContent = `Size `+courier_item['size-limit'];
        show.appendChild(size);
    });
}
