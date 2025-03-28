import React, { useEffect, useRef } from 'react';
import './App.css';
import * as d3 from 'd3';

const App = () => {
  const svgRef = useRef(null); // Referencia al SVG donde se dibujará el gráfico

  useEffect(() => {
    // Cargar los datos del archivo JSON
    d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json').then((data) => {
      const dataset = data.data;

      // Dimensiones del gráfico
      const width = 800;
      const height = 400;
      const padding = 50;

      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height);

      // Escalas para los ejes X y Y
      const xScale = d3.scaleBand()
        .domain(dataset.map(d => d[0]))
        .range([padding, width - padding])
        .padding(0.1);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d[1])])
        .nice()
        .range([height - padding, padding]);

      // Crear los ejes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0, ${height - padding})`)
        .call(xAxis);

      svg.append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${padding}, 0)`)
        .call(yAxis);

      // Crear las barras
      svg.selectAll('.bar')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('data-date', d => d[0])
        .attr('data-gdp', d => d[1])
        .attr('x', d => xScale(d[0]))
        .attr('y', d => yScale(d[1]))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - padding - yScale(d[1]))
        .attr('index', (d, i) => i)
        .on('mouseover', function(event, d) {
          const date = d[0];
          const gdp = d[1];
          const tooltip = d3.select('#tooltip');
          tooltip.transition().duration(200).style('visibility', 'visible');
          tooltip.html(`<strong>Date:</strong> ${date}<br><strong>GDP:</strong> $${gdp.toFixed(1)} Billion`)
            .attr('data-date', date)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`);
        })
        .on('mouseout', function() {
          d3.select('#tooltip').transition().duration(200).style('visibility', 'hidden');
        });

      // Añadir título
      svg.append('text')
        .attr('id', 'title')
        .attr('x', width / 2)
        .attr('y', padding / 2)
        .attr('text-anchor', 'middle')
        .text('GDP Over Time (in Billion USD)');
    });
  }, []);

  return (
    <div className="App">
      <div id="tooltip" className="tooltip"></div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default App;
