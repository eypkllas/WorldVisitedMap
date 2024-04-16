const HOVER_COLOR = "#EFAE88";
const MAP_COLOR = "#fff2e3";
const SELECTED_COLOR = "#ffcc00"; 
let cityCount = 0;

document.getElementById("city_count").innerHTML = cityCount;


d3.json("canada_cities.geojson").then(function (data) {
  
  let width = 1200;
  let height = 800;


  let projection = d3.geoMercator().fitSize([width, height], data);
  let path = d3.geoPath().projection(projection);

  


  let svg = d3.select("#map_container")
              .append("svg")
              .attr("width", width)
              .attr("height", height);

  
  svg.append("g")
     .selectAll("path")
     .data(data.features)
     .enter()
     .append("path")
     .attr("d", path)
     .attr("fill", MAP_COLOR)
     .attr("stroke", "#000")
     .on("mouseover", function () {
       if (!d3.select(this).classed("selected")) {
         d3.select(this).attr("fill", HOVER_COLOR);
       }
     })
     .on("mouseout", function () {
       if (!d3.select(this).classed("selected")) {
         d3.select(this).attr("fill", MAP_COLOR);
       }
     })
     .on("click", function (d) {
       let selected = d3.select(this).classed("selected");
       d3.select(this).classed("selected", !selected);
       d3.select(this).attr("fill", !selected ? SELECTED_COLOR : MAP_COLOR);
       cityCount += !selected ? 1 : -1;
       document.getElementById("city_count").innerHTML = cityCount;
     });

  
  svg.append("g")
     .selectAll("text")
     .data(data.features)
     .enter()
     .append("text")
     .attr("transform", function (d) {
       return `translate(${path.centroid(d)})`;
     })
     .attr("text-anchor", "middle")
     .attr("font-size", "10pt")
     .text(function (d) {
       return d.properties.name;
     })
     .style("pointer-events", "none"); 
});
