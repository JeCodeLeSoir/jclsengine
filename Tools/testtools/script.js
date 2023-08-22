const canvas = document.getElementById('timelineCanvas');
const ctx = canvas.getContext('2d');

const timelineWidth = 1000; // Largeur totale de la timeline
const spriteWidth = 20; // Largeur des sprites
const spriteHeight = 30; // Hauteur des sprites
const zoomFactor = 1.5; // Facteur de zoom

// Exemple de données de sprites
const sprites = [
  { startTime: 500, duration: 200 },
  { startTime: 300, duration: 150 },
  // Ajoutez d'autres données de sprites ici
];

canvas.width = timelineWidth;
canvas.height = spriteHeight;

// Fonction pour dessiner les sprites
function drawSprites() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  sprites.forEach(sprite => {
    const x = sprite.startTime;
    const width = sprite.duration;
    ctx.fillStyle = 'blue';
    ctx.fillRect(x, 0, width, spriteHeight);
  });
}

drawSprites();

// Fonction pour gérer le zoom de la timeline
function handleZoom(delta) {
  const newWidth = timelineWidth * (delta > 0 ? (1 / zoomFactor) : zoomFactor);
  canvas.width = newWidth;
  drawSprites();
}

// Gestionnaire d'événement pour la molette de la souris
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = Math.sign(e.deltaY);
  handleZoom(delta);
});
