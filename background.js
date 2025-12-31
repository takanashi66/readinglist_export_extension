// Open the side panel by clicking the action toolbar icon
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

// Listen for keyboard commands
chrome.commands.onCommand.addListener(async (command) => {
    if (command === "add_to_reading_list") {
        try {
            const [tab] = await chrome.tabs.query({
                active: true,
                lastFocusedWindow: true,
            });

            if (!tab) {
                console.warn("No active tab found.");
                return;
            }

            if (!tab.url.startsWith("http")) {
                console.warn("Can only add web pages (http/https).");
                return;
            }

            await chrome.readingList.addEntry({
                title: tab.title,
                url: tab.url,
                hasBeenRead: false,
            });

            console.log(`Added to reading list: ${tab.title}`);

            // Show toast notification on the page
            chrome.scripting
                .executeScript({
                    target: { tabId: tab.id },
                    func: () => {
                        const toast = document.createElement("div");
                        toast.textContent = "リーディングリストに保存しました";
                        Object.assign(toast.style, {
                            position: "fixed",
                            bottom: "24px",
                            right: "24px",
                            backgroundColor: "#202124",
                            color: "#ffffff",
                            padding: "12px 24px",
                            borderRadius: "8px",
                            zIndex: "2147483647",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            transition: "opacity 0.3s ease-in-out",
                            opacity: "0",
                            fontFamily:
                                "-apple-system, BlinkMacSystemFont, sans-serif",
                            fontSize: "14px",
                            pointerEvents: "none",
                        });

                        document.body.appendChild(toast);

                        // Fade in
                        requestAnimationFrame(() => {
                            toast.style.opacity = "1";
                        });

                        // Fade out and remove
                        setTimeout(() => {
                            toast.style.opacity = "0";
                            setTimeout(() => toast.remove(), 300);
                        }, 3000);
                    },
                })
                .catch((err) => console.error("Failed to show toast:", err));

            // Notify other parts of the extension (e.g., side panel) to update UI
            chrome.runtime
                .sendMessage({ type: "READING_LIST_UPDATED" })
                .catch(() => {
                    // Ignore error if no receiver (side panel close)
                });
        } catch (error) {
            console.error("Failed to add to reading list:", error);
        }
    }
});
