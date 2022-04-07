function DrawChart() {
    data_byDate.then(data => {
        let start_data = data[min_date]
        start_data.sort(function (a, b) {
            return d3.descending(a.marketcap, b.marketcap)
        })
        let min_mc = d3.min(start_data.map(d => d.marketcap));
        let max_mc = d3.max(start_data.map(d => d.marketcap));
        xscale_race.domain([min_mc, (max_mc + 1000000000000)])
        yscale_race.domain(start_data.map(d => d.symbol))
        x_axis_race.call(d3.axisTop(xscale_race))
        y_axis_race.call(d3.axisLeft(yscale_race))
        race_bar.data(start_data)
            .enter()
            .append("rect")
            .attr('id', d => d.symbol)
            .attr("fill", d => colorscale(d.symbol))
            .attr("x", xscale_race(min_mc))
            .attr("y", d => yscale_race(d.symbol))
            .attr("width", d => xscale_race(d.marketcap))
            .attr("height", yscale_race.bandwidth())
    })
}