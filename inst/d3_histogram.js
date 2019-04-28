//d3_histogram.js

// data is a vector, so we don't need to extract xVals
// based on ttps://observablehq.com/@d3/histogram and https://blockbuilder.org/bsurnida/c4fcc315afca2f78d27832bcd5e4984e

var x_max = d3.max(data);
var x_min = d3.min(data);

// options marker
var color = options.bar.color;
var opacity = options.bar.opacity;
var border = options.bar.border;

// options margin
var margin_l = 50;
var margin_r = 50;
var margin_b = 50;
var margin_t = 50;

// options title
var title_text = options.title.title;
var title_size = options.title.size;

//options axis
var x_title = options.xaxis.title;
var x_title_size = options.xaxis.size;
var y_title = options.yaxis.title;
var y_title_size = options.yaxis.size;
var n_bins = options.n_bins;

var graph_width = width- margin_l - margin_r,
    graph_height = height - margin_t - margin_b,
    g = svg.append("g").attr("transform", "translate(" + margin_l + "," + margin_t + ")");
var x = d3.scaleLinear()
		.domain([x_min, x_max+Math.abs(x_max/n_bins)]).nice()
    .range([0, graph_width]);

var bins = d3.histogram()
    .domain(x.domain())
    .thresholds(x.ticks(n_bins))
    (data);

var y = d3.scaleLinear()
    .domain([0, d3.max(bins, function(d) { return d.length; })])
    .range([graph_height, 0]);

var bar = g.selectAll(".bar")
  .data(bins)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

bar.append("rect")
    .attr("x", 1)
    .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
    .attr("height", function(d) { return graph_height - y(d.length); })
    .attr("opacity", opacity)
    .attr('stroke', border)
    .attr('fill', options.bar.color)
    .on("mouseover", function(d) {
       tt.transition()
         .duration(200)
         .style("opacity", 0.8);
       tt.html(x_title + ": " + d.x0 + " to " + d.x1 + "<br/>Count: " + d.length +
              "<br/>Frequency: " + d.length/data.length)
         .style("left", d3.event.pageX + 10 + "px")
         .style("top", d3.event.pageY + 10 + "px");
    })
    .on("mouseout", function(d) {
       tt.transition().
       duration(500).
       style("opacity", 0);
    });

// add the x Axis
g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + graph_height + ")")
    .call(d3.axisBottom(x));

// text label for the x axis
g.append("text")
  .attr("transform", "translate(" + (margin_l + (graph_width - margin_l - margin_r) / 2) + " ," + (graph_height + margin_b*0.7) + ")")
  .style("text-anchor", "middle")
  .text(x_title);

// add the y Axis
g.append("g")
  .call(d3.axisLeft(y));

// text label for the y axis
g.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -margin_l*0.7)
  .attr("x", 0 - graph_height/2)
  .style("text-anchor", "middle")
  .text(y_title);

// Title
if (title_text !== null) {
svg.append('text')
  .attr('x', width * 0.01)
  .attr('y', margin_t/2)
  .style('font-family', 'sans-serif')
  .text(title_text);
}

// Create the div to serve as tooltip
var tt = d3.select("body")
.append("div")
  .style("opacity", 0)
  .style("background", "rgba(255, 255, 255, .90)")
  .style("position", "absolute")
  .style("padding", "10px")
  .style("border-radius", "10px")
  .style("border", "1px solid black")
  .style("background-color", "lightgrey");
