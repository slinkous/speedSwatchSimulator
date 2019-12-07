import InputHandler from "./input.js"
import {Stitch, Work} from "./stitch.js"
import { level0, level1 } from "./pattern.js"

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3
}

export default class Game{
  constructor(gameWidth, gameHeight){
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gamestate = GAMESTATE.MENU;

    this.input = new InputHandler(this);
    this.currentWork = new Work(this.gameWidth*0.1, this.gameHeight/2, this.gameWidth*0.8, this.gameHeight*0.8, level0.pattern);
    this.gameTime = 0;
  }
  start(){
    if(this.gamestate != GAMESTATE.MENU) return;
    this.gamestate = GAMESTATE.RUNNING;
  }
  update(delta){
    if(this.gamestate == GAMESTATE.PAUSED || this.gamestate == GAMESTATE.GAMEOVER || this.gamestate == GAMESTATE.MENU) return;
    this.gameTime += delta;
    if(this.currentWork.finished){
      this.gamestate = GAMESTATE.GAMEOVER
    }
  }
  draw(ctx){
    //main game running
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
    ctx.font = "72px Arial";
    ctx.fillStyle = "blue";
    ctx.textAlign = "center";
    ctx.fillText(level0.title, this.gameWidth/2, this.gameHeight/8)
    ctx.font = "36px Arial";
    ctx.fillText(level0.description, this.gameWidth/2, this.gameHeight/4)
    this.currentWork.render(ctx);

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, 200, 100);
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "left";
    ctx.fillText(Math.floor(this.gameTime/1000), 0, 50)

    if(this.gamestate == GAMESTATE.PAUSED){
      ctx.fillStyle = "green";
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = "36px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Game Paused", this.gameWidth/2, this.gameHeight/2)
    }
    if(this.gamestate == GAMESTATE.MENU){
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = "60px Arial";
      ctx.fillStyle = "orange";
      ctx.textAlign = "center";
      ctx.fillText("Speed Swatch Simulator!", this.gameWidth/2, this.gameHeight/4)
      ctx.font = "36px Arial";
      ctx.fillText("Press [up] to knit", this.gameWidth/2, this.gameHeight/2)
      ctx.fillText("Press [shift] to advance to next stitch", this.gameWidth/2, this.gameHeight/2+40)

    }
    if(this.gamestate == GAMESTATE.GAMEOVER){
      ctx.fillStyle = "yellow";
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = "36px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText("Congratulations!", this.gameWidth/2, this.gameHeight/2)
      ctx.fillText("You finished the row in " + Math.floor(this.gameTime/1000)+ " seconds!", this.gameWidth/2, this.gameHeight/2 + 100)
    }
  }
  togglePause(){
    if(this.gamestate == GAMESTATE.PAUSED ){
      this.gamestate = GAMESTATE.RUNNING
    } else {
      this.gamestate = GAMESTATE.PAUSED
    }
  }
}
