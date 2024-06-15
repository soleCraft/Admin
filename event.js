import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function sanitizeKey(key) {
    return key.replace(/[.#$[\]/]/g, "_");
}

document.addEventListener("DOMContentLoaded", function() {
    let formSubmitted = false;

    async function fetchTeacherDetails(facultyIdNumber) {
        const sanitizedFacultyIdNumber = sanitizeKey(facultyIdNumber);
        const teacherRef = ref(db, "Registered Teacher/" + sanitizedFacultyIdNumber);
        const snapshot = await get(teacherRef);
    
        if (snapshot.exists()) {
            const teacherData = snapshot.val();
            const fullName = teacherData.FullName;
            return fullName;
        } else {
            throw new Error("Teacher not found");
        }
    }
    
    async function eventExists(facultyIdNumber, eventNameKey) {
        const eventRef = ref(db, `Teacher's Form/${facultyIdNumber}/Events/${eventNameKey}`);
        const snapshot = await get(eventRef);
        return snapshot.exists();
    }
    
    async function insertNewUser(facultyIdNumber) {
        const eventsTable = document.getElementById('eventsTable');
        const eventsTableRows = eventsTable.getElementsByTagName('tr');

        const now = new Date();
        const utcOffset = 8;
        const localTime = new Date(now.getTime() + (utcOffset * 60 * 60 * 1000));
        const timestamp = localTime.toISOString();

        try {
            const promises = [];
            const existingEvents = [];
            const newEvents = [];

            for (let i = 1; i < eventsTableRows.length; i++) { // skip the header
                const cells = eventsTableRows[i].getElementsByTagName('td');

                const eventName = cells[0].innerText.trim();
                const eventAmount = cells[1].innerText.trim();
                const eventStartDateTime = cells[2].innerText.trim();
                const eventEndDateTime = cells[3].innerText.trim();

                const eventData = {
                    Amount: eventAmount,
                    StartDateTime: eventStartDateTime,
                    EndDateTime: eventEndDateTime,
                    Timestamp: timestamp
                };

                const eventNameKey = sanitizeKey(eventName);
                const eventAlreadyExists = await eventExists(facultyIdNumber, eventNameKey);

                if (eventAlreadyExists) {
                    existingEvents.push(eventName);
                } else {
                    const teacherFormRef = ref(db, `Teacher's Form/${facultyIdNumber}/Events/${eventNameKey}`);
                    promises.push(set(teacherFormRef, eventData));
                    newEvents.push(eventName);
                }
            }

            await Promise.all(promises); // wait for all set operations to complete

            if (existingEvents.length > 0) {
                alert(`The following events already exist and were not added: ${existingEvents.join(', ')}`);
            }
            if (newEvents.length > 0) {
                alert(`The following events have been set successfully: ${newEvents.join(', ')}`);
            }
        } catch (error) {
            console.error("Error storing data:", error);
            alert("An error occurred while storing data. Please try again.");
        }
    }
    
   
    document.getElementById('registerButton').addEventListener('click', function() {
        window.location.href = "teacherRegistration.html";
    });
    
    document.getElementById('loginButton').addEventListener('click', function() {
        document.getElementById('overlay').classList.add('visible');
        document.getElementById('facultyNoForm').style.visibility = "visible";
    });
    

    async function checkTeacherRegistration(facultyIdNumber, password) {
        const sanitizedFacultyIdNumber = sanitizeKey(facultyIdNumber);
        const teacherRef = ref(db, `Registered Teacher/${sanitizedFacultyIdNumber}`);
        const snapshot = await get(teacherRef);
        
        if (snapshot.exists()) {
            const teacherData = snapshot.val();
            return teacherData.Password === password;
        }
        return false;
    }
    
    const facultyNoForm = document.getElementById("facultyNoForm");
    const closeBtn = document.querySelector(".close-facultyNo-icon");
    const closeEventFormBtn = document.getElementById("closeEventForm");

    function closePopup() {
        // Hide the overlay
        document.getElementById('overlay').classList.remove('visible');
        facultyNoForm.style.visibility = "hidden";
    }

    closeBtn.addEventListener("click", function() {
        closePopup();
    });

    function closeEventBtn() {
        window.location.href = "index.html";
    }

    closeEventFormBtn.addEventListener("click", function() {
        closeEventBtn();
    });

    document.getElementById("searchButton").addEventListener("click", async function(event) {
        event.preventDefault(); // Prevent default form submission
        const facultyNoInput = document.getElementById("facultyNoInput");
        const passwordInput = document.getElementById("password");
        const facultyIdNumber = facultyNoInput.value.trim();
        const password = passwordInput.value.trim();

        // Ensure fields are visible
        document.getElementById("facultyNoForm").style.visibility = "visible";

        const isRegistered = await checkTeacherRegistration(facultyIdNumber, password);
        if (isRegistered) {
            document.getElementById("facultyNoForm").style.visibility = "hidden";
            document.getElementById("createEventForm").style.visibility = "visible";
        } else {
            alert("Invalid faculty number or password. Please try again.");
            facultyNoInput.value = "";
            passwordInput.value = "";
        }
    });
    
    document.getElementById("saveAll").addEventListener("click", async function(event) {
        event.preventDefault();
    
        // Validate the form
        if (!validateForm()) {
            alert("Please fill in all required fields.");
            return;
        }
    
        // Proceed with form submission logic
        const facultyIdNumber = document.getElementById("facultyNoInput").value.trim();
    
        try {
            const teacherDetails = await fetchTeacherDetails(facultyIdNumber);
            const fullName = teacherDetails.trim();
    
            // Display teacher details (optional)
            document.getElementById("verifyTeachersName").innerText = fullName;
            document.getElementById("verifyFacultyNo").innerText = facultyIdNumber;
    
            // Gather data from the table
            const eventsTableRows = document.getElementById('eventsTable').getElementsByTagName('tr');
            const events = [], amounts = [], startDateTimes = [], endDateTimes = [];
    
            for (let i = 1; i < eventsTableRows.length; i++) { // skip the header
                const cells = eventsTableRows[i].getElementsByTagName('td');
                events.push(cells[0].innerText.trim());
                amounts.push(cells[1].innerText.trim());
                startDateTimes.push(cells[2].innerText.trim());
                endDateTimes.push(cells[3].innerText.trim());
            }
    
            // Display event details (optional)
            document.getElementById("verifyEvent").innerText = events.join(', ');
            document.getElementById("verifyAmount").innerText = amounts.join(', ');
            document.getElementById("verifyStaDateTime").innerText = startDateTimes.join(', ');
            document.getElementById("verifyEndDateTime").innerText = endDateTimes.join(', ');
    
            // Show verification popup
            document.getElementById("verifyPopup").style.visibility = "visible";
            // hide the table and the createEvent form
            // document.getElementById("createEventForm").style.visibility = "hidden";
            // document.getElementById("eventTable_Container").style.visibility = "hidden";
        } catch (error) {
            alert("Error fetching teacher details: " + error.message);
        }
    });    

    document.getElementById("confirmSubmitButton").addEventListener("click", async function() {
        if (!validateForm()) {
            alert("Please fill in all required fields.");
            return;
        }
        const facultyIdNumber = document.getElementById("facultyNoInput").value.trim();
        await insertNewUser(facultyIdNumber); 
        window.location.href = "index.html"; 
    });
    

    document.getElementById("cancelSubmitButton").addEventListener("click", function() {
        document.getElementById("verifyPopup").style.visibility = "hidden";
        document.getElementById("createEventForm").style.visibility = "visible";
        document.getElementById("eventTable_Container").style.visibility = "visible";
    });

    function validateForm() {
        const eventsTableRows = document.getElementById('eventsTable').getElementsByTagName('tr');
        return eventsTableRows.length > 1; // check if there is more than 1 row (plus one na yung header)
    }
});
