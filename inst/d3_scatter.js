var xVals = data.map(function(dd){ return dd[options.xvar]; });
var yVals = data.map(function(dd){ return dd[options.yvar]; });

// x and y min/max
x_max = d3.max(xVals);
x_min = d3.min(xVals);
y_max = d3.max(yVals);
y_min = d3.min(yVals);

// options marker
var size = options.marker.size;
var color = options.marker.color;
var sw = options.marker.strokewidth;
var opacity = options.marker.opacity;

// options margin
var margin_l = options.layout.margin.l;
var margin_r = options.layout.margin.r;
var margin_b = options.layout.margin.b;
var margin_t = options.layout.margin.t;

// options title
var title_text = options.title.title;
var title_size = options.title.size;

//options axis
var x_title = options.xaxis.title;
var y_title = options.yaxis.title;

function svg_height() {return parseInt(svg.style('height'))}
function svg_width() {return parseInt(svg.style('width'))}

// scales
var xScale = d3.scaleLinear()
               .domain([x_min, x_max])
               .range([margin_l, 500 - margin_r]);

var yScale = d3.scaleLinear()
               .domain([y_min, y_max])
               .rangeRound([500 - margin_b, margin_t]);

// colors
var hex_check = /^#[0-9A-F]{6}$/i.test(options.marker.color);

function color_check(strColor){
  var s = new Option().style;
  s.color = strColor;
  return s.color == strColor;
}

var color = d3.scaleOrdinal(d3.schemeCategory10);

// create plot on page
svg.html("").selectAll('circle')
  .data(data)
  .enter().append('circle')
  .attr('cx', function(d) { return xScale(x_min); })
  .attr('cy', function(d) { return yScale(y_min); })
  .attr('r', function() { return size; })
  .attr('stroke-width', sw)
  .attr("opacity", opacity)
  .on("mouseover", function(d) {
       tt.transition()
         .duration(200)
         .style("opacity", 0.8);
       tt.html(x_title + ": " + d[options.xvar] + "<br/>" + y_title + ": " + d[options.yvar])
         .style("left", d3.event.pageX + 10 + "px")
         .style("top", d3.event.pageY + 10 + "px");
       })
     .on("mouseout", function(d) {
       tt.transition().
       duration(500).
       style("opacity", 0);
       })
  .transition()
  .duration(options.transition_duration)
  .attr('cx', function(d) { return xScale(d[options.xvar]); })
  .attr('cy', function(d) { return yScale(d[options.yvar]); });

if(hex_check === true){
  svg.selectAll('circle')
    .attr('fill', options.marker.color);
} //else if (color_check(options.marker.color.toLowerCase())){
  //svg.selectAll('circle')
    //.attr('fill', options.marker.color);
 else {
  svg.selectAll('circle')
    .data(data)
    .attr('fill', function(d) { return color(d[options.marker.color]); });
}

// add x axis
svg.append("g")
  .attr("transform", "translate(0," + (svg_height()-margin_b*0.9) + ")")
  .call(d3.axisBottom(xScale));

// text label for the x axis
svg.append("text")
  .attr("transform", "translate(" + (margin_l + (svg_width() - margin_l - margin_r) / 2) + " ," + (svg_height() - margin_b/2) + ")")
  .style("text-anchor", "middle")
  .style("font-size", "14px")
  .text(x_title);

// add y axis:
svg.append("g")
  .attr("transform", "translate(" + margin_l*0.9 + ",0)")
  .call(d3.axisLeft(yScale));


// text label for the y axis
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", margin_l/5)
  .attr("x", 0 - svg_height()/2)
  .style("text-anchor", "middle")
  .style("font-size", "14px")
  .text(y_title);

// do this only if the title was specified
if (title_text !== null) {
  svg.append("text")
    .attr("transform", "translate(" + (margin_l + (svg_width() - margin_r - margin_l) / 2) + "," + margin_t/2 + ")")
    .style("text-anchor", "middle")
    .style("font-size", "18px")
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
