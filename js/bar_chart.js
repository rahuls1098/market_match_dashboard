/* global D3 */

// Initialize a bar chart with correct margins, dimensions, x and y-scales
function barchart() {

   let margin = {
      top: 60,
      left: 65,
      right: 30,
      bottom: 35
    },
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    xValue = d => d[0],
    yValue = d => d[1],
    xLabelText = "Does Vendor Have a Trade Relationship",
    yLabelText = "",
    yLabelOffsetPx = 0,
    xScale = d3.scaleBand(),
    yScale = d3.scaleLinear(),
    ourBrush = null,
    selectableElements = d3.select(null),
    dispatcher;

  // Create the chart by adding an svg to the div with the id
  // specified by the selector using the given data
  function chart(selector, data) {

    let svg = d3.select(selector)
      .append("svg")
      .attr("perserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom + 10].join(' '))
      .classed("svg-content", true);

    svg = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Adding a chart title and directly writting styling to it
    svg.append("text")
      .attr("x", (width/2))
      .attr("y", (margin.top /4))
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Effect of Trade Relation on Desired Wholesale")

    // Define scales
     xScale
      .domain(["yes", "no"])
      .rangeRound([0, width])
      .padding(0.05);

     yScale.domain([0, 100])
        .rangeRound([height, 0]);

    // X axis and label
    let xAxis = svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0, " + (height) + ")")
      .call(d3.axisBottom(xScale))
      .append("text")
        .attr("transform", "translate(" + (width / 2) + ",40)")
      .attr("class", "axis_label")
      .text(xLabelText);


    // Y axis and label
    let yAxis = svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90) translate(-90, -40)")
      .style("text-anchor", "end")
      .attr("class", "axis_label")
      .text(yLabelText);

  let color = ["#0000ff", "#008000"];

  let bar = d3.b

  // Append the rectangles for the bar chart
  // Add interactivity via mouse events
  // Add styling directly to the mouse events, either by color or by opacity
  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("fill", function(d, i) {
        return color[i];
      })
      .attr("id", function(d) {
        return d.relation;
      })
      .style("opacity", 0.5)
      .attr("x", function(d) { return xScale(d.relation); })
      .attr("width", xScale.bandwidth())
      .attr("y", function(d) { return yScale(d.percent); })
      .attr("height", function(d) { return height - yScale(d.percent); })

      .on('mousedown', function() {
       d3.select("#map").selectAll("#yes")
          .style("fill", "blue")
      d3.select("#map").selectAll("#no")
          .style("fill", "green")

       d3.select("#barchart").selectAll("#yes")
          .style("fill", "blue")
          .style("opacity", 0.5);

       d3.select("#barchart").selectAll("#no")
          .style("fill", "green")
          .style("opacity", 0.5);

       d3.select("#linechart").selectAll("#yes")
          .style("stroke", "blue")
          .style("opacity", 0.5);
       d3.select("#linechart").selectAll("#no")
          .style("stroke", "green")
          .style("opacity", 0.5);

       d3.select("#map").selectAll("#" + this.id)
          .style("fill", "#FF0000")
      d3.select("#barchart").selectAll("#" + this.id)
          .style("fill", "#FF0000");
       d3.select("#linechart").selectAll("#" + this.id)
          .style("stroke", "#FF0000");
      }).
      on('mouseup', function() {
      });


      svg.selectAll("text.bar")
      .data(data)
      .enter().append("text")
      .attr("class", "bar")
      .attr("text-anchor", "middle")
      .attr("x", function(d) {
        return xScale(d.relation) + (width/4);
         })
      .attr("y", function(d) { return yScale(d.percent) - 5; })
      .text(function(d) { return d.percent.toFixed(0) + "%"; });

      const bars = svg.selectAll(".bar")

      selectableElements = bars

    return chart;
  }

  // The x-accessor from the datum
  function X(d) {
    return xScale(xValue(d));
  }

  // The y-accessor from the datum
  function Y(d) {
    return yScale(yValue(d));
  }

  // More chart styling based on the limits of our data
  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function (_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function (_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  chart.xLabel = function (_) {
    if (!arguments.length) return xLabelText;
    xLabelText = _;
    return chart;
  };

  chart.yLabel = function (_) {
    if (!arguments.length) return yLabelText;
    yLabelText = _;
    return chart;
  };

  chart.yLabelOffset = function (_) {
    if (!arguments.length) return yLabelOffsetPx;
    yLabelOffsetPx = _;
    return chart;
  };

  return chart;
}
