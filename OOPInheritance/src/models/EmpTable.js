"use strict";

class EmpTable {
    constructor(employees) {
        this.employees = employees;
    }

    getHtml() {
        let html = '<table>\n<thead>\n<tr>\n<th>Name</th>\n<th>Stand</th>\n<th>Occupation</th>\n<th>Part</th>\n</tr>\n</thead>\n<tbody>\n';

        for (let i = 0; i < this.employees.length; i++) {
            const emp = this.employees[i];
            html += '<tr>\n<td>' + emp.getFullName() + '</td>\n<td>' + emp.stand + '</td>\n<td>' + emp.occupation + '</td>\n<td>' + emp.part + '</td>\n</tr>\n';
        }

        html += '</tbody>\n</table>';
        return html;
    }
}
