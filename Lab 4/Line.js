function DrawLine() {
    line_graph.append('text')
        .attr('x', 100)
        .attr('y', 60)
        .attr('fill', 'white')
        .style("font-size", "26px")
        .text("Top Cryptocurrency Marketcaps")
    data_byCoin.then(data => {
        xscale_line.domain([new Date(min_date), new Date(max_date)])
        yscale_line.domain([0, 1.3e12])
        x_axis_line.call(d3.axisBottom(xscale_line).tickFormat(d3.timeFormat("%b-%Y")).ticks(9)).attr('stroke', 'white')
        y_axis_line.call(d3.axisLeft(yscale_line).tickFormat(d3.format("s"))).attr('stroke', 'white')

        for (const coin of coins) {
            let line_data = data[coin];
            line_graph
                .append("path")
                .attr('id', coin + "_line")
                .datum(line_data)
                .attr('fill', 'none')
                .attr("stroke", d => colorscale(coin))
                .attr("stroke-width", 1)
                .attr("d", d3.line()
                    .x(function (d) {
                        return xscale_line(new Date(d.date))
                    })
                    .y(function (d) {
                        return yscale_line(d.marketcap)
                    })
                )
            let start_dot = line_data.filter(d => {
                return formatDate_data(new Date(d.date)) === formatDate_data(new Date(2018, 1, 1))
            })
            // Add points
            if (start_dot !== []) {
                line_svg.select('g').selectAll("dot")
                    .data(start_dot)
                    .enter()
                    .append("circle")
                    .attr("cx", function (d) {
                        return xscale_line(new Date(d.date))
                    })
                    .attr("cy", function (d) {
                        return yscale_line(d.marketcap)
                    })
                    .attr("r", 2)
                    .style("fill", "red")
            }
        }

    })
}

function updateDot(date) {
    line_svg.select("g")
        .selectAll("circle")
        .transition().duration(500).attr('x', -600)
        .remove()
    data_byCoin.then(data => {
        for (const coin of coins) {
            let line_data = data[coin];
            let dot_data = line_data.filter(d => {
                return formatDate_data(new Date(d.date)) === formatDate_data(new Date(date))
            })
            // Add points
            let updtdot = line_svg.select("g")
                .selectAll("dot").data(dot_data)
            updtdot.enter()
                .append('circle')
                .merge(updtdot)
                .attr("cx", function (d) {
                    return xscale_line(new Date(d.date))
                })
                .attr("cy", function (d) {
                    return yscale_line(d.marketcap)
                })
                .attr("r", 2)
                .style("fill", "red")
            updtdot.exit()
                .transition().duration(500).attr('x', -600)
                .remove()
        }
    })
}

