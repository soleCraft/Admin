document.addEventListener("DOMContentLoaded", function() {
    const closeBtn = document.getElementById("closeBtn");

    if (performance.navigation.type === 1) {
        window.location.href = "index.html";
    }

    function closePopup() {
        window.location.href = "index.html"; 
    }

    closeBtn.addEventListener("click", function() {
        closePopup(); 
    });
});
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, ref, set, onValue} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCbPjQqY5T2tWqXeDx_CJNB55DqC_9rFe8",
  authDomain: "receiptdb-2ee46.firebaseapp.com",
  databaseURL: "https://receiptdb-2ee46-default-rtdb.firebaseio.com",
  projectId: "receiptdb-2ee46",
  storageBucket: "receiptdb-2ee46.appspot.com",
  messagingSenderId: "1081206126953",
  appId: "1:1081206126953:web:31fc48507e771fb8d0e5f8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();

function checkTeacherRegistration(facultyNumber) {
    const registeredTeacherRef = ref(db, "Registered Teacher");
    return new Promise((resolve, reject) => {
        onValue(registeredTeacherRef, (snapshot) => {
            const registeredTeachers = snapshot.val();
            if (registeredTeachers && registeredTeachers[facultyNumber]) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

var password, facultyNo, fullName, department, email;

function initializeFormElements() {
    facultyNo = document.getElementById("facultyIdNumber");
    fullName = document.getElementById("fullName");
    department = document.getElementById("department");
    email = document.getElementById("email");
    password = document.getElementById("password");
}
initializeFormElements()


function sanitizeKey(key) {
    return key.replace(/[.#$[\]/]/g, "_");
}

function insertNewStudent() {
    const now = new Date();
    const utcOffset = 8;
    const localTime = new Date(now.getTime() + (utcOffset * 60 * 60 * 1000));
    const timestamp = localTime.toISOString();

    const trimmedFacultyNo = sanitizeKey(facultyNo.value).trim();
    const trimmedFullName = sanitizeKey(fullName.value).trim();
    const trimmedDepartment = sanitizeKey(department.value).trim();
    const trimmedEmail = email.value.trim();
    const trimmedPassword = sanitizeKey(password.value).trim();

    set(ref(db, "Registered Teacher/" + trimmedFacultyNo), {
        FullName: trimmedFullName,
        Department: trimmedDepartment,
        Email: trimmedEmail,
        Password: trimmedPassword,
        Timestamp: timestamp
    })
    .then(() => {
        alert("Registration successful! You're all set to make payments now.");
        window.location.href = "index.html"; 
    })
    .catch((error) => {
        alert("Unsuccessful, error " + error);
        window.location.href = "index.html"; 
    });
}
document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault();
    if (!validateForm()) {
        alert("Please fill in all required fields.");
        return;
    }

    document.getElementById("verifyFacultyNo").innerText = document.getElementById("facultyIdNumber").value;
    document.getElementById("verifyFullName").innerText = document.getElementById("fullName").value;
    document.getElementById("verifyDepartment").innerText = document.getElementById("department").value;
    document.getElementById("verifyEmail").innerText = document.getElementById("email").value;
    document.getElementById("verifyPassword").innerText = document.getElementById("password").value;

    document.getElementById("verifyPopup").style.visibility = "visible";
    document.getElementById("registrationForm").style.visibility = "hidden";
});

document.getElementById("confirmSubmitButton").addEventListener("click", function() {
    if (!validateForm()) {
        alert("Please fill in all required fields.");
        return;
    }

    const studentNumber = document.getElementById("facultyIdNumber").value;

    checkTeacherRegistration(studentNumber)
        .then((isRegistered) => {
            if (isRegistered) {
                alert("The teacher is already registered.");
                window.location.href = "index.html"; 
            } else {
                insertNewStudent();
                document.getElementById("verifyPopup").style.visibility = "hidden";
                document.getElementById("registrationForm").reset();
            }
        })
        .catch((error) => {
            console.error("Error checking student registration:", error);
            alert("An error occurred while checking student registration.");
        });
});


document.getElementById("cancelSubmitButton").addEventListener("click", function() {
    document.getElementById("verifyPopup").style.visibility = "hidden";
    document.getElementById("registrationForm").style.visibility = "visible"; 
});


function validateForm() {
    const facultyNumber = document.getElementById("facultyIdNumber").value.trim();
    const fullName = document.getElementById("fullName").value.trim();
    const department = document.getElementById("department").value.trim();
    const email = document.getElementById("email").value.trim();

    return facultyNumber !== '' && fullName !== '' && department !== '' && email !== '';
}