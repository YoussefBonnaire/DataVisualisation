/*
Get time based/grouped vacc and cases data
 */
function getTimeData() {// Get vacc data
    return d3.csv('owid-covid-data.csv', function (d) {
        return {
            date: formatDate(new Date(d.date)),
            iso_code: d.iso_code,
            country: d.location,
            tot_cases: +d.new_cases,
            tot_deaths: +d.new_deaths,
            tot_vac_per_hundred: +d.total_vaccinations_per_hundred,
            people_vac_per_hundred: +d.people_vaccinated_per_hundred,
            full_vac_per_hundred: +d.people_fully_vaccinated_per_hundred,
            boosted_per_hundred: +d.total_boosters_per_hundred
        };
    })
        .then((vaccdata) => {
            // Remove continents and world
            vaccdata = vaccdata.filter((d) => {
                return !/OWID_/.test(d.iso_code)
            })
            // Group by date
            grouped = groupNested(vaccdata, 'date')
            return grouped;
        });
}

/*
Allows grouping topojson countries together by key separating objects in array
 */
function groupNested(array, key) {
    // Return the reduced array
    return array.reduce((result, currentItem) => {
        // If an array already present for key, push it to the array. Otherwise create an array and push the object.
        (result[currentItem[key]] = result[currentItem[key]] || []).push(currentItem);
        // return the current iteration `result` value, this will be the next iteration's `result` value and accumulate
        return result;
    }, {}); // Empty object is the initial value for result object
}

/*
Allows grouping countries together by key, used for one non-topojson data
 */
function groupFlat(array, key) {
    // Return the reduced array
    return array.reduce((result, currentItem) => {
        // If an array already present for key, push it to the array. Otherwise create an array and push the object.
        result[currentItem[key]] = currentItem;
        // return the current iteration `result` value, this will be the next iteration's `result` value and accumulate
        return result;
    }, {}); // Empty object is the initial value for result object
}

/*
Get topojson data for map adding iso code for comparison with vacc data (some countries in topojson
have different name in vacc data ie. United States vs United States of America)
 */
function getMap() {
    return Promise
        .all([
            d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/110m.tsv'),
            d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
        ])
        .then(([tsvData, topoJSONdata]) => {
            // Group tsv data by iso code
            const rowById = tsvData.reduce((accumulator, d) => {
                accumulator[d.iso_n3] = [d.iso_a3];
                return accumulator;
            }, {});
            // get topojson data from countries
            const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries);
            countries.features.forEach(d => {
                // Add iso code to each country
                Object.assign(d.properties, rowById[d.id]);
            });
            return countries;
        });
}

/*
Add vacc (/cases/death) data on specific date to topojson data
 */
function getCountries(vaccdat, country_dataless, date) {
    return Promise.all([vaccdat, country_dataless]).then(([vacc, country]) => {
        // select data on date
        let vacc_day = vacc[date]
        // Day by iso code
        vacc_by_country = groupFlat(vacc_day, 'iso_code')
        country.features.forEach(d => {
            if (typeof vacc_by_country[d.properties[0]] !== "undefined") {
                // assign vacc (/cases/death) data for each country
                Object.assign(d.properties, vacc_by_country[d.properties[0]]);
            }
        });
        return country
    });
}

/*
Get data grouped by country, used only in CovLine line chart
 */
function getCountryData() {
    return Promise.all([d3.csv('owid-covid-data.csv', function (d) {
        return {
            date: formatDate(new Date(d.date)),
            iso_code: d.iso_code,
            country: d.location,
            tot_cases: +d.new_cases_smoothed,
            tot_deaths: +d.new_deaths_smoothed,
            tot_vac_per_hundred: +d.total_vaccinations_per_hundred,
            people_vac_per_hundred: +d.people_vaccinated_per_hundred,
            full_vac_per_hundred: +d.people_fully_vaccinated_per_hundred,
            boosted_per_hundred: +d.total_boosters_per_hundred

        };
    }), d3.csv('owid-covid-latest.csv', function (d) {
        return {
            iso_code: d.iso_code,
            population: +d.population
        };
    }), d3.csv('gdp_perCapita.csv', function (d) {
        return {
            iso_code: d['Country Code'],
            gdp: +d['2020']
        };
    })]).then(([cov, pop, gdp]) => {
        let complete = [];
        // Set all data for each topojson country
        cov.forEach(c => {
            let country;
            let pop_for_country = pop.filter(ret => ret.iso_code === c.iso_code);
            let gdp_for_country = gdp.filter(ret => ret.iso_code === c.iso_code);
            pop_for_country = pop_for_country[0];
            if (gdp_for_country.length !== 0) {
                gdp_for_country = gdp_for_country[0];
                country = Object.assign({}, c, pop_for_country, gdp_for_country);
            } else {
                country = Object.assign({}, c, pop_for_country);
            }
            complete.push(country)
        })
        // Group by iso code
        grouped = groupNested(complete, 'iso_code')
        return grouped;
    })
}

/*
Add population and GDP data to topojson countries
 */
function addPop_GDP(Countries) {
    return Promise.all([d3.csv('owid-covid-latest.csv', function (d) {
        return {
            iso_code: d.iso_code,
            population: +d.population
        };
    }), Countries, d3.csv('gdp_perCapita.csv', function (d) {
        return {
            iso_code: d['Country Code'],
            gdp: +d['2020']
        };
    })]).then(([pop, countries, gdp]) => {
        // Set all data to each corresponding topojson country
        countries.features.forEach(d => {
            let pop_for_country = pop.filter(ret => ret.iso_code === d.properties[0])
            let gdp_for_country = gdp.filter(ret => ret.iso_code === d.properties[0]);
            if (pop_for_country.length !== 0) {
                pop_for_country = pop_for_country[0]
                delete pop_for_country.iso_code
                Object.assign(d.properties, pop_for_country);
                if (gdp_for_country.length !== 0) {
                    gdp_for_country = gdp_for_country[0]
                    delete gdp_for_country.iso_code
                    Object.assign(d.properties, gdp_for_country);
                }
            }
        });
        return countries
    })
}