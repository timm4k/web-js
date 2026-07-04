"use strict";

class StyledEmpTable extends EmpTable {
    getStyles() {
        return '<style>\n' +
            '.styled-emp-table {\n' +
            '    border-collapse: collapse;\n' +
            '    width: 100%;\n' +
            '    font-size: 14px;\n' +
            '}\n' +
            '.styled-emp-table th,\n' +
            '.styled-emp-table td {\n' +
            '    border: 1px solid rgba(179, 102, 255, 0.2);\n' +
            '    padding: 10px 14px;\n' +
            '    text-align: left;\n' +
            '}\n' +
            '.styled-emp-table th {\n' +
            '    background: rgba(179, 102, 255, 0.12);\n' +
            '    color: #b366ff;\n' +
            '    font-weight: 500;\n' +
            '    letter-spacing: 0.5px;\n' +
            '    text-transform: uppercase;\n' +
            '    font-size: 12px;\n' +
            '}\n' +
            '.styled-emp-table tr:hover td {\n' +
            '    background: rgba(179, 102, 255, 0.04);\n' +
            '}\n' +
            '</style>';
    }

    getHtml() {
        let html = this.getStyles();
        html += '\n' + super.getHtml();
        html = html.replace('<table>', '<table class="styled-emp-table">');
        return html;
    }
}
