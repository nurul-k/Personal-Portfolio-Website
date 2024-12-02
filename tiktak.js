// Selecting all the Tic-Tac-Toe boxes
let boxes = document.querySelectorAll(".box");

let moveCount = 0; // Initialize move counter

// Selecting reset and new game buttons
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");

// Selecting the message container and message element for displaying the winner
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let playerTurnMsg = document.querySelector("#msg2"); // Select the element to display player's turn

// Setting initial turn to 'O'
let turnO = true;

// Winning patterns for the Tic-Tac-Toe game (rows, columns, and diagonals)
const winPatterns = [
    [0,1,2], // Top row
    [0,3,6], // First column
    [0,4,8], // Diagonal
    [1,4,7], // Middle column
    [2,5,8], // Right column
    [2,4,6], // Diagonal
    [3,4,5], // Middle row
    [6,7,8]  // Bottom row
];

// Function to reset the game and re-enable all boxes
const resetGame = () =>{
    turnO = true; // Set initial turn back to 'O'
    enableBoxes(); // Enable all boxes for clicking
    msgContainer.classList.add("hide"); // Hide the winner message
    moveCount = 0; // Reset move counter
    updatePlayerTurn(); // Update the turn display after every click
};

// Function to update the display message for the current player's turn
const updatePlayerTurn = () => {
    if (turnO) {
        playerTurnMsg.innerText = "Player O's turn";
    } else {
        playerTurnMsg.innerText = "Player X's turn";
    }
};

// Event listener for each box in the grid
boxes.forEach((box) => {
    box.addEventListener("click", () =>{
        // If it's 'O's turn, mark the box with 'O', otherwise 'X'
        if (turnO) {
           box.innerText = "O";
           turnO = false; // Switch turn to 'X'
        } else {
            box.innerText = "X";
            turnO = true; // Switch turn back to 'O'
        }
        box.disabled = true; // Disable the box after clicking
        moveCount++;        // Increment move counter 
        updatePlayerTurn(); // Update the turn display after every click
        checkWinner(); // Check if there's a winner after each move
    });
});

// Function to enable all boxes (for resetting the game)
const enableBoxes = () =>{
    for (let box of boxes) {
        box.disabled = false; // Re-enable boxes
        box.innerText = "";   // Clear the content of boxes
    }
};

// Function to disable all boxes (after a win)
const disableBoxes = () =>{
    for (let box of boxes) {
        box.disabled = true; // Disable all boxes
    }
};

// Function to show the winner and display a message
const showWinner = (winner) =>{
    msg.innerText = `Congratulations, Winner is ${winner}`; // Set winner message
    msgContainer.classList.remove("hide"); // Show the message container
    disableBoxes(); // Disable boxes to prevent further moves
    playerTurnMsg.innerText = `${winner} is the Champ`;
    
}

// Function to show the draw game and display a message
const drawGame = () =>{
    msg.innerText = `The Game has been draw! Play Again`; // Set the draw message
    msgContainer.classList.remove("hide"); // Show the message container
    disableBoxes(); // Disable boxes to prevent further moves
    playerTurnMsg.innerText = `No Winner found!`;
}

// Function to check if a player has won
const checkWinner = () =>{
    // Loop through all winning patterns
    for (let pattern of winPatterns) {
        let pos1Val =  boxes[pattern[0]].innerText; // Value at first position
        let pos2Val =  boxes[pattern[1]].innerText; // Value at second position
        let pos3Val =  boxes[pattern[2]].innerText; // Value at third position
        
        // Check if all positions in the pattern are filled and match
        if (pos1Val !== "" && pos2Val !== "" && pos3Val !== ""){
            if(pos1Val === pos2Val && pos2Val === pos3Val){
                showWinner(pos1Val); // If the match, show the winner
                return; // Exit the function as we have a winner
            }
        }
    }
    // Tf all the moves are made and no winner, declare a draw
    if(moveCount === 9){  
        drawGame(); // Function to handle the  draw scenario
    }
};

// Event listeners for the 'New Game' and 'Reset Game' buttons
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

// Initial player turn message
updatePlayerTurn();


