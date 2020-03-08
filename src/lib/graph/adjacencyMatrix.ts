const fromEdgeList = (nodesCount: number, edgeList: number[][]) => {
  const adjacencyMatrix = Array(nodesCount)
    .fill(0)
    .map(_ => [...Array(nodesCount).fill(0)]);

  edgeList.forEach(([l1, l2]) => {
    adjacencyMatrix[l1][l2] = adjacencyMatrix[l2][l1] = 1;
  });

  return adjacencyMatrix;
};

const toEdgeList = (adjacencyMatrix: number[][]) => {
  const edgeList: number[][] = [];

  const tempAdjacencyMatrix = [...adjacencyMatrix];
  const size = tempAdjacencyMatrix.length;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (tempAdjacencyMatrix[i][j] === 1) {
        edgeList.push([i, j]);
        tempAdjacencyMatrix[j][i] = 0;
      }
    }
  }

  return edgeList;
};

const removeEdge = (adjacencyMatrix: number[][], edge: number[]) => {
  if (edge.length !== 2) {
    throw new Error(`Edge should be an array of length 2. ${edge}`);
  }

  const [i, j] = edge;

  if (i >= adjacencyMatrix.length || i < 0) {
    throw new Error(`${i} is not an vertex within the matrix.`);
  }

  if (j >= adjacencyMatrix.length || j < 0) {
    throw new Error(`${j} is not an vertex within the matrix.`);
  }

  const tempAdjacencyMatrix = [...adjacencyMatrix];

  tempAdjacencyMatrix[i][j] = 0;
  tempAdjacencyMatrix[j][i] = 0;

  return tempAdjacencyMatrix;
};

const disconnectAll = (adjacencyMatrix: number[][]) => {
  return Array(adjacencyMatrix.length)
    .fill(0)
    .map(_ => [...Array(adjacencyMatrix.length).fill(0)]);
};

const connectAll = (adjacencyMatrix: number[][]) => {
  return Array(adjacencyMatrix.length)
    .fill(0)
    .map(_ => [...Array(adjacencyMatrix.length).fill(1)]);
};

export const AdjacencyMatrix = {
  fromEdgeList,
  toEdgeList,
  removeEdge,
  disconnectAll,
  connectAll
};
