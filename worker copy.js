self.onmessage = function (e) {
    const { numRuns, chunkSize } = e.data;  
    let totalProcessed = 0;

    function getRandomCounts(numPicks) {
        const counts = Array(38).fill(0);
        for (let i = 0; i < numPicks; i++) {
            const array = new Uint32Array(1);
            self.crypto.getRandomValues(array);
            const pickedNumber = array[0] % 38; 
            counts[pickedNumber]++;
        }
        return counts;
    }

    function processNextChunk() {
        let chunk = [];
        let runsToProcess = Math.min(chunkSize, numRuns - totalProcessed);

        for (let i = 0; i < runsToProcess; i++) {
            chunk.push(getRandomCounts(38));
        }

        self.postMessage({ type: "chunk", data: chunk });  // ✅ Send data with type
        totalProcessed += runsToProcess;

        if (totalProcessed < numRuns) {
            setTimeout(processNextChunk, 0);
        } else {
            self.postMessage({ type: "done", totalRuns: numRuns });  // ✅ Send totalRuns when finished
        }
    }

    processNextChunk();
};
