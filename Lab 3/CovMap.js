dropdownchoice = d => d.properties.tot_cases

function DrawCovMap() {
    // Add spherical shape to earth (background)
    cov_g.append('path')
        .attr('class', 'sphere')
        .attr('d', pathGenerator({type: 'Sphere'}))
        .attr('fill', 'rgba(65, 82, 166, 0.97)');


    let Countries_pop = addPop(Countries);
    Countries_pop.then(countries => {
            radius = d3.scaleSqrt([0, d3.max(countries.features.map(c => (dropdownchoice(c) / c.properties.population * 100)))], [0, 20])
            cov_g.selectAll('path').data(countries.features)
                .enter().append('path')
                .attr('class', 'country_cov')
                .attr('id', d => d.properties.iso_code)
                .attr('d', pathGenerator)
                .attr('fill', 'rgba(60,182,39,0.97)')
                .attr('stroke', 'rgba(96, 90, 90, 0.97)')
                // .on("mouseover", onMouseOver) //Add listener for the mouseover event
                // .on("mouseout", onMouseOut) //Add listener for the mouseout event
                // .on('click', top10_)
                // .on('click', showLineGraph)
                .append('title')
                .text(d => {
                    if (dropdownchoice(d) === "" || typeof dropdownchoice(d) === "undefined") {
                        return d.properties.name + ': N/A';
                    } else {
                        return d.properties.name + ': ' + ((dropdownchoice(d) / d.properties.population * 100).toPrecision(3)) + '%';
                    }
                })
            cov_g.selectAll('circle')
                .data(countries.features)
                .join('circle')
                .attr('class', 'circle')
                .attr('id', d => d.properties.iso_code)
                .attr('transform', d => {
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
        }
    )
}

function UpdateCovMap(date) {
    Countries = getCountries(vaccdat, country_dataless, date);
    let Countries_pop = addPop(Countries);
    Countries_pop.then(countries => {
            radius = d3.scaleSqrt([0, d3.max(countries.features.map(c => (dropdownchoice(c) / c.properties.population * 100)))], [0, 20])
            cov_g.selectAll('path')
                .selectAll('title')
                .text(d => {
                    if (dropdownchoice(d) === "" || typeof dropdownchoice(d) === "undefined") {
                        return d.properties.name + ': N/A';
                    } else {
                        return d.properties.name + ': ' + ((dropdownchoice(d) / d.properties.population * 100).toPrecision(3)) + '%';
                    }
                })
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