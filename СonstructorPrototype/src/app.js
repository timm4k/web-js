"use strict";

const App = {};

App.renderCircle = function (container) {
    const circleCard = document.createElement('div');
    circleCard.className = 'card';

    const circleTitle = document.createElement('div');
    circleTitle.className = 'card-title';
    circleTitle.textContent = 'Circle';

    const circleDesc = document.createElement('div');
    circleDesc.className = 'description';
    circleDesc.textContent = 'The Circle constructor function uses Object.defineProperty with getter/setter for the radius, a read-only diameter getter on the prototype, and prototype methods calculateArea() / calculateCircumference(). Radius validation throws an Error on negative values';

    const circleGrid = document.createElement('div');
    circleGrid.className = 'grid';

    circleCard.appendChild(circleTitle);
    circleCard.appendChild(circleDesc);
    circleCard.appendChild(circleGrid);

    let circle;

    try {
        circle = new Circle(10);

        const radiusItem = document.createElement('div');
        radiusItem.className = 'property';
        radiusItem.innerHTML = '<span class="prop-name">radius (getter, initial = 10)</span><span class="prop-value">' + circle.radius + '</span>';

        circle.radius = 15;
        const radiusUpdated = document.createElement('div');
        radiusUpdated.className = 'property';
        radiusUpdated.innerHTML = '<span class="prop-name">radius after setter (15)</span><span class="prop-value">' + circle.radius + '</span>';

        const diameterItem = document.createElement('div');
        diameterItem.className = 'property';
        diameterItem.innerHTML = '<span class="prop-name">diameter (getter, radius * 2)</span><span class="prop-value">' + circle.diameter + '</span>';

        const areaItem = document.createElement('div');
        areaItem.className = 'property';
        areaItem.innerHTML = '<span class="prop-name">calculateArea()</span><span class="prop-value">' + circle.calculateArea().toFixed(2) + '</span>';

        const circItem = document.createElement('div');
        circItem.className = 'property';
        circItem.innerHTML = '<span class="prop-name">calculateCircumference()</span><span class="prop-value">' + circle.calculateCircumference().toFixed(2) + '</span>';

        circleGrid.appendChild(radiusItem);
        circleGrid.appendChild(radiusUpdated);
        circleGrid.appendChild(diameterItem);
        circleGrid.appendChild(areaItem);
        circleGrid.appendChild(circItem);

        const validationBox = document.createElement('div');
        validationBox.className = 'result-box success';
        validationBox.innerHTML = '<span class="prop-value">\u2713 Radius validation: Error thrown for negative values (setter + constructor)</span>';

        circleCard.appendChild(validationBox);
    } catch (error) {
        const errorBox = document.createElement('div');
        errorBox.className = 'error';
        errorBox.textContent = 'Error: ' + error.message;
        circleCard.appendChild(errorBox);
    }

    container.appendChild(circleCard);

    const validationCard = document.createElement('div');
    validationCard.className = 'card';

    const validationTitle = document.createElement('div');
    validationTitle.className = 'card-title';
    validationTitle.textContent = 'Constructor Validation';

    const validationDesc = document.createElement('div');
    validationDesc.className = 'description';
    validationDesc.textContent = 'Attempting to create a Circle with a negative radius — the constructor throws an Error, preventing invalid state';

    const validationResult = document.createElement('div');
    validationResult.className = 'result-box success';

    try {
        const invalidCircle = new Circle(-5);
        validationResult.innerHTML = '<span class="prop-value">No error thrown (unexpected)</span>';
    } catch (error) {
        validationResult.innerHTML = '<span class="prop-value">\u2713 Error caught: "' + error.message + '"</span>';
    }

    validationCard.appendChild(validationTitle);
    validationCard.appendChild(validationDesc);
    validationCard.appendChild(validationResult);
    container.appendChild(validationCard);

    const setterCard = document.createElement('div');
    setterCard.className = 'card';

    const setterTitle = document.createElement('div');
    setterTitle.className = 'card-title';
    setterTitle.textContent = 'Setter Validation';

    const setterDesc = document.createElement('div');
    setterDesc.className = 'description';
    setterDesc.textContent = 'Attempting to set a negative radius via the setter — the setter throws an Error, preventing invalid data assignment';

    const setterResult = document.createElement('div');
    setterResult.className = 'result-box success';

    try {
        circle.radius = -10;
        setterResult.innerHTML = '<span class="prop-value">No error thrown (unexpected)</span>';
    } catch (error) {
        setterResult.innerHTML = '<span class="prop-value">\u2713 Error caught: "' + error.message + '"</span>';
    }

    setterCard.appendChild(setterTitle);
    setterCard.appendChild(setterDesc);
    setterCard.appendChild(setterResult);
    container.appendChild(setterCard);

    const interactiveCard = document.createElement('div');
    interactiveCard.className = 'card';

    const interactiveTitle = document.createElement('div');
    interactiveTitle.className = 'card-title';
    interactiveTitle.textContent = 'Interactive Circle';

    const interactiveDesc = document.createElement('div');
    interactiveDesc.className = 'description';
    interactiveDesc.textContent = 'Use the slider to adjust the radius — the circle and all values update in real time';

    const svgBox = document.createElement('div');
    svgBox.style.textAlign = 'center';
    svgBox.style.marginBottom = '16px';

    const scale = 4;
    const initRadius = 10;
    const initR = initRadius * scale;

    svgBox.innerHTML = '<svg width="400" height="400" viewBox="-260 -260 520 520" style="background:rgba(10,10,30,0.6);border:1px solid rgba(179,102,255,0.1);border-radius:8px;max-width:100%">' +
        '<circle cx="0" cy="0" r="' + initR + '" fill="rgba(179,102,255,0.15)" stroke="#b366ff" stroke-width="2"/>' +
        '<circle cx="0" cy="0" r="3" fill="#b366ff"/>' +
        '<line x1="0" y1="0" x2="' + initR + '" y2="0" stroke="#50ff96" stroke-width="1.5"/>' +
        '<text x="' + (initR / 2) + '" y="-12" fill="#50ff96" font-size="14" text-anchor="middle">r=' + initRadius + '</text>' +
        '</svg>';

    const svgEl = svgBox.querySelector('svg');
    const svgCircle = svgEl.querySelectorAll('circle')[0];
    const svgLine = svgEl.querySelector('line');
    const svgText = svgEl.querySelector('text');

    const sliderArea = document.createElement('div');
    sliderArea.style.marginBottom = '16px';

    const sliderLabel = document.createElement('div');
    sliderLabel.style.display = 'flex';
    sliderLabel.style.justifyContent = 'space-between';
    sliderLabel.style.color = '#7a6a9a';
    sliderLabel.style.fontSize = '11px';
    sliderLabel.style.textTransform = 'uppercase';
    sliderLabel.style.letterSpacing = '0.5px';
    sliderLabel.style.marginBottom = '8px';
    sliderLabel.innerHTML = '<span>Radius</span>';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '1';
    slider.max = '50';
    slider.value = '10';
    slider.style.width = '100%';
    slider.style.accentColor = '#b366ff';

    sliderArea.appendChild(sliderLabel);
    sliderArea.appendChild(slider);

    const valueGrid = document.createElement('div');
    valueGrid.className = 'grid';

    const rSpan = document.createElement('span');
    rSpan.className = 'prop-value';
    rSpan.textContent = initRadius;
    const rItem = document.createElement('div');
    rItem.className = 'property';
    rItem.innerHTML = '<span class="prop-name">radius</span>';
    rItem.appendChild(rSpan);

    const dSpan = document.createElement('span');
    dSpan.className = 'prop-value';
    dSpan.textContent = initRadius * 2;
    const dItem = document.createElement('div');
    dItem.className = 'property';
    dItem.innerHTML = '<span class="prop-name">diameter</span>';
    dItem.appendChild(dSpan);

    const aSpan = document.createElement('span');
    aSpan.className = 'prop-value';
    aSpan.textContent = (Math.PI * initRadius * initRadius).toFixed(2);
    const aItem = document.createElement('div');
    aItem.className = 'property';
    aItem.innerHTML = '<span class="prop-name">calculateArea()</span>';
    aItem.appendChild(aSpan);

    const cSpan = document.createElement('span');
    cSpan.className = 'prop-value';
    cSpan.textContent = (2 * Math.PI * initRadius).toFixed(2);
    const cItem = document.createElement('div');
    cItem.className = 'property';
    cItem.innerHTML = '<span class="prop-name">calculateCircumference()</span>';
    cItem.appendChild(cSpan);

    valueGrid.appendChild(rItem);
    valueGrid.appendChild(dItem);
    valueGrid.appendChild(aItem);
    valueGrid.appendChild(cItem);

    slider.addEventListener('input', function () {
        const val = parseInt(this.value, 10);
        const r = val * scale;

        svgCircle.setAttribute('r', r);
        svgLine.setAttribute('x2', r);
        svgText.setAttribute('x', r / 2);
        svgText.textContent = 'r=' + val;

        rSpan.textContent = val;
        dSpan.textContent = val * 2;
        aSpan.textContent = (Math.PI * val * val).toFixed(2);
        cSpan.textContent = (2 * Math.PI * val).toFixed(2);
    });

    interactiveCard.appendChild(interactiveTitle);
    interactiveCard.appendChild(interactiveDesc);
    interactiveCard.appendChild(svgBox);
    interactiveCard.appendChild(sliderArea);
    interactiveCard.appendChild(valueGrid);
    container.appendChild(interactiveCard);
};

App.renderHtmlElement = function (container) {
    function createCardDiv() {
        const cardDiv = new HtmlElement('div', false);
        cardDiv.setStyle('width', '300px');
        cardDiv.setStyle('margin', '10px');

        const heading = new HtmlElement('h3', false);
        heading.textContent = 'What is Lorem Ipsum?';
        cardDiv.appendChild(heading);

        const paragraph = new HtmlElement('p', false);
        paragraph.setStyle('text-align', 'justify');
        paragraph.textContent = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book <a href="https://www.lipsum.com/" style="color: #b366ff;" target="_blank">More...</a>';

        cardDiv.appendChild(paragraph);

        return cardDiv;
    }

    const wrapper = new HtmlElement('div', false);
    wrapper.setAttribute('id', 'wrapper');
    wrapper.setStyle('display', 'flex');

    const leftCard = createCardDiv();
    wrapper.appendChild(leftCard);

    const rightCard = createCardDiv();
    wrapper.appendChild(rightCard);

    const wrapperResult = wrapper.getHtml();

    const elementCard = document.createElement('div');
    elementCard.className = 'card';

    const elementTitle = document.createElement('div');
    elementTitle.className = 'card-title';
    elementTitle.textContent = 'HTML Element';

    const elementDesc = document.createElement('div');
    elementDesc.className = 'description';
    elementDesc.textContent = 'The getHtml() method recursively generates valid HTML markup for the current element together with all nested child elements. Each element supports attributes, inline styles, text content, and child elements';

    const elementOutput = document.createElement('div');
    elementOutput.className = 'generated-code';
    elementOutput.textContent = wrapperResult;

    elementCard.appendChild(elementTitle);
    elementCard.appendChild(elementDesc);
    elementCard.appendChild(elementOutput);
    container.appendChild(elementCard);
};

App.renderCssClass = function (container) {
    const cardClass = new CssClass('card');
    cardClass.setStyle('background', 'rgba(179, 102, 255, 0.08)');
    cardClass.setStyle('border', '1px solid rgba(179, 102, 255, 0.3)');
    cardClass.setStyle('padding', '24px');
    cardClass.setStyle('margin', '10px');
    cardClass.setStyle('border-radius', '8px');

    const headingClass = new CssClass('heading');
    headingClass.setStyle('color', '#b366ff');
    headingClass.setStyle('font-size', '18px');
    headingClass.setStyle('margin-bottom', '12px');
    headingClass.setStyle('letter-spacing', '1px');
    headingClass.setStyle('text-shadow', '0 0 10px rgba(179, 102, 255, 0.3)');

    const wrapperClass = new CssClass('wrapper');
    wrapperClass.setStyle('display', 'flex');
    wrapperClass.setStyle('flex-wrap', 'wrap');
    wrapperClass.setStyle('justify-content', 'center');

    const cssResult = cardClass.getCss() + '\n\n' + headingClass.getCss() + '\n\n' + wrapperClass.getCss();

    const cssCard = document.createElement('div');
    cssCard.className = 'card';

    const cssTitle = document.createElement('div');
    cssTitle.className = 'card-title';
    cssTitle.textContent = 'CSS Class';

    const cssDesc = document.createElement('div');
    cssDesc.className = 'description';
    cssDesc.textContent = 'The getCss() method converts all stored CSS property-value pairs into a valid CSS rule string (.className { property: value; }). Styles can be added, overwritten, or removed individually';

    const cssOutput = document.createElement('div');
    cssOutput.className = 'generated-code';
    cssOutput.textContent = cssResult;

    cssCard.appendChild(cssTitle);
    cssCard.appendChild(cssDesc);
    cssCard.appendChild(cssOutput);
    container.appendChild(cssCard);
};

App.renderHtmlBlock = function (container) {
    const cardClass = new CssClass('card');
    cardClass.setStyle('background', 'rgba(179, 102, 255, 0.08)');
    cardClass.setStyle('border', '1px solid rgba(179, 102, 255, 0.3)');
    cardClass.setStyle('padding', '24px');
    cardClass.setStyle('margin', '10px');
    cardClass.setStyle('border-radius', '8px');

    const headingClass = new CssClass('heading');
    headingClass.setStyle('color', '#b366ff');
    headingClass.setStyle('font-size', '18px');
    headingClass.setStyle('margin-bottom', '12px');
    headingClass.setStyle('letter-spacing', '1px');
    headingClass.setStyle('text-shadow', '0 0 10px rgba(179, 102, 255, 0.3)');

    const wrapperClass = new CssClass('wrapper');
    wrapperClass.setStyle('display', 'flex');
    wrapperClass.setStyle('flex-wrap', 'wrap');
    wrapperClass.setStyle('justify-content', 'center');

    const wrapper = new HtmlElement('div', false);
    wrapper.setAttribute('id', 'wrapper');
    wrapper.setStyle('display', 'flex');

    const leftCard = new HtmlElement('div', false);
    leftCard.setStyle('width', '300px');
    leftCard.setStyle('margin', '10px');

    const heading = new HtmlElement('h3', false);
    heading.textContent = 'What is Lorem Ipsum?';
    leftCard.appendChild(heading);

    const paragraph = new HtmlElement('p', false);
    paragraph.setStyle('text-align', 'justify');
    paragraph.textContent = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book <a href="https://www.lipsum.com/" style="color: #b366ff;" target="_blank">More...</a>';

    leftCard.appendChild(paragraph);
    wrapper.appendChild(leftCard);

    const rightCard = new HtmlElement('div', false);
    rightCard.setStyle('width', '300px');
    rightCard.setStyle('margin', '10px');

    const heading2 = new HtmlElement('h3', false);
    heading2.textContent = 'What is Lorem Ipsum?';
    rightCard.appendChild(heading2);

    const paragraph2 = new HtmlElement('p', false);
    paragraph2.setStyle('text-align', 'justify');
    paragraph2.textContent = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book <a href="https://www.lipsum.com/" style="color: #b366ff;" target="_blank">More...</a>';

    rightCard.appendChild(paragraph2);
    wrapper.appendChild(rightCard);

    const htmlBlock = new HtmlBlock();
    htmlBlock.addCssClass(cardClass);
    htmlBlock.addCssClass(headingClass);
    htmlBlock.addCssClass(wrapperClass);
    htmlBlock.rootElement = wrapper;

    const blockResult = htmlBlock.getCode();

    const blockCard = document.createElement('div');
    blockCard.className = 'card';

    const blockTitle = document.createElement('div');
    blockTitle.className = 'card-title';
    blockTitle.textContent = 'HTML Block';

    const blockDesc = document.createElement('div');
    blockDesc.className = 'description';
    blockDesc.textContent = 'HtmlBlock combines all CssClass instances inside a single <style> tag and appends the generated HTML afterwards via getCode(). This produces a complete, self-contained HTML document fragment with both CSS and markup';

    const blockOutput = document.createElement('div');
    blockOutput.className = 'generated-code';
    blockOutput.textContent = blockResult;

    blockCard.appendChild(blockTitle);
    blockCard.appendChild(blockDesc);
    blockCard.appendChild(blockOutput);
    container.appendChild(blockCard);

    const liveCard = document.createElement('div');
    liveCard.className = 'card';

    const liveTitle = document.createElement('div');
    liveTitle.className = 'card-title';
    liveTitle.textContent = 'Live Render';

    const liveDesc = document.createElement('div');
    liveDesc.className = 'description';
    liveDesc.textContent = 'The generated code rendered through innerHTML. (Note: document.write() would overwrite the existing page after it has loaded, so innerHTML is used instead for a safe in-page preview)';

    const liveOutput = document.createElement('div');
    liveOutput.className = 'generated-code';
    liveOutput.innerHTML = blockResult;

    liveCard.appendChild(liveTitle);
    liveCard.appendChild(liveDesc);
    liveCard.appendChild(liveOutput);
    container.appendChild(liveCard);

    const edgeCard = document.createElement('div');
    edgeCard.className = 'card';

    const edgeTitle = document.createElement('div');
    edgeTitle.className = 'card-title';
    edgeTitle.textContent = 'Edge Cases';

    const dupAttrElement = new HtmlElement('div', false);
    dupAttrElement.setAttribute('class', 'first');
    dupAttrElement.setAttribute('class', 'second');
    dupAttrElement.setStyle('color', 'red');
    dupAttrElement.setStyle('color', 'blue');

    const dupAttrResult = dupAttrElement.getHtml();

    const edgeDesc = document.createElement('div');
    edgeDesc.className = 'description';
    edgeDesc.textContent = 'Duplicate attribute overwrite (class set twice, keeps last value) + Duplicate style overwrite (color set twice, keeps last value) + Duplicate CssClass prevention (addCssClass ignores duplicates)';

    const duplicateOutput = document.createElement('div');
    duplicateOutput.className = 'generated-code';
    duplicateOutput.textContent = dupAttrResult;

    const dupClassTest = new CssClass('test');
    dupClassTest.setStyle('margin', '10px');
    dupClassTest.setStyle('margin', '20px');

    const dupClassPreview = document.createElement('div');
    dupClassPreview.className = 'generated-code';
    dupClassPreview.textContent = dupClassTest.getCss();

    const dupBlockTest = new HtmlBlock();
    dupBlockTest.addCssClass(cardClass);
    dupBlockTest.addCssClass(cardClass);
    const dupBlockResult = document.createElement('div');
    dupBlockResult.className = 'generated-code';
    dupBlockResult.textContent = 'CssClass count after duplicate addCssClass: ' + dupBlockTest.cssClasses.length;

    edgeCard.appendChild(edgeTitle);
    edgeCard.appendChild(edgeDesc);
    edgeCard.appendChild(duplicateOutput);
    edgeCard.appendChild(dupClassPreview);
    edgeCard.appendChild(dupBlockResult);
    container.appendChild(edgeCard);
};

App.run = function () {
    App.renderCircle(document.getElementById('circle'));
    App.renderHtmlElement(document.getElementById('element'));
    App.renderCssClass(document.getElementById('cssclass'));
    App.renderHtmlBlock(document.getElementById('htmlblock'));
};
