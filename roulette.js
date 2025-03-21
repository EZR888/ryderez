/* Copyright 2025 © EZR Consulting. All rights reserved. */

// Modal functionality
    const modal = document.getElementById('instructionsModal');
    const howToUseButton = document.getElementById('howToUseButton');
    const closeModalButton = document.getElementById('closeModalButton');

    howToUseButton.onclick = function() {
      modal.style.display = 'flex';
    }

    closeModalButton.onclick = function() {
      modal.style.display = 'none';
    }

    // Close the modal if clicked outside of the modal content
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    }

// Hide the p-value table by default when the page loads
window.addEventListener('load', function() {
    let tableContainer = document.getElementById('pValueTableContainer');
    if (tableContainer) {
        tableContainer.style.display = 'none';
    }
});

// Function to toggle visibility of the p-value table
function togglePValueTable(visible) {
    let tableContainer = document.getElementById('pValueTableContainer');
    if (tableContainer) {
        tableContainer.style.display = visible ? 'block' : 'none';
    }
}

// Add keyboard shortcuts: 'h' (or 'H') to hide, 'u' (or 'U') to unhide
document.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase(); // Convert key to lowercase for uniformity

    if (key === 'h') {
        console.log("🔴 Hiding P-Values Table...");
        togglePValueTable(false);
    } else if (key === 'u') {
        console.log("🟢 Unhiding P-Values Table...");
        togglePValueTable(true);
    }
});