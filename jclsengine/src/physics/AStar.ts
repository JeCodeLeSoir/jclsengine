/*export class Node {
  x: number = 0;
  y: number = 0;

  f: number = 0; // total distance
  g: number = 0; // distance from start
  h: number = 0; // distance from end

  walkable: boolean = true;
  parent: Node | null = null;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class AStar {

  //2D

  openList: Node[] = [];
  closedList: Node[] = [];
  grid: Node[][] = [];

  startNode: Node | null = null;
  endNode: Node | null = null;


  constructor(grid: Node[][]) {
    this.grid = grid;
  }

  findPath(startNode: Node, endNode: Node): Node[] {
    this.startNode = startNode;
    this.endNode = endNode;

    this.openList.push(this.startNode);

    while (this.openList.length > 0) {
      let currentNode = this.openList[0];

      for (let i = 1; i < this.openList.length; i++) {
        if (this.openList[i].f < currentNode.f) {
          currentNode = this.openList[i];
        }
      }

      this.openList.splice(this.openList.indexOf(currentNode), 1);
      this.closedList.push(currentNode);

      if (currentNode === this.endNode) {
        return this.getPath();
      }

      let neighbors = this.getNeighbors(currentNode);

      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];

        if (this.closedList.indexOf(neighbor) != -1 || !neighbor.walkable) {
          continue;
        }

        let gScore = currentNode.g + 1;
        let gScoreIsBest = false;

        if (this.openList.indexOf(neighbor) == -1) {
          gScoreIsBest = true;
          neighbor.h = this.heuristic(neighbor, this.endNode);
          this.openList.push(neighbor);
        } else if (gScore < neighbor.g) {
          gScoreIsBest = true;
        }

        if (gScoreIsBest) {
          neighbor.parent = currentNode;
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
        }
      }
    }

    return [];
  }

}*/