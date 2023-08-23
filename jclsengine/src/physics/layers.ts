type Layer = {
  name: string;
  mask: number;
};

/*
  // Décaler l'index du calque (8) pour obtenir un masque de bits
  let layerMask = 1 << 8;


// Cela projetterait des rayons uniquement contre les collisionneurs de la couche 8.
   // Mais à la place, nous voulons entrer en collision avec tout sauf la couche 8. L'opérateur ~ fait cela, il inverse un masque de bits.

  layerMask = ~layerMask;

  Là ça va collision er avec tout ce qui "a un bit autre que le bit 8 à 1"
  Sur 32bits ça ferai des check comme ceci :
  someMask & 0xfffffeff
*/

let layer = ~(1 << 8);

function RayCast(orig, dir, out, layer) {

}

export class Layers {
  static matrix: boolean[][] = [];
  static _Layers = new Map<string, Layer>();

  static GetLayer(name: string): Layer | undefined {
    return this._Layers.get(name);
  }

  static AddLayer(name: string, mask: number) {
    this._Layers.set(name, {
      name: name,
      mask: mask
    });
  }

  static RemoveLayer(name: string) {
    this._Layers.delete(name);
  }

  static GetMask(name: string): number {
    const layer = this.GetLayer(name);
    if (layer === undefined) return 0;
    return layer.mask;
  }

  static LoadLayerCollisionMatrix(csv): boolean[][] {
    /*
       ==>,         Player,  Enemy, Missile_Enemy, Missile_Player,
       Player,         ✘,       ✔,          ✔,           ✘,
       Enemy,          ✔,       ✘,          ✘,           ✔,
       Missile_Enemy,  ✔,       ✔,          ✘,           ✔,
       Missile_Player, ✘,       ✔,          ✔ ,          ✘,
    */
    const matrix: boolean[][] = [];

    matrix["default"] = [];
    matrix["default"]["default"] = true;

    csv = csv.replace(/\r/g, '');

    const lines = csv.split('\n');
    for (let a = 0; a < lines.length; a++) {
      const cols = lines[a].split(',');
      for (let b = 0; b < lines.length; b++) {
        if (a === 0 || b === 0) continue;

        let keyNameA = cols[0];
        let keyNameB = lines[0].split(',')[b];

        if (keyNameA === "" || keyNameB === "") continue;
        if (keyNameA === " " || keyNameB === " ") continue;

        keyNameA = keyNameA.toLowerCase();
        keyNameB = keyNameB.toLowerCase();

        //console.log(keyNameA, keyNameB);

        if (matrix[keyNameA] === undefined) matrix[keyNameA] = [];

        //console.log(cols[b]);
        matrix[keyNameA][keyNameB] = cols[b] === '✔';
      }
    }

    return matrix;
  }

  static Load(url) {
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        Layers.matrix = this.LoadLayerCollisionMatrix(data);
        //Layers.matrix["Player"]["Enemy"]
      });
  }
}

Layers.Load('./assets/layers.csv');