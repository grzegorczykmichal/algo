import React from "react";

interface Props<TData> {
  list: number[][];
  labels?: string[];
}

const LABELS: string[] = ["S", "A", "B", "C", "D", "E", "G"];

function EnqueuedList<T>({ list, labels = LABELS }: Props<T>) {
  return (
    <div>
      {list.map((groups, i) => (
        <span key={i}>
          (
          {groups
            .map(i => {
              if (labels[i] !== undefined) return labels[i];
              return i;
            })
            .join(" ")}
          )
        </span>
      ))}
    </div>
  );
}

export { EnqueuedList };
