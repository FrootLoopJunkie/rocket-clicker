const body = $("body");
const baseBuildingCostArray = [15, 100, 500, 2000, 7000, 50000, 1000000, 150000000, 1000000000]
const baseBuildingOutputArray = [0.2, 1, 4, 9, 23, 99, 1117, 25119, 257531]
const baseBuildingCountArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
const baseBuildingCostMulitplierArray = [1.15, 1.17,  1.18, 1.19, 1.20,  1.21,  1.22,  1.23,  1.24]
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
let selectedBuyAmount = "1";
let unlockedBuildings = [0, 1];

const mouseUpgrades = {
    target : [100, 1000, 50000, 500000],
    cost : [50, 500, 6500, 25000],
    multiplier : [2, 3, 5, 7],
    icon : "../images/mousepointer.png"
}

const buildingUpgrades = {
    0 : {
        target : [15, 75, 150, 500],
        cost : [500, 5000, 50000, 150000],
        multiplier : [2, 3, 5, 10],
        icon : "../images/rocketIcon.png"
    },
    1 : {
        target : [15, 75, 150, 500],
        cost : [5000, 50000, 150000, 1500000],
        multiplier : [2, 3, 5, 10],
        icon : "../images/science.png"
    },
    2 : {
        target : [15, 75, 150, 500],
        cost : [25000, 250000, 1200000, 35000000],
        multiplier : [2, 3, 5, 10],
        icon : "../images/prteam.png"
    },
    3 : {
        target : [15, 75, 150, 500],
        cost : [75000, 420000, 2400000, 56000000],
        multiplier : [2, 3, 5, 10],
        icon : "../images/assemblyBuilding.png"
    },
    4 : {
        target : [15, 75, 150, 500],
        cost : [700000, 3700000, 68000000, 540000000],
        multiplier : [2, 3, 5, 10],
        icon : "../images/launchpad.png"
    },
    5 : {
        target : [15, 75, 150, 500],
        cost : [16000000, 100000000, 760000000, 13000000000],
        multiplier : [2, 3, 5, 10],
        icon : "../images/refinery.png"
    },
    6 : {
        target : [15, 75, 150, 500],
        cost : [125000000, 950000000, 49000000000, 542000000000],
        multiplier : [2, 3, 5, 10],
        icon : "../images/satellite.png"
    },
    7 : {
        target : [15, 75, 150, 500],
        cost : [1200000000, 37000000000, 367000000000, 1350000000000],
        multiplier : [2, 3, 5, 10],
        icon : "../images/spacestation.png"
    },
    8 : {
        target : [15, 75, 150, 500],
        cost : [50000000000, 420000000000, 1200000000000, 25000000000000],
        multiplier : [2, 3, 5, 10],
        icon : "../images/moonbase.png"
    }
}


setInterval(updateMuskbucks, 500)

setInterval(function(){
    checkUpgrades();
    calculateOutput();
    checkBuildingUnlocks();
    updateCostColor();
}, 1000);

function checkUpgrades(){
    if(clicks >= mouseUpgrades.target[0]){
        let newUpgradeDiv = $("<div>")
        newUpgradeDiv.css("height", "50px").css("width", "50px").css("position", "relative").css("float", "left").addClass("upgradeIconContainer")
        let newUpgrade = $("<img>")
        newUpgrade.addClass("upgradeIcon button").css("width", "50px").css("height", "50px");
        newUpgrade.attr("src", mouseUpgrades.icon)
        newUpgradeDiv.appendTo("#upgradesContainer")
        newUpgrade.appendTo(newUpgradeDiv)
        mouseUpgrades.target.shift();
        newUpgrade.click(function(){
            if(muskbucks >= mouseUpgrades.cost[0]){
                mouseUpgrades.cost.shift();
            }
        });
    }
    $.each(buildingCountArray, function(index, value){
        if(value >= buildingUpgrades[index].target[0]){
            let newUpgradeDiv = $("<div>")
            newUpgradeDiv.css("height", "50px").css("width", "50px").css("position", "relative").css("float", "left").addClass("upgradeIconContainer")
            let newUpgrade = $("<img>")
            newUpgrade.addClass("upgradeIcon button").css("width", "50px").css("height", "50px");
            newUpgrade.attr("src", buildingUpgrades[index].icon)
            newUpgradeDiv.appendTo("#upgradesContainer")
            newUpgrade.appendTo(newUpgradeDiv)
            buildingUpgrades[index].target.shift();
            newUpgrade.click(function(){
                if(muskbucks >= buildingUpgrades[index].cost[0]){
                    muskbucks -= buildingUpgrades[index].cost[0];
                    buildingUpgrades[index].cost.shift();
                    buttonClickSound.play();
                    buildingOutputArray[index] = (baseBuildingOutputArray[index] * buildingUpgrades[index].multiplier[0]).toFixed(2);
                    buildingUpgrades[index].multiplier.shift();
                    updateCountAndCost();
                    newUpgradeDiv.remove();
                }
            })  
        }
    })
}

function buyBuilding(buildingId, howMany, e){
    let totalCost = calculateFutureCost(buildingId, howMany);
    if(muskbucks >= totalCost){
        buttonClickSound.play();
        $(e.target).addClass("buttonClick")
        $(e.target).on("animationend", function(){
            $(e.target).removeClass("buttonClick");
        })
        buildingCountArray[buildingId - 1] += howMany;
        muskbucks -= totalCost;
        updateMuskbucks()
        updateCountAndCost();

    }else{
        errorSound.play();
        $("#incomeStats").addClass("flashRed");
    }
}

function random(max, min){
    return Math.floor(Math.random() * (max - min) + min);
}

function calculateFutureCost(buildingId, howMany){
    let baseCost = baseBuildingCostArray[buildingId -1]
    let buildingCount = buildingCountArray[buildingId - 1];
    let totalCost = 0;
    let cost = 0;
    for(i = 0; i < howMany; i++){
        cost = Math.ceil(baseCost * buildingCostMulitplierArray[buildingId - 1] **  ((buildingCount) / 1.5));
        buildingCount ++;
        totalCost += cost;
    }
    return totalCost;
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
        let countSpan = $("<span>")
        let costSpan = $(`<span id='costSpan${value.id}'>`).text(`Cost x${selectedBuyAmount}: $${calculateFutureCost(value.id, parseInt(selectedBuyAmount)).toLocaleString(undefined,{'minimumFractionDigits':2,'maximumFractionDigits':2})}`)
        let newTarget = ($(`#${value.id} > span`))
        let newBreak = $("<br>");
        let newBreak2 = $("<br>");
        let newBreak3 = $("<br>");
        newTarget.empty().append(newBreak).append(`Owned: ${buildingCountArray[value.id - 1]}`).append(newBreak3).append(costSpan).append(newBreak2).append(`Increase Output by: $${buildingOutputArray[value.id - 1]}/s`)
        if(calculateFutureCost(value.id, parseInt(selectedBuyAmount)) <= muskbucks){
            costSpan.css("color", "LimeGreen");
        }else{
            costSpan.css("color", "orange");
        }
    })
}

function updateCostColor(){
    let target = $(".building");
    $.each(target, function(index, value){
        let costSpan = $(`#costSpan${value.id}`);
        if(calculateFutureCost(value.id, parseInt(selectedBuyAmount)) <= muskbucks){
            costSpan.css("color", "LimeGreen");
        }else{
            costSpan.css("color", "orange");
        }
    });
}

function updateMuskbucks(){
    let newBreak = $("<br>");
    $("#incomeStats").text(`Muskbucks: $${muskbucks.toFixed(2)}`).append(newBreak).append(`Current Output: $${currentOutput.toFixed(2)}/s`);
    $("title").text(`Rocket Clicker: $${muskbucks.toFixed(2)}`)
}

$("document").ready(function(){
    updateCountAndCost();

    $(".buyAmount").click(function(e){
        buttonClickSound.play();
        selectedBuyAmount = e.target.textContent;
        updateCountAndCost();
    })

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
        $.each(data.results, function(index, value){
            newsArray.push(value.description);
        })
        $("#news").text(newsArray[newsIndex])
        $("#news").css("right", "-100%")
        animateNews();
        setInterval(function(){
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
        if(buyAmount.includes(parseInt(selectedBuyAmount))){
            buyBuilding(e.target.id, parseInt(selectedBuyAmount), e);
        }else{
        }     
    })

})
