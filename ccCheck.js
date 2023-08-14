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
    customValidateCCs(value);
});

function customValidateCCs(ccIn) {
    // extension of "validateCC" loops through objects and logs to screen
    const ccObjs = parseNums(ccIn, ",");

    for (const ccObj of ccObjs) {
        const panel = document.createElement("div");
        panel.className = "panel";

        if (ccObj.isValid) {
            panel.style.boxShadow = "5px 5px 5px #9f9";
        } else {
            panel.style.boxShadow = "5px 5px 5px #f99";
        }

        panel.innerHTML = JSON.stringify(ccObj, null, "<br>");
        ccResults.appendChild(panel);
    }
}

function parseNums(nums, separator) {
    let ccNums = [];
    let ccObjs = [];

    const type = typeof nums;

    switch (type) {
        // if string is received, assume the numbers are separated and split them into an array
        case "string":
            if (separator === undefined) {
                separator = ",";
            }
            ccNums = nums.split(separator);
            break;
        // if array is received, assume the numbers are already separated
        case "array":
            ccNums = nums;
            break;
        default:
            console.log("Expecting a string of numbers separated by a delimiter, such as a comma, or an array of numbers");
            return undefined;
    }

    for (let x = 0; x < ccNums.length; x++) {
        ccObjs.push(validateCC(ccNums[x]));
    }

    return ccObjs;
}

function getCardIssuer(ccNum) {
    const ccNums = ccNum.split("");

    if (ccNums[0] == 4 && (ccNums.length == 13 || ccNums.length == 16)) {
        return "Visa";
    }
    if ((ccNum.substring(0, 2) >= 51 && ccNum.substring(0, 2) <= 55) && ccNums.length == 16) {
        return "MasterCard";
    }
    if ((ccNum.substring(0, 6) >= 222100 && ccNum.substring(0, 6) <= 272099) && ccNums.length == 16) {
        return "MasterCard";
    }
    if (ccNums[0] == 3 && (ccNums[1] == 4 || ccNums[1] == 7) && ccNums.length == 15) {
        return "AmEx";
    }
    // Diner cards aren't accepted
    /*
    if (arr[0] == 3 && (arr[1] == 0 || arr[1] == 6 || arr[1] == 8 || arr[1] == 9) && arr.length == 14){
        return "Diners";
    }
    */
    if (ccNums[0] == 6 && (ccNums[1] == 0 || ccNums[1] == 4 || ccNums[1] == 5) && ccNums.length == 16) {
        return "Discover";
    }
    // Below credit card formats aren't accepted
    // Requirement <Start of Credit Card Payments –0070>
    // Diner and JCB Credit Cards will NOT be considered to be a valid form of payment at this time.
    /*
    if (cc.substring(0, 2) == 62){
        return "China Union Pay";
    }
    if (cc.substring(0, 2) == 35){
        return "JCB";
    }
    */

    return undefined;
}

function luhnCheck(ccNum) {
    let isValid = false;
    // Double every second digit from right to left
    let pos = ccNum.length - 2; //index of the 2nd to last number
    let arr = ccNum.split("");

    console.log("Original split: " + arr);

    for (pos; pos >= 0; pos -= 2) {
        arr[pos] = arr[pos] * 2;
    }
    console.log("Doubled alts: " + arr);

    // Add each individual digit
    // If doubling of a digit results in a 2-digit number, add the two digits to get a single-digit number.
    ccNum = arr.join("");
    arr = ccNum.split("");
    pos = 0;
    let sum = 0;

    console.log("New split: " + arr);

    for (pos; pos < ccNum.length; pos++) {
        sum += Number(arr[pos]);
    }
    console.log("Sum: " + sum);

    // If sum modulo 10 is equal to 0, then the number is valid
    sum = sum.toString().split("");
    const lastDigit = sum[sum.length - 1];
    console.log("Last digit is 0? " + lastDigit);

    if (lastDigit == 0) {
        isValid = true;
    }

    return isValid;
}

function validateCC(ccNum) {
    ccNum = ccNum.replace(/\D/g, ''); //Removes everything except digits

    const ccObj = {
        num: ccNum,
        length: ccNum.length,
        issuer: undefined,
        isValidLuhn: false,
        isValid: false
    };

    ccObj.issuer = getCardIssuer(ccObj.num);
    ccObj.isValidLuhn = luhnCheck(ccObj.num);

    if (ccObj.length < 13 || ccObj.length > 20) {
    } else if (ccObj.issuer == undefined) {
    } else if (ccObj.isValidLuhn == false) {
    } else {
        // will only be valid if the above 3 fail conditions aren't met
        ccObj.isValid = true;
    }

    return ccObj;
}
