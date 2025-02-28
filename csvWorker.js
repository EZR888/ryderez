self.onmessage = function (e) {
    const { totalRows, chunkSize } = e.data;
    let generatedRows = 0;

    // CSV Header
    const header = "Row," + Array.from({ length: 38 }, (_, i) => `Col${i + 1}`).join(",") + "\n";
    const fileChunks = [header]; // Store chunks for streaming

    function getRandomRow(rowNum) {
        let rowCounts = Array(38).fill(0);

        // Pick 38 numbers and update respective columns
        for (let i = 0; i < 38; i++) {
            let randomPick = Math.floor(Math.random() * 38); // Pick a number 0-37
            rowCounts[randomPick]++; // Increment that column
        }

        return rowNum + "," + rowCounts.join(",");
    }

    function generateChunk() {
        let chunk = [];
        for (let i = 0; i < chunkSize && generatedRows < totalRows; i++) {
            chunk.push(getRandomRow(generatedRows + 1));
            generatedRows++;
        }

        // Store chunk and free memory
        fileChunks.push(chunk.join("\n"));
        chunk = null;

        // Send progress update to main thread
        self.postMessage({ type: "progress", generatedRows });

        if (generatedRows < totalRows) {
            setTimeout(generateChunk, 0); // Yield execution to prevent blocking
        } else {
            // Create CSV Blob and send it back
            const csvBlob = new Blob(fileChunks, { type: "text/csv" });
            self.postMessage({ type: "done", csvBlob });
        }
    }

    generateChunk();
};
