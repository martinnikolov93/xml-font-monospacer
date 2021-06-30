function monospacer(string) {
    let xAdvanceStrings = getXAdvanceStrings(string);
    if (!xAdvanceStrings) return "Can't parse xml. Missing xadvance property.";
    let xAdvanceNumbers = getXAdvanceNumbers(xAdvanceStrings);
    let highestXAdvance = getBiggestXAdvance(xAdvanceNumbers);
    let xAdvancedString = replaceXAdvance(string, highestXAdvance)

    let widthStrings = getWidthStrings(string);
    if (!widthStrings) return "Can't parse xml. Missing width property.";
    let widthNumbers = getWidthNumbers(widthStrings);

    let nullifiedStr = nullifyXOffset(xAdvancedString);
    if (!nullifiedStr) return "Can't parse xml. Missing xoffset property.";

    if (widthStrings.length !== xAdvanceStrings.length) return `Not equal amount of properties: width props ${widthStrings.length}, xadvance props ${xAdvanceStrings.length}`;

    let newStr = nullifiedStr;

    for (let i = 0; i < widthNumbers.length; i++) {
        let widthValue = widthNumbers[i];
        let xOffset = ((highestXAdvance - widthValue) / 2);

        newStr = newStr.replace(`xoffset="null"`, `xoffset="${xOffset}"`)
    }

    return newStr;
}

function nthIndex(str, pat, n) {
    var L = str.length, i = -1;
    while (n-- && i++ < L) {
        i = str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

function nullifyXOffset(string) {
    let regex = /xoffset="[0-9.]+"/gm;
    return string.replace(regex, `xoffset="null"`);
}

function getWidthStrings(string) {
    let regex = /width="[0-9]+"/gm;
    return string.match(regex);
}

function getWidthNumbers(stringArr) {
    let regex = /[0-9]+/gm;
    return stringArr.toString().match(regex);
}

function getBiggestXAdvance(arr) {
    return Math.max(...arr);
}

function replaceXAdvance(string, number) {
    let regex = /xadvance="[0-9]+"/gm;
    return string.replaceAll(regex, `xadvance="${number}"`);
}

function getXAdvanceStrings(string) {
    let regex = /xadvance="[0-9]+"/gm;
    return string.match(regex);
}

function getXAdvanceNumbers(stringArr) {
    let regex = /[0-9]+/gm;
    return stringArr.toString().match(regex);
}

let inputEl = document.getElementById("input");
let outputEl = document.getElementById("output");
let exampleBtn = document.getElementById("example-btn");

inputEl.addEventListener("input", () => {
    if (!inputEl.value) {
        outputEl.value = "No XML :(";
    } else {
        outputEl.value = monospacer(inputEl.value);
    }
});

let exampleString = `
    <char id="48" x="0" y="210" width="79" height="105" xoffset="0" yoffset="-25" xadvance="56" page="0" /><!-- 0 -->
    <char id="49" x="411" y="288" width="47" height="102" xoffset="5151" yoffset="-24" xadvance="79" page="0" /><!-- 1 -->
    <char id="50" x="288" y="312" width="62" height="103" xoffset="23" yoffset="-25" xadvance="68" page="0" /><!-- 2 -->
    <char id="51" x="238" y="0" width="65" height="105" xoffset="0" yoffset="-25" xadvance="74" page="0" /><!-- 3 -->
    <char id="52" x="0" y="316" width="75" height="103" xoffset="5" yoffset="-25" xadvance="56" page="0" /><!-- 4 -->
    <char id="53" x="304" y="0" width="60" height="104" xoffset="01" yoffset="-24" xadvance="45" page="0" /><!-- 5 -->
    <char id="54" x="150" y="185" width="69" height="105" xoffset="0.33333" yoffset="-25" xadvance="72" page="0" /><!-- 6 -->
    <char id="55" x="288" y="209" width="63" height="102" xoffset="0" yoffset="-23" xadvance="71" page="0" /><!-- 7 -->
    <char id="56" x="79" y="210" width="70" height="105" xoffset="0" yoffset="-25" xadvance="72" page="0" /><!-- 8 -->
    <char id="57" x="170" y="0" width="67" height="105" xoffset="0" yoffset="-25" xadvance="75" page="0" /><!-- 9 -->
  `;

exampleBtn.addEventListener("click", () => {
    inputEl.value = exampleString;
    outputEl.value = monospacer(exampleString);
})

