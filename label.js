var category = ["Concept", "Privacy", "Security", "FL Framework", "incentive mechanism", "Federated Optimization", "Application Fields", "Application Scenarios"]

var categoryColorScale = d3.scale.ordinal()
				  		   .range(["#fad3cf","#a696c8", "#8ac6d1", "#F98866","#9dd3a8","#FCE38A","#9e9d24","#3e661a"])
				 		   .domain(["Concept", "Privacy", "Security", "FL Framework", "incentive mechanism", "Federated Optimization", "Application Fields", "Application Scenarios"]);

var width = 300;
var height = 300;

var svg = d3.select("#label")
			.append("svg")
			.attr("width", width)
			.attr("height", height)

svg.append("g")
	.attr("class", "category_label")
	.selectAll("rect")
	.data(category)
	.enter()
	.append("rect")
		.attr("width", 40)
		.attr("height", 18)
		.attr("x", 0)
		.attr("y", function(d, i) {return i*28;})
		.attr("fill", function(d) {return categoryColorScale(d);})

svg.append("g")
	.attr("class", "category_text")
	.selectAll("text")
	.data(category)
	.enter()
	.append("text")
		.attr("x", 50)
		.attr("y", function(d, i) {return i*28+15;})
		.text(function(d) {return d;})
		.style("font-size", "16px")
		.attr("fill", "#000000")