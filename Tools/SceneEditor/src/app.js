class ResizeBar {

  constructor(container, left, right, direction = 'Horizontal') {
    this.container = container;
    this.left = left;
    this.right = right;
    this.isResizing = false;

    this.resizeBar = document.createElement('div');
    this.resizeBar.classList.add('Resize-Bar-' + direction);
    this.resizeBar.id = 'Resize-Bar-' + direction;

    //find attribute min-w
    this.lminW = this.left.getAttribute('min-w') || 0;
    this.lminH = this.left.getAttribute('min-H') || 0;

    this.rminW = this.right.getAttribute('min-w') || 0;
    this.rminH = this.right.getAttribute('min-H') || 0;

    this.left.style.width = this.lminW + '%';
    this.left.style.height = this.lminH + '%';

    this.right.style.width = this.rminW + '%';
    this.right.style.height = this.rminH + '%';



    this.container.insertBefore(this.resizeBar, this.right);

    this.resizeBar.addEventListener('mousedown', (e) => {
      this.isResizing = true;
    });

    document.addEventListener('dragover', (e) => {
      e.preventDefault();
    })

    document.addEventListener('mouseup', () => {
      this.isResizing = false;
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.isResizing) return;

      const container = this.container.getBoundingClientRect();
      switch (direction) {
        case 'Horizontal':
          this.horizontalResize(e, container);
          break;
        case 'Vertical':
          this.verticalResize(e, container);
          break;
      }

    });
  }

  horizontalResize(e, _container_rect) {
    const mouseX = e.clientX;

    /* pourcentage de la taille de la fenêtre */

    const leftWidth = (mouseX - _container_rect.left) / _container_rect.width * 100;
    const rightWidth = 100 - leftWidth;

    /* ne dépasse pas la taille de 100% */

    this.left.style.width = leftWidth + '%';
    this.right.style.width = rightWidth + '%';

  }

  verticalResize(e, _container_rect) {
    const mouseY = e.clientY;

    /* pourcentage de la taille de la fenêtre */

    const topHeight = (mouseY - _container_rect.top) / _container_rect.height * 100;
    const bottomHeight = 100 - topHeight;

    this.left.style.height = topHeight + '%';
    this.right.style.height = bottomHeight + '%';

  }
}

new ResizeBar(
  document.querySelector('.Editor'),
  document.querySelector('.Hierarchy'),
  document.querySelector('.Editor-Sub')
)

new ResizeBar(
  document.querySelector('.Editor-Sub'),
  document.querySelector('.Scene'),
  document.querySelector('.Assets'),
  'Vertical'
)