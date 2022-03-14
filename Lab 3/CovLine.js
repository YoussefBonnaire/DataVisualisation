function showLineGraph() {
    const xMax = width_line - margin * 2;
    const yMax = height_line - margin;
    const line_data = getCountryData();

    // X Axis
    const x_line = d3.scaleTime()
        .rangeRound([0, xMax]);

    // Y Axis
    const y_line = d3.scaleLinear()
        .rangeRound([yMax, 10]);

    line_data.then(data => {
        let values = getMinMax(data['Canada'], d => d.tot_cases_per_mil);
        let dates = getMinMax(data['Canada'], d => d.date)
        x_line.domain([new Date(dates.min_value), new Date(dates.max_value)])
        y_line.domain([0, values.max_value])
        // Bottom axis
        line_svg.append("g")
            .attr('class', 'chart-xaxis')
            .attr("transform", "translate(40," + yMax + ")")
            .call(d3.axisBottom(x_line).tickFormat(d3.timeFormat("%b-%Y")))
        // left y axis
        line_svg.append("g")
            .attr('class', 'chart-yaxis')
            .attr("transform", "translate(40,0)")
            .call(d3.axisLeft(y_line));
        // for (const [_, value] of Object.entries(data['Canada'])) {
        // console.log(value)
        // Add the line
        line_svg.select('g')
            .attr('class', 'chart')
            .append("path")
            .attr('class', 'line')
            .datum(data['Canada'])
            .attr('fill', 'none')
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1)
            .attr("d", d3.line()
                .x(function (d) {
                    // console.log(d.date)
                    return x_line(new Date(d.date))
                })
                .y(function (d) {
                    // console.log(d)
                    return y_line(d.tot_cases_per_mil)
                })
            )
            .attr("transform", "translate(20,-20)")
        currentData = data['Canada'].filter(d => formatDate(slider.value()) === formatDate(new Date(d.date)))
        // Add points
        line_svg.select('g')
            .selectAll("dot")
            .data(currentData)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return x_line(new Date(d.date))
            })
            .attr("cy", function (d) {
                return y_line(d.tot_cases_per_mil)
            })
            .on("mouseover", hoverDot) //Add listener for the mouseover event
            .on("mouseout", hoverAwayDot) //Add listener for the mouseover event
            .attr("r", 4)
            .style("fill", "red")
            .attr('class', 'pulse')
            .attr("transform", "translate(20,-20)");
        line_svg.select('g')
            .append("text")
            .attr('class', 'chart-Title')
            .attr("x", (xMax / 2 + 10))
            .attr("y", 10)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .style("text-decoration", "underline")
            .text(currentData.map(d => d.country) + ' Covid cases per million');
        // }
    })
}

function hoverDot(d) {
    data = d.explicitOriginalTarget.__data__
    d3.select(this).transition().duration(1000)
        .attr('r', 6)
    box = line_svg.select('g').append('svg').attr('class', 'information_box')
        .attr('width', 150)
        .attr('height', 200)
        .attr('transform', 'translate(24,-10)')
        .attr('style', 'outline: thick solid rgba(89, 82, 46, 0.97);');
    box
        .append("rect")
        .attr("width", "0%")
        .attr("height", "0%")
        .transition()
        .duration(1000)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "beige")
    box
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .transition()
        .duration(1000)
        .attr("x", 0)
        .attr("y", 20)
        .style("font-size", "12px")
        .text('Current Date : ' + currentData.map(d => d.date))
    box
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .transition()
        .duration(1000)
        .attr("x", 0)
        .attr("y", 35 + 10)
        .style("font-size", "12px")
        .text('Total cases/million : ' + currentData.map(d => d.tot_cases_per_mil))
    box
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .transition()
        .duration(1000)
        .attr("x", 0)
        .attr("y", 50 + 20)
        .style("font-size", "12px")
        .text('Total deaths/million : ' + currentData.map(d => d.tot_deaths_per_hundred))
    box
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .transition()
        .duration(1000)
        .attr("x", 0)
        .attr("y", 65 + 30)
        .style("font-size", "12px")
        .text('People vaccinated/100 : ' + currentData.map(d => d.people_vac_per_hundred))
    box
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .transition()
        .duration(1000)
        .attr("x", 0)
        .attr("y", 80 + 40)
        .style("font-size", "12px")
        .text('Fully vaccinated/100 : ' + currentData.map(d => d.full_vac_per_hundred))
    box
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .transition()
        .duration(1000)
        .attr("x", 0)
        .attr("y", 95 + 50)
        .style("font-size", "12px")
        .text('Boost vaccinated/100 : ' + currentData.map(d => d.boosted_per_hundred))
}

function hoverAwayDot() {
    d3.select(this).transition().duration(1000)
        .attr('r', 4)
}

function getMinMax(data, key) {
    // find Max
    max_value = 0
    min_value = 0
    flat = []
    flat.push(data.map(key))

    max_value = d3.max(d3.max(flat))
    min_value = d3.min(d3.min(flat))
    return {max_value, min_value};

}