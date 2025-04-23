/* Copyright 2025 © EZR Consulting. All rights reserved. */

// Define the variables
    let Totals = new Array(38).fill(0);
    let currentBlinkCell = null;
    let lastPValues = [];  // Global variable to store latest P-Values
    let selectedOptions = [];
    let rowsData = [];  // ✅ Define globally to store all runs
    let allPValues = [];  // ✅ Store all runs' p-values globally
    let numRuns = 1; // Default value
    let pValuesTableMap = {}; // ✅ Global map to store p-values & significance

    
    // ✅ Move this to the top so all functions can access it
const taskMappings = {
    "Sum of 00": "S00",
    "Sum of 0": "S0",
    "Top Ends - Center": "TEC",
    "Bottom Ends - Center": "BEC",
    "Top - Bottom": "TB",
    "Left - Right": "LR",
    "Variance (Within-Run)": "V",
    "Density (Top 5 Sum)": "D",
    "No Task": "NT"
};


    // Function to clear all arrays
    function clearArrays() {
      Totals = new Array(38).fill(0);
    }
        
        const groupIndices = {
      topIndices: [5,22,34,15,3,24,36,13,1,37,27,10,25,29,12,8,19,31,18],
      bottomIndices: [17,32,20,7,11,30,26,9,28,0,2,14,35,23,4,16,33,21,6],
      leftTop: [5,22,34,15,3],
      leftBottom: [17,32,20,7,11],
      rightTop: [12,8,19,31,18],
      rightBottom: [4,16,33,21,6],
      cTop: [24,36,13,1,37,27,10,25,29],
      cBottom: [30,26,9,28,0,2,14,35,23],
      zzCluster: [13,1,37,27,10],
      zCluster: [9,28,0,2,14],
      left: [5,22,34,15,3,24,36,13,1,17,32,20,7,11,30,26,9,28],
      right: [27,10,25,29,12,8,19,31,18,2,14,35,23,4,16,33,21,6],
      topEnds: [5,22,34,15,3,12,8,19,31,18],
      bottomEnds: [17,32,20,7,11,4,16,3,21,6],
      topCenter: [24,36,13,1,37,27,10,25,29],
      bottomCenter: [30,26,9,28,0,2,14,35,23],
      zeroSums: [13,1,37,27,10,9,28,0,2,14]
    };

           // Function to generate a formatted timestamp // 
function getFormattedTimestamp() {
    const now = new Date();
    const year = String(now.getFullYear()).slice(-2); // Get last two digits of the year
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${month}${day}${year}_${hours}_${minutes}_${seconds}`;
}


// Function to export Totals array data to CSV format
async function exportTotalsToCSV(array, rowCount, selectedOptions) {
    let timestamp = getFormattedTimestamp();
    let csvContent = "THIS FILE IS GENERATED AUTOMATICALLY. DO NOT EDIT.\n";
    csvContent += `LAST GENERATED ON: ${timestamp}\n\n`;

    if (!Array.isArray(array) || array.length === 0) {
        console.error("❌ ERROR: No spin data found! Export aborted.");
        return;
    }

    let category = generateTaskIdentifier(selectedOptions); // ✅ Ensures we map selected tasks correctly
    let headerRow = Array.from({ length: 45 }, (_, i) => i);
    csvContent += headerRow + "\n";

    let allSignificantCategories = [];

    // ✅ Determine the primary category **before** looping
    let activeTask = getActiveTask(); // ✅ Get the selected task
    let primaryCategory = activeTask !== "NT" ? activeTask : "NT"; // ✅ Use NT only if no task is selected

    array.forEach((row, rowIndex) => {
        let runNumber = rowIndex + 1;
        let significantCategories = pValuesTableMap[runNumber] || []; // ✅ Get significant categories

        row[38] = primaryCategory; // ✅ Assign properly

        console.log(`✅ Writing row ${runNumber} - Primary Category: ${primaryCategory}, Significant Categories:`, significantCategories);

        let csvRow = row.concat([runNumber], significantCategories);
        csvContent += csvRow.join(",") + "\n";

        // ✅ Store categories for filename generation, **but don't use them to override NT**
        allSignificantCategories.push(...significantCategories);
    });

    const checksum = await generateChecksum(csvContent);
    const obfuscatedChecksum = getObfuscatedChecksum(checksum);

    // ✅ Use the **active task** for the filename, defaulting to "NT" if no task was selected
    let categoryString = primaryCategory;

    // ✅ Remove special characters for safety
    categoryString = categoryString.replace(/[^a-zA-Z0-9-_]/g, "").trim();
    if (!categoryString) categoryString = "NT"; // ✅ Prevent empty filename

    // ✅ Final filename now correctly reflects only the **selected task**
    let filename = `Sim_${categoryString}_${array.length}_${timestamp}_${obfuscatedChecksum}.csv`;

    console.log(`✅ Final Filename: ${filename}`);
    saveFile(csvContent, filename);
}

/**
 * ✅ Save File to Disk (Download)x
 */
function saveFile(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`✅ File saved as: ${filename}`);
}

// Generates the task identifier from selected tasks
function generateTaskIdentifier(selectedTasks) {
    console.log("Active button:", selectedTasks);
    if (!Array.isArray(selectedTasks) || selectedTasks.length === 0) {

        return "NT"; // Default to "NT" (No Task)
    }
    const taskMappings = {
        "Sum of 00": "S00",
        "Sum of 0": "S0",
        "Top Ends - Center": "TEC",
        "Bottom Ends - Center": "BEC",
        "Top - Bottom": "TB",
        "Left - Right": "LR",
        "Variance (Within-Run)": "V",
        "Density (Top 5 Sum)": "D",
        "No Task": "NT"
    };

    let identifier = selectedTasks.map(task => taskMappings[task]).join("_");
    return identifier;
}


/**
 * ✅ Compute SHA-256 Checksum
 */
async function generateChecksum(content) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(content));
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * ✅ Obfuscate the checksum for filename use
 */
function getObfuscatedChecksum(checksum) {
    if (!checksum || checksum.length < 10) {
        console.error("⚠️ Error: Invalid checksum provided:", checksum);
        return "00000"; // Return default if checksum is bad
    }

    const halfLength = Math.floor(checksum.length / 2);
    const secondHalf = checksum.slice(halfLength);
    return secondHalf.slice(0, 5).split("").reverse().join(""); 
}


// ✅ Updated checksum validation function
async function validateChecksum(file) {
    const reader = new FileReader();
    reader.onload = async function(event) {
        const fileContent = event.target.result;
        
        // ✅ Compute checksum of the file content
        const computedChecksum = await generateChecksum(fileContent);
        const filename = file.name;
        
        // ✅ Extract last 5 characters from filename (before .csv)
        const extractedChecksum = filename.slice(-9, -4);

        if (computedChecksum.slice(-5) === extractedChecksum) {
            console.log("✅ Checksum matches for", filename);
        } else {
            console.log("❌ Checksum mismatch! Expected:", extractedChecksum, "Computed:", computedChecksum.slice(-5));
        }
    };
    reader.readAsText(file);
}



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
    	document.getElementById("densityButton").addEventListener("click", () => { window.open("sort.html", "_blank"); });
      
// Function to generate a random integer between 0 (inclusive) and max (exclusive)
function getRandomInt(max) {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
}

function computePValues(selectedOptions, runIndex) {
    let pValues = [];

    // ✅ Define the 8 expected categories
    const expectedCategories = [
        "Top - Bottom",
        "Left - Right",
        "Top Ends - Center",
        "Bottom Ends - Center",
        "Variance (Within-Run Spread)",
        "Density (Top 5 Sum)",
        "00 Cluster",
        "0 Cluster"
    ];

    // ✅ Compute differences for ALL 8 expected categories
    let categoryDifferences = {
        "Top - Bottom": sumColumns(Totals, groupIndices.topIndices) - sumColumns(Totals, groupIndices.bottomIndices),
        "Left - Right": sumColumns(Totals, groupIndices.left) - sumColumns(Totals, groupIndices.right),
        "Top Ends - Center": sumColumns(Totals, groupIndices.topEnds) - sumColumns(Totals, groupIndices.topCenter),
        "Bottom Ends - Center": sumColumns(Totals, groupIndices.bottomEnds) - sumColumns(Totals, groupIndices.bottomCenter),
        "00 Cluster": sumColumns(Totals, groupIndices.zzCluster),
        "0 Cluster": sumColumns(Totals, groupIndices.zCluster),
    };

    // ✅ Compute Variance & Density separately
    categoryDifferences["Variance (Within-Run Spread)"] = calculateVariance(Totals);
    categoryDifferences["Density (Top 5 Sum)"] = calculateDensity(Totals);

    // ✅ Compute P-values for ALL 8 categories
expectedCategories.forEach(category => {
    let difference = categoryDifferences[category];

    // ✅ Ensure difference is a valid number
    if (difference === undefined || difference === null || isNaN(difference)) {
        console.warn(`⚠️ WARNING: Difference for '${category}' is invalid! Defaulting to 0.`);
        difference = 0;
    }

    let pValue = lookupPValue(category, difference);

    // ✅ Ensure p-value is valid
    if (pValue === undefined || isNaN(pValue)) {
        console.warn(`⚠️ WARNING: P-Value for '${category}' is invalid! Defaulting to 1.0.`);
        pValue = 1.0;
    }

    pValues.push({
        run: runIndex + 1,
        category: category,
        difference: parseFloat(difference).toFixed(3), // ✅ Now always a valid number
        pValue: parseFloat(pValue).toFixed(6),
    });
});


    console.log(`✅ Computed P-Values for Run ${runIndex + 1}:`, pValues);
    return pValues;
}


function getActiveTask() {
    const activeButton = document.querySelector(".toggle-button.active");
    if (!activeButton) return "NT";  // Default to "NT" if no task is selected

    const taskMap = {
        "Top - Bottom": "TB",
        "Left - Right": "LR",
        "Top Ends - Center": "TEC",
        "Bottom Ends - Center": "BEC",
        "Sum of 00": "S00",
        "Sum of 0": "S0",
        "Variance (Within-Run)": "V",
        "Density (Top 5 Sum)": "D"
    };

    let taskName = activeButton.textContent.trim();
    let mappedTask = taskMap[taskName] || "NT";  // ✅ Ensure a valid mapped task

    console.log(`🔍 Active Task Resolved: ${taskName} → ${mappedTask}`);
    return mappedTask;
}

async function loadReferenceData() {
    try {
        const response = await fetch('10mcols.csv');
        const csvText = await response.text();
        refData = parseCSVToRefData(csvText);     
        console.log("✅ Reference data loaded!", refData);
    } catch (error) {
        console.error("⚠️ Error loading reference data:", error);
    }
}


// Call function on page load
window.addEventListener('load', loadReferenceData);

function parseCSVToRefData(csvText, numRuns = 1) {
    const lines = csvText.split("\n");
    const refData = {};

    for (let line of lines) {
        const columns = line.split(",");
        if (columns.length < 4) continue; // Ensure the line has enough columns

        const category = columns[0].trim();
        const diff = parseFloat(columns[1].trim());
        const pVal = parseFloat(columns[2].trim()); // Regular p-value (unused now)
        const cumPVal = parseFloat(columns[3].trim()); // Extract cumulative p-value

        if (isNaN(diff) || isNaN(cumPVal)) continue; // Skip bad data

        if (!refData[category]) {
            refData[category] = {};
        }

        // Multiply the cumulative p-value by the number of runs
        refData[category][diff] = Math.min(cumPVal * numRuns, 1); // Ensure it doesn't exceed 1
    }

    return refData;
}


function lookupPValue(category, difference) {
    let fullCategoryName = Object.keys(taskMappings).find(
        key => taskMappings[key] === category
    ) || category;

    console.log(`🔍 Looking up category: '${category}', resolved to: '${fullCategoryName}'`);

    if (!refData[fullCategoryName]) {
        console.error(`⚠️ ERROR: Category '${fullCategoryName}' not found in reference data!`);
        return 1.0; // Default if category not found
    }

    // ✅ Preserve the original sign
    let signedDifference = difference;

    // Convert reference data keys into numbers
    let availableDifferences = Object.keys(refData[fullCategoryName]).map(Number);
    
    if (availableDifferences.length === 0) {
        console.warn(`⚠️ WARNING: No differences found for '${fullCategoryName}', using default p=1.0`);
        return 1.0;
    }

    // ✅ Find the closest matching absolute difference
    let closestDiff = availableDifferences.reduce((a, b) =>
        Math.abs(b - signedDifference) < Math.abs(a - signedDifference) ? b : a
    );

    console.log(`✅ Found closest difference: ${closestDiff} for category '${fullCategoryName}'`);

    let retrievedPValue = refData[fullCategoryName][closestDiff];

    console.log(`🟢 DEBUG: Retrieved pValue from refData = ${retrievedPValue}`);

    if (retrievedPValue === undefined) {
        console.warn(`⚠️ WARNING: Difference '${signedDifference}' not found for '${fullCategoryName}', using default p=1.0`);
        return 1.0;
    }

    return retrievedPValue;
}

function clearTask() {
    document.querySelectorAll(".toggle-button").forEach(btn => btn.classList.remove("active"));
    selectedOptions = [];
    console.log("✅ Cleared selected tasks. Selected Options:", selectedOptions);
}

function getSelectedOptions() {
    return selectedOptions;  // Returns the globally tracked selected options
}

function toggleOption(button) {
    document.querySelectorAll(".toggle-button").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    selectedOptions = [button.textContent.trim()];
    console.log("Selected Options:", selectedOptions); // Debugging log
}

function multiSpin() {
    numRuns = parseInt(document.getElementById('x').value) || 1;  // ✅ Update global variable
    let numSpins = 38; 
    let spinDelay = parseInt(document.getElementById('spinDelay').value) * 100;

    rowsData = [];  // ✅ Reset storage for new runs
    let allTotals = [];
    let allPValues = [];  // ✅ Store P-values correctly

    function singleRun(runIndex) {
        clearArrays();
        document.getElementById('TotalsTableContainer').innerHTML = '';
        let spinCount = 0;

        function spin() {
            if (spinCount < numSpins) {
                setTimeout(function () {
                    let c1 = getRandomInt(38);
                    Totals[c1] += 1;
                    document.getElementById('spinNumDisplay').innerHTML = `Spin Num: <span class="zero-highlight">${spinCount + 1}</span>`;
                    document.getElementById('runNumDisplay').innerHTML = `Run Num:  <span class="zero-highlight">${runIndex + 1}</span>`;
                    populateTotalsTable(c1, spinCount === numSpins - 1);
                    spinCount++;
                    setTimeout(spin, spinDelay);
                }, 0);
            } else {
                allTotals.push([...Totals]);
                let row = [...Totals];  
                rowsData.push(row);  

                selectedOptions = selectedOptions.length ? selectedOptions : ["No Tasks"];
                let pValues = computePValues(selectedOptions, runIndex); // ✅ PASS runIndex
                allPValues.push(...pValues);  // ✅ Store all runs' P-values

                if (runIndex < numRuns - 1) {
                    setTimeout(() => singleRun(runIndex + 1), 100);
                } else {
                    displayPValues(allPValues);  // ✅ Display all runs' P-values
                    setTimeout(() => {
                        exportTotalsToCSV(rowsData, allPValues, rowsData.length, selectedOptions);
                    }, 500); 
                    endMultiSpin();
                }
            }
        }
        spin();
    }
    singleRun(0);
}


function displayPValues(newPValues) {
    let tableContainer = document.getElementById('pValueTableContainer');
    let table = document.getElementById("pValueTable");

    if (!table) {
        tableContainer.innerHTML = `
            <table id="pValueTable" border='1'>
                <tr>
                    <th>Run</th>
                    <th>Task</th>
                    <th>Difference / Sum</th>
                    <th>Significance</th>
                    <th>Cumulative P-Value</th>
                </tr>
            </table>
        `;
        table = document.getElementById("pValueTable");
    }

    let rowsHTML = "";
    let groupedRows = {};
    let tempPValuesTableMap = {}; // ✅ Temporary storage for significant categories

    // ✅ Group values by run number and category
    newPValues.forEach(({ run, category, difference, pValue }) => {
        let numericPValue = parseFloat(pValue);
        // let adjustedPValue = (!isNaN(numericPValue)) ? (numericPValue * numRuns).toFixed(6) : "-";
        let adjustedPValue = numericPValue;

        if (!groupedRows[run]) {
            groupedRows[run] = {};
        }

        // ✅ Preserve the negative difference
        let signedDifference = parseFloat(difference); 

        groupedRows[run][category] = {
            difference: signedDifference.toFixed(3), // Preserve sign
            adjustedPValue
        };
    });

    // ✅ Process grouped data for each run
    Object.keys(groupedRows).forEach(run => {
        let selectedTask = getActiveTask(); // ✅ FIXED: Ensures selected task is used
        let significanceMatches = [];

        console.log(`🔍 Checking all categories for Run ${run}...`);

        // ✅ Loop through the 8 expected categories
        const expectedCategories = [
            "Top - Bottom",
            "Left - Right",
            "Top Ends - Center",
            "Bottom Ends - Center",
            "Variance (Within-Run Spread)",
            "Density (Top 5 Sum)",
            "00 Cluster",
            "0 Cluster"
        ];

        expectedCategories.forEach(category => {
            if (groupedRows[run][category]) {
                let { difference, adjustedPValue } = groupedRows[run][category];

                console.log(`   📊 Category: ${category}, Difference / Sum: ${difference}, Adjusted P-Value: ${adjustedPValue}`);

                if (adjustedPValue !== "-" && parseFloat(adjustedPValue) < 0.05) {
                    console.log(`   ✅ Category ${category} is SIGNIFICANT for Run ${run}!`);
                    significanceMatches.push(category); // ✅ Store category only
                }
            }
        });

        // ✅ Store significant categories in pValuesTableMap
        tempPValuesTableMap[run] = significanceMatches.length ? significanceMatches : ["None"]; // ✅ Default to "NT" if empty

        // ✅ Generate multiple rows if multiple significant categories exist
        if (significanceMatches.length > 0) {
            significanceMatches.forEach(category => {
                let difference = groupedRows[run][category]?.difference ?? "-";
                let adjustedPValue = groupedRows[run][category]?.adjustedPValue ?? "-";

                rowsHTML += `
                    <tr style='background-color: yellow; color: black;'>
                        <td>${run}</td>
                        <td>${selectedTask}</td>
                        <td>${difference}</td>
                        <td>${category}</td>
                        <td>${adjustedPValue}</td>
                    </tr>
                `;
            });
        } else {
            // ✅ Display a normal row if no significant categories found
            let difference = groupedRows[run][selectedTask]?.difference ?? "-";
            let adjustedPValue = groupedRows[run][selectedTask]?.adjustedPValue ?? "-";

            rowsHTML += `
                <tr>
                    <td>${run}</td>
                    <td>${selectedTask}</td>
                    <td>${difference}</td>
                    <td>-</td>
                    <td>${adjustedPValue}</td>
                </tr>
            `;
        }
    });

    // ✅ Update global pValuesTableMap after processing all runs
    pValuesTableMap = tempPValuesTableMap;
    console.log("✅ Updated pValuesTableMap:", pValuesTableMap);

    // ✅ Update the table
    table.innerHTML = `<tr>
                            <th>Run</th>
                            <th>Task</th>
                            <th>Difference / Sum</th>
                            <th>Significance</th>
                            <th>Cumulative P-Value</th>
                        </tr>${rowsHTML}`;

    console.log("✅ Finished updating P-Values Display.");
}

// Function to calculate variance
function calculateVariance(counts) {
    let n = counts.length;
    let mean = counts.reduce((sum, val) => sum + val, 0) / n;
    let variance = counts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    return variance.toFixed(4);
}

// Function to calculate density (Top 5 highest values sum)
function calculateDensity(counts) {
    let sortedCounts = counts.slice().sort((a, b) => b - a);
    return sortedCounts.slice(0, 5).reduce((sum, val) => sum + val, 0);
}


// ✅ Function to sum up column values based on predefined index groups
function sumColumns(counts, indices) {
    return indices.reduce((sum, idx) => {
        if (idx >= 0 && idx < counts.length) {
            return sum + counts[idx];
        } else {
            console.warn(`⚠️ WARNING: Index ${idx} is out of bounds!`);
            return sum;
        }
    }, 0);
}

function calculateAllSums(counts) {
      return {
        topBottomDiff: sumColumns(counts, groupIndices.topIndices) - sumColumns(counts, groupIndices.bottomIndices),
        leftRightDiff: sumColumns(counts, groupIndices.left) - sumColumns(counts, groupIndices.right),
        cDiff: sumColumns(counts, groupIndices.cTop) - sumColumns(counts, groupIndices.cBottom),
        zzDiff: sumColumns(counts, groupIndices.zzCluster) - sumColumns(counts, groupIndices.zCluster),
        topDiff: sumColumns(counts, groupIndices.topEnds) - sumColumns(counts, groupIndices.topCenter),
        bottomDiff: sumColumns(counts, groupIndices.bottomEnds) - sumColumns(counts, groupIndices.bottomCenter),
      };	
    }


function getRandomCounts(numPicks) {
  const counts = Array(38).fill(0);
  for (let i = 0; i < numPicks; i++) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const pickedNumber = array[0] % 38; // Using crypto RNG instead of Math.random()
    counts[pickedNumber]++;
  }
  return counts;
}

    // Function to populate Totals table
function populateTotalsTable(blinkCellNumber = null, isLastSpin = false) {
      // Display Totals data in the table with colors
      displayTotalsTableWithColors(Totals, blinkCellNumber, isLastSpin);
    }

    // Function to display Totals array as a table with red/green formatting
function displayTotalsTableWithColors(Totals, blinkCellNumber, isLastSpin) {
      let output = "";

      // Define the two header orders
      const headerOrder1 = [5, 22, 34, 15, 3, 24, 36, 13, 1, 37, 27, 10, 25, 29, 12, 8, 19, 31, 18];
      const headerOrder2 = [17, 32, 20, 7, 11, 30, 26, 9, 28, 0, 2, 14, 35, 23, 4, 16, 33, 21, 6];          

function generateTable(headerOrder, isSecondTable = false) {
  let tableOutput = "<table>";

  // Header row
  tableOutput += "<tr>";

  // Create the header cells
  headerOrder.forEach((number, index) => {
    // Modify headerLabel to display '00' instead of '37'
    const headerLabel = (number === 37) ? '00' : number.toString();
    let colorClass;
    if (headerLabel === '0' || headerLabel === '00') { // Check for '00' here
      colorClass = 'green-header';
    } else if (isSecondTable) { // For headerOrder2
      colorClass = (index % 2 === 0) ? 'black-header' : 'red-header'; // Start with black and alternate
    } else { // For headerOrder1
      colorClass = (index % 2 === 0) ? 'red-header' : 'black-header'; // Start with red and alternate
    }
    tableOutput += "<th class='bold " + colorClass + "'>" + headerLabel + "</th>";
  });

  // Close the header row
  tableOutput += "</tr>";

  // Data row with values
  tableOutput += "<tr>";

  // Display Totals in the order of headerOrder array
  headerOrder.forEach((number) => {
    let cellValue;
    cellValue = Totals[number];
    // Replace 0 with empty string
    cellValue = (cellValue === 0) ? '&nbsp;' : cellValue; // Use non-breaking space for consistent row height
    const isBlinking = (number === blinkCellNumber);
    const blinkClass = isBlinking ? (isLastSpin ? 'blinking' : 'yellow-blinking') : '';
    const lightYellowClass = (number === 0 || number === 9 || number === 14 || number === 28 || number === 2 || number === 1 || number === 13 || number === 27 || number === 10 || number === 37) ? 'light-yellow' : ''; // Add the light-yellow class to the specified cells
    tableOutput += `<td class='numeric ${blinkClass} ${lightYellowClass}'>${cellValue}</td>`; // Data cells with light gray background color
  });

  tableOutput += "</tr>";
  tableOutput += "</table>";

  return tableOutput;
}

      // Generate both tables
      output += generateTable(headerOrder1);
      output += "<br>"; // Space between the two tables
      output += generateTable(headerOrder2, true); // Pass true for the second table

      document.getElementById('TotalsTableContainer').innerHTML = output; // Update TotalsTable content
    }
    // Call the populateTotalsTable function when the page loads
    window.onload = function() {
      populateTotalsTable();
    };
        
    function endMultiSpin() {
    // Assuming the Spin Num text is in a div with id "spinNum"
    const spinNumElement = document.getElementById('spinNum');

    if (spinNumElement) {
        spinNumElement.style.display = 'none'; // Hides the element
        // Or to clear the text: spinNumElement.textContent = '';
    }
}

function applyCellColors(data, isHeader) {
    const redColumns = ['5', '34', '3', '36', '1', '27', '25', '12', '19', '18', '32', '7', '30', '9', '14', '23', '16', '21'];
    const blackColumns = ['22', '15', '24', '13', '37', '10', '29', '8', '31', '6', '17', '20', '11', '26', '28', '2', '35', '4', '33'];
    const greenColumns = ['0', '00'];

    // ✅ Columns **8-12 and 25-29** should always have a light yellow background (unless overridden)
    const lightYellowColumns = [...Array(5).keys()].map(i => i + 8).concat([...Array(5).keys()].map(i => i + 25));

    const cellValue = data.cell.raw ? data.cell.raw.trim() : "";

    // ✅ Ensure blank rows remain pure white
    if (data.row.raw.every(cell => cell === "")) {
        data.cell.styles.fillColor = [255, 255, 255]; // White background
        data.cell.styles.textColor = [0, 0, 0]; // Black text
        return;
    }

    if (isHeader) {
        // ✅ Apply header colors based on header text
        if (greenColumns.includes(cellValue)) {
            data.cell.styles.fillColor = [0, 200, 0]; // Green
            data.cell.styles.textColor = [255, 255, 255];
        } else if (redColumns.includes(cellValue)) {
            data.cell.styles.fillColor = [255, 0, 0]; // Red
            data.cell.styles.textColor = [255, 255, 255];
        } else if (blackColumns.includes(cellValue)) {
            data.cell.styles.fillColor = [0, 0, 0]; // Black
            data.cell.styles.textColor = [255, 255, 255];
        }
        return;
    }

    // ✅ Default all data cells to light gray
    data.cell.styles.fillColor = [211, 211, 211]; // Light gray

    if (data.column.index === 0) {
        // ✅ Row number column (always slategray)
        data.cell.styles.fillColor = [112, 128, 144]; // Slategray
        data.cell.styles.textColor = [255, 255, 255];
        return;
    }

    if (lightYellowColumns.includes(data.column.index)) {
        // ✅ Always light yellow for these **column indices**
        data.cell.styles.fillColor = [255, 255, 224]; // Light yellow
    }

    // ✅ Specific value-based highlighting (overrides default colors)
    const numValue = parseFloat(cellValue);
    if (!isNaN(numValue)) {
        if (numValue === 3) {
            data.cell.styles.fillColor = [143, 188, 143]; // DarkSeaGreen
        } else if (numValue === 4) {
            data.cell.styles.fillColor = [255, 215, 0]; // Gold
        } else if (numValue === 5) {
            data.cell.styles.fillColor = [144, 238, 144]; // Light green
        } else if (numValue === 6) {
            data.cell.styles.fillColor = [255, 165, 0]; // Light orange
        } else if (numValue >= 7) {
            data.cell.styles.fillColor = [189, 183, 107]; // DarkKhaki
        }
    }
}