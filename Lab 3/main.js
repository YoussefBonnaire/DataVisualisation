const width_map = 700;
const height_map = 350;
const width_line = 700;
const height_line = 350;
margin = 20

const startdate = '2022-02-22'
// Variable to get values
const value = d => d.properties.people_vac_per_hundred;

/*
The following code adds the rop down menu present at the top of the page
* */
const dropdownvalues = ['people_vac_per_hundred', 'full_vac_per_hundred', 'boosted_per_hundred'];
dropdownlist = ['People Vaccinated per 100', 'Fully Vaccinated per 100', 'Boosted per 100']
// Initialize the button
var dropdownButton = d3.select("body")
    .append('select').attr('transform', 'translate(0,0)')
// add the options to the button
dropdownButton // Add a button
    .selectAll('myOptions')
    .data(dropdownlist)
    .enter()
    .append('option')
    .text(function (d) {
        return d;
    }) // text showed in the menu
    .attr("value", function (d, i) {
        return dropdownvalues[i];
    }) // corresponding value returned by the button
// Added to ensure drop down is above map
d3.select('body').append('div')

// Select svg in main
const map_svg = d3.select('body')
    .append('svg')
    .attr('class', 'vacc_map')
    .attr('width', width_map)
    .attr('height', height_map)
    .attr('style', 'outline: thin solid rgba(98, 29, 29, 0.97);');


map_svg.append("rect")
    .attr("width", "0%")
    .attr("height", "0%")
    .transition()
    .duration(1000)
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "rgba(130,202,241,0.97)")

// Initialise earth projection
const projection = d3.geoNaturalEarth1().scale(width_map / 1.7 / Math.PI)
    .translate([width_map / 2, height_map / 2]);
const pathGenerator = d3.geoPath().projection(projection);

// Append graph containing all elements of the map
const g = map_svg.append('g');

// Enable zooming within the svg
map_svg.call(d3.zoom().on('zoom', (event) => {
    g.attr('transform', event.transform);
}));

// Band scale for x-axis
var x = d3.scaleLinear().range([20, width_map - 20]);

// Choose color
var Color = d3.scaleLinear()
    .range(["red", 'rgba(84, 229, 55, 0.97)']);

// Create standard date format
formatDate = d3.timeFormat("%Y-%m-%d")

// Get country data
let vaccdat = getTimeData();
let country_dataless = getMap();

Countries = getCountries(vaccdat, country_dataless, startdate)

//
// // Svg next to map to display country info
// const tablesvg = d3.select('body')
//     .append('svg')
//     .attr('width', 150)
//     .attr('height', height_map)

function populateTable(event) {
    var tr = tablesvg.selectAll('tr')
        .data(event.originalTarget.__data__.properties)
        .enter()
        .append('tr')
    var td = tr.selectAll('td')
        .data(function (d) {
            return Object.values(d);
        })
        .enter().append("td")
        .text(function (d) {
            return d;
        });
}

// Draw map
DrawMap();

chosen_value = (key) => {
    return d => d.properties[key]
}

// When the button is changed, run the updateChart function
dropdownButton.on("change", function () {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    UpdateMap((chosen_value(selectedOption)), slider.value())
})
var slider = d3
    .sliderVertical()
    .min(new Date(2021, 2, 23))
    .max(new Date(2022, 1, 28))
    .default(new Date(2022, 1, 22))
    .tickFormat(d3.timeFormat('%Y/%m/%d'))
    .step(1)
    .height(height_map - 40)
    .on('onchange', (val) => {
        UpdateMap((chosen_value(dropdownButton.property('value'))), val)
    })
    .fill('black');
map_svg.append('g')
    .attr('class', 'myslider')
    .attr('transform', 'translate(' + (width_map) + ',20)')
    .call(slider)
d3.select('.myslider')
    .selectAll('.tick')
    .attr('stroke', 'black')
    .attr('fill', 'black')
    .selectAll('text')
    .attr('opacity', 0.6)


line_svg = d3.select('body')
    .append('svg').attr('class', 'line_svg')
    .attr('width', width_line)
    .attr('height', height_line)
    .attr('style', 'outline: thin solid rgba(98, 29, 29, 0.97);');
line_svg
    .append("rect")
    .attr("width", "0%")
    .attr("height", "0%")
    .transition()
    .duration(1000)
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "rgba(130,202,241,0.97)")
line_svg
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");

showLineGraph();
showBarChart();