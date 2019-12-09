import InputHandler from "./input.js"
import {Stitch, Work} from "./stitch.js"
import { level0, level1, level2, level3, level4 }  from "./pattern.js"
import Yarn from "./yarn.js"

export const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  LOSE: 3,
  NEXTLEVEL:4,
  INSTRUCTIONS: 5,
  WIN: 6,
}
const levels = [level0, level1, level2, level3, level4]


export class Game{
  constructor(gameWidth, gameHeight){
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gamestate = GAMESTATE.MENU;
    this.levelNumber = 0;
    this.level = levels[this.levelNumber];
    this.input = new InputHandler(this);

    this.gameTime = 0;
    this.roundTimes = [];
    this.totalTime = 0;
    this.bestTime = 0;
    this.hint;
    this.yarn;
    Yarn.createYarns(gameWidth);
    this.currentWork = new Work(this.gameWidth*0.1, this.gameHeight/2, this.gameWidth*0.8, this.gameHeight*0.8, this.level.pattern);
  }
  start(){
    if(this.gamestate != GAMESTATE.MENU && this.gamestate != GAMESTATE.NEXTLEVEL ) return;

    this.gamestate = GAMESTATE.RUNNING;

  }
  update(delta){
    if(this.gamestate == GAMESTATE.PAUSED || this.gamestate == GAMESTATE.WIN || this.gamestate == GAMESTATE.MENU || this.gamestate == GAMESTATE.NEXTLEVEL) return;
    this.gameTime += delta;
    if(this.currentWork.finished){
      this.roundTimes.push(this.gameTime)
      this.levelUp();
    }
    this.hint = this.currentWork.uiHint()
  }
  draw(ctx){
    //main game running
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
    ctx.font = "64px Solway, serif";
    ctx.fillStyle = "#00a2e8";
    ctx.textAlign = "center";
    ctx.fillText(this.level.title, this.gameWidth/2, this.gameHeight/8)
    ctx.font = "36px Solway, serif";
    ctx.fillText(this.level.description, this.gameWidth/2, this.gameHeight/4)
    this.currentWork.render(ctx);

    //hud
    ctx.fillStyle = "#00a2e8";
    ctx.font = "36px Solway, serif";
    ctx.fillText(this.hint, this.gameWidth/2, this.gameHeight - 40)

    ctx.font = "16px Solway, serif";
    if(!this.currentWork.flipped){
      ctx.fillText("front side", this.gameWidth/2 + 32, this.gameHeight/2 - 48)
    } else {
      ctx.fillText("back side", this.gameWidth/2 + 32, this.gameHeight/2 - 48)
    }

    // Clock
    // ctx.fillStyle = "black"
    // ctx.fillRect(0,80, 100, 100);
    // ctx.font = "48px Tomorrow, serif";
    // ctx.fillStyle = "#00FF00";
    // // ctx.textAlign = "left";
    // ctx.fillText(Math.floor(this.gameTime/1000), 50, 140)

    if(this.gamestate == GAMESTATE.PAUSED){
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = "36px Solway, serif";
      ctx.fillStyle = "gray";
      ctx.textAlign = "center";
      ctx.fillText("Game Paused", this.gameWidth/2, this.gameHeight/2)
    }
    if(this.gamestate == GAMESTATE.INSTRUCTIONS){
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = "2em Solway, serif";
      ctx.fillStyle = "#00a2e8";
      ctx.textAlign = "left";
      ctx.fillText("[up] to knit", this.gameWidth*0.1, this.gameHeight/2)
      ctx.fillText("[down] to purl", this.gameWidth*0.1, this.gameHeight/2+40)
      ctx.fillText("[shift] to advance to next stitch", this.gameWidth*0.1, this.gameHeight/2+80)
      ctx.fillText("[esc] to pause", this.gameWidth*0.1, this.gameHeight/2+120)
      ctx.fillText("[enter] to start", this.gameWidth*0.1, this.gameHeight/2+160)
    }
    if(this.gamestate == GAMESTATE.MENU){
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = "3em Solway, serif";
      ctx.fillStyle = "#00a2e8";
      ctx.textAlign = "center";
      ctx.fillText("Speed Swatch Simulator!", this.gameWidth/2, this.gameHeight/4)
      Yarn.drawYarns(ctx);
      ctx.fillStyle = "#00a2e8";
      ctx.font = "1.5em Solway, serif";
      ctx.fillText("[shift] for instructions, [enter] to select yarn", this.gameWidth/2, this.gameHeight - 40)
    }
    if(this.gamestate == GAMESTATE.NEXTLEVEL){
      ctx.fillStyle = "lightblue";
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = "2.5em Solway, serif";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Congratulations!", this.gameWidth/2, this.gameHeight/4)
      ctx.font = "2em Solway, serif";
      ctx.fillText("You finished the", this.gameWidth/2, this.gameHeight/2 )
      ctx.fillText(this.level.title, this.gameWidth/2, this.gameHeight/2+40 )
      ctx.fillText("swatch in " + Math.floor(this.gameTime/1000)+ " seconds!", this.gameWidth/2, this.gameHeight/2+80)

      ctx.fillText("Press [enter] for next level", this.gameWidth/2, this.gameHeight/2 + 120)
    }
    if(this.gamestate == GAMESTATE.WIN){
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "blue";
      ctx.textAlign = "center";
      ctx.font = "2em Solway, serif";
      ctx.fillText("You finished all the swatches in", this.gameWidth/2, this.gameHeight/4)
      ctx.fillText(Math.floor(this.totalTime/1000)+" seconds", this.gameWidth/2, this.gameHeight/4+40)
      if(this.totalTime <= this.bestTime){
        ctx.fillText("and beat your previous time of " + Math.floor(this.bestTime/1000), this.gameWidth/2, this.gameHeight/4+80)
      }
      Yarn.unselectAll();
      Yarn.drawYarns(ctx);
      ctx.fillText("Press [enter] to play again", this.gameWidth/2, this.gameHeight - 80)
    }
  }
  reset(){
    if(!this.gamestate == GAMESTATE.WIN) return;
    this.gamestate = GAMESTATE.MENU;
    this.levelNumber = 0;
    this.level = levels[this.levelNumber];
    this.currentWork = new Work(this.gameWidth*0.1, this.gameHeight/2, this.gameWidth*0.8, this.gameHeight*0.8, this.level.pattern);
    this.gameTime = 0;
    this.roundTimes = [];
  }
  levelUp(){
    if(!this.gamestate == GAMESTATE.NEXTLEVEL) return;
    this.levelNumber++;
    if(this.levelNumber >= levels.length){
      console.log("You won")
      this.winGame();
      return;
    }
    this.level = levels[this.levelNumber]
    this.currentWork = new Work(this.gameWidth*0.1, this.gameHeight/2, this.gameWidth*0.8, this.gameHeight*0.8, this.level.pattern, this.yarn.color);
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
  toggleInstructions(){
    if(this.gamestate == GAMESTATE.INSTRUCTIONS){
      this.gamestate = GAMESTATE.MENU
    } else {
      this.gamestate = GAMESTATE.INSTRUCTIONS
    }
  }
  winGame(){
    this.totalTime = this.roundTimes.reduce((a, b)=>{return a+b})
    if(this.bestTime == 0)this.bestTime = this.totalTime;
    this.gamestate = GAMESTATE.WIN
    if(this.bestTime >= this.totalTime){
      Yarn.unlockRandomYarn();
    }

  }
}
