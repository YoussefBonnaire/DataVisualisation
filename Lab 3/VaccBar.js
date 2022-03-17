let x_bar = d3.scaleBand()
let y_bar = d3.scaleLinear()
let top10;

function showBarChart() {
    const xMax = width_line - margin * 2;
    const yMax = height_line - margin;

    Color.domain([0, 100])
    vaccdat.then(data => {
        let current_data = data[startdate];
        current_data.sort((a, b) => b.people_vac_per_hundred - a.people_vac_per_hundred);
        top10 = current_data.slice(0, 10);
        // X Axis
        x_bar
            .rangeRound([0, xMax])
            .domain(top10.map(d => d.country));

        x_axis.transition().duration(1500)
            .call(d3.axisBottom(x_bar))
        // Y Axis
        y_bar
            .rangeRound([yMax, 20])
            .domain([0, 100])
        y_axis.transition().duration(1500)
            .call(d3.axisLeft(y_bar))

        var bar = bar_svg.select('g').selectAll("rect")
            .data(top10)
        bar.enter()
            .append("rect")
            .attr('class', d => d.iso_code)
            .on('mouseover', graphMouseOver_fromGraph) // set listener for when mouse hovers over rectangle
            .on('mouseout', graphMouseOut_fromGraph) // set listener for when mouse moves away from rectangle
            .merge(bar)
            .transition()
            .duration(1000)
            .attr("x", function (d) {
                return x_bar(d.country);
            })
            .attr("y", function (d) {
                return y_bar(d.people_vac_per_hundred);
            })
            .attr("width", x_bar.bandwidth() - 10)
            .attr("height", function (d) {
                return yMax - y_bar(d.people_vac_per_hundred);
            }).attr('fill', d =>
            Color(d.people_vac_per_hundred)
        )
            .attr("transform", "translate(25,-20)");
        bar.exit().transition().duration(500).remove()
    })
}

let valu = 'people_vac_per_hundred';

function UpdateChart(val, date) {
    vaccdat.then(data => {
        let current_data = data[formatDate(date)]
        current_data.sort((a, b) => b[val] - a[val]);
        top10 = current_data.slice(0, 10);
        valu = val
        //axis
        x_bar.domain(top10.map(d => d.country))
        x_axis.transition().duration(1500)
            .call(d3.axisBottom(x_bar))
        var bar = bar_svg.select('g').selectAll("rect")
            .data(top10)
        bar.enter()
            .append("rect")
            .merge(bar)
            .on('mouseover', graphMouseOver_fromGraphUpd) // set listener for when mouse hovers over rectangle
            .on('mouseout', graphMouseOut_fromGraphUpd) // set listener for when mouse moves away from rectangle
            .transition()
            .duration(1000)
            .attr('class', d => d.iso_code)
            .attr("x", function (d) {
                return x_bar(d.country);
            })
            .attr("y", function (d) {
                return y_bar(d[valu]);
            })
            .attr("width", x_bar.bandwidth() - 10)
            .attr("height", function (d) {
                return yMax - y_bar(d[valu]);
            }).attr('fill', d =>
            Color(d[valu])
        )
            .attr("transform", "translate(25,-20)");
        bar.exit().transition().duration(500).remove()
    })
}

function top10_(event) {
    top10.push(event.target.__data__.properties)
    top10.sort((a, b) => b[valu] - a[valu]);
    //axis
    x_bar.domain(top10.map(d => d.country))
    x_axis.transition().duration(1500)
        .call(d3.axisBottom(x_bar))
    let bar = bar_svg.select('g').selectAll("rect")
        .data(top10)
    bar
        .enter()
        .append("rect")
        .merge(bar)
        .on('mouseover', graphMouseOver_fromGraphUpd) // set listener for when mouse hovers over rectangle
        .on('mouseout', graphMouseOut_fromGraphUpd) // set listener for when mouse moves away from rectangle
        .transition()
        .duration(1000)
        .attr('class', d => d.iso_code)
        .attr("x", function (d) {
            return x_bar(d.country);
        })
        .attr("y", function (d) {
            return y_bar(d[valu]);
        })
        .attr("width", x_bar.bandwidth() - 10)
        .attr("height", function (d) {
            return yMax - y_bar(d[valu]);
        }).attr('fill', d =>
        Color(d[valu])
    )
        .attr("transform", "translate(25,-20)");
    bar.exit().transition().duration(500).remove()
}

function graphMouseOver_fromGraph(event) {
    let iso = event.target.__data__.iso_code
    bar_svg.select('.' + iso).transition().duration(500)
        .attr('fill', 'orange')
    bar_svg.append("text").transition().duration(500)
        .attr('class', 'label-text')
        .attr('transform', 'translate( ' + (x_bar(event.target.__data__.country) + x_bar.bandwidth() / 2 + 20) + ', ' + (yMax - event.target.attributes.height.nodeValue - 10) + ' )')
        .text(event.target.__data__.people_vac_per_hundred
        ).style("font", "10px sans-serif")
    onMouseOver_fromGraph(event);
}

function graphMouseOut_fromGraph(event) {
    let iso = event.target.__data__.iso_code
    bar_svg.select('.' + iso).transition().duration(1000)
        .attr('fill', d =>
            Color(d.people_vac_per_hundred)
        )
    d3.selectAll('.label-text').transition().duration(500)
        .remove()
    onMouseOut_fromGraph(event);
}

function graphMouseOver_fromMap(event) {
    let iso = event.target.__data__.properties.iso_code
    let val = event.target.__data__.properties.people_vac_per_hundred
    let country = event.target.__data__.properties.country
    bar_svg.select('.' + iso).transition().duration(500).attr('fill', 'orange')
    bar_svg.append("text").transition().duration(500)
        .attr('class', 'label-text')
        .attr('transform', 'translate( ' + (x_bar(country) + x_bar.bandwidth() / 2 + 20) + ', ' + (y_bar(val) - 10) + ' )')
        .text(val)
        .style("font", "10px sans-serif")
}

function graphMouseOut_fromMap(event) {
    let iso = event.target.__data__.properties.iso_code
    bar_svg.select('.' + iso).transition().duration(1000).attr('fill', d =>
        Color(d.people_vac_per_hundred)
    )
}

function graphMouseOver_fromGraphUpd(event) {
    let iso = event.target.__data__.iso_code
    bar_svg.select('.' + iso).transition().duration(500)
        .attr('fill', 'orange')
    bar_svg.append("text")
        .attr('class', 'label-text')
        .attr('transform', 'translate( ' + (x_bar(event.target.__data__.country) + x_bar.bandwidth() / 2 + 20) + ', ' + (yMax - event.target.attributes.height.nodeValue - 10) + ' )')
        .text(event.target.__data__[valu])
        .style("font", "10px sans-serif")
    onMouseOver_fromGraph(event);
}

function graphMouseOut_fromGraphUpd(event) {
    let iso = event.target.__data__.iso_code
    bar_svg.select('.' + iso).transition().duration(1000)
        .attr('fill', d =>
            Color(d[valu])
        )
    d3.selectAll('.label-text')
        .remove()
    onMouseOut_fromGraphUpd(event);
}

function graphMouseOver_fromMapUpd(event) {
    let iso = event.target.__data__.properties.iso_code
    let val = event.target.__data__.properties[valu]
    let country = event.target.__data__.properties.country
    bar_svg.select('.' + iso).transition().duration(500)
        .attr('fill', 'orange')
    bar_svg.append("text").transition().duration(500)
        .attr('class', 'label-text')
        .attr('transform', 'translate( ' + (x_bar(country) + x_bar.bandwidth() / 2 + 20) + ', ' + (y_bar(val) - 10) + ' )')
        .text(val)
        .style("font", "10px sans-serif")
}

function graphMouseOut_fromMapUpd(event) {
    let iso = event.target.__data__.properties.iso_code
    bar_svg.select('.' + iso).transition().duration(1000)
        .attr('fill', d =>
            Color(d[valu])
        )
}
