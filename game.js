import InputHandler from "./input.js"
import {Stitch, Work} from "./stitch.js"
import { level0, level1, level2 } from "./pattern.js"

export const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEXTLEVEL:4
}
const levels = [level0, level1, level2]

export class Game{
  constructor(gameWidth, gameHeight){
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gamestate = GAMESTATE.MENU;
    this.levelNumber = 0;
    this.level = levels[this.levelNumber];
    this.input = new InputHandler(this);
    this.currentWork = new Work(this.gameWidth*0.1, this.gameHeight/2, this.gameWidth*0.8, this.gameHeight*0.8, this.level.pattern);
    this.gameTime = 0;
  }
  start(){
    if(this.gamestate != GAMESTATE.MENU && this.gamestate != GAMESTATE.NEXTLEVEL ) return;
    this.gamestate = GAMESTATE.RUNNING;
  }
  update(delta){
    if(this.gamestate == GAMESTATE.PAUSED || this.gamestate == GAMESTATE.GAMEOVER || this.gamestate == GAMESTATE.MENU || this.gamestate == GAMESTATE.NEXTLEVEL) return;
    this.gameTime += delta;
    if(this.currentWork.finished){
      console.log("Work Finished!")
      this.gamestate = GAMESTATE.NEXTLEVEL
    }
  }
  draw(ctx){
    //main game running
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
    ctx.font = "64px Solway, serif";
    ctx.fillStyle = "blue";
    ctx.textAlign = "center";
    ctx.fillText(this.level.title, this.gameWidth/2, this.gameHeight/8)
    ctx.font = "36px Solway, serif";
    ctx.fillText(this.level.description, this.gameWidth/2, this.gameHeight/4)
    this.currentWork.render(ctx);

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, 100, 100, 5);
    ctx.font = "48px Tomorrow, serif";
    ctx.fillStyle = "red";
    // ctx.textAlign = "left";
    ctx.fillText(Math.floor(this.gameTime/1000), 50, 60)

    if(this.gamestate == GAMESTATE.PAUSED){
      ctx.fillStyle = "green";
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = "36px Solway, serif";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Game Paused", this.gameWidth/2, this.gameHeight/2)
    }
    if(this.gamestate == GAMESTATE.MENU){
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = "3em Solway, serif";
      ctx.fillStyle = "orange";
      ctx.textAlign = "center";
      ctx.fillText("Speed Swatch Simulator!", this.gameWidth/2, this.gameHeight/4)
      ctx.font = "2em Solway, serif";
      ctx.textAlign = "left";
      ctx.fillText("[up] to knit", this.gameWidth*0.1, this.gameHeight/2)
      ctx.fillText("[down] to purl", this.gameWidth*0.1, this.gameHeight/2+40)
      ctx.fillText("[shift] to advance to next stitch", this.gameWidth*0.1, this.gameHeight/2+80)
      ctx.fillText("[esc] to pause", this.gameWidth*0.1, this.gameHeight/2+120)
      ctx.fillText("[enter] to start", this.gameWidth*0.1, this.gameHeight/2+160)

    }
    if(this.gamestate == GAMESTATE.NEXTLEVEL){
      ctx.fillStyle = "lightblue";
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = "3em Solway, serif";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText("Congratulations!", this.gameWidth/2, this.gameHeight/4)
      ctx.font = "2em Solway, serif";
      ctx.fillText("You finished the " + this.level.title + " swatch" , this.gameWidth/2, this.gameHeight/2 )
      ctx.fillText("in " + Math.floor(this.gameTime/1000)+ " seconds!", this.gameWidth/2, this.gameHeight/2+40 )


      ctx.fillText("Press [enter] for next level", this.gameWidth/2, this.gameHeight/2 + 120)
    }
  }
  reset(){
    if(!this.gamestate == GAMESTATE.GAMEOVER) return;
    this.gamestate = GAMESTATE.MENU;
    this.levelNumber = 0
    this.level = levels[this.levelNumber]
    this.currentWork = new Work(this.gameWidth*0.1, this.gameHeight/2, this.gameWidth*0.8, this.gameHeight*0.8, this.level.pattern);
    this.gameTime = 0;
  }
  levelUp(){
    if(!this.gamestate == GAMESTATE.NEXTLEVEL) return;
    this.levelNumber++;
    this.levelNumber %= levels.length;
    this.level = levels[this.levelNumber]
    this.currentWork = new Work(this.gameWidth*0.1, this.gameHeight/2, this.gameWidth*0.8, this.gameHeight*0.8, this.level.pattern);
    console.log(this.currentWork)
    this.gameTime = 0;
    this.start();
  }
  togglePause(){
    if(this.gamestate == GAMESTATE.PAUSED ){
      this.gamestate = GAMESTATE.RUNNING
    } else {
      this.gamestate = GAMESTATE.PAUSED
    }
  }
}
