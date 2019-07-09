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

    addBar(g, data, startingPoint, y, width) {
        return g.append("rect")
                .attr("class", data["title"])
                .attr("x", startingPoint)
                .attr("y", y)
                .attr("width", width)
                .attr("height", 50);
    }

    addXScale(svg, xScale){
        return svg.append("g")
            .attr("transform", "translate (" + 100 + "," + 100 + ")")
            .attr("class", "xAxis")
            .call(d3.axisTop(xScale));
    }

    addDependentPoint(existingPoints, g) {
        let dependentBars = jsonData.filter(data => data["start"]["dependent"] != "self");
        let constant = 80;
        dependentBars.map(bar => {
            let barPosition = bar["position"];
            let cx = existingPoints[barPosition]["x"];
            let cy = 100 + (constant * bar["start"]["dependent"]);
            g.append("circle")
                .attr("cx", cx)
                .attr("cy", cy)
                .attr("r", 5)
                .style("fill", "black");
        })

    }

    drawChart() {
        let svg = d3.select("svg");
        const width = this.getDimensions("width", svg);
        let xScale = this.getXScale(width, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);

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
        this.addDependentPoint(existingPoints, g);
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

