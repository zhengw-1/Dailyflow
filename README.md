# DailyFlow for Mac

This folder contains an installable web app version of DailyFlow.

## Easiest setup

1. Upload the contents of this folder to a static website host such as Netlify Drop or GitHub Pages.
2. Open the published link in Safari on your Mac.
3. In Safari, choose **File > Add to Dock**.
4. Name it **DailyFlow** and click **Add**.

It will then open from the Dock like a separate app. Your tasks are saved locally on that Mac.

## Important

- Do not open only `index.html` from Finder if you want install/offline behavior; the folder needs to be served from an `https://` website.
- This version does not sync with iPhone or Apple Calendar.
- Clearing Safari website data or deleting the web app may remove locally saved tasks.

## Version 3 updates
- Drag tasks by the ⋮⋮ handle to change their saved order.
- Today always follows the Mac's current local date.
- Click any date in the calendar to view that day.
- New tasks automatically use the currently selected calendar date.

## Version 5 updates
- Today automatically follows the real calendar date, including when the app stays open across midnight.
- Unfinished tasks carry forward into the new day without changing their original due date.
- Past-due unfinished tasks show a pink/red Overdue date bubble.
- Finish Day moves only checked tasks into Completed; unchecked tasks remain active and carry forward.
- Removed the Apple Calendar sidebar card.
- Drag-and-drop now shows a single insertion line above or below the target task/subtask instead of a dashed box.


## v9 Pastel inline controls
- Change category directly from a pastel category pill on each task card.
- Change priority directly from a pastel priority pill instead of a grey form box.
- Change the due date directly from the pastel-blue date control.
- Removed the Active / Checked dropdown; use the task checkmark to complete or reopen a task.
- Add subtasks directly from a task card without opening the full editor.
- Full Edit remains available for other fields.

## Latest update: saved categories + date range display
- Category presets begin with School, Work, and Personal.
- Add a custom category in the task editor and save it for future tasks.
- Existing categories from older tasks are preserved automatically.
- Category pills size to the selected category text instead of the longest category in the list.
- Task cards show start date first and due date second, including the year.
- Only the due date is editable directly on the task card; use Edit to change both dates.
