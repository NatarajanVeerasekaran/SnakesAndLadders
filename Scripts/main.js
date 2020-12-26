var currentPlayer = 1;
var totalPlayer = 1;
var currentCellArr = [];
var currentPlayerStartArr = [];
var snakeLadderArr = [
    { cellFrom: 98, cellTo: 79, type: "Snake" },
    { cellFrom: 94, cellTo: 74, type: "Snake" },
    { cellFrom: 91, cellTo: 87, type: "Snake" },
    { cellFrom: 88, cellTo: 67, type: "Snake" },
    { cellFrom: 73, cellTo: 52, type: "Snake" },
    { cellFrom: 61, cellTo: 18, type: "Snake" },
    { cellFrom: 63, cellTo: 59, type: "Snake" },
    { cellFrom: 45, cellTo: 24, type: "Snake" },
    { cellFrom: 48, cellTo: 10, type: "Snake" },
    { cellFrom: 15, cellTo: 5, type: "Snake" },
    { cellFrom: 1, cellTo: 37, type: "Ladder" },
    { cellFrom: 6, cellTo: 13, type: "Ladder" },
    { cellFrom: 7, cellTo: 30, type: "Ladder" },
    { cellFrom: 14, cellTo: 25, type: "Ladder" },
    { cellFrom: 20, cellTo: 41, type: "Ladder" },
    { cellFrom: 27, cellTo: 83, type: "Ladder" },
    { cellFrom: 35, cellTo: 43, type: "Ladder" },
    { cellFrom: 50, cellTo: 66, type: "Ladder" },
    { cellFrom: 70, cellTo: 90, type: "Ladder" },
    { cellFrom: 86, cellTo: 93, type: "Ladder" }
]
function rollDiceWithoutValues() {
    const element = document.getElementById('dice-box1');
    const numberOfDice = 1;
    const options = {
        element, // element to display the animated dice in.
        numberOfDice, // number of dice to use 
        //values,
        callback: function (res) {
            movePiece(res[0]);
        }
    }
    rollADie(options);
}

function bindCell() {
    currentPlayer = 1;
    let currentPlayerCaption = document.getElementById("current-player-caption");
    let cellContainer = document.getElementById("cell-container");
    currentPlayerCaption.innerText = 1;
    let counter = 0;
    let className = "";
    for (let index = 100; index > 0; index--) {
        if (index % 10 == 0) {
            counter = counter + 1;
        }
        if (counter % 2 == 0) {
            className = "tile-right";
        } else {
            className = "tile-left";
        }
        let cellElement = document.createElement("div");
        cellElement.setAttribute("data-index", index);
        cellElement.className = "tile tile" + index + " " + className;
        cellElement.tabIndex = index;
        cellContainer.appendChild(cellElement);
    }
}

function bindPiece(noOfPlayers) {
    totalPlayer = noOfPlayers;
    let pieceContainer = document.getElementById("piece-container");
    for (let index = 1; index <= noOfPlayers; index++) {
        currentCellArr.push(0);
        currentPlayerStartArr.push(false);
        let svg = getNode("svg", { id: "piece-player-" + index, class: "piece", "viewBox": "0 0 100 100" });

        let g = getNode("g", {});

        g.appendChild(getNode('path', { d: "M 50,1 C 50,1 80,85 80,85 70,96 60,99 50,99 40,99 30,96 20,85 20,85 50,1 50,1 Z" }));
        g.appendChild(getNode('circle', { cx: 50, cy: 21, r: 20 }));
        g.appendChild(getNode('rect', { x: 44, y: 25, width: 12, height: 22, stroke: "none" }));
        svg.appendChild(g);
        pieceContainer.appendChild(svg);
    }

    function getNode(n, v) {
        n = document.createElementNS("http://www.w3.org/2000/svg", n);
        for (var p in v) {
            n.setAttributeNS(null, p, v[p]);
        }
        return n
    }
}

function movePiece(diesNumber) {
    console.log("Dies: " + diesNumber);
    let piece = document.getElementById("piece-player-" + currentPlayer);
    let isBottomMove = false;
    let previousCell = currentCellArr[currentPlayer - 1];
    if (currentPlayerStartArr[currentPlayer - 1]) {
        let currentCell = previousCell + diesNumber;
        let currentBottom = 1;
        if (currentCell <= 100) {
            let previousBottom = Math.ceil(previousCell / 10);
            currentBottom = Math.ceil(currentCell / 10);
            isBottomMove = (previousBottom != currentBottom);
        }
        if (isBottomMove) {
            if (!piece.style.bottom && currentBottom != 1) {
                piece.style.bottom = "65px";
            } else {
                if (currentBottom != 1) {
                    piece.style.bottom = (currentBottom * 65) + "px";
                }
            }
        }
        let currentRowCell = 1;
        if (currentCell <= 100) {
            let isEven = (Math.ceil(currentCell / 10) % 2) == 0 ? true : false;
            currentRowCell = Math.ceil(currentCell % 10);
            piece.style.left = isEven ? ((9 - currentRowCell) * 46) + "px" : ((currentRowCell + 1) * 46) + "px";
            console.log("isEven: " + isEven + " Left:" + piece.style.left);
        }
        (function (cCell) {
            setTimeout(function () {
                var obj = snakeLadderArr.filter((x) => {
                    if (x.cellFrom == cCell) {
                        return x;
                    }
                });
                if (obj.length > 0) {
                    let virtualDiesValue = obj[0].type == "Snake" ? -(obj[0].cellTo - cCell) : obj[0].cellTo - cCell;
                    movePiece(virtualDiesValue);
                } else {
                    currentCellArr[currentPlayer - 1] = cCell;
                    currentPlayer += 1
                    if (currentPlayer > totalPlayer) {
                        currentPlayer = 1;
                    }
                    let currentPlayerCaption = document.getElementById("current-player-caption");
                    currentPlayerCaption.innerText = currentPlayer;
                }
            }, 1000);
        })(currentCell);
    }
    else {
        if (diesNumber == 1) {
            currentPlayerStartArr[currentPlayer - 1] = true;
        }
        currentPlayer += 1
        if (currentPlayer > totalPlayer) {
            currentPlayer = 1;
        }
        let currentPlayerCaption = document.getElementById("current-player-caption");
        currentPlayerCaption.innerText = currentPlayer;
    }

}
bindCell();
bindPiece(2);