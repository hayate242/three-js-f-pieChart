

function draw_radar_chart( crane_id ){
	var w = 500,
		h = 500;
	
	var colorscale = d3.scaleOrdinal(d3.schemeCategory10);

	//Legend titles
	var LegendOptions = ['Smartphone','Tablet'];
	
	//Data
	const index = calc_index(crane_id);
	console.log(crane_data[index]._0_10);
	var d = [
				[
				{axis:"A",value: Number(crane_data[index]._0_10)},
				{axis:"B",value: Number(crane_data[index+1]._0_10)},
				{axis:"C",value: Number(crane_data[index+2]._0_10)},
				{axis:"D",value: Number(crane_data[index+3]._0_10)},
				{axis:"E",value: Number(crane_data[index+4]._0_10)},
				{axis:"F",value: Number(crane_data[index+5]._0_10)},
				{axis:"G",value: Number(crane_data[index+6]._0_10)},
				{axis:"H",value: Number(crane_data[index+7]._0_10)}
				],[
				{axis:"A",value: Number(crane_data[index]._0_10)},
				{axis:"B",value: Number(crane_data[index+1]._0_10)},
				{axis:"C",value: Number(crane_data[index+2]._0_10)},
				{axis:"D",value: Number(crane_data[index+3]._0_10)},
				{axis:"E",value: Number(crane_data[index+4]._0_10)},
				{axis:"F",value: Number(crane_data[index+5]._0_10)},
				{axis:"G",value: Number(crane_data[index+6]._0_10)},
				{axis:"H",value: Number(crane_data[index+7]._0_10)}
				]
			];

	//Options for the Radar chart, other than default
	var mycfg = {
		w: w,
		h: h,
		maxValue: 20,
		levels: 6,
		ExtraWidthX: 300
	}

	//Call function to draw the Radar chart
	//Will expect that data is in %'s
	RadarChart.draw("#chart", d, mycfg);

	////////////////////////////////////////////
	/////////// Initiate legend ////////////////
	////////////////////////////////////////////

	var svg = d3.select('#body')
		.selectAll('svg')
		.append('svg')
		.attr("width", w+300)
		.attr("height", h)

	//Create the title for the legend
	var text = svg.append("text")
		.attr("class", "title")
		.attr('transform', 'translate(90,0)') 
		.attr("x", w + 200)
		.attr("y", 10)
		.attr("font-size", "12px")
		.attr("fill", "#404040")
		.text("What % of owners use a specific service in a week");
			
	//Initiate Legend	
	var legend = svg.append("g")
		.attr("class", "legend")
		.attr("height", 100)
		.attr("width", 200)
		.attr('transform', 'translate(90,20)') 
		;
		//Create colour squares
		legend.selectAll('rect')
			.data(LegendOptions)
			.enter()
			.append("rect")
			.attr("x", w - 65)
			.attr("y", function(d, i){ return i * 20;})
			.attr("width", 10)
			.attr("height", 10)
			.style("fill", function(d, i){ return colorscale(i);})
			;
		//Create text next to squares
		legend.selectAll('text')
			.data(LegendOptions)
			.enter()
			.append("text")
			.attr("x", w - 52)
			.attr("y", function(d, i){ return i * 20 + 9;})
			.attr("font-size", "11px")
			.attr("fill", "#737373")
			.text(function(d) { return d; })
			;	

}