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
    const option_name_from_db =  ['Walk', 'Bikes or Scooters', 'Cars', 'Transit'];
    const option_img_name =  ['walk', 'bike', 'car', 'transportation'];

    const courier_option = document.getElementById('courier-option');
    // subject
    const courier_option_head = document.createElement("h2");
    courier_option_head.textContent = "Courier Options";
    courier_option.appendChild(courier_option_head);

    option_name_from_db.forEach((option, index) => {
        const courier_item = selectObject(data, 'courier-options-name', option);
        const div = document.createElement("div");
        div.innerHTML = `
            <div class="form-courier-options">
                <div class="options">
                    <a href="#">
                        <div class="courier-icon" >
                            <img src="./../../img/${option_img_name[index]}.svg" alt="${option}-img">
                        </div>
                        <div class="form-option">
                            <h3>${option}</h3>
                            <div class="courier-info">
                                <p>0kg - ${courier_item['weight-limit']}kg <br> ${courier_item['size-limit']} X ${courier_item['size-limit']} X ${courier_item['size-limit']} Centimeters</p>
                                <p>Cheapest and most sustainable delivery option: earn points every time you
                                    use sustainable delivery
                                <p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        `;
        courier_option.appendChild(div); 
});
}



