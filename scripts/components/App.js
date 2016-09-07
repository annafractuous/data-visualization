import React from 'react';
import autobind from 'autobind-decorator';
import Rebase from 're-base';
var base = Rebase.createClass('https://data-viz.firebaseio.com/');

@autobind
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      hsOfferings: {},
      hsDemographics: {}
    }
  }

  componentDidMount() {
    base.bindToState('hsOfferings', {
      context: this,
      state: 'hsOfferings',
      asArray: true
    });
    base.bindToState('hsDemographics201516', {
      context: this,
      state: 'hsDemographics',
      asArray: true
    });
  }

  componentDidUpdate() {
    var height = 600,
        width = 1200;

    var dataset = this.state.hsOfferings;

    var colors = d3.scaleLinear()
      .domain([0, d3.max(dataset.map(function(school){ return school.poverty }))])
      .range(['green', 'red']);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset.map(function(school){ return school.apClasses.length }))])
      .range([0, height - 20]);

    var xScale = d3.scaleBand()
      .domain(d3.range(0, dataset.length))
      .range([0, width])
      .padding(.05);

    var tooltip = d3.select('body').append('div')
      .style('position', 'absolute')
      .style('padding', '0 10px')
      .style('background', 'white')
      .style('opacity', 0);

    var graph = d3.select('#chart').append('svg')
      .attr('width', width)
      .attr('height', height)
      .selectAll('rect').data(this.state.hsOfferings)
      .enter().append('rect')
          .style('fill', function(d) {
              return colors(d.poverty);
          })
          .attr('width', xScale.bandwidth)
          .attr('x', function(d, i) {
              return xScale(i);
          })
          .attr('height', function(d) {
              return yScale(d.apClasses.length);
          })
          .attr('y', function(d) {
              return height - yScale(d.apClasses.length);
          })

    graph.on('mouseover', function(d) {
      d3.select(this)
        .style('opacity', .5);

      tooltip.transition()
        .style('opacity', .9);

      tooltip.html(
        "Name: " + d.key + ", # AP Classes: " + d.apClasses.length + ", % Poverty: " + d.poverty
        )
        .style('top', (d3.event.pageY - 30) + 'px')
        .style('left', d3.event.pageX + 'px');
    })
    .on('mouseout', function(d) {
      d3.select(this)
        .style('opacity', 1);

      tooltip.transition()
        .style('opacity', 0);
    });

  }

  render() {
    return (
      <div>
        <h1>HOLA</h1>
        <div id="chart"></div>
      </div>
    )
  }
}

export default App;
