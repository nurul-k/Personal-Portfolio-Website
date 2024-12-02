
    // JavaScript code to add functionality to the navbar and buttons

document.addEventListener('DOMContentLoaded', () => {
    // Function to open all navbar links
    document.querySelector('.left').addEventListener('click', () => {
      const links = document.querySelectorAll('.right ul li a');
      links.forEach(link => {
        window.open('file:///C:/Users/nurul/OneDrive/Desktop/JavaScript/Calculator.html', '_blank');
      });
    });
  
    // Function to handle button clicks
    document.querySelector('.buttons').addEventListener('click', (event) => {
      if (event.target.classList.contains('btn')) {
        if (event.target.textContent.includes('Resume')) {
          //  resume file
          window.open('Resume10.pdf', '_blank');
        } else if (event.target.textContent.includes('LinkedIn')) {
          //  LinkedIn URL
          window.open('https://www.linkedin.com/in/nurul-khan-2b7a632b5/', '_blank');
        }
      }
    });
  });
  


