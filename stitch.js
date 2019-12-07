const stitchImg = document.querySelector("#stitchImg");

export class Stitch{
  constructor(type, index, row, col){
    this.type = type;
    this.row = row;
    this.col = col;
    this.size = 16;
    this.stichesPerRow = 12;
    this.worked = false;
    this.active = false;
  }
  draw(ctx, loc, size){
    ctx.drawImage(stitchImg, 0, this.type*this.size, this.size, this.size, loc.x, loc.y, size.w, size.h)
  }
  drawBackside(ctx, loc, size){
    let t = this.type == 0? 1 : 0;
    ctx.drawImage(stitchImg, 0, t*this.size, this.size, this.size, loc.x, loc.y, size.w, size.h)
  }
}

export class Work{
  constructor(x, y, width, height, pattern){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.stitchesPerRow = 12
    this.stitchSize = {
      w: width/12,
      h: height/12
    }
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
    for(var i = pattern.length-1; i>=0; i--){
      for(var j = 0; j<pattern[i].length; j++){
        let q = j;
        if(i%2 == 0){
          q = this.stitchesPerRow - j - 1;
        }
        this.stitches.push(new Stitch(pattern[i][q], index, pattern.length - i -1, q))
        index++
      }
    }
  }
  getLocation(row, col){
    return{x: col*this.stitchSize.w + this.x, y: row*this.stitchSize.h + this.y}
  }
  render(ctx){
    for(let i=0; i<this.stitches.length; i++){
        let s = this.stitches[i]
        if(!s.worked && !s.active) continue;
        let loc =  this.getLocation(s.row, s.col)
          s.draw(ctx, loc, this.stitchSize);
        if(s.active){
          ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
          ctx.fillRect(loc.x, loc.y, this.stitchSize.w, this.stitchSize.h)
        }
    }
  }
  setActiveStitch(){
    this.workingStitch = this.stitches[this.currentStitch]
    this.workingStitch.active = true;
  }
  knitStitch(){
    if(this.atEndOfRow)return;
    let s = this.workingStitch;
    if(s.worked) return;
    if(s.type == 0){
      s.worked = true;
      s.active = false;
    }
  }
  purlStitch(){
    if(this.atEndOfRow)return;
    let s = this.workingStitch;
    if(s.worked) return;
    if(s.type == 1){
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
      } else {
        this.finished = true;
      }

      if(this.currentStitch + 1 % this.stitchesPerRow == 0){
          this.atEndOfRow = true;
      }
  }
  turnWork(){
    this.flipped = !this.flipped;
    this.currentRow++;
    this.atEndOfRow = false
  }
}
