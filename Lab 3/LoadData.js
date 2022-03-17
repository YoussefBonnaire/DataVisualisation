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
            // Select one specific day for each country available
            vaccdata = vaccdata.filter((d) => {
                return !/OWID_/.test(d.iso_code)
            })
            grouped = groupNested(vaccdata, 'date')
            return grouped;
        });
}

function groupNested(array, key) {
    // Return the reduced array
    return array.reduce((result, currentItem) => {
        // If an array already present for key, push it to the array. Otherwise create an array and push the object.
        (result[currentItem[key]] = result[currentItem[key]] || []).push(currentItem);
        // return the current iteration `result` value, this will be the next iteration's `result` value and accumulate
        return result;
    }, {}); // Empty object is the initial value for result object
}

function groupFlat(array, key) {
    // Return the reduced array
    return array.reduce((result, currentItem) => {
        // If an array already present for key, push it to the array. Otherwise create an array and push the object.
        result[currentItem[key]] = currentItem;
        // return the current iteration `result` value, this will be the next iteration's `result` value and accumulate
        return result;
    }, {}); // Empty object is the initial value for result object
}

function getMap() {
    return Promise
        .all([
            d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/110m.tsv'),
            d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
        ])
        .then(([tsvData, topoJSONdata]) => {
            const rowById = tsvData.reduce((accumulator, d) => {
                accumulator[d.iso_n3] = [d.iso_a3];
                return accumulator;
            }, {});
            const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries);
            countries.features.forEach(d => {
                Object.assign(d.properties, rowById[d.id]);
            });
            return countries;
        });
}

function getCountries(vaccdat, country_dataless, date) {
    return Promise.all([vaccdat, country_dataless]).then(([vacc, country]) => {
        let vacc_day = vacc[date]
        vacc_by_country = groupFlat(vacc_day, 'iso_code')
        country.features.forEach(d => {
            if (typeof vacc_by_country[d.properties[0]] !== "undefined") {
                Object.assign(d.properties, vacc_by_country[d.properties[0]]);
            }
        });
        return country
    });
}

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
        grouped = groupNested(complete, 'country')
        return grouped;
    })
}

function addPop(Countries) {
    return Promise.all([d3.csv('owid-covid-latest.csv', function (d) {
        return {
            iso_code: d.iso_code,
            population: +d.population
        };
    }), Countries]).then(([pop, countries]) => {
        countries.features.forEach(d => {
            let pop_for_country = pop.filter(ret => ret.iso_code === d.properties[0])
            if (pop_for_country.length !== 0) {
                pop_for_country = pop_for_country[0]
                delete pop_for_country.iso_code
                Object.assign(d.properties, pop_for_country);
            }
        });
        return countries
    })
}