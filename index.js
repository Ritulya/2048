var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var Score = document.getElementById('score');

var score = 0;
var cells = [];
var fontSize;
var loss = false;
var width = canvas.width / 4 - 6;


function canvasClear(){
    ctx.clearRect(0,0,600,600);
}

function startGame(){
    createCells();
    drawAllCells();
    pasteNewCell();
    pasteNewCell();
}

function finishGame() {
    localStorage.setItem('score2048', this.score);
    canvas.style.opacity = '0.3';
    loss = true;
}

function cell(row, col){
    this.value = 0;
    this.x = col * width + 5 * (col+1);
    this.y = row * width + 5 * (row+1);
}

function createCells(){
    for(var i=0; i<4; i++){
        cells[i] = [];
        for(var j=0; j<4; j++){
            cells[i][j] = new cell(i,j);
        }
    }
}

function drawCell(cell){
    ctx.beginPath();
    ctx.rect(cell.x, cell.y, width, width);

    var fontColor;

    ctx.fillStyle = "#FBFBFB";

    switch(cell.value){
        case 2 : ctx.fillStyle = "#ffee5a"; fontColor = "black"; break;
        case 4 : ctx.fillStyle = "#ffdaf4"; fontColor = "black"; break;
        case 8 : ctx.fillStyle = "#84c3df"; fontColor = "black"; break;
        case 16 : ctx.fillStyle = "#b2edce"; fontColor = "black"; break;
        case 32 : ctx.fillStyle = "#ec7b7d"; fontColor = "black"; break;
        case 64 : ctx.fillStyle = "#fdc168"; fontColor = "black"; break;
        case 128 : ctx.fillStyle = "#768FDf"; fontColor = "black"; break;
        case 256 : ctx.fillStyle = "#91d1be"; fontColor = "black"; break;
        case 512 : ctx.fillStyle = "#ffcb4f"; fontColor = "black"; break;
        case 1024 : ctx.fillStyle = "#4eb7d9"; fontColor = "black"; break;
        case 2048 : ctx.fillStyle = "#a882f6"; fontColor = "black"; break;
        case 4096 : ctx.fillStyle = "#f9621f"; fontColor = "black"; break;
    }

    ctx.fill();
    if(cell.value){
        fontSize = width/1.5;
        ctx.font = fontSize + "px Amatic SC";
        ctx.fillStyle = fontColor;
        ctx.textAlign = "center";
        ctx.fillText(cell.value, cell.x+width/2, cell.y+width/1.5);
    }
}

function drawAllCells(){
    for(var i=0; i<4; i++){
        for(var j=0; j<4; j++){
            drawCell(cells[i][j]);
        }
    }
}

function pasteNewCell(){
    var countFree = 0;
    var i, j;
    for(i = 0; i < 4; i++) {
        for(j = 0; j < 4; j++) {
            if(!cells[i][j].value) {
                countFree++;
            }
        }
    }
    if(!countFree) {
        finishGame();
        return;
    }
    while(true){
        var row = Math.floor(Math.random()*4);
        var col = Math.floor(Math.random()*4);
        if(!cells[row][col].value){
            cells[row][col].value = 2 * Math.ceil(Math.random()*2);
            drawAllCells();
            return;
        }
    }
}

document.addEventListener('keydown', function(event){
    if(!loss){
        if(event.keyCode == 38 || event.keyCode == 87) moveUp();
        else if(event.keyCode == 39 || event.keyCode == 68) moveRight();
        else if(event.keyCode == 40 || event.keyCode == 83) moveDown();
        else if(event.keyCode == 37 || event.keyCode == 65) moveLeft();
        Score.textContent = score;
    }
});

function moveRight () {
    var i, j;
    var col;
    for(i = 0; i < 4; i++) {
        for(j = 2; j >= 0; j--) {
            if(cells[i][j].value) {
                col = j;
                while (col + 1 < 4) {
                    if (!cells[i][col + 1].value) {
                        cells[i][col + 1].value = cells[i][col].value;
                        cells[i][col].value = 0;
                        col++;
                    } else if (cells[i][col].value == cells[i][col + 1].value) {
                        cells[i][col + 1].value *= 2;
                        score +=  cells[i][col + 1].value;
                        cells[i][col].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewCell();
}

function moveLeft() {
    var i, j;
    var col;
    for(i = 0; i < 4; i++) {
        for(j = 1; j < 4; j++) {
            if(cells[i][j].value) {
                col = j;
                while (col - 1 >= 0) {
                    if (!cells[i][col - 1].value) {
                        cells[i][col - 1].value = cells[i][col].value;
                        cells[i][col].value = 0;
                        col--;
                    } else if (cells[i][col].value == cells[i][col - 1].value) {
                        cells[i][col - 1].value *= 2;
                        score +=   cells[i][col - 1].value;
                        cells[i][col].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewCell();
}

function moveUp() {
    var i, j, row;
    for(j = 0; j < 4; j++) {
        for(i = 1; i < 4; i++) {
            if(cells[i][j].value) {
                row = i;
                while (row > 0) {
                    if(!cells[row - 1][j].value) {
                        cells[row - 1][j].value = cells[row][j].value;
                        cells[row][j].value = 0;
                        row--;
                    } else if (cells[row][j].value == cells[row - 1][j].value) {
                        cells[row - 1][j].value *= 2;
                        score +=  cells[row - 1][j].value;
                        cells[row][j].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewCell();
}

function moveDown() {
    var i, j, row;
    for(j = 0; j < 4; j++) {
        for(i = 2; i >= 0; i--) {
            if(cells[i][j].value) {
                row = i;
                while (row + 1 < 4) {
                    if (!cells[row + 1][j].value) {
                        cells[row + 1][j].value = cells[row][j].value;
                        cells[row][j].value = 0;
                        row++;
                    } else if (cells[row][j].value == cells[row + 1][j].value) {
                        cells[row + 1][j].value *= 2;
                        score +=  cells[row + 1][j].value;
                        cells[row][j].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    pasteNewCell();
}
startGame();