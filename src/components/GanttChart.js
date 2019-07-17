import React from 'react'
import * as d3 from "d3";
import jsonData from './data.json';
import '../index.css'

class GanttChart extends React.Component {
    getDimensions(attr, svg) {
        return svg.attr(attr) - 200;
    }

    getStartingPoint (startPoint, existingPoints, points) {
        let percent = startPoint["percent"];
        let dependent = startPoint["dependent"];
        if (dependent === "self") {
            return points[0];
        }
        let dependentPoint = existingPoints[dependent];
        return parseFloat(dependentPoint["x"]) + parseFloat(dependentPoint["width"]*percent/100);
    };

    getTimePeriod (d, startPosition, points) {
        let month = points[d["end"]["month"]-1];
        return parseFloat(month)-parseFloat(startPosition);
    };

    getScalePoints(g) {
        return g.selectAll(".tick")
            .nodes()
            .map(d => d.attributes.transform)
            .map(d => d.value.split(",")[0].slice(10, 100))
    };

    getXScale(width, iterations) {
        return d3.scaleBand().range([0, width]).domain(iterations);
    }

    generateClassname(category, position, dependentPosition) {
        return category + "_" + position + "_" + dependentPosition;
    }

    addBar(g, data, startingPoint, y, width) {
        return g.append("rect")
                .attr("class", data["category"])
                .attr("x", startingPoint)
                .attr("y", y)
                .attr("width", width)
                .attr("height", 50)
                .on("click", () => {
                    let classname = this.generateClassname(data["category"],data["position"], data["start"]["dependent"]);
                    if(g.select("."+classname).nodes().length !== 0) {
                        g.select("."+classname)
                            .remove();
                        return;
                    }
                    this.addDependentPoint(startingPoint, y, data["position"], g, classname);
                });
    }

    addXScale(svg, xScale){
        return svg.append("g")
            .attr("transform", "translate (" + 100 + "," + 100 + ")")
            .attr("class", "xAxis")
            .call(d3.axisTop(xScale));
    }

    getCoordinates(startPoint, endPoint) {
        let lineData = [];
        lineData.push(startPoint);
        let firstCoordinate = {"x": parseFloat(startPoint["x"]), "y": (parseFloat(startPoint["y"])+10)};
        let secondCoordinate = {"x": (parseFloat(startPoint["x"])-10), "y": (parseFloat(startPoint["y"])+10)};
        let thirdCoordinate = {"x": (parseFloat(startPoint["x"])-10), "y": parseFloat(endPoint["y"])};
        lineData.push(firstCoordinate);
        lineData.push(secondCoordinate);
        lineData.push(thirdCoordinate);
        lineData.push(endPoint);
        return lineData;
    }

    drawLines(startPoints, endPoints, g) {
        startPoints.map((start, index) => {
            let lineCoordinates =  this.getCoordinates(start, endPoints[index]);
            let lineFunction = d3.line()
                .x(d => d["x"])
                .y(d => d["y"])
                .curve(d3.curveLinear);
            g.append("path")
                .attr("d", lineFunction(lineCoordinates))
                .attr("stroke", "blue")
                .attr("stroke-width", 2);
        })
    }

    getAllStartCoordinates(g) {
        let startXCoordinates = g.selectAll(".startIndicators")
            .nodes()
            .map(d => d.attributes["cx"]["value"]);
        let startYCoordinates = g.selectAll(".startIndicators")
            .nodes()
            .map(d => d.attributes["cy"]["value"]);
        let startCoordinates = startXCoordinates.map((x, i) => {
            return {"x" : x, "y" : startYCoordinates[i]};
        });
        return startCoordinates
    }

    getAllEndCoordinates(g) {
        let endXCoordinates = g.selectAll(".endIndicators")
            .nodes()
            .map(d => d.attributes["cx"]["value"]);
        let endYCoordinates = g.selectAll(".endIndicators")
            .nodes()
            .map(d => d.attributes["cy"]["value"]);
        let endCoordinates = endXCoordinates.map((x, i) => {
            return {"x": x, "y": endYCoordinates[i]};
        });
        return endCoordinates;
    }

    addDependentPoint(cx, y, position, chart, classname) {
        let constant = 80;
        let selectedBar = jsonData.filter(data => data.position === position);
        if (selectedBar[0]["start"]["dependent"] === "self") return;
        let cyStart = 100 + (constant * selectedBar[0]["start"]["dependent"]); 
        let g = chart.append("g")
            .attr("class", classname);
        g.append("circle")
            .attr("cx", cx)
            .attr("cy", cyStart)
            .attr("r", 5)
            .attr("class", "startIndicators");
        let startCoordinates = this.getAllStartCoordinates(g);

        let cyEnd = y + 25;
        g.append("circle")
            .attr("cx", cx)
            .attr("cy", cyEnd)
            .attr("r", 5)
            .attr("class", "endIndicators");
        let endCoordinates = this.getAllEndCoordinates(g);
        this.drawLines(startCoordinates, endCoordinates, g);
    }

    drawChart() {
        let svg = d3.select("svg");
        let xScale = this.getXScale(this.getDimensions("width", svg), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
        let g = this.addXScale(svg, xScale);
        const points = this.getScalePoints(g);
        let existingPoints = {};
        let y = 50;
        jsonData.map((data, i) => {
            let startingPoint = this.getStartingPoint(data["start"], existingPoints, points);
            let width = this.getTimePeriod(data, startingPoint, points);

            existingPoints[i] = {width : width, x: startingPoint};
            this.addBar(g, data, startingPoint, y, width);
            y += 80;
        })
    }


    componentDidMount() {
        this.drawChart();
    }

    render() {
        return (
            <div></div>
        )
    }
}

export default GanttChart

