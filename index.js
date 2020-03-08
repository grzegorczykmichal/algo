// /* eslint-disable no-loop-func */
// // const makeSteps = grid => {
// //   const size = grid.length - 1;
// //   return ([y, x]) => {
// //     const steps = [];
// //     const map = {};
// //     const up = y - 1;
// //     const right = x + 1;
// //     const down = y + 1;
// //     const left = x - 1;

// //     if (up >= 0) {
// //       steps.push([[up, x], grid[up][x]]);
// //       map[hash([up, x])] = grid[up][x];
// //     }
// //     if (right <= size) {
// //       steps.push([[y, right], grid[y][right]]);
// //       map[hash([y, right])] = grid[y][right];
// //     }
// //     if (down <= size) {
// //       steps.push([[down, x], grid[down][x]]);
// //       map[hash([down, x])] = grid[down][x];
// //     }
// //     if (left >= 0) {
// //       steps.push([[y, left], grid[y][left]]);
// //       map[hash([y, left])] = grid[y][left];
// //     }

// //     return [steps, map];
// //   };
// // };

// // const makeBiggestStep = grid => {
// //   const steps = makeSteps(grid);
// //   return (position, visited = {}) => {
// //     const [_, map] = steps(position);
// //     const entries = Object.entries(map);
// //     let max = [null, Number.MIN_SAFE_INTEGER];
// //     entries.forEach(([key, value]) => {
// //       if (!(key in visited)) {
// //         if (value > max[1]) {
// //           max = [key, value];
// //         }
// //       }
// //     });
// //     return max;
// //   };
// // };

// // // const calcFuel = (fuelFactor) =>

// // const makePeek = grid => ([x, y]) => grid[y][x];

// // function work(grid) {
// //   const visited = {};
// //   const biggest = makeBiggestStep(grid);
// //   const peek = makePeek(grid);
// //   let current = [grid.length - 1, grid.length - 1];
// //   let fuel = 1 - peek(current);
// //   let steps = 10;
// //   while (current[0] !== 0 && current[1] !== 0 && fuel >= 0 && steps > 0) {
// //     // const currentFuel = peek(current);
// //     const [bestKey, bestValue] = biggest(current, visited);
// //     if (bestKey === null) {
// //       throw new Error("Cannot determin best.");
// //     }
// //     visited[bestKey] = true;
// //     fuel = 1 + bestValue;
// //     steps--;
// //     current = fromHash(bestKey);
// //   }
// //   return fuel;
// // }

// // const _flaten = arr => {
// //   const a = [];
// //   const size = arr.length;
// //   const to1D = _2to1(size);
// //   for (let i = 0; i < size; i++) {
// //     for (let j = 0; j < size; j++) {
// //       a[to1D(i, j)] = arr[i][j];
// //     }
// //   }
// //   return a;
// // };

// // const makeGetNIndexes = grid => {
// //   const size = grid.length - 1;
// //   return ([x, y]) => {
// //     const steps = [];
// //     if (y - 1 >= 0) {
// //       steps.push([y - 1, x]);
// //     }
// //     if (x + 1 <= size) {
// //       steps.push([y, x + 1]);
// //     }
// //     if (y + 1 <= size) {
// //       steps.push([y + 1, x]);
// //     }
// //     if (x - 1 >= 0) {
// //       steps.push([y, x - 1]);
// //     }
// //     return steps;
// //   };
// // };

// // const _2to1 = size => ([x, y]) => size * x + y;
// // const _1to2 = size => i => [i % size, (i / size) >> 0];
// // const hash = ([x, y]) => `${x}/${y}`;
// // const fromHash = hash => hash.split("/").map(x => Number.parseInt(x));

// // const makeAdjacentTable = (array, markEmpty, markFull) => {
// //   const length = array.length;
// //   const to1D = _2to1(length);
// //   const to2D = _1to2(length);
// //   const getN = makeGetNIndexes(array);
// //   const size = length * length;
// //   const graph = [];
// //   for (let i = 0; i < size; i++) {
// //     graph[i] = new Array(size).fill(markEmpty());
// //     getN(to2D(i)).forEach(n => {
// //       graph[i][to1D(n)] = markFull();
// //     });
// //   }
// //   return graph;
// // };

// // const makeAdjacentMap = (
// //   array,
// //   getKey = (x, y, array) => {
// //     return array[x][y].toString();
// //   },
// //   getValue = (nx, ny, array) => ({
// //     value: array[nx][ny],
// //     x: nx,
// //     y: ny,
// //     coords: [nx, ny]
// //   })
// // ) => {
// //   const length = array.length;
// //   const to2D = _1to2(length);
// //   const getN = makeGetNIndexes(array);
// //   const size = length * length;
// //   const graph = [];
// //   for (let i = 0; i < size; i++) {
// //     const [y, x] = to2D(i);
// //     graph[getKey(x, y, array)] = { value: array[x][y], nodes: [] };
// //     getN([y, x]).forEach(([nx, ny]) => {
// //       graph[getKey(x, y, array)].nodes.push(getValue(nx, ny, array));
// //     });
// //   }
// //   return graph;
// // };

// // function main() {
// //   const data = [
// //     [1, -3, 3],
// //     [0, -2, 0],
// //     [2, -3, -3]
// //     // ["A", "B", "C"],
// //     // ["D", "E", "F"],
// //     // ["G", "H", "I"]
// //   ];
// //   // const table = makeAdjacentTable(
// //   //   data,
// //   //   () => "🌕",
// //   //   () => "🌑"
// //   // );
// //   // const map = makeAdjacentMap(
// //   //   data,
// //   //   (x, y) => `${x}/${y}`,
// //   //   (x, y, array) => array[x][y]
// //   // );

// //   const map2 = makeAdjacentMap(
// //     data,
// //     (x, y) => `${x}/${y}`,
// //     (x, y, array) => ({ value: array[x][y], x, y, key: `${x}/${y}` })
// //   );

// //   let current = [data.length - 1, data.length - 1];
// //   let currentHash = hash(current);
// //   let visited = { [currentHash]: true };
// //   let steps = 0;
// //   let minFuel = 1;
// //   while (currentHash in map2 && steps < 10) {
// //     const { value, nodes } = map2[currentHash];
// //     let next = null;
// //     let max = Number.MIN_SAFE_INTEGER;
// //     nodes.forEach(n => {
// //       if (n.value > max && !(n.key in visited)) {
// //         max = n.value;
// //         next = n;
// //       }
// //     });
// //     if (next === null) {
// //       break;
// //     }
// //     minFuel = 1 - value;
// //     visited[next.key] = true;
// //     current = [next.x, next.y];
// //     currentHash = hash(current);
// //     if (next.x === 0 && next.y === 0) {
// //       break;
// //     }
// //     steps++;
// //   }
// //   print(data, visited);
// //   console.log(minFuel - data[0][0]);
// // }

// // const print = (array, visited) => {
// //   let string = "";
// //   for (let i = 0; i < array.length; i++) {
// //     for (let j = 0; j < array.length; j++) {
// //       if (hash([i, j]) in visited) {
// //         string += "\t🌑";
// //       } else {
// //         string += "\t🌕";
// //       }
// //     }
// //     string += "\n";
// //   }
// //   console.log(string);
// // };

// // // const a = [
// // //   ["A", "B"],
// // //   ["C", "D"]
// // // ];

// // // const b = _flaten(a);
// // // const c = _1to2(b.length);

// // // console.log(b);
// // // console.log(c(1));

// // const calcPath = graph => {
// //   const byLabel = path => {
// //     let result = 0;
// //     for (let i = 0; i < path.length - 1; i++) {
// //       const legAIdx = graph.labelsToIdx[path[i]];
// //       const legBIdx = graph.labelsToIdx[path[i + 1]];
// //       const children = graph.connections[legAIdx];
// //       const childIdx = children.indexOf(legBIdx);
// //       if (childIdx === -1) {
// //         throw new Error("Imposible");
// //       }
// //       const w = graph.weights[legAIdx][childIdx];
// //       result += w;
// //       return result;
// //     }
// //   };
// //   const byIndex = path => {
// //     let result = 0;
// //     if (path.length === 1) {
// //       return 0;
// //     }
// //     for (let i = 0; i < path.length - 1; i++) {
// //       const legAIdx = path[i];
// //       const legBIdx = path[i + 1];
// //       const children = graph.connections[legAIdx];
// //       const childIdx = children.indexOf(legBIdx);
// //       if (childIdx === -1) {
// //         throw new Error("Imposible");
// //       }
// //       const w = graph.weights[legAIdx][childIdx];
// //       result += w;
// //       return result;
// //     }
// //   };
// //   return {
// //     byLabel,
// //     byIndex
// //   };
// // };

// // const walk = (start, goal, graph) => {
// //   const calc = calcPath(graph);
// //   let paths = [];
// //   let node = start;
// //   while (node !== goal) {
// //     // const c = graph.labels[node];
// //     const children = graph.connections[node];
// //     // const lengths = children.map(c => {
// //     //   return calc.byIndex([node, c]);
// //     // });

// //     console.log({ lengths });

// //     node = goal;
// //     // const weights = graph.weights[node];
// //     // let smallest = [Number.MAX_SAFE_INTEGER, -1];
// //     // weights.forEach((w, i) => {
// //     //   if (w < smallest[0]) {
// //     //     smallest = [w, i];
// //     //   }
// //     // });
// //     // path += smallest[0];
// //     // node = children[smallest[1]];
// //     // console.log(smallest);
// //   }
// // };

// // const work2 = (graph, node = 0, end = 0) => {
// //   const paths = [];
// //   const visited = {};

// //   const extend = (node = 0, end = 0, paths = [], visited = {}) => {
// //     visited[node] = true;
// //     if (node === end) {
// //       console.log(paths);
// //       visited[node] = false;
// //       return;
// //     }
// //     for (let i = 0; i < graph.connections[node].length; i++) {
// //       const element = graph.connections[node][i];
// //       if (!visited[element]) {
// //         paths.push(element);
// //         extend(element, end, paths, visited);
// //         paths.pop();
// //       }
// //     }
// //     visited[node] = false;
// //   };

// //   paths.push(node);
// //   extend(node, end, paths, visited);

// //   // const { byIndex } = calcPath(graph);
// //   // // let paths = {};
// //   // if (node === end) {
// //   //   return (path += "->" + node);
// //   // }
// //   // if (visited.includes(node)) {
// //   //   return "";
// //   // }
// //   // path += "->" + node;
// //   // const childrens = [...graph.connections[node]];
// //   // let i = 0;
// //   // while (i < childrens.length) {
// //   //   const child = childrens[i];
// //   //   return (path += extend(graph, child, end, "", [...visited, node]));
// //   // }
// //   // const c = childrens[0];
// //   // if (visites.includes(c)) {
// //   //   return [byIndex([...path, node])];
// //   // }
// //   // return extend(graph, childrens[0], end, [...path, node], [...visites, node]);
// //   // paths[node.toString()] = [...path, node];
// //   // while (queue.length > 0) {
// //   //   let child = queue.shift();
// //   //   calc([...path, ])
// //   //   //   paths
// //   //   //   if (visited.includes(child)) {
// //   //   //     continue;
// //   //   //   }
// //   //   //   paths.push(extend(graph, child, end, [...path, node], [...visited, node]));
// //   // }
// //   // return paths;
// // };

// // // const e = work2(graph, 0, 6, "*");

// // function buildPaths(graph) {
// //   function build(node, paths, visited) {
// //     if (node in visited) {
// //       return paths;
// //     } else {
// //       paths.push(graph.labels[node]);
// //     }

// //     const current = graph.connections[node];
// //     current.forEach(element => {
// //       paths.push(build(element, [graph.labels[node]], [node]));
// //     });

// //     return paths;
// //   }

// //   return build(0, [], []);
// // }

// // const paths = buildPaths(graph);

// // console.log(paths);

// // // main();
// // // walk(0, 6, graph);

// const graph = {
//   labels: ["START", "A", "B", "C", "D", "E", "GOAL"],
//   labelsToIdx: {
//     START: 0,
//     A: 1,
//     B: 2,
//     C: 3,
//     D: 4,
//     E: 5,
//     GOAL: 6
//   },
//   labelsToCoordinates: {
//     START: [0, 0],
//     A: [3, 0],
//     B: [3, 4],
//     C: [3, 8],
//     D: [0, 6],
//     E: [9, 8],
//     GOAL: [9, 4]
//   },
//   connections: [
//     [1, 2], // START
//     [0, 2, 4], // A
//     [0, 1, 3], // B
//     [2, 5], // C,
//     [1, 6], // D,
//     [3], // E,
//     [4] // GOAL,
//   ],
//   weights: [
//     [3, 5], // START
//     [3, 4, 3], // A
//     [5, 4, 4], // B
//     [4, 6], // C,
//     [3, 5], // D,
//     [6], // E,
//     [5] // GOAL,
//   ],
//   adjacentMap: [
//     [0, 1, 1, 0, 0, 0, 0], // START
//     [1, 0, 1, 0, 1, 0, 0], // A
//     [1, 1, 0, 1, 0, 0, 0], // B
//     [0, 0, 1, 0, 0, 1, 0], // C
//     [0, 1, 0, 0, 0, 0, 1], // D
//     [0, 0, 0, 1, 0, 0, 0], // E
//     [0, 0, 0, 0, 1, 0, 0] // GOAL
//   ],
//   weightsAdjacentMap: [
//     [null, 3, 5, null, null, null, null], // START
//     [3, null, 4, null, 1, null, null], // A
//     [5, 4, null, 4, null, null, null], // B
//     [null, null, 4, null, null, 6, null], // C
//     [null, 3, null, null, null, null, 5], // D
//     [null, null, null, 6, null, null, null], // E
//     [null, null, null, null, 5, null, null] // GOAL
//   ]
// };

// const dfs = graph => (start, goal, fn) => {
//   const visited = {};
//   let queue = [[start]];

//   while (queue.length > 0) {
//     const currentPath = queue.shift();
//     const currentNode = currentPath[currentPath.length - 1];
//     visited[currentNode] = true;
//     if (currentNode === goal) {
//       return currentPath;
//     }
//     const extensions = graph.connections[graph.labelsToIdx[currentNode]];
//     let localqueue = [];
//     extensions.forEach(element => {
//       if (!(graph.labels[element] in visited)) {
//         localqueue.push([...currentPath, graph.labels[element]]);
//       }
//     });
//     queue = [...localqueue, ...queue];
//     fn({ currentPath, queue });
//     console.log("----------------------------");
//   }
//   return queue;
// };

// const bfs = graph => (start, goal, fn) => {
//   const visited = {};
//   let queue = [[start]];

//   while (queue.length > 0) {
//     const currentPath = queue.shift();
//     const currentNode = currentPath[currentPath.length - 1];
//     visited[currentNode] = true;
//     if (currentNode === goal) {
//       return currentPath;
//     }
//     const extensions = graph.connections[graph.labelsToIdx[currentNode]];
//     extensions.forEach(element => {
//       if (!(graph.labels[element] in visited)) {
//         queue.push([...currentPath, graph.labels[element]]);
//       }
//     });
//     fn({ currentPath, queue });
//     console.log("----------------------------");
//   }
//   return queue;
// };

// const hillClimbing = graph => (start, goal, heuristic, fn) => {
//   const { reset, isCloser, isSame } = heuristic();
//   const visited = {};
//   let queue = [[start]];
//   while (queue.length > 0) {
//     const currentPath = queue.shift();
//     const currentNode = currentPath[currentPath.length - 1];
//     visited[currentNode] = true;
//     if (currentNode === goal) {
//       return currentPath;
//     }
//     const extensions = graph.connections[graph.labelsToIdx[currentNode]];
//     let nextClosest = [];
//     reset();
//     extensions.forEach(node => {
//       if (!(graph.labels[node] in visited)) {
//         if (isCloser(node)) {
//           nextClosest = [[...currentPath, graph.labels[node]]];
//         } else if (isSame(node)) {
//           nextClosest.push([...currentPath, graph.labels[node]]);
//         }
//       }
//     });
//     queue = [...nextClosest, ...queue];
//     fn({ currentPath, queue });
//     console.log("----------------------------");
//   }
//   return queue;
// };

// const measure = ((graph, goal) => () => {
//   const [_xg, _yg] = graph.labelsToCoordinates[goal];
//   let _measurement = Number.MAX_SAFE_INTEGER;
//   const _distance = node => {
//     const [x, y] = graph.labelsToCoordinates[graph.labels[node]];
//     return Math.sqrt((_xg - x) ** 2 + (_yg - y) ** 2);
//   };
//   const reset = () => {
//     _measurement = Number.MAX_SAFE_INTEGER;
//   };
//   const isCloser = node => {
//     const distance = _distance(node);
//     const result = distance < _measurement;
//     if (result) {
//       _measurement = distance;
//     }
//     return result;
//   };
//   const isSame = node => {
//     return _distance(node) === _measurement;
//   };

//   return { reset, isCloser, isSame };
// })(graph, "GOAL");

// // console.log(
// //   dfs(graph)("START", "GOAL", i => {
// //     console.log(i);
// //   })
// // );
// // console.log(
// //   hillClimbing(graph)("START", "GOAL", measure, i => {
// //     console.log(i);
// //   })
// // );
// // const pathBFS = bfs(graph)(i => {
// //   // console.log(i);
// // });

// // console.log(pathBFS);
// let v = null;
// const dfs2 = connections => {
//   return (start, goal, visited = {}) => {
//     let queue = [start];

//     // while (queue.length > 0) {
//     const currentPath = queue.shift();
//     const currentNode = currentPath[currentPath.length - 1];
//     visited[currentNode] = true;
//     if (currentNode === goal) {
//       return [currentPath, visited];
//     }
//     const extensions = connections[currentNode];
//     let localqueue = [];
//     extensions.forEach(element => {
//       if (!(element in visited)) {
//         localqueue.push([...currentPath, element]);
//       }
//     });
//     queue = [...localqueue, ...queue];
//     // }
//     return [localqueue[0], visited];
//   };
// };

// // const algo = dfs2(graph.connections);
// // const [step1, v1] = algo([0], 6, {});
// // console.log({ step1, v1 });
// // const [step2, v2] = algo(step1, 6, v1);
// // console.log({ step2, v2 });
// // const [step3, v3] = algo(step2, 6, v2);
// // console.log({ step3, v3 });

// const createTree = (node, depth = 0) => {
//   const nodesCount = Math.pow(2, depth + 1) - 1;
//   const nodes = Array(nodesCount)
//     .fill(0)
//     .map((_, i) => i);
//   let level = 0;
//   const tree = [];
//   const edges = [];
//   while (level <= depth) {
//     const count = Math.pow(2, level);
//     const startIndex = count - 1;
//     for (let i = 0; i < count; i++) {
//       tree.push([node + level, node + startIndex + i]);
//     }
//     if (level < depth) {
//       const slice = nodes.slice(startIndex, startIndex + count);
//       slice.forEach((element, i) => {
//         const value = node + element;
//         edges.push([value, value * 2 + 1], [value, value * 2 + 2]);
//       });
//     }
//     level++;
//   }
//   return [tree, edges];
// };

// console.log(createTree(0, 3));
