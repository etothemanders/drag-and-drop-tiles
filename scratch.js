class Module {
  activeIndex;

  init() {
    this.gridLayer = document.querySelector('.grid-layer');
    this.imageLayer = document.querySelector('.image-layer');

    this.cells = [
      { 'x': 0, 'y': 0, 'w': 1, 'h': 1 }, { 'x': 1, 'y': 0, 'w': 1, 'h': 1 }, { 'x': 2, 'y': 0, 'w': 1, 'h': 1 },
      { 'x': 0, 'y': 1, 'w': 1, 'h': 1 }, { 'x': 1, 'y': 1, 'w': 1, 'h': 1 }, { 'x': 2, 'y': 1, 'w': 1, 'h': 1 },
      { 'x': 0, 'y': 2, 'w': 1, 'h': 1 }, { 'x': 1, 'y': 2, 'w': 1, 'h': 1 }, { 'x': 2, 'y': 2, 'w': 1, 'h': 1 },
    ];

    this.cells.forEach((c, i) => {
      const cellWidth = 100;
      const cellHeight = 100;

      // Build up the img elements and add them to the image layer
      const image = document.createElement('img');
      image.id = `image-${String(i)}`;
      image.setAttribute('src', `assets/${i}.png`);
      image.style.position = 'absolute';
      image.style.height = '100px';
      image.style.width = '100px';

      const originalLeft = c.x * cellWidth;
      const originalTop = c.y * cellHeight;
      c.offsets = { left: originalLeft, top: originalTop };
      image.style.left = `${originalLeft}px`;
      image.style.top = `${originalTop}px`;

      this.imageLayer.appendChild(image);

      // Build up the panes and add them to the grid layer
      const pane = document.createElement('div');
      pane.id = `pane-${String(i)}`;
      pane.dataset.index = i;
      pane.classList.add('pane');
      pane.setAttribute('draggable', true);

      pane.addEventListener('click', (e) => this.setActiveIndex(parseInt(e.target.dataset.index, 10))); // src
      pane.addEventListener('dragstart', (e) => this.onDragStart(e)); // src
      pane.addEventListener('dragenter', (e) => this.onDragEnter(e)); // target
      pane.addEventListener('dragover', (e) => this.onDragOver(e)); // target
      pane.addEventListener('dragleave', (e) => this.onDragLeave(e)); // target
      pane.addEventListener('drop', (e) => this.onDrop(e)); // target
      pane.addEventListener('dragend', (e) => this.onDragEnd(e)); // src

      this.gridLayer.appendChild(pane);
    });
  }

  setActiveIndex(newActiveIndex) {
    if (newActiveIndex === this.activeIndex) return;

    if (this.activeIndex !== undefined) {
      document.querySelector(`#pane-${this.activeIndex}`).classList.remove('pane--active');
    }

    this.activeIndex = newActiveIndex;
    document.querySelector(`#pane-${this.activeIndex}`).classList.add('pane--active');
  }

  onDragStart(evt) {
    console.log(`onDragStart: ${evt.target.dataset.index}`);

    const activePane = document.querySelector('.pane--active');
    if (activePane) {
      activePane.classList.remove('pane--active');
    }

    this.activeIndex = parseInt(evt.target.dataset.index, 10);
    this.setActiveIndex(this.activeIndex);

    const activeImage = document.querySelector(`#image-${this.activeIndex}`);
    activeImage.classList.add('image--hidden');

    evt.dataTransfer.setData('text/plain', evt.target.dataset.index);

    const dragImage = new Image();
    dragImage.src = activeImage.src;
    evt.dataTransfer.setDragImage(dragImage, 50, 50);

    // this.imageLayer.classList.toggle('image-layer--visible');
  }

  onDragEnter(evt) {
    evt.preventDefault();
    const targetIndex = parseInt(evt.target.dataset.index, 10);
    console.log(`onDragEnter: ${targetIndex}`);

    const targetPane = this.gridLayer.querySelector(`#pane-${targetIndex}`);
    targetPane.classList.add('pane--drop-target');

    if (targetIndex === this.activeIndex) return;

    let activeImage = document.querySelector(`#image-${this.activeIndex}`);
    activeImage.id = 'image-temp';

    // moving to higher index
    if (this.activeIndex - targetIndex < 0) {
      for (let moveIndex = this.activeIndex + 1; moveIndex <= targetIndex; moveIndex++) {
        const moveImage = document.querySelector(`#image-${moveIndex}`);
        const moveTo = this.cells[moveIndex - 1].offsets;
        moveImage.style.left = `${moveTo.left}px`;
        moveImage.style.top = `${moveTo.top}px`;
        moveImage.id = `image-${moveIndex - 1}`;
      }
    } else {
    // moving to lower index
      for (let moveIndex = this.activeIndex - 1; moveIndex >= targetIndex; moveIndex--) {
        const moveImage = document.querySelector(`#image-${moveIndex}`);
        const moveTo = this.cells[moveIndex + 1].offsets;
        moveImage.style.left = `${moveTo.left}px`;
        moveImage.style.top = `${moveTo.top}px`;
        moveImage.id = `image-${moveIndex + 1}`;
      }
    }

    activeImage = document.querySelector('#image-temp');
    const moveTo = this.cells[targetIndex].offsets;
    activeImage.style.left = `${moveTo.left}px`;
    activeImage.style.top = `${moveTo.top}px`;
    activeImage.id = `image-${targetIndex}`;

    this.activeIndex = targetIndex;
  }

  onDragOver(evt) {
    evt.preventDefault(); // maybe can just keep this
  }

  onDragLeave(evt) {
    evt.preventDefault();
    const targetIndex = parseInt(evt.target.dataset.index, 10);
    console.log(`onDragLeave: ${targetIndex}`);

    const targetPane = this.gridLayer.querySelector(`#pane-${targetIndex}`);
    targetPane.classList.remove('pane--drop-target');
  }

  onDrop(evt) {
    evt.preventDefault();
    const targetIndex = parseInt(evt.target.dataset.index, 10);
    console.log(`onDrop: ${targetIndex}`);
    const sourceIndex = parseInt(evt.dataTransfer.getData('text/plain'), 10);

    const dropPane = document.querySelector('.pane--drop-target');
    dropPane.classList.remove('pane--drop-target');
    const activePane = document.querySelector(`#pane-${targetIndex}`);
    activePane.classList.add('pane--active');
    const activeImage = document.querySelector('.image--hidden').classList.remove('image--hidden');

    // this.swapImages(sourceIndex, targetIndex); moveChannel(fromHere, toHere);
  }

  onDragEnd(evt) {
    console.log(`onDragEnd: ${evt.target.dataset.index}`);
    // this.activeIndex = undefined;
    evt.dataTransfer.clearData();
    // this.imageLayer.classList.toggle('image-layer--visible');
  }
};

window.onload = function() {
  const module = new Module();
  module.init();
};
