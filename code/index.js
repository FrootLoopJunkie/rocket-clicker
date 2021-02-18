const body = $("body");
const baseBuildingCostArray = [10, 75, 750, 5000, 50000, 500000, 10000000, 100000000, 1000000000]
const baseBuildingOutputArray = [0.1, 1, 20, 100, 750, 10000, 100000, 5000000, 100000000]
const baseBuildingCountArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const baseBuildingCostMulitplierArray = [1.0035, 1.004,  1.0045, 1.004, 1.0035,  1.003,  1.0025,  1.002,  1.0015]
const buyAmount = [1, 10, 100, "max"];
const buttonClickSound = new Audio("sounds/buttonClick.wav");
const errorSound = new Audio("sounds/error.mp3")
const click1 = new Audio("sounds/click1.wav");
const click2 = new Audio("sounds/click2.wav");
const click3 = new Audio("sounds/click3.mp3");

let clickSoundArray = [click1, click2, click3]

let skinArray = ["images/rocket.png"]

let lastMuskbucks = 0;
let muskbucks = 0;
let clickArray = [];
let clickArrayIndex = 0;
let newsArray = [];
let newsIndex = 0;

let mouseX;
let mouseY;

let buildingCostArray = baseBuildingCostArray;
let buildingOutputArray = baseBuildingOutputArray;
let buildingCountArray = [0, 0, 0, 0, 0, 0, 0, 0, 0]
let buildingCostMulitplierArray = baseBuildingCostMulitplierArray
let currentOutput = 0;
let clicks = 0;
let selectedBuyAmount = 0;
let unlockedBuildings = [0, 1];


setInterval(updateMuskbucks, 500)

setInterval(function(){
    checkUpgrades();
    calculateOutput();
    checkBuildingUnlocks();
}, 1000);

function buyBuilding(buildingId, howMany, e){
    let baseCost = baseBuildingCostArray[parseInt(buildingId) -1]
    let totalCost = calculateFutureCost(buildingId, howMany);
    if(muskbucks >= totalCost){
        buttonClickSound.play();
        $(e.target).addClass("buttonClick")
        $(e.target).on("animationend", function(){
            $(e.target).removeClass("buttonClick");
        })
        if(buildingCountArray[buildingId -1] !== 0){
            buildingCostArray[buildingId -1] = Math.ceil(baseCost * ((baseBuildingCostMulitplierArray[buildingId - 1]) ** buildingCountArray[buildingId - 1]) * howMany);
        }else{
            console.log("test")
            buildingCostArray[buildingId -1] = Math.ceil((baseCost * ((baseBuildingCostMulitplierArray[buildingId - 1]) ** buildingCountArray[buildingId - 1]) * howMany) + baseCost / `${buildingId + 1}0`);
        }
        
        buildingCountArray[buildingId - 1] += howMany;
        muskbucks -= totalCost;
        updateMuskbucks()
        updateCountAndCost();

    }else{
        errorSound.play();
        console.log("not enough money")
        $("#incomeStats").addClass("flashRed");
    }
}

function checkUpgrades(){
    
}

function random(max, min){
    return Math.floor(Math.random() * (max - min) + min);
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

function checkBuildingUnlocks(){
    $.each(baseBuildingCostArray, function(index, value){
        if(value <= muskbucks){
            let buildingToUnlockId = index + 3;
            unlockedBuildings.push(index);
            $(`#${buildingToUnlockId}`).attr("hidden", false);
        }
    })
}

function calculateOutput(){
    let output = 0;
    $.each(buildingCountArray, function(index, value){
        output += value * buildingOutputArray[index]
    })
    currentOutput = output;
    muskbucks += output;
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

function updateMuskbucks(){
    let newBreak = $("<br>");
    $("#incomeStats").text(`Muskbucks: ${muskbucks.toFixed(2)}`).append(newBreak).append(`Current Output: ${currentOutput.toFixed(2)}`);
}

$("document").ready(function(){
    updateCountAndCost();

    $(document).mousemove(function(e){
        mouseX = e.pageX;
        mouseY = e.pageY;
    })

    function animateNews(){
        $("#news").animate({
        right: '200%'},
        {
            duration : 30000, 
            easing : "linear",   
            complete : function(){
                $("#news").css("right", "-100%")
            }
        });
    }

    $.get("https://lldev.thespacedevs.com/2.1.0/event/", function(data){
       // console.log(data.results);
        $.each(data.results, function(index, value){
            newsArray.push(value.description);
        })
        $("#news").text(newsArray[newsIndex])
        $("#news").css("right", "-100%")
        animateNews();
        setInterval(function(){
            console.log("test")
            newsIndex++;
            $("#news").text(newsArray[newsIndex])
            animateNews();
        }, 30000)  
    })

    $("#clicker").click(function(){
        clicks++;
        lastMuskbucks = muskbucks;
        muskbucks++;
        updateMuskbucks()
        clickSoundArray[random(1, 3)].play();
        $("#clicker").addClass("flash");
        let moneySign = $("<div>");
        moneySign.text("$");
        moneySign.css("position", "absolute")
        moneySign.css("z-index", "1")
        moneySign.css("pointer-events", "none")
        moneySign.css("color", "blue")
        moneySign.css("left", mouseX)
        moneySign.css("top", mouseY)
        moneySign.css("transform", "scale(3)")
        moneySign.addClass("shiftUp")
        moneySign.on("animationend", function(){
            this.remove();
        })
        $("body").append(moneySign)
    })

    $("#skinsSelector").click(function(){
        let selection = skinArray[random(0, 2)]
        $("#clicker").attr("src", selection)
    })

    $("#marsClickerRewardButton").click(function(){
        $("#marsClickerReward").remove();
        skinArray.push("images/mars.png");
        $("#clicker").attr("src", "images/mars.png")
    })

    $("#clicker").on("animationend", function(){
        $("#clicker").removeClass("flash");
    })

    $("#incomeStats").on("animationend", function(){
        $("#incomeStats").removeClass("flashRed");
    })

    $(".button").click(function(e){
        buttonClickSound.play();
        $(e.target).addClass("buttonClick")
        $(e.target).on("animationend", function(){
            $(e.target).removeClass("buttonClick");
        })
    })

    $(".building").click(function(e){
        if(typeof buyAmount[selectedBuyAmount] === "number"){
            buyBuilding(e.target.id, buyAmount[selectedBuyAmount], e);
        }else{
            console.log("Max buy not yet added")
        }     
    })
})
