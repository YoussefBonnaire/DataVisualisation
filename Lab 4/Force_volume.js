function ShowVolume() {
    data_byDate.then(data => {
        let volume_data = data[min_date];
        volume_data.sort((a, b) => d3.descending(a.volume, b.volume))
        var pie = d3.pie()
            .sort(null)
        path_volume
            .data(pie(volume_data.map(d => d.volume)))
            .enter()
            .append("path")
            .attr('class', 'piechart_v')
            .merge(path)
            .transition()
            .duration(1000)
            .attr("fill", d => colorscale(volume_data.filter(i => i.volume === d.value)[0].symbol))
            .attr("d", arc_volume)
            .attrTween("d", function (d) {
                var i = d3.interpolate(d.endAngle, d.startAngle);
                return function (t) {
                    d.startAngle = i(t);
                    return arc_volume(d);
                }
            });
    })
}

function updateVolume(date) {
    data_byDate.then(data => {
        let volume_data = data[formatDate_data(date)];
        volume_data.sort((a, b) => d3.descending(a.volume, b.volume))
        var pie = d3.pie()
            .sort(null)
        var paths_vol = force_svg.select('g').selectAll("path")
            .data(pie(volume_data.map(d => d.volume)))
        changeExistingPath_vol(paths_vol);
        addAdditionalPath_vol(paths_vol, volume_data);
        removeOldPath_vol(paths_vol);
    })
}

function changeExistingPath_vol(paths) {
    paths
        .transition()
        .duration(1000)
        .attrTween("d", transitionArc)
}

function addAdditionalPath_vol(paths, data) {
    paths
        .enter()
        .append("path")
        .attr('class', 'piechart_v')
        .merge(path_volume)
        .transition()
        .duration(1000)
        .attr("d", arc_volume)
        .attr("fill", function (d) {
            if (typeof data.filter(i => i.volume === d.value)[0] !== "undefined") {
                return colorscale(data.filter(i => i.volume === d.value)[0].symbol);
            }
        })
        .attrTween("d", function (d) {
            var i = d3.interpolate(d.endAngle, d.startAngle);
            return function (t) {
                d.startAngle = i(t);
                return arc_volume(d);
            }
        });
}

function removeOldPath_vol(paths) {
    paths.exit()
        .transition().duration(1000)
        .attrTween('d', removeArcTween)
        .remove();
}

function transitionArc(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function (t) {
        return arc_volume(i(t));
    };
}

function removeArcTween(a) {
    var i = d3.interpolate(a.startAngle, a.endAngle);
    return function (t) {
        a.startAngle = i(t);
        return arc_volume(a);
    };
}


// function ShowVolume() {
//     data_byDate.then(data => {
//         let force_data = data[min_date];
//         force_data.sort((a, b) => d3.descending(a.volume, b.volume))
//         radius_vol = d3.scaleLinear()
//             .domain([0, d3.max(force_data.map(d => d.volume))])
//             .range([0, 100])
//         d3.forceSimulation().nodes(force_data)
//             .force('center', d3.forceCenter(350, 175))
//             .force('charge', d3.forceManyBody().strength(10))
//             .force('collision', d3.forceCollide().radius(function (d) {
//                 return radius_vol(d.volume)
//             }))
//             .on('tick', ticked);
//
//
//         function ticked() {
//             var u = d3.select('.force_svg').select('g')
//                 .selectAll('circle')
//                 .data(force_data)
//                 .join('circle')
//                 // specify color of circle based on data
//                 .attr('fill', d => colorscale(d.symbol))
//                 .attr('r', d => radius_vol(d.volume))
//                 .attr('cx', width_line / 2)
//                 .attr('cy', height_line / 2)
//         }
//
//     })
// }
//
// function updateVolume(date) {
//     data_byDate.then(data => {
//         let trade_data = data[formatDate_data(date)];
//         trade_data.sort((a, b) => d3.descending(a.volume, b.volume))
//         radius = d3.scaleLinear()
//             .domain([0, d3.max(trade_data.map(d => d.volume))])
//             .range([0, 100])
//         d3.forceSimulation().nodes(trade_data)
//             .force('center', d3.forceCenter(350, 175))
//             .force('charge', d3.forceManyBody().strength(10))
//             .force('collision', d3.forceCollide().radius(function (d) {
//                 return radius(d.volume)
//             }))
//             .on('tick', ticked);
//
//         function ticked() {
//             var u = d3.select('.force_svg').select('g')
//                 .selectAll('circle')
//                 .data(trade_data)
//                 .join('circle')
//                 .transition().duration(100)
//                 // specify color of circle based on data
//                 .attr('fill', d => colorscale(d.symbol))
//                 .attr('r', d => radius(d.volume))
//                 .attr('cx', width_line / 2)
//                 .attr('cy', height_line / 2)
//         }
//
//     })
// }
