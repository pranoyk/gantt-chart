let svg = d3.select("svg");
let totalMonths = 14;

let margin = 200;
let width = svg.attr("width") - margin;
let height = svg.attr("height") - margin;

let xScale =  d3.scaleBand().range([0, width]).domain([1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
let g = svg.append("g").attr( "transform", "translate (" + 100 + "," + 100 + ")" );
let xAxis = d3.axisTop(xScale);

g.append("g")
  .attr("class", "xAxis")
  .attr("transform", "translate (0, " + margin + ")")
  .call(d3.axisTop(xScale));

const getScalePoints = (g) => {
  return g.selectAll(".tick")
    .nodes()
    .map(d=> d.attributes.transform)
    .map(d => d.value.split(",")[0].slice(10, 100))
}

let points = getScalePoints(g);

const getX = (startPoints) => {
  
}

d3.json("data.json", (data) => {
  let y = 50;

  data.map((d, i) => {
    
    let x = points[i];
    let width = points[d["end"]["month"]-1];

    getX(d["start"])
    g.append("rect")
      .attr("class", "bar")
      .attr("x", x)
      .attr("y", y)
      .attr("width", width)
      .attr("height", 50)
    y+=60;
  })

})