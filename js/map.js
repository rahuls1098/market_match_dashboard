/* global D3 */

// Initialize a map with correct margins, dimensions, x and y-scales
function map(opts={}) {

  let margin = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  width = 433,
  height = 537,
  xValue = d => d[0],
  yValue = d => d[1],
  xLabelText = "",
  yLabelText = "",
  yLabelOffsetPx = 0,
  xScale = d3.scaleLinear(),
  yScale = d3.scaleLinear(),
  ourBrush = null,
  selectableElements = d3.select(null),
  dispatcher;


  // Create the chart by adding an svg to the div with the id
  // specified by the selector using the given data
  function chart(selector, data) {

    let minX = d3.min(data, d => d.latitude),
    maxX = d3.max(data, d => d.latitude),
    minY = d3.min(data, d => d.longitude),
    maxY = d3.max(data, d => d.longitude)


    //adding the basic svg
    let svg = d3.select(selector)
    .append("svg")
    .attr("width", width + "px")
    .attr("height", height + "px")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("viewBox", [0, 0, width, height].join(' '))
    .classed("svg-content", true);

    if (opts['backgroundImage']) {
      svg.append('image')
      .attr('xlink:href', opts['backgroundImage'])
      .attr("width", width)
      .attr("height", height)
    }

    svg = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Define scales
    xScale
    .domain([
      d3.min(data, d => xValue(d)),
      d3.max(data, d => xValue(d))
    ])
    .rangeRound([0, width]);

    yScale
    .domain([
      d3.min(data, d => yValue(d)),
      d3.max(data, d => yValue(d))
    ])
    .rangeRound([height, 0]);



    // Add the points to the map
    let points = svg.append("g")
    .selectAll(".scatterPoint")
    .data(data);

    points.exit().remove();

    // Assign data to each point and id based on 
    // trade relation status
    points = points.enter()
    .append("circle")
    .attr("class", "")
    .merge(points)
    .attr("id", (d) => {
      return d.relation
    })
    .attr("cx", X)
    .attr("cy", Y)
    .attr("r", (d) => { return 5; })
    .attr("relation", (d) => { return d.relation})
    .attr("zipcode", (d) => { return d.zipcode})
    .attr("food", (d) => { return d.food})
    .attr("fill", (d) => {
      if(d.relation == "no") {
        return "green";
      } else {
        return "blue";
      }
    })
    .attr("opacity", 0.7);

    selectableElements = points;
    svg.call(brush);

    // Highlight points when brushed
    function brush(g) {

      const brush = d3.brush()
      .on("start brush", highlight)
      .on("end", brushEnd)
      .extent([
        [-margin.left, -margin.bottom],
        [width + margin.right, height + margin.top]
      ]);

      ourBrush = brush;

      // Adds the brush to this element
      g.call(brush);

      // Highlight the selected circles
      function highlight() {
        if (d3.event.selection === null) return;
        const [
          [x0, y0],
          [x1, y1]
        ] = d3.event.selection;

        // If within the bounds of the brush, select it
        points.classed("selected", function(d) {
          if(x0 <= X(d) && X(d) <= x1 && y0 <= Y(d) && Y(d) <= y1) {
            var id = d.relation;

            //deselecting all the data
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

            //selecting all the data with the correct id
            d3.select("#map").selectAll("#" + this.id)
            .style("fill", "#FF0000")
            .style("opacity", 1)

            d3.select("#linechart").selectAll("#" + id).style("stroke", "#FF0000");
            d3.select("#barchart").selectAll("#" + id).style("fill", "#FF0000");

          }
          // defines the dimensions within which a selected points should fall in
          return x0 <= X(d) && X(d) <= x1 && y0 <= Y(d) && Y(d) <= y1
        }
      )
    }
    //when the user finishes highlighting the table appears
    function brushEnd(){

      if (!d3.event.selection) return;

      // programmed clearing of brush after mouse-up
      d3.select(this).call(brush.move, null);

      var d_brushed =  d3.selectAll(".selected").data();

      // populate table if one or more elements is brushed
      if (d_brushed.length > 0) {
        clearTableRows();
        d_brushed.forEach(d_row => populateTableRow(d_row))
      } else {
        clearTableRows();
      }

      // We don't want infinite recursion
      if(d3.event.sourceEvent.type!="end"){

        d3.select(this).call(brush.move, null);
      }
    }

    //removes all the data currently in the table
    function clearTableRows() {
      hideTableColNames();
      d3.selectAll(".row_data").remove();
    }

    function hideTableColNames() {
      d3.select("table").style("visibility", "hidden");
    }

    function showTableColNames() {
      d3.select("table").style("visibility", "visible");
    }

    //adds a row to the table
    function populateTableRow(d_row) {

      showTableColNames();

      var d_row_filter = [d_row.zipcode,
        d_row.food,
        d_row.relation];

        d3.select("table")
        .append("tr")
        .attr("class", "row_data")
        .selectAll("td")
        .data(d_row_filter)
        .enter()
        .append("td")
        .attr("align", (d, i) => i == 0 ? "left" : "right")
        .text(d => d);
      }
    }
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
