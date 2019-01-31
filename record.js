function drawCardsForDrugs(response) {
    if (document.getElementById('options').drugs.value == "com") {
        document.getElementById('drug').innerHTML += '<h5> Generic alternatives:</h5>'
        document.getElementById('drugMsg').innerHTML = '<h2>' + response.alt_drugs[0]['brand name'].trim() + ' </h2> <h6 style="color: grey"> <i> ' + response.alt_drugs[0]['active ingred'].trim() + ' (' + response.alt_drugs[0]['proportion'].trim() + ')</i></h6>' + response.alt_drugs[0].description.trim() + '<br> ';

        for (var i = 1; i < response.alt_drugs.length; i++) {
            document.getElementById('drug').innerHTML += '<div class="w3-card w3-cell-row" style="width:90%"><span class="w3-cell-row"><h2 class="w3-cell" style="width: 65%">' + response.alt_drugs[i]['brand name'].trim() + '</h2> <h6 class="w3-cell">' + response.alt_drugs[i].manufacturor.trim() + '</h6> </span><h6 style="color: grey"><i>' + response.alt_drugs[i]['active ingred'].trim() + ' (' + response.alt_drugs[i].proportion.trim() + ')</i> </h6> <span class="w3-cell-row"><h6 class="w3-cell">' + response.alt_drugs[i].tablets + " " + response.alt_drugs[i].type.trim() + '</h6> <h3 class="w3-cell" style="text-align: right">' + response.alt_drugs[i].price.toString().trim() + ' ₹                </h3></span> </div>'
        }
    }
    else {
        response.alt_drugs.forEach(drug => {
            for (var property in drug) {
                if (drug.hasOwnProperty(property) && drug[property] == null) {
                    drug[property] = " "
                }
            }
        })
        document.getElementById('drugMsg').innerHTML = '<h2>' + response.alt_drugs[0]['brand name'].trim() + ' </h2> <h6 style="color: grey"> <i> ' + response.alt_drugs[0]['active ingred'].trim() + '</i></h6>' + response.alt_drugs[0].description.trim() + '<br> ';
        document.getElementById('drug').innerHTML += '<h5> Generic alternatives:</h5>'
        
        console.log(response)
        for (var i = 1; i < response.alt_drugs.length; i++) {
            if (response.alt_drugs[i]['pricing unit'] == 'EA')
                response.alt_drugs[i]['pricing unit'] = 'for each unit'
            else if (response.alt_drugs[i]['pricing unit'] == 'ML')
                response.alt_drugs[i]['pricing unit'] = 'per millilitre'
            else if (response.alt_drugs[i]['pricing unit'] == 'GM')
                response.alt_drugs[i]['pricing unit'] = 'per gram'

            document.getElementById('drug').innerHTML += '<div class="w3-card w3-cell-row" style="width:90%"><span class="w3-cell"><h2 class="w3-cell" style="width: 65%">' + response.alt_drugs[i]['brand name'].trim() + '</span><h6 style="color: grey"><i>' + response.alt_drugs[i]['active ingred'].trim() + '</i> </h6> <span class="w3-cell-row"><h6 class="w3-cell">' + response.alt_drugs[i]['ndc desc'].trim() + '</h6> <h3 class="w3-cell"   style="text-align: right">' + ' $ ' + response.alt_drugs[i]['price per unit'].toString().trim() + ' ' + response.alt_drugs[i]['pricing unit'].toString().trim() + '                </h3></span> </div>'
        }
    }
}

function drawCardsForCondition(response) {
    var conditions = []
    response.rec_drugs.forEach(drug => {
        var found = false
        conditions.forEach(condition => {
            if (condition == drug.condition)
                found = true
        })
        if (!found)
            conditions.push(drug.condition)
    })
    conditions = conditions.join([separator = ', '])

    if (document.getElementById('options').conditions.value == "com") {

        document.getElementById('conditionMsg').innerHTML = '<h2>' + conditions + '</h2><br>';
        document.getElementById('condition').innerHTML += '<h5> Suggestions: </h5>'
      

        for (var i = 1; i < response.rec_drugs.length; i++) {

            document.getElementById('condition').innerHTML += '<div class="w3-card w3-cell-row" style="width:90%"><span class="w3-cell-row"><h2 class="w3-cell" style="width: 65%">' + response.rec_drugs[i]['brand name'].trim() + '</h2> <h6 class="w3-cell">' + response.rec_drugs[i].condition.trim() + '</h6> </span><h6 style="color: grey"><i>' + response.rec_drugs[i]['active ingred'].trim() + ' (' + response.rec_drugs[i].proportion.trim() + ')</i> </h6> ' + response.rec_drugs[i].description.trim() + '</div>';
        }
    }
    else {
        document.getElementById('conditionMsg').innerHTML = '<h2>' + conditions + '</h2><br>';
        document.getElementById('condition').innerHTML += '<h5> Suggestions: </h5>' 

        for (var i = 1; i < response.rec_drugs.length; i++) {
            document.getElementById('condition').innerHTML += '<div class="w3-card w3-cell-row" style="width:90%"><span class="w3-cell-row"><h2 class="w3-cell" style="width: 65%">' + response.rec_drugs[i]['brand name'].trim() + '</h2> <h6 class="w3-cell">' + response.rec_drugs[i].condition.trim() + '</h6> </span><h6 style="color: grey"><i>' + response.rec_drugs[i]['active ingred'].trim() + '</i> </h6> ' + response.rec_drugs[i].description.trim() + '</div>';
        }
    }
}


function drawMessage(message, ID) {
    if (ID == 'both') {
        document.getElementById('drug').innerHTML = '<div class="w3-card w3-cell-row" id="drugMsg"></div><br>'
        document.getElementById('drugMsg').innerHTML = '<h3 style="text-align: center">' + message + '</h3>'
        document.getElementById('condition').innerHTML = '<div class="w3-card w3-cell-row" id="conditionMsg"></div><br>'
        document.getElementById('conditionMsg').innerHTML = '<h3 style="text-align: center">' + message + '</h3>'
    }
    else {
        document.getElementById(ID).innerHTML = '<div class="w3-card w3-cell-row" id="' + ID + 'Msg' + '"></div><br>'
        document.getElementById(ID + 'Msg').innerHTML = '<h3 style="text-align: center">' + message + '</h3>'
    }
}

function showUser(str) {
    if (str.trim() == "") {
        document.getElementById('drugBtn').innerHTML = 'Generic drugs'
        document.getElementById('conditionBtn').innerHTML = 'Medical Condition'
        drawMessage("Search by either prescription or by medical condition.", 'both')
        document.getElementById('time').innerHTML = null;
        return;
    }
    else if (str.trim().length < 3) {
        document.getElementById('drugBtn').innerHTML = 'Generic drugs'
        document.getElementById('conditionBtn').innerHTML = 'Medical Condition'
        drawMessage("Please enter at least 3 characters.", 'both')
        document.getElementById('time').innerHTML = null;
        return;
    }
    else {
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else { // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.responseText);
                console.log(response)
                if (response.alt_drugs.length > 0) {
                    document.getElementById('drugBtn').innerHTML = 'Generic drugs ' + '<span class="w3-badge">' + response.alt_drugs.length + '</span>'
                    drawCardsForDrugs(response);
                }
                else {
                    openTab('condition')
                    document.getElementById('drugBtn').innerHTML = 'Generic drugs'
                    drawMessage("We couldn't find this drug.", 'drug')
                }
                if (response.rec_drugs.length > 0) {
                    document.getElementById('conditionBtn').innerHTML = 'Medical Condition ' + '<span class="w3-badge">' + response.rec_drugs.length + '</span>'
                    drawCardsForCondition(response)
                }
                else {
                    openTab('drug')
                    document.getElementById('conditionBtn').innerHTML = 'Medical Condition'
                    drawMessage("We couldn't find drugs for this medical condition.", 'condition')
                }

                if (response.time == undefined)
                    document.getElementById('time').innerHTML = null;
                else
                    document.getElementById('time').innerHTML = response.time;
            }
        }
    }
    if (document.getElementById('options').useTrie.checked)
        xmlhttp.open("POST", "http://localhost:3000/");
    else
        xmlhttp.open("POST", "http://localhost:3000/mysql");

    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UFT-8")
    xmlhttp.send(JSON.stringify({
        "query": str,
        "datasetForDrugs": document.getElementById('options').drugs.value,
        "datasetForConditions": document.getElementById('options').conditions.value
    }));
}

function openTab(newTab) {
    switch (newTab) {
        case 'drug':
            document.getElementById('condition').style.display = "none";
            document.getElementById('drug').style.display = "block";
            document.getElementById('conditionBtn').classList.remove('w3-teal')
            document.getElementById('conditionBtn').classList.remove('w3-hover-teal')
            document.getElementById('drugBtn').classList.add('w3-teal')
            document.getElementById('drugBtn').classList.add('w3-hover-teal')

            break;
        case 'condition':
            document.getElementById('drug').style.display = "none";
            document.getElementById('condition').style.display = "block";
            document.getElementById('drugBtn').classList.remove('w3-teal')
            document.getElementById('drugBtn').classList.remove('w3-hover-teal')
            document.getElementById('conditionBtn').classList.add('w3-teal')
            document.getElementById('conditionBtn').classList.add('w3-hover-teal')
            break;
    }
}

function openNav() {
    document.getElementById("mySidenav").style.width = "300px";
    document.body.style.marginLeft = "300px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.body.style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
}