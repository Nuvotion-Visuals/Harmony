import React, { useRef, useEffect } from 'react';
// @ts-ignore
import d3 from 'd3';
import styled from 'styled-components';

interface Node {
  name: string;
  size?: number;
  children?: Node[];
  x?: number;
  y?: number;
  r?: number;
  parent?: Node;
}

interface Props {
  flareData: Node;
}

export const ZoomableHierarchyNavigator = ({ flareData }: Props) => {
  const containerRef = useRef<any>();

  const depthCount = (branch: Node): number => {
    if (!branch.children) {
      return 1;
    }
    return 1 + d3.max(branch.children.map(depthCount))!;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const margin = 20,
      padding = 2,
      diameter = 650,
      root = flareData;

    const color = d3.scale
      .linear()
      .domain([0, depthCount(root)])
      .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
      .interpolate(d3.interpolateHcl);

    const pack = d3.layout
      .pack()
      .padding(padding)
      .size([diameter, diameter])
      .value(() => 100);

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
        if (focus !== d) zoom(d), d3.event.stopPropagation();
      });

    svg
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('class', 'label')
      .style('fill-opacity', function (d: any) {
        return d.parent === root ? 1 : 0;
      })
      .style('display', function (d: any) {
        return d.parent === root ? null : 'none';
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

      const transition = d3
        .transition()
        .duration(d3.event.altKey ? 7500 : 750)
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
  }, []);

  return <Container ref={containerRef}></Container>;
};

const Container = styled.div`
  .node {
    cursor: pointer;
  }

  .node:hover {
    stroke: #000;
    stroke-width: 1.5px;
  }

  .node--leaf {
    fill: white;
  }

  .label {
    text-anchor: middle;
    text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff;
  }

  .label,
  .node--root,
  .node--leaf {
    pointer-events: none;
  }
`;
