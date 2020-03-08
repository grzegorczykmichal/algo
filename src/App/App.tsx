import React, {
  useState,
  useEffect,
  createRef,
  useRef,
  useMemo,
  useCallback
} from "react";
import Konva from "konva";
import { Stage, Layer, Circle, Line } from "react-konva";

import "./App.css";

import { EnqueuedList } from "./components";
import { KonvaEventObject } from "konva/types/Node";

import { AdjacencyMatrix, ConnectionsList } from "../lib/graph";

const _2to1 = (size: number) => ([x, y]: number[]) => size * x + y;

enum ACTIONS {
  MOVE,
  ADD,
  CONNECT,
  SET_START,
  SET_END
}

enum PRESETS {
  MIT,
  GRID,
  BINARY_TREE
}

export const App = () => {
  const [start, setStart] = useState(0);
  const [goal, setGoal] = useState(6);
  const [visited, setVisited] = useState<Visited>({});
  const [queue, setQueue] = useState<number[][]>([]);
  const [preset, setPreset] = useState<number | null>(null);
  const [gridSize, setGridSize] = useState(10);
  const [treeDeepth, setTreeDeepth] = useState(3);
  const [action, setAction] = useState(ACTIONS.MOVE);
  const [speed] = useState(100);

  const [nodeGhostCoordinates, setNodeGhostCoordinates] = useState<
    number[] | null
  >(null);

  const [newEdge, setNewEdge] = useState<number[]>([]);

  const [leg1, setLeg1] = useState<number | null>(null);
  const [leg2, setLeg2] = useState<number | null>(null);

  const [nodes, setNodes] = useState<number[][]>([]);

  const [edgeList, setEdgeList] = useState<number[][]>([]);

  const connectionsList: number[][] = useMemo(
    () => ConnectionsList.fromEdgeList(nodes.length, edgeList),
    [nodes, edgeList]
  );
  const adjacencyList = useMemo(
    () => AdjacencyMatrix.fromEdgeList(nodes.length, edgeList),
    [nodes, edgeList]
  );

  useEffect(() => {
    if (preset === PRESETS.MIT) {
      setNodes([
        [1, 1],
        [4, 1],
        [4, 5],
        [4, 9],
        [7, 1],
        [10, 9],
        [10, 5]
      ]);
      setEdgeList([
        [0, 1],
        [0, 2],
        [1, 2],
        [1, 4],
        [2, 3],
        [3, 5],
        [4, 6]
      ]);
    }
    if (preset === PRESETS.GRID) {
      let grid: number[][] = [];
      let edges: number[][] = [];
      const to1D = _2to1(gridSize);
      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          grid.push([(x + 1) * 1.5, (y + 1) * 1.5]);
          if (x + 1 < gridSize) {
            edges.push([to1D([x, y]), to1D([x + 1, y])]);
          }
          if (y + 1 < gridSize) {
            edges.push([to1D([x, y]), to1D([x, y + 1])]);
          }
        }
      }
      setNodes(grid);
      setEdgeList(edges);
    }
    if (preset === PRESETS.BINARY_TREE) {
      const createTree = (node = 0, depth = 0) => {
        const nodesCount = Math.pow(2, depth + 1) - 1;
        const nodes = Array(nodesCount)
          .fill(0)
          .map((_, i) => i);
        let level = 0;
        const tree: number[][] = [];
        const edges: number[][] = [];
        while (level <= depth) {
          const count = Math.pow(2, level);
          const startIndex = count - 1;
          for (let i = 0; i < count; i++) {
            const parts = Math.sqrt(nodesCount * depth * 2) / (count + 1);
            tree.push([parts + parts * i, 1 + level + level * Math.log(depth)]);
          }
          if (level < depth) {
            const slice = nodes.slice(startIndex, startIndex + count);
            slice.forEach((element, i) => {
              const value = element;
              edges.push([value, value * 2 + 1], [value, value * 2 + 2]);
            });
          }
          level++;
        }
        return [tree, edges];
      };
      const [tree, edges] = createTree(1, treeDeepth);
      setNodes(tree);
      setEdgeList(edges);
    }
  }, [preset, gridSize, treeDeepth]);

  useEffect(() => {
    setQueue([[start]]);
  }, [start]);

  useEffect(() => {
    if (newEdge.length === 2) {
      const edge = [...newEdge];
      setEdgeList(prev => {
        return [...prev, edge];
      });
      setNewEdge([]);
    }
  }, [newEdge]);

  const memoNext = useCallback(() => {
    const next = () => {
      const q = queue.length === 0 ? [[start]] : [...queue];
      const currentPath = q.shift();
      if (currentPath === undefined) {
        return [[], visited];
      }
      const currentNode = currentPath[currentPath.length - 1];
      visited[currentNode] = true;
      if (currentNode === goal) {
        return [currentPath, visited];
      }
      const extensions = connectionsList[currentNode];
      if (extensions === undefined) {
        return [[], visited];
      }
      let localqueue: number[][] = [];
      extensions.forEach(node => {
        if (!(node in visited)) {
          localqueue.push([...currentPath, node]);
        }
      });
      setVisited(visited);
      setQueue([...localqueue, ...q]);
    };
    next();
  }, [queue, connectionsList, goal, start, visited]);

  const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
    if (action !== ACTIONS.MOVE) {
      return;
    }
    e.target.setAttrs({
      shadowOffset: {
        x: 9,
        y: 9
      },
      scaleX: 1.3,
      scaleY: 1.3,
      shadowBlur: 2,
      duration: 0.5,
      shadowColor: "#444",
      easing: Konva.Easings.ElasticEaseOut
    });
  };
  const handleDragMove = (i: number) => (e: KonvaEventObject<DragEvent>) => {
    if (action !== ACTIONS.MOVE) {
      return;
    }
    const scale = 50;
    setNodes(prev => {
      const newCoords = [...prev];
      const newNodeCoords = [
        e.target.attrs.x / scale,
        e.target.attrs.y / scale
      ];
      newCoords.splice(i, 1, newNodeCoords);
      return newCoords;
    });
  };
  const handleDragEnd = (i: number) => (e: KonvaEventObject<DragEvent>) => {
    if (action !== ACTIONS.MOVE) {
      return;
    }
    const scale = 50;
    setNodes(prev => {
      const newCoords = [...prev];
      const newNodeCoords = [
        e.target.attrs.x / scale,
        e.target.attrs.y / scale
      ];
      newCoords.splice(i, 1, newNodeCoords);
      return newCoords;
    });
    e.target.to({
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1,
      shadowOffsetX: 3,
      shadowOffsetY: 3,
      shadowBlur: 0,
      shadowColor: "#000"
    });
  };
  const onLayerClick = (e: KonvaEventObject<MouseEvent>) => {
    if (action !== ACTIONS.ADD) {
      return;
    }
    const scale = 50;
    const position = stageRef.current?.getStage().getPointerPosition();
    if (position === undefined) {
      return;
    }
    const x = position?.x || 0;
    const y = position?.y || 0;
    setNodes(prev => {
      const newNode = [x / scale, y / scale];
      return [...prev, newNode];
    });
  };

  const handelMouseEnter = (i: number, x: number, y: number) => (
    e: KonvaEventObject<MouseEvent>
  ) => {
    if (action !== ACTIONS.CONNECT) {
      return;
    }
    if (leg1 === null) {
      return;
    }
    if (adjacencyList[leg1][i] === 1) {
      return;
    }
    setLeg2(i);
  };

  const handelMouseOut = (i: number, x: number, y: number) => (
    e: KonvaEventObject<MouseEvent>
  ) => {
    if (action !== ACTIONS.CONNECT) {
      return;
    }
    if (leg1 === null) {
      return;
    }
    setLeg2(null);
  };

  const onLayerMouseMove = (e: any) => {
    if (action !== ACTIONS.ADD) {
      return;
    }
    const position = stageRef.current?.getStage().getPointerPosition();
    if (position === undefined) {
      return;
    }
    const x = position?.x || 0;
    const y = position?.y || 0;
    setNodeGhostCoordinates([x, y]);
  };

  const onCircleClick = (i: number) => (e: KonvaEventObject<MouseEvent>) => {
    if (action === ACTIONS.SET_START) {
      setStart(i);
      return;
    }
    if (action === ACTIONS.SET_END) {
      setGoal(i);
      return;
    }
    if (action === ACTIONS.CONNECT) {
      if (leg1 === null) {
        setLeg1(i);
        return;
      }

      if (leg1 !== null && leg2 !== null) {
        setEdgeList(prev => {
          return [...prev, [leg1, leg2]];
        });
        setLeg1(null);
        setLeg2(null);
      }
    }
  };

  const reset = () => {
    setAction(0);
    setNodeGhostCoordinates(null);
    setNewEdge([]);
    setStart(start);
    setQueue([]);
    setGoal(goal);
    setVisited({});
    setIsPlaying(false);
  };

  const currentPath = queue.length !== 0 ? queue[0] : [];
  const currentNode =
    currentPath.length !== 0 ? currentPath[currentPath.length - 1] : null;
  let currentPathConnections: { [key in string]: Boolean } = {};
  if (Array.isArray(currentPath)) {
    for (let i = 0; i < currentPath.length; i++) {
      if (i === currentPath.length - 1) {
        continue;
      }
      const current = currentPath[i];
      const next = currentPath[i + 1];
      currentPathConnections[`${current},${next}`] = true;
    }
  }

  const [isPlaying, setIsPlaying] = useState(false);

  const stageRef = createRef<Stage>();

  const savedCallback = useRef<typeof memoNext>();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = memoNext;
  }, [memoNext]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (isPlaying && currentNode !== goal) {
      let id = setInterval(tick, speed);
      return () => clearInterval(id);
    }
  }, [isPlaying, speed, currentNode, goal]);

  const [lineToDelete, setLineToDelete] = useState("");

  const onLineEnter = (edge: number[]) => () => {
    setLineToDelete(`${edge[0]},${edge[1]}`);
  };
  const onLineOut = () => () => {
    setLineToDelete("");
  };
  const onLineClick = (edge: number[]) => () => {
    const newMatrix = AdjacencyMatrix.removeEdge(adjacencyList, edge);
    setEdgeList(AdjacencyMatrix.toEdgeList(newMatrix));
  };

  return (
    <div className="App">
      <div
        style={{
          position: "fixed",
          width: "20vw",
          right: "0",
          top: "0",
          height: "100vh",
          borderLeft: "1px solid gray",
          padding: "1rem"
        }}
      >
        <h1>{currentNode === goal ? currentPath : " - "}</h1>
        <EnqueuedList<number> list={queue} />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ alignSelf: "stretch" }}>
          <button
            style={{ height: "100%", marginRight: "1rem" }}
            onClick={() => reset()}
          >
            Reset
          </button>
        </div>
        <div>
          <div style={{ display: "flex" }}>
            <button
              disabled={isPlaying}
              onClick={() => {
                setIsPlaying(true);
              }}
            >
              Play
            </button>
            <button
              disabled={!isPlaying}
              onClick={() => {
                setIsPlaying(false);
              }}
            >
              Stop
            </button>
            <button onClick={() => memoNext()}>Next</button>
          </div>

          <div style={{ display: "flex" }}>
            <button
              onClick={() => {
                setAction(ACTIONS.MOVE);
                setNodeGhostCoordinates(null);
                setNewEdge([]);
              }}
            >
              Move {action === ACTIONS.MOVE ? "*" : ""}
            </button>

            <button
              onClick={() => {
                setAction(ACTIONS.SET_START);
                setNodeGhostCoordinates(null);
                setNewEdge([]);
              }}
            >
              Set Start {action === ACTIONS.SET_START ? "*" : ""}
            </button>
            <button
              onClick={() => {
                setAction(ACTIONS.SET_END);
                setNodeGhostCoordinates(null);
                setNewEdge([]);
              }}
            >
              Set End {action === ACTIONS.SET_END ? "*" : ""}
            </button>
          </div>
          <div style={{ display: "flex" }}>
            <button
              onClick={() => {
                setAction(ACTIONS.ADD);
                setNewEdge([]);
              }}
            >
              Add Node {action === ACTIONS.ADD ? "*" : ""}
            </button>
            <button
              onClick={() => {
                setAction(ACTIONS.CONNECT);
                setNodeGhostCoordinates(null);
              }}
            >
              Connect {action === ACTIONS.CONNECT ? "*" : ""}
            </button>

            <button
              onClick={() => {
                setEdgeList(
                  AdjacencyMatrix.toEdgeList(
                    AdjacencyMatrix.connectAll(adjacencyList)
                  )
                );
              }}
            >
              Connect all
            </button>
            <button
              onClick={() => {
                setEdgeList(
                  AdjacencyMatrix.toEdgeList(
                    AdjacencyMatrix.disconnectAll(adjacencyList)
                  )
                );
              }}
            >
              Disconnect all
            </button>
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <label>
            Select preset{" "}
            <select
              defaultValue={-1}
              onChange={e => {
                setPreset(Number.parseInt(e.target.value));
              }}
            >
              <option value={-1} disabled>
                -
              </option>
              <option value={PRESETS.MIT}>MIT Lecture</option>
              <option value={PRESETS.GRID}>Grid</option>
              <option value={PRESETS.BINARY_TREE}>Binray Tree</option>
            </select>
          </label>
          {preset === PRESETS.GRID && (
            <label>
              Select grid size{" "}
              <select
                defaultValue={gridSize}
                onChange={e => {
                  setGridSize(Number.parseInt(e.target.value));
                }}
              >
                <option value={undefined} disabled>
                  -
                </option>
                {Array(6)
                  .fill(0)
                  .map((_, t) => {
                    return (
                      <option key={t} value={t + 5}>
                        {t + 5}
                      </option>
                    );
                  })}
              </select>
            </label>
          )}

          {preset === PRESETS.BINARY_TREE && (
            <label>
              Select tree depth{" "}
              <select
                defaultValue={treeDeepth}
                onChange={e => {
                  setTreeDeepth(Number.parseInt(e.target.value));
                }}
              >
                <option value={undefined} disabled>
                  -
                </option>
                {Array(6)
                  .fill(0)
                  .map((_, t) => {
                    return (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    );
                  })}
              </select>
            </label>
          )}
        </div>
      </div>
      <div>
        <Stage
          ref={stageRef}
          onClick={onLayerClick}
          onMouseMove={onLayerMouseMove}
          width={window.innerWidth}
          height={window.innerHeight}
        >
          {nodeGhostCoordinates && (
            <Layer>
              <Circle
                x={nodeGhostCoordinates[0]}
                y={nodeGhostCoordinates[1]}
                radius={20}
                fill={"gray"}
                opacity={0.2}
              />
            </Layer>
          )}
          {leg1 !== null && leg2 !== null && (
            <Layer>
              <Line
                points={[
                  nodes[leg1][0] * 50,
                  nodes[leg1][1] * 50,
                  nodes[leg2][0] * 50,
                  nodes[leg2][1] * 50
                ]}
                // dashEnabled={}
                dash={[2, 2]}
                stroke={"gray"}
              />
            </Layer>
          )}
          <Layer>
            {edgeList.map((edge, i) => {
              const [p1, p2] = edge;
              const [p1x, p1y] = nodes[p1];
              const [p2x, p2y] = nodes[p2];
              const scale = 50;
              const isInTheCurrentpath =
                `${p1},${p2}` in currentPathConnections ||
                `${p2},${p1}` in currentPathConnections;
              const isPreselected =
                `${p1},${p2}` === lineToDelete ||
                `${p2},${p1}` === lineToDelete;
              const stroke = isPreselected
                ? "blue"
                : isInTheCurrentpath
                ? "red"
                : "gray";
              const width = isInTheCurrentpath ? 4 : 1;
              // const style = isInTheCurrentpath ? 4 : 1;
              return (
                <Line
                  key={i}
                  points={[p1x * scale, p1y * scale, p2x * scale, p2y * scale]}
                  stroke={stroke}
                  strokeWidth={width}
                  onMouseEnter={onLineEnter(edge)}
                  onMouseOut={onLineOut()}
                  onClick={onLineClick(edge)}
                  hitStrokeWidth={10}
                  dashOffset={10}
                  dash={[5, 5]}
                  dashEnabled={!isInTheCurrentpath}
                />
              );
            })}
          </Layer>
          <Layer>
            {nodes.map((node, i) => {
              const [x, y] = node;
              const scale = 50;
              const radius = 20;
              let fill = i === currentNode ? "yellow" : "#F4F4F4";
              fill = i === start ? "green" : i === goal ? "blue" : fill;
              const stroke = leg1 === i ? "black" : undefined;
              return (
                <Circle
                  key={i}
                  onClick={onCircleClick(i)}
                  // onDblClick={() => setGoal(i)}
                  x={x * scale}
                  y={y * scale}
                  radius={radius}
                  fill={fill}
                  stroke={stroke}
                  shadowOffsetX={3}
                  shadowOffsetY={3}
                  draggable={action === 0}
                  onDragStart={handleDragStart}
                  onDragMove={handleDragMove(i)}
                  onDragEnd={handleDragEnd(i)}
                  onMouseEnter={handelMouseEnter(i, x, y)}
                  onMouseOut={handelMouseOut(i, x, y)}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

type Visited = {
  [key in number]: boolean;
};
