"use strict";

const INITIAL_CLASSROOMS = [
    { id: 1, name: 'B-11', seats: 18, department: 'Biology', floor: 1, building: 'B', hasProjector: true, hasComputers: true },
    { id: 2, name: '102', seats: 20, department: 'Mathematics', floor: 1, building: 'A', hasProjector: true, hasComputers: false },
    { id: 3, name: 'C-01', seats: 20, department: 'Linguistics', floor: 0, building: 'C', hasProjector: true, hasComputers: false },
    { id: 4, name: '301', seats: 10, department: 'Biology', floor: 3, building: 'A', hasProjector: false, hasComputers: false },
    { id: 5, name: '202', seats: 14, department: 'Computer Science', floor: 2, building: 'A', hasProjector: false, hasComputers: true },
    { id: 6, name: 'B-01', seats: 16, department: 'Computer Science', floor: 0, building: 'B', hasProjector: true, hasComputers: true },
    { id: 7, name: '103', seats: 12, department: 'Linguistics', floor: 1, building: 'A', hasProjector: false, hasComputers: false },
    { id: 8, name: '203', seats: 20, department: 'Mathematics', floor: 2, building: 'A', hasProjector: true, hasComputers: false },
    { id: 9, name: 'C-02', seats: 12, department: 'Mathematics', floor: 0, building: 'C', hasProjector: false, hasComputers: true },
    { id: 10, name: '201', seats: 18, department: 'Physics', floor: 2, building: 'A', hasProjector: true, hasComputers: true },
    { id: 11, name: 'B-02', seats: 14, department: 'Physics', floor: 0, building: 'B', hasProjector: true, hasComputers: false },
    { id: 12, name: '101', seats: 15, department: 'Computer Science', floor: 1, building: 'A', hasProjector: true, hasComputers: true },
];

let classrooms = [];
let classroomSort = { field: 'department', asc: true };

function initClassrooms() {
    const saved = loadFromStorage(STORAGE_KEYS.classrooms, null);
    classrooms = saved ? saved : JSON.parse(JSON.stringify(INITIAL_CLASSROOMS));
    populateFilters();
    renderClassrooms();
}

function updateSortButtons() {
    $('[data-classroom-sort]').each(function () {
        const field = $(this).data('classroom-sort');
        const labels = {
            seats: 'Seats',
            name: 'Name',
            department: 'Dept',
            building: 'Building',
            floor: 'Floor',
        };
        let label = labels[field] || field;
        if (classroomSort.field === field) {
            label += classroomSort.asc ? ' \u2191' : ' \u2193';
        } else {
            label += ' \u2195';
        }
        $(this).text(label);
    });
}

function populateFilters() {
    const departments = classrooms
        .map(function (r) { return r.department; })
        .filter(function (d, i, self) { return self.indexOf(d) === i; })
        .sort();

    const buildings = classrooms
        .map(function (r) { return r.building; })
        .filter(function (b, i, self) { return self.indexOf(b) === i; })
        .sort();

    const $dept = $('#filter-department');
    $dept.find('option:not(:first)').remove();
    departments.forEach(function (d) {
        $dept.append('<option value="' + escapeHtml(d) + '">' + escapeHtml(d) + '</option>');
    });

    const $groupDept = $('#group-department');
    $groupDept.find('option').remove();
    departments.forEach(function (d) {
        $groupDept.append('<option value="' + escapeHtml(d) + '">' + escapeHtml(d) + '</option>');
    });

    const $bld = $('#filter-building');
    $bld.find('option:not(:first)').remove();
    buildings.forEach(function (b) {
        $bld.append('<option value="' + escapeHtml(b) + '">Building ' + escapeHtml(b) + '</option>');
    });
}

function getFilteredClassrooms() {
    const department = $('#filter-department').val();
    const building = $('#filter-building').val();
    const equipment = $('#filter-equipment').val();

    let result = classrooms.slice();

    if (department !== 'all') {
        result = result.filter(function (r) { return r.department === department; });
    }

    if (building !== 'all') {
        result = result.filter(function (r) { return r.building === building; });
    }

    if (equipment === 'projector') {
        result = result.filter(function (r) { return r.hasProjector; });
    } else if (equipment === 'computers') {
        result = result.filter(function (r) { return r.hasComputers; });
    } else if (equipment === 'both') {
        result = result.filter(function (r) { return r.hasProjector && r.hasComputers; });
    }

    return result;
}

function sortClassrooms(items, field, asc) {
    return items.slice().sort(function (a, b) {
        if (field === 'department' || field === 'building') {
            const valA = a[field].toLowerCase();
            const valB = b[field].toLowerCase();
            if (valA < valB) return asc ? -1 : 1;
            if (valA > valB) return asc ? 1 : -1;
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        }
        if (field === 'name') {
            const valA = a.name.toLowerCase();
            const valB = b.name.toLowerCase();
            if (valA < valB) return asc ? -1 : 1;
            if (valA > valB) return asc ? 1 : -1;
            return 0;
        }
        const valA = Number(a[field]);
        const valB = Number(b[field]);
        return asc ? valA - valB : valB - valA;
    });
}

function renderClassrooms() {
    let items = getFilteredClassrooms();
    const sortField = classroomSort.field;
    const sortAsc = classroomSort.asc;

    if (sortField) {
        items = sortClassrooms(items, sortField, sortAsc);
    }

    updateSortButtons();

    let html = '';

    if (items.length === 0) {
        html += '<div class="empty-state">No classrooms found</div>';
    } else {
        items.forEach(function (room) {
            let equipHtml = '';
            equipHtml += '<span class="equip' + (room.hasProjector ? ' on' : '') + '">' +
                (room.hasProjector ? '✓' : '✗') + ' Projector</span>';
            equipHtml += '<span class="equip' + (room.hasComputers ? ' on' : '') + '">' +
                (room.hasComputers ? '✓' : '✗') + ' Computers</span>';

            html += '<div class="classroom-card" style="margin-bottom:8px;">' +
                '<div class="flex-row between">' +
                '<div>' +
                '<span class="name">' + escapeHtml(room.name) + '</span>' +
                '<span style="margin-left:12px;color:#7a6a9a;font-size:13px;">' +
                escapeHtml(room.department) + '</span>' +
                '</div>' +
                '<div style="text-align:right;">' +
                '<div style="font-size:22px;color:#b366ff;font-weight:300;">' + room.seats + ' <span style="font-size:12px;color:#7a6a9a;">seats</span></div>' +
                '<div style="font-size:12px;color:#7a6a9a;">Bld ' + escapeHtml(room.building) + ', floor ' + room.floor + '</div>' +
                '</div>' +
                '</div>' +
                '<div style="margin-top:8px;">' + equipHtml + '</div>' +
                '<button class="btn small danger" data-classroom-delete="' + room.id + '" style="margin-top:8px;">Remove</button>' +
                '</div>';
        });
    }

    $('#classroom-list-container').html(html);
    renderClassroomStats();
}

function renderClassroomStats() {
    const totalRooms = classrooms.length;
    const totalSeats = classrooms.reduce(function (sum, r) { return sum + r.seats; }, 0);
    const avgSeats = totalRooms > 0 ? (totalSeats / totalRooms).toFixed(1) : 0;

    const deptCounts = classrooms.reduce(function (acc, r) {
        if (!acc[r.department]) acc[r.department] = 0;
        acc[r.department]++;
        return acc;
    }, {});

    const withProjector = classrooms.filter(function (r) { return r.hasProjector; }).length;
    const withComputers = classrooms.filter(function (r) { return r.hasComputers; }).length;

    const html = '' +
        '<div class="stat-item"><div class="stat-value">' + totalRooms + '</div><div class="stat-label">Total rooms</div></div>' +
        '<div class="stat-item"><div class="stat-value">' + totalSeats + '</div><div class="stat-label">Total seats</div></div>' +
        '<div class="stat-item"><div class="stat-value">' + avgSeats + '</div><div class="stat-label">Avg capacity</div></div>' +
        '<div class="stat-item"><div class="stat-value">' + withProjector + '</div><div class="stat-label">With projector</div></div>' +
        '<div class="stat-item"><div class="stat-value">' + withComputers + '</div><div class="stat-label">With computers</div></div>';

    $('#classroom-stats').html(html);
}

function findClassroomForGroup() {
    const name = $('#group-name').val().trim();
    const students = parseInt($('#group-students').val(), 10);
    const department = $('#group-department').val();

    if (!name || !students || students < 1) {
        $('#group-result').html('<div class="group-match not-found">Fill in group details correctly</div>');
        return;
    }

    let suitable = classrooms.filter(function (r) {
        return r.department === department && r.seats >= students;
    });

    suitable.sort(function (a, b) { return a.seats - b.seats; });

    if (suitable.length === 0) {
        const alternative = classrooms.slice().sort(function (a, b) { return a.seats - b.seats; });
        const alt = alternative.find(function (r) { return r.seats >= students; });

        if (alt) {
            $('#group-result').html(
                '<div class="group-match">' +
                'Room <strong>' + escapeHtml(alt.name) + '</strong> (' + alt.seats + ' seats, bld ' + escapeHtml(alt.building) +
                ') can fit the group but belongs to ' + escapeHtml(alt.department) +
                '. Your department (' + escapeHtml(department) + ') has no available rooms.' +
                '</div>'
            );
        } else {
            $('#group-result').html(
                '<div class="group-match not-found">' +
                'No classroom can accommodate ' + students + ' students.' +
                '</div>'
            );
        }
        return;
    }

    const best = suitable[0];
    const listHtml = suitable.map(function (r) {
        return escapeHtml(r.name) + ' (' + r.seats + ' seats, bld ' + escapeHtml(r.building) + ')';
    }).join(', ');

    $('#group-result').html(
        '<div class="group-match">' +
        'Group <strong>' + escapeHtml(name) + '</strong> (' + students + ' students, ' + escapeHtml(department) + ') ' +
        'can use: <strong>' + listHtml + '</strong>. ' +
        'Best fit: room <strong>' + escapeHtml(best.name) + '</strong> with ' + best.seats + ' seats.' +
        '</div>'
    );
}

$(document).ready(function () {
    initClassrooms();

    $('#filter-department, #filter-building, #filter-equipment').on('change', function () {
        renderClassrooms();
    });

    $('[data-classroom-sort]').on('click', function () {
        const field = $(this).data('classroom-sort');
        if (classroomSort.field === field) {
            classroomSort.asc = !classroomSort.asc;
        } else {
            classroomSort.field = field;
            classroomSort.asc = true;
        }
        renderClassrooms();
    });

    $('#btn-find-group').on('click', function () {
        findClassroomForGroup();
    });

    $('#group-students, #group-name').on('keypress', function (e) {
        if (e.which === 13) $('#btn-find-group').trigger('click');
    });

    $('#classroom-list-container').on('click', '[data-classroom-delete]', function () {
        const id = parseInt($(this).data('classroom-delete'), 10);
        if (!confirm('Remove classroom ' + classrooms.find(function (r) { return r.id === id; }).name + '?')) return;
        classrooms = classrooms.filter(function (r) { return r.id !== id; });
        saveToStorage(STORAGE_KEYS.classrooms, classrooms);
        populateFilters();
        renderClassrooms();
    });
});
