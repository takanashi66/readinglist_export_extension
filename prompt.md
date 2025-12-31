# Role: Senior Browser Extension Engineer (UX & State Management Expert)
Your task is to implement "Read/Unread Status Management" for the Side Panel Reading List extension.

<context>
The extension currently lists reading list items. We need to manage their status: items marked as "read" should appear semi-transparent, and users should be able to toggle this status.
</context>

<additional_requirements>
1. **Visual Style**:
    - Items with `status: 'read'` must have an opacity of approximately 0.5 to appear translucent.
    - Items with `status: 'unread'` remain at full opacity.
2. **Status Toggle Logic**:
    - Add a "Check" icon or a "Mark as Read/Unread" button to each list item.
    - When clicked, toggle the status using `chrome.readingList.update({ url: url, status: newStatus })`.
3. **Automatic Update**:
    - Optional: When a user clicks an item to open the URL, automatically update its status to 'read'.
4. **Instant UI Refresh**:
    - The list must refresh immediately after a status update to reflect the new visual state.
</additional_requirements>

<task_breakdown (DEPTH Method)>
- **CSS Update**: Create a `.is-read` class with `opacity: 0.5;` and a transition effect.
- **JS Logic (Rendering)**: 
    - When building the list, check the `item.status` from the API result.
    - If `item.status === 'read'`, apply the `.is-read` class to the container.
- **JS Logic (Events)**:
    - Implement the toggle function with `chrome.readingList.update`.
    - Handle potential errors if the URL is missing or the update fails.
</task_breakdown>

<constraints>
- **No Full Redraw**: Focus on updating `panel.js` (rendering/event logic) and `panel.css`.
- **Language**: Instructions and code comments in English.
- **Safety**: Use `event.stopPropagation()` for the toggle button to prevent accidentally opening the URL.
</constraints>

# Answer (COSTAR-A)
Provide the updated code snippets for:
1. `panel.css` (The transparency styles)
2. `panel.js` (The status checking logic during render and the update event handler)