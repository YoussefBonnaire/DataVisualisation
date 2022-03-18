/*
Get line data, data is all the timed data grouped by country
 */
const line_data = getCountryData();

/*
Show the initial line graph with the world data for general overview of covid
 */
function showLineGraph() {
    // X Axis scale
    const x_line = d3.scaleTime()
        .rangeRound([0, (xMax - 60)]);

    // Left Y Axis scale
    const y_line = d3.scaleLinear()
        .rangeRound([yMax, 50]);
    // Right Y Axis scale
    const y_line_deaths = d3.scaleLinear()
        .rangeRound([yMax, 50]);
    line_data.then(data => {
        // Get extents of the data for the axis
        let values = getMinMax(data['OWID_WRL'], d => d.tot_cases);
        let values_deaths = getMinMax(data['OWID_WRL'], d => d.tot_deaths);
        let dates = getMinMax(data['OWID_WRL'], d => d.date);
        x_line.domain([new Date(dates.min_value), new Date(dates.max_value)]);
        y_line.domain([0, values.max_value]);
        y_line_deaths.domain([0, values_deaths.max_value])
        // Bottom axis
        x_axis_line
            .call(d3.axisBottom(x_line).tickFormat(d3.timeFormat("%b-%Y")))
        // left y axis
        y_axis_line
            .call(d3.axisLeft(y_line));
        // Right y axis
        y_axis_line_deaths
            .call(d3.axisRight(y_line_deaths));
        // Add the cases line
        let graph_cases = line_svg.select('g')
            .attr('class', 'chart')
            .append("path")
            .attr('class', 'case_line')
            .datum(data['OWID_WRL'])
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
        // Add the deaths line
        let graph_deaths = line_svg.select('g')
            .attr('class', 'chart')
            .append("path")
            .attr('class', 'death_line')
            .datum(data['OWID_WRL'])
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
        // Get monthly dates for monthly dots
        dates = dateRange(dates.min_value, dates.max_value)
        // Set data to monthly data
        let currentData = data['OWID_WRL'].filter(d => dates.includes(d.date))
        // Add points for cases
        let dot = line_svg.select('g')
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
        // Add points for deaths
        let dot_d = line_svg.select('g')
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
        // Add chart title
        let title = line_svg.select('g')
            .append("text")
            .attr('class', 'chart-Title')
            .attr("x", (xMax / 2 + 50))
            .attr("y", 10)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .style("text-decoration", "underline")
            .text(currentData.map(d => d.country)[0] + ' Covid/Deaths cases per million');
    })
}

/*
Update the line graph when a country is selected on the map
 */
function UpdateLine(event) {
    // X Axis
    const x_line = d3.scaleTime()
        .rangeRound([0, (xMax - 60)]);
    // Y Axis left
    const y_line = d3.scaleLinear()
        .rangeRound([yMax, 50]);
    // Y Axis right
    const y_line_deaths = d3.scaleLinear()
        .rangeRound([yMax, 50]);
    line_data.then(data => {
        // Use the data for the country which has been clicked
        data = data[event.target.id]
        // Get extents of the data for the axis
        let values = getMinMax(data, d => d.tot_cases);
        let values_deaths = getMinMax(data, d => d.tot_deaths);
        let dates = getMinMax(data, d => d.date)
        x_line.domain([new Date(dates.min_value), new Date(dates.max_value)])
        y_line_deaths.domain([0, values_deaths.max_value])
        y_line.domain([0, values.max_value])
        // Bottom axis
        x_axis_line.transition().duration(1000)
            .call(d3.axisBottom(x_line).tickFormat(d3.timeFormat("%b-%Y")))
        // left y axis
        y_axis_line.transition().duration(1000)
            .call(d3.axisLeft(y_line));
        // Right y axis
        y_axis_line_deaths.transition().duration(1000)
            .call(d3.axisRight(y_line_deaths));
        // Move the cases line
        let graph_cases = line_svg.select('.case_line')
            .attr('id', event.target.id + '_line')
            .datum(data)
        graph_cases
            .merge(graph_cases)
            .transition().duration(1000)
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
        // Move the death line
        let graph_deaths = line_svg.select('.death_line')
            .attr('id', event.target.id + '_line')
            .datum(data)
        graph_deaths
            .merge(graph_deaths)
            .transition().duration(1000)
            .attr('fill', 'none')
            .attr("stroke", "black")// ADD DASH AND DOTS FOR LINE DIFFERENTIATION CREATED IN FILE, INITIALISED IN SHOWLINEGRAPH
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
        let currentData = data.filter(d => dates.includes(d.date))

        // Move points for cases
        let dot = line_svg.select('g')
            .selectAll(".cases")
            .data(currentData)
            .on("mouseover", hoverDotupd) //Add listener for the mouseover event
            .on("mouseout", hoverAwayDot) //Add listener for the mouseover event;
        dot.merge(dot).transition().duration(1000)
            .attr("cx", function (d) {
                return x_line(new Date(d.date))
            })
            .attr("cy", function (d) {
                return y_line(d.tot_cases)
            })
        dot.exit().remove()
        // Move points for deaths
        dot_d = line_svg.select('g')
            .selectAll(".deaths")
            .data(currentData)
            .on("mouseover", hoverDotupd) //Add listener for the mouseover event
            .on("mouseout", hoverAwayDot) //Add listener for the mouseover event;
        dot_d.merge(dot_d).transition().duration(1000)
            .attr("cx", function (d) {
                return x_line(new Date(d.date))
            })
            .attr("cy", function (d) {
                return y_line_deaths(d.tot_deaths)
            })
        dot_d.exit().remove()
        // Update title
        let title = line_svg.select('.chart-Title').transition().duration(1000)
            .text(currentData.map(d => d.country)[0] + ' Covid and Deaths cases per million');
    })
}

/*
Show box with data for specific country on specific date and call function to change data on the map to that specific
date when hovering over the circles
 */
function hoverDot(d) {
    data = d.explicitOriginalTarget.__data__
    // Function in CovMap to change map data
    UpdateCovMap(data.date)
    // Increase size of dot
    d3.select(this).transition().duration(1000)
        .attr('r', 6)
    // Populate info box for date and country
    editBox();
}

// Decrease size of dot when not hovering over it
function hoverAwayDot() {
    d3.select(this).transition().duration(1000)
        .attr('r', 4)
}

/*
Edit the box with up to date informtaion for dot hovered over
 */
function editBox() {
    // Add svg at top left of chart
    box = line_svg.select('g').append('svg').attr('class', 'information_box')
        .attr('width', 150)
        .attr('height', 160)
        .attr('transform', 'translate(24,-10)')
        .attr('style', 'outline: thick solid rgba(89, 82, 46, 0.97);');
    // Add background
    box
        .append("rect")
        .attr("width", "0%")
        .attr("height", "0%")
        .transition()
        .duration(1000)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "beige")
    // Add date
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
    // Add case number
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
    // Add death number
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
    // Add vacc number
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
    // Add fully vacc number
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
    // Add boosted number
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

/*
 Same as hover dot but called after a country has been selected therefore hightlight country and adds GDP to information.
 */
function hoverDotupd(d) {
    data = d.explicitOriginalTarget.__data__
    UpdateCovMapupd(data.iso_code, data.date)
    d3.select(this).transition().duration(1000)
        .attr('r', 6)
    editBox()
    // add gdp
    box
        .append("text")
        .attr("x", 0)
        .attr("y", 0)
        .transition()
        .duration(1000)
        .attr("x", 0)
        .attr("y", 95 + 65)
        .style("font-size", "12px")
        .text('GDP : ' + data.gdp)
}

/*
Custom helper function to get min and max
 */
function getMinMax(data, key) {
    // find Max
    let max_value = 0
    let min_value = 0
    let by_c = []
    by_c.push(data.map(key))

    max_value = d3.max(d3.max(by_c))
    min_value = d3.min(d3.min(by_c))
    return {max_value, min_value};
}

/*
Custom helper function to get first day of each month to space out the dots (could have tried to use interpolate)
 */
function dateRange(startDate, endDate) {
    let start = startDate.split('-');
    let end = endDate.split('-');
    let startYear = parseInt(start[0]);
    let endYear = parseInt(end[0]);
    let dates = [];

    for (let i = startYear; i <= endYear; i++) {
        let endMonth = i !== endYear ? 11 : parseInt(end[1]) - 1;
        let startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
        for (let j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
            var month = j + 1;
            var displayMonth = month < 10 ? '0' + month : month;
            dates.push([i, displayMonth, '01'].join('-'));
        }
    }
    return dates;
}