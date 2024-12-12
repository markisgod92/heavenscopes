import { useEffect, useRef } from "react";
import * as d3 from "d3";

export const SkyRadar = ({ planets }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const width = 400;
    const height = 400;
    const margin = 30
    const radius = Math.min(width, height) / 2 - margin;
    const angleSlice = (Math.PI * 2) / 8;

    const svg = d3.select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const radialLines = svg.append("g")
      .selectAll(".radial-line")
      .data(d3.range(8))
      .enter()
      .append("line")
      .attr("class", "radial-line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d) => radius * Math.cos(d * angleSlice - Math.PI / 2))
      .attr("y2", (d) => radius * Math.sin(d * angleSlice - Math.PI / 2))
      .style("stroke", "var(--text)")
      .style("stroke-opacity", 0.2)
      .style("stroke-width", 1);

    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    svg.append("g")
      .selectAll(".radial-label")
      .data(directions)
      .enter()
      .append("text")
      .attr("x", (d, i) => (radius * 1.1) * Math.cos(i * angleSlice - Math.PI / 2))
      .attr("y", (d, i) => (radius * 1.1) * Math.sin(i * angleSlice - Math.PI / 2))
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .style("font-size", "12px")
      .style("fill", "var(--text)")
      .style("stroke-opacity", 0.4)
      .text(d => d);

    const numAltitudeCircles = 6;
    for (let i = 1; i <= numAltitudeCircles; i++) {
      const altCircleRadius = (i / numAltitudeCircles) * radius;
      svg.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", altCircleRadius)
        .style("fill", "none")
        .style("stroke", "var(--text)")
        .style("stroke-opacity", 0.1)
        .style("stroke-width", 1);

      const altitudeDegree = i * 15;
      svg.append("text")
        .attr("x", 0)
        .attr("y", -altCircleRadius)
        .attr("text-anchor", "middle")
        .attr("dy", "+5")
        .style("font-size", "10px")
        .style("fill", "var(--text)")
        .style("stroke-opacity", 0.4)
        .text(`${altitudeDegree}°`);
    }

    planets.forEach((planet) => {
      const { azimuth, altitude, name, magnitude } = planet;
      const radialDistance = radius * (altitude / 90);
      const x = radialDistance * Math.cos((azimuth / 180) * Math.PI - Math.PI / 2);
      const y = radialDistance * Math.sin((azimuth / 180) * Math.PI - Math.PI / 2);
      const dotRadius = Math.max(3, Math.min(10, 10 - (magnitude + 26) * (7 / 26)));
      const dotColor = {
        Sun: 'yellow',
        Moon: 'grey'
      }


      svg.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", dotRadius)
        .style("fill", dotColor[name] || 'blue');

      svg.append("text")
        .attr("x", x)
        .attr("y", y - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "var(--text)")
        .text(name);
    });

  }, [planets]);

  return (
    <svg ref={svgRef}></svg>
  );
};