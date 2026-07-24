const Animation = {
    waitFor(ms = window.AnimationConstants.DURATIONS.BASE) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    animateElement(element, animationClass, duration = window.AnimationConstants.DURATIONS.SLOW) {
        element.classList.add(animationClass);
        return new Promise(resolve => {
            setTimeout(() => {
                element.classList.remove(animationClass);
                resolve(element);
            }, duration);
        });
    },

    staggerAnimation(elements, animationClass, staggerDelay = window.AnimationConstants.DELAYS.MEDIUM) {
        const promises = [];
        elements.forEach((el, i) => {
            promises.push(
                this.waitFor(i * staggerDelay).then(() =>
                    this.animateElement(el, animationClass)
                )
            );
        });
        return Promise.all(promises);
    },

    pulseElement(element, times = 3) {
        let count = 0;
        const interval = window.AnimationConstants.DURATIONS.FAST;

        return new Promise(resolve => {
            const pulse = () => {
                if (count >= times * 2) {
                    element.style.transform = '';
                    resolve();
                    return;
                }

                element.style.transform = count % 2 === 0 ? 'scale(1.05)' : 'scale(1)';
                count++;
                setTimeout(pulse, interval);
            };
            pulse();
        });
    },

    flashSuccess(element) {
        const className = 'animate-fade-in';
        element.classList.add(className);
        return new Promise(resolve => {
            setTimeout(() => {
                element.classList.remove(className);
                resolve(element);
            }, window.AnimationConstants.DURATIONS.SLOW);
        });
    },

    withAnimation(fn, delay = 0) {
        return this.waitFor(delay).then(() => fn());
    }
};

window.Animation = Animation;
window.AnimationHelper = Animation;
