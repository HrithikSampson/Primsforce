const fs = require("fs");
const data = require('./2-input.json');
let map = new Map();
let suffix;
var minTime;
var maxTime;
var minGetTime;
var maxGetTime = 0;
if(data.hasOwnProperty('expenseData')){
    let expenseArray = data.expenseData;
    if(expenseArray.length){
        suffix = expenseArray[0].startDate.split('-')[2];
        minGetTime = new Date(expenseArray[0].startDate).getTime();
        maxGetTime = new Date(expenseArray[0].startDate).getTime();

        minTime = expenseArray[0].startDate;
        maxTime = expenseArray[0].startDate;
    }
    for(let expenseData of expenseArray){
        if(!map.has(expenseData.startDate)){
            map.set(expenseData.startDate,0);
        }
        map.set(expenseData.startDate, map.get(expenseData.startDate) - expenseData.amount);
        if(minGetTime>new Date(expenseData.startDate).getTime()){
            minGetTime = new Date(expenseData.startDate).getTime();
            minTime = expenseData.startDate;
        }
        if(maxGetTime<new Date(expenseData.startDate).getTime()){
            maxGetTime = new Date(expenseData.startDate).getTime();
            maxTime = expenseData.startDate;
        }
    }
}
if(data.hasOwnProperty('revenueData')){
    let revenueArray = data.revenueData;
    if(revenueArray.length){
        suffix = revenueArray[0].startDate.split('-')[2];
        if(!minGetTime){
            minGetTime = new Date(revenueArray[0].startDate).getTime();
            minTime = revenueArray[0].startDate;
        }
    }
    for(let revenueData of revenueArray){
        if(!map.has(revenueData.startDate)){
            map.set(revenueData.startDate,0);
        }
        map.set(revenueData.startDate, map.get(revenueData.startDate) + revenueData.amount);
        if(minGetTime>new Date(revenueData.startDate).getTime()){
            minGetTime = new Date(revenueData.startDate).getTime();
            minTime = revenueData.startDate;
        }
        if(maxGetTime<new Date(revenueData.startDate).getTime()){
            maxGetTime = new Date(revenueData.startDate).getTime();
            maxTime = revenueData.startDate;
        }
    }
}
var obj = {balance:[]}
let startMonth = new Date(minTime).getMonth();
let startYear = new Date(minTime).getFullYear();

while(new Date(startYear + "-" + ((startMonth+1)<10?"0"+(startMonth+1):(startMonth+1))  + "-" +suffix).getTime() <= maxGetTime){

    if(map.has(startYear + "-" + ((startMonth+1)<10?"0"+(startMonth+1):(startMonth+1))  + "-" +suffix)){
        obj.balance.push({
            startDate: startYear + "-" + ((startMonth+1)<10?"0"+(startMonth+1):(startMonth+1))  + "-" +suffix,
            amount: map.get(startYear + "-" + ((startMonth+1)<10?"0"+(startMonth+1):(startMonth+1))  + "-" +suffix)
        });
    }
    else{
        obj.balance.push({
            startDate: startYear + "-" + ((startMonth+1)<10?"0"+(startMonth+1):(startMonth+1))  + "-" +suffix,
            amount: 0
        });
    }
    startMonth++;
    if(startMonth == 12){
        startMonth = 0;
        startYear++;
    }
}
console.log(obj);
fs.writeFile("balance.json", JSON.stringify(obj,null,1),function (err){
    if(err) throw err;
    console.log('FILE WRITTEN BALANCE.JSON');
});