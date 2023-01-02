

let items2 = document.querySelectorAll(".carddisplay");
for (let i = 0; i < 10; i++) {
    let div = document.createElement('div');
    div.className = 'specificationholder';
    div.id = 'specifications' + (i + 1);
    items2[i].appendChild(div);
}
let items = document.querySelectorAll(".carddisplay");
for (let i = 0; i < 10; i++) {
    let div = document.createElement('div');
    div.className = 'detailholder';
    div.id = 'detail' + (i + 1);
    items[i].appendChild(div);
}

function defaultDisplay() {
    let details = document.querySelectorAll(".detailholder");
    let specifications = document.querySelectorAll(".specificationholder");
    for (let i = 0; i < 10; i++) {
        details[i].innerHTML = "";
        details[i].style.display = "none";
        specifications[i].innerHTML = "";
        specifications[i].style.display = "none";
    }
}
defaultDisplay();

function detailDisplay() {
    let specifications = document.querySelectorAll(".specificationholder");
    let details = document.querySelectorAll(".detailholder");
    for (let i = 0; i < 10; i++) {
        details[i].style.display = "block";
        specifications[i].innerHTML = "";
        specifications[i].style.display = "none";
    }
}
// detailDisplay();

function ajaxGET(url, callback) {

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            callback(this.responseText);
        } else {
            console.log(this.status);
        }
    }
    xhr.open("GET", url);
    xhr.send();
}



document.querySelector("#showdetails").addEventListener("click", function (e) {
    currentvalue = document.getElementById("showdetails").value;
    if (currentvalue == "Hide Reviews") {
        document.getElementById("showdetails").value = "Show Reviews";
        defaultDisplay();
    } else {
        document.getElementById("showdetails").value = "Hide Reviews";
        detailDisplay();
        ajaxGET("/reviews", function (data) {
            let parsedData = JSON.parse(data);

            let holder = document.getElementsByClassName("detailholder");

            for (let i = 0; i < parsedData.length; i++) {
                let item = parsedData[i];
                let str = item["rate"] + "<br>" + item["user_name"] + "<span style='font-size:small;color:grey'>." + item["date_of_post"] + "</span><br><br><b>" + item['title_of_post']
                    + "</b><br><br>" + item["text_of_post"];

                holder[i].innerHTML = str;
            }


        });
    }
});