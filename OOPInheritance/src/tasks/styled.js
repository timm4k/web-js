"use strict";

App.renderStyledTable = function (container) {
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
    hierarchy.innerHTML = '<span class="hierarchy-label">Class</span><span class="hierarchy-name">StyledEmpTable</span><span class="hierarchy-label">Inheritance</span><span class="hierarchy-chain">StyledEmpTable → EmpTable</span>';

    const purpose = document.createElement('div');
    purpose.className = 'purpose-block';
    purpose.textContent = 'EmpTable generates only HTML. StyledEmpTable extends it and additionally injects CSS styles before the HTML';

    const styledTable = new StyledEmpTable(employees);
    const plainTable = new EmpTable(employees);
    let showingStyled = true;

    const fullHtml = styledTable.getHtml();

    const styleMatch = fullHtml.match(/<style>[\s\S]*?<\/style>/);
    const cssCode = styleMatch ? styleMatch[0] : '';
    const htmlOnly = fullHtml.replace(/<style>[\s\S]*?<\/style>\s*\n?/, '');

    const cssDetails = document.createElement('details');

    const cssSummary = document.createElement('summary');
    cssSummary.textContent = 'Show generated CSS (from getStyles())';

    const cssBlock = document.createElement('div');
    cssBlock.className = 'generated-code';
    cssBlock.textContent = cssCode;

    cssDetails.appendChild(cssSummary);
    cssDetails.appendChild(cssBlock);

    const arrow1 = document.createElement('div');
    arrow1.className = 'section-arrow';
    arrow1.textContent = '↓';

    const htmlDetails = document.createElement('details');

    const htmlSummary = document.createElement('summary');
    htmlSummary.textContent = 'Show generated HTML (from getHtml())';

    const codeBlock = document.createElement('div');
    codeBlock.className = 'generated-code';
    codeBlock.textContent = htmlOnly;

    htmlDetails.appendChild(htmlSummary);
    htmlDetails.appendChild(codeBlock);

    const arrow2 = document.createElement('div');
    arrow2.className = 'section-arrow';
    arrow2.textContent = '↓';

    const renderedSection = document.createElement('div');
    renderedSection.className = 'code-section-label';
    renderedSection.textContent = 'Final rendered table';

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'btn';
    toggleBtn.textContent = 'Show table without styles';

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';
    tableWrapper.innerHTML = fullHtml;

    function switchTable() {
        showingStyled = !showingStyled;
        if (showingStyled) {
            tableWrapper.className = 'table-wrapper';
            tableWrapper.innerHTML = styledTable.getHtml();
            toggleBtn.textContent = 'Show table without styles';
        } else {
            tableWrapper.className = '';
            tableWrapper.innerHTML = plainTable.getHtml();
            toggleBtn.textContent = 'Show styled table';
        }
    }

    toggleBtn.addEventListener('click', switchTable);

    container.appendChild(hierarchy);
    container.appendChild(purpose);
    container.appendChild(cssDetails);
    container.appendChild(arrow1);
    container.appendChild(htmlDetails);
    container.appendChild(arrow2);
    container.appendChild(renderedSection);
    container.appendChild(toggleBtn);
    container.appendChild(tableWrapper);
};
