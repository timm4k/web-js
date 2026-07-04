"use strict";

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

class ExtendedDate extends Date {
    format() {
        return this.getDate() + ' ' + MONTHS[this.getMonth()];
    }

    isFuture() {
        const now = new Date();
        return this.getTime() >= now.getTime();
    }

    isLeapYear() {
        const year = this.getFullYear();
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    nextDay() {
        const next = new ExtendedDate(this.getTime());
        next.setDate(this.getDate() + 1);
        return next;
    }
}
