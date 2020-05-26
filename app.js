document.addEventListener('DOMContentLoaded', () => {

  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const speedDisplay = document.querySelector('#speed')
  const incSpeed = document.querySelector('#incSpeed')
  const restarBtn = document.querySelector('#restart')
  const width = 10
  let nextRandom = 0
  let timerId
  let speed = 1000

  let score = 0
  const colors = [
    'red',
    'purple',
    'blue',
    'orange',
    'green'
  ]

  //Piezas y sus rotaciones
  const lPieza = [ 
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1,  width*2+1, width*2],
    [width, width*2,  width*2+1, width*2+2]
  ]
  const sPieza = [
    [0, width, width+1, width*2+1],
    [width+1, width+2,  width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2,  width*2, width*2+1]
  ]

  const tPieza = [
  [1, width, width+1,  width+2],
  [1, width+1, width+2, width*2+1],
  [width, width+1,  width+2,  width*2+1],
  [1, width, width+1, width*2+1]
  ]

  const oPieza = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iPieza = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ]


const piezas = [lPieza, sPieza, tPieza, oPieza, iPieza]

let currentPosition = 4
let currentRotation = 0

//randomiza el selector de pieza
let random = Math.floor(Math.random()*piezas.length)
let current = piezas[random][0]

//Dibuja la pieza
function draw(){
  current.forEach(index => {
    squares[currentPosition + index].classList.add('pieza')
    squares[currentPosition + index].style.backgroundColor = colors[random]
  })
}

//Borra la pieza
function undraw() {
  current.forEach(index => {
    squares[currentPosition + index].classList.remove('pieza')
    squares[currentPosition + index].style.backgroundColor = ''
  })
}

//asignar teclas a los eventos
function control(e) {
  if(e.keyCode === 37) {
    moveLeft();
    //se mueve a la izquierda
  } else if (e.keyCode === 38) {
    rotate()
    //la pieza se rota
  } else if (e.keyCode === 39) {
    moveRight()
    //Se mueve a la derecha
  } else if (e.keyCode === 40) {
     // se mueve hacia abajo
     moveDown()
  }
}
document.addEventListener('keyup', control)

//Movimiento hacia abajo de las piezas
function moveDown() {
  undraw()
  currentPosition += width
  draw()
  freeze()
}

//parar piezas al llegar al fondo
function freeze() {
  if(current.some(index =>squares[currentPosition + index + width].classList.contains('taken'))) {
    current.forEach( index => squares[currentPosition + index].classList.add('taken'))
    //manda una nueva pieza
    random = nextRandom
    nextRandom = Math.floor(Math.random()*piezas.length)
    current = piezas[random] [currentRotation]
    currentPosition = 4
    draw()
    displayShape()
    addScore()
    gameOver()
  }
}

//desplazarse a la derecha, a menos que llegue al borde
function moveLeft() {
  undraw()
  const isALeftEdge = current.some(index => (currentPosition + index) % width === 0)
  if(!isALeftEdge) currentPosition -= 1
  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition +=1
  }
  draw()
}

//mover la pieza a la derecha, a menos que llegue al borde o tope con otra
function moveRight() {
  undraw()
  const isARigthEdge = current.some (index => (currentPosition + index) % width === width-1)

  if(!isARigthEdge) currentPosition +=1

  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition -=1
  }
  draw()
}

//Rotar la pieza
function rotate() {
  undraw()
  currentRotation++
  //cuando llegue al tope (3) vuelve a iniciar
  if(currentRotation === current.length) {
    currentRotation = 0
  }
  current = piezas[random][currentRotation]
  draw()
}

//proxima pieza
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
const displayIndex = 0

//el dibujo de las piezas en un array
const nextPieza = [
  [1, displayWidth+1, displayWidth*2+1, 2], //lPieza
  [0, displayWidth, displayWidth+1, displayWidth*2+1], //zPieza
  [1, displayWidth, displayWidth+1, displayWidth+2], //tPieza
  [0, 1, displayWidth, displayWidth+1],
  [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iPieza
]

//muestra la siguiente pieza en el recuadro
function displayShape () {
  displaySquares.forEach(square => {
    square.classList.remove('pieza')
    square.style.backgroundColor = ''
  })
  nextPieza[nextRandom].forEach( index => {
    displaySquares[displayIndex + index].classList.add('pieza')
    displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]

  })
}

//funcionalidad de los botones
startBtn.addEventListener('click', () => {
 if (timerId) {
   clearInterval(timerId)
   timerId = null
 } else {
   draw()
   //Inicia el movimiento de la pieza y la partida
   timerId = setInterval(moveDown, speed)
   nextRandom = Math.floor(Math.random()*piezas.length)
   displayShape()
 }
})
//Boton reiniciar juego
restarBtn.addEventListener('click', () => {
  location.reload()
})

//Botones de velocidad de caida
//Subir velocidad de caida
incSpeed.addEventListener('click', () => {
  if (speed > 100) {
      speed = speed - 150
      speedDisplay.innerHTML = speed
  }else {
    alert('No puedes subir mas la velocidad')
  }
 })

 //bajar velocidad de caida
 decSpeed.addEventListener('click', () => {
  if (speed < 1600) {
      speed = speed + 150
      speedDisplay.innerHTML = speed
  }else {
    alert('No puedes bajar mas la velocidad')
  }
 })

//agregar puntaje
function addScore() {
  for (let i = 0; i < 199; i += width) {
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

    if (row.every(index => squares[index].classList.contains('taken'))){
      score+=10
      scoreDisplay.innerHTML = score
      row.forEach(index => {
        squares[index].classList.remove('taken')
        squares[index].classList.remove('pieza')
        squares[index].style.backgroundColor = ''
      })
      const squaresRemoved = squares.splice(i, width)
      squares = squaresRemoved.concat(squares)
      squares.forEach(cell => grid.appendChild(cell))
    }
  }
}

//game over
function gameOver() {
  if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    scoreDisplay.innerHTML = score + ' GAME OVER'
    clearInterval(timerId)
  }
}

})