const stitchImg = document.querySelector("#stitchImg");

export const COLORSHIFT = {
  BLUE: 0,
  PURPLE: 45,
  RED: 135,
  ORANGE: 180,
  YELLOW: 215,
  GREEN: 270,

}

export class Stitch{
  constructor(type, index, row, col, color){
    this.type = type;
    this.row = row;
    this.col = col;
    this.size = 16;
    this.stichesPerRow = 12;
    this.worked = false;
    this.active = false;
    this.color = color;
  }
  draw(ctx, loc, size){
    ctx.save();
    ctx.filter = `hue-rotate(${this.color}deg)`
    ctx.drawImage(stitchImg, 0, this.type*this.size, this.size, this.size, loc.x, loc.y, size.w, size.h)
    ctx.restore();
  }
  drawBackside(ctx, loc, size){
    let t = this.type == 0? 1 : 0;
    ctx.save();
    ctx.filter = `hue-rotate(${this.color}deg)`
    ctx.drawImage(stitchImg, 0, t*this.size, this.size, this.size, loc.x, loc.y, size.w, size.h)
    ctx.restore();
  }
}

export class Work{
  constructor(x, y, width, height, pattern, color=COLORSHIFT.BLUE){
    this.stitchesPerRow = 12
    this.stitchSize = {
      w: width/12,
      h: height/12
    }
    this.x = x;
    this.y = y - (this.stitchSize.h*pattern.length);

    this.width = width;
    this.height = height;
    this.color = color
    this.stitches = []
    this.parse(pattern);
    this.flipped = false;
    this.currentRow = 0;
    this.currentStitch = 0;
    this.workingStitch = null;
    this.setActiveStitch()
    this.finished = false;
    this.atEndOfRow = false;
  }
  parse(pattern){
    let index = 0;
    let row = 0;
    for(var i = pattern.length-1; i>=0; i--){
      for(var j = 0; j<pattern[i].length; j++){
        let q = j;
        if(row%2 == 0){
          q = this.stitchesPerRow - j - 1;
        }
        this.stitches.push(new Stitch(pattern[i][q], index, i, q, this.color))
        index++
      }
      row += 1
    }
  }
  getLocation(row, col){
    return{x: col*this.stitchSize.w + this.x, y: row*this.stitchSize.h + this.y}
  }
  render(ctx){
    for(let i=0; i<this.stitches.length; i++){
        let s = this.stitches[i]
        if(!s.worked && !s.active) continue;
        let loc;
        if(!this.flipped){
          loc =  this.getLocation(s.row, s.col)
          s.draw(ctx, loc, this.stitchSize);
        } else {
          loc =  this.getLocation(s.row, this.stitchesPerRow-s.col-1)
          s.drawBackside(ctx, loc, this.stitchSize);
        }

        if(s.active){
          ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
          ctx.fillRect(loc.x, loc.y, this.stitchSize.w, this.stitchSize.h)
        }


    }
  }
  setActiveStitch(){
    if(this.finished)return;
    this.workingStitch = this.stitches[this.currentStitch]
    this.workingStitch.active = true;
  }
  knitStitch(){
    let s = this.workingStitch;
    if(s.worked) return;
    if((s.type == 0 && !this.flipped)
    ||(s.type == 1 && this.flipped)){
      s.worked = true;
      s.active = false;
    }
  }
  purlStitch(){
    let s = this.workingStitch;
    if(s.worked) return;
    if((s.type == 1 && !this.flipped)
    ||(s.type == 0 && this.flipped)){
      s.worked = true;
      s.active = false;
    }
  }
  advanceStitch(){
      if(this.atEndOfRow)return;
      if(this.currentStitch >= this.stitches.length -1){
        this.finished = true;
      }
      if(this.workingStitch.worked){
        this.currentStitch++
        this.setActiveStitch()
      }
      if((this.currentStitch + 1) % this.stitchesPerRow == 0){
          this.atEndOfRow = true;
      }
  }
  turnWork(){
    if(!this.atEndOfRow || ! this.workingStitch.worked) return;
    this.flipped = !this.flipped;
    this.currentRow++;
    this.atEndOfRow = false
    this.y += this.stitchSize.h
    this.advanceStitch();
  }
  uiHint(){
    if(this.finished) return;
    if(this.workingStitch.worked && !this.atEndOfRow){
      return "[shift] to start next stitch.";
    }
    if(this.atEndOfRow){
      return "[enter] to turn work for new row.";
    }
    if((this.workingStitch.type == 0 && !this.flipped) || (this.flipped && this.workingStitch.type == 1)){
      return "[up] to knit stitch";
    }
    if((this.workingStitch.type == 1 && !this.flipped)|| (this.flipped && this.workingStitch.type == 0)){
      return "[down] to purl stitch";
    }
    return "Not sure what to do here";
  }
  setColor(color){
    this.color = color;
    for(let s of this.stitches){
      s.color = color;
    }
  }
}
