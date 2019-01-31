<html>
<head>
    <meta charset="UTF-8">
    <title>Automated Prescription</title>
    <link rel='stylesheet prefetch' href='https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css'>

    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/w3.css">
    <link rel="stylesheet" type="text/css" media="screen" href="main.css" />

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        @import "record.css";
    </style>
</head>

<body>
        <div id="mySidenav" class="sidenav w3-sidebar w3-bar-block w3-border-right w3-cell" tabindex="0" onblur="closeNav()" style="background-color: white">
            <span class="closebtn w3-container" style="right: 0px; width: 100%">Options</span>
            <a href="javascript:void(0)" class="closebtn" style="border-bottom: 0px" onclick="closeNav()">&times;</a>

            <form class="w3-container w3-cell-row" id="options" style="margin-top: 18px;">
             <input id="useTrie" type="checkbox" checked onchange="showUser(document.getElementById('input').query.value)">
             <label for="useTrie">Search using Trie</label>

            <p style="margin: 24px 0px 10px 0px">Generic Drugs:</p>
            <input class="w3-radio" type="radio" name="drugs" id="com" value="com" checked onchange="showUser(document.getElementById('input').query.value)">
             <label for="com">com</label>
            <input class="w3-radio" type="radio" name="drugs" id="drugs_new_priced" value="drugs_new_priced" onchange="showUser(document.getElementById('input').query.value)">
            <label for="drugs_new_priced">NADAC Dataset</label>

            <p style="margin: 0px 0px 10px 0px">Medical Conditions:</p>
            <input class="w3-radio" type="radio" name="conditions" id="com" value="com" checked onchange="showUser(document.getElementById('input').query.value)">
             <label for="com">com</label>
            <input class="w3-radio" type="radio" name="conditions" id="drugs_new_conditioned" value="drugs_new_conditioned" onchange="showUser(document.getElementById('input').query.value)">
            <label for="drugs_new_conditioned">FDA Dataset</label>
            </form>
        </div>

        <div id="main w3-cell-row" style="width: 100%">
            <div class="w3-container w3-cell" style="float: left">
            <span style="font-size:30px;cursor:pointer" onclick="openNav()">&#9776;</span>
            </div>
            <div class="w3-container w3-cell" style="float: right">
                <?php 
                session_start();
                if (isset($_SESSION["uname"])) {
                    echo '<h5>Welcome, ' . trim($_SESSION["uname"]) . '</h5>';
                    echo '<h5 style="text-align: right"><a href="index.html">Logout</a></h5>';
                } else {
                    echo '<span><a href="login.html">Login</a></span></h5>';
                }
                ?>
            </div>
       </div>
        <!-- search box -->
        <center>  
            <form class="w3-container" id="input"> 
                <input class="w3-input w3-border w3-round" id="query" placeholder="Enter medicine name or symptom" type="text" style="width: 70%" oninput="showUser(this.value)" onfocus="closeNav()">
            </form>
            <h6 style="color: grey; text-align: right; width: 70%" id="time"></h6>
            <br>
            <div class="w3-bar w3-cell-row" style="width:80%">
                <button class="w3-cell w3-bar-item w3-button w3-teal" id="drugBtn" style="width:50%" onclick="openTab('drug')">Generic Drugs</button>
                <button class="w3-cell w3-bar-item w3-button" id="conditionBtn" style="width:50%" onclick="openTab('condition')">Medical Condition</button>
                <br><br>
                <div class="w3-cell-row tabs" style="padding: 25px 25px 25px 25px" id="drug">
                    <div class="w3-card w3-cell-row" id="drugMsg">
                        <h3 style="text-align: center">Search by either prescription or medical condition.</h3>
                    </div>
                    <br>
                </div>
                <div class="w3-cell-row tabs" id="condition" style="padding: 25px 25px 25px 25px;display:none">
                <div class="w3-card w3-cell-row" id="conditionMsg">
                        <h3 style="text-align: center">Search by either prescription or medical condition.</h3>
                    </div>
                    <br>
                </div>

        </center>
        <script type="text/javascript" src="record.js"></script>
</body>

</html>