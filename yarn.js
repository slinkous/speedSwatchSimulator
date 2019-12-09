import {COLORSHIFT} from "/stitch.js";

const yarnImg = document.querySelector("#yarnBall");

export default class Yarn {
  constructor(color, x, y, width, height){
    this.color = COLORSHIFT[color.toUpperCase()];
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.selected = false;
    this.unlocked = false;
    Yarn.addYarn(this);
  }
  draw(ctx){
    ctx.save();


    if(!this.unlocked){
      ctx.filter = 'grayscale(100%)'
      ctx.drawImage(yarnImg, this.x, this.y, this.width, this.height)
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    } else {
      ctx.filter = `hue-rotate(${this.color}deg)`
      ctx.drawImage(yarnImg, this.x, this.y, this.width, this.height)
    }


    if(this.selected){
      ctx.strokeStyle ="grey";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    ctx.restore();
  }
  static addYarn(yarn){
    if(!this.yarns){
      this.yarns = [];
    }
    this.yarns.push(yarn)
  }
  static getYarns(){
    return this.yarns
  }
  static getUnlockedYarns(){
    let unlockedYarns = this.yarns.filter(y => y.unlocked);
    return unlockedYarns;
  }
  static unlockYarn(number){
    this.yarns[number].unlocked = true;
  }
  static allYarnsUnlocked(){
    return this.yarns.filter((y) => y.unlocked).length == this.yarns.length;
  }
  static unlockRandomYarn(){
    if(this.allYarnsUnlocked()) return;
    let r = 0;
    while(this.yarns[r].unlocked){
      r = Math.floor(Math.random()*this.yarns.length)
    }
    this.unlockYarn(r);
    return(this.yarns[r])
  }

  static createYarns(gameWidth){

    let colors = ["blue", "red", "green", "purple", "orange", "yellow"];
    let yarnSize = gameWidth*0.9/colors.length;

    for(let i = 0; i < colors.length; i++){
      let y = new Yarn(colors[i], (gameWidth*0.05)+i*yarnSize, 300, yarnSize, yarnSize)
    }
    Yarn.unlockRandomYarn();
    Yarn.selectYarn(null);
  }
  static drawYarns(ctx){
    for(let yarn of Yarn.getYarns()){
      yarn.draw(ctx)
    }
  }
  static unselectAll(){
    let selectableYarns = Yarn.getUnlockedYarns();
    for(let yarn of selectableYarns){
      yarn.selected = false;
    }
  }
  static selectYarn(input){
    let selectableYarns = Yarn.getUnlockedYarns();
    if(!this.selectedYarn){
      this.selectedYarn = 0;
    }
    if(input == "right"){
      this.selectedYarn++
    }
    if(input == "left"){
      this.selectedYarn--
    }
    this.selectedYarn %= selectableYarns.length;
    this.unselectAll();
    selectableYarns[this.selectedYarn].selected = true;
  }
  static chooseYarn(){
    return Yarn.getUnlockedYarns()[this.selectedYarn]
  }
}
