import React, { useRef, useEffect, useState } from 'react';
// @ts-ignore
import d3 from 'd3';
import styled from 'styled-components';
import { AspectRatio, Box, Break, Button, Item } from '@avsync.live/formation';

interface Node {
  name: string;
  size?: number;
  children?: Node[];
  x?: number;
  y?: number;
  r?: number;
  parent?: Node;
  src?: string,
  onClick?: () => void;
}

interface Props {
  flareData: Node;
}

export const ZoomableHierarchyNavigator = ({ flareData }: Props) => {
  const containerRef = useRef<any>();
  const [breadcrumbs, setBreadcrumbs] = useState<Node[]>([])

  const [zoomLevel, setZoomLevel] = useState<number>(0)
  const [zoomFunction, setZoomFunction] = useState<((d: Node) => void) | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([flareData]);

  const depthCount = (branch: Node): number => {
    if (!branch.children) {
      return 1;
    }
    return 1 + d3.max(branch.children.map(depthCount))!;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const margin = 0,
      padding = 0,
      diameter = 550,
      root = flareData;

    const color = d3.scale
      .linear()
      .domain([0, depthCount(root)])
      .range(['#121212', '#343434'])
      .interpolate(d3.interpolateHcl);

      const pack = d3.layout
      .pack()
      .padding(padding)
      .size([diameter, diameter])
      .value((d: any) => d.size ?? 100);

    const svgExists = d3.select(containerRef.current).select('svg').size() > 0;
    if (svgExists) {
      d3.select(containerRef.current).select('svg').remove();
    }

    const svg = d3
      .select(containerRef.current)
      .append('svg')
      .attr('width', diameter)
      .attr('height', diameter)
      .append('g')
      .attr(
        'transform',
        'translate(' + diameter / 2 + ',' + diameter / 2 + ')'
      );

    let focus = root,
      nodes = pack.nodes(root);

    let view: any;

    const circle = svg
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', function (d: any) {
        return d.parent
          ? d.children
            ? 'node'
            : 'node node--leaf'
          : 'node node--root';
      })
      .style('fill', function (d: any) {
        return d.children ? color(d.depth) : null;
      })
      .on('click', function (d: any) {
         if (d.onClick) {
          d.onClick();
          d3.event.stopPropagation();
        }
        else if (focus !== d) {
          zoom(d);
          d3.event.stopPropagation();
        }
       
      });

    svg
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('class', 'label')
      .style('fill', '#eee')
      .style('display', function (d: any) {
          return d.depth !== 0 && d.depth <= 1 ? null : 'none';
      })
      .text(function (d: any) {
        return d.name;
      });

    const node = svg.selectAll('circle,text');

    d3.select(containerRef.current).on('click', function () {
      zoom(root);
    });

    const zoom = (d: Node): void => {
      const focus0 = focus;
      focus = d;
    
      // store the current focus node and its ancestors
      let selectedNodes: Node[] = [];
      let node: Node | undefined = focus;
      while (node) {
        selectedNodes.unshift(node);
        node = node.parent;
      }
    
      // update the selected nodes
      setSelectedNodes(selectedNodes);
    
      // derive the current zoom level based on the depth of the current focus node
      let zoomLevel = 0;
      if (focus.parent) {
        const parent = nodes.find((node : Node) => node.name === focus.parent?.name);
        if (parent) {
          zoomLevel = parent.depth + 1;
        }
      }
    
      // update the zoom level and the active node name
      setZoomLevel(zoomLevel);
    
      const transition = d3
        .transition()
        .duration(d3.event?.altKey ? 7500 : 750)
        .tween('zoom', () => {
          const i = d3.interpolateZoom(view, [
            focus.x!,
            focus.y!,
            focus.r! * 2 + margin,
          ]);
          return (t: number) => {
            zoomTo(i(t));
          };
        });
    
      transition
        .selectAll('text')
        .filter(function (d: Node) {
          // @ts-ignore
          return d.parent === focus || this.style.display === 'inline';
        })
        .style('fill-opacity', (d: Node) => {
          return d.parent === focus ? 1 : 0;
        })
        .each('start', function (d: Node) {
          // @ts-ignore
          if (d.parent === focus) this.style.display = 'inline';
        })
        .each('end', function (d: Node) {
          // @ts-ignore
          if (d.parent !== focus) this.style.display = 'none';
        });
    };

    const zoomTo = (v: [number, number, number]): void => {
      const k = diameter / v[2];
      view = v;
      node.attr('transform', (d: Node) => {
        return `translate(${(d.x! - v[0]) * k},${(d.y! - v[1]) * k})`;
      });
      circle.attr('r', (d: Node) => {
        return d.r! * k;
      });
    };

    zoomTo([root.x ?? 0, root.y ?? 0, (root.r ?? 0) * 2 + margin]);

    setZoomFunction(() => zoom);
  }, []);

  return (
    <Box wrap>
      <Box pb={.5}>
      {
        selectedNodes.map((node, index) => <>
          <>{index !== 0 && '>'}</>
         <Button
         
            text={node.name}
            minimal
            onClick={() => {
              if (zoomFunction) {
                zoomFunction(node);
              }
            }}
          />
        </>
         
        )
      }
       
      </Box>
      <Break />
      <Container ref={containerRef}>
      </Container>
    </Box>
  );
};

const Container = styled.div`
  display: flex;
  border-radius: 100%;
  overflow: hidden;
  .node {
    cursor: pointer;
    stroke: rgba(0,0,0,0);
    transition: stroke .3s;
  }

  .node:hover {
    stroke: var(--F_Font_Color_Disabled);
    stroke-width: 1.5px;
  }

  .node--leaf {
    fill: var(--F_Surface_1);
  }

  .node--leaf {
    fill: var(--F_Surface_1);
  }

  .label {
    text-anchor: middle;
    text-shadow: 0 1.5px 0 #000, 1.5px 0 0 #000, -1.5px 0 0 #000, 0 -1.5px 0 #000;
  }

  .label,
  .node--root,
  .node--leaf {
    pointer-events: none;
  }
`;
