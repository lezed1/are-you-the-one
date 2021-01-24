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

type props = { path?: String };

class Dynamic extends Component<props, {}> {
  private chartRef = React.createRef<HTMLDivElement>();

  // constructor(props: props) {
  //   super(props);
  // }

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

    const girls = _.map(cast.girls, (girl, girl_idx) => {
      return { name: girl, x: text_width + girl_idx * row_width };
    });
    const guys = _.map(cast.guys, (guy, guy_idx) => {
      return { name: guy, y: text_width + guy_idx * row_height };
    });

    const guy_labels = _.map(guys, (guy) => {
      return { x: 0, y: guy.y, width: text_width, height: row_height };
    });
    const girl_labels = _.map(girls, (girl) => {
      return { x: girl.x, y: 0, width: row_width, height: text_width };
    });

    const squares = _.flatMap(girls, (girl, girl_idx) => {
      return _.map(guys, (guy, guy_idx) => {
        return { x: girl.x, y: guy.y, width: row_width, height: row_height };
      });
    });

    const svg = d3
      .select(this.chartRef.current)
      .append('svg')
      .attr('width', overall_width)
      .attr('height', overall_height)
      .style('margin-left', 100);

    svg
      .append('g')
      .selectAll('rect')
      .data(squares)
      .enter()
      .append('rect')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y)
      .attr('width', (d) => d.width)
      .attr('height', (d, _i) => d.height)
      .attr('fill', 'green')
      .attr('stroke', 'black');

    svg
      .append('g')
      .selectAll('rect')
      .data(guy_labels)
      .enter()
      .append('rect')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y)
      .attr('width', (d) => d.width)
      .attr('height', (d, _i) => d.height)
      .attr('fill', 'blue')
      .attr('stroke', 'black');

    svg
      .append('g')
      .selectAll('rect')
      .data(girl_labels)
      .enter()
      .append('rect')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y)
      .attr('width', (d) => d.width)
      .attr('height', (d, _i) => d.height)
      .attr('fill', 'pink')
      .attr('stroke', 'black');
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
