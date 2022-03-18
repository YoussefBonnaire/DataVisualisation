/*
Function called in main setting up initial map
 */
function DrawMap() {
    // Add spherical shape to earth (background)
    g.append('path')
        .attr('class', 'sphere')
        .attr('d', pathGenerator({type: 'Sphere'}))
        .attr('fill', 'rgba(65, 82, 166, 0.97)');

    Countries.then(countries => {
        // Set domain of colors
        Color.domain([0, 100])
        // draw countries
        g.selectAll('path').data(countries.features)
            .enter().append('path')
            .attr('class', 'country')
            .attr('id', d => d.properties.iso_code)
            .attr('d', pathGenerator)
            .attr('fill', d => {
                if (typeof value(d) === "undefined") {
                    return 'red';
                } else {
                    return Color(value(d));
                }
            })
            .attr('stroke', 'rgba(96, 90, 90, 0.97)')
            .on("mouseover", onMouseOver) //Add listener for the mouseover event
            .on("mouseout", onMouseOut) //Add listener for the mouseout event
            .on('click', top10_)
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

let chosen;

/*
Function called when slider or dropdown are changed, updates the map to dropdown value and date
 */
function UpdateMap(value, date) {
    chosen = value;
    Countries.then(countries => {
        // if date remains the same change dropdown value with same data as before (remnance of old method of
        // data gathering)
        if (countries.features.map(d => d.properties.date)[0] === formatDate(date)) {
            // Set domain of colors
            Color.domain([0, 100])
            // Change country colors based on new dropdown
            d3.selectAll('.country').transition().duration(1000).attr('fill', d => {
                if (typeof value(d) === "undefined") {
                    return 'red';
                } else {
                    return Color(value(d));
                }

            })
                .attr('stroke', 'rgba(96, 90, 90, 0.97)')
            // Change hover on each country for updated values
            d3.selectAll('.country')
                .on("mouseover", onMouseOverUpd(value)) //Add listener for the mouseover event
                .on("mouseout", onMouseOutUpd(value)) //Add listener for the mouseout event
                .on('click', top10_)
                .select('title')
                .text(d => {
                    if (value(d) === "" || typeof value(d) === "undefined") {
                        return d.properties.name + ': N/A';
                    } else {
                        return d.properties.name + ': ' + value(d);
                    }
                })
            return null;
        }
        // Get data on new date (Covmap/CovLine has new data retrieval which allows for fewer calls)
        Countries = getCountries(vaccdat, country_dataless, formatDate(date))
        // Adds countries instead of simply transitioning due to glicthes between slider change and visual
        Countries.then(countries => {
                // Removes country, happens without issues on mine, but aware of issues it may cause on other clients
                d3.selectAll('.country').remove();
                // add countries
                g.selectAll('path').data(countries.features)
                    .enter().append('path')
                    .attr('class', 'country')
                    .attr('id', d => d.properties.iso_code)
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
                // Color scale and axis on bottom added here to ensure it appears infront of Antarctica
                d3.selectAll('.color-rect').remove()
                g.append('rect')
                    .attr('class', 'color-rect')
                    .attr('x', 20)
                    .attr('width', width_map - 60)
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

/*
 Highlights country and adds text when country in map is hovered over
 */
function onMouseOver(event) {
    // highlight country
    d3.select(this).transition().duration(500)
        .attr('fill', 'orange')
    country = event.target.__data__
    // add label to country
    g.append("text")
        .attr('class', 'label-text').transition().duration(500)
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
    // Call VaccBar function to highlight corresponding bar
    graphMouseOver_fromMap(event);
}

/*
 unHighlights country and removes text when country in map is hovered over
 */
function onMouseOut(event) {
    // Change color back
    d3.select(this).transition().duration(1000)
        .attr('fill', d => {
            if (typeof value(d) === "undefined") {
                return 'red';
            } else {
                return Color(value(d));
            }
        });
    // Remove label
    d3.selectAll('.label-text')
        .remove()
    // Call VaccBar function to unhighlight corresponding bar
    graphMouseOut_fromMap(event);
}

/*
Function called in VaccBar by rectangles being hovered over, adds highlight to country
 */
function onMouseOver_fromGraph(event) {
    country = event.target.__data__
    // Highlight country
    map_svg.select('#' + country.iso_code).transition().duration(500)
        .attr('fill', 'orange')
}

/*
Function called in VaccBar by rectangles being hovered out, unhighlights to country
 */
function onMouseOut_fromGraph(event) {
    country = event.target.__data__
    // change color back
    d3.select('#' + country.iso_code).transition().duration(1000)
        .attr('fill', d => {
            if (typeof value(d) === "undefined") {
                return 'red';
            } else {
                if (typeof d.people_vac_per_hundred !== 'undefined') {
                    return Color(d[dropdown_choice])
                } else {
                    return Color(d.properties[dropdown_choice])
                }

                return Color(value(d));
            }
        });
    // remove all labels
    d3.selectAll('.label-text')
        .remove()
}

/*
 Highlights country and adds text when country in updated map is hovered over
 */
function onMouseOverUpd(value) {
    return function (event) {
        // Highlight country
        d3.select(this).transition().duration(500)
            .attr('fill', 'orange');
        country = event.target.__data__
        // Add label
        g.append("text")
            .attr('class', 'label-text')
            .transition().duration(500)
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
        // call updated VaccBar function
        graphMouseOver_fromMapUpd(event);
    };
}

/*
 Unhighlights country and removes text when country in updated map is hovered over
 */
function onMouseOutUpd(value) {
    return function (event) {
        // change color back
        d3.select(this).transition().duration(1000)
            .attr('fill', d => {
                if (typeof value(d) === "undefined") {
                    return 'red';
                } else {
                    return Color(value(d));
                }
            });
        // Remove all labels
        d3.selectAll('.label-text').transition().duration(500)
            .remove()
        // Call VaccBar function to remove vacc bar highlight/label
        graphMouseOut_fromMapUpd(event);
    };
}

/*
 Unhighlights country and removes text when country in updated graph is hovered over
 */
function onMouseOut_fromGraphUpd(event) {
    country = event.target.__data__
    // Change color back
    d3.select('#' + country.iso_code).transition()
        .duration(1000).attr('fill', d => {
        if (typeof chosen(d) === "undefined") {
            return 'red';
        } else {
            return Color(chosen(d));
        }
    });
    // Remove all Labels
    d3.selectAll('.label-text').transition().duration(500)
        .remove()
}

/*
Allows for brushing action in map
 */
function selectBrush({selection}) {
    Countries.then(countries => {
        // Find selected countries
        selected = countries.features.filter(d => {
            return pathGenerator.centroid(d)[0] >= selection[0][0] && pathGenerator.centroid(d)[0] <= selection[1][0] && pathGenerator.centroid(d)[1] >= selection[0][1] && pathGenerator.centroid(d)[1] <= selection[1][1]
        })
        // Call VaccBar function to update chart with selected countries
        populateBar(selected);
    })
}