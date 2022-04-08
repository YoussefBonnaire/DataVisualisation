function showPie() {
    data_byDate.then(data => {
        let trade_data = data[min_date];
        trade_data.sort((a, b) => d3.descending(a.tradecount, b.tradecount))
        var pie = d3.pie()
            .sort(null)
        path
            .data(pie(trade_data.map(d => d.tradecount)))
            .enter()
            .append("path")
            .attr('class', 'piechart')
            .merge(path)
            .transition()
            .duration(1000)
            .attr("fill", d => colorscale(trade_data.filter(i => i.tradecount === d.value)[0].symbol))
            .attr("d", arc)
            .attrTween("d", function (d) {
                var i = d3.interpolate(d.endAngle, d.startAngle);
                return function (t) {
                    d.startAngle = i(t);
                    return arc(d);
                }
            });
    })
}

function updateTrades(date) {
    data_byDate.then(data => {
        let trade_data = data[formatDate_data(date)];
        trade_data.sort((a, b) => d3.descending(a.tradecount, b.tradecount))
        var pie = d3.pie()
            .sort(null)
        var paths = trades_svg.select('g').selectAll("path")
            .data(pie(trade_data.map(d => d.tradecount)))
        changeExistingPath(paths);
        addAdditionalPath(paths, trade_data);
        removeOldPath(paths);
    })
}

function changeExistingPath(paths) {
    paths
        .transition()
        .duration(1000)
        .attrTween("d", transitionArc)
}

function addAdditionalPath(paths, data) {
    paths
        .enter()
        .append("path")
        .attr('class', 'piechart')
        .merge(path)
        .transition()
        .duration(1000)
        .attr("fill", function (d) {
            if (typeof data.filter(i => i.tradecount === d.value)[0] !== "undefined") {
                return colorscale(data.filter(i => i.tradecount === d.value)[0].symbol);
            }
        })
        .attr("d", arc)
        .attrTween("d", function (d) {
            var i = d3.interpolate(d.endAngle, d.startAngle);
            return function (t) {
                d.startAngle = i(t);
                return arc(d);
            }
        });
}

function removeOldPath(paths) {
    paths.exit()
        .transition().duration(1000)
        .attrTween('d', removeArcTween)
        .remove()
}

function transitionArc(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function (t) {
        return arc(i(t));
    };
}

function removeArcTween(a) {
    var i = d3.interpolate(a.startAngle, a.endAngle);
    return function (t) {
        a.startAngle = i(t);
        return arc(a);
    };
}
