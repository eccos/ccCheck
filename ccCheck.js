/*LUHN Formula (Mod 10) for Validation of Primary Account Number 
The following steps are required to validate the primary account number:
Step 1: Double every second digit from right to left 
Step 2: Add each individual/single digit
Step 3: If the sum modulo 10 is equal to 0 (total ends in zero), then the number is valid. 

For example, to validate the primary account number 49927398716: 
Step 1: 
        4 9 9 2 7 3 9 8 7 1 6
         x2  x2  x2  x2  x2 
_________________________________
         18   4   6  16   2

Step 2: 4 +(1+8)+ 9 + (4) + 7 + (6) + 9 +(1+6) + 7 + (2) + 6 
Step 3: Sum = 70 : Card number is validated 
Note: Card is valid because 70 mod 10 = 0 (70 ends in 0)
*/

const ccTextarea = document.querySelector("#cc-textarea");
const ccResults = document.querySelector("#cc-results");

ccTextarea.addEventListener("input", ({ target: { value } }) => {
    ccResults.innerHTML = "";

    const ccNums = value.split(",")
    let ccObjs = [];
    const deniedIssuers = ["Diners", "China Union Pay", "JCB"];

    // create cc objects and verify validity
    ccNums.forEach(ccNum => {
        // removes everything except digits
        ccNum = ccNum.replace(/\D/g, '');
        if (ccNum.length == 0) return;

        const ccObj = {
            num: ccNum,
            length: ccNum.length,
            issuer: getCardIssuer(ccNum),
            isValidLuhn: luhnCheck(ccNum),
            isValid: false
        };

        // accepted cc lengths are between 13-20 inclusive
        if (ccObj.issuer != undefined && !deniedIssuers.includes(ccObj.issuer) &&
            ccObj.length >= 13 && ccObj.length <= 20 && ccObj.isValidLuhn == true) {
            ccObj.isValid = true;
        }

        ccObjs.push(ccObj);
    });

    ccObjs.forEach(ccObj => {
        const panel = createPanelFromValidatedCreditCard(ccObj)
        ccResults.appendChild(panel);
    });
});

function getCardIssuer(ccNum) {
    const ccNums = ccNum.split("");

    if (ccNums[0] == 4 && (ccNums.length == 13 || ccNums.length == 16)) {
        return "Visa";
    } else if ((ccNum.substring(0, 2) >= 51 && ccNum.substring(0, 2) <= 55) && ccNums.length == 16) {
        return "MasterCard";
    } else if ((ccNum.substring(0, 6) >= 222100 && ccNum.substring(0, 6) <= 272099) && ccNums.length == 16) {
        return "MasterCard";
    } else if (ccNums[0] == 3 && (ccNums[1] == 4 || ccNums[1] == 7) && ccNums.length == 15) {
        return "AmEx";
    } else if (ccNums[0] == 6 && (ccNums[1] == 0 || ccNums[1] == 4 || ccNums[1] == 5) && ccNums.length == 16) {
        return "Discover";
    }
    // Below CC formats aren't accepted
    // Requirement <Start of CC Payments –0070>
    // Diners, JCB, & China Union Pay CCs will NOT be considered to be a valid form of payment at this time.
    else if (ccNums[0] == 3 && (ccNums[1] == 0 || ccNums[1] == 6 || ccNums[1] == 8 || ccNums[1] == 9) && ccNums.length == 14) {
        return "Diners";
    } else if (ccNum.substring(0, 2) == 62) {
        return "China Union Pay";
    } else if (ccNum.substring(0, 2) == 35) {
        return "JCB";
    }

    return undefined;
}

function luhnCheck(ccNum) {
    let isValid = false;
    // Double every second digit from right to left
    let pos = ccNum.length - 2; //index of the 2nd to last number
    let ccDigits = ccNum.split("");

    console.log("Original split: " + ccDigits);
    for (pos; pos >= 0; pos -= 2) {
        ccDigits[pos] = ccDigits[pos] * 2;
    }
    console.log("Doubled alts: " + ccDigits);

    // Add each individual digit
    // If doubling of a digit results in a 2-digit number, add the two digits to get a single-digit number.
    ccDigits = ccDigits.join("").split("");
    let sum = 0;

    console.log("New split: " + ccDigits);
    ccDigits.forEach(digit => sum += Number(digit))
    console.log("Sum: " + sum);

    // If sum modulo 10 is equal to 0, then the number is valid
    const mod10 = sum % 10;
    console.log("Divisible by 10? Remainder: " + mod10);

    if (mod10 == 0) {
        isValid = true;
    }

    return isValid;
}

function createPanelFromValidatedCreditCard(ccObj) {
    const panel = document.createElement("div");

    panel.className = "panel";
    if (ccObj.isValid) {
        panel.classList.add("valid-cc");
    } else {
        panel.classList.add("invalid-cc");
    }
    panel.innerHTML = JSON.stringify(ccObj, null, "<br>");

    return panel;
}
