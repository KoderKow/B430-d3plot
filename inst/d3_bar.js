// options (sub)title
var title_text = options.title.title;

//options axis
var x_title = options.xaxis.title;

var layer_left   = 0.01;
    layer_top    = 0.2;
    layer_height = 0.7;
    layer_width  = 0.97;

function svg_height() {return parseInt(svg.style('height'))}
function svg_width()  {return parseInt(svg.style('width'))}
function actual_max() {return d3.max(data, function (d) {return d.y; }); }
function col_width()  {return svg_width()  / data.length * layer_width;}
function col_heigth() {return (svg_height() /actual_max()) * layer_height; }

function col_top()    {return svg_height() * layer_top; }
function col_left()   {return svg_width()  * layer_left;}

svg.html("")
.selectAll('rect')
.data(data)
.enter()
.selectAll('rect')
.data(data)
.enter().append('rect')
  .attr('height', 0)
  .attr('width', col_width() * 0.9)
  .attr('x', function(d, i) {return (i * col_width()) + (svg_width()* layer_left); })
  .attr('y', function(d) {return col_top() + ((actual_max() - d.y) * col_heigth()); })
    .attr('opacity', function(d) { return d.y / (actual_max()*0.9 ); })
    .attr('tip', function(d) { return (d.y * col_width()) + col_left(); })
    .attr("d", function(d) { return d.x; })
    .on("mouseover", function(d) {
       tt.transition()
         .duration(200)
         .style("opacity", 0.8);
       tt.html(x_title + ": " + d.x + "<br/>Count: " + d.y)
         .style("left", d3.event.pageX + 10 + "px")
         .style("top", d3.event.pageY + 10 + "px");
       })
     .on("mouseout", function(d) {
       tt.transition().
       duration(500).
       style("opacity", 0);
       })
    .transition()
    .ease(d3.easeLinear)
    .duration(options.transition_duration)
    .attr('height', function(d) {return (d.y * col_heigth()); });

// Colors
var hex_check = /^#[0-9A-F]{6}$/i.test(options.bar.color);

function color_check(strColor){
  var s = new Option().style;
  s.color = strColor;
  return s.color == strColor;
}

var color = d3.scaleOrdinal(d3.schemeCategory10);

if(hex_check === true){
  svg.selectAll('rect')
    .attr('fill', options.bar.color);
} else if (color_check(options.bar.color.toLowerCase())){
  svg.selectAll('rect')
    .attr('fill', options.bar.color);
}
else {
  svg.selectAll('rect')
    .data(data)
    .attr('fill', function(d) { return color(d[options.bar.color]); });
}

// Identity labels

var txt = svg.selectAll('text').data(data);

txt.enter().append('text')
    .attr('x', function(d, i) {return (i * col_width()) + (svg_width()* layer_left) + (col_width() * 0.5); })
    .attr('y', function(d) {return svg_height()* 0.95;})
    .style("font-size", "14px")
    .text(function(d) {return d.x;})
    .style('font-family', 'sans-serif')
    .attr('text-anchor', 'middle');


txt.exit().remove();

// Numeric labels

var totals = svg.selectAll('totals').data(data);

totals.enter().append('text')
      .attr('x', function(d, i) {return (i * col_width()) + (svg_width()* layer_left) + (col_width() * 0.5); })
      .attr('y', function(d) {return (col_top() * 0.9) + ((actual_max() - d.y) * col_heigth()); })
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('font-family', 'sans-serif')
      .text(function(d) {return d.y; });

totals.exit().remove();

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

  // Title
if (title_text !== null) {
svg.append('text')
  .attr('x', svg_width()* 0.01)
  .attr('y', 18)
  .style('font-size', "18px")
  .style('font-family', 'sans-serif')
  .text(title_text);
}
