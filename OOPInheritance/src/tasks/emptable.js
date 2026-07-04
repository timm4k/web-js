"use strict";

App.renderEmpTable = function (container) {
    const employees = [
        new Employee('Jotaro', 'Kujo', 'Star Platinum', 'Marine Biologist', 'Part 3'),
        new Employee('Dio', 'Brando', 'The World', 'Vampire', 'Part 3'),
        new Employee('Joseph', 'Joestar', 'Hermit Purple', 'Hamon User', 'Part 3'),
        new Employee('Giorno', 'Giovanna', 'Gold Experience', 'Boss of Passione', 'Part 5'),
        new Employee('Bruno', 'Bucciarati', 'Sticky Fingers', 'Gang Leader', 'Part 5'),
        new Employee('Noriaki', 'Kakyoin', 'Hierophant Green', 'Student', 'Part 3'),
        new Employee('Jean Pierre', 'Polnareff', 'Silver Chariot', 'Fencer', 'Part 3'),
        new Employee('Rohan', 'Kishibe', 'Heaven\'s Door', 'Mangaka', 'Part 4')
    ];

    const hierarchy = document.createElement('div');
    hierarchy.className = 'hierarchy-block';
    hierarchy.innerHTML = '<span class="hierarchy-label">Class</span><span class="hierarchy-name">EmpTable</span>';

    const purpose = document.createElement('div');
    purpose.className = 'purpose-block';
    purpose.textContent = 'The table below is generated entirely by the EmpTable class. The HTML is created dynamically by getHtml()';

    const empTable = new EmpTable(employees);
    const htmlCode = empTable.getHtml();

    const details = document.createElement('details');

    const summary = document.createElement('summary');
    summary.textContent = 'Show generated HTML';

    const codeBlock = document.createElement('div');
    codeBlock.className = 'generated-code';
    codeBlock.textContent = htmlCode;

    details.appendChild(summary);
    details.appendChild(codeBlock);

    const arrow = document.createElement('div');
    arrow.className = 'section-arrow';
    arrow.textContent = '↓';

    const renderedSection = document.createElement('div');
    renderedSection.className = 'code-section-label';
    renderedSection.textContent = 'Rendered table';

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    tableWrapper.innerHTML = htmlCode;

    container.appendChild(hierarchy);
    container.appendChild(purpose);
    container.appendChild(details);
    container.appendChild(arrow);
    container.appendChild(renderedSection);
    container.appendChild(tableWrapper);
};
