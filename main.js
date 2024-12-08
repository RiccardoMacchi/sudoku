const grid = Array.from({ length: 9 }, () => Array(9).fill('.'));
const gridHtml = document.getElementById('grid')
const btnStart = document.getElementById('btn_start')
const btnCheck = document.getElementById('btn_check')
const btnComplete = document.getElementById('btn_complete')
const showCheck = document.getElementById('check')
const endGame = document.getElementById('end_game')
const gridArray = []
let autocomplete = false



function isValidPlacement(grid, row, col, num) {
    // Controllo colonna
    for (let i = 0; i < row; i++) {
        if (grid[i][col] === num) {
            return false
        }
    }

    // Controllo riga
    if (grid[row].includes(num)) {
        return false
    }

    // Controllo quadrante 3x3
    const startRow = Math.floor(row / 3) * 3
    const startCol = Math.floor(col / 3) * 3
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (grid[r][c] === num) {
                return false
            }
        }
    }
    
    return true
}

function printRow(){
    gridHtml.innerHTML = ''
    if(autocomplete){
        for (let i = 0; i < grid.length; i++) {
            let printRow = ''
            for (let n = 0; n < grid[i].length; n++) {            
                randomNumber = Math.floor(Math.random() * 9) + 1
                printRow += `<div class='grid_cell preinsert'><span>${grid[i][n]}</span></div>`      
            }
            gridHtml.innerHTML += printRow
        }
    } else {        
        for (let i = 0; i < grid.length; i++) {
            let printRow = ''
            for (let n = 0; n < grid[i].length; n++) {            
                randomNumber = Math.floor(Math.random() * 9) + 1
                printRow += `<div class='grid_cell ${n <= randomNumber + 1 && n >= randomNumber ? 'preinsert' : ''}'><span>${n <= randomNumber + 1 && n >= randomNumber ? grid[i][n] : ''}</span></div>`      
            }
            gridHtml.innerHTML += printRow
        }
    }
    
}
function createSudokuGrid(){
    autocomplete = false

    if(!endGame.classList.contains('none')){
        endGame.classList.add('none')
    }
    // Popolamento della griglia
    for (let i = 0; i < grid.length; i++) {
        for (let n = 0; n < grid[i].length; n++) {
            let randomNumber
            let go
            let attempts = 0
            let maxAttempts = 1000
    
            do {
                randomNumber = Math.floor(Math.random() * 9) + 1
                go = true
    
                if (!isValidPlacement(grid, i, n, randomNumber)) {
                    go = false
                }
    
                attempts++
            } while (!go && attempts < maxAttempts)
    
            if (attempts >= maxAttempts) {
                console.log('1000 tentativi, rigenera')
                grid.length = 0
                gridArray.length = 0
                grid.push(...Array.from({ length: 9 }, () => Array(9).fill('.')))
                i = -1
                break
            }

            grid[i][n] = randomNumber
            gridArray.push(randomNumber)
        }
    }
    console.table(grid)
    console.log('lista numeri sudoku',gridArray)
    printRow()

    const cells = document.querySelectorAll('.grid_cell')
    // console.log(cells)
    for (let n = 0; n < cells.length; n++) {      
        let addNumber = 0
        if(cells[n].innerText === ''){
            cells[n].addEventListener('click', ()=>{
                console.log('click')
                if(addNumber < 9){
                    cells[n].innerHTML = `<span>${++addNumber}</span>`
                    console.log(cells[n].classList.contains('error'))
                    if(cells[n].classList.contains('error')){
                        cells[n].classList.remove('error')
                    }
                } else {
                    addNumber = 0
                    cells[n].innerHTML = `<span></span>`
                }
            })
        }
    }
    showCheck.classList.remove('none')
}

btnStart.addEventListener('click', createSudokuGrid)

function checkSudoku(){
    cellsValue = document.querySelectorAll('.grid_cell')
    let counter = 0
    for (let i = 0; i < cellsValue.length; i++) {
        if(parseInt(cellsValue[i].innerText) !== gridArray[i]){
            cellsValue[i].classList.add('error')
            if(counter > 0){
                counter--
            }
        } else{
            cellsValue[i].classList.remove('error')
            cellsValue[i].classList.add('correct')
            counter++
        }

        if(counter === 81){
            endGame.classList.remove('none')
            console.log('sudoku corretto!')
        }
    }
}

btnCheck.addEventListener('click', checkSudoku)
btnComplete.addEventListener('click', ()=>{
    autocomplete = true
    printRow()
})