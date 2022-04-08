// width and height for the race
const width_race = 700;
const height_race = 350;
// width and height for the graphs
const width_line = 700;
const height_line = 350;

// Date selection
let min_date, max_date;

// Data date format;
let formatDate_data = d3.utcFormat("%d/%m/%Y");

// Get Data
data_byDate = dataByDate();
data_byCoin = dataByCoin();

// coin names
coins = ["ADA/USDT", "BNB/USDT", "BTC/USDT", "BTT/USDT", "DASH/USDT", "DOGE/USDT", "ETH/USDT", "LTC/USDT", "NEO/USDT",
    "XRP/USDT", "LINK/USDT", "EOS/USDT", "TRX/USDT", "ETC/USDT", "XLM/USDT", "ZEC/USDT", "QTUM/USDT", "XMR/USDT"]

// Background of race
d3.select("body").append("svg")
    .attr('width', 100000)
    .attr('height', 100000).append("rect")
    .attr("width", "0%")
    .attr("height", "0%")
    .transition()
    .duration(1000)
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "rgba(84,71,71,0.97)")

// Select svg in main
const race_svg = d3.select('svg')
    .append('svg')
    .attr('class', 'race_svg')
    .attr('width', width_race)
    .attr('height', height_race)
    .attr('style', 'outline: thin solid rgba(98, 29, 29, 0.97);');


// initialise bar svg
let race_bar = race_svg.append("g")
    .selectAll("rect")

let x_axis_race = race_svg.append("g")
    .attr('class', 'chartxaxis')
    .attr("transform", "translate( 0 , 25)")

// Initialise y axis for bar chart
let y_axis_race = race_svg.append("g")
    .attr('class', 'chartyaxis')
    .attr("transform", "translate(80,5)")

// Choose number of displayed items
let n = 10;
// Specify bar height
let barMargin = 2;
let barSize = height_race / n - barMargin;

// Set Y scale
let yscale_race = d3.scaleBand()
    .range([20, height_race - 20])
    .padding(0.1);

// Set X scale
let xscale_race = d3.scaleLog()
    .range([80, width_race - 100]);

let colorscale = d3.scaleOrdinal()
    .domain(coins)
    .range(d3.schemeSet3);

DrawChart()

// Select svg in main
const line_svg = d3.select('svg')
    .append('svg')
    .attr('class', 'line_svg')
    .attr('width', width_race)
    .attr('height', height_race)
    .attr('transform', "translate(720,0)")
    .attr('style', 'outline: thin solid rgba(98, 29, 29, 0.97);');


// initialise line chart
let line_graph = line_svg.append("g")

let x_axis_line = line_svg.append("g")
    .attr('class', 'chartxaxis')
    .attr("transform", "translate( 0 , 325)")
x_axis_line.selectAll(".tick").attr('fill', "white")
// Initialise y axis for bar chart
let y_axis_line = line_svg.append("g")
    .attr('class', 'chartyaxis')
    .attr("transform", "translate(80,0)")

// Set Y scale
let yscale_line = d3.scaleLinear()
    .range([height_line - 25, 20]);

// Set X scale
let xscale_line = d3.scaleTime()
    .range([80, width_line - 30]);

DrawLine();

// Create slider to change between dates  dynamically
const slider_svg = d3.select('svg')
    .append('svg')
    .attr('width', 1420)
    .attr('height', 60)
    .attr("transform", "translate(0,350)")

var slider_ = d3
    .sliderHorizontal()
    .min(new Date(2018, 1, 1))
    .max(new Date(2022, 4, 6))
    .default(new Date(2018, 1, 1))
    .step(1)
    .tickFormat(d3.timeFormat('%Y/%b/%d'))
    .width(1400)
    .fill('black')
    .on('onchange', (val) => {
        updateBars(val);
        updateTrades(val);
        updateVolume(val);
        updateDot(val);
        race_svg.select('.date').transition().duration(1000).text("On the: " + formatDate_data(val) + " ")
        force_svg.select('.date').transition().duration(1000).text("On the: " + formatDate_data(val) + " ")
        trades_svg.select('.date').transition().duration(1000).text("On the: " + formatDate_data(val) + " ")
    });


slider_svg.append('g')
    .attr('class', 'myslider')
    .attr('transform', 'translate(10,10)')
    .call(slider_);

slider_svg.select('g').selectAll('.myslider')
    .selectAll('.tick')
    .attr('stroke', 'black')
    .attr('fill', 'black')

race_svg.append('text')
    .attr('x', 350)
    .attr('y', 250)
    .attr('fill', 'white')
    .style("font-size", "26px")
    .text("Top Cryptocurrency Marketcaps")

race_svg.append('text')
    .attr('class', 'date')
    .attr('x', 450)
    .attr('y', 280)
    .attr('fill', 'white')
    .style("font-size", "18px")
    .text("On the: " + formatDate_data(slider_.value()) + " ")

// Select svg in main
const force_svg = d3.select('svg')
    .append('svg')
    .attr('class', 'force_svg')
    .attr('width', width_race)
    .attr('height', height_race)
    .attr("transform", "translate(0,400)")
    .attr('style', 'outline: thin solid rgba(98, 29, 29, 0.97);');


// initialise force container
let force_container = force_svg.append("g")
    .attr("transform", "translate(325,175)")


radius_volume = Math.min(500, 300) / 2;
var arc_volume = d3.arc()
    .innerRadius(radius_volume - 100)
    .outerRadius(radius_volume - 50);
var path_volume = force_svg.select('g').selectAll(".piechart")

force_svg.append('text')
    .attr('x', 200)
    .attr('y', 30)
    .attr('fill', 'white')
    .attr('text-anchor', 'center')
    .style("font-size", "26px")
    .text("Volume Share by Coin")

force_svg.append('text')
    .attr('class', 'date')
    .attr('x', 250)
    .attr('y', 50)
    .attr('fill', 'white')
    .attr('text-anchor', 'center')
    .style("font-size", "18px")
    .text("On the: " + formatDate_data(slider_.value()) + " ")

ShowVolume();

// Select svg in main
const trades_svg = d3.select('svg')
    .append('svg')
    .attr('class', 'trades_svg')
    .attr('width', width_race)
    .attr('height', height_race)
    .attr("transform", "translate(720,400)")
    .attr('style', 'outline: thin solid rgba(98, 29, 29, 0.97);');


// initialise force container
let trades_container = trades_svg.append("g")
    .attr("transform", "translate(325,175)")

radius = Math.min(500, 300) / 2;
var arc = d3.arc()
    .innerRadius(radius - 100)
    .outerRadius(radius - 50);
var path = trades_svg.select('g').selectAll(".piechart")


trades_svg.append('text')
    .attr('x', 200)
    .attr('y', 30)
    .attr('fill', 'white')
    .attr('text-anchor', 'center')
    .style("font-size", "26px")
    .text("Tradecount Share by Coin")

trades_svg.append('text')
    .attr('class', 'date')
    .attr('x', 250)
    .attr('y', 50)
    .attr('fill', 'white')
    .attr('text-anchor', 'center')
    .style("font-size", "18px")
    .text("On the: " + formatDate_data(slider_.value()) + " ")

ShowTrades();
