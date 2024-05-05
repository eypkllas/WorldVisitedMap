const HOVER_COLOR = "#EFAE88";    
const MAP_COLOR = "#e5dfdf";
const SELECTED_COLOR = "#ffcc00"; 
let Count = 0;                
let selectedCountries = [];       


document.getElementById("count").innerHTML = Count;


const infotip = d3.select("body").append("div")
    //.attr("class", "infotip") 
    .style("position", "absolute") // Position absolute so its above
    //.style("z-index", "100") 
    .style("visibility", "hidden")
    .style("padding", "5px") 
    .style("background", "rgba(255, 255, 255, 0.8)") //transparent backround
    .style("border", "1px solid #000") 
    .style("border-radius", "5px") 
    .text(""); //???




    

// Load GeoJSON data 
d3.json("countries.geo.json", function (data) {
    let width = 1300;  // SVG container
    let height = 850;  

   
    let projection = d3.geoMercator().fitSize([width, height], data);      // Create a Mercator projection that fits the SVG dimensions and data
    let path = d3.geoPath().projection(projection);                       // Generate a geographic path generator using the specified projection

    // Create SVG element 
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
       .attr("stroke", "#000") // borders
       
       .on("mouseover", function(d) { 
           infotip.text(d.properties.name).style("visibility", "visible"); 
           if (!d3.select(this).classed("selected")) {
               d3.select(this).attr("fill", HOVER_COLOR); 
           }
       })
       .on("mousemove", function() { 
           infotip.style("top", (d3.event.pageY - 10) + "px") 
                  .style("left", (d3.event.pageX + 10) + "px");   
       })
       .on("mouseout", function() { 
           infotip.style("visibility", "hidden"); 
           if (!d3.select(this).classed("selected")) {
               d3.select(this).attr("fill", MAP_COLOR);    
           }
       })



       
       .on("click", function(d) { 
           let selected = d3.select(this).classed("selected");
           d3.select(this).classed("selected", !selected)
                          .attr("fill", !selected ? SELECTED_COLOR : MAP_COLOR);
           Count += !selected ? 1 : -1;
           if (!selected) {
             selectedCountries.push(d.properties.name);
           } else {
             const index = selectedCountries.indexOf(d.properties.name);
             if (index > -1) {
               selectedCountries.splice(index, 1);
             }
           }
           document.getElementById("count").innerHTML = Count;
           document.getElementById("selected_countries").innerHTML = selectedCountries.map(country => `<li>${country}</li>`).join('');
       });


       
    let zoom = d3.zoom()
       .scaleExtent([1, 10])
       .on("zoom", function() {
           svg.selectAll('g').attr('transform', d3.event.transform);
           infotip.style("visibility", "hidden");
       });

    svg.call(zoom);
    setupZoomControls(svg, zoom);
});



function setupZoomControls(svg, zoom) {
    document.getElementById('zoom_in').addEventListener('click', function() {
        svg.transition().duration(300).call(zoom.scaleBy, 1.5);
    });

    document.getElementById('zoom_out').addEventListener('click', function() {
        svg.transition().duration(300).call(zoom.scaleBy, 0.75);
    });
}












/*
function downloadMap() {
  let svgElement = document.querySelector("#map_container svg");  // Selects only the SVG element inside #map_container
  html2canvas(svgElement).then(function (canvas) {
    var destCanvas = document.createElement("canvas");
    destCanvas.width = canvas.width;
    destCanvas.height = canvas.height;
    var destCtx = destCanvas.getContext("2d");
    destCtx.drawImage(canvas, 0, 0);

    const ctx = destCanvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.font = "2em Calibri";
    ctx.fillStyle = "black";
    ctx.textAlign = "start";
    ctx.fillText("ozanyerli.github.io/turkeyvisited", 10, canvas.height - 25);
    ctx.fillText(Count + "/81", 10, 5);

    destCanvas.toBlob(function (blob) {
      saveAs(blob, "turkeyvisited.png");
    });
  });
}


document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('downloadButton').addEventListener('click', downloadMap);
});
*/
