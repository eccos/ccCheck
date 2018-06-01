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

window.onload = function () {
    // bulk input will allow digits and commas
    var ccBulkInElem = document.getElementById("CCBulk");
    // credit card info output
    var ccOutElem = document.getElementById("ccOut");
    // better credit card info output
    var logsElem = document.getElementById("logs");

    ccBulkInElem.addEventListener("input", function () {
        var ccIn = this.value;
        var ccOut = ccOutElem;
        ccOut.innerHTML = "";

        customValidateCCs(ccIn, ccOut);
    });

    function customValidateCCs(ccIn, ccOut) {
        // this is sort of an extension of "validateCC"
        // it loops through objects and logs to the console and screen
        var ccObjs = parseNums(ccIn, ",");

        logs.innerHTML = "";

        for (ccObj in ccObjs) {
            // ccOut.innerHTML += JSON.stringify(ccObjs[ccObj], null, "<br>");
            // ccOut.innerHTML += "<br>";

            var panel = document.createElement("div");
            panel.className = "panel";

            if (ccObjs[ccObj].isValid) {
                panel.style.boxShadow = "5px 5px 5px #9f9";
            }
            else {
                panel.style.boxShadow = "5px 5px 5px #f99";
            }

            panel.innerHTML = JSON.stringify(ccObjs[ccObj], null, "<br>");
            logs.appendChild(panel);

            console.log("Valid CC? " + ccObjs[ccObj].isValid);
            console.log("Card issuer: " + ccObjs[ccObj].issuer);
            console.log("Valid Luhn Check? " + ccObjs[ccObj].isValidLuhn);
            console.log("Length: " + ccObjs[ccObj].length);
            console.log("\n");
        }
    }

    function parseNums(nums, separator) {
        var ccs = []; // Array of cc numbers
        var ccObjs = []; // Array of cc objects

        var type = typeof nums;

        switch (type) {
            // if string is received, assume the numbers are separated and split them into an array
            case "string":
                if (separator === undefined) {
                    separator = ",";
                }
                ccs = nums.split(separator);
                break;
            // if array is received, assume the numbers are already separated
            case "array":
                ccs = nums;
                break;
            default:
                console.log("Expecting a string of numbers separated by a delimiter, such as a comma, or an array of numbers");
                return undefined;
        }

        for (var x = 0; x < ccs.length; x++) {
            ccObjs.push(validateCC(ccs[x]));
        }

        return ccObjs;
    }

    function getCardIssuer(cc) {
        var arr = cc.split("");

        if (arr[0] == 4 && (arr.length == 13 || arr.length == 16)) {
            return "Visa";
        }
        if ((cc.substring(0, 2) >= 51 && cc.substring(0, 2) <= 55) && arr.length == 16) {
            return "MasterCard";
        }
        if ((cc.substring(0, 6) >= 222100 && cc.substring(0, 6) <= 272099) && arr.length == 16) {
            return "MasterCard";
        }
        if (arr[0] == 3 && (arr[1] == 4 || arr[1] == 7) && arr.length == 15) {
            return "AmEx";
        }
        // Diner cards aren't accepted
        /*
        if (arr[0] == 3 && (arr[1] == 0 || arr[1] == 6 || arr[1] == 8 || arr[1] == 9) && arr.length == 14){
            return "Diners";
        }
        */
        if (arr[0] == 6 && (arr[1] == 0 || arr[1] == 4 || arr[1] == 5) && arr.length == 16) {
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

    function luhnCheck(num) {
        var isValid = false;
        //Double every second digit from right to left
        var pos = num.length - 2; //index of the 2nd to last number
        var arr = num.split("");

        console.log("Original split: " + arr);

        for (pos; pos >= 0; pos -= 2) {
            arr[pos] = arr[pos] * 2;
        }
        console.log("Doubled alts: " + arr);

        //Add each individual/single digit
        //If doubling of a digit results in a 2-digit number, add up the two digits to get a single-digit number.
        num = arr.join("");
        arr = num.split("");
        pos = 0;
        var sum = 0;

        console.log("New split: " + arr);

        for (pos; pos < num.length; pos++) {
            sum += Number(arr[pos]);
        }
        console.log("Sum: " + sum);

        //If total modulo 10 is equal to 0 (total ends in zero), then the number is valid
        sum = sum.toString().split("");
        var lastDigit = sum[sum.length - 1];
        console.log("Last digit is 0? " + lastDigit);

        if (lastDigit == 0) {
            isValid = true;
        }

        return isValid;
    }

    function validateCC(ccNum) {
        ccNum = ccNum.replace(/\D/g, ''); //Removes everything except digits

        var cc = {
            num: ccNum,
            length: ccNum.length,
            issuer: undefined,
            isValidLuhn: false,
            isValid: false
        };

        cc.issuer = getCardIssuer(cc.num);
        cc.isValidLuhn = luhnCheck(cc.num);

        if (cc.length < 13 || cc.length > 20) {
        } else if (cc.issuer == undefined) {
        } else if (cc.isValidLuhn == false) {
        } else {
            // will only be valid if the above 3 fail conditions aren't met
            cc.isValid = true;
        }

        return cc;
    }
};