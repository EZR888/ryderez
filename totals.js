/* Copyright 2025 © EZR Consulting. All rights reserved. */

document.addEventListener('DOMContentLoaded', function() {
    // Check if elements exist before adding event listeners
    let simButton = document.getElementById('simButton');
    if (simButton) {
        simButton.addEventListener('click', () => {
            window.open('roulette.html', '_blank');
        });
    }

    let viewDataButton = document.getElementById('viewDataButton');
    if (viewDataButton) {
        viewDataButton.addEventListener('click', () => {
            window.open('view-data.html', '_blank');
        });
    }

    let viewPValueButton = document.getElementById('viewPValueButton');
    if (viewPValueButton) {
        viewPValueButton.addEventListener('click', () => {
            window.open('pvalues.html', '_blank');
        });
    }

    let viewFreqDistButton = document.getElementById('viewFreqDistButton');
    if (viewFreqDistButton) {
        viewFreqDistButton.addEventListener('click', () => {
            window.open('xfreq.html', '_blank');
        });
    }

    let viewStatsButton = document.getElementById('viewStatsButton');
    if (viewStatsButton) {
        viewStatsButton.addEventListener('click', () => {
            window.open('view-stats.html', '_blank');
        });
    }

    let singleSpinButton = document.getElementById('singleSpinButton');
    if (singleSpinButton) {
        singleSpinButton.addEventListener('click', () => {
            window.open('new-wheel.html', '_blank');
        });
    }
    
    let densityButton = document.getElementById('densityButton');
    if (densityButton) {
        densityButton.addEventListener('click', () => {
            window.open('sort.html', '_blank');
        });
    }
    
});
      
      
        let rowData = [];

        document.addEventListener('DOMContentLoaded', function () {

document.getElementById('fileInput').addEventListener('change', function (event) {
    let files = event.target.files;
    let allData = [];
    let fileCount = files.length;
    let filesProcessed = 0;

    function readFile(index) {
        if (index >= fileCount) {
            if (allData.length) {
                parseCSVAndGenerateTable(allData);
            }
            return;
        }

        let file = files[index];
        let reader = new FileReader();

        reader.onload = async function (e) {
            let csvData = e.target.result;

            // ✅ Extract last 5 characters from filename (before .csv)
            const last5FromFile = file.name.replace(".csv", "").slice(-5);

            // ✅ Allow hash values in the range 00000 to 00200 to bypass checksum validation
            const isBypass = /^[0-9]{5}$/.test(last5FromFile) && parseInt(last5FromFile, 10) <= 200;

            if (!isBypass) {
                // ✅ Compute checksum of file content
                const computedChecksum = await generateChecksum(csvData);

                // ✅ Extract the last 5-character hash from the second half of computed checksum
                const obfuscatedComputedChecksum = getObfuscatedChecksum(computedChecksum);

                if (last5FromFile !== obfuscatedComputedChecksum) {
                    console.log(`❌ Filename hash mismatch for ${file.name}`);
                    console.log(`Expected: ${last5FromFile}`);
                    console.log(`Computed: ${obfuscatedComputedChecksum}`);
                    alert(`It appears that "${file.name}" has been edited. Aborting.`);
                    location.reload(); // Refresh page to reset state
                    return;
                } else {
                    console.log(`✅ Filename hash match for ${file.name}`);
                }
            } else {
                console.log(`⚠️ Checksum bypass for ${file.name} due to allowed numeric code`);
            }

            let rows = csvData.split("\n").map(row => row.trim()); // Trim whitespace from each row

            if (rows.length < 4) {
                console.warn(`File "${file.name}" does not have enough data.`);
                readFile(index + 1);
                return;
            }

            let processedRows = [];
            for (let i = 4; i < rows.length; i++) { // Start from the fourth row (index 3)
                if (!rows[i].trim()) {
                    break;
                }

                let rowValues = rows[i].split(",").map(value => value.trim());

                if (rowValues.every(cell => cell === "")) {
                    break;
                }

                processedRows.push(rowValues.map(value => (value === "" ? "" : Number(value) || value)));
            }

            allData = allData.concat(processedRows);
            filesProcessed++;
            readFile(index + 1);
        };

        reader.readAsText(file);
    }

    readFile(0);
});

// ✅ Function to generate SHA-256 checksum
async function generateChecksum(content) {
    const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(content));
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ✅ Extracts obfuscated checksum using the same logic as `exportTotalsToCSV`
function getObfuscatedChecksum(checksum) {
    const halfLength = Math.floor(checksum.length / 2);
    const secondHalf = checksum.slice(halfLength); // Extract second half
    return secondHalf.slice(0, 5).split("").reverse().join(""); // Reverse first 5 chars
}


function parseCSVAndGenerateTable(data) {
                if (!data.length) return;

                rowData = data.map((row, index) => ({ originalIndex: index + 1, data: row }));

                rowData.forEach(row => row.data.sort((a, b) => b - a));

                rowData.sort((rowA, rowB) => {
                    for (let i = 0; i < rowA.data.length; i++) {
                        if (rowA.data[i] !== rowB.data[i]) {
                            return rowB.data[i] - rowA.data[i];
                        }
                    }
                    return 0;
                });

                generateTable();
                generateFrequencyTable();
            }

function generateTable() {
    let tableContainer = document.getElementById('tableContainer');
    if (!tableContainer) {
        console.error("Error: #tableContainer not found.");
        return;
    }

    if (!rowData.length) {
        tableContainer.innerHTML = "<p style='color: lightgray;'>No valid data found.</p>";
        return;
    }

    let tableHtml = `<table id="csvTable" border="1" style="border-collapse: collapse; width: 100%; margin-top: 10px;">
    <thead>
        <tr>
            <th class="original-number" style="background-color: slategray; color: white; padding: 8px;">Orig</th>
            <th class="sorted-number" style="background-color: red; color: white; padding: 8px;">Sort</th>`;

    for (let i = 0; i < rowData[0].data.length; i++) {
        tableHtml += `<th class="other-number" style="background-color: green; color: white; padding: 8px;">${i + 1}</th>`;
    }

    tableHtml += `</tr></thead><tbody>`;

    rowData.forEach((row, rowIndex) => {
        tableHtml += `<tr>`;
        tableHtml += `<td class="original-number" style="background-color: slategray; color: white; padding: 6px; text-align: center;"><strong>${row.originalIndex}</strong></td>`;
        tableHtml += `<td class="sorted-number" style="background-color: red; color: white; padding: 6px; text-align: center;"><strong>${rowIndex + 1}</strong></td>`;

        row.data.forEach(cell => {
            tableHtml += `<td class="other-number" style="background-color: lightgray; color: black; padding: 6px; text-align: center;">${cell === "0" ? '' : cell}</td>`;
        });

        tableHtml += `</tr>`;
    });

    tableHtml += `</tbody></table>`;
    tableContainer.innerHTML = tableHtml;
}

        
function generateFrequencyTable() {
    let frequencyContainer = document.getElementById('frequencyContainer');
    if (!frequencyContainer) {
        console.error("Error: #frequencyContainer not found.");
        return;
    }

    if (!rowData.length) {
        console.warn("No data available for frequency table.");
        frequencyContainer.innerHTML = "<p style='color: lightgray;'>No data available.</p>";
        return;
    }

    let sumCounts = {};
    let totalRows = rowData.length;
    let cumulativeCounts = 0;
    let cumulativeProbabilities = {};

    rowData.forEach(row => {
        let selectedValues = row.data.slice(0, 5);
        let sum = selectedValues.reduce((acc, num) => acc + (isNaN(num) ? 0 : num), 0);
        sumCounts[sum] = (sumCounts[sum] || 0) + 1;
    });

    let sortedSums = Object.keys(sumCounts)
        .map(Number)
        .sort((a, b) => b - a);

    let freqTableHtml = `
    <table id="frequencyTable" border='1' style="border-collapse: collapse; width: 60%; margin-top: 10px;">
    <thead>
        <tr>    
            <th style="padding: 8px; color: salmon; background-color: black;">Sum</th>
            <th style="padding: 8px; color: salmon; background-color: black;">Frequency</th>
            <th style="padding: 8px; color: salmon; background-color: black;">P-Value</th>
            <th style="padding: 8px; color: salmon; background-color: black;">Cumulative</th>
        </tr>
    </thead>
    <tbody>`;

    sortedSums.forEach(sum => {
        cumulativeCounts += sumCounts[sum];
        cumulativeProbabilities[sum] = (cumulativeCounts / totalRows).toFixed(6);
        let cellStyle = (parseFloat(cumulativeProbabilities[sum]) < 0.05)
            ? "color: yellow; font-weight: bold;" 
            : "color: lightgray;";

        freqTableHtml += `
        <tr>
            <td style="padding: 6px; text-align: center; ${cellStyle}">${sum}</td>
            <td style="padding: 6px; text-align: center; ${cellStyle}">${sumCounts[sum]}</td>
            <td style="padding: 6px; text-align: center; ${cellStyle}">${(sumCounts[sum] / totalRows).toFixed(6)}</td>
            <td style="padding: 6px; text-align: center; ${cellStyle}">${cumulativeProbabilities[sum]}</td>
        </tr>`;
    });

    freqTableHtml += `</tbody></table>`;
    frequencyContainer.innerHTML = freqTableHtml;
}


            document.getElementById('reverseSortButton').addEventListener('click', function () {
                rowData = rowData.map(row => ({ originalIndex: row.originalIndex, data: row.data.reverse() }));
                generateTable();
                generateFrequencyTable();
            });
        });
        
// Function to extract all uploaded file names
function getUploadedFileNames() {
    let fileInput = document.getElementById("fileInput");
    if (fileInput.files.length > 0) {
        let fileNames = Array.from(fileInput.files).map(file => file.name); // Get all file names
        return fileNames.join(", "); // Join names with commas
    }
    return "Unknown_Files"; // Default name if no file is selected
}

// Function to generate a formatted timestamp
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

// Function to convert RGB to an array (for jsPDF)
function hexToRGBArray(hex) {
    hex = hex.replace("#", "");
    let bigint = parseInt(hex, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}


// Event listener for Save to PDF button
document.getElementById("savePdfButton").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape" });

    // ✅ Get all selected file names
    const fileNames = getUploadedFileNames();
    const timestamp = getFormattedTimestamp();

    // ✅ Create a shorter filename for saving
    let shortFileName = fileNames.length > 50 ? "Sorted" : fileNames.replace(/\.[^/.]+$/, "").replace(/[, ]+/g, "_");

    const pdfFileName = `${shortFileName}_${timestamp}.pdf`;

    // ✅ Add Filename (displayed inside the PDF)
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 255); // Blue text for filename
    doc.text(`Filename: ${pdfFileName}`, doc.internal.pageSize.width / 2, 10, { align: "center" });

    // ✅ Add Title
    doc.setFontSize(18);
    doc.setTextColor(50, 205, 50); // Light green
    doc.text("Sorted Table & Frequency Distribution", doc.internal.pageSize.width / 2, 20, { align: "center" });

    let startY = 35; // Adjust for filename spacing

    // ✅ Add Explanation Text (if exists)
    let explanationElement = document.getElementById("explanation");
    if (explanationElement) {
        let explanationText = explanationElement.innerText.trim();
        if (explanationText.length > 0) {
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0); // Black
            doc.text(explanationText, doc.internal.pageSize.width / 2, startY, { align: "center", maxWidth: 260 });
            startY += 10; // Adjust start position
        }
    }

    // ✅ Capture Frequency Table (50% Thinner)
    let freqTable = document.getElementById("frequencyTable");
    if (freqTable) {
        let pageWidth = doc.internal.pageSize.width;
        let tableWidth = pageWidth * 0.25; // ✅ Reduce to 50% width
        let marginX = (pageWidth - tableWidth) / 2; // ✅ Center it

        doc.autoTable({
            html: "#frequencyTable",
            startY: startY,
            theme: "grid",
            margin: { left: marginX, right: marginX }, // ✅ Center & reduce width
            tableWidth: tableWidth,
            styles: { fontSize: 9, cellPadding: 2, halign: "center", fontStyle: "bold" },
            headStyles: { fillColor: [0, 0, 255], textColor: [255, 255, 255] }, // Red header
            alternateRowStyles: { fillColor: [240, 240, 240] }
        });

        startY = doc.autoTable.previous.finalY + 10; // Move down for next table
    }

    // ✅ Capture Sorted Table (Full Width)
    let csvTable = document.getElementById("csvTable");
    if (csvTable) {
doc.autoTable({
    html: "#csvTable",
    startY: startY,
    theme: "grid",
    margin: { left: 10, right: 10 }, // 🔹 Reduced margins (default is ~10-20)
    styles: { fontSize: 8.7, cellPadding: 2, halign: "center", fontStyle: "bold" },
    headStyles: { fillColor: [0, 0, 255], textColor: [255, 255, 255] }, // Default: Blue header
    alternateRowStyles: { fillColor: [240, 240, 240] }, // Light gray alternating rows
    didParseCell: function (data) {
        if (data.row.section === "head" && data.column.index >= 2) {
            data.cell.styles.fillColor = [0, 128, 0]; // Green background for data columns
            data.cell.styles.textColor = [255, 255, 255]; // White text
        } else if (data.row.section === "body") { // Apply only to data cells
            if (data.column.index === 0) {
                data.cell.styles.fillColor = [112, 128, 144]; // Slate background
                data.cell.styles.textColor = [255, 255, 255]; // White text
            } else if (data.column.index === 1) {
                data.cell.styles.fillColor = [255, 0, 0]; // Red background
                data.cell.styles.textColor = [255, 255, 255]; // White text
            } else {
                data.cell.styles.fillColor = [255, 255, 224]; // Light gray background for all other data cells
            }
        }
    }
});

    }

    // ✅ ADD A NEW PAGE FOR SOURCE FILES
    doc.addPage();

    // ✅ Source Files Section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 255);
    doc.text("Source Files", doc.internal.pageSize.width / 2, 20, { align: "center" });

    // ✅ File Names List
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    let fileLines = fileNames.split(", ");
    let startYFiles = 30;
    fileLines.forEach(file => {
        if (startYFiles > doc.internal.pageSize.height - 20) {
            doc.addPage(); // ✅ Add new page if needed
            startYFiles = 20;
        }
        doc.text(file, 20, startYFiles);
        startYFiles += 6;
    });

    // ✅ Save the PDF with the generated filename
    doc.save(pdfFileName);
});