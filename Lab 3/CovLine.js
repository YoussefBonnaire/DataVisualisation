function showLineGraph() {
    const line_data = getCountryData();
    // X Axis
    let x_line = d3.scaleTime()
        .rangeRound([0, (xMax - 60)]);

    // Y Axis
    let y_line = d3.scaleLinear()
        .rangeRound([yMax, 50]);
    // Y Axis
    let y_line_deaths = d3.scaleLinear()
        .rangeRound([yMax, 50]);

    line_data.then(data => {
        let values = getMinMax(data['World'], d => d.tot_cases);
        let dates = getMinMax(data['World'], d => d.date)
        x_line.domain([new Date(dates.min_value), new Date(dates.max_value)])
        y_line.domain([0, values.max_value])
        // Bottom axis
        x_axis_line
            .call(d3.axisBottom(x_line).tickFormat(d3.timeFormat("%b-%Y")))
        // left y axis
        y_axis_line
            .call(d3.axisLeft(y_line));

        let values_deaths = getMinMax(data['World'], d => d.tot_deaths);
        y_line_deaths.domain([0, values_deaths.max_value])
        // Right y axis
        y_axis_line_deaths
            .call(d3.axisRight(y_line_deaths));
        // Add the line
        graph = line_svg.select('g')
            .attr('class', 'chart')
            .append("path")
            .attr('class', 'line')
            .datum(data['World'])
            .attr('fill', 'none')
            .attr("stroke", "red")
            .attr("stroke-width", 1)
            .attr("d", d3.line()
                .x(function (d) {
                    return x_line(new Date(d.date))
                })
                .y(function (d) {
                    return y_line(d.tot_cases)
                })
            )
            .attr("transform", "translate(20,-20)")
        // Add the line
        graph = line_svg.select('g')
            .attr('class', 'chart')
            .append("path")
            .attr('class', 'line')
            .datum(data['World'])
            .attr('fill', 'none')
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("d", d3.line()
                .x(function (d) {
                    return x_line(new Date(d.date))
                })
                .y(function (d) {
                    return y_line_deaths(d.tot_deaths)
                })
            )
            .attr("transform", "translate(20,-20)")
        dates = dateRange(dates.min_value, dates.max_value)
        currentData = data['World'].filter(d => dates.includes(d.date))

        // Add points
        dot = line_svg.select('g')
            .selectAll(".cases")
            .data(currentData)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return x_line(new Date(d.date))
            })
            .attr("cy", function (d) {
                return y_line(d.tot_cases)
            })
            .on("mouseover", hoverDot) //Add listener for the mouseover event
            .on("mouseout", hoverAwayDot) //Add listener for the mouseover event
            .attr("r", 4)
            .style("fill", "red")
            .attr('class', 'cases')
            .attr("transform", "translate(20,-20)");
        // Add points
        dot_d = line_svg.select('g')
            .selectAll(".deaths")
            .data(currentData)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return x_line(new Date(d.date))
            })
            .attr("cy", function (d) {
                return y_line_deaths(d.tot_deaths)
            })
            .on("mouseover", hoverDot) //Add listener for the mouseover event
            .on("mouseout", hoverAwayDot) //Add listener for the mouseover event
            .attr("r", 4)
            .style("fill", "black")
            .attr('class', 'deaths')
            .attr("transform", "translate(20,-20)");
        title = line_svg.select('g')
            .append("text")
            .attr('class', 'chart-Title')
            .attr("x", (xMax / 2 + 10))
            .attr("y", 10)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .style("text-decoration", "underline")
            .text(currentData.map(d => d.country)[0] + ' Covid and Deaths cases per million');
        return {graph, dot, title}
    })
}

function hoverDot(d) {
    data = d.explicitOriginalTarget.__data__
    UpdateCovMap(data.date)
    d3.select(this).transition().duration(1000)
        .attr('r', 6)
    box = line_svg.select('g').append('svg').attr('class', 'information_box')
        .attr('width', 150)
        .attr('height', 160)
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
        .text('Current Date : ' + data.date)
    box
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .transition()
        .duration(1000)
        .attr("x", 0)
        .attr("y", 35 + 10)
        .style("font-size", "12px")
        .text('Total cases/million : ' + data.tot_cases)
    box
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .transition()
        .duration(1000)
        .attr("x", 0)
        .attr("y", 50 + 20)
        .style("font-size", "12px")
        .text('Total deaths/million : ' + data.tot_deaths)
    box
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .transition()
        .duration(1000)
        .attr("x", 0)
        .attr("y", 65 + 30)
        .style("font-size", "12px")
        .text('People vaccinated/100 : ' + data.people_vac_per_hundred)
    box
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .transition()
        .duration(1000)
        .attr("x", 0)
        .attr("y", 80 + 40)
        .style("font-size", "12px")
        .text('Fully vaccinated/100 : ' + data.full_vac_per_hundred)
    box
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .transition()
        .duration(1000)
        .attr("x", 0)
        .attr("y", 95 + 50)
        .style("font-size", "12px")
        .text('Boost vaccinated/100 : ' + data.boosted_per_hundred)
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

function dateRange(startDate, endDate) {
    var start = startDate.split('-');
    var end = endDate.split('-');
    var startYear = parseInt(start[0]);
    var endYear = parseInt(end[0]);
    var dates = [];

    for (var i = startYear; i <= endYear; i++) {
        var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
        var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
        for (var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
            var month = j + 1;
            var displayMonth = month < 10 ? '0' + month : month;
            dates.push([i, displayMonth, '01'].join('-'));
        }
    }
    return dates;
}