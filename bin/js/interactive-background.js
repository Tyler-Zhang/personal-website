/**
 * This code is for rendering the "game of life" behind everything so that there is
 * some interactivity to the website
 */
(function() {
  "use strict"
  var boardDimensions = {};
  var state;
  var neighbor;
  var ctx;
  var canvas;
  var random = true;
  var liveCondition = [2,3]
  var reproCondition =[3];
  var simulation = true;
  var nextTime = 0;
  
  window.onload = function(){
    /**
     * Create and add canvas to the background
     */
    let canvas = document.createElement('canvas')

    $(canvas).css({
      position: 'absolute',
      left: 0, 
      top: 0, 
      width: $('body').width(), 
      height: $('body').height(),
      'z-index': -1
    })
    .mousemove(mouseInput)
    .mousedown(mouseInput)
    
    $('body').append(canvas)

    ctx = canvas.getContext("2d");
    ctx.fillStyle='#0a0a0a'
    boardDimensions = {
      width : canvas.width,
      height: canvas.height, 
    }
    //Set Default grid size
    setGrid(20,20);
    update()
  }
  
  function mouseInput(mD){
    if(mD.buttons !=1)
      return;
      var x = Math.floor(mD.offsetX/boardDimensions.cellWidth);
      var y = Math.floor(mD.offsetY/boardDimensions.cellHeight);
      changeCell([[true]],x,y, mD.altKey);
  }
  
  function changeCell(pattern,xMouse,yMouse,erase){
    var mX = Math.floor(pattern.length/2);
    var mY = Math.floor(pattern[0].length/2);
    for(var x = 0; x < pattern.length; x ++){
      for(var y = 0; y < pattern[x].length;y ++){
        var xPos = xMouse + x - mX;
        var yPos = yMouse + y - mY;
        if(pattern[x][y] && xPos>=0 && yPos>=0 && xPos <boardDimensions.x && yPos < boardDimensions.y){
          if(erase){
            state[xPos][yPos] = false;
            ctx.clearRect(xPos*boardDimensions.cellWidth,yPos*boardDimensions.cellHeight,boardDimensions.cellWidth,boardDimensions.cellHeight);
          } else {
            state[xPos][yPos] = true;
            ctx.fillRect(xPos*boardDimensions.cellWidth,yPos*boardDimensions.cellHeight,boardDimensions.cellWidth,boardDimensions.cellHeight);
          }
        }
      }
    }
  }
  
  function setGrid(width,height){
    boardDimensions.cellWidth = boardDimensions.width/width;
    boardDimensions.cellHeight = boardDimensions.height/height;
    boardDimensions.x = width;
    boardDimensions.y = height;
  
    ctx.clearRect(0,0,boardDimensions.width,boardDimensions.height);
    //Initalizes the grid
    state = new Array(width);
    neighbor = new Array(width);
    for(var x = 0; x < width; x ++){
      state[x] = new Array(height);
      neighbor[x] = new Array(height);
      for(var y  = 0; y < height; y ++){
        if(random && Math.random()>0.5)
        state[x][y] = true;
        else state[x][y] = false;
        neighbor[x][y] = 0;
      }
    }
  }
  
  function update(){
    if (performance.now() < nextTime) {
      return requestAnimationFrame(update)
    } else {
      nextTime = performance.now() + 300
    }

    for(var x = 0; x < boardDimensions.x; x++){
      for(var y  = 0; y< boardDimensions.y; y++){
        if(state[x][y]){
          for(var xN = -1; xN<=1; xN++){
            for(var yN = -1; yN<=1;yN++){
              if((xN == 0 && yN == 0))
                continue;
              if(xN+x<0 ||xN+x>=boardDimensions.x)
                continue;
              if(yN+y<0 ||yN+y>=boardDimensions.y)
                continue;
                neighbor[x+xN][y+yN]++;
            }
          }
        }
      }
    }
    ctx.clearRect(0,0,boardDimensions.width,boardDimensions.height);
  
    for(var x = 0; x < boardDimensions.x; x++){
      for(var y  = 0; y< boardDimensions.y; y++){
        if(state[x][y]){
          if(liveCondition.indexOf(neighbor[x][y])>=0){
            //console.log("Cell " + x + " " + y + "lives!");
            ctx.fillRect(x*boardDimensions.cellWidth,y*boardDimensions.cellHeight,boardDimensions.cellWidth,boardDimensions.cellHeight);
            state[x][y] = true;
          } else {
            //console.log("Cell " + x + " " + y + "Dies!");
            state[x][y] = false;
          }
        } else if(reproCondition.indexOf(neighbor[x][y])>=0){
          //console.log("Cell " + x + " " + y + "reproduces!");
          ctx.fillRect(x*boardDimensions.cellWidth,y*boardDimensions.cellHeight,boardDimensions.cellWidth,boardDimensions.cellHeight);
          state[x][y] = true;
        }
        neighbor[x][y] = 0;
      }
    }
    if(simulation){
      requestAnimationFrame(update)
    }
  }
})()
