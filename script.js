// ========================================
// Firebase App
// ========================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";


// ========================================
// Firebase Authentication
// ========================================

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


// ========================================
// Firebase Firestore
// ========================================

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    serverTimestamp,
    query,
    orderBy,
    doc,
    getDoc,
    setDoc,
    increment
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// ========================================
// jsPDF
// ========================================

import {
    jsPDF
} from "https://cdn.jsdelivr.net/npm/jspdf@3.0.3/+esm";


// ========================================
// Firebase Configuration
// ========================================

const firebaseConfig = {

    apiKey: "AIzaSyDEq_mL8QJI0jqQ2nJsoK0gOrGynAsBQoo",

    authDomain:
        "teacher-s-day-2026-832d1.firebaseapp.com",

    projectId:
        "teacher-s-day-2026-832d1",

    storageBucket:
        "teacher-s-day-2026-832d1.firebasestorage.app",

    messagingSenderId:
        "597910122171",

    appId:
        "1:597910122171:web:87a35bcb93ecaef707039e"

};


// ========================================
// Initialize Firebase
// ========================================

const app =
    initializeApp(firebaseConfig);


// ========================================
// Firebase Services
// ========================================

const auth =
    getAuth(app);

const db =
    getFirestore(app);


// ========================================
// Payment Data
// ========================================

let payments = [];


// ========================================
// HTML Elements
// ========================================

const adminLoginBtn =
    document.getElementById("adminLoginBtn");

const loginBox =
    document.getElementById("loginBox");

const adminEmail =
    document.getElementById("adminEmail");

const adminPassword =
    document.getElementById("adminPassword");

const loginBtn =
    document.getElementById("loginBtn");

const closeLoginBtn =
    document.getElementById("closeLoginBtn");

const loginMessage =
    document.getElementById("loginMessage");

const adminDashboard =
    document.getElementById("adminDashboard");

const logoutBtn =
    document.getElementById("logoutBtn");

const studentName =
    document.getElementById("studentName");

const studentAmount =
    document.getElementById("studentAmount");

const savePaymentBtn =
    document.getElementById("savePaymentBtn");

const saveMessage =
    document.getElementById("saveMessage");

const searchBox =
    document.getElementById("searchBox");

const paymentList =
    document.getElementById("paymentList");

const studentsPaid =
    document.getElementById("studentsPaid");

const totalAmount =
    document.getElementById("totalAmount");

const downloadPdfBtn =
    document.getElementById("downloadPdfBtn");


// ========================================
// Countdown & Visitor Elements
// ========================================

const countdown =
    document.getElementById("countdown");

const visitorCount =
    document.getElementById("visitorCount");


// ========================================
// Display Payments
// ========================================

function displayPayments(data) {

    paymentList.innerHTML = "";


    if (data.length === 0) {

        paymentList.innerHTML = `
            <tr>
                <td colspan="4">
                    No payment records found.
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(function (payment, index) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${index + 1}</td>

            <td>${payment.name}</td>

            <td>₹${payment.amount}</td>

            <td>
                ${payment.date}, ${payment.time}
            </td>
        `;


        paymentList.appendChild(row);

    });

}


// ========================================
// Update Summary
// ========================================

function updateSummary() {

    studentsPaid.textContent =
        payments.length;


    const total =
        payments.reduce(
            function (sum, payment) {

                return sum +
                    Number(payment.amount);

            },
            0
        );


    totalAmount.textContent =
        total.toLocaleString("en-IN");

}


// ========================================
// Format Firestore Timestamp
// ========================================

function formatDateTime(timestamp) {

    if (!timestamp) {

        return {
            date: "—",
            time: "—"
        };

    }


    const dateObject =
        timestamp.toDate();


    const date =
        dateObject.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );


    const time =
        dateObject.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    return {
        date: date,
        time: time
    };

}


// ========================================
// Load Payments from Firestore
// ========================================

async function loadPayments() {

    try {

        const paymentsRef =
            collection(
                db,
                "payments"
            );


        const paymentsQuery =
            query(
                paymentsRef,
                orderBy(
                    "createdAt",
                    "asc"
                )
            );


        const snapshot =
            await getDocs(
                paymentsQuery
            );


        payments = [];


        snapshot.forEach(
            function (docSnapshot) {

                const data =
                    docSnapshot.data();


                const dateTime =
                    formatDateTime(
                        data.createdAt
                    );


                payments.push({

                    id:
                        docSnapshot.id,

                    name:
                        data.name,

                    amount:
                        data.amount,

                    date:
                        dateTime.date,

                    time:
                        dateTime.time

                });

            }
        );


        displayPayments(
            payments
        );


        updateSummary();


        console.log(
            "Payments loaded successfully."
        );

    }

    catch (error) {

        console.error(
            "Firestore Load Error:",
            error
        );


        paymentList.innerHTML = `
            <tr>
                <td colspan="4">
                    Unable to load payment records.
                </td>
            </tr>
        `;

    }

}


// ========================================
// Load Payments for Everyone
// ========================================

loadPayments();


// ========================================
// Search Payments
// ========================================

searchBox.addEventListener(
    "input",
    function () {

        const searchText =
            searchBox.value
                .toLowerCase()
                .trim();


        const filteredPayments =
            payments.filter(
                function (payment) {

                    return payment.name
                        .toLowerCase()
                        .includes(searchText);

                }
            );


        displayPayments(
            filteredPayments
        );

    }
);


// ========================================
// Open Login Popup
// ========================================

adminLoginBtn.addEventListener(
    "click",
    function () {

        loginBox.style.display =
            "flex";


        loginMessage.textContent =
            "";


        adminEmail.focus();

    }
);


// ========================================
// Close Login Popup
// ========================================

closeLoginBtn.addEventListener(
    "click",
    function () {

        loginBox.style.display =
            "none";

    }
);


// ========================================
// Close Popup by Background
// ========================================

loginBox.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            loginBox
        ) {

            loginBox.style.display =
                "none";

        }

    }
);


// ========================================
// Admin Login
// ========================================

loginBtn.addEventListener(
    "click",
    async function () {

        const email =
            adminEmail.value.trim();


        const password =
            adminPassword.value;


        if (!email || !password) {

            loginMessage.textContent =
                "Please enter email and password.";

            return;

        }


        loginBtn.disabled =
            true;


        loginBtn.textContent =
            "Logging in...";


        loginMessage.textContent =
            "";


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            loginMessage.textContent =
                "Login successful!";

        }

        catch (error) {

            console.error(
                "Login Error:",
                error
            );


            if (
                error.code ===
                    "auth/invalid-credential" ||

                error.code ===
                    "auth/wrong-password" ||

                error.code ===
                    "auth/user-not-found"
            ) {

                loginMessage.textContent =
                    "Invalid email or password.";

            }

            else {

                loginMessage.textContent =
                    "Login failed. Please try again.";

            }

        }


        loginBtn.disabled =
            false;


        loginBtn.textContent =
            "Login";

    }
);


// ========================================
// Firebase Authentication State
// ========================================

onAuthStateChanged(
    auth,
    function (user) {

        if (user) {

            console.log(
                "Admin logged in:",
                user.email
            );


            loginBox.style.display =
                "none";


            adminDashboard.style.display =
                "block";


            adminLoginBtn.textContent =
                "✅ Admin Logged In";


            adminLoginBtn.disabled =
                true;

        }

        else {

            console.log(
                "No admin logged in."
            );


            adminDashboard.style.display =
                "none";


            adminLoginBtn.textContent =
                "🔐 Admin Login";


            adminLoginBtn.disabled =
                false;

        }

    }
);


// ========================================
// Logout
// ========================================

logoutBtn.addEventListener(
    "click",
    async function () {

        try {

            await signOut(auth);

        }

        catch (error) {

            console.error(
                "Logout Error:",
                error
            );

        }

    }
);


// ========================================
// Save Payment to Firestore
// ========================================

savePaymentBtn.addEventListener(
    "click",
    async function () {

        const name =
            studentName.value.trim();


        const amount =
            Number(
                studentAmount.value
            );


        if (!name) {

            saveMessage.textContent =
                "Please enter student name.";

            return;

        }


        if (!amount || amount <= 0) {

            saveMessage.textContent =
                "Please enter a valid amount.";

            return;

        }


        savePaymentBtn.disabled =
            true;


        savePaymentBtn.textContent =
            "Saving...";


        saveMessage.textContent =
            "";


        try {

            const paymentsRef =
                collection(
                    db,
                    "payments"
                );


            await addDoc(
                paymentsRef,
                {

                    name:
                        name,

                    amount:
                        amount,

                    createdAt:
                        serverTimestamp()

                }
            );


            studentName.value =
                "";

            studentAmount.value =
                "";


            saveMessage.textContent =
                "✅ Payment saved successfully.";


            await loadPayments();

        }

        catch (error) {

            console.error(
                "Firestore Save Error:",
                error
            );


            saveMessage.textContent =
                "❌ Payment save failed.";

        }


        savePaymentBtn.disabled =
            false;


        savePaymentBtn.textContent =
            "💾 Save Payment";

    }
);


// ========================================
// Teacher's Day Countdown
// ========================================

function updateCountdown() {

    if (!countdown) {
        return;
    }


    const eventDate =
        new Date(
            "September 5, 2026 00:00:00"
        ).getTime();


    const now =
        new Date().getTime();


    const difference =
        eventDate - now;


    if (difference <= 0) {

        countdown.textContent =
            "🎉 Happy Teacher's Day!";

        return;
    }


    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (difference %
                (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );


    const minutes =
        Math.floor(
            (difference %
                (1000 * 60 * 60)) /
            (1000 * 60)
        );


    const seconds =
        Math.floor(
            (difference %
                (1000 * 60)) /
            1000
        );


    countdown.textContent =
        `${days}d ${hours}h ${minutes}m ${seconds}s`;

}


updateCountdown();


setInterval(
    updateCountdown,
    1000
);


// ========================================
// Visitor Counter
// ========================================

async function loadVisitorCount() {

    if (!visitorCount) {
        return;
    }


    try {

        const visitorRef =
            doc(
                db,
                "siteStats",
                "visitors"
            );


        const alreadyCounted =
            localStorage.getItem(
                "teacherDayVisitorCounted"
            );


        // --------------------------------
        // First Visit
        // --------------------------------

        if (!alreadyCounted) {

            await setDoc(
                visitorRef,
                {
                    count:
                        increment(1)
                },
                {
                    merge: true
                }
            );


            localStorage.setItem(
                "teacherDayVisitorCounted",
                "true"
            );

        }


        // --------------------------------
        // Get Current Count
        // --------------------------------

        const snapshot =
            await getDoc(
                visitorRef
            );


        if (snapshot.exists()) {

            const data =
                snapshot.data();


            const count =
                Number(
                    data.count || 0
                );


            visitorCount.textContent =
                count.toLocaleString("en-IN");

        }

        else {

            visitorCount.textContent =
                "0";

        }

    }

    catch (error) {

        console.error(
            "Visitor Counter Error:",
            error
        );


        visitorCount.textContent =
            "—";

    }

}


loadVisitorCount();


// ========================================
// Download Payment List as PDF
// ========================================

downloadPdfBtn.addEventListener(
    "click",
    function () {

        if (payments.length === 0) {

            alert(
                "There are no payment records to download."
            );

            return;
        }


        const pdf =
            new jsPDF();


        pdf.setFontSize(18);

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.text(
            "Teacher's Day 2026",
            14,
            20
        );


        pdf.setFontSize(11);

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.text(
            "Class Contribution Payment List",
            14,
            28
        );


        pdf.text(
            "SUK | Science Faculty",
            14,
            35
        );


        pdf.setFontSize(10);

        pdf.text(
            "Students Paid: " +
            payments.length,
            14,
            45
        );


        const total =
            payments.reduce(
                function (sum, payment) {

                    return sum +
                        Number(payment.amount);

                },
                0
            );


        pdf.text(
            "Total Collected: Rs. " +
            total,
            80,
            45
        );


        pdf.text(
            "Event Date: 5 September 2026",
            145,
            45
        );


        let y = 58;


        pdf.setFont(
            "helvetica",
            "bold"
        );


        pdf.setFillColor(
            245,
            246,
            248
        );


        pdf.rect(
            14,
            y - 6,
            182,
            9,
            "F"
        );


        pdf.text(
            "#",
            17,
            y
        );


        pdf.text(
            "Student Name",
            30,
            y
        );


        pdf.text(
            "Amount",
            125,
            y
        );


        pdf.text(
            "Date & Time",
            150,
            y
        );


        pdf.setFont(
            "helvetica",
            "normal"
        );


        y += 9;


        payments.forEach(
            function (payment, index) {

                if (y > 280) {

                    pdf.addPage();

                    y = 20;


                    pdf.setFont(
                        "helvetica",
                        "bold"
                    );


                    pdf.text(
                        "Teacher's Day 2026 - Payment List",
                        14,
                        y
                    );


                    y += 10;


                    pdf.setFont(
                        "helvetica",
                        "normal"
                    );

                }


                pdf.text(
                    String(index + 1),
                    17,
                    y
                );


                pdf.text(
                    String(payment.name),
                    30,
                    y
                );


                pdf.text(
                    "Rs. " +
                    String(payment.amount),
                    125,
                    y
                );


                pdf.text(
                    String(payment.date) +
                    " " +
                    String(payment.time),
                    150,
                    y
                );


                pdf.setDrawColor(
                    230,
                    230,
                    230
                );


                pdf.line(
                    14,
                    y + 3,
                    196,
                    y + 3
                );


                y += 9;

            }
        );


        pdf.setFontSize(9);

        pdf.setTextColor(
            100,
            100,
            100
        );


        pdf.text(
            "Science Faculty | Teacher's Day Contribution Management 2026 | SURAJ KUMAR",
            14,
            290
        );


        pdf.save(
            "Teacher_Day_2026_Payment_List.pdf"
        );

    }
);


// ========================================
// Enter Key Login
// ========================================

adminPassword.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            loginBtn.click();

        }

    }
);
