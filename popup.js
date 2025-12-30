document.addEventListener("DOMContentLoaded", () => {
    const downloadBtn = document.getElementById("downloadBtn");
    const saveBtn = document.getElementById("saveBtn");
    const statusDiv = document.getElementById("status");

    saveBtn.addEventListener("click", async () => {
        try {
            saveBtn.disabled = true;
            statusDiv.textContent = "Saving...";

            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
            });
            if (!tab) {
                throw new Error("No active tab found");
            }

            await chrome.readingList.addEntry({
                title: tab.title,
                url: tab.url,
                hasBeenRead: false,
            });

            statusDiv.textContent = "Saved!";
        } catch (error) {
            console.error("Save failed:", error);
            // Handle specific duplicate error or generic
            statusDiv.textContent = "Failed to save.";
        } finally {
            setTimeout(() => {
                saveBtn.disabled = false;
            }, 2000);
        }
    });

    downloadBtn.addEventListener("click", async () => {
        try {
            // Disable button during process
            downloadBtn.disabled = true;
            statusDiv.textContent = "Fetching data...";

            // 1. Query the Reading List
            const items = await chrome.readingList.query({});

            if (!items || items.length === 0) {
                statusDiv.textContent = "No items found.";
                downloadBtn.disabled = false;
                return;
            }

            // 2. Format the data
            const exportData = items.map((item) => ({
                title: item.title,
                url: item.url,
            }));

            // 3. Create Blob
            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);

            // 4. Download
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const filename = `reading-list-${timestamp}.json`;

            await chrome.downloads.download({
                url: url,
                filename: filename,
                saveAs: true, // Prompt user for save location
            });

            statusDiv.textContent = "Done!";
        } catch (error) {
            console.error("Export failed:", error);
            statusDiv.textContent = "Error occurred.";
        } finally {
            // Re-enable button after a short delay
            setTimeout(() => {
                downloadBtn.disabled = false;
            }, 2000);
        }
    });
});
