// Initialize an empty string to store the calculator input
let string = "";

// Function to clear the last entry in the input field
function clearLastEntry() {
  // Remove the last character from the string
  string = string.slice(0, -1);
  document.querySelector('input').value = string; // Update the input field
}

// Function to calculate the square of the current input value
function squareRoot() {
  let currentValue = parseFloat(document.querySelector('input').value); // Get the current value
  
  if (!isNaN(currentValue)) { // Check if the value is a valid number
    let squaredValue = Math.pow(currentValue, 2); // Calculate the square of the value
    document.querySelector('input').value = squaredValue; // Display the squared value
    string = squaredValue.toString(); // Update the string for further operations
  }
}

// Get all buttons from the HTML
let buttons = document.querySelectorAll('.button');

// Add event listeners to all calculator buttons
Array.from(buttons).forEach((button) => {
  button.addEventListener('click', (e) => {
    // Handle the '=' button (evaluate the expression)
    if (e.target.innerHTML == '=') {
      string = eval(string); // Evaluate the current string
      document.querySelector('input').value = string; // Display the result
    } 
    // Handle the 'C' button (clear last entry)
    else if (e.target.innerHTML == 'C') {
      clearLastEntry();
    } 
    // Handle the 'X2' button (square the current value)
    else if (e.target.innerHTML == 'X2') {
      squareRoot();
    } 
    // Handle the '0' button
    else if (e.target.innerHTML == '0') {
      string = string + '0'; // Add '0' to the string
      document.querySelector('input').value = string;
    } 
    // Handle the multiplication (replace 'x' with '*')
    else if (e.target.innerHTML == 'x') {
      string = string + '*';
      document.querySelector('input').value = string;
    } 
    // Handle the '%' button (convert percentage)
    else if (e.target.innerHTML == '%') {
      string = string + '/100'; // Convert to percentage
      document.querySelector('input').value = string;
    } 
    // Handle the 'Clr' button (clear the input field)
    else if (e.target.innerHTML == 'Clr') {
      string = " "; // Reset the string
      document.querySelector('input').value = string;
    } 
    // Handle all other button clicks (numbers, operators)
    else {
      console.log(e.target); // Log the button clicked (for debugging)
      string = string + e.target.innerHTML; // Append the clicked value to the string
      document.querySelector('input').value = string; // Update the input field
    }
  });
});

