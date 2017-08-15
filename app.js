var margin = { top: 20, right: 100, bottom: 60, left: 40 },
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

var x = d3.time.scale()
	.range([width, 0]);

var y = d3.scale.linear()
	.range([0, height]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.ticks(8)
	.tickFormat(d3.time.format("%M:%S"));

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

var chart = d3.select(".chart")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

chart.append("text")
	.attr("x", (width / 3) + 10)
	.attr("y", 0 )
	.attr("class", "chart-title")
	.attr("text-anchor", "middle")
	.text("Doping in Professional Bicycle Racing");

chart.append("text")
	.attr("x", (width / 3) + 10)
	.attr("y", 25 )
	.attr("class", "chart-subtitle")
	.attr("text-anchor", "middle")
	.text("35 Fastest times up Alpe d'Huez");

var div = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

var parseTime = d3.time.format("%M:%S");

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json", function (error, data) {

	xMin = d3.min(data, function (d) {
		time = parseTime.parse(d.Time);
		return time;
	});

	xMax = d3.max(data, function (d) {
		time = parseTime.parse(d.Time);
		buffered = time.getTime() + 30000;
		return new Date(buffered);
	});

	x.domain([normalizeTime(xMin, xMin), normalizeTime(xMin, xMax)]);
	y.domain([1, (d3.max(data, function (d) { return d.Place; })) * 1.05]);

	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("x", width / 2)
		.attr("y", 40)
		.attr("dy", ".71em")
		.style("text-anchor", "middle")
		.style("font-size", "14px")
		.text("Minutes Behind the Fastest");

	chart.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.style("font-size", "14px")
		.text("Ranking");

	dots = chart.selectAll("g.dots")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "dots");

	dots.attr('transform', function (d) {
		// get the x position
		date = parseTime.parse(d.Time);
		xMove = x(normalizeTime(xMin, date));
		// get the y position
		yMove = y(d.Place)
		return 'translate(' + xMove + ',' + yMove + ')'
	});

	dots.append('circle')
		.attr('r', 5)
		.style('fill', function (d) {
			if(d.Doping === "") return "#e0ab18";
				return "steelblue";
		});

	dots.append('text')
		.text(function (d) {
			return d.Name
		})
		.attr("y", "5px")
		.attr("x", "10px")
		.style("font", "12px Helvetica, sans-serif");

	dots.select('circle')
		.on("mouseenter", function (d, i) {
			dot = d3.select(this);
			dot.style("stroke-width", "2")
			dot.style('stroke', '#e15258');

			div.transition()
				.duration(200)
				.style("opacity", .9);
			div.html("<strong>" + d.Name + ", " + d.Nationality + "</strong></br> Year: " + d.Year + ", Time: " + d.Time + "</br></br>" + d.Doping)
				.style("left", width + margin.right + "px")
				.style("top", height - margin.top - margin.bottom + "px");
		});

	dots.on("mouseleave", function (d, i) {
		dot = d3.select(this);
		dot.select('circle')
			.style('stroke', 'none');

		div.transition()
			.duration(500)
			.style("opacity", 0);
	});
});

function normalizeTime(min, value) {
	var diff = new Date(value - min);
	var parsedTime = parseTime.parse(diff.getMinutes() + ":" + diff.getSeconds());
	return parsedTime;
}