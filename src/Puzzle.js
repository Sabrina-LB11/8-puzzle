const puzzleContainer = document.querySelector("#puzzle-container")

let puzzle = []
let size = 3
let puzzleArray = []
let completed = []
let inversions = 0

handleInput()
// generatePuzzle()
// renderPuzzle()

document.getElementById('file-input')
    .addEventListener('change', leerArchivo, false);

/** FUNCIONES RELACIONADAS A LA LECTURA DEL ARCHIVO */
function leerArchivo(e) {
    
    if(puzzle != []) {
        puzzle = []
    }
    var archivo = e.target.files[0];
    if (!archivo) {
        return;
    }
    var lector = new FileReader();
    lector.onload = function(e) {
        var contenido = e.target.result;
        puzzleArray = contenido.replace(" ", "").split(',')
        mostrarContenido(contenido);
        generatePuzzle(puzzleArray);
    };
    lector.readAsText(archivo);
   
}
function mostrarContenido(contenido) {
  var elemento = document.getElementById('contenido-archivo');
  elemento.innerHTML = contenido;
}
function getEmptyItem() {
    return puzzle.find(item => item.disabled)
}
function getItemByPosition(pos) {
    return puzzle.find(item => item.position == pos)
}
function getItemByPriority(pri) {
    return puzzle.find(item => item.priority == pri)
}
function getRow(position) {
    return Math.ceil(position/size)
}
function getColumn(position) {
    const column = position % size
    if(column == 0) {
        return size
    }
    return column
}
function generatePuzzle(puzzleArray) {
    var openSet, closeSet;
    for(let i = 0; i < size * size; i++) {
        puzzle.push({
            value: puzzleArray[i],
            position: i,
            x: (getColumn(i+1)-1) * 100,
            y: (getRow(i+1)-1) * 100,
            priority: puzzleArray[i] - 1,
            disabled: false
        })
    }
    
    const puzzleWithValueOfUndefined = puzzle.find((item) => item.value === undefined 
        || item.value == 0 || item.value == 9)
    puzzleWithValueOfUndefined.disabled = true

    renderPuzzle()
    
    // console.log(puzzleArray)
}
function renderPuzzle() {
    puzzleContainer.innerHTML = ""
    for(let puzzleItem of puzzle) {
        if(puzzleItem.disabled == false) {
            puzzleContainer.innerHTML += 
            `<div class="puzzle-item" style="left: ${puzzleItem.x}px; top: ${puzzleItem.y}px;">
                ${puzzleItem.value}
            </div>`
        }
    }
}
function isSolved() {
    for(let i = 0; i < ((size * size) - 1); i++) {
        let itemPostion = puzzle[i].position
        if(puzzle[i].value == (itemPostion + 1)) {
            completed.push("true")
        } else {
            inversions++
            completed.push("false")
        }
    }
}
function solvePuzzle() {

    isSolved()

    if(completed.includes('false')) {
        console.log("no se ha terminado")

        if(getEmptyItem().x == 0 && getEmptyItem().y == 0) {
            console.log("El 0 esta en el primer lugar")
        } else {
            console.log("El 0 no esta en el primer lugar")
            if(getEmptyItem().y != 0) {
                handleKeyDown("ArrowDown")
            }
        }
        manhattan()
        console.log(puzzle)

    } else {
        alert("Listiwi")
    }
}

/** Verificamos si la función puede resolverse */
// function isSolvable() {
//     let inversions = 0;
//     let p = []

//     p = puzzle

//     for(let i = 0; i < puzzle.length - 1; i++) {
//         for(let j = i + 1; j < puzzle.length; j++) {
//             if(puzzle[i].value < puzzle[j].value) {
//                 inversions++;
//             }
//         }
//         if(puzzle[i] == 0 && i % 2 == 1) {
//             inversions++;
//         }
//     }
//     console.log(inversions)
//     return (inversions % 2 == 0)
// }
/** */

function hamming() {
    let hammingValue = 0;

    for(let puzzleItem of puzzle) {
        if(puzzleItem.position != puzzleItem.priority && puzzleItem.value != 0) {
            hammingValue++
        }
    }

    return hammingValue
}
function manhattan() {
    // let manhattanArray = [];
    let manhattanValue = 0

    for(let i = 0; i < (size * size) - 1; i++) {
        let actualPosition = getItemByPosition(i)
        let goalPosition = getItemByPosition(actualPosition.priority)
        
        let xPosition = Math.abs(goalPosition.x - actualPosition.x)
        if(xPosition > 0) {
            xPosition = xPosition / 100
        }
        console.log("xPosition: "+xPosition)

        let yPosition = Math.abs(goalPosition.y - actualPosition.y)

        if(yPosition > 0) {
            yPosition = yPosition / 100
        }
        console.log("yPosition: "+yPosition)

        manhattanValue += (xPosition + yPosition)      
    }
    
    console.log("total manhattan: "+manhattanValue)


    return manhattanValue

}

/** FUNCIONES PARA DETECTAR LA FECHA OPRIMIDA */
function handleInput() {
    document.addEventListener('keydown', handleKeyDown)
}
function handleKeyDown(e) {
    switch(e.key) {
        case "ArrowLeft":moveLeft()
            break
        case "ArrowRight":moveRight()
            break
        case "ArrowUp":moveUp()
            break
        case "ArrowDown":moveDown()
            break
    }
    renderPuzzle()
}

/** FUNCIONES RELACIONADAS AL MOVIMIENTO DE LOS ITEMS */
function moveLeft() {
    const emptyItem = getEmptyItem()
    const rightItem = getRightPuzzle()
    console.log("consola:")
    console.log(rightItem)
    if(rightItem) {
        swapPosition(emptyItem, rightItem, true)
        // console.log(emptyItem, rightItem)
    }
}
function moveRight() {
    const emptyItem = getEmptyItem()
    const leftItem = getLeftPuzzle()
    console.log("consola:")
    console.log(leftItem)
    if(leftItem) {
        swapPosition(emptyItem, leftItem, true)
        // console.log(emptyItem, leftItem)
    }
}
function moveUp(){
    const emptyItem = getEmptyItem()
    const downItem = getDownPuzzle()
    if(downItem) {
        swapPosition(emptyItem, downItem, false)
        console.log(emptyItem, downItem)
    }
}
function moveDown() {
    const emptyItem = getEmptyItem()
    const upItem = getUpPuzzle()
    if(upItem) {
        swapPosition(emptyItem, upItem, false)
        console.log("down: ")
        console.log(emptyItem, upItem)
    }
}
/** Función para intercambiar posición entre items */
function swapPosition(firstPosition, secondPosition, isX = false) {
    let temp = firstPosition.position
    firstPosition.position = secondPosition.position
    secondPosition.position = temp

    if(isX) {
        temp = firstPosition.x
        firstPosition.x = secondPosition.x
        secondPosition.x = temp
    } else {
        temp = firstPosition.y
        firstPosition.y = secondPosition.y
        secondPosition.y = temp
    }
    
}
/** Indican cambios a realizar para el cambio de posición */
function getRightPuzzle() {
    const emptyItem = getEmptyItem()
    const rightPostion = emptyItem.x === 200
    if(rightPostion) {
         return null
    }

    const puzzle = getItemByPosition(emptyItem.position + 1)
    return puzzle
}
function getLeftPuzzle() {
    const emptyItem = getEmptyItem()
    const leftPostion = emptyItem.x === 0
    // console.log("posision "+leftPostion)
    if(leftPostion) {
         return null
    }
    const puzzle = getItemByPosition(emptyItem.position - 1)
    return puzzle
}
function getUpPuzzle() {
    const emptyItem = getEmptyItem()
    const upPostion = getRow(emptyItem.y) === 0

    if(upPostion) {
         return null
    }

    const puzzle = getItemByPosition(emptyItem.position - size)
    return puzzle
}
function getDownPuzzle() {
    const emptyItem = getEmptyItem()
    const downPostion = getRow(emptyItem.y) === 200

    if(downPostion) {
         return null
    }

    const puzzle = getItemByPosition(emptyItem.position + size)
    return puzzle

}
