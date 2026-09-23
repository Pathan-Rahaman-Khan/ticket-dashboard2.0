var app = angular.module("ticketDashboardApp", []);

app.controller("DashboardController", function ($scope, $filter) {

  // Initial team members. All ticket counters start at ZERO.
  var defaultMembers = [
    { name: "Divya", total: 0, completed: 0, newTickets: 0, development: 0, support: 0, pending: 0 },
    { name: "pathan munna", total: 0, completed: 0, newTickets: 0, development: 0, support: 0, pending: 0 },
    { name: "Afrana Shaik", total: 0, completed: 0, newTickets: 0, development: 0, support: 0, pending: 0 },
    { name: "Subhani Shaik", total: 0, completed: 0, newTickets: 0, development: 0, support: 0, pending: 0 },
    { name: "SivaPrasad Boddeda", total: 0, completed: 0, newTickets: 0, development: 0, support: 0, pending: 0 },
    { name: "Jagadeswari Perni", total: 0, completed: 0, newTickets: 0, development: 0, support: 0, pending: 0 },
    { name: "Pathan Rahaman Khan", total: 0, completed: 0, newTickets: 0, development: 0, support: 0, pending: 0 }
  ];
  function loadMembers() {
    // Bump this version whenever the shipped initial data should replace
    // an older browser localStorage copy.
    var DATA_VERSION = "2-zero-initial-data";
    var savedVersion = localStorage.getItem("ticketDashboardDataVersion");
    var saved = localStorage.getItem("ticketDashboardMembers");

    if (savedVersion !== DATA_VERSION) {
      localStorage.removeItem("ticketDashboardMembers");
      localStorage.removeItem("ticketDashboardData");
      localStorage.setItem("ticketDashboardDataVersion", DATA_VERSION);
      return angular.copy(defaultMembers);
    }

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return angular.copy(defaultMembers);
      }
    }

    return angular.copy(defaultMembers);
  }

  $scope.members = loadMembers();

  $scope.searchText = "";
  $scope.statusFilter = "";
  $scope.sortField = "name";
  $scope.reverseSort = false;
  $scope.showModal = false;

  $scope.newTicket = {
    member: "",
    quantity: 1,
    categories: {
      completed: false,
      newTickets: false,
      development: false,
      support: false,
      pending: false
    }
  };

  $scope.newMember = {
    name: ""
  };
  $scope.showMemberModal = false;
  $scope.editingMember = null;

  $scope.lastUpdated = new Date();
  $scope.saveMessage = "";

  // Snapshot history is stored separately from the current dashboard data.
  var savedHistory = localStorage.getItem("ticketDashboardSnapshotHistory");
  try {
    $scope.snapshotHistory = savedHistory ? JSON.parse(savedHistory) : [];
  } catch (e) {
    $scope.snapshotHistory = [];
  }

  $scope.stats = {
    total: 0,
    completed: 0,
    newTickets: 0,
    development: 0,
    support: 0,
    pending: 0
  };

  function saveData() {
    // Main working data.
    localStorage.setItem(
      "ticketDashboardMembers",
      JSON.stringify($scope.members)
    );

    // Also keep a readable copy of the current dashboard data in localStorage.
    localStorage.setItem(
      "ticketDashboardData",
      JSON.stringify({
        updatedAt: new Date().toISOString(),
        stats: $scope.stats,
        members: $scope.members
      }, null, 2)
    );
  }

  function makeSnapshotObject() {
    return {
      savedAt: new Date().toISOString(),
      stats: angular.copy($scope.stats),
      members: angular.copy($scope.members)
    };
  }

  function makeFileName() {
    var d = new Date();
    function pad(n) { return String(n).padStart(2, "0"); }

    return "ticketing-dashboard-" +
      d.getFullYear() + "-" +
      pad(d.getMonth() + 1) + "-" +
      pad(d.getDate()) + "-" +
      pad(d.getHours()) + "-" +
      pad(d.getMinutes()) + "-" +
      pad(d.getSeconds());
  }

  function downloadTextFile(fileName, content, mimeType) {
    var blob = new Blob([content], { type: mimeType });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function saveSnapshotRecord(snapshot, fileName) {
    $scope.snapshotHistory.push({
      fileName: fileName + ".png",
      savedAt: snapshot.savedAt,
      stats: snapshot.stats
    });

    // Keep the most recent 20 records to avoid unlimited localStorage growth.
    if ($scope.snapshotHistory.length > 20) {
      $scope.snapshotHistory = $scope.snapshotHistory.slice(-20);
    }

    localStorage.setItem(
      "ticketDashboardSnapshotHistory",
      JSON.stringify($scope.snapshotHistory)
    );
  }

  function calculateStats() {
    var stats = {
      total: 0,
      completed: 0,
      newTickets: 0,
      development: 0,
      support: 0,
      pending: 0
    };

    angular.forEach($scope.members, function (member) {
      stats.total += Number(member.total) || 0;
      stats.completed += Number(member.completed) || 0;
      stats.newTickets += Number(member.newTickets) || 0;
      stats.development += Number(member.development) || 0;
      stats.support += Number(member.support) || 0;
      stats.pending += Number(member.pending) || 0;
    });

    $scope.stats = stats;
  }

  /*
   * The category filter works by checking whether
   * the selected category has a value greater than zero.
   */
  $scope.memberFilter = function (member) {
    var search = ($scope.searchText || "").toLowerCase();

    if (search && member.name.toLowerCase().indexOf(search) === -1) {
      return false;
    }

    if ($scope.statusFilter) {
      return Number(member[$scope.statusFilter]) > 0;
    }

    return true;
  };

  $scope.$watchGroup(
    ["searchText", "statusFilter"],
    function () {
      // Angular automatically refreshes the table.
    }
  );

  $scope.$watch("sortField", function () {
    // Angular automatically applies the selected sort.
  });

  $scope.openAddTicket = function () {
    $scope.newTicket = {
      member: "",
      quantity: 1,
      categories: {
        completed: false,
        newTickets: false,
        development: false,
        support: false,
        pending: false
      }
    };
    $scope.showModal = true;
  };

  $scope.closeModal = function () {
    $scope.showModal = false;
  };

  $scope.openAddMember = function () {
    $scope.newMember = { name: "" };
    $scope.editingMember = null;
    $scope.showMemberModal = true;
  };

  $scope.openEditMember = function (member) {
    $scope.editingMember = member;
    $scope.newMember = { name: member.name };
    $scope.showMemberModal = true;
  };

  $scope.closeMemberModal = function () {
    $scope.showMemberModal = false;
    $scope.editingMember = null;
  };

  $scope.saveMember = function () {
    var name = ($scope.newMember.name || "").trim();

    if (!name) {
      $scope.saveMessage = "Enter a team member name.";
      return;
    }

    var duplicate = $scope.members.some(function (member) {
      return member !== $scope.editingMember &&
        member.name.toLowerCase() === name.toLowerCase();
    });

    if (duplicate) {
      $scope.saveMessage = "Team member already exists.";
      return;
    }

    if ($scope.editingMember) {
      var oldName = $scope.editingMember.name;
      $scope.editingMember.name = name;
      $scope.saveMessage = "Team member updated: " + oldName + " → " + name;
    } else {
      $scope.members.push({
        name: name,
        total: 0,
        completed: 0,
        newTickets: 0,
        development: 0,
        support: 0,
        pending: 0
      });
      $scope.saveMessage = "New team member added: " + name;
    }

    calculateStats();
    saveData();
    $scope.lastUpdated = new Date();
    $scope.closeMemberModal();
  };

  // Backward-compatible function name.
  $scope.addMember = $scope.saveMember;

  $scope.deleteMember = function (member) {
    var message =
      'Delete "' + member.name + '"?\n\n' +
      "All ticket counters for this member will also be removed.";

    if (!window.confirm(message)) {
      return;
    }

    var index = $scope.members.indexOf(member);
    if (index === -1) {
      return;
    }

    $scope.members.splice(index, 1);
    calculateStats();
    saveData();
    $scope.lastUpdated = new Date();
    $scope.saveMessage = "Team member deleted: " + member.name;
  };

  $scope.addTicket = function () {
    var quantity = Number($scope.newTicket.quantity);
    var categories = $scope.newTicket.categories || {};
    var selectedCategories = [];

    angular.forEach(
      ["completed", "newTickets", "development", "support", "pending"],
      function (category) {
        if (categories[category]) {
          selectedCategories.push(category);
        }
      }
    );

    if (!$scope.newTicket.member ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        selectedCategories.length === 0) {
      $scope.saveMessage = "Select a member, quantity, and at least one category.";
      return;
    }

    var selectedMember = $filter("filter")(
      $scope.members,
      { name: $scope.newTicket.member }
    )[0];

    if (!selectedMember) {
      return;
    }

    /*
     * One ticket quantity can be assigned to multiple categories in a
     * single action. Total Tickets increases only once, while every
     * selected category receives the same quantity.
     */
    selectedMember.total += quantity;

    selectedCategories.forEach(function (category) {
      selectedMember[category] += quantity;
    });

    calculateStats();
    saveData();

    $scope.lastUpdated = new Date();
    $scope.saveMessage =
      quantity + " ticket(s) added to " + selectedCategories.length + " category(s).";
    $scope.showModal = false;
  };

  /*
   * SAVE SNAPSHOT
   * 1. Saves current data to localStorage.
   * 2. Downloads a JSON data file.
   * 3. Captures the dashboard as a PNG.
   * 4. Stores snapshot history in localStorage.
   *
   * Browser security normally does not allow a website to silently
   * write files into an arbitrary "images" folder. The PNG download
   * can be selected/saved into your Images/Snapshots folder.
   */
  $scope.saveSnapshot = function () {
    saveData();

    var snapshot = makeSnapshotObject();
    var fileName = makeFileName();

    // Download the data as a separate JSON file.
    downloadTextFile(
      fileName + ".json",
      JSON.stringify(snapshot, null, 2),
      "application/json;charset=utf-8"
    );

    var dashboard = document.getElementById("dashboardCapture");

    if (!dashboard || typeof html2canvas === "undefined") {
      $scope.saveMessage = "Data saved. PNG library is not available.";
      saveSnapshotRecord(snapshot, fileName);
      return;
    }

    html2canvas(dashboard, {
      scale: 1.5,
      backgroundColor: "#f7fbff",
      useCORS: true
    }).then(function (canvas) {
      canvas.toBlob(function (blob) {
        if (!blob) {
          return;
        }

        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");

        link.href = url;
        link.download = fileName + ".png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(function () {
          URL.revokeObjectURL(url);
        }, 1000);

        saveSnapshotRecord(snapshot, fileName);

        $scope.saveMessage =
          "Saved data + JSON + PNG snapshot: " + fileName;
        $scope.$applyAsync();

      }, "image/png");
    }).catch(function () {
      saveSnapshotRecord(snapshot, fileName);
      $scope.saveMessage = "Data and JSON saved, but PNG capture failed.";
      $scope.$applyAsync();
    });
  };

  $scope.downloadDataFile = function () {
    saveData();

    var fileName = makeFileName() + ".json";

    var data = {
      exportedAt: new Date().toISOString(),
      stats: $scope.stats,
      members: $scope.members
    };

    downloadTextFile(
      fileName,
      JSON.stringify(data, null, 2),
      "application/json;charset=utf-8"
    );

    $scope.saveMessage = "Dashboard data exported.";
  };

  $scope.clearSnapshotHistory = function () {
    $scope.snapshotHistory = [];
    localStorage.removeItem("ticketDashboardSnapshotHistory");
    $scope.saveMessage = "Snapshot history cleared.";
  };

  $scope.resetDashboard = function () {
    localStorage.setItem("ticketDashboardDataVersion", "2-zero-initial-data");
    $scope.members = angular.copy(defaultMembers);
    calculateStats();
    saveData();
    $scope.lastUpdated = new Date();
  };

  calculateStats();
});
