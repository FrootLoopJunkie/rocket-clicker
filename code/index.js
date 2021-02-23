let appName = "Rocket Clicker";
let devName = "Kolby Blade";
let yearMade = 2021;
let latestVersion = "1.0b"
const moonLanding = new Date('July 20, 69 00:20:18 GMT+00:00');

const body = $("body");
const baseBuildingCostArray = [15, 100, 500, 2000, 7000, 50000, 1000000, 150000000, 1000000000]
const baseBuildingCostMulitplierArray = [1.15, 1.17,  1.18, 1.19, 1.20,  1.21,  1.22,  1.23,  1.24]
const buyAmount = [1, 10, 100, "max", "maxCalculated"];
let maxBuyArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const buttonClickSound = new Audio("sounds/buttonClick.wav");
const errorSound = new Audio("sounds/error.mp3")
const click1 = new Audio("sounds/click1.wav");
const click2 = new Audio("sounds/click2.wav");
const click3 = new Audio("sounds/click3.mp3");

let clickSoundArray = [click1, click2, click3]

let starTargetOutput = 0.5;



let skinArray = ["images/rocket.png"]
let newsArray = [];
let newsIndex = 0;

let autosave = true;

let mouseX;
let mouseY;

let buildingNameArray = ["Homemade Rocket", "Backyard Scientist", "PR Team", "Rocket Assembly Building", "Launchpad", "Fuel Refinery", "Satellite", "Space Station", "Moon Base"]
let buildingCostArray = baseBuildingCostArray;
let buildingCostMulitplierArray = baseBuildingCostMulitplierArray
let selectedBuyAmount = "1";

let saveData = {
    muskbucks : 0,
    currentOutput : 0,
    clicks : 0,
    buildingCountArray : [0, 0, 0, 0, 0, 0, 0, 0, 0],
    buildingOutputArray : [0.2, 1, 4, 9, 23, 99, 1117, 25119, 257531],
    unlockedBuildings : [1, 2],
    buildingUpgrades : {
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
    },
    mouseUpgrades : {
        target : [100, 1000, 50000, 500000],
        cost : [250, 2500, 25000, 250000],
        multiplier : [1, 1, 1, 2],
        icon : "../images/mousepointer.png"
    },
    mouseMultiplier : 1,
    unclaimedUpgrades : {},
    currentVersion : "",
    unlockedSkins : [],
    lastPlayed: ""
};

let unloadedUpgrades = {};

let localStorage = window.localStorage;

setInterval(updateMuskbucks, 500)

setInterval(function(){
    checkUpgrades();
    calculateOutput();
    checkBuildingUnlocks();
    updateCostColor();
    generateStars()

    if(autosave){
        save();
    }
    
    if(selectedBuyAmount === "maxCalculated"){
        updateCountAndCost();
        selectedBuyAmount = "Max"
        calculateFutureCost();
    }
}, 1000);

function save(){
    let dateNow = moonLanding.getTime() + Date.now();
    saveData.lastPlayed = dateNow;
    saveDataString = JSON.stringify(saveData);
    localStorage.setItem("saveData", saveDataString);
}

function load(){
    let loadedData = localStorage.getItem("saveData");
    saveData = JSON.parse(loadedData)
    unloadedUpgrades = JSON.parse(JSON.stringify(saveData.unclaimedUpgrades));

    $.each(saveData.unlockedBuildings, function(index, value){
        if(saveData.unlockedBuildings.includes(index + 1)){
            let buildingToUnlockId = index + 1;
            $(`#${buildingToUnlockId}`).attr("hidden", false);
        }
    })

            
    if(typeof saveData.lastPlayed === "number"){
        let newDate = moonLanding.getTime() + Date.now();
        let msSince = newDate - saveData.lastPlayed;
        let secondsSince = msSince / 1000;
        let output = calculateOutput();
        loadedData.muskbucks += secondsSince * output;
    }

    checkUpgrades();
    calculateOutput();
    updateCostColor();
    generateStars();
    updateCountAndCost();
    loadUpgrades();
    save();
}

function checkUpgrades(){
    $.each(saveData.mouseUpgrades.target, function (key, value){
        if(saveData.clicks >= value){
            saveData.unclaimedUpgrades["mouseUpgrade" + saveData.mouseUpgrades.target[0]] = {};
            saveData.unclaimedUpgrades["mouseUpgrade" + saveData.mouseUpgrades.target[0]]["cost"] = saveData.mouseUpgrades.cost[0];
            saveData.unclaimedUpgrades["mouseUpgrade" + saveData.mouseUpgrades.target[0]]["multiplier"] = saveData.mouseUpgrades.multiplier[0];
            saveData.unclaimedUpgrades["mouseUpgrade" + saveData.mouseUpgrades.target[0]]["icon"] = saveData.mouseUpgrades.icon;
            unloadedUpgrades["mouseUpgrade" + saveData.mouseUpgrades.target[0]] = {};
            unloadedUpgrades["mouseUpgrade" + saveData.mouseUpgrades.target[0]]["cost"] = saveData.mouseUpgrades.cost[0];
            unloadedUpgrades["mouseUpgrade" + saveData.mouseUpgrades.target[0]]["multiplier"] = saveData.mouseUpgrades.multiplier[0];
            unloadedUpgrades["mouseUpgrade" + saveData.mouseUpgrades.target[0]]["icon"] = saveData.mouseUpgrades.icon;
            saveData.mouseUpgrades.target.shift();
            saveData.mouseUpgrades.cost.shift();
            saveData.mouseUpgrades.multiplier.shift();
        }
    })

    $.each(saveData.buildingCountArray, function(index, value){
        if(value >= saveData.buildingUpgrades[index].target[0]){
            saveData.unclaimedUpgrades[index + "buildingUpgrade" + saveData.buildingUpgrades[index].target[0]] = {};
            saveData.unclaimedUpgrades[index + "buildingUpgrade" + saveData.buildingUpgrades[index].target[0]]["cost"] = saveData.buildingUpgrades[index].cost[0];
            saveData.unclaimedUpgrades[index + "buildingUpgrade" + saveData.buildingUpgrades[index].target[0]]["multiplier"] = saveData.buildingUpgrades[index].multiplier[0];
            saveData.unclaimedUpgrades[index + "buildingUpgrade" + saveData.buildingUpgrades[index].target[0]]["icon"] = saveData.buildingUpgrades[index].icon;
            unloadedUpgrades[index + "buildingUpgrade" + saveData.buildingUpgrades[index].target[0]] = {};
            unloadedUpgrades[index + "buildingUpgrade" + saveData.buildingUpgrades[index].target[0]]["cost"] = saveData.buildingUpgrades[index].cost[0];
            unloadedUpgrades[index + "buildingUpgrade" + saveData.buildingUpgrades[index].target[0]]["multiplier"] = saveData.buildingUpgrades[index].multiplier[0];
            unloadedUpgrades[index + "buildingUpgrade" + saveData.buildingUpgrades[index].target[0]]["icon"] = saveData.buildingUpgrades[index].icon;
            saveData.buildingUpgrades[index].target.shift();
            saveData.buildingUpgrades[index].cost.shift();
            saveData.buildingUpgrades[index].multiplier.shift();
        }
    })

    loadUpgrades();
}

function loadUpgrades(){
    $.each(unloadedUpgrades, function(key, value){
        let isBuilding = false;
        let isMouse = false;

        let newUpgradeDiv = $("<div>")
        let newUpgradeTooltip = $("<span>").addClass("tooltiptext");
        newUpgradeDiv.css("height", "50px").css("width", "50px").css("position", "relative").css("float", "left").addClass("upgradeIconContainer tooltip")
        let newUpgrade = $("<img>")
        newUpgrade.addClass("upgradeIcon").css("width", "50px").css("height", "50px");
        newUpgrade.attr("src", value.icon)
        newUpgradeDiv.appendTo("#upgradesContainer")
        newUpgradeTooltip.appendTo(newUpgradeDiv)
        newUpgrade.appendTo(newUpgradeDiv)


        if(key.includes("mouse")){
            isMouse = true;
            newUpgradeTooltip.text(`Increases Muskbuck gain per click by ${value.multiplier}. Cost: $${value.cost.toLocaleString()}`)
        }else if(key.includes("building")){
            isBuilding = true;
            newUpgradeTooltip.text(`Increases output of ${buildingNameArray[key[0]]}'s by ${value.multiplier}x. Cost: $${value.cost.toLocaleString()}`)
        }

        newUpgrade.click(function(){
            if(saveData.muskbucks >= value.cost){
                if(isMouse){
                    saveData.mouseMultiplier += value.multiplier;
                }else if(isBuilding){
                    targetIndex = key[0];
                    saveData.buildingOutputArray[targetIndex] = (saveData.buildingOutputArray[targetIndex] * value.multiplier).toFixed(2);
                }
                saveData.muskbucks -= value.cost;
                buttonClickSound.play();
                updateCountAndCost();
                newUpgradeDiv.remove();
                delete saveData.unclaimedUpgrades[`${key}`];
            }else{
                errorSound.play();
            }
        })  
        delete unloadedUpgrades[`${key}`];
    })
}

function buyBuilding(buildingId, howMany, e){
    let totalCost = 0;

    if(selectedBuyAmount === "Max" || selectedBuyAmount === "maxCalculated"){
        totalCost = calculateFutureCost(buildingId, maxBuyArray[buildingId - 1]);
        howMany = maxBuyArray[buildingId - 1];
    }else{
        totalCost = calculateFutureCost(buildingId, howMany);
    }

    if(saveData.muskbucks >= totalCost){
        buttonClickSound.play();
        $(e.target).addClass("buttonClick")
        $(e.target).on("animationend", function(){
            $(e.target).removeClass("buttonClick");
        })
        saveData.buildingCountArray[buildingId - 1] += parseInt(howMany);
        saveData.muskbucks -= totalCost;
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
    let buildingCount = saveData.buildingCountArray[buildingId - 1];
    let totalCost = 0;
    let cost = 0;

    if(selectedBuyAmount === "Max"){
        let iterations = 0;
        $.each(saveData.buildingCountArray, function(index, value){
            let buildingCount = 0;
            let iterations = 0;
            totalCost = 0;
            for(;totalCost < saveData.muskbucks; ){
                cost = Math.ceil(baseBuildingCostArray[index] * buildingCostMulitplierArray[index] **  ((value + buildingCount) / 1.5));
                buildingCount ++;
                totalCost += cost;
                iterations++;
            }
            if(iterations !== 1){
                maxBuyArray[index] = (iterations - 1)
            }else{
                maxBuyArray[index] = (iterations)
            }  
        })
        selectedBuyAmount = "maxCalculated"
        return false;
    }
    for(i = 0; i < howMany; i++){
        cost = Math.ceil(baseCost * buildingCostMulitplierArray[buildingId - 1] **  ((buildingCount) / 1.5));
        buildingCount ++;
        totalCost += cost;
    }
    return totalCost;
}

function checkBuildingUnlocks(){
    $.each(baseBuildingCostArray, function(index, value){
        if(value <= saveData.muskbucks && !saveData.unlockedBuildings.includes(index + 3)){
            let buildingToUnlockId = index + 3;
            saveData.unlockedBuildings.push(index + 3);
            $(`#${buildingToUnlockId}`).attr("hidden", false);
        }
    })
}

function calculateOutput(){
    let output = 0;
    $.each(saveData.buildingCountArray, function(index, value){
        output += value * saveData.buildingOutputArray[index]
    })
    saveData.currentOutput = output;
    saveData.muskbucks += output;
    return output;
}

function updateCountAndCost(){
    let target = $(".building");
    $.each(target, function(index, value){
        if(selectedBuyAmount !== "Max" && selectedBuyAmount !== "maxCalculated"){
            let countSpan = $("<span>")
            let costSpan = $(`<span id='costSpan${value.id}'>`).text(`Cost x${selectedBuyAmount}: $${calculateFutureCost(value.id, parseInt(selectedBuyAmount)).toLocaleString(undefined,{'minimumFractionDigits':2,'maximumFractionDigits':2})}`)
            let newTarget = ($(`#${value.id} > span`))
            let newBreak = $("<br>");
            let newBreak2 = $("<br>");
            let newBreak3 = $("<br>");
            newTarget.empty().append(newBreak).append(`Owned: ${saveData.buildingCountArray[value.id - 1]}`).append(newBreak3).append(costSpan).append(newBreak2).append(`Increase Output by: $${saveData.buildingOutputArray[value.id - 1]}/s`)
            if(calculateFutureCost(value.id, parseInt(selectedBuyAmount)) <= saveData.muskbucks){
                costSpan.css("color", "LimeGreen");
            }else{
                costSpan.css("color", "orange");
            }

        }else if(selectedBuyAmount === "Max" || selectedBuyAmount === "maxCalculated"){
            
            $.each(maxBuyArray, function(index2, value2){
                let countSpan = $("<span>")
                let costSpan = $(`<span id='costSpan${index2}'>`).text(`Cost x${maxBuyArray[index2 - 1]}: $${calculateFutureCost(index2, maxBuyArray[index2 - 1]).toLocaleString(undefined,{'minimumFractionDigits':2,'maximumFractionDigits':2})}`)
                let newTarget = ($(`#${index2} > span`))
                let newBreak = $("<br>");
                let newBreak2 = $("<br>");
                let newBreak3 = $("<br>");
                newTarget.empty().append(newBreak).append(`Owned: ${saveData.buildingCountArray[index2 - 1]}`).append(newBreak3).append(costSpan).append(newBreak2).append(`Increase Output by: $${saveData.buildingOutputArray[index2 - 1]}/s`)
                if(calculateFutureCost(index2, maxBuyArray[index2 - 1]) <= saveData.muskbucks && maxBuyArray[index2 - 1] !== 0){
                    costSpan.css("color", "LimeGreen");
                }else{
                    costSpan.css("color", "orange");
                }
            })
        }
    })
}

function updateCostColor(){
    let target = $(".building");
    if(selectedBuyAmount !== "Max" && selectedBuyAmount !== "maxCalculated"){
        $.each(target, function(index, value){
            let costSpan = $(`#costSpan${value.id}`);
            if(calculateFutureCost(value.id, parseInt(selectedBuyAmount)) <= saveData.muskbucks){
                costSpan.css("color", "LimeGreen");
            }else{
                costSpan.css("color", "orange");
            }
        });
    }else{
        $.each(maxBuyArray, function(index2, value2){
            let costSpan = $(`#costSpan${index2}`);
            if(calculateFutureCost(index2, maxBuyArray[index2 - 1]) <= saveData.muskbucks &&  maxBuyArray[index2 - 1] !== 0){
                costSpan.css("color", "LimeGreen");
            }else{
                costSpan.css("color", "orange");
            }
        });
    }
}

function generateStars(){
    if(saveData.currentOutput >= starTargetOutput){
        let starDiv = $("<div class='starDiv'>");
        let starImg = $("<img class='starImg' src='../images/star.png'>")
        starImg.appendTo(starDiv);
        starDiv.appendTo("#clickerContainer").css("left", `${random(0, 100)}%`).animate({
            top: '105%'},
        {
            duration : random(3000, 9000), 
            easing : "linear",   
            complete : function(){
                starAnimation(starDiv)
            }
        });
        starTargetOutput = starTargetOutput * 1.5;
    }
}

function starAnimation(target){
    target.removeAttr('style').animate({
        top: '105%'},
    {
        duration : random(3000, 9000), 
        easing : "linear",   
        complete : function(){
            starAnimation(target)
        }
    });
}

function updateMuskbucks(){
    let newBreak = $("<br>");
    $("#incomeStats").text(`Muskbucks: $${saveData.muskbucks.toLocaleString()}`).append(newBreak).append(`Current Output: $${saveData.currentOutput.toLocaleString()}/s`);
    $("title").text(`Rocket Clicker: $${saveData.muskbucks.toFixed(2)}`)
}

function addDollarSigns(){
    dollarString = ""
    for(let i = 0; i < saveData.mouseMultiplier; i++){
        dollarString += "$"
    }
    return dollarString;
}

function loadSkins(){
    $.each(saveData.unlockedSkins, function(index, value){
        let clone = $("#placeholderSkinButton").clone()
        clone.children().attr("src", `${value}`).click(function(e){
            $("#clicker").attr("src", `${value}`)
        });
        $("#skinSelectorBackground").append(clone);
    })
}

$("document").ready(function(){
    updateCountAndCost();

    if(localStorage.length === 0){
        saveData.currentVersion = latestVersion;
    }

    if(localStorage.length !== 0){
        let loadedData = localStorage.getItem("saveData");

        if(loadedData === undefined){  //check if save is pre save object pre v1.0b
            loadedData = localStorage.getItem("savedData");
            let parsedData = JSON.parse(loadedData)
            saveData.muskbucks = parsedData.saves.muskbucks;
            saveData.currentOutput = parsedData.saves.currentOutput;
            saveData.clicks =  parsedData.saves.clicks;
            saveData.buildingCountArray = parsedData.saves.buildingCountArray;
            saveData.buildingOutputArray = parsedData.saves.buildingOutputArray;
            saveData.unlockedBuildings = parsedData.saves.unlockedBuildings;
            saveData.buildingUpgrades = parsedData.saves.buildingUpgrades;
            saveData.mouseUpgrades =  parsedData.saves.mouseUpgrades;
            saveData.mouseMultiplier = parsedData.saves.mouseMultiplier;
            saveData.unclaimedUpgrades = parsedData.saves.unclaimedUpgrades;
            saveData.unloadedUpgrades = JSON.parse(JSON.stringify(parsedData.saves.unclaimedUpgrades));
            saveData.currentVersion = parsedData.saves.currentVersion;
            saveData.unlockedSkins = [];
        }

        load();
    }

    if(saveData.currentVersion !== latestVersion){
        alert(`This save is from game version ${saveData.currentVersion}. We will attempt to convert progress but data may corrupt in the conversion process.`)
        autosave = false;
        let loadedData = localStorage.getItem("saveData");

        if(loadedData === undefined){  //check if save is pre save object < v1.1a
            loadedData = localStorage.getItem("savedData");
            let parsedData = JSON.parse(loadedData)
            saveData.muskbucks = parsedData.saves.muskbucks;
            saveData.currentOutput = parsedData.saves.currentOutput;
            saveData.clicks =  parsedData.saves.clicks;
            saveData.buildingCountArray = parsedData.saves.buildingCountArray;
            saveData.buildingOutputArray = parsedData.saves.buildingOutputArray;
            saveData.unlockedBuildings = parsedData.saves.unlockedBuildings;
            saveData.buildingUpgrades = parsedData.saves.buildingUpgrades;
            saveData.mouseUpgrades =  parsedData.saves.mouseUpgrades;
            saveData.mouseMultiplier = parsedData.saves.mouseMultiplier;
            saveData.unclaimedUpgrades = parsedData.saves.unclaimedUpgrades;
            saveData.unloadedUpgrades = JSON.parse(JSON.stringify(parsedData.saves.unclaimedUpgrades));
            saveData.currentVersion = parsedData.saves.currentVersion;
            saveData.unlockedSkins = [];
        }

        saveData.currentVersion = latestVersion;
        save();
        location.reload();
    }

    $("#restartButton").click(function(e){
        if(confirm("Are you sure? All progress will be lost.")){
            autosave = false;
            localStorage.clear();
            location.reload();
        }
    });

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
        saveData.clicks++;
        saveData.muskbucks += 1 * saveData.mouseMultiplier;
        updateMuskbucks()
        clickSoundArray[random(1, 3)].play();
        $("#clicker").addClass("flash");
        let moneySign = $("<div>");
        moneySign.text(addDollarSigns());
        moneySign.css("position", "absolute")
        moneySign.css("z-index", "1")
        moneySign.css("pointer-events", "none")
        moneySign.css("color", "LimeGreen")
        moneySign.css("left", mouseX)
        moneySign.css("top", mouseY)
        moneySign.css("transform", "scale(2)")
        moneySign.addClass("shiftUp")
        moneySign.on("animationend", function(){
            this.remove();
        })
        $("body").append(moneySign)
    })

    loadSkins();

    $("#skinsSelector").click(function(){
        let visible = $("#skinSelectorContainer").attr("hidden");
        $("#skinSelectorContainer").toggle()
    })

    if(saveData.unlockedSkins.includes("images/perseverance.png")){
        $("#marsClickerRewardButton").prop("disabled", true).text("Already Claimed").css({
            "opacity": 0.8,
            "cursor": "not-allowed"
        });
    }

    $("#marsClickerRewardButton").click(function(){
        $("#marsClickerRewardButton").prop("disabled", true).text("Enjoy The Skin!").css({
            "opacity": 0.8,
            "cursor": "not-allowed"
        });
        $("#clicker").attr("src", `images/perseverance.png`)
        let clone = $("#placeholderSkinButton").clone()
        clone.children().attr("src", `images/perseverance.png`).click(function(e){
            $("#clicker").attr("src", `${$(e.target).attr("src")}`)
        });
        $("#skinSelectorBackground").append(clone);
        saveData.unlockedSkins.push("images/perseverance.png");
       
    })

    $(".skinButtonImage").click(function(e){
        $("#clicker").attr("src", `${$(e.target).attr("src")}`)
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
        buyBuilding(e.target.id, selectedBuyAmount, e);
    })

    $("#footer").text(`${appName} - ${devName} - ${yearMade} - ${latestVersion}`)
})
