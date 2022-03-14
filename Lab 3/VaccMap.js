function DrawMap() {
    // Add spherical shape to earth (background)
    g.append('path')
        .attr('class', 'sphere')
        .attr('d', pathGenerator({type: 'Sphere'}))
        .attr('fill', 'rgba(65, 82, 166, 0.97)');

    Countries.then(countries => {
        min = d3.min(countries.features.map(value))
        max = d3.max(countries.features.map(value))
        // Set domain of colors
        Color.domain([0, 100])
        // draw countries
        g.selectAll('path').data(countries.features)
            .enter().append('path')
            .attr('class', 'country')
            .attr('d', pathGenerator)
            .attr('fill', d => {
                if (typeof value(d) === "undefined") {
                    return 'red';
                } else {
                    return Color(value(d));
                }

            })
            .on("mouseover", onMouseOver) //Add listener for the mouseover event
            .on("mouseout", onMouseOut) //Add listener for the mouseout event
            // .on('click', showLineGraph)
            .append('title')
            .text(d => {
                if (value(d) === "" || typeof value(d) === "undefined") {
                    return d.properties.name + ': N/A';
                } else {
                    return d.properties.name + ': ' + value(d);
                }
            })
        // Set the gradient for the legend
        g.append("linearGradient")
            .attr("id", "line-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 20)
            .attr("y1", 0)
            .attr("x2", width_map - 40)
            .attr("y2", 0)
            .selectAll("stop")
            .data([
                {offset: "0%", color: "red"},
                {offset: "100%", color: 'rgba(84, 229, 55, 0.97)'}
            ])
            .enter().append("stop")
            .attr("offset", function (d) {
                return d.offset;
            })
            .attr("stop-color", function (d) {
                return d.color;
            });
        // Add legend block
        const legend = g.append('rect')
            .attr('class', 'color-rect')
            .attr('x', 20)
            .attr('width', width_map - 40)
            .attr('y', height_map - 25)
            .attr('height', 25)
            .attr('fill', 'url(#line-gradient)')
        // set x scale domain
        x.domain([0, 100]);
        // Add axis
        axis = d3.axisBottom(x).ticks(10)
        g.append("g")
            .attr('class', 'Xaxis')
            .attr("transform", "translate(0," + (height_map - 25) + ")")
            .call(axis)
    });
}

function onMouseOver(event) {
    d3.select(this).attr('fill', 'orange')
    country = event.target.__data__
    g.append("text")
        .attr('class', 'label-text')
        .attr('transform', function () {
            x = pathGenerator.centroid(country)[0];
            y = pathGenerator.centroid(country)[1];
            return 'translate( ' + (x - 10) + ', ' + y + ' )'
        })
        .text(d => {
            if (value(country) === "" || typeof value(country) === "undefined") {
                return 'N/A';
            } else {
                return value(country);
            }
        }).style("font", "10px sans-serif")

}

function onMouseOut() {
    d3.select(this).attr('fill', d => {
        if (typeof value(d) === "undefined") {
            return 'red';
        } else {
            return Color(value(d));
        }
    });

    d3.selectAll('.label-text')
        .remove()
}

function UpdateMap(value, date) {
    Countries.then(countries => {
        if (countries.features.map(d => d.properties.date)[0] === formatDate(date)) {
            max = d3.max(countries.features.map(value))
            // Set domain of colors
            Color.domain([0, 100])
            d3.selectAll('.country').transition().duration(1000).attr('fill', d => {
                if (typeof value(d) === "undefined") {
                    return 'red';
                } else {
                    return Color(value(d));
                }

            })
            d3.selectAll('.country')
                .on("mouseover", onMouseOverUpd(value)) //Add listener for the mouseover event
                .on("mouseout", onMouseOutUpd(value)) //Add listener for the mouseout event
                .select('title')
                .text(d => {
                    if (value(d) === "" || typeof value(d) === "undefined") {
                        return d.properties.name + ': N/A';
                    } else {
                        return d.properties.name + ': ' + value(d);
                    }
                })
            // set x scale domain
            var x = d3.scaleLinear()
                .range([20, width_map - 20])
                .domain([0, 100]);
            // Add axis
            axis = d3.axisBottom(x).ticks(10);
            // bottom axis
            g.selectAll(".Xaxis")
                .transition()
                .duration(1000)
                .call(d3.axisBottom(x))
            return null;
        }
        Countries = getCountries(vaccdat, country_dataless, formatDate(date))
        Countries.then(countries => {
                d3.selectAll('.country').remove();
                g.selectAll('path').data(countries.features)
                    .enter().append('path')
                    .attr('class', 'country')
                    .attr('d', pathGenerator)
                    .attr('fill', d => {
                        if (typeof value(d) === "undefined") {
                            return 'red';
                        } else {
                            return Color(value(d));
                        }

                    })
                    .on("mouseover", onMouseOverUpd) //Add listener for the mouseover event
                    .on("mouseout", onMouseOutUpd) //Add listener for the mouseout event
                    // .on('click', showLineGraph)
                    .append('title')
                    .text(d => {
                        if (value(d) === "" || typeof value(d) === "undefined") {
                            return d.properties.name + ': N/A';
                        } else {
                            return d.properties.name + ': ' + value(d);
                        }
                    })
                d3.selectAll('.color-rect').remove()
                g.append('rect')
                    .attr('class', 'color-rect')
                    .attr('x', 20)
                    .attr('width', width_map - 40)
                    .attr('y', height_map - 25)
                    .attr('height', 25)
                    .attr('fill', 'url(#line-gradient)')
                d3.selectAll(".Xaxis").remove()
                // set x scale domain
                var x = d3.scaleLinear().range([20, width_map - 20]).domain([0, 100]);
                // Add axis
                axis = d3.axisBottom(x).ticks(10);
                // bottom axis
                g.append("g")
                    .attr('class', 'Xaxis')
                    .attr("transform", "translate(0," + (height_map - 25) + ")")
                    .call(axis)

            }
        )
    })
}

function onMouseOverUpd(value) {
    return function (event) {
        d3.select(this).attr('fill', 'orange');
        country = event.target.__data__
        g.append("text")
            .attr('class', 'label-text')
            .attr('transform', function () {
                x = pathGenerator.centroid(country)[0];
                y = pathGenerator.centroid(country)[1];
                return 'translate( ' + (x - 10) + ', ' + y + ' )'
            })
            .text(d => {
                if (value(country) === "" || typeof value(country) === "undefined") {
                    return 'N/A';
                } else {
                    return value(country);
                }
            }).style("font", "10px sans-serif")
    };
}

function onMouseOutUpd(value) {
    return function () {
        d3.select(this).attr('fill', d => {
            if (typeof value(d) === "undefined") {
                return 'red';
            } else {
                return Color(value(d));
            }
        });

        d3.selectAll('.label-text')
            .remove()
    };
}