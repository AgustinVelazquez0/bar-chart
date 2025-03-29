import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const BarChart = () => {
  const [data, setData] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    // Cargar los datos del archivo JSON
    d3.json(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
    ).then((data) => {
      setData(data.data);
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const width = 800;
      const height = 400;
      const padding = 50;

      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height);

      // Escalas para los ejes X y Y
      const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d[0]))
        .range([padding, width - padding])
        .padding(0.1);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[1])])
        .nice()
        .range([height - padding, padding]);

      // Crear los ejes
      const xAxis = d3
        .axisBottom(xScale)
        .tickFormat((d) => d.split("-")[0]) // Extraemos el año (primer parte de la fecha en formato "YYYY-MM-DD")
        .tickValues(data.filter((d, i) => i % 10 === 0).map((d) => d[0])); // Mostrar un tick cada 10 años

      const yAxis = d3.axisLeft(yScale);

      svg
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height - padding})`)
        .call(xAxis);

      svg
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis);

      // Crear las barras
      svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .attr("x", (d) => xScale(d[0]))
        .attr("y", (d) => yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - padding - yScale(d[1]))
        .attr("index", (d, i) => i)
        .on("mouseover", function (event, d) {
          const tooltip = d3.select("#tooltip");
          tooltip.transition().duration(200).style("visibility", "visible");
          tooltip
            .html(
              `<strong>Date:</strong> ${
                d[0]
              }<br><strong>GDP:</strong> $${d[1].toFixed(1)} Billion`
            )
            .attr("data-date", d[0])
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", function () {
          d3.select("#tooltip")
            .transition()
            .duration(200)
            .style("visibility", "hidden");
        });

      // Añadir título
      svg
        .append("text")
        .attr("id", "title2")
        .attr("x", width / 2)
        .attr("y", padding / 2)
        .attr("text-anchor", "middle")
        .text("GDP Over Time (in Billion USD)");
    }
  }, [data]);

  return (
    <div className="App">
      <div id="tooltip" className="tooltip"></div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;
