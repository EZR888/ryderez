self.onmessage = function (e) {
    const { totalRows, chunkSize } = e.data;
    let generatedRows = 0;

    // Define the custom column orders
    const topIndices = [5,22,34,15,3,24,36,13,1,37,27,10,25,29,12,8,19,31,18];
    const bottomIndices = [17,32,20,7,11,30,26,9,28,0,2,14,35,23,4,16,33,21,6];

    // CSV Headers using custom column orders
    const headerTop = "Row," + topIndices.map(i => `Col${i + 1}`).join(",") + "\n";
    const headerBottom = "Row," + bottomIndices.map(i => `Col${i + 1}`).join(",") + "\n";

    const fileChunksTop = [headerTop]; // Store chunks for 10m_top.csv
    const fileChunksBottom = [headerBottom]; // Store chunks for 10m_bottom.csv

    function getRandomRow(rowNum) {
        let rowCounts = Array(38).fill(0);

        // Pick 38 numbers and update respective columns
        for (let i = 0; i < 38; i++) {
            let randomPick = Math.floor(Math.random() * 38); // Pick a number from 0-37
            rowCounts[randomPick]++; // Increment that column
        }

        // Reorder based on top and bottom indices
        const topHalf = topIndices.map(idx => rowCounts[idx]).join(",");
        const bottomHalf = bottomIndices.map(idx => rowCounts[idx]).join(",");

        return {
            topRow: rowNum + "," + topHalf,
            bottomRow: rowNum + "," + bottomHalf
        };
    }

    function generateChunk() {
        let chunkTop = [];
        let chunkBottom = [];

        for (let i = 0; i < chunkSize && generatedRows < totalRows; i++) {
            const { topRow, bottomRow } = getRandomRow(generatedRows + 1);
            chunkTop.push(topRow);
            chunkBottom.push(bottomRow);
            generatedRows++;
        }

        // Append chunk with a newline at the end
        fileChunksTop.push(chunkTop.join("\n") + "\n");
        fileChunksBottom.push(chunkBottom.join("\n") + "\n");

        chunkTop = null;
        chunkBottom = null; // Free memory

        // Send progress update to the main thread
        self.postMessage({ type: "progress", generatedRows });

        if (generatedRows < totalRows) {
            setTimeout(generateChunk, 0); // Yield execution to prevent blocking
        } else {
            // Create CSV Blobs for both files and send them back
            const csvBlobTop = new Blob(fileChunksTop, { type: "text/csv" });
            const csvBlobBottom = new Blob(fileChunksBottom, { type: "text/csv" });

            self.postMessage({ type: "done", csvBlobTop, csvBlobBottom });
        }
    }

    generateChunk();
};
