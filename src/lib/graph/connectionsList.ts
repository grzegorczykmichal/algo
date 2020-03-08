const fromEdgeList = (nodeCount: number, edgeList: number[][]) => {
  const connectionsList = Array(nodeCount);

  edgeList.forEach(([l1, l2]) => {
    connectionsList[l1] = [...(connectionsList[l1] || []), l2];
    connectionsList[l2] = [...(connectionsList[l2] || []), l1];
  });

  return connectionsList;
};

export const ConnectionsList = { fromEdgeList };
