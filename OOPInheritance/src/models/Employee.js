"use strict";

class Employee {
    constructor(firstName, lastName, stand, occupation, part) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.stand = stand;
        this.occupation = occupation;
        this.part = part;
    }

    getFullName() {
        return this.firstName + ' ' + this.lastName;
    }
}
