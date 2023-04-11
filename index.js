
const canvas = document.querySelector('canvas')

const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5
let scrollOffset = 0
class Player {
    constructor(){
        this.speed = 10,
        this.position = {
            x:100,
            y:100
        }
        this.velocity = {
            x:0,
            y:0
        }
        this.width = 66;
        this.height = 150;
        this.image = createImage('./images/spriteStandRight.png');
        this.frames = 0;
        this.sprites = {
            stand:{
                right:createImage('./images/spriteStandRight.png'),
                left:createImage('./images/spriteStandLeft.png'),
                cropWidth:177,
                width:66
            },
            run:{
                right:createImage('./images/spriteRunRight.png'),
                left:createImage('./images/spriteRunLeft.png'),
                cropWidth:341,
                width:127.875
            }
        }
        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 177
    }

    draw(){
        c.drawImage(this.currentSprite,this.currentCropWidth*this.frames,0,this.currentCropWidth,400, this.position.x, this.position.y, this.width, this.height)
    }
    update(){
        this.frames++;
        if(this.frames>59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)) {
            this.frames=0
        }else if(this.frames>29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)){
            this.frames=0
        }
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y <= canvas.height){
            this.velocity.y += gravity
        }else{
            // this.velocity.y = 0;
        }

    }
}

class Platform{
    constructor({x, y, image}){
        this.position = {
           x, y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }
    draw(){
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}
class GenericObject{
    constructor({x, y, image}){
        this.position = {
           x, y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }
    draw(){
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}
const createImage = (imgSrc)=>{
    const image = new Image();
    image.src = imgSrc
    return image
}
let player = new Player()
let platforms = []
const keys = {
    right:{
        pressed:false
    },
    left:{
        pressed:false
    }
}
let genericObjects = []
let lastKey;
function init(){
    scrollOffset=  0
    player = new Player()
    platforms = [
        new Platform({x:-1, y:470, image:createImage('./images/platform.png')}),
        new Platform({x:createImage('./images/platform.png').width*4 + 300 -2 +createImage('./images/platformSmallTall.png').width, y:270, image:createImage('./images/platformSmallTall.png')}),
        new Platform({x:createImage('./images/platform.png').width-3, y:470, image:createImage('./images/platform.png')}),
        new Platform({x:createImage('./images/platform.png').width*2 + 100, y:470, image:createImage('./images/platform.png')}),
        new Platform({x:createImage('./images/platform.png').width*3 + 300, y:470, image:createImage('./images/platform.png')}),
        new Platform({x:createImage('./images/platform.png').width*4 + 300 , y:470, image:createImage('./images/platform.png')}),
        new Platform({x:createImage('./images/platform.png').width*5 + 700 , y:470, image:createImage('./images/platform.png')}),
    ]
    genericObjects = [
        new GenericObject({x:-1,y:-1,image:createImage('./images/background.png')}),
        new GenericObject({x:-1,y:-1,image:createImage('./images/hills.png')}),
    ]
}

function animate(){
    requestAnimationFrame(animate)
    c.fillStyle = "#fff"
    c.fillRect(0,0, canvas.width, canvas.height)

    genericObjects.forEach(genericObject=>{
        genericObject.draw()
    })
    platforms.forEach(platform=>{
        platform.draw();
    })
    player.update();
    if(keys.right.pressed && player.position.x < 400){
        player.velocity.x = player.speed
    }else if((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollOffset===0 && player.position.x >0)){
        player.velocity.x = -player.speed
    }else {
        player.velocity.x = 0
        if(keys.right.pressed){
            scrollOffset += player.speed
            platforms.forEach(platform=>{
                platform.position.x -= player.speed
            })
            genericObjects.forEach(genericObject=>{
                genericObject.position.x -= player.speed *0.66
            })
        }else if(keys.left.pressed && scrollOffset > 0){
            scrollOffset -=player.speed
            platforms.forEach(platform=>{
                platform.position.x += player.speed
            })
            genericObjects.forEach(genericObject=>{
                genericObject.position.x +=player.speed * 0.66
            })
        }
    }

    if(scrollOffset > createImage('./images/platform.png').width*5 + 700) {
        console.log('you win');
    }

    if(player.position.y > canvas.height) {
        init();
    }
    platforms.forEach(platform=>{
        if(
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width 
            ){
            player.velocity.y = 0
        }
    })

    if(keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.right){
        player.frames = 1
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    }else if(keys.left.pressed && lastKey === 'left'  && player.currentSprite !== player.sprites.run.left){
        player.currentSprite = player.sprites.run.left
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    }else if(!keys.left.pressed && lastKey === 'left'  && player.currentSprite !== player.sprites.stand.left){
        player.currentSprite = player.sprites.stand.left
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    }else if(!keys.right.pressed && lastKey === 'right'  && player.currentSprite !== player.sprites.stand.right){
        player.currentSprite = player.sprites.stand.right
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    }
}

init()
animate();

addEventListener('keydown', ({keyCode})=>{
    if(keyCode === 37){
        keys.left.pressed = true
        lastKey = 'left'
        console.log('left');
    }
    if(keyCode === 38){
        player.velocity.y = -15
        console.log('up');
    }
    if(keyCode === 39){
        keys.right.pressed = true
        lastKey = 'right'
        console.log('right');
    }
    if(keyCode === 40){
        player.velocity.y = 10
        console.log('down');
    }
})

addEventListener('keyup', ({keyCode})=>{
    if(keyCode === 37){
        keys.left.pressed = false
        console.log('left');
    }
    if(keyCode === 38){
        console.log('up');
    }
    if(keyCode === 39){
        keys.right.pressed = false
       
        console.log('right');
    }
    if(keyCode === 40){
        console.log('down');
    }
})