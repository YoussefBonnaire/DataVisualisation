function DrawLine() {
    data_byCoin.then(data => {
        xscale_line.domain([min_date, max_date])
        yscale_line.domain([0, 900000000000])
        x_axis_line.call(d3.axisBottom(xscale_line).tickFormat(d3.timeFormat("%b-%Y")))
        y_axis_line.call(d3.axisLeft(yscale_line))

        for (const coin of coins) {
            let line_data = data[coin];
            console.log(line_data)
        }
    })
}