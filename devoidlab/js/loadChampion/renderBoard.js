async function renderConceptBoard(championName) {
  logCALL("renderBoard() <- json.name");
  //
  championFolderPath = `data/champions/${championName}`;
  boardFolderPath = championFolderPath + '/board';
  jsonPath = championFolderPath + '/board.json';
  conceptBoardTitle = document.getElementById('concept-board-title');
  conceptBoardTitle.textContent = 'Board - ' + championName;
  //
  try {
    const response = await fetch(jsonPath)
    const json = await response.json();
    // get masonry container
    const gallery = document.querySelector('.kp-masonry-gallery');

    logCREATE("create all masonry images");
    //
    json.forEach(item => {
      // create masonry item
      const div = document.createElement('div');
      div.className = 'kp-masonry-grid-item';
      // create image inside mansonry item
      const img = document.createElement('img');
      img.src = boardFolderPath + `/${item.file}`;
      img.alt = item.file;
      div.appendChild(img);
      // create image description
      const span = document.createElement('span');
      span.className = 'kp-masonry-txt';
      span.innerHTML = item.text;
      div.appendChild(span);

      gallery.appendChild(div);
    });

    logCREATE("build masonry container");
    //
    imagesLoaded(gallery, function () {
      new Masonry(gallery, {
        itemSelector: '.kp-masonry-grid-item',
        columnWidth: '.kp-masonry-grid-item',
        gutter: 10,
        fitWidth: true,
        horizontalOrder: true

      });
    });

  } catch (err) {
    console.error(err);
  }
  logOK("renderBoard()");
}