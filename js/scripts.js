const gridContainer = document.querySelector('div.grid-container');
const colorInput = document.querySelector('#color');
const clearBtn = document.querySelector('#clear-grid');
const gridSizeInput = document.querySelector('#grid-size');
const setSizeBtn = document.querySelector('#submit-grid-size');
const allowShade = document.querySelector('#shade');

let color = colorInput.value;
const DEFAULT_GRIDS = 50, MAX_GRIDS = 150;


// Initialize grid using flex (first add a column, then add grids to it using flex: 1)
function createCanvas(noOfGrids = DEFAULT_GRIDS) {
    for (let i = 0; i < noOfGrids; i++) {
        let gridCol = document.createElement('div');
        gridCol.classList.add('col');

        for (let j = 0; j < noOfGrids; j++) {
            let grid = document.createElement('div');
            grid.classList.add('grid');

            if (allowShade.checked)
                grid.style.opacity = '0.4';
            else
                grid.style.opacity = '';

            gridCol.appendChild(grid);
        }

        gridContainer.appendChild(gridCol);
    }
    currentNoOfGrids = noOfGrids;
}

// Callback function for 'drawing' event listener
function drawEventAdder() {
    let colList = gridContainer.children;
    
    for (let col of Array.from(colList)) {
        let gridList = col.children;
        for (let grid of Array.from(gridList)) {
            grid.addEventListener('mouseenter', () => {
                drawOnCanvas(grid);
            });
        }
    }
}

// Function to draw colors on canvas board
function drawOnCanvas(grid) {
    let drawColor = color;

    if (color === 'rainbow')
        drawColor = random();

    /*
        This clause is for enabling shade feature.
        If color already in classList of grid, change opacity if shade is enabled, else return
        If color not in classList, but shade is enabled, add opacity before switching color
        
        If shade is disabled, and no color in classList, set opacity to none and move on
    */

    if (grid.classList.contains(drawColor) || grid.classList.length === 1) {
        if (allowShade.checked) {
            if (grid.style.opacity === '')
                grid.style.opacity = '0.3';

            if (grid.style.opacity === '1')
                return;

            grid.style.opacity = (parseFloat(grid.style.opacity) + 0.1);
        }
        else {
            grid.style.opacity = '';
        }
    }
    else if (grid.classList.contains(drawColor)) {
        return;
    }

    let tempGrid = grid;

    tempGrid.classList.forEach((cssClass) => {
        if (cssClass !== 'grid')
            grid.classList.remove(cssClass);
    });

    grid.classList.add(drawColor);
}

// Select a random color for rainbow mode
function random() {
    const colors = ['black', 'red', 'green', 'blue', 'yellow', 'purple'];

    let randIndex = Math.round(Math.random() * (colors.length - 1));
    return colors[randIndex];
}

// Change no. of grids per side of canvas
function resizeCanvas(noOfGrids) {
    deleteGrids();
    createCanvas(noOfGrids);
    drawEventAdder();
}

// Clear all columns in grid container
function deleteGrids() {
    let colList = gridContainer.children;
    for (let col of Array.from(colList)) {
        gridContainer.removeChild(col);
    }
}

// Initialize canvas before adding event listeners
createCanvas();
drawEventAdder();

/*Event listeners start here*/

// Take color from select option
colorInput.addEventListener('change', () => {
    color = colorInput.value;

    let tempContainer = gridContainer;
    tempContainer.classList.forEach((cssClass) => {
        if (cssClass !== 'grid-container')
            gridContainer.classList.remove(cssClass);
    });

    gridContainer.classList.add('grid-shadow-' + color);
});

// Clear canvas by removing all color classes
clearBtn.addEventListener('click', () => {
    let colList = gridContainer.children;

    for (let col of Array.from(colList)) {
        let gridList = col.children;

        for (let grid of Array.from(gridList)) {
            let tempGrid = grid;
            tempGrid.classList.forEach((cssClass) => {
                if (cssClass !== 'grid')
                    grid.classList.remove(cssClass);
            });
        }
    }
});

// Enable grid size change button
let newNoOfGrids;
gridSizeInput.addEventListener('change', () => {
    if (gridSizeInput.value) {
        newNoOfGrids = parseInt(gridSizeInput.value);
        if (newNoOfGrids !== currentNoOfGrids) {
            setSizeBtn.removeAttribute('disabled');
        }
        else {
            setSizeBtn.setAttribute('disabled', '');
        }
    }
});

// Change grid size
setSizeBtn.addEventListener('click', () => {
    if (newNoOfGrids > MAX_GRIDS) {
        alert("Value is too big. Changing to default value........");
        newNoOfGrids = DEFAULT_GRIDS;
    }
    resizeCanvas(newNoOfGrids);
    gridSizeInput.value = '';
    setSizeBtn.setAttribute('disabled', '');
})