const body = $("body");
let lastMoonBucks = 0;
let moonBucks = 0;
const baseBuildingCostArray = [10, 50, 500, 5000, 50000, 500000, 10000000, 100000000, 1000000000]
const baseBuildingOutputArray = [1, 15, 80, 800, 4000, 13500, 40000, 130000, 3255006]
const baseBuildingCountArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let   baseBuildingCostMulitplierArray = [1.07, 1.15, 1.14, 1.13, 1.12, 1.11, 1.10, 1.09, 1.08]
let clickArray = [];
let clickArrayIndex = 0;
const buyAmount = [1, 10, 100, "max"];

const clickSound = new Audio("sounds/click.wav");


let buildingCostArray = baseBuildingCostArray;
let buildingOutputArray = baseBuildingOutputArray;
let buildingCountArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
let buildingCostMulitplierArray = [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.11]
let currentOutput = 0;
let clicks = 0;
let selectedBuyAmount = 0;
let unlockedBuildings = [0, 1];


setInterval(updateMoonbucks, 500)

setInterval(function(){
    checkUpgrades();
    calculateOutput();
    
}, 1000);

function buyBuilding(buildingId, howMany){
    let baseCost = baseBuildingCostArray[parseInt(buildingId) -1]
    let totalCost = calculateFutureCost(buildingId, howMany);
    if(moonBucks >= totalCost){
        buildingCostArray[buildingId -1] += baseBuildingCostArray[buildingId - 1] * (baseBuildingCostMulitplierArray[buildingId - 1]) ** buildingCountArray[buildingId - 1];
        buildingCountArray[buildingId - 1] += howMany;
        moonBucks -= totalCost;
        updateMoonbucks()
        updateCountAndCost();

        // if(buildingCountArray[buildingId - 1] % 10 === 0){
        //     let newMultiplier = (buildingCountArray[buildingId - 1] / 10) / (300 - ((buildingId - 1) * 10));
        //     buildingCostMulitplierArray[buildingId - 1] = newMultiplier + baseBuildingCostMulitplierArray[buildingId - 1];
        // }

        if(buildingCostArray[buildingId -1] >= (baseBuildingCostArray[buildingId] * 0.50)){
            unlockBuilding(parseInt(buildingId) + 1);
        }
    }else{
        console.log("not enough money")
    }
}

function checkUpgrades(){
    
}

function calculateFutureCost(buildingId, howMany){
    let baseCost = baseBuildingCostArray[parseInt(buildingId) -1]
    let cost = 0;
    if(howMany > 1){
        for(let i = 0; i < howMany; i++){
            (baseCost * ((1.15 ** (buildingCountArray[buildingId - 1] + howMany)) - (1.15 ** buildingCountArray[buildingId - 1])) / 0.15)
        }
        return Math.round(cost);
    }else{
        let cost = buildingCostArray[buildingId - 1];
        return Math.round(cost);
    }
}

function unlockBuilding(buildingId){
    let buildingToUnlockId = parseInt(buildingId) + 1;
    unlockedBuildings.push(buildingToUnlockId);
    $(`#${buildingToUnlockId}`).attr("hidden", false);
    $(`#${buildingId}`).attr("hidden", false);
    
}

function calculateOutput(){
    let output = 0;
    $.each(buildingCountArray, function(index, value){
        output += value * buildingOutputArray[index]
    })
    //currentOutput = output;
    //moonBucks += output;
}

function updateCountAndCost(){
    let target = $(".building");
    $.each(target, function(index, value){
        let newTarget = ($(`#${value.id} > span`))
        let newBreak = $("<br>");
        let newBreak2 = $("<br>");
        let newBreak3 = $("<br>");
        newTarget.empty().append(newBreak).append(`Count: ${buildingCountArray[value.id - 1]}`).append(newBreak3).append(`Cost: ${buildingCostArray[value.id - 1]}`).append(newBreak2).append(`Increase Output by: ${buildingOutputArray[value.id - 1]} Mb/s`)
    })
}

function updateMoonbucks(){
    let newBreak = $("<br>");
    $("#incomeStats").text(`Moonbucks: ${moonBucks.toFixed(2)}`).append(newBreak).append(`Current Output: ${currentOutput.toFixed(2)}`);
}

$("document").ready(function(){
    updateCountAndCost();

    $.get("https://ll.thespacedevs.com/2.1.0/event/", function(data){
       // console.log(data.results);
        $.each(data.results, function(index, value){
            console.log(value.description)
        })
    })

    $("#clicker").click(function(){
        clicks++;
        lastMoonBucks = moonBucks;
        moonBucks++;
        updateMoonbucks()
        clickSound.play();
        $("#clicker").addClass("flash");
    })

    $("#clicker").on("animationend", function(){
        $("#clicker").removeClass("flash");
    })

    $(".building").click(function(e){
        if(typeof buyAmount[selectedBuyAmount] === "number"){
            buyBuilding(e.target.id, buyAmount[selectedBuyAmount]);
        }else{
            console.log("Max buy not yet added")
        }     
    })
})
