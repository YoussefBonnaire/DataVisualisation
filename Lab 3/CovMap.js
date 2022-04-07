/*
Getter function for dropdownvalue
 */
dropdownchoice = d => d.properties[dropdownCov.property('value')]

/*
Function which draws the map
 */
function DrawCovMap() {
    // Add spherical shape to earth (background)
    cov_g.append('path')
        .attr('class', 'sphere')
        .attr('d', pathGenerator({type: 'Sphere'}))
        .attr('fill', 'rgba(65, 82, 166, 0.97)');

    // Add GDP and population to the country data
    let Countries_pop = addPop_GDP(Countries_cov);

    Countries_pop.then(countries => {
            // radius scale for bubbles
            radius = d3.scaleSqrt([0, d3.max(countries.features.map(c => (dropdownchoice(c) / c.properties.population * 100)))], [0, 20])
            // Set country color domain to gdp extent
            Color_cov.domain([0, d3.max(countries.features.map(d => d.properties.gdp))])
            // Draw countries with gdp scale for color fill
            cov_g.selectAll('path').data(countries.features)
                .enter().append('path')
                .attr('class', 'country_cov')
                .attr('id', d => d.properties.iso_code)
                .attr('d', pathGenerator)
                .attr('fill', d => {
                    if (typeof d.properties.gdp === "undefined") {
                        return 'red';
                    } else {
                        return Color_cov(d.properties.gdp);
                    }
                })
                .attr('stroke', 'rgba(96, 90, 90, 0.97)')
                .on('click', UpdateCountry) // Select country line graphs
                .append('title')
                .text(d => {
                    if (dropdownchoice(d) === "" || typeof dropdownchoice(d) === "undefined") {
                        return d.properties.name + ': N/A';
                    } else {
                        return d.properties.name + ': ' + ((dropdownchoice(d) / d.properties.population * 100).toPrecision(3)) + '%';
                    }
                });
            // Add bubbles
            cov_g.selectAll('circle')
                .data(countries.features)
                .join('circle')
                .attr('class', 'circle')
                .attr('id', d => d.properties.iso_code)
                .attr('transform', d => {// Place in center of country
                    x = pathGenerator.centroid(d)[0];
                    y = pathGenerator.centroid(d)[1];
                    return 'translate( ' + (x) + ', ' + y + ' )'
                })
                .attr('r', d => radius((dropdownchoice(d) / d.properties.population * 100)))
                .append('title')
                .text(d => {
                    if (dropdownchoice(d) === "" || typeof dropdownchoice(d) === "undefined") {
                        return d.properties.name + ': N/A';
                    } else {
                        return d.properties.name + ': ' + ((dropdownchoice(d) / d.properties.population * 100).toPrecision(3)) + '%';
                    }
                })
            // Add circle size legend, looks too small sadly because of bubbles size chosen but any bigger would cause
            // issue with clusters happening in europe and South America on certain dates
            const legend = cov_g.append("g")
                .attr("fill", "#777")
                .attr("transform", "translate(" + (width_map - 20) + " ," + (height_map) + ")")
                .attr("text-anchor", "middle")
                .style("font", "10px sans-serif")
                .selectAll("g")
                .data(radius.ticks(4).slice(1))
                .join("g");

            legend.append("circle")
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("cy", d => -radius(d))
                .attr("r", radius);

            legend.append("text")
                .attr("y", d => -2 * radius(d))
                .attr("dy", "1.3em")
                .text(radius.tickFormat(4, "s"));
            // Set the gradient for the axis legend
            cov_g.append("linearGradient")
                .attr("id", "line-gradient_2")
                .attr("gradientUnits", "userSpaceOnUse")
                .attr("x1", 20)
                .attr("y1", 0)
                .attr("x2", width_map - 40)
                .attr("y2", 0)
                .selectAll("stop")
                .data([
                    {offset: "0%", color: "purple"},
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
            cov_g.append('rect')
                .attr('class', 'color-rect_2')
                .attr('x', 20)
                .attr('width', width_map - 80)
                .attr('y', height_map - 25)
                .attr('height', 25)
                .attr('fill', 'url(#line-gradient_2)')
            // set x scale domain
            x_cov.domain([0, d3.max(countries.features.map(d => d.properties.gdp))]);
            // Add color axis
            axis = d3.axisBottom(x_cov).ticks(10)
            cov_g.append("g")
                .attr('class', 'Xaxis_2')
                .attr("transform", "translate(0," + (height_map - 25) + ")")
                .call(axis)

        }
    )
}

/*
Change Bubbles when hovered over dots in line
 */
function UpdateCovMap(date) {
    // get data on dot date
    let Countries_new = getCountries(vaccdat_cov, country_dataless_cov, date);
    // add population and gdp to data
    let Countries_pop = addPop_GDP(Countries_new);
    Countries_pop.then(countries => {
            // radius scale for bubbles
            radius = d3.scaleSqrt([0, d3.max(countries.features.map(c => (dropdownchoice(c) / c.properties.population * 100)))], [0, 20])
            // Change title
            cov_g.selectAll('path')
                .selectAll('title')
                .text(d => {
                    if (dropdownchoice(d) === "" || typeof dropdownchoice(d) === "undefined") {
                        return d.properties.name + ': N/A';
                    } else {
                        return d.properties.name + ': ' + ((dropdownchoice(d) / d.properties.population * 100).toPrecision(3)) + '%';
                    }
                })
            // Update circle sizes
            cov_g.selectAll('circle')
                .data(countries.features)
                .join('circle')
                .transition()
                .duration(1000)
                .attr('r', d => radius((dropdownchoice(d) / d.properties.population * 100)))
                .select('title')
                .text(d => {
                    if (dropdownchoice(d) === "" || typeof dropdownchoice(d) === "undefined") {
                        return d.properties.name + ': N/A';
                    } else {
                        return d.properties.name + ': ' + ((dropdownchoice(d) / d.properties.population * 100).toPrecision(3)) + '%';
                    }
                })
        }
    )
}

/*
Update map after data has changed on the line graph, Same application as UpdateCovMap
 */
function UpdateCovMapupd(iso, date) {
    // get data on dot date
    let Countries_new = getCountries(vaccdat_cov, country_dataless_cov, date);
    // add population and gdp to data
    let Countries_pop = addPop_GDP(Countries_new);
    Countries_pop.then(countries => {
            // radius scale for bubbles
            radius = d3.scaleSqrt([0, d3.max(countries.features.map(c => (dropdownchoice(c) / c.properties.population * 100)))], [0, 20])
            // Change title
            cov_g.selectAll('path')
                .selectAll('title')
                .text(d => {
                    if (dropdownchoice(d) === "" || typeof dropdownchoice(d) === "undefined") {
                        return d.properties.name + ': N/A';
                    } else {
                        return d.properties.name + ': ' + ((dropdownchoice(d) / d.properties.population * 100).toPrecision(3)) + '%';
                    }
                })
            // Update circle sizes
            cov_g.selectAll('circle')
                .data(countries.features)
                .join('circle')
                .transition()
                .duration(1000)
                .attr('fill', d => {
                    if (d.properties.iso_code === iso) {
                        return 'orange'
                    }
                })
                .attr('r', d => radius((dropdownchoice(d) / d.properties.population * 100)))
                .select('title')
                .text(d => {
                    if (dropdownchoice(d) === "" || typeof dropdownchoice(d) === "undefined") {
                        return d.properties.name + ': N/A';
                    } else {
                        return d.properties.name + ': ' + ((dropdownchoice(d) / d.properties.population * 100).toPrecision(3)) + '%';
                    }
                })
        }
    )
}

/*
 Highlight country and change line when country is clicked on
 */
function UpdateCountry(event) {
    // Ensure only one country is highlighted
    d3.selectAll('.country_cov').transition().duration(1000)
        .attr('fill', d => {
            if (typeof d.properties.gdp === "undefined") {
                return 'red';
            } else {
                return Color_cov(d.properties.gdp);
            }
        });
    // Highlight selected country
    d3.select(this).transition().duration(1000)
        .attr('fill', 'orange');
    // Change line graph
    UpdateLine(event);
}
