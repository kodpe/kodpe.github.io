var element = document.createElement('div');
var currentYear = new Date().getFullYear();
element.innerHTML = `
      <p id="footer-text">© Copyright ${currentYear} kodpe.github.io. Fan-made, unofficial and non-commercial. kodpe.github.io isn't endorsed by Riot Games Corporation and doesn't reflect the views
      or opinions of Riot Games or anyone officially involved in producing or managing League of Legends.
      League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc.
      League of Legends © Riot Games, Inc.</p>
    `;

const bottomContainerElement = document.getElementById('bottom-container');
if (bottomContainerElement != null) {
    bottomContainerElement.appendChild(element);
}
else {
    alert('bottom-container missing');
}