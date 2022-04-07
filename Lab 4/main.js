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
// Select svg in main
const race_svg = d3.select('body')
    .append('svg')
    .attr('class', 'race_svg')
    .attr('width', width_race)
    .attr('height', height_race)
    .attr('style', 'outline: thin solid rgba(98, 29, 29, 0.97);');

// Background of race
race_svg.append("rect")
    .attr("width", "0%")
    .attr("height", "0%")
    .transition()
    .duration(1000)
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "rgba(130,202,241,0.97)")

// initialise bar svg
let race_bar = race_svg.append("g")
    .selectAll("rect")

let x_axis_race = race_svg.append("g")
    .attr('class', 'chartxaxis')
    .attr("transform", "translate( 0 , 25)")

// Initialise y axis for bar chart
let y_axis_race = race_svg.append("g")
    .attr('class', 'chartyaxis')
    .attr("transform", "translate(80,0)")

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
const line_svg = d3.select('body')
    .append('svg')
    .attr('class', 'line_svg')
    .attr('width', width_race)
    .attr('height', height_race)
    .attr('style', 'outline: thin solid rgba(98, 29, 29, 0.97);');

// Background of line
line_svg.append("rect")
    .attr("width", "0%")
    .attr("height", "0%")
    .transition()
    .duration(1000)
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "rgba(130,202,241,0.97)");

// initialise bar svg
let line_graph = line_svg.append("g")

let x_axis_line = line_svg.append("g")
    .attr('class', 'chartxaxis')
    .attr("transform", "translate( 0 , 325)")

// Initialise y axis for bar chart
let y_axis_line = line_svg.append("g")
    .attr('class', 'chartyaxis')
    .attr("transform", "translate(80,0)")

// Set Y scale
let yscale_line = d3.scaleLog()
    .range([20, height_line - 20]);

// Set X scale
let xscale_line = d3.scaleTime()
    .range([80, width_race - 100]);

DrawLine();
