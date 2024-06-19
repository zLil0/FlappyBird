const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 600
canvas.height = 500

const xPlayer = 50
const gravity = 0.5

class Player {
  constructor(){
    this.pos = {
      x: xPlayer,
      y: canvas.height/2,
    }
    this.vel = {
      y: 0
    }
    this.radius = 20
  }
  draw(){
    c.beginPath()
    c.fillStyle= 'black'
    c.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI*2)
    c.fill()
    c.closePath()
  }

  update(){
    this.vel.y += gravity 
    this.pos.y += this.vel.y
    this.draw()
  }
}

let speed = 2
const pipes = []
class Pipe{
  static width = 50
  static gap = 150 
  constructor(ratio){
    this.bottom = {
      pos:{
        x: canvas.width + Pipe.gap,
        y: canvas.height/2 + Pipe.gap/2 - ratio
      }
    }
    this.top = {
      pos:{
        x: canvas.width + Pipe.gap,
        y: 0
      }
    }
    this.bottom.height = canvas.height
    this.top.height = canvas.height/2 - Pipe.gap/2 - ratio
  }
  draw(){
    c.beginPath()
    c.fillStyle= 'green'
    c.fillRect(this.top.pos.x, this.top.pos.y, Pipe.width, this.top.height)
    c.fillRect(this.bottom.pos.x, this.bottom.pos.y, Pipe.width, this.bottom.height)
    c.closePath()
  }
  update(){
    this.top.pos.x -= speed
    this.bottom.pos.x -= speed
    this.draw()
  }
}

const bird = new Player()

bird.draw()

const maxRatio = canvas.height/ 3

const random = (min, max) => {
  return Math.floor(Math.random() * (max + 1 - min)) + min
}

const generatePipes = () => {
 
  ratio = Math.floor(random(-maxRatio, maxRatio ) / 20)
  pipes.unshift(new Pipe(ratio * 20))
}


let gameOver = false
const detectLose = (pipe) => {
  if(bird.pos.y + bird.radius >= canvas.height){
    gameOver = true
  }
  if(bird.pos.x + bird.radius >= pipe.top.pos.x && bird.pos.x - bird.radius <= pipe.top.pos.x + Pipe.width
    && (bird.pos.y + bird.radius >= pipe.bottom.pos.y || bird.pos.y - bird.radius <= pipe.top.pos.y + pipe.top.height)){
    gameOver = true
  }

}


const animate = () => {
  if(!gameOver){
    ticker = requestAnimationFrame(animate)
  }
  c.clearRect(0, 0, canvas.width, canvas.height)
  bird.update()
  if(ticker %120 === 0 || ticker === 1){
    generatePipes()
  }
  
  pipes.forEach((pipe, i)=>{
    pipe.update()
    if(pipe.top.pos.x + Pipe.width <= 0){
      pipes.splice(i, 1)
    }
    detectLose(pipe)
  })
  
}
animate()





document.addEventListener('keydown', (event)=>{
  bird.vel.y = -8
})


