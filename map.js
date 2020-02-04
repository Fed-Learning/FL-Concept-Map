d3.csv("indexwords.csv", function(data) {

    var outer = d3.map();
	var inner = [];
	var links = [];
	var outerId = 0;

	//create the nodes, links and the relationships
	data.forEach(function(d) {
		//split the indexWords into an array
		d.indexwords = d.indexwords.split(", ");

		//fill the inner
		var i = {
			id: 'i' + inner.length,
			title: d.title,
			related_links: []
		};
		i.related_nodes = [i.id];
		inner.push(i);

		//fill the outer
		d.indexwords.forEach(function(indexword) {
			//get the key of this node -> o is the values of each outer node
			o = outer.get(indexword);

			if (o == null) {
				o = {
					id: 'o' + outerId,
					indexword: indexword,
					related_links: [],
					color: outerId
				};
				o.related_nodes = [o.id];
				outerId += 1;
				//update values
				outer.set(indexword, o);
			}

			//create the links
			l = {
				id: 'l-' + i.id + '-' + o.id,
				inner: i,
				outer: o,
			}
			links.push(l);

			//create the relationships
			i.related_nodes.push(o.id);
			i.related_links.push(l.id);
			o.related_nodes.push(i.id);
			o.related_links.push(l.id);
		});
	})

	//redefine the data
	data = {
		inner: inner,
		outer: outer.values(),
		links: links
	}

	//sort the outer nodes
    var sort_arr = [
        { indexword: "concept" },
        { indexword: "privacy preserving" },
        { indexword: "differential privacy" },
        { indexword: "secure multiparty computation" },
        { indexword: "security attack" },
        { indexword: "anomaly detection" },
        { indexword: "robustness" },
        { indexword: "deep learning framework" },
        { indexword: "machine learning framework" },
        { indexword: "reinforcement learning framework" },
        { indexword: "transfer learning framework" },
        { indexword: "incentive mechanism" },
        { indexword: "data heterogeneity" },
        { indexword: "communication efficiency" },
        { indexword: "systems heterogeneity" },
        { indexword: "gradient updating algorithm" },
        { indexword: "mobile device" },
        { indexword: "edge computing" },
        { indexword: "fog computing" },
        { indexword: "wireless communication" },
        { indexword: "intelligent hardware" },
        { indexword: "healthcare" },
        { indexword: "Internet of Things" }
    ];
    var result = [];
    for (let i = 0; i < data.outer.length; i++) {
        result = result.concat(data.outer.filter(m => m.indexword === sort_arr[i].indexword));
    }
    data.outer = result;
	




	//create the graph
	var svg_width = 2300;
	var svg_height = 2000;
	var rect_width = 650;
	var rect_height = 20;
	var link_width = "1px";

	var paper_num = data.inner.length;
	var indexword_num = data.outer.length;

	//define the range of the position
	var inner_x = -(rect_width/2);

	var inner_y = d3.scale.linear()
					.domain([0, paper_num])
					.range([-(paper_num*rect_height)/2, (paper_num*rect_height)/2]);

	var outer_x = d3.scale.linear()
					.domain([0, indexword_num/2, indexword_num/2, indexword_num])
					.range([50, 120, 240, 310]);

	var outer_y = svg_height/2.5;

	//setup position of each node
	data.inner = data.inner.map(function(d, i) {
		d.x = inner_x,
		d.y = inner_y(i);
		return d;
	})

	data.outer = data.outer.map(function(d, i) {
		d.x = outer_x(i);
		d.y = outer_y;
		return d;
	})

	
	//define the color of the outer nodes
	var color = d3.scale.ordinal()
    			  .range(["#fad3cf","#a696c8","#a696c8","#8ac6d1", "#8ac6d1", "#8ac6d1", "#8ac6d1", "#F98866", "#F98866", "#F98866", "#F98866","#9dd3a8","#9dd3a8","#9dd3a8","#9dd3a8","#FCE38A","#9e9d24","#9e9d24","#9e9d24","#3e661a","#3e661a","#3e661a","#3e661a"])
    			  .domain(["concept", "privacy preserving", "differential privacy", "secure multiparty computation", "security attack", "anomaly detection" , "robustness", "deep learning framework", "machine learning framework", "reinforcement learning framework", "transfer learning framework", "data heterogeneity", "communication efficiency", "systems heterogeneity", "gradient updating algorithm", "incentive mechanism", "mobile device", "edge computing", "fog computing", "wireless communication", "intelligent hardware", "healthcare", "Internet of Things"]);

    //draw gragh
    var svg = d3.select("#map").append("svg")
    			.attr("width", svg_width)
    			.attr("height", svg_height)
    			.append("g")
    			.attr("transform", "translate(" + svg_width / 2 + "," + svg_height / 2 + ")");

    //draw links
    function projectX(x) {
    	return ((x - 90) / 180 * Math.PI) - (Math.PI/2);
	}
	var diagonal = d3.svg.diagonal()
    				 .source(function(d) { return {"x": d.outer.y * Math.cos(projectX(d.outer.x)), 
                                  				   "y": -d.outer.y * Math.sin(projectX(d.outer.x))}; })            
    				 .target(function(d) { return {"x": d.inner.y + rect_height/2,
                                  				   "y": d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width}; })
    				 .projection(function(d) { return [d.y, d.x]; });
    
    var links = svg.append("g")
    			   .attr("class", "links")
    			   .selectAll(".links")
    			   .data(data.links)
    			   .enter()
    			   .append("path")
    			   .attr("class", "link")
    			   .attr("id", function(d) { return d.id})
    			   .attr("d", diagonal)
    			   .attr("fill", "none")
    			   .attr("stroke", function(d) { return color(d.outer.indexword); })
    			   .attr("stroke-width", link_width)

    //draw inner nodes
    var inode = svg.append("g")
    			   .selectAll(".inner_node")
    			   .data(data.inner)
    			   .enter()
    			   .append("g")
    			   .attr("class", "inner_node")
    			   .attr("transform", function(d, i) { return "translate(" + d.x + "," + d.y + ")"})
    			   .on("mouseover", mouseover)
    			   .on("mouseout", mouseout);

    inode.append("rect")
    	 .attr("id", function(d) { return d.id; })
    	 .attr("width", rect_width)
    	 .attr("height", rect_height)
    	 .attr("fill", "#354B5E")
    	 .attr("stroke", "#DCDDD8");
    	 

    inode.append("text")
    	 .attr("class", "ellipsis")
    	 .attr("id", function(d) { return d.id + "-text"; })
    	 .attr("transform", "translate(" + 10 + ", " + rect_height * .75 + ")")
    	 .attr("fill", "#fefefe")
    	 .text(function(d) { return d.title; })


    //draw outer nodes
    var onode = svg.append("g")
    			   .selectAll(".outer_node")
    			   .data(data.outer)
    			   .enter()
    			   .append("g")
    			   .attr("class", "outer_node")
    			   .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
    			   .on("mouseover", mouseover)
    			   .on("mouseout", mouseout);

    onode.append("circle")
    	 .attr("id", function(d) { return d.id; })
    	 .attr("r", 8)
    	 .attr("fill", function(d) { return color(d.indexword); })
    	 .attr("stroke-width", 5);

    onode.append("text")
    	 .attr("id", function(d) { return d.id + "-text"; })
    	 .attr("font-size", 18)
    	 .attr("dy", "0.2em")
    	 .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
    	 .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
    	 .text(function(d) { return d.indexword; });


    function mouseover (d) {
    	// bring to front
    	d3.selectAll(".links .link").sort(function(a, b) { return d.related_links.indexOf(a.id); });

    	for (var i = 0; i < d.related_nodes.length; i++) {
        	d3.select("#" + d.related_nodes[i]).classed("highlight", true);
        	d3.select("#" + d.related_nodes[i] + "-text").attr("font-weight", "bold");
    	}
    
    	for (var i = 0; i < d.related_links.length; i++) {
        	d3.select("#" + d.related_links[i]).attr("stroke-width", "6px");	
   		}
   	}

   	function mouseout(d) {   	
    	for (var i = 0; i < d.related_nodes.length; i++) {
        	d3.select("#" + d.related_nodes[i]).classed("highlight", false);
        	d3.select("#" + d.related_nodes[i] + "-text").attr("font-weight", "normal");
    	}
    
    	for (var i = 0; i < d.related_links.length; i++) {
        	d3.select("#" + d.related_links[i]).attr("stroke-width", link_width);
        }
	}
});