import React, { Component } from 'react';
import * as d3 from 'd3';
import * as _ from 'lodash';

const cast = {
  girls: [
    'Alexandria',
    'Ashlet',
    'Briana',
    'Ellie',
    'Jasmine',
    'Jenni',
    'Jessia',
    'Paris',
    'Shelby',
    'Tyler',
  ],
  extra_girl: 'Christina',
  guys: [
    'Alex',
    'Anthony',
    'Brandon',
    'Curtis',
    'Dario',
    'Garland',
    'John',
    'Layton',
    'Nate',
    'Pratt',
  ],
};

type rect_properties = {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke?: string;
};

function append_rect(
  this: SVGElement,
  { x, y, width, height, fill, stroke }: rect_properties
) {
  const rect = d3.select(this).append('rect');
  rect
    .attr('x', x)
    .attr('y', y)
    .attr('width', width)
    .attr('height', height)
    .attr('fill', fill);
  if (!_.isUndefined(stroke)) {
    rect.attr('stroke', stroke);
  }
}

type label_properties = {
  x: number;
  y: number;
  width: number;
  height: number;
  label_contents: string;
  rotate?: number;
};

function append_label(
  this: SVGElement,
  { x, y, width, height, label_contents, rotate }: label_properties
) {
  const center_x = x + width / 2;
  const center_y = y + height / 2;
  const label_element = d3
    .select(this)
    .append('text')
    .classed('label', true)
    .attr('dx', center_x)
    .attr('dy', center_y)
    .attr('width', width)
    .attr('height', height)
    .text(label_contents);
  if (!_.isUndefined(rotate)) {
    label_element.attr(
      'transform',
      `rotate(${rotate}, ${center_x}, ${center_y})`
    );
  }
}

type props = { path?: String };

class Dynamic extends Component<props, {}> {
  private chartRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    const overall_width = 1000;
    const overall_height = 1000;

    const text_width = 200;

    const grid_width = overall_width - text_width;
    const grid_height = overall_height - text_width;

    const row_width = grid_width / cast.girls.length;
    const row_height = grid_height / cast.guys.length;

    const girls = _.map(cast.girls, (girl, girl_idx) => ({
      name: girl,
      x: text_width + girl_idx * row_width,
    }));
    const guys = _.map(cast.guys, (guy, guy_idx) => ({
      name: guy,
      y: text_width + guy_idx * row_height,
    }));

    const guy_labels = _.map(guys, (guy) => ({
      x: 0,
      y: guy.y,
      width: text_width,
      height: row_height,
      fill: 'blue',
      stroke: 'black',
      label_contents: guy.name,
    }));
    const girl_labels = _.map(girls, (girl) => ({
      x: girl.x,
      y: 0,
      width: row_width,
      height: text_width,
      fill: 'pink',
      stroke: 'black',
      label_contents: girl.name,
      rotate: -90,
    }));

    const squares: rect_properties[] = _.flatMap(girls, (girl) =>
      _.map(guys, (guy) => ({
        x: girl.x,
        y: guy.y,
        width: row_width,
        height: row_height,
        fill: 'green',
        stroke: 'black',
      }))
    );

    const svg = d3
      .select(this.chartRef.current)
      .append('svg')
      .attr('width', overall_width)
      .attr('height', overall_height)
      .style('margin-left', 100);

    svg
      .append('g')
      .attr('id', 'grid')
      .selectAll('rect')
      .data(squares)
      .enter()
      .each(append_rect);

    svg
      .append('g')
      .attr('id', 'guy-labels')
      .selectAll('rect')
      .data(guy_labels)
      .enter()
      .each(append_rect)
      .each(append_label);

    svg
      .append('g')
      .attr('id', 'girl-labels')
      .selectAll('rect')
      .data(girl_labels)
      .enter()
      .each(append_rect)
      .each(append_label);
  }

  render() {
    return (
      <div>
        <pre>{JSON.stringify(cast)}</pre>
        <div ref={this.chartRef}></div>
      </div>
    );
  }
}
export default Dynamic;
