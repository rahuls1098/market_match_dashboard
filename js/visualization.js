
// Data arrays for CSV and individual visualizations
let data_relation = [];
let data_norelation = [];
let relations1 = ["Trade relation", "No trade relation"];
let relations2 = ["yes", "no"];
let map_data = [];
let barchart_data = [];
let bar_relation = [];
let bar_norelation = [];
let linechart_data = [];
let line_relation = [];
let line_norelation = [];
let map_relation = [];
let map_norelation = [];

// Deselection function for button to deselect all highlighting
function deselectAll() {
	d3.select("#map").selectAll("#yes")
			.style("fill", "blue")
	d3.select("#map").selectAll("#no")
			.style("fill", "green")
	d3.select("#linechart").selectAll("#yes")
			.style("stroke", "blue")
			.style("opacity", 0.5);
	 d3.select("#linechart").selectAll("#no")
			.style("stroke", "green")
			.style("opacity", 0.5);
	 d3.select("#barchart").selectAll("#yes")
			.style("fill", "blue")
			.style("opacity", 0.5);
	 d3.select("#barchart").selectAll("#no")
			.style("fill", "green")
			.style("opacity", 0.5);
}

((() => {

	// load the CSV data file
	d3.csv("data/data.csv", (data) => {

		// convert strings to numbers unless "Not Applicable"
		// add 0 to each zipcode
		data.forEach(function(d) {
			d["Mailing Address (Zip Code)"] = "0" + d["Mailing Address (Zip Code)"] ;
			d["Latitude"] = +d["Latitude"];
			d["Longitude"] = +d["Longitude"];

			if(d["Spring Capable Volume"] !== "Not Applicable") {
				d["Spring Capable Volume"] = +d["Spring Capable Volume"];
			}
			if(d["Summer Capable Volume"] !== "Not Applicable") {
				d["Summer Capable Volume"] = +d["Summer Capable Volume"];
			}
			if(d["Fall Capable Volume"] !== "Not Applicable") {
				d["Fall Capable Volume"] = +d["Fall Capable Volume"];
			}
			if(d["Winter Capable Volume"] !== "Not Applicable") {
				d["Winter Capable Volume"] = +d["Winter Capable Volume"];
			}
			if(d["Approximately what percentage of your products do you currently sell wholesale?"] !== "Not Applicable") {
				d["Approximately what percentage of your products do you currently sell wholesale?"] = +d["Approximately what percentage of your products do you currently sell wholesale?"];
			}
			if(d["Do you have a goal for what percentage of your products you would like to sell wholesale?"] !== "Not Applicable") {
				d["Do you have a goal for what percentage of your products you would like to sell wholesale?"] = +d["Do you have a goal for what percentage of your products you would like to sell wholesale?"];
			}
		});

		// split data based on whether vendor has trade relation or not
		data.forEach(function(row, i, arr) {
			if(row["Does your company currently have a trade relationship with a buyer?"] == "no") {
				data_norelation.push(row);
			} else {
				data_relation.push(row);
			}
		});

		// Format data for line chart
		formatLineChartData();

		// Format data for bar chart
		formatBarChartData();

		// Format data for map
	 	formatMapData(data);


		// Call line chart function
		let lcSeasonProduction = linechart()
			 ("#linechart", linechart_data);

		// Call the bar chart function
		let bcProductionRelation = barchart()
			.x(d => d.relation)
			.xLabel("Does Vendor Have a Trade Relationship")
			.y(d => d.percent)
			.yLabel("Desired Percent Increase in Wholesaling")
			("#barchart", barchart_data);

		// Call the map function
		let mpVendorFood = map({
			'backgroundImage': 'images/local_map.png'
		})
		.x(d => d.longitude)
		.y(d => d.latitude)
		("#map", map_data);


	});

})());

// set map data variable to the parse version of data
function formatMapData(data) {
	map_data = parseMapData(data);
}

// Parse the data to be loaded into the map
function parseMapData(data) {

	let tempArr = [];

	data.forEach(function(row, i, arr) {

		let mapDict = {};
		let longitude = row["Longitude"];
		let latitude = row["Latitude"];
		let zipcode = row["Mailing Address (Zip Code)"];

		let vendorFood = row["Please list the specialty crop(s) that you produce or are contained in your product(s)."];
		let relationStatus = row["Does your company currently have a trade relationship with a buyer?"];

		// Replace ? symbols in the data which were used as separators with commas
		let newStr = "";
		for (var i = 0; i < vendorFood.length; i++) {
			if( vendorFood[i] == '?') {
				newStr = newStr + ", ";
				i++;
			}
  			newStr = newStr + vendorFood[i];
		}

		// create each data point with associated attributes
		mapDict = {
			latitude: latitude,
			longitude: longitude,
			zipcode: zipcode,
			food: newStr,
			relation: relationStatus,
		};

		tempArr.push(mapDict);
	});
	return tempArr;
}

// Format bar chart data
function formatBarChartData() {
	// Load separate data arrays based on trade relation status
	let bar_relation = parseBarChartData(data_relation);
	let bar_norelation = parseBarChartData(data_norelation);
	let barchart_unformatted = [bar_relation, bar_norelation]

	// Create one data array to send to bar chart
	relations2.forEach(function(r,i) {
		barchart_data.push({
			relation: r,
			percent: barchart_unformatted[i]
		})
	})
}

// Calculates the desired increase in percentage of products the vendors would like to wholesale
// Computes the average amounts for each vendor (for each trade relation)
function parseBarChartData(data) {
	let desiredPercentChange = [];
	let totalDifference = 0;
	let count = 0;
	let average;

	data.forEach(function(row, i, arr) {

		let currentPercent = row["Approximately what percentage of your products do you currently sell wholesale?"];
		let goalPercent = row["Do you have a goal for what percentage of your products you would like to sell wholesale?"];

		if(currentPercent !== "Not Applicable" && goalPercent !== "Not Applicable") {
			totalDifference += (goalPercent - currentPercent);

			count++;
		}
	});
	average = totalDifference/count;
	return average;
}

// Formats the linechart data
function formatLineChartData() {
	let line_relation = parseLineChartData(data_relation);
	let line_norelation = parseLineChartData(data_norelation);
	let linechart_unformatted = [line_relation, line_norelation]

	relations2.forEach(function(r,i) {
		linechart_data.push({
			id: r,
			values: linechart_unformatted[i]
		});
	});
}

// Computes averages of vendors' production volume per season and formats data
function parseLineChartData(data) {

	let tempArr = [];

	let springTotal = 0;
	let springVendorCount = 0;
	let springAverage;

	let summerTotal = 0;
	let summerVendorCount = 0;
	let summerAverage;

	let fallTotal = 0;
	let fallVendorCount = 0;
	let fallAverage;

	let winterTotal = 0;
	let winterVendorCount = 0;
	let winterAverage;

	// Get total volume and number of vendors
	// Ignore "Not Applicable" results
	data.forEach(function(row, i, arr) {
		let springValue = row["Spring Capable Volume"];
		let summerValue = row["Summer Capable Volume"];
		let fallValue = row["Fall Capable Volume"];
		let winterValue = row["Winter Capable Volume"];


		if(springValue !== "Not Applicable") {
			springTotal += springValue;
			springVendorCount++;
		}
		if(summerValue !== "Not Applicable") {
			summerTotal += summerValue;
			summerVendorCount++;
		}
		if(fallValue !== "Not Applicable") {
			fallTotal += fallValue;
			fallVendorCount++;
		}
		if(winterValue !== "Not Applicable") {
			winterTotal += winterValue;
			winterVendorCount++;
		}
	});

	// Calculate averages
	springAverage = springTotal / springVendorCount;
	summerAverage = summerTotal / summerVendorCount;
	fallAverage = fallTotal / fallVendorCount;
	winterAverage = winterTotal / winterVendorCount;

	let seasons = ["Spring", "Summer", "Fall", "Winter"];
	averages = [springAverage, summerAverage, fallAverage, winterAverage];

	// Format line chart data for better parsing
	averages.forEach(function(d, i) {
		tempArr.push({
			season: seasons[i],
			pallets: d
		});
	});


	return tempArr;
}
