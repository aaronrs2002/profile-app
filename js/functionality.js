let guestData = [];
let activeUser = "";


const ValidateProfile = (fields) => {
    /*const letterOnly = /^[a-zA-Z\s-.]*$/;
    const numOnly = /^[0-9-().+]+$/;*/
    [].forEach.call(document.querySelectorAll(".error"), (e) => {
        e.classList.remove("error")
    })

    for (let i = 0; i < fields.length; i++) {//validate each field in array with a loop
        let value = "";
        if (document.querySelector("[name='" + fields[i] + "']").value.length > 0) {
            console.log("The new value1: " + document.querySelector("[name='" + fields[i] + "']").value)
        } else {
            document.querySelector("[name='" + fields[i] + "']").classList.add("error");
        }

        if (fields[i] === "email") {//XX@XX.XX format required
            email = document.querySelector("[name='" + fields[i] + "']").value;
            email = email.toLowerCase();
            var atpos = email.indexOf("@");
            var dotpos = email.lastIndexOf(".");
            if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
                document
                    .querySelector("[name='" + fields[i] + "']")
                    .classList.add("error");
            } //end if
        }
    }




    if (document.querySelector(".error") !== null) {
        globalAlert("alert-warning", "There are errors in your form.");
        return false;
    }
}



function clearForms() {
    [].forEach.call(document.querySelectorAll("input[type='text']"), (e) => {
        e.value = "";
    });
    [].forEach.call(document.querySelectorAll("textarea"), (e) => {
        e.value = "";
    });
    [].forEach.call(document.querySelectorAll("select"), (e) => {
        e.selectedIndex = 0;
    });
    document.getElementById("seatingTarget").innerHTML = "";

    document.getElementById("guestImgTarget").innerHTML = "<img class='img-fluid' src='img/guests/profileImg.jpg' />";
    document.getElementById("nameTarget").innerHTML = "";


    [].forEach.call(document.querySelectorAll("button[data-addedit='edit'][data-module='event']"), (e) => {
        e.classList.add("hide");

    });

    // document.querySelector("button[data-addedit='edit'][data-module='event']").classList.add("hide");
}

function buildEventMenu(eventObj) {
    let eventObjHTML = "<option value='default'>Select Event</option>";

    let tempEventList = [];

    for (let i = 0; i < eventObj.length; i++) {
        if (tempEventList.indexOf(eventObj[i].task) === -1) {
            eventObjHTML = eventObjHTML + "<option value='" + i + "'>" + eventObj[i].task + "</option>";
            tempEventList.push(eventObj[i].task);
        }

    }

    document.querySelector("select[name='eventList']").innerHTML = eventObjHTML;

}




/*
async function fetchGuest() {



    //  await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
    const response = await fetch("../localdata/guestInfo.json");
    const contents = await response.json();
    return contents;
}


const buildGuests = async () => {



    const result = await fetchGuest();

    guestData = result;

    localStorage.setItem("guestData", JSON.stringify(guestData));

    let guestSelectList = "<option value='default'>Select Profile</option>";

    for (let i = 0; i < result.length; i++) {
        guestSelectList = guestSelectList + "<option value='" + i + "'>" + result[i].fName + " " + result[i].lName + "</option>"
    }


    document.querySelector("select[name='guestList']").innerHTML = guestSelectList;
};*/
function buildSelectMenu() {
    if (!localStorage.getItem("guestData")) {
        globalAlert("alert-danger", "No Guest data.");

    }
    else {
        guestData = localStorage.getItem("guestData")
        guestData = JSON.parse(guestData);

        let guestSelectList = "<option value='default'>Select Profile</option>";

        for (let i = 0; i < guestData.length; i++) {
            guestSelectList = guestSelectList + "<option value='" + i + "'>" + guestData[i].fName + " " + guestData[i].lName + "</option>"
        }


        document.querySelector("select[name='guestList']").innerHTML = guestSelectList;
    }
}
buildSelectMenu();


function selectProfile() {
    let usedAssigned = [];
    selectedTasks = JSON.parse(localStorage.getItem("selectedTasks"));

    let whichProfile = document.querySelector("select[name='guestList']").value;
    if (whichProfile === "default") {
        return false;
    }

    document.querySelector("[name='fName']").value = guestData[whichProfile].fName;
    document.querySelector("[name='lName']").value = guestData[whichProfile].lName;
    document.querySelector("[name='phone']").value = guestData[whichProfile].phone;
    document.querySelector("[name='email']").value = guestData[whichProfile].email;
    document.querySelector("[name='guestImg']").value = guestData[whichProfile].guestImg;
    document.getElementById("guestImgTarget").innerHTML = "<img class='img-fluid' src='" + guestData[whichProfile].guestImg + "' />";
    document.getElementById("nameTarget").innerHTML = guestData[whichProfile].fName + " " + guestData[whichProfile].lName;
    activeUser = guestData[whichProfile].email;

    let accountsObj = [];
    if (guestData[0].events) {

        for (let i = 0; i < guestData[whichProfile].events.length; i++) {

            if (accountsObj.indexOf(guestData[whichProfile].events[i].account) === -1) {
                accountsObj.push(guestData[whichProfile].events[i].account);
            }
        }


        console.log("JSON.stringify(accountsObj): " + JSON.stringify(accountsObj));


        let accountsTargetHTML = "<option value='default'>Select Account</option>";

        for (let i = 0; i < accountsObj.length; i++) {
            accountsTargetHTML = accountsTargetHTML + "<option value='" + accountsObj[i] + "'>" + accountsObj[i] + "</option>"
        }

        /* document.querySelector("select[name='accountsTarget']").innerHTML = accountsTargetHTML;*/

        let seatAssignmentHTML = "";

        if (activeUser === guestData[whichProfile].email) {
            for (let i = 0; i < guestData[whichProfile].events.length; i++) {
                if (usedAssigned.indexOf(guestData[whichProfile].events[i].task) === -1) {
                    seatAssignmentHTML = seatAssignmentHTML + `<li class="list-group-item"><i class="fas fa-trash" onClick="deleteTask('${guestData[whichProfile].events[i].task}','${guestData[whichProfile].events[i].email}')"></i> - <label>${guestData[whichProfile].events[i].task}: seat</label><input type="text" class="form-control" name="${guestData[whichProfile].events[i].task}-seat" value="${guestData[whichProfile].events[i].seat}" placeholder="Assigned Seat for ${guestData[whichProfile].events[i].task}"/>
                    <div><label>${guestData[whichProfile].events[i].task} Detials</label><textarea class="form-control" name="${guestData[whichProfile].events[i].task}-details" >${guestData[whichProfile].events[i].details}</textarea> </div>
                    </li>`

                    usedAssigned.push(guestData[whichProfile].events[i].task);
                }
            }
        }


        document.getElementById("seatAssignment").innerHTML = seatAssignmentHTML;

    }
    selectEvent()
    addEdit('profile', 'edit');



    /*
    "events": [
        {
            "account": "2026-04-28-Smith Wedding",
            "eventTitle": "Rehearsal Dinner",
            "hotelInfo": "Sheraton",
            "flightInfo": "Delta-4657",
            "carRentalInfo": "Hertz",
            "optionalMessage": "Kosher meal",
            "attending": "yes",
            "guestType": "StandardGuest",
            "seatAssignment": "table 18"
        },
    */




    if (localStorage.getItem("taskList")) {
        let tempTasks = localStorage.getItem("taskList");
        tempTasks = JSON.parse(tempTasks);

        let taskListStr = "";
        for (let i = 0; i < tempTasks.length; i++) {

            taskListStr = taskListStr + `<li class="list-group-item"><input type="checkbox" name="taskItem" onChange="updateProfileTask()" value="${tempTasks[i].task}"/> - ${tempTasks[i].task}<li>`;
        }
        document.getElementById("taskListTarget").innerHTML = taskListStr;
    }


    for (let i = 0; i < guestData.length; i++) {



        if (guestData[i].email === activeUser) {

            let selectedTasks = guestData[i].events;

            for (let j = 0; j < selectedTasks.length; j++) {
                if (document.querySelector("input[type='checkbox'][value='" + selectedTasks[j].task + "']")) {
                    document.querySelector("input[type='checkbox'][value='" + selectedTasks[j].task + "']").checked = true;
                }

            }

        }

    }


}


function buildProfile() {
    ValidateProfile(["fName", "lName", "phone", "email", "guestImg"]);
    if (document.querySelector(".error")) {
        console.log("we just check validate")
        return false;
    } else {
        console.log("There were no errors in your form.")
    }

    if (localStorage.getItem("guestData")) {
        guestData = localStorage.getItem("guestData")

        guestData = JSON.parse(guestData);
    }


    guestData = [...guestData, {
        fName: document.querySelector("[name='fName']").value,
        lName: document.querySelector("[name='lName']").value,
        phone: document.querySelector("[name='phone']").value,
        email: document.querySelector("[name='email']").value,
        guestImg: document.querySelector("[name='guestImg']").value,
        "events": []

    }];

    localStorage.setItem("guestData", JSON.stringify(guestData));

    buildSelectMenu();
    globalAlert("alert-success", document.querySelector("[name='fName']").value + "'s profile has been added.");
    clearForms();

}




function editProfile() {

    ValidateProfile(["fName", "lName", "phone", "email", "guestImg"]);
    if (document.querySelector(".error")) {
        console.log("we just check validate")
        return false;
    }



    let whichProfile = document.querySelector("select[name='guestList']").value;

    console.log("whichProfile: " + whichProfile);
    console.log("JSON.stringify(guestData): " + JSON.stringify(guestData));
    for (let i = 0; i < guestData[whichProfile].events.length; i++) {
        console.log("guestData[whichProfile].events[i].seat: " + guestData[whichProfile].events[i].seat)

        guestData[whichProfile].events[i].seat = document.querySelector("input[name='" + guestData[whichProfile].events[i].task + "-seat']").value;
        guestData[whichProfile].events[i].details = document.querySelector("textarea[name='" + guestData[whichProfile].events[i].task + "-details']").value;
    }



    guestData[whichProfile].fName = document.querySelector("[name='fName']").value;
    guestData[whichProfile].lName = document.querySelector("[name='lName']").value;
    guestData[whichProfile].phone = document.querySelector("[name='phone']").value;
    guestData[whichProfile].email = document.querySelector("[name='email']").value;
    guestData[whichProfile].guestImg = document.querySelector("[name='guestImg']").value;
    guestData[whichProfile].events = guestData[whichProfile].events;

    localStorage.setItem("guestData", JSON.stringify(guestData));
    clearForms();
    globalAlert("alert-success", guestData[whichProfile].fName + "'s profile has been updated.");
    buildSelectMenu();
    document.getElementById("taskListTarget").innerHTML = "";
    document.getElementById("seatAssignment").innerHTML = "";
    document.getElementById("guestImgTarget").innerHTML = "";
    document.getElementById("nameTarget").innerHTML = "";


}



function selectAccount() {

    let whichAccount = document.querySelector("select[name='accountsTarget']").value;
    let whichProfile = document.querySelector("select[name='guestList']").value;
    let eventHTML = "";
    for (let i = 0; i < guestData[whichProfile].events.length; i++) {
        if (guestData[whichProfile].events[i].account === whichAccount) {

            eventHTML = eventHTML + `<ul>
                    <li><h3>Event Title: ${guestData[whichProfile].events[i].eventTitle}</h3></li>
                    <li>Hotel Info: ${guestData[whichProfile].events[i].hotelInfo}</li>
                    <li>Flight Info: ${guestData[whichProfile].events[i].flightInfo}</li>
                    <li>Car Rental: ${guestData[whichProfile].events[i].carRentalInfo}</li>
                    <li>Details: ${guestData[whichProfile].events[i].optionalMessage}</li>
                     <li>Attending: ${guestData[whichProfile].events[i].attending}</li>
                     <li>Guest Level: ${guestData[whichProfile].events[i].guestType}</li>
                     <li>Seat Assignment: ${guestData[whichProfile].events[i].seatAssignment}</li>
                     </ul><hr/>`;



        }

    }

    document.getElementById("accountDataTarget").innerHTML = eventHTML;
    //accountDataTarget

}



function addEdit(module, addEdit) {
    [].forEach.call(document.querySelectorAll(".error"), (e) => {
        e.classList.remove("error");
    });

    if (module === "event" && addEdit === "add") {
        [].forEach.call(document.querySelectorAll("[data-module='event'][data-addedit='edit']"), (e) => {
            e.classList.add("hide");
        });

        [].forEach.call(document.querySelectorAll("[data-module='event'][data-addedit='add']"), (e) => {
            e.classList.remove("hide");
        });
        globalAlert("alert-success", "Your in Add Mode for events.");
    }

    if (module === "event" && addEdit === "edit") {
        [].forEach.call(document.querySelectorAll("[data-module='event'][data-addedit='add']"), (e) => {
            e.classList.add("hide");
        });

        [].forEach.call(document.querySelectorAll("[data-module='event'][data-addedit='edit']"), (e) => {
            e.classList.remove("hide");
        });
        globalAlert("alert-success", "Your in Edit Mode for events.");
    }
    /*start profile
    console.log("module: " + module + " - addEdit: " + addEdit);*/

    if (module === "profile" && addEdit === "add") {
        [].forEach.call(document.querySelectorAll("[data-module='profile'][data-addedit='edit']"), (e) => {
            e.classList.add("hide");
        });

        [].forEach.call(document.querySelectorAll("[data-module='profile'][data-addedit='add']"), (e) => {
            e.classList.remove("hide");
        });

        globalAlert("alert-success", "Your in Add Mode For profiles.");
    }

    if (module === "profile" && addEdit === "edit") {
        [].forEach.call(document.querySelectorAll("[data-module='profile'][data-addedit='add']"), (e) => {
            e.classList.add("hide");
        });

        [].forEach.call(document.querySelectorAll("[data-module='profile'][data-addedit='edit']"), (e) => {
            e.classList.remove("hide");
        });
        globalAlert("alert-success", "Your in Edit Mode For profiles.");
    }



}


/*
START EVENT MODULE
                    <label>Account</label>
                    <input type="text" class="form-control" name="accountName" />
                    <label>Event Title</label>
                    <input type="text" class="form-control" name="eventTitle" />
                    <label>Event Date</label>
                    <input type="text" class="form-control" name="eventDate" />
                    <label>Event Time</label>
                    <input type="text" class="form-control" name="eventTime" />
                    <label>Event Address</label>
                    <input type="text" class="form-control" name="eventAddress" />
                    <label>Event Contact Email</label>
                    <input type="text" class="form-control" name="eventEmail" />
                    <label>Event Contact Phone</label>
                    <input type="text" class="form-control" name="eventPhone" />
                    <label>Event Coordinator</label>
                    <input type="text" class="form-control" name="eventCoordinator" />
                    <textarea name='eventDetails'/>

*/

let eventObj = [];
let compareList = []
if (localStorage.getItem('eventObj')) {

    let tempEventObj = localStorage.getItem('eventObj');



    let tempParse = JSON.parse(tempEventObj);
    for (let i = 0; i < tempEventObj.length; i++) {
        compareList.push(tempEventObj[i].task);
    }
    eventObj = tempParse;
}



if (localStorage.getItem("taskList")) {

    let tempEventObj = [];
    let tempTasks = localStorage.getItem("taskList");
    tempTasks = JSON.parse(tempTasks);

    for (let i = 0; i < tempTasks.length; i++) {
        if (compareList.indexOf(tempTasks[i].task) === -1) {
            tempEventObj.push({
                accountName: "",
                task: tempTasks[i].task,
                startDate: tempTasks[i].startDate,
                eventTime: "",
                eventAddress: "",
                eventEmail: "",
                eventPhone: "",
                eventCoordinator: "",
                taskDetails: tempTasks[i].taskDetails,

            });
        }



    }

    eventObj = [...eventObj, ...tempEventObj];


}


buildEventMenu(eventObj);

function updateEvent(addEdit) {

    let whichEvent = document.querySelector("select[name='eventList']").value;
    if (whichEvent === "default") {
        return false;
    }


    switch (addEdit) {
        case "add":




            eventObj = [...eventObj, {

                accountName: document.querySelector("[name='accountName']").value,
                task: document.querySelector("[name='eventTitle']").value,
                startDate: document.querySelector("[name='eventDate']").value,
                eventTime: document.querySelector("[name='eventTime']").value,
                eventAddress: document.querySelector("[name='eventAddress']").value,
                eventEmail: document.querySelector("[name='eventEmail']").value,
                eventPhone: document.querySelector("[name='eventPhone']").value,
                eventCoordinator: document.querySelector("[name='eventCoordinator']").value,
                taskDetails: document.querySelector("textarea[name='eventDetails']").value,


            }];

            localStorage.setItem("eventObj", JSON.stringify(eventObj));



            break;
        case "edit":


            eventObj[whichEvent].accountName = document.querySelector("[name='accountName']").value;
            eventObj[whichEvent].task = document.querySelector("[name='eventTitle']").value;
            eventObj[whichEvent].startDate = document.querySelector("[name='eventDate']").value;
            eventObj[whichEvent].eventTime = document.querySelector("[name='eventTime']").value;
            eventObj[whichEvent].eventAddress = document.querySelector("[name='eventAddress']").value;
            eventObj[whichEvent].eventEmail = document.querySelector("[name='eventEmail']").value;
            eventObj[whichEvent].eventPhone = document.querySelector("[name='eventPhone']").value;
            eventObj[whichEvent].eventCoordinator = document.querySelector("[name='eventCoordinator']").value;
            eventObj[whichEvent].taskDetails = document.querySelector("textarea[name='eventDetails']").value;



            break;

    }

    localStorage.setItem("eventObj", JSON.stringify(eventObj));

    globalAlert("alert-success", addEdit + " was successful!");
    clearForms();

}
let searchGuestData = [];
function selectEvent() {

    addEdit("event", "edit");


    let whichEvent = document.querySelector("select[name='eventList']").value;
    if (whichEvent === "default") {
        whichEvent = 0;
    }


    console.log("JSON.stringify(eventObj[whichEvent]): " + JSON.stringify(eventObj[whichEvent]));

    document.querySelector("[name='accountName']").value = eventObj[whichEvent].accountName;
    document.querySelector("[name='eventTitle']").value = eventObj[whichEvent].task;
    document.querySelector("[name='eventDate']").value = eventObj[whichEvent].startDate;
    document.querySelector("[name='eventTime']").value = eventObj[whichEvent].eventTime;
    document.querySelector("[name='eventAddress']").value = eventObj[whichEvent].eventAddress;
    document.querySelector("[name='eventEmail']").value = eventObj[whichEvent].eventEmail;
    document.querySelector("[name='eventPhone']").value = eventObj[whichEvent].eventPhone;
    document.querySelector("[name='eventCoordinator']").value = eventObj[whichEvent].eventCoordinator;
    document.querySelector("textarea[name='eventDetails']").value = eventObj[whichEvent].taskDetails;


    let seatingHTML = "";

    console.log("JSON.stringify(guestData): " + JSON.stringify(guestData) + " (typeof guestData): " + (typeof guestData));

    searchGuestData = [];

    for (let i = 0; i < guestData.length; i++) {
        console.log("guestData[i].events.length: " + guestData[i].events.length)
        for (let j = 0; j < guestData[i].events.length; j++) {
            searchGuestData.push({ "email": guestData[i].email, "details": guestData[i].email + ":" + guestData[i].events[j].details });
            console.log("j: " + j)
            console.log("guestData[i].events[j].task: " + guestData[i].events[j].task);
            console.log("eventObj[whichEvent].task: " + eventObj[whichEvent].task);
            if (guestData[i].events[j].task === eventObj[whichEvent].task) {
                seatingHTML = seatingHTML + `<li class="list-group-item" data-search="${guestData[i].email}"> <i class="fas fa-trash" onClick="deleteTask('${eventObj[whichEvent].task}','${guestData[i].email}')"></i> ${guestData[i].email + " seat: " + guestData[i].events[j].seat}</li>
                <li class="list-group-item list-group-item-action list-group-item-dark" data-search="${guestData[i].email}">${guestData[i].events[j].details}</li>`
            }
        }

    }

    document.getElementById("seatingTarget").innerHTML = seatingHTML;

    if (document.querySelector("select[name='eventList']").value !== "default") {
        [].forEach.call(document.querySelectorAll("button[data-addedit='edit'][data-module='event']"), (e) => {

            e.classList.remove("hide");
        })

    } else {
        [].forEach.call(document.querySelectorAll("button[data-addedit='edit'][data-module='event']"), (e) => {
            e.classList.add("hide");

        });

    }

}

function filterGuests() {
    let searchStr = document.querySelector("input[name='guestSearch']").value;
    for (let i = 0; i < searchGuestData.length; i++) {
        if (searchGuestData[i].details.indexOf(searchStr) === -1) {
            [].forEach.call(document.querySelectorAll("li[data-search='" + searchGuestData[i].email + "']"), (e) => {
                e.classList.add("hide");
            });
        } else {
            [].forEach.call(document.querySelectorAll("li[data-search='" + searchGuestData[i].email + "']"), (e) => {
                e.classList.remove("hide");
            });
        }
    }

}

function updateProfileTask() {
    let seatAssignmentHTML = "";
    let detailsHTML = "";
    let usedAssigned = [];

    [].forEach.call(document.querySelectorAll("input[name='taskItem']"), (e) => {
        if (e.checked) {
            let seatVal = "N/A";
            let detailsVal = "No details yet";
            try {
                if (document.querySelector("input[name='" + e.value + "-seat']").value) {
                    seatVal = document.querySelector("input[name='" + e.value + "-seat']").value;
                }
            } catch (error) {
                console.log("Seat input available yet");
            }

            /*startdetails*/

            try {
                if (document.querySelector("textarea[name='" + e.value + "-details']").value) {
                    detailsVal = document.querySelector("textarea[name='" + e.value + "-details']").value;
                }
            } catch (error) {
                console.log("No Details available yet");
            }
            usedAssigned.push({
                user: activeUser, task: e.value, seat: seatVal, details: detailsVal
            });
            seatAssignmentHTML = seatAssignmentHTML + `<li class="list-group-item"><i class="fas fa-trash" onClick="deleteTask('${e.value}','${activeUser}'"></i> - <label>${e.value}: seat</label><input type="text" class="form-control" value="${seatVal}" name="${e.value}-seat" placeholder="Assigned Seat ${e.value}"/>
            <div><label>${e.value} Details</label><textarea name="${e.value}-details" class="form-control">${detailsVal}</textarea> </div>
            </li>`;
        }

    });
    for (let i = 0; i < guestData.length; i++) {
        if (activeUser === guestData[i].email) {

            guestData[i].events = usedAssigned;
        }
    }


    document.getElementById("seatAssignment").innerHTML = "";
    document.getElementById("seatAssignment").innerHTML = seatAssignmentHTML;
    localStorage.setItem("guestData", JSON.stringify(guestData));
}


/*
 
 
*/

function deleteTask(task, email) {
    if (document.querySelector("#taskListTarget input[type='checkbox'][value='" + task + "']")) {
        document.querySelector("#taskListTarget input[type='checkbox'][value='" + task + "']").checked = false;
        updateProfileTask();
    }

    /*Run this in case it doesn't exist in the taks checkbox list*/
    let whichProfile = document.querySelector("select[name='guestList']").value;

    for (let i = 0; i < guestData.length; i++) {


        if (whichProfile === i) {
            console.log("Updating guestData[i].email: " + guestData[i].email);
        }
    }



    console.log("whichProfile: " + whichProfile);
    if (whichProfile === "default") {
        for (let i = 0; i < guestData.length; i++) {


            if (guestData[i].email === email) {
                whichProfile = i;
                console.log("Updating guestData[i].email: " + guestData[i].email);
            }
        }

    }
    let tempTasks = [];

    for (let i = 0; i < guestData[whichProfile].events.length; i++) {
        if (guestData[whichProfile].events[i].task !== task) {
            tempTasks.push(guestData[whichProfile].events[i]);
        }
    }
    guestData[whichProfile].events = tempTasks;
    globalAlert("alert-success", task + " deleted.");

    localStorage.setItem("guestData", JSON.stringify(guestData));
    selectEvent();
    selectProfile();

}


function deleteEvent() {

    let activeEvent = document.querySelector("select[name='eventList']").value;
    if (activeEvent === "default") {
        console.log("default is the value");
        return false;
    } else {
        console.log("activeEvent: " + activeEvent);
    }
    let eventObj = [];
    let tempEvents = [];
    if (localStorage.getItem("eventObj")) {
        console.log("localStorage: " + localStorage.getItem("eventObj"))
        eventObj = JSON.parse(localStorage.getItem("eventObj"));
    } else {
        globalAlert("alert-warning", "No events.");
        return false;
    }

    for (let i = 0; i < eventObj.length; i++) {
        if (i !== Number(activeEvent)) {
            tempEvents.push(eventObj[i]);
        }
    }



    eventObj = tempEvents;
    localStorage.setItem("eventObj", JSON.stringify(eventObj));
    console.log("JSON.stringify(eventObj): " + JSON.stringify(eventObj));
    buildEventMenu(eventObj);
    clearForms();

    document.querySelector(`[data-warning='deleteEventShow']`).classList.add('hide');

    // document.querySelector(`[data-warning='deleteEventBt']`).classList.remove('hide');

}

/*


[{"accountName":"","task":"new","startDate":"2025-11-02","eventTime":"","eventAddress":"","eventEmail":"","eventPhone":"","eventCoordinator":"","taskDetails":"new"},{"accountName":"","task":"dfdrgerab","startDate":"2025-11-06","eventTime":"","eventAddress":"","eventEmail":"","eventPhone":"","eventCoordinator":"","taskDetails":"No Details"},{"accountName":"","task":"new try task here","startDate":"2026-06-11","eventTime":"","eventAddress":"","eventEmail":"","eventPhone":"","eventCoordinator":"","taskDetails":"No Details"}]

*/