let display = document.getElementById("display");
let history = [];

// Backend API URL
const API_URL = "http://localhost:8080/api/calculations";


// =====================================================
// RESULT FORMAT
// =====================================================

function formatResult(result) {
    return Number(result.toFixed(10));
}


// =====================================================
// BASIC CALCULATOR
// =====================================================

function addValue(value) {
    display.value += value;
}


function clearDisplay() {
    display.value = "";
}


function allClear() {

    display.value = "0";

    // Clear frontend history
    history = [];
    document.getElementById("historyList").innerHTML = "";

    // Clear memory
    memory = 0;
    updateMemoryStatus();

    // Reset angle mode
    angleMode = "DEG";
    document.getElementById("angleMode").textContent = "DEG";

    // Clear history from database
    deleteHistoryFromBackend();
}


function deleteLast() {
    display.value = display.value.slice(0, -1);
}


// =====================================================
// BASIC CALCULATION
// =====================================================

function calculate() {

    try {

        let expression = display.value;

        if (expression === "") {
            display.value = "Enter something";
            return;
        }

        if (expression.includes("/0")) {
            display.value = "Cannot divide by zero";
            return;
        }

        let result = eval(expression);

        if (!isFinite(result)) {
            display.value = "Invalid calculation";
            return;
        }

        result = formatResult(result);

        // Add to frontend history
        history.push({
            expression: expression,
            result: result,
            id: null
        });

        // Show result
        display.value = result;

        // Show history
        showHistory();

        // Save calculation to backend
        saveCalculationToBackend(
            expression,
            result,
            "basic",
            angleMode
        );

    } catch {

        display.value = "Invalid calculation";
    }
}


// =====================================================
// SHOW HISTORY
// =====================================================

function showHistory() {

    let historyList =
        document.getElementById("historyList");

    historyList.innerHTML = "";

    history.forEach(function(item, index) {

        // Main history container
        let historyItem =
            document.createElement("div");

        historyItem.className = "history-item";


        // Calculation text
        let historyText =
            document.createElement("span");

        historyText.textContent =
            item.expression + " = " + item.result;


        // Clicking calculation puts result on display
        historyText.onclick = function() {

            display.value = item.result;

        };


        // Delete button
        let deleteButton =
            document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.className = "history-delete";


        deleteButton.onclick = function(event) {

            // Stop the history item click event
            event.stopPropagation();

            deleteSingleHistory(item, index);

        };


        // Add text and button
        historyItem.appendChild(historyText);
        historyItem.appendChild(deleteButton);

        historyList.appendChild(historyItem);

    });
}


// =====================================================
// SCIENTIFIC HISTORY
// =====================================================

function addScientificHistory(expression, result) {

    result = formatResult(result);

    // Add to frontend history
    history.push({
        expression: expression,
        result: result,
        id: null
    });

    // Show history
    showHistory();

    // Save to backend
    saveCalculationToBackend(
        expression,
        result,
        "scientific",
        angleMode
    );
}


// =====================================================
// CLEAR HISTORY
// =====================================================

function clearHistory() {

    // Clear frontend history
    history = [];

    document.getElementById("historyList").innerHTML = "";

    // Clear database history
    deleteHistoryFromBackend();
}


// =====================================================
// KEYBOARD SUPPORT
// =====================================================

document.addEventListener("keydown", function(event) {

    let key = event.key;

    if (
        (key >= "0" && key <= "9") ||
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/" ||
        key === "%" ||
        key === "."
    ) {
        addValue(key);
    }

    if (key === "Enter") {
        calculate();
    }

    if (key === "Backspace") {
        deleteLast();
    }

    if (key === "Escape") {
        clearDisplay();
    }

});


// =====================================================
// THEME
// =====================================================

function toggleTheme() {

    document.body.classList.toggle("light-theme");

    let button =
        document.getElementById("themeButton");

    if (
        document.body.classList.contains("light-theme")
    ) {

        button.textContent = "☀️";

    } else {

        button.textContent = "🌙";
    }
}


// =====================================================
// SOUND
// =====================================================

let soundEnabled = true;


function playClickSound() {

    if (!soundEnabled) return;

    let audio = new AudioContext();

    let oscillator =
        audio.createOscillator();

    let gain =
        audio.createGain();

    oscillator.connect(gain);

    gain.connect(audio.destination);

    oscillator.frequency.value = 500;

    gain.gain.value = 0.05;

    oscillator.start();

    oscillator.stop(
        audio.currentTime + 0.05
    );
}


function toggleSound() {

    let button =
        document.getElementById("soundButton");

    if (soundEnabled) {

        soundEnabled = false;

        button.textContent = "🔇";

    } else {

        soundEnabled = true;

        button.textContent = "🔊";
    }
}


document.querySelectorAll("button").forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                playClickSound();

            }
        );

    }
);


// =====================================================
// ANGLE MODE
// =====================================================

let angleMode = "DEG";


function toggleAngleMode() {

    let button =
        document.getElementById("angleMode");

    if (angleMode === "DEG") {

        angleMode = "RAD";

        button.textContent = "RAD";

    } else {

        angleMode = "DEG";

        button.textContent = "DEG";
    }
}


// =====================================================
// SQUARE ROOT
// =====================================================

function squareRoot() {

    let number =
        parseFloat(display.value);

    if (isNaN(number) || number < 0) {

        display.value = "Invalid input";

        return;
    }

    let result =
        Math.sqrt(number);

    result =
        formatResult(result);

    addScientificHistory(
        "√" + number,
        result
    );

    display.value = result;
}


// =====================================================
// SQUARE
// =====================================================

function square() {

    let number =
        parseFloat(display.value);

    if (isNaN(number)) {

        display.value = "Invalid input";

        return;
    }

    let result =
        number * number;

    result =
        formatResult(result);

    addScientificHistory(
        number + "²",
        result
    );

    display.value = result;
}


// =====================================================
// SIN
// =====================================================

function sinValue() {

    let number =
        parseFloat(display.value);

    if (isNaN(number)) {

        display.value = "Invalid input";

        return;
    }

    let radians;

    if (angleMode === "DEG") {

        radians =
            number * Math.PI / 180;

    } else {

        radians = number;
    }

    let result =
        Math.sin(radians);

    result =
        formatResult(result);

    addScientificHistory(
        "sin(" + number + ") [" + angleMode + "]",
        result
    );

    display.value = result;
}


// =====================================================
// COS
// =====================================================

function cosValue() {

    let number =
        parseFloat(display.value);

    if (isNaN(number)) {

        display.value = "Invalid input";

        return;
    }

    let radians;

    if (angleMode === "DEG") {

        radians =
            number * Math.PI / 180;

    } else {

        radians = number;
    }

    let result =
        Math.cos(radians);

    result =
        formatResult(result);

    addScientificHistory(
        "cos(" + number + ") [" + angleMode + "]",
        result
    );

    display.value = result;
}


// =====================================================
// TAN
// =====================================================

function tanValue() {

    let number =
        parseFloat(display.value);

    if (isNaN(number)) {

        display.value = "Invalid input";

        return;
    }

    let radians;

    if (angleMode === "DEG") {

        radians =
            number * Math.PI / 180;

    } else {

        radians = number;
    }

    let result =
        Math.tan(radians);

    result =
        formatResult(result);

    addScientificHistory(
        "tan(" + number + ") [" + angleMode + "]",
        result
    );

    display.value = result;
}


// =====================================================
// MEMORY
// =====================================================

let memory = 0;


function updateMemoryStatus() {

    let memoryStatus =
        document.getElementById("memoryStatus");

    memoryStatus.textContent =
        "Memory: " + memory;
}


function memoryAdd() {

    let number =
        parseFloat(display.value);

    if (isNaN(number)) return;

    memory =
        memory + number;

    updateMemoryStatus();
}


function memorySubtract() {

    let number =
        parseFloat(display.value);

    if (isNaN(number)) return;

    memory =
        memory - number;

    updateMemoryStatus();
}


function memoryRecall() {

    display.value = memory;
}


function memoryClear() {

    memory = 0;

    updateMemoryStatus();
}


// =====================================================
// BACKEND INTEGRATION
// =====================================================


// =====================================================
// SAVE CALCULATION TO BACKEND
// =====================================================

async function saveCalculationToBackend(
    expression,
    result,
    operationType,
    angleMode
) {

    try {

        const calculation = {

            expression: expression,

            result: String(result),

            operationType: operationType,

            angleMode: angleMode

        };


        const response =
            await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body:
                    JSON.stringify(calculation)

            });


        if (!response.ok) {

            throw new Error(
                "Failed to save calculation"
            );
        }


        const savedCalculation =
            await response.json();


        console.log(
            "Calculation saved to backend:",
            savedCalculation
        );


        // Update the latest history item's ID
        if (history.length > 0) {

            history[history.length - 1].id =
                savedCalculation.id;

            showHistory();
        }


    } catch (error) {

        console.error(
            "Backend save error:",
            error
        );

    }
}


// =====================================================
// LOAD HISTORY FROM BACKEND
// =====================================================

async function loadHistoryFromBackend() {

    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Failed to load history"
            );
        }


        const data =
            await response.json();


        // Store complete backend objects
        history =
            data.map(function(calculation) {

                return {

                    expression:
                        calculation.expression,

                    result:
                        calculation.result,

                    id:
                        calculation.id

                };

            });


        // Display history
        showHistory();


        console.log(
            "History loaded from backend:",
            data
        );


    } catch (error) {

        console.error(
            "Backend load error:",
            error
        );

    }
}


// =====================================================
// DELETE ONE CALCULATION FROM BACKEND
// =====================================================

async function deleteSingleHistory(item, index) {

    // If ID is not available
    if (item.id === null) {

        history.splice(index, 1);

        showHistory();

        return;
    }


    try {

        const response =
            await fetch(
                API_URL + "/" + item.id,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to delete calculation"
            );
        }


        // Remove from frontend history
        history.splice(index, 1);

        // Refresh history display
        showHistory();


        console.log(
            "Calculation deleted successfully:",
            item.id
        );


    } catch (error) {

        console.error(
            "Delete calculation error:",
            error
        );

    }
}


// =====================================================
// DELETE ALL HISTORY FROM BACKEND
// =====================================================

async function deleteHistoryFromBackend() {

    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to delete history"
            );
        }


        console.log(
            "Backend history deleted successfully"
        );


    } catch (error) {

        console.error(
            "Backend delete error:",
            error
        );

    }
}


// =====================================================
// LOAD DATABASE HISTORY WHEN PAGE OPENS
// =====================================================

loadHistoryFromBackend();