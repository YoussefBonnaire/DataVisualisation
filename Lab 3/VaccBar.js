let x_bar = d3.scaleBand()
let y_bar = d3.scaleLinear()
let top10;
/*
Initialise Dropdown based choice
 */
let dropdown_choice;

/*
Initial function which shows bar chart for top 10 vaccine % by country
 */
function showBarChart() {
    const xMax = width_line - margin * 2;
    const yMax = height_line - margin;
    // Set choice
    dropdown_choice = dropdownButton.property('value');
    // Add color domain based on 100%. Can be changed to have maximum be the current max but does not visualise the
    // changing data as well
    Color.domain([0, 100])

    vaccdat.then(data => {
        // Choose data on the specified day
        let current_data = data[startdate];
        // Sort by highest chosen feature
        current_data.sort((a, b) => b.people_vac_per_hundred - a.people_vac_per_hundred);
        // Get top 10
        top10 = current_data.slice(0, 10);
        // X scale and Axis
        x_bar
            .rangeRound([0, xMax])
            .domain(top10.map(d => d.country));

        x_axis.transition().duration(1500)
            .call(d3.axisBottom(x_bar))
        // Y scale and Axis
        y_bar
            .rangeRound([yMax, 20])
            .domain([0, 100])
        y_axis.transition().duration(1500)
            .call(d3.axisLeft(y_bar))
        // Add rectangles for bar chart
        var bar = bar_svg.select('g').selectAll("rect")
            .data(top10)
        bar.enter()
            .append("rect")
            .attr('class', d => d.iso_code)
            .on('mouseover', graphMouseOver_fromGraph) // set listener for when mouse hovers over rectangle
            .on('mouseout', graphMouseOut_fromGraph) // set listener for when mouse moves away from rectangle
            .merge(bar)
            .transition()
            .duration(1000)
            .attr("x", function (d) {
                return x_bar(d.country);
            })
            .attr("y", function (d) {
                return y_bar(d.people_vac_per_hundred);
            })
            .attr("width", x_bar.bandwidth() - 10)
            .attr("height", function (d) {
                return yMax - y_bar(d.people_vac_per_hundred);
            }).attr('fill', d =>
            Color(d.people_vac_per_hundred)
        )
            .attr("transform", "translate(25,-20)");
        // Should never be needed but helps occasionally with artifacts
        bar.exit().transition().duration(500).remove()
    })
}

/*
Function called when dropdown or slider change to transition data to new dates
 */
function UpdateChart(val, date) {
    vaccdat.then(data => {
        // Specify new date
        let current_data = data[formatDate(date)]
        // Sort new data
        current_data.sort((a, b) => b[val] - a[val]);
        // Get new top 10
        top10 = current_data.slice(0, 10);
        // set dropdownchoice
        dropdown_choice = val
        //x scale and axis
        x_bar.domain(top10.map(d => d.country))
        x_axis.transition().duration(1500)
            .call(d3.axisBottom(x_bar))
        //Add rectangles for bar chart
        var bar = bar_svg.select('g').selectAll("rect")
            .data(top10)
        bar.enter()
            .append("rect")
            .merge(bar)
            .on('mouseover', graphMouseOver_fromGraphUpd) // set listener for when mouse hovers over rectangle
            .on('mouseout', graphMouseOut_fromGraphUpd) // set listener for when mouse moves away from rectangle
            .transition()
            .duration(1000)
            .attr('class', d => d.iso_code)
            .attr("x", function (d) {
                return x_bar(d.country);
            })
            .attr("y", function (d) {
                return y_bar(d[dropdown_choice]);
            })
            .attr("width", x_bar.bandwidth() - 10)
            .attr("height", function (d) {
                return yMax - y_bar(d[dropdown_choice]);
            }).attr('fill', d =>
            Color(d[dropdown_choice])
        )
            .attr("transform", "translate(25,-20)");
        bar.exit().transition().duration(500).remove()
    })
}

/*
Function called when a selection is made over multiple countries to change the bar chart with the data of these
countries
 */
function populateBar(countries) {
    // Sort data of countries selected
    countries.sort((a, b) => b.properties[dropdown_choice] - a.properties[dropdown_choice]);
    // x scale and axis
    x_bar.domain(countries.map(d => d.properties.country))
    x_axis.transition().duration(1500)
        .call(d3.axisBottom(x_bar))
    // Update bars
    var bar = bar_svg.select('g').selectAll("rect")
        .data(countries)
    bar.enter()
        .append("rect")
        .merge(bar)
        .on('mouseover', graphMouseOver_fromGraphUpd_sel) // set listener for when mouse hovers over rectangle
        .on('mouseout', graphMouseOut_fromGraphUpd_sel) // set listener for when mouse moves away from rectangle
        .transition()
        .duration(1000)
        .attr('class', d => d.properties.iso_code)
        .attr("x", function (d) {
            return x_bar(d.properties.country);
        })
        .attr("y", function (d) {
            return y_bar(d.properties[dropdown_choice]);
        })
        .attr("width", x_bar.bandwidth() - 10)
        .attr("height", function (d) {
            return yMax - y_bar(d.properties[dropdown_choice]);
        }).attr('fill', d =>
        Color(d.properties[dropdown_choice])
    )
        .attr("transform", "translate(25,-20)");
    bar.exit().transition().duration(500).remove()
}

/*
Function which adds country clicked in map to top 10 list (name change?)
 */
function top10_(event) {
    // Add new country to sort top 10
    top10.push(event.target.__data__.properties)
    // sort top10+
    top10.sort((a, b) => b[dropdown_choice] - a[dropdown_choice]);
    // x scale and axis
    x_bar.domain(top10.map(d => d.country))
    x_axis.transition().duration(1500)
        .call(d3.axisBottom(x_bar))
    // Update bars with new country
    let bar = bar_svg.select('g').selectAll("rect")
        .data(top10)
    bar
        .enter()
        .append("rect")
        .merge(bar)
        .on('mouseover', graphMouseOver_fromGraphUpd) // set listener for when mouse hovers over rectangle
        .on('mouseout', graphMouseOut_fromGraphUpd) // set listener for when mouse moves away from rectangle
        .transition()
        .duration(1000)
        .attr('class', d => d.iso_code)
        .attr("x", function (d) {
            return x_bar(d.country);
        })
        .attr("y", function (d) {
            return y_bar(d[dropdown_choice]);
        })
        .attr("width", x_bar.bandwidth() - 10)
        .attr("height", function (d) {
            return yMax - y_bar(d[dropdown_choice]);
        }).attr('fill', d =>
        Color(d[dropdown_choice])
    )
        .attr("transform", "translate(25,-20)");
    bar.exit().transition().duration(500).remove()
}

/*
Function called by hovering over graph rectangles when data has not been updated, highlights rectangles, adds text and
calls onMouseOver_fromGraph in VaccMap
 */
function graphMouseOver_fromGraph(event) {
    let iso = event.target.__data__.iso_code
    // Make selected bar orange
    bar_svg.select('.' + iso).transition().duration(500)
        .attr('fill', 'orange')
    // Adds value above bar
    bar_svg.append("text").transition().duration(500)
        .attr('class', 'label-text')
        .attr('transform', 'translate( ' + (x_bar(event.target.__data__.country) + x_bar.bandwidth() / 2 + 20) + ', ' + (yMax - event.target.attributes.height.nodeValue - 10) + ' )')
        .text(event.target.__data__.people_vac_per_hundred
        ).style("font", "10px sans-serif")
    // Calls VaccMap function
    onMouseOver_fromGraph(event);
}

/*
Function called by hovering out graph rectangles when data has not been updated, unhighlights rectangles, removes text
and calls onMouseOut_fromGraph in VaccMap
 */
function graphMouseOut_fromGraph(event) {
    let iso = event.target.__data__.iso_code
    // Transition back to original color of bar
    bar_svg.select('.' + iso).transition().duration(1000)
        .attr('fill', d =>
            Color(d.people_vac_per_hundred)
        )
    // Remove text
    d3.selectAll('.label-text').transition().duration(500)
        .remove()
    // Call VaccMap function
    onMouseOut_fromGraph(event);
}

/*
Function called when a country is hovevered over in the map, highlights bar and adds text
 */
function graphMouseOver_fromMap(event) {
    let iso = event.target.__data__.properties.iso_code
    let val = event.target.__data__.properties.people_vac_per_hundred
    let country = event.target.__data__.properties.country
    // highlight country's bar
    bar_svg.select('.' + iso).transition().duration(500).attr('fill', 'orange')
    // adds label
    bar_svg.append("text").transition().duration(500)
        .attr('class', 'label-text')
        .attr('transform', 'translate( ' + (x_bar(country) + x_bar.bandwidth() / 2 + 20) + ', ' + (y_bar(val) - 10) + ' )')
        .text(val)
        .style("font", "10px sans-serif")
}

/*
Function called when a country is hovevered out in the map, unhighlights bar and removes text
 */
function graphMouseOut_fromMap(event) {
    let iso = event.target.__data__.properties.iso_code
    // highlight bar
    bar_svg.select('.' + iso).transition().duration(1000).attr('fill', d => {
            if (typeof d.people_vac_per_hundred !== 'undefined') {
                return Color(d.people_vac_per_hundred)
            } else {
                console.log(Color(d.properties.people_vac_per_hundred))
                return Color(d.properties.people_vac_per_hundred)
            }
        }
    )
}

/*
Function called when bar is hovered over in an updated graph, highlights bar and adds text
 */
function graphMouseOver_fromGraphUpd(event) {
    let iso = event.target.__data__.iso_code
    // Highlight bar
    bar_svg.select('.' + iso).transition().duration(500)
        .attr('fill', 'orange')
    // Add label above bar
    bar_svg.append("text")
        .attr('class', 'label-text')
        .attr('transform', 'translate( ' + (x_bar(event.target.__data__.country) + x_bar.bandwidth() / 2 + 20) + ', ' + (yMax - event.target.attributes.height.nodeValue - 10) + ' )')
        .text(event.target.__data__[dropdown_choice])
        .style("font", "10px sans-serif")
    onMouseOver_fromGraph(event);
}

/*
Function called when bar is hovered out in an updated graph, unhighlights bar and remove text
 */
function graphMouseOut_fromGraphUpd(event) {
    let iso = event.target.__data__.iso_code
    // Change color back
    bar_svg.select('.' + iso).transition().duration(1000)
        .attr('fill', d => {
                if (typeof d.people_vac_per_hundred !== 'undefined') {
                    return Color(d[dropdown_choice])
                } else {
                    return Color(d.properties[dropdown_choice])
                }
            }
        )
    // Remove label
    d3.selectAll('.label-text')
        .remove()
    onMouseOut_fromGraphUpd(event);
}

/*
Function called when bar is hovered over in an updated graph from selection, highlights bar and adds text
 */
function graphMouseOver_fromGraphUpd_sel(event) {
    let iso = event.target.__data__.properties.iso_code
    // highlight country
    bar_svg.select('.' + iso).transition().duration(500)
        .attr('fill', 'orange')
    // add text
    bar_svg.append("text")
        .attr('class', 'label-text')
        .attr('transform', 'translate( ' + (x_bar(event.target.__data__.properties.country) + x_bar.bandwidth() / 2 + 20) + ', ' + (yMax - event.target.attributes.height.nodeValue - 10) + ' )')
        .text(event.target.__data__.properties[dropdown_choice])
        .style("font", "10px sans-serif")
    // call function in VaccMap
    onMouseOver_fromGraph(event);
}

/*
Function called when bar is hovered out in an updated graph from selection, unhighlights bar and removes text
 */
function graphMouseOut_fromGraphUpd_sel(event) {
    let iso = event.target.__data__.properties.iso_code
    // change color back
    bar_svg.select('.' + iso).transition().duration(1000)
        .attr('fill', d =>
            Color(d.properties[dropdown_choice])
        )
    // remove label
    d3.selectAll('.label-text')
        .remove()
    // call VaccMap function
    onMouseOut_fromGraphUpd(event);
}

/*
Function called when bar is hovered out in an updated map(/graph), highlights bar and adds text
 */
function graphMouseOver_fromMapUpd(event) {
    let iso = event.target.__data__.properties.iso_code
    let val = event.target.__data__.properties[dropdown_choice]
    let country = event.target.__data__.properties.country
    // Highlight bar
    bar_svg.select('.' + iso).transition().duration(500)
        .attr('fill', 'orange')
    // Adds label
    bar_svg.append("text").transition().duration(500)
        .attr('class', 'label-text')
        .attr('transform', 'translate( ' + (x_bar(country) + x_bar.bandwidth() / 2 + 20) + ', ' + (y_bar(val) - 10) + ' )')
        .text(val)
        .style("font", "10px sans-serif")
}

/*
Function called when bar is hovered out in an updated map(/graph), unhighlights bar
 */
function graphMouseOut_fromMapUpd(event) {
    let iso = event.target.__data__.properties.iso_code
    // Change color back
    bar_svg.select('.' + iso).transition().duration(1000)
        .attr('fill', d =>
            Color(d[dropdown_choice])
        )
}
