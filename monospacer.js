"use strict";

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

let xAdvance = null;

function monospacer(string) {
    let xAdvanceStrings = getXAdvanceStrings(string);
    if (!xAdvanceStrings) return "Can't parse xml. Missing xadvance property.";
    let xAdvanceNumbers = getXAdvanceNumbers(xAdvanceStrings);
    let highestXAdvance = getBiggestXAdvance(xAdvanceNumbers);
    xAdvance = highestXAdvance;
    let xAdvancedString = replaceXAdvance(string, highestXAdvance)

    let widthStrings = getWidthStrings(string);
    if (!widthStrings) return "Can't parse xml. Missing width property.";
    let widthNumbers = getWidthNumbers(widthStrings);

    for (let i = 0; i < widthNumbers.length; i++) {
        const widthValue = widthNumbers[i];
        if (widthValue < 0) return "Oops.. Received negative width!"
    }

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

function fixXOffset(string) {
    let xAdvanceStrings = getXAdvanceStrings(string);
    if (!xAdvanceStrings) return "Can't parse xml. Missing xadvance property.";
    let xAdvanceNumbers = getXAdvanceNumbers(xAdvanceStrings);

    let widthStrings = getWidthStrings(string);
    if (!widthStrings) return "Can't parse xml. Missing width property.";
    let widthNumbers = getWidthNumbers(widthStrings);

    let nullifiedStr = nullifyXOffset(string);
    if (!nullifiedStr) return "Can't parse xml. Missing xoffset property.";

    let newStr = nullifiedStr;

    widthNumbers.forEach((widthValue, index, array) => {
        let xOffset = (xAdvanceNumbers[index] - widthValue) / 2;

        newStr = newStr.replace(`xoffset="null"`, `xoffset="${xOffset}"`)

    })

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
    let regex = /xoffset="[0-9.-]+"/gm;
    return string.replace(regex, `xoffset="null"`);
}

function getWidthStrings(string) {
    let regex = /width="[0-9.-]+"/gm;
    return string.match(regex);
}

function getWidthNumbers(stringArr) {
    let regex = /[0-9.-]+/gm;
    return stringArr.toString().match(regex);
}

function getBiggestXAdvance(arr) {
    return Math.max(...arr);
}

function replaceXAdvance(string, number) {
    let regex = /xadvance="[0-9.-]+"/gm;
    return string.replaceAll(regex, `xadvance="${number}"`);
}

function getXAdvanceStrings(string) {
    let regex = /xadvance="[0-9.-]+"/gm;
    return string.match(regex);
}

function getXAdvanceNumbers(stringArr) {
    let regex = /[0-9.-]+/gm;
    return stringArr.toString().match(regex);
}

function changeXAdvance(string, amount) {
    let strArr = getXAdvanceStrings(string);

    if (!strArr) { return "error" };

    let numArr = getXAdvanceNumbers(strArr);

    if (!numArr) { return "error" };

    let newStr = string.replaceAll("xadvance", "xadvancetochange")

    for (let i = 0; i < numArr.length; i++) {
        let num = Number(numArr[i]);
        let newValue = num + amount;

        newStr = newStr.replace(`xadvancetochange="${num}"`, `xadvance="${newValue}"`);
    }

    return newStr;
}

let inputEl = document.getElementById("input");
let outputEl = document.getElementById("output");
let xAdvanceEl = document.getElementById("x-advance-element");
let xAdvanceNumber = document.getElementById("x-advance-number");
let exampleBtn = document.getElementById("example-btn");
let decreaseXAdvanceBtn = document.getElementById("decrease-x-advance");
let increaseXAdvanceBtn = document.getElementById("increase-x-advance");
let monoSpaceCheckbox = document.getElementById("monospacer-toggle");

decreaseXAdvanceBtn.addEventListener("click", () => {
    let newStr = changeXAdvance(inputEl.value, -1);

    if (newStr === "error") { return }

    inputEl.value = newStr;

    if (monoSpaceCheckbox.checked) {
        outputEl.value = monospacer(newStr);
        xAdvanceNumber.textContent = xAdvance;
    } else {
        outputEl.value = fixXOffset(newStr);
    }
})

increaseXAdvanceBtn.addEventListener("click", () => {
    let newStr = changeXAdvance(inputEl.value, 1);

    if (newStr === "error") { return }

    inputEl.value = newStr;

    if (monoSpaceCheckbox.checked) {
        outputEl.value = monospacer(newStr);
        xAdvanceNumber.textContent = xAdvance;
    } else {
        outputEl.value = fixXOffset(newStr);
    }
})

inputEl.addEventListener("input", () => {
    if (!inputEl.value) {
        outputEl.value = "No XML :(";
        xAdvanceEl.classList.add("visibility-hidden");
    } else {
        if (monoSpaceCheckbox.checked) {
            outputEl.value = monospacer(inputEl.value);
            xAdvanceEl.classList.remove("visibility-hidden");
            xAdvanceNumber.textContent = xAdvance;
        } else {
            outputEl.value = fixXOffset(inputEl.value);
        }
    }
});



exampleBtn.addEventListener("click", () => {
    inputEl.value = exampleString;

    if (monoSpaceCheckbox.checked) {
        outputEl.value = monospacer(exampleString);
        xAdvanceEl.classList.remove("visibility-hidden");
        xAdvanceNumber.textContent = xAdvance;
    } else {
        outputEl.value = fixXOffset(exampleString);
    }

})

monoSpaceCheckbox.addEventListener("click", () => {
    if (monoSpaceCheckbox.checked) {
        outputEl.value = monospacer(inputEl.value);
        xAdvanceEl.classList.remove("visibility-hidden");
        xAdvanceNumber.textContent = xAdvance;
    } else {
        outputEl.value = fixXOffset(inputEl.value);
    }

})

let copyBtn = document.getElementById("copy-clipboard");
let textCopiedEl = document.getElementById("text-copied");
let copyTimeout = null;

copyBtn.addEventListener("click", copyToClipboard);

function copyToClipboard() {
    outputEl.focus();
    outputEl.select();
    document.execCommand("copy");
    textCopiedEl.classList.remove("display-none");
    clearTimeout(copyTimeout);
    copyTimeout = setTimeout(() => { textCopiedEl.classList.add("display-none"); }, 2000);
}
