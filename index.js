let svg = d3.select("svg");
// let totalMonths = 14;

let margin = 200;
let width = svg.attr("width") - margin;
let height = svg.attr("height") - margin;

let xScale =  d3.scaleBand().range([0, width]).domain([1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
let g = svg.append("g").attr( "transform", "translate (" + 100 + "," + 100 + ")" );
let xAxis = d3.axisTop(xScale);

g.append("g")
  .attr("class", "xAxis")
  .call(d3.axisTop(xScale));

const getScalePoints = (g) => {
  return g.selectAll(".tick")
    .nodes()
    .map(d=> d.attributes.transform)
    .map(d => d.value.split(",")[0].slice(10, 100))
}

let points = getScalePoints(g);

const getStartingPoint = (startPoint, existingPoints) => {
  let percent = startPoint["percent"];
  let dependent = startPoint["dependent"];
  if (dependent === "self") {
    return points[0];
  }
  let dependentPoint = existingPoints[dependent];
  return parseFloat(dependentPoint["x"]) + parseFloat(dependentPoint["width"]*percent/100);
}

const getTimePeriod = (d, startPosition) => {
  let month = points[d["end"]["month"]-1];
  return parseFloat(month)-parseFloat(startPosition);
}

d3.json("data.json", (data) => {
  let y = 50;
  let existingPoints = {};
  
  data.map((d, i) => {
    
    let x = getStartingPoint(d["start"], existingPoints);
    let width = getTimePeriod(d, x);
    existingPoints[i] = {width: width, x: x};

    g.append("rect")
      .attr("class", "bar")
      .attr("x", x)
      .attr("y", y)
      .attr("width", width)
      .attr("height", 50)
    y+=60;
  })

})