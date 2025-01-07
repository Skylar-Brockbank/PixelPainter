export default class PixelPainter{
  constructor(dimension=8){
    this.boxFill=false;
    this.boxFillCoord=null;
    this.scale=0;
    this.dim=dimension;
    this.grid=this.initializeGrid();
    this.canvas = this.initializeCanvas();
    this.brush = this.canvas.getContext('2d');
    this.color= this.initializeColor();
    this.save=this.initializeSaveButton();
    this.boxFillButton=this.initializeBoxFillButton();
    this.modal;
    this.galery=[];
    this.selectedGaleryItem;
    this.galeryPipeFunction=()=>{};
  }
  setGaleryPipeFunction(func){
    this.galeryPipeFunction=func;
  }
  reset(){
    this.grid=this.initializeGrid();
    this.update()
  }
  initializeGrid(){
    let grid=[]
    for(let i=0;i<this.dim;i++){
      let line=[];
      for(let j=0;j<this.dim;j++){
        line.push(null);
      }
      grid.push(line);
    }
    return grid;
  }
  initializeCanvas(){
    let frame = document.createElement("canvas");
    frame.width=window.innerHeight*0.7;
    frame.height=frame.width;
    frame.style.backgroundColor="white"
    this.scale=frame.width/this.dim;

    frame.addEventListener("click",e=>{
      this.handleClick(e);
    })

    return frame;
  }
  initializeColor(){
    let color = document.createElement('input');
    color.type="color";
    return color
  }
  initializeSaveButton(){
    let save = document.createElement("button");
    save.innerText="save";
    save.addEventListener("click",e=>{
      this.handleSave(e);
    })
    return save;
  }
  initializeBoxFillButton(){
    let fill = document.createElement("button");
    fill.innerText="boxfill";
    fill.addEventListener("click",e=>{
      this.boxFill= !this.boxFill;
    })
    return fill;
  }
  createUI(element){
    const lineBreak = document.createElement("br");
    let container=document.createElement("div");
    let superContainer=document.createElement("div");
    superContainer.className="modal";
    superContainer.style.display="none"


    //modal controls
    let closeModal = document.createElement("button");
    closeModal.innerText="close";

    let modalButton = document.createElement("button");
    modalButton.innerText="modal";
    
    modalButton.addEventListener("click",e=>{
      this.showModal(superContainer);
    })
    closeModal.addEventListener("click",e=>{
      this.closeModal(superContainer);
    })
    
    //fill container
    container.className="container";
    container.appendChild(this.color);
    container.appendChild(this.save);
    container.appendChild(this.boxFillButton);
    //fill supercontainer
    superContainer.appendChild(closeModal)
    superContainer.appendChild(lineBreak)
    superContainer.appendChild(this.canvas);
    superContainer.appendChild(container);


    superContainer.style.display="none"
    superContainer.style.position="fixed"
    superContainer.style.zIndex="1"
    superContainer.style.left="0"
    superContainer.style.top="0"
    superContainer.style.padding="1em"
    superContainer.style.width="100%"
    superContainer.style.height="100%"
    superContainer.style.overflow="auto"
    superContainer.style.backgroundColor="rgba(0,0,0,0.4)"

    this.modal=superContainer;
    //fill element
    element.appendChild(superContainer);
    element.appendChild(modalButton);

    this.drawGrid();
  }
  createGalery(element){
    let superContainer=document.createElement("div");
    let container=document.createElement("div");
    container.id="galery";
    this.domGalery = container;
    
    container.style.display="flex";
    container.style.height="10em"
    container.style.width="100%"
    container.style.overflowX="scroll"
    container.style.flexDirection="row"
    container.style.alignItems="center"
    container.style.justifyContent="center"
    container.style.gap="1em"
    container.style.background="rgba(0,0,0,0.2)"
    
    superContainer.style.border="solid black";
    superContainer.style.borderRadius="1em"
    superContainer.style.margin="0";
    superContainer.style.padding="0";
    superContainer.style.overflow="hidden"
    
    superContainer.appendChild(container);
    
    element.appendChild(superContainer);
    this.updateGalery()
  }
  updateGalery(){
    this.domGalery.innerHTML=""
    for(let i =0;i<this.galery.length;i++){
      let temp = document.createElement("img");
      temp.src=this.galery[i];
      temp.style.height="5em";
      temp.style.imageRendering="pixelated"
      temp.id=i
      this.domGalery.appendChild(temp);

      temp.addEventListener("click",e=>{
        this.handleGalerySelection(e)
      })
    }
  }
  handleGalerySelection(e){
    if(this.selectedGaleryItem==e.target.id){
      this.selectedGaleryItem=null;
      e.target.style.border="none"
      this.galeryPipeFunction(null)
    }else{
      this.selectedGaleryItem=e.target.id;
      e.target.style.border="solid blue"
      this.galeryPipeFunction(this.galery[this.selectedGaleryItem]);
    }
  }
  showModal(){
    this.modal.style.display="block";
  }
  closeModal(){
    this.modal.style.display="none";
    this.reset()
  }
  drawGrid(){
    for(let i=0;i<this.dim;i++){
      this.brush.moveTo(0,i*this.scale);
      this.brush.lineTo(this.canvas.width,i*this.scale);
      this.brush.stroke();
    }
    for(let i=0;i<this.dim;i++){
      this.brush.moveTo(i*this.scale,0);
      this.brush.lineTo(i*this.scale,this.canvas.width);
      this.brush.stroke();
    }
  }
  colorGrid(){
    for(let i=0;i<this.dim;i++){
      for(let j=0;j<this.dim;j++){
        if(this.grid[i][j]!=null){
          const coord={
            x:i,
            y:j
          }
          const color = this.grid[i][j];
          this.colorSquare(coord,color)
        }
      }
    }
  }
  clearGrid(){
    this.brush.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  handleClick(event){

    const coord={x:Math.floor(event.offsetX/this.scale),y:Math.floor(event.offsetY/this.scale)}
    if(this.boxFill){
      this.fillBox(coord);
    }else{
      this.grid[coord.x][coord.y]=this.color.value;
      this.update()
    }
  }
  fillBox(coord){

      if(this.boxFillCoord==null){

        this.boxFillCoord=coord;
      }else{

        this.fillArea(this.boxFillCoord,coord);
        this.update();
        this.boxFill=false;
        this.boxFillCoord=null;
      }
  }
  update(){
    this.clearGrid()
    this.colorGrid()
    this.drawGrid()
  }
  fillArea(coord1,coord2){

    const startX= coord1.x>coord2.x ? coord2.x:coord1.x;
    const endX = coord1.x<coord2.x ? coord2.x:coord1.x;
    const startY= coord1.y>coord2.y ? coord2.y:coord1.y;
    const endY = coord1.y<coord2.y ? coord2.y:coord1.y;


    for(let i = startX;i<=endX;i++){
      for(let j = startY;j<=endY;j++){
        this.grid[i][j]=this.color.value;
      }
    }

  }
  colorSquare(coords,color){
    this.brush.fillStyle=color
    const offset=1
    this.brush.fillRect(
      (coords.x)*this.scale-offset,
      (coords.y)*this.scale-offset,
      this.scale+offset,
      this.scale+offset
    )
  }
  handleSave(event){
    this.clearGrid()
    this.colorGrid()

    const image = this.buildSprite()

    this.galery.push(image);
    this.updateGalery()
    this.closeModal()
  }
  buildSprite(){
    let spriteCanvas=document.createElement("canvas");
    let pen = spriteCanvas.getContext("2d");
    spriteCanvas.height=this.dim;
    spriteCanvas.width=this.dim;
    //loop
    for(let i=0;i<this.dim;i++){
      for(let j=0;j<this.dim;j++){
        if(this.grid[i][j]!=null){
          pen.fillStyle=this.grid[i][j];
          pen.fillRect(i,j,1,1);
        }
      }
    }
    //return sprite
    return(spriteCanvas.toDataURL("img/png"));
  }
}

/*
How to use this module.

-You'll want to start by Importing the PixelPainter class.
-Then grab the dom element that you'll be putting your controls inside.
-Create a new PixelPainter object you can optionally set the dimenstions of your grid as a parameter.



Example
=========

import PixelPainter from "./PixelPainter";
const domAnchor = document.getElementById("app");

let test = new PixelPainter(8);
test.createUI(domAnchor)
test.createGalery(domAnchor)

test.setGaleryPipeFunction(setTestImage)

==========


The createUI function adds a button and a modal that display and control the pixel art UI

The createGalery function adds a galery shelf that takes the resulting pixel art from the modal and allows you to select items from the galery

the setGaleryPipeFunction allows you to pass in a function that runs when an image is selected. It will always recieve base64 image data or null.

*/