import React, { useEffect, useState, useRef } from "react";
import G6, { Graph, INode, StateStyles } from "@antv/g6";
import { SimpleDialog } from "./SimpleDialog";

export const GraphVisualization = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<metaType | null>(null);
  
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    setSelectedValue(null);
  };
  
  
  useEffect(() => {
    let graph: Graph | null = null;
    if (!graph) {
      const minimap = new G6.Minimap();

      graph = new G6.Graph({
        container: ref.current as HTMLDivElement | string,
        width: 800,
        height: 1000,
        modes: {
          default: ["drag-canvas", "drag-node", "zoom-canvas"],
        },
        plugins: [minimap],
        animate: true,
        defaultNode: {
          style: {
            lineWidth: 2,
            stroke: COLORS.gray100,
            fill: COLORS.gray100,
            cursor: "grab"
          },
          labelCfg: {
            position: 'bottom',
            offset: 10,
            style: {
                fill: COLORS.gray100
            }
        },
        defaultEdge: {
          size: 1,
          color: COLORS.gray100,
        },
        layout: {
          type: "fruchterman",
          gpuEnabled: true,
          workerEnabled: true,
          clustering: true,
          gravity: 20,
          speed: 2,
        },
        nodeStateStyles: {
          hover: {
            cursor: "grab",
            stroke: COLORS.babyblue,
            lineWidth: 2,
          },
        },
      }
      });
    }
    const nodes = data.nodes;

    nodes.forEach(
      (node) => {
        switch (node.cluster) {
          case "b": {
            node.size = 40;
            node.style = {
              fill: COLORS.violet,
            };
            break;
          }
          case "c": {
            node.size = 30;
            node.style = {
              fill:  COLORS.violet100,
            };
            break;
          }
        }
      }
    );

    graph.data(data);
    graph.render();

    graph.on("node:mouseenter", (evt) => graph?.setItemState(evt.item as INode, "hover", true));
    graph.on("node:mouseleave", (evt) => graph?.setItemState(evt.item as INode, "hover", false));

    graph.on("node:click", (evt) => {
      const item = evt.item?.getModel().meta as metaType
      if (item) {
        setSelectedValue(item)
        handleClickOpen()
      }
    });


  }, []);


  return <div ref={ref}>
    <SimpleDialog open={open} onClose={handleClose}>
      <li>{selectedValue?.createdBy}</li>
      <li>{selectedValue?.createdAt}</li>
      <li>{selectedValue?.updatedAt}</li>
    </SimpleDialog>
  </div>;
};

const COLORS = {
  gray100: "#e2e2e2",
  babyblue: "#0089e4",
  violet: "#7a6ae6",
  violet100: "#5549a0"
}

type metaType = {
    createdAt: number;
    updatedAt: string;
    createdBy: string;
}

type NodesType = {
  id: string;
  label: string;
  cluster: string;
  size: number;
  meta: metaType
} & StateStyles

const data = {
  nodes: [
    {
      id: "0",
      label: "TypeScript",
      cluster: "b",
      meta: {
        createdAt: Date.now(),
        updatedAt: '2020/21/2',
        createdBy: 'mohamed'
      }
    },
    {
      id: "1",
      label: "JavaScript",
      cluster: "a",
      meta: {
        createdAt: Date.now(),
        updatedAt: '2020/21/2',
        createdBy: 'mohamed'
      }
    },
    {
      id: "2",
      label: "Haskell",
      cluster: "a",
      meta: {
        createdAt: Date.now(),
        updatedAt: '2020/21/2',
        createdBy: 'mohamed'
      }
    },
    {
      id: "3",
      label: "JAVA",
      cluster: "a",
      meta: {
        createdAt: Date.now(),
        updatedAt: '2020/21/2',
        createdBy: 'mohamed'
      }
    },
    {
      id: "4",
      label: "FORTAN",
      cluster: "a",
      meta: {
        createdAt: Date.now(),
        updatedAt: '2020/21/2',
        createdBy: 'mohamed'
      }
    },
    {
      id: "5",
      label: "LISP",
      cluster: "a",
      meta: {
        createdAt: Date.now(),
        updatedAt: '2020/21/2',
        createdBy: 'mohamed'
      }
    },
    {
      id: "6",
      label: "C#",
      cluster: "c",
      meta: {
        createdAt: Date.now(),
        updatedAt: '2020/21/2',
        createdBy: 'mohamed'
      }
    },
    {
      id: "7",
      label: "Ruby",
      cluster: "a",
      meta: {
        createdAt: Date.now(),
        updatedAt: '2020/21/2',
        createdBy: 'mohamed'
      }
    },
    {
      id: "8",
      label: "PHP",
      cluster: "a",
      meta: {
        createdAt: Date.now(),
        updatedAt: '2020/21/2',
        createdBy: 'mohamed'
      }
    },
    {
      id: "9",
      label: "GO",
      cluster: "a",
      meta: {
        createdAt: Date.now(),
        updatedAt: '2020/21/2',
        createdBy: 'Ahmed'
      }
    },
  ] as NodesType[],
  edges: [
    {
      source: "0",
      target: "1",
    },
    {
      source: "0",
      target: "2",
    },
    {
      source: "0",
      target: "3",
    },
    {
      source: "0",
      target: "4",
    },
    {
      source: "0",
      target: "5",
    },
    {
      source: "0",
      target: "7",
    },
    {
      source: "0",
      target: "8",
    },
    {
      source: "0",
      target: "9",
    },
    {
      source: "0",
      target: "10",
    },
    {
      source: "0",
      target: "11",
    },
    {
      source: "0",
      target: "13",
    },
    {
      source: "0",
      target: "14",
    },
    {
      source: "0",
      target: "15",
    },
    {
      source: "0",
      target: "16",
    },
    {
      source: "2",
      target: "3",
    },
    {
      source: "4",
      target: "5",
    },
    {
      source: "4",
      target: "6",
    },
    {
      source: "5",
      target: "6",
    },
    {
      source: "7",
      target: "13",
    },
    {
      source: "8",
      target: "14",
    },
    {
      source: "9",
      target: "10",
    },
    {
      source: "10",
      target: "22",
    },
    {
      source: "10",
      target: "14",
    },
    {
      source: "10",
      target: "12",
    },
    {
      source: "10",
      target: "24",
    },
    {
      source: "10",
      target: "21",
    },
    {
      source: "10",
      target: "20",
    },
    {
      source: "11",
      target: "24",
    },
    {
      source: "11",
      target: "22",
    },
    {
      source: "11",
      target: "14",
    },
  ],
};
