TICKETING DASHBOARD - ANGULARJS

Files:
1. index.html  -> Dashboard UI
2. style.css   -> Responsive styling
3. app.js      -> AngularJS logic and data

HOW TO RUN
-----------
Option 1 - Open directly:
    Double-click index.html

Option 2 - Recommended local server:
    Python:
        python -m http.server 8080

    Then open:
        http://localhost:8080

ANGULARJS
---------
This project uses AngularJS 1.8.3 from Google's CDN.

FEATURES
--------
- Dashboard design based on the supplied image
- Summary cards
- Team-member ticket table
- Search team members
- Filter by ticket category
- Sort by name, total, pending, or completed
- Add Ticket popup
- Automatic summary calculation
- Browser localStorage persistence
- Responsive mobile/tablet layout

DATA
----
The initial data matches the supplied dashboard:
Total Tickets: 44
Completed: 5
New Tickets: 20
Development: 4
Dev Support: 3
Pending: 28

NOTE
----
The application is frontend-only. For a real production ticketing system,
connect AngularJS to a backend API/database such as:
Node.js + Express + MySQL/PostgreSQL/MongoDB.


NEW SAVE / SNAPSHOT FEATURES
----------------------------
The dashboard now supports three layers of storage:

1. CURRENT DATA - browser localStorage
   Key:
       ticketDashboardMembers

2. READABLE DATA COPY - browser localStorage
   Key:
       ticketDashboardData

3. SNAPSHOT HISTORY - browser localStorage
   Key:
       ticketDashboardSnapshotHistory

When you click "Save Snapshot":
    - Current dashboard data is saved to localStorage.
    - A JSON file is downloaded.
    - A PNG screenshot of the dashboard is generated and downloaded.
    - Snapshot history is stored in localStorage.

Example generated files:
    ticketing-dashboard-2026-09-23-23-55-10.json
    ticketing-dashboard-2026-09-23-23-55-10.png

IMPORTANT BROWSER LIMITATION
----------------------------
A normal website cannot silently create/write files inside an arbitrary
folder such as:

    images/

because the browser protects the user's file system.

The PNG is therefore downloaded by the browser. You can select/create:

    images/
        snapshots/

and save the PNG there.

If you want TRUE automatic saving to:
    images/
        snapshots/
    data/
        dashboard-data.json

without manually downloading, use a backend application (Node.js/Express)
or the File System Access API with explicit folder permission.

RECOMMENDED PRODUCTION STRUCTURE
--------------------------------
ticketing-dashboard/
|
+-- frontend/
|   +-- index.html
|   +-- style.css
|   +-- app.js
|
+-- data/
|   +-- dashboard-data.json
|
+-- images/
|   +-- snapshots/
|
+-- backend/
    +-- server.js

For a real project, the backend can save ticket data and screenshots
directly to the server and later move the data to MySQL/PostgreSQL.


UPDATED FEATURES
----------------
- Add Team Member button and popup.
- New team members start with all ticket counters at 0.
- Add Ticket now supports selecting MULTIPLE categories in one action.
- Example: add 5 tickets and select New Tickets + Completed + Pending.
  The member's Total Tickets increases by 5 once, while each selected
  category increases by 5.
- Save Snapshot downloads both JSON data and a PNG dashboard image.
- Snapshot history remains available in browser localStorage.


CRUD / TEAM MEMBER MANAGEMENT
-----------------------------
Team members now support CRUD-style management:
- CREATE: Add Team Member (new member starts with all counters at 0)
- READ: View/search/filter/sort all team members
- UPDATE: Edit the member name using the pencil button
- DELETE: Delete a member using the trash button; a confirmation is shown

INITIAL DATA
------------
All existing team members are loaded with:
Total = 0
Completed = 0
New Tickets = 0
Development = 0
Dev Support = 0
Pending = 0

A data-version key is used so the new zero-based initial data replaces an
older localStorage copy the first time this updated version is opened.

NOTE ABOUT TICKET CRUD
----------------------
The current dashboard stores aggregate counters per member, not individual
ticket records. Therefore "Add Ticket" is an aggregate operation. Full
ticket-level Update/Delete is better implemented by storing individual
tickets with fields such as ticketId, title, assignee, category, status,
createdAt, and snapshotImage. This can be added later without changing the
team-member CRUD.
