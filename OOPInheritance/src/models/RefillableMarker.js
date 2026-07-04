"use strict";

class RefillableMarker extends Marker {
    refill(amount) {
        if (amount < 0) {
            return;
        }

        this.inkAmount = Math.min(100, this.inkAmount + amount);
    }
}
