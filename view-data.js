/* Copyright 2025 © EZR Consulting. All rights reserved. */

let selectedFileNames = [];
let rowCategoriesMap = {};
let extractedStrings = [];
let allDataRows = [];
let isNewBatch = true;
let headerAdded = false;
let rowCounter = 1;
// Define column order globally
const columnOrder = ['5', '22', '34', '15', '3', '24', '36', '13', '1', '37', '27', '10', '25', '29', '12', '8', '19', '31', '18', '17', '32', '20', '7', '11', '30', '26', '9', '28', '0', '2', '14', '35', '23', '4', '16', '33', '21', '6'];


    
       	// Event listener for the Simulator button
    	document.getElementById('simButton').addEventListener('click', () => {
        window.open('roulette.html', '_blank');
      });
      
        // New event listener for the View Data button
      	document.getElementById('viewDataButton').addEventListener('click', () => {
        window.open('view-data.html', '_blank');
      });
      
        // New event listener for the View P-Value button
      	document.getElementById('viewPValueButton').addEventListener('click', () => {
        window.open('pvalues.html', '_blank');
      });
      
        // New event listener for the View P-Value button
      	document.getElementById('viewFreqDistButton').addEventListener('click', () => {
        window.open('xfreq.html', '_blank');
      });
       // New event listener for the View Stats button
      	document.getElementById('viewStatsButton').addEventListener('click', () => {
        window.open('view-stats.html', '_blank');
      });

       	// Event listener for the Simulator button
    	document.getElementById('singleSpinButton').addEventListener('click', () => {
        window.open('new-wheel.html', '_blank');
      });
        document.getElementById("densityButton").addEventListener("click", () => { 
        window.open("sort.html", "_blank"); 
      });
          

    
           // Function to generate a formatted timestamp // 
function getFormattedTimestamp() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            return `${year}${month}${day}_${hours}_${minutes}_${seconds}`;
        }
        
              // Function to get color for a style
function getColorForStyle(style) {
            const colorMap = {
                'default-light-yellow': [255, 255, 224],
                'lightcoral': [255, 204, 204],
                'light-blue': [173, 216, 230],
                'light-orange': [255, 165, 0],
                'violet': [238, 130, 238],
                'DarkKhaki': [189, 183, 107],
                'DarkSeaGreen': [143, 188, 143],
                'LightSteelBlue': [176, 196, 222],
                'light-green': [144, 238, 144],
                'Thistle': [216, 191, 216],
                'GreenYellow': [173, 255, 47],
                'Gold': [255, 215, 0],
            };

            return colorMap[style] || [255, 255, 255]; // Default to white if style is not found
        }
    

function clearTable() {
    document.querySelector('#csvTable thead').innerHTML = '';
    document.querySelector('#csvTable tbody').innerHTML = '';
    headerAdded = false;
    rowCounter = 1;
}

function createHeaderRow() {
    if (!headerAdded) {
        const redColumns = ['5', '34', '3', '36', '1', '27', '25', '12', '19', '18', '32', '7', '30', '9', '14', '23', '16', '21'];
        const blackColumns = ['22', '15', '24', '13', '37', '10', '29', '8', '31', '6', '17', '20', '11', '26', '28', '2', '35', '4', '33'];
        const columnOrder = ['5', '22', '34', '15', '3', '24', '36', '13', '1', '37', '27', '10', '25', '29', '12', '8', '19', '31', '18', '17', '32', '20', '7', '11', '30', '26', '9', '28', '0', '2', '14', '35', '23', '4', '16', '33', '21', '6'];
        const thead = document.getElementById('csvTable').querySelector('thead');
        const tr = document.createElement('tr');

        const thLineNumber = document.createElement('th');
        thLineNumber.textContent = '#';
        thLineNumber.style.backgroundColor = 'slategray';
        thLineNumber.style.color = 'white';
        tr.appendChild(thLineNumber);

        columnOrder.forEach((col) => {
            const th = document.createElement('th');
            th.textContent = (col === '37') ? '00' : col;  // ✅ Change 37 to "00"
            if (col === '0' || col === '37') {
                th.style.backgroundColor = 'green';
                th.style.color = 'white';
            } else if (redColumns.includes(col)) {
                th.style.backgroundColor = 'red';
                th.style.color = 'white';
            } else if (blackColumns.includes(col)) {
                th.style.backgroundColor = 'black';
                th.style.color = 'white';
            } else {
                th.style.backgroundColor = 'lightgray';
                th.style.color = 'black';
            }
            tr.appendChild(th);
        });

        thead.appendChild(tr);
        headerAdded = true;
    }
}

const group1Columns = ['14', '2', '0', '28', '9'];
const group2Columns = ['13', '1', '37', '27', '10'];

function displayExtractedStrings() {
    let outputDiv = document.getElementById("extractedStringsOutput");
    if (!outputDiv) {
        outputDiv = document.createElement("div");
        outputDiv.id = "extractedStringsOutput";
        document.body.appendChild(outputDiv);
    }

    outputDiv.innerHTML = "<h2>Tasks:</h2>";
    const ul = document.createElement("ul");

    // ✅ Loop through stored task codes & categories
    Object.entries(rowCategoriesMap).forEach(([rowNum, data]) => {
        if (data.taskCode !== "NT" || data.categories.length > 0) {  
            const li = document.createElement("li");
            li.textContent = `Row ${rowNum}:  Task: ${data.taskCode}  |  Significance: ${data.categories.join(", ")}`;
            ul.appendChild(li);
        }
    });

    outputDiv.appendChild(ul);

    console.log("✅ Updated Tasks Section:", rowCategoriesMap);
}

function displayFilenames() {
    let fileOutputDiv = document.getElementById("selectedFilesOutput");
    if (!fileOutputDiv) {
        fileOutputDiv = document.createElement("div");
        fileOutputDiv.id = "selectedFilesOutput";
        document.body.appendChild(fileOutputDiv);
    }
    fileOutputDiv.innerHTML = "<h2>Selected Files:</h2>";
    const ul = document.createElement("ul");
    selectedFileNames.forEach(fileName => {
        const li = document.createElement("li");
        li.textContent = fileName;
        ul.appendChild(li);
    });
    fileOutputDiv.appendChild(ul);
}

document.getElementById("fileInput").addEventListener("change", function (event) {
    isNewBatch = true;
    clearTable();
    rowCategoriesMap = {};

    let files = Array.from(event.target.files).filter(file => file.name.endsWith(".csv"));

    // ✅ Sort files by extracted timestamp before processing
    files.sort((a, b) => extractTimestamp(a.name) - extractTimestamp(b.name));

    console.log("✅ Corrected Sorted File Order:", files.map(f => f.name));

    selectedFileNames = files.map(f => f.name);
    
    // ✅ Process files sequentially after sorting
    let fileIndex = 0;

    function readNextFile() {
        if (fileIndex >= files.length) {
            console.log("✅ All files processed in correct order!");
            return;
        }

        const file = files[fileIndex];
        const reader = new FileReader();

        reader.onload = async function (e) {
            console.log(`📂 Processing file: ${file.name}`);
            const fileContent = e.target.result;

            // ✅ Extract last 5 characters from filename (before .csv)
            const last5FromFile = file.name.replace(".csv", "").slice(-5);

            // ✅ Allow hash values in the range 00000 to 00200 to bypass checksum validation
            const isBypass = /^[0-9]{5}$/.test(last5FromFile) && parseInt(last5FromFile, 10) <= 200;

            if (!isBypass) {
                // ✅ Compute checksum of file content
                const computedChecksum = await generateChecksum(fileContent);

                // ✅ Extract the last 5-character hash from the second half of computed checksum
                const obfuscatedComputedChecksum = getObfuscatedChecksum(computedChecksum);

                if (last5FromFile !== obfuscatedComputedChecksum) {
                    console.log(`❌ Filename hash mismatch for ${file.name}`);
                    console.log(`Expected: ${last5FromFile}`);
                    console.log(`Computed: ${obfuscatedComputedChecksum}`);
                    alert(`It appears that "${file.name}" has been edited. Aborting.`);
                    location.reload(); // Refresh page to reset state
                    return;
                }
            } else {
                console.log(`⚠️ Checksum bypass for ${file.name} due to allowed numeric code`);
            }

            // ✅ If checksum is valid or bypassed, proceed
            displayCSVData(fileContent, fileIndex === 0);
            fileIndex++;  // ✅ Move to the next file
            readNextFile();  // ✅ Process next file sequentially
        };

        reader.readAsText(file);
    }

    readNextFile();  // ✅ Start processing first file
});


/**
 * ✅ Extracts a sortable timestamp from the filename.
 * Assumes filename format: "Sim_TYPE_1_MMDDYY_HH_MM_SS_checksum.csv"
 * Example: "Sim_V_1_031525_09_22_58_c273a.csv"
 */
function extractTimestamp(filename) {
    const match = filename.match(/_(\d{6})_(\d{2})_(\d{2})_(\d{2})_/);
    if (!match) {
        console.warn(`⚠️ Timestamp not found in filename: ${filename}`);
        return 0; // If no match, treat as the oldest file
    }

    const [_, datePart, hour, minute, second] = match;
    const year = "20" + datePart.slice(4, 6); // Convert YY to YYYY (assumes 2000s)
    const month = datePart.slice(0, 2);
    const day = datePart.slice(2, 4);

    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`).getTime();
}



function createDataCell(cellValue) {
            const td = document.createElement('td');
            td.textContent = cellValue === '0' ? '' : cellValue;
            const numValue = Number(cellValue);
            if (numValue === 3) td.classList.add('DarkSeaGreen');
            else if (numValue === 4) td.classList.add('Gold');
            else if (numValue >= 5) td.classList.add('light-green');
            return td;
        }


function displayCSVData(csvText, isFirstFile) {
    if (isNewBatch) {
        extractedStrings = []; // ✅ Clear tasks at the beginning of a new batch
        isNewBatch = false;
    }

    let isTableData = true;
    const lines = csvText.split('\n').map(line => line.trim());

    if (lines.length <= 3) {
        console.warn("CSV file contains insufficient data.");
        return;
    }

    // ✅ Only remove first 4 lines if the filename starts with "Sim" or "SimX"
    const shouldSlice = selectedFileNames.some(fileName => fileName.startsWith("Sim") || fileName.startsWith("SimX"));
    const dataLines = shouldSlice ? lines.slice(3) : lines;

    const tbody = document.querySelector('#csvTable tbody');

    // ✅ Clear out any existing rows before inserting new ones
    tbody.innerHTML = '';

    let currentRowNumber = 1; // Start from 1 for this new batch

    const columnOrder = ['5', '22', '34', '15', '3', '24', '36', '13', '1', '37', '27', '10', '25', '29', '12', '8', '19', '31', '18', '17', '32', '20', '7', '11', '30', '26', '9', '28', '0', '2', '14', '35', '23', '4', '16', '33', '21', '6'];    
    const group1Columns = ['14', '2', '0', '28', '9'];
    const group2Columns = ['13', '1', '37', '27', '10'];

    const headerRow = dataLines[0].split(',');
    const headerIndices = columnOrder.map(col => headerRow.indexOf(col));

    if (isFirstFile && !headerAdded) {
        createHeaderRow(headerRow);
    }

    for (let i = 1; i < dataLines.length; i++) {
        let row = dataLines[i].split(',');

        if (isTableData) {
            if (row.length === 1 || row.every(cell => cell.trim() === "")) {
                isTableData = false;
                continue;
            }

            const tr = document.createElement('tr');

            const tdLineNumber = document.createElement('td');
            tdLineNumber.textContent = currentRowNumber;
            tdLineNumber.style.backgroundColor = 'slategray';
            tdLineNumber.style.color = 'white';
            tr.appendChild(tdLineNumber);

            let rowData = [currentRowNumber];
            let hasNumericData = false;
            let group1Sum = 0;
            let group2Sum = 0;
            let group1Cells = [];
            let group2Cells = [];

            headerIndices.forEach((index, j) => {
                const td = document.createElement('td');

                // ✅ Get raw value safely and trim it
                let rawValue = index >= 0 && row.length > index ? row[index].replace(/\uFEFF/g, '').trim() : '';

                // ✅ Check if it's truly a zero (even if it's "0 ", "0.0", etc.)
                const numValue = parseFloat(rawValue);
                const isNumeric = !isNaN(numValue);
                const isZero = isNumeric && numValue === 0;

                // ✅ Final value to display in the table
                const displayValue = isZero ? '' : rawValue;

                td.textContent = displayValue;

                // ✅ Only mark row as valid if there's meaningful numeric data
                if (isNumeric && !isZero) {
                    hasNumericData = true;

                    if (numValue === 3) td.classList.add('DarkSeaGreen');
                    else if (numValue === 4) td.classList.add('Gold');
                    else if (numValue >= 5) td.classList.add('light-green');
                }

                // ✅ Highlight group columns and calculate sums (including zero)
                if (group1Columns.includes(columnOrder[j])) {
                    td.classList.add('default-light-yellow');
                    group1Cells.push(td);
                    group1Sum += isNumeric ? numValue : 0;
                } else if (group2Columns.includes(columnOrder[j])) {
                    td.classList.add('default-light-yellow');
                    group2Cells.push(td);
                    group2Sum += isNumeric ? numValue : 0;
                }

                tr.appendChild(td);
                rowData.push(displayValue); // ✅ Store the visible value (blank for 0s)
            });

            applyGroupColoring(group1Cells, group1Sum);
            applyGroupColoring(group2Cells, group2Sum);

            if (hasNumericData) {
                tbody.appendChild(tr);
                allDataRows.push(rowData);
                currentRowNumber++;
            }
        } else {
            const taskText = dataLines[i].trim();
            if (taskText) {
                extractedStrings.push([taskText, currentRowNumber - 1]);
            }
        }
    }

    let rowCount = tbody.querySelectorAll('tr').length;
    document.getElementById('rowCount').innerHTML = `Runs: <span class="zero-highlight">${rowCount}</span>`;

    displayExtractedStrings();
}

/**
 * ✅ Ensure Table Rows Are Ordered to Match the Sorted Files
 */
function reorderTableRows() {
    const tbody = document.querySelector("#csvTable tbody");
    if (!tbody) return;

    let rows = Array.from(tbody.querySelectorAll("tr"));

    rows.sort((a, b) => {
        let rowNumA = parseInt(a.firstChild.textContent.trim(), 10);
        let rowNumB = parseInt(b.firstChild.textContent.trim(), 10);
        return rowNumA - rowNumB;
    });

    tbody.innerHTML = "";
    rows.forEach(row => tbody.appendChild(row));

    console.log("✅ Table Rows Reordered to Match File Order");
}

// Call after processing CSVs
setTimeout(reorderTableRows, 500); // Give time for rows to be created


// ✅ Function to generate SHA-256 checksum
async function generateChecksum(content) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(content));
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ✅ Extracts obfuscated checksum using same logic as in `exportTotalsToCSV`
function getObfuscatedChecksum(checksum) {
    const halfLength = Math.floor(checksum.length / 2);
    const secondHalf = checksum.slice(halfLength); // Extract second half
    return secondHalf.slice(0, 5).split("").reverse().join(""); // Reverse first 5 chars
}

// ✅ Validate checksum logic
async function validateChecksum(file) {
    const reader = new FileReader();
    reader.onload = async function(event) {
        const fileContent = event.target.result;
        const computedChecksum = await generateChecksum(fileContent);
        const obfuscatedComputedChecksum = getObfuscatedChecksum(computedChecksum);

        const filename = file.name;
        const extractedChecksum = filename.slice(-5);

        if (obfuscatedComputedChecksum === extractedChecksum) {
            console.log("✅ Checksum matches for", filename);
        } else {
            console.log("❌ Checksum mismatch! Expected:", extractedChecksum, "Computed:", obfuscatedComputedChecksum);

            // 🔴 Alert the user and abort execution
            alert(`It appears that "${filename}" has been edited. Aborting.`);
            location.reload(); // Refresh page to reset state
            return;
        }
    };
    reader.readAsText(file);
}


function applyGroupColoring(cells, sum) {
    const colorClasses = {
        8: 'lightcoral',
        9: 'light-blue',
        10: 'light-orange',
        11: 'violet',
        12: 'DarkKhaki',
        13: 'DarkSeaGreen',
        14: 'LightSteelBlue',
        15: 'Thistle',
        16: 'GreenYellow',
        17: 'Gold'
    };
    const colorClass = colorClasses[sum];
    if (colorClass) cells.forEach(td => td.classList.add(colorClass));
}



        // Event listener for clickable elements
        document.querySelectorAll('.info-item2.clickable').forEach(element => {
            element.addEventListener('click', function() {
                const dataType = element.getAttribute('data-type');
                const fileName = `OnServer_${dataType}.csv`;

                fetch(fileName)
                    .then(response => response.text())
                    .then(csvText => displayCSVData(csvText))
                    .catch(error => console.error('Error fetching the file:', error));
            });
        });

document.getElementById('saveButton').addEventListener('click', async function () { 
    const table = document.getElementById('csvTable');
    let csvContent = '';

    const rows = table.querySelectorAll('tr');
    const rowCount = rows.length - 1; // Exclude header row

    // ✅ Define the correct column order (38 columns)
    const columnOrder = ['5', '22', '34', '15', '3', '24', '36', '13', '1', '37', '27', '10', 
                         '25', '29', '12', '8', '19', '31', '18', '17', '32', '20', '7', '11', 
                         '30', '26', '9', '28', '0', '2', '14', '35', '23', '4', '16', '33', 
                         '21', '6'];

    // ✅ Add a header warning message
    csvContent += `THIS FILE IS GENERATED AUTOMATICALLY. DO NOT EDIT.\n`;
    csvContent += `LAST GENERATED ON: ${getFormattedTimestamp()}\n\n`;

    let maxCategoryColumns = 0;
    let allRowData = []; 

    // ✅ Count max category columns
    rows.forEach((row, rowIndex) => {
        if (rowIndex > 0) { // Skip header row
            const rowNum = parseInt(row.children[0]?.textContent.trim()) || 0;
            const categories = rowCategoriesMap[rowNum]?.categories || [];
            if (categories.length > maxCategoryColumns) {
                maxCategoryColumns = categories.length;
            }
        }
    });

    // ✅ Construct header row dynamically (col 40+ for categories)
    let categoryHeaders = Array.from({ length: maxCategoryColumns }, (_, i) => (40 + i).toString());
    let headerRow = [...columnOrder, "38", "39", ...categoryHeaders];

    csvContent += headerRow.join(',') + '\n';

    // ✅ Map column names from the table to their actual indices
    let columnMap = {}; 
    let tableHeaders = document.querySelectorAll('#csvTable thead th');

    tableHeaders.forEach((th, index) => {
        let colName = th.textContent.trim();
        if (colName === "00") colName = "37"; // ✅ Map "00" back to "37"
        columnMap[colName] = index; 
    });

    // ✅ Process each row (skip first header row)
    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return; // Skip header

        const cols = row.querySelectorAll('td');
        let rowData = [];

        // ✅ Get row number from the first column
        const rowNum = parseInt(cols[0]?.textContent.trim()) || 0;

        // ✅ Retrieve stored task code & categories
        const taskCode = rowCategoriesMap[rowNum]?.taskCode || "NT";  
        const categories = rowCategoriesMap[rowNum]?.categories || [];

        console.log(`✅ Exporting Row ${rowNum} | Task Code: ${taskCode} | Categories: `, categories);

        // ✅ Extract data from table following columnOrder
        rowData = columnOrder.map(colNum => {
            let actualIndex = columnMap[colNum]; // ✅ Get the correct index in the table
            return actualIndex !== undefined ? cols[actualIndex]?.textContent.trim() || '' : '';
        });

        // ✅ Append Task Code (col 38), Row Number (col 39), and Categories (col 40+)
        rowData.push(String(taskCode));  // Task Code at col 38
        rowData.push(String(rowNum));    // Row Number at col 39
        rowData.push(...categories.map(String)); // Dynamic category columns (col 40+)

        allRowData.push(rowData.join(',')); // Store row data for checksum
    });

    csvContent += allRowData.join('\n') + '\n'; // ✅ Append all data rows after the header

    // ✅ Generate SHA-256 checksum for filename obfuscation only
    const checksum = await generateChecksum(csvContent); 
    const obfuscatedChecksum = getObfuscatedChecksum(checksum); // 5-character obfuscation

    // ✅ Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);

    // ✅ Extract task code from sorted metadata for filename
    let firstRowTaskCode = rowCategoriesMap[1]?.taskCode || "NT"; // Default if missing

    // ✅ Sanitize filename
    let categoryString = firstRowTaskCode.replace(/[^a-zA-Z0-9-_]/g, "").trim();
    if (!categoryString) categoryString = "NT";

    // ✅ Filename includes obfuscated checksum (BUT NOT inside the file!)
    let filename = `SimX_${categoryString}_${rowCount}_${getFormattedTimestamp()}_${obfuscatedChecksum}.csv`;

    console.log(`✅ Final Filename: ${filename}`);
    link.setAttribute("download", filename);
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});


document.getElementById('savePdfButton').addEventListener('click', function() {
    // Show the modal
    document.getElementById('savePdfModal').style.display = 'block';
});

// Handle 'Split Row' button click
document.getElementById('splitRowBtn').addEventListener('click', function() {
    document.getElementById('savePdfModal').style.display = 'none';
    console.log('Categories from fileInput:', rowCategoriesMap);
    savePDFSplit(rowCategoriesMap);  // Call function for Split Row layout
});

// Handle 'Single Row' button click
document.getElementById('singleRowBtn').addEventListener('click', function() {
    document.getElementById('savePdfModal').style.display = 'none';
    savePDFSingle();  // Call function for Single Row layout
});

// Function to get the correct color based on the provided style
function getColorForStyle(style) {
    const colorMap = {
        'lightcoral': [255, 204, 204],
        'light-blue': [173, 216, 230],
        'light-orange': [255, 165, 0],
        'violet': [238, 130, 238],
        'DarkKhaki': [189, 183, 107],
        'DarkSeaGreen': [143, 188, 143],
        'LightSteelBlue': [176, 196, 222],
        'Thistle': [216, 191, 216],
        'GreenYellow': [173, 255, 47],
        'Gold': [255, 215, 0],
        'light-green': [144, 238, 144],
        'default-light-yellow': [255, 255, 224]
    };

    return colorMap[style] || [255, 255, 255]; // Default to white if style is not found
}

function savePDFSplit(rowCategoriesMap) {
    console.log('✅ Categories from fileInput:', rowCategoriesMap);

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });

    const table = document.querySelector('#csvTable');

    // ✅ Sort table rows by row number before extracting data
    let rows = Array.from(table.querySelectorAll('tbody tr')).sort((a, b) => {
        let numA = parseInt(a.cells[0].textContent.trim(), 10);
        let numB = parseInt(b.cells[0].textContent.trim(), 10);
        return numA - numB;
    });

    const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText);
    const data = rows.map(tr => Array.from(tr.querySelectorAll('td')).map(td => td.innerText));

    // ✅ Ensure task codes and categories are correctly retrieved
    const processedData = [];
    const topHalfIndices = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
    const bottomHalfIndices = [0,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38];

	const topHalfHeaders = topHalfIndices.map(idx => headers[idx] === '37' ? '00' : headers[idx]); // ✅ Replace 37 with "00"
	const bottomHalfHeaders = bottomHalfIndices.map(idx => headers[idx] === '37' ? '00' : headers[idx]); // ✅ Replace 37 with "00"

    rows.forEach((row, index) => {
        const rowNumber = parseInt(row.cells[0].textContent.trim(), 10); // ✅ Extract row number properly

        const topHalf = topHalfIndices.map(idx => {
    	const value = row.cells[idx]?.textContent.trim() || "";
    	return value === "0" ? "" : value;
	});

        topHalf[0] = rowNumber.toString();

        const bottomHalf = bottomHalfIndices.map(idx => {
    	const value = row.cells[idx]?.textContent.trim() || "";
    	return value === "0" ? "" : value;
	});

        bottomHalf[0] = "";

        let taskInfo = rowCategoriesMap[rowNumber] || { taskCode: "NT", categories: [] };
        let taskDisplay = [...taskInfo.categories].filter(val => val.trim() !== "").join(", ") || "None";

        processedData.push(topHalfHeaders);
        processedData.push(topHalf);
        processedData.push(bottomHalfHeaders);
        processedData.push(bottomHalf);

        let taskRow = Array(topHalfHeaders.length).fill('');
        taskRow[0] = `${taskDisplay}`;
        processedData.push(taskRow);
    });

    const timestamp = getFormattedTimestamp();
    const filename = `Split_${data.length}_${timestamp}.pdf`;

    doc.autoTable({
        body: processedData,
        startY: 20,
        theme: 'grid',
        margin: { top: 20, left: 16, right: 16, bottom: 10 },
        styles: {
            fontSize: 10,
            cellPadding: 1.5,
            overflow: 'linebreak',
            fontStyle: 'bold',
            halign: 'center',
        },
        headStyles: {
            fontSize: 6,
            textColor: [255, 255, 255],
            fillColor: [0, 51, 102],
            halign: 'center',
        },
        didParseCell: function (data) {
            const redColumns = ['5', '34', '3', '36', '1', '27', '25', '12', '19', '18', '32', '7', '30', '9', '14', '23', '16', '21'];
            const blackColumns = ['22', '15', '24', '13', '37', '10', '29', '8', '31', '6', '17', '20', '11', '26', '28', '2', '35', '4', '33'];
            const greenColumns = ['0', '00'];
            const lightYellowColumns = [8, 9, 10, 11, 12, 28, 29, 30, 31, 32];

            const rowIndexMod5 = data.row.index % 5;
            const isHeaderRow = (rowIndexMod5 === 0) || (rowIndexMod5 === 2);
            const isTaskRow = (rowIndexMod5 === 4);

            const isTopHalfDataRow = (rowIndexMod5 === 1);
            const isBottomHalfDataRow = (rowIndexMod5 === 3);

            if (isHeaderRow) {
                const headerValue = data.cell.raw.trim();
                if (greenColumns.includes(headerValue)) {
                    data.cell.styles.fillColor = [0, 200, 0];
                    data.cell.styles.textColor = [255, 255, 255];
                } else if (redColumns.includes(headerValue)) {
                    data.cell.styles.fillColor = [255, 0, 0];
                    data.cell.styles.textColor = [255, 255, 255];
                } else if (blackColumns.includes(headerValue)) {
                    data.cell.styles.fillColor = [0, 0, 0];
                    data.cell.styles.textColor = [255, 255, 255];
                } else {
                    data.cell.styles.fillColor = [200, 200, 200];
                    data.cell.styles.textColor = [0, 0, 0];
                }
                return;
            }

            if (isTaskRow) {
                data.cell.styles.fillColor = [255, 255, 255];
                data.cell.styles.textColor = [0, 0, 0];
                return;
            }

            if (isTopHalfDataRow || isBottomHalfDataRow) {
                if (lightYellowColumns.includes(data.column.index)) {
                    data.cell.styles.fillColor = [255, 255, 224];
                } else {
                    data.cell.styles.fillColor = [211, 211, 211];
                }
                data.cell.styles.textColor = [0, 0, 0];
            }
        },
        didDrawPage: function () {
            doc.setFontSize(12);
            doc.text(filename.replace('.pdf', ''), 14, 10);
        }
    });

    doc.addPage();
    doc.setFontSize(14);
    doc.text("Selected Files:", 14, 20);

    let finalY = 30;
    const pageHeight = doc.internal.pageSize.height;
    const lineHeight = 6;
    
    doc.setFontSize(12);
    selectedFileNames.forEach(fileName => {
            if (finalY + lineHeight > pageHeight - 20) {
            doc.addPage();
            finalY = 20;
        }
        doc.text(fileName, 14, finalY);
        finalY += lineHeight;
    });

    doc.save(filename);
}



function savePDFSingle() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });

    const table = document.querySelector('#csvTable');
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText === '37' ? '00' : th.innerText);
const data = Array.from(table.querySelectorAll('tbody tr')).map(tr =>
    Array.from(tr.querySelectorAll('td')).map(td => {
        const val = td.innerText.trim();
        return val === "0" ? "" : val;
    })
);


    const timestamp = getFormattedTimestamp();
    const rowCount = data.length;
    const filename = `Single_${rowCount}_${timestamp}.pdf`;

    const baseFontSize = 8;
    const headerFontSize = baseFontSize * 0.9;
    const cellFontSize = baseFontSize * 1.1;

    const group1Columns = [8, 9, 10, 11, 12];
    const group2Columns = [28, 29, 30, 31, 32];

    const sumConditions = {
        8: 'lightcoral',
        9: 'light-blue',
        10: 'light-orange',
        11: 'violet',
        12: 'DarkKhaki',
        13: 'DarkSeaGreen',
        14: 'LightSteelBlue',
        15: 'Thistle',
        16: 'GreenYellow',
        17: 'Gold'
    };

    function getColorForStyle(style) {
        const colors = {
            'lightcoral': [240, 128, 128],
            'light-blue': [173, 216, 230],
            'light-orange': [255, 165, 0],
            'violet': [238, 130, 238],
            'DarkKhaki': [189, 183, 107],
            'DarkSeaGreen': [143, 188, 143],
            'LightSteelBlue': [176, 196, 222],
            'Thistle': [216, 191, 216],
            'GreenYellow': [173, 255, 47],
            'Gold': [255, 215, 0],
            'light-green': [144, 238, 144],
            'default-light-yellow': [255, 255, 224]
        };
        return colors[style] || [255, 255, 255];
    }

    doc.autoTable({
        head: [headers],
        body: data,
        startY: 25,
        theme: 'grid',
        margin: { top: 25, left: 10, right: 10, bottom: 10 },
        tableWidth: 'auto',
        styles: {
            fontSize: cellFontSize,
            cellPadding: 2,
            overflow: 'linebreak',
            fontStyle: 'bold',
            halign: 'center',
        },
        headStyles: {
            fontSize: headerFontSize,
            textColor: [255, 255, 255],
            halign: 'center',
        },
        didParseCell: function (data) {
            const redColumns = ['5', '34', '3', '36', '1', '27', '25', '12', '19', '18', '32', '7', '30', '9', '14', '23', '16', '21'];
            const blackColumns = ['22', '15', '24', '13', '37', '10', '29', '8', '31', '6', '17', '20', '11', '26', '28', '2', '35', '4', '33'];
            const greenColumns = ['0', '00'];
            const lightYellowColumns = [8, 9, 10, 11, 12, 28, 29, 30, 31, 32];

            const headerValue = data.cell.raw.trim();

            if (data.row.section === 'head') {
                if (greenColumns.includes(headerValue)) {
                    data.cell.styles.fillColor = [0, 200, 0]; // Green
                    data.cell.styles.textColor = [255, 255, 255];
                } else if (redColumns.includes(headerValue)) {
                    data.cell.styles.fillColor = [255, 0, 0]; // Red
                    data.cell.styles.textColor = [255, 255, 255];
                } else if (blackColumns.includes(headerValue)) {
                    data.cell.styles.fillColor = [0, 0, 0]; // Black
                    data.cell.styles.textColor = [255, 255, 255];
                } else {
                    data.cell.styles.fillColor = [200, 200, 200]; // Default Gray
                    data.cell.styles.textColor = [0, 0, 0];
                }
            }

            if (data.row.section === 'body') {
                data.cell.styles.fillColor = [211, 211, 211]; // LightGray for all body rows

                if (data.column.index === 0) {
                    data.cell.styles.fillColor = [112, 128, 144]; // SlateGray for row numbers
                    data.cell.styles.textColor = [255, 255, 255];
                } else {
                    let group1Sum = 0;
                    let group2Sum = 0;

                    group1Columns.forEach(index => {
                        const value = parseFloat(data.row.raw[index]);
                        if (!isNaN(value)) group1Sum += value;
                    });

                    group2Columns.forEach(index => {
                        const value = parseFloat(data.row.raw[index]);
                        if (!isNaN(value)) group2Sum += value;
                    });

                    let appliedColor = false;

                    if (group1Columns.includes(data.column.index)) {
                        const group1CellStyle = sumConditions[group1Sum];
                        if (group1CellStyle) {
                            data.cell.styles.fillColor = getColorForStyle(group1CellStyle);
                            appliedColor = true;
                        }
                    }

                    if (group2Columns.includes(data.column.index)) {
                        const group2CellStyle = sumConditions[group2Sum];
                        if (group2CellStyle) {
                            data.cell.styles.fillColor = getColorForStyle(group2CellStyle);
                            appliedColor = true;
                        }
                    }

                    const cellValue = parseFloat(data.cell.text);
                    if (!isNaN(cellValue)) {
                        if (cellValue === 3) {
                            data.cell.styles.fillColor = getColorForStyle('DarkSeaGreen');
                        } else if (cellValue === 4) {
                            data.cell.styles.fillColor = getColorForStyle('Gold');
                        } else if (cellValue === 5) {
                            data.cell.styles.fillColor = getColorForStyle('light-green');
                        } else if (cellValue === 6) {
                            data.cell.styles.fillColor = getColorForStyle('light-orange');
                        } else if (cellValue >= 7) {
                            data.cell.styles.fillColor = getColorForStyle('DarkKhaki');
                        }
                    }

                    if (!appliedColor && lightYellowColumns.includes(data.column.index)) {
                        data.cell.styles.fillColor = getColorForStyle('default-light-yellow');
                    }
                }
            }
        },
        didDrawPage: function () {
            doc.setFontSize(16);
            doc.text(filename.replace('.pdf', ''), 14, 15);
        }
    });

    // ✅ New Page for Task Codes and Categories
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Tasks:", 14, 20);

    let finalY = 30;
    const pageHeight = doc.internal.pageSize.height;
    const lineHeight = 6;
    doc.setFontSize(12);

    Object.entries(rowCategoriesMap).forEach(([rowNum, data]) => {
        let taskText = `Row ${rowNum}: Task Code: ${data.taskCode || "NT"} | Significance: ${data.categories.length > 0 ? data.categories.join(", ") : "None"}`;
        
       if (finalY + lineHeight > pageHeight - 20) {
            doc.addPage();
            finalY = 20;
        }
  
        doc.text(taskText, 14, finalY);
        finalY += 6;
    });

    // ✅ Add Selected Files List
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Selected Files:", 14, 20);
    
    finalY = 30;
    doc.setFontSize(12);
    selectedFileNames.forEach(fileName => {
    
        if (finalY + lineHeight > pageHeight - 20) {
            doc.addPage();
            finalY = 20;
        }
        doc.text(fileName, 14, finalY);
        finalY += lineHeight;
    });

    doc.save(filename);
}


        // Event listener for 'sortCols' button
        document.getElementById('sortCols').addEventListener('click', function() {
            window.open('sort.html', '_blank');  // Opens sort.html in a new tab or window
        });

        // Event listener for 'sortByHighestValue' button
        document.getElementById('sortByHighestValue').addEventListener('click', function() {
            console.log("Sort by Highest button clicked");
            const tableBody = document.querySelector('#csvTable tbody');
            let rowsArray = Array.from(tableBody.rows);

            rowsArray.sort((rowA, rowB) => {
                const valuesA = Array.from(rowA.cells).slice(1).map(cell => parseInt(cell.textContent) || 0);
                const valuesB = Array.from(rowB.cells).slice(1).map(cell => parseInt(cell.textContent) || 0);

                valuesA.sort((a, b) => b - a);
                valuesB.sort((a, b) => b - a);

                for (let i = 0; i < valuesA.length; i++) {
                    if (valuesA[i] !== valuesB[i]) {
                        return valuesB[i] - valuesA[i];  // Sort in descending order
                    }
                }
                return 0;
            });

            tableBody.innerHTML = ''; // Clear current rows
            rowsArray.forEach(row => tableBody.appendChild(row)); // Append sorted rows
            console.log("Sorting by highest complete", rowsArray);
        });

        // Event listener for 'sortByLowestValue' button
        document.getElementById('sortByLowestValue').addEventListener('click', function() {
            console.log("Sort by Lowest button clicked");
            const tableBody = document.querySelector('#csvTable tbody');
            let rowsArray = Array.from(tableBody.rows);

            // Simply reverse the existing order of rows
            rowsArray.reverse();

            tableBody.innerHTML = ''; // Clear current rows
            rowsArray.forEach(row => tableBody.appendChild(row)); // Append reversed rows
            console.log("Sorting by lowest complete", rowsArray);
        });