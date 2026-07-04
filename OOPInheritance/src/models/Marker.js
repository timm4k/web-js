"use strict";

class Marker {
    constructor(color, inkAmount) {
        this.color = color;
        this.inkAmount = inkAmount;
    }

    print(text) {
        let result = '';
        let ink = this.inkAmount;

        for (let i = 0; i < text.length; i++) {
            if (ink <= 0) {
                break;
            }

            const char = text[i];

            if (char !== ' ') {
                if (ink < 0.5) {
                    break;
                }
                ink -= 0.5;
            }

            result += char;
        }

        this.inkAmount = ink;
        return result;
    }
}
