export class Stitch{
  constructor(type, row, col){
    this.type = type;
    this.row = row;
    this.col = col;
    this.img = document.querySelector("#stitchImg");
    this.size = 16;
  }
  draw(ctx, loc, size){
    ctx.drawImage(this.img, 0, this.type*this.size, this.size, this.size, loc.x, loc.y, size.w, size.h)

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
  }
  parse(pattern){
    for(var i = 0; i<pattern.length; i++){
      this.stitches.push([])
      for(var j = 0; j<pattern[i].length; j++){
        // let type = pattern[i][j] == 0? "k" : "p"

        this.stitches[i].push(new Stitch(pattern[i][j], pattern.length - i, j))
      }
    }
  }
  getLocation(row, col){
    return{x: col*this.stitchSize.w + this.x, y: row*this.stitchSize.h + this.y}
  }
  render(ctx){
    for(var i=0; i<this.stitches.length; i++){
      for(var j=0; j<this.stitches[i].length; j++){
        var s = this.stitches[i][j]
        s.draw(ctx, this.getLocation(s.row, s.col), this.stitchSize);
      }
    }
  }
}
