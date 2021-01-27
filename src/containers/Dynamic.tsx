import React, { Component } from 'react';
import * as d3 from 'd3';
import * as _ from 'lodash';

const cast = {
  girls: [
    'Alexandria',
    'Ashley',
    'Briana',
    'Ellie',
    'Jasmine',
    'Jenni',
    'Jessia',
    'Paris',
    'Shelby',
    'Tyler',
  ] as const,
  extra_girl: 'Christina' as const,
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
  ] as const,
};

type girl = typeof cast.girls[number];
type guy = typeof cast.guys[number];

type matchup = { girl: girl; guy: guy };

type truth_booth = { matchup: matchup; match: boolean };
const truth_booths: truth_booth[] = [
  { matchup: { girl: 'Jessia', guy: 'Brandon' }, match: false },
];

let matchups: { [key: string]: matchup[] } = {
  night_one: [
    { girl: 'Ellie', guy: 'Alex' },
    { girl: 'Jessia', guy: 'Anthony' },
    // { girl: 'Christina', guy: 'Brandon' },
    { girl: 'Briana', guy: 'Curtis' },
    { girl: 'Ashley', guy: 'Dario' },
    { girl: 'Alexandria', guy: 'Garland' },
    { girl: 'Jasmine', guy: 'John' },
    { girl: 'Jenni', guy: 'Layton' },
    { girl: 'Shelby', guy: 'Nate' },
    { girl: 'Paris', guy: 'Pratt' },
  ],
  night_two: [
    { girl: 'Jessia', guy: 'Layton' },
    { girl: 'Shelby', guy: 'Dario' },
    { girl: 'Paris', guy: 'Pratt' },
    { girl: 'Jasmine', guy: 'Garland' },
    { girl: 'Ashley', guy: 'John' },
    { girl: 'Tyler', guy: 'Brandon' },
    { girl: 'Ellie', guy: 'Alex' },
    // { girl: 'Christina', guy: 'Alex' },
    { girl: 'Alexandria', guy: 'Anthony' },
    { girl: 'Jenni', guy: 'Nate' },
    { girl: 'Briana', guy: 'Curtis' },
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

const append_label = (
  label: d3.Selection<d3.EnterElement, label_properties, SVGGElement, unknown>
) => {
  const center_x = ({ x, width }: label_properties) => x + width / 2;
  const center_y = ({ y, height }: label_properties) => y + height / 2;
  label
    .append('text')
    .classed('label', true)
    .attr('dx', center_x)
    .attr('dy', center_y)
    .attr('width', ({ width }) => width)
    .attr('height', ({ height }) => height)
    .text(({ label_contents }) => label_contents)
    .attr('transform', (label_properties) => {
      if (!_.isUndefined(label_properties.rotate)) {
        return `rotate(${label_properties.rotate}, ${center_x(
          label_properties
        )}, ${center_y(label_properties)})`;
      }
    });
};

type props = { path?: String };

class Dynamic extends Component<props, {}> {
  private chartRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    const overall_width = 1200;
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
      _.map(guys, (guy) => {
        const truth_booth: truth_booth | undefined = _.find(truth_booths, {
          matchup: { girl: girl.name, guy: guy.name },
        });
        let fill = 'green';

        if (!_.isUndefined(truth_booth)) {
          fill = truth_booth.match ? 'gold' : 'black';
        }

        return {
          x: girl.x,
          y: guy.y,
          width: row_width,
          height: row_height,
          fill,
          stroke: 'black',
        };
      })
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
      .call(append_label);

    svg
      .append('g')
      .attr('id', 'girl-labels')
      .selectAll('rect')
      .data(girl_labels)
      .enter()
      .each(append_rect)
      .call(append_label);
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
