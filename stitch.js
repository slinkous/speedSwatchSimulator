export class Stitch{
  constructor(type, row, col){
    this.type = type;
    this.row = row;
    this.col = col;
    this.img = document.querySelector("#stitchImg");
    this.size = 16;
    this.worked = false;
    this.active = false;
  }
  draw(ctx, loc, size){
    ctx.drawImage(this.img, 0, this.type*this.size, this.size, this.size, loc.x, loc.y, size.w, size.h)
  }
  drawBackside(ctx, loc, size){
    let t = this.type == 0? 1 : 0;
    ctx.drawImage(this.img, 0, t*this.size, this.size, this.size, loc.x, loc.y, size.w, size.h)
  }
}

export class Work{
  constructor(x, y, width, height, pattern){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    // this.pattern = pattern
    this.stitchSize = {
      w: width/12,
      h: height/12
    }
    this.stitches = []
    this.parse(pattern);
    this.flipped = false;
    this.currentRow = 0;
    this.currentStitch = 11;
    this.workingStitch = null;
    this.setActiveStitch()
    this.finished = false;
  }
  parse(pattern){
    for(var i = 0; i<pattern.length; i++){
      this.stitches.push([])
      for(var j = 0; j<pattern[i].length; j++){
        this.stitches[i].push(new Stitch(pattern[i][j], pattern.length - i -1, j))
      }
    }
    console.log(this.stitches)
  }
  getLocation(row, col){
    return{x: col*this.stitchSize.w + this.x, y: row*this.stitchSize.h + this.y}
  }
  render(ctx){
    for(let i=0; i<this.stitches.length; i++){
      for(let j=0; j<this.stitches[i].length; j++){
        let s = this.stitches[i][j]
        if(!s.worked && !s.active) continue;
        // var active = s.row == this.activeStitch.row && s.col == this.activeStitch.col
        // console.log(active)
        // if(!this.flipped){
        var loc =  this.getLocation(s.row, s.col)
          s.draw(ctx, loc, this.stitchSize);
        // } else {
        //   s.drawBackside(ctx, this.getLocation(s.row,this.stitches[i].length - s.col), this.stitchSize)
        // }
        if(s.active){
          ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
          ctx.fillRect(loc.x, loc.y, this.stitchSize.w, this.stitchSize.h)
        }

      }
    }
  }
  setActiveStitch(){
    var stitch = this.stitches[this.currentRow][this.currentStitch];
    stitch.active = true;
    this.workingStitch = stitch;
    console.log(stitch);
  }
  knitStitch(){
    this.workingStitch.worked = true;
    this.workingStitch.active = false;
  }
  advanceStitch(){
    if(this.currentStitch > 0 && this.workingStitch.worked){
      this.currentStitch -=1
      this.setActiveStitch()
    } else {
      this.finished = true;
    }
  }
  flip(){
    this.flipped = !this.flipped;
  }

}
