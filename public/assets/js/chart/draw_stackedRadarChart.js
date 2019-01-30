function get_cumulative_val(index, startIndex, endIndex){
	var sum = 0;
	for(var i = startIndex; i <= endIndex; i++){
		sum += crane_data[index][i];
	}
	return sum.toFixed(2);
}

function draw_stacked_radar_chart( crane_id , is_time, id ){
	var w = 370,
		h = 370;
	// var w = $(window).width() / 3,
	// 	h = $(window).width() / 3;
	// if(w > 500){
	// 	console.log("pre w", w);
	// 	w = 500;h = 500;
	// }
	console.log("w", w);
	
	var colorscale = d3.scaleOrdinal(d3.schemeCategory10);

	//Legend titles
	var LegendOptions = ['0-10%','10-50%','50-63%','63-80%','80-100%','100%以上'];
	
	//Data
	const index = calc_index(crane_id);
	// console.log(crane_data[index][2]);
	if(is_time === false){
		var d = [];
		for(var i = 2; i < 8; i++){
			d.push([
				{axis:"A",value: Number(get_cumulative_val(index, 2, i))},
				{axis:"B",value: Number(get_cumulative_val(index+1, 2, i))},
				{axis:"C",value: Number(get_cumulative_val(index+2, 2, i))},
				{axis:"D",value: Number(get_cumulative_val(index+3, 2, i))},
				{axis:"E",value: Number(get_cumulative_val(index+4, 2, i))},
				{axis:"F",value: Number(get_cumulative_val(index+5, 2, i))},
				{axis:"G",value: Number(get_cumulative_val(index+6, 2, i))},
				{axis:"H",value: Number(get_cumulative_val(index+7, 2, i))}
			]);
		}
	}else {
		var d = [];
		for(var i = 8; i < 14; i++){
			d.push([
				{axis:"A",value: Number(get_cumulative_val(index, 8, i))},
				{axis:"B",value: Number(get_cumulative_val(index+1, 8, i))},
				{axis:"C",value: Number(get_cumulative_val(index+2, 8, i))},
				{axis:"D",value: Number(get_cumulative_val(index+3, 8, i))},
				{axis:"E",value: Number(get_cumulative_val(index+4, 8, i))},
				{axis:"F",value: Number(get_cumulative_val(index+5, 8, i))},
				{axis:"G",value: Number(get_cumulative_val(index+6, 8, i))},
				{axis:"H",value: Number(get_cumulative_val(index+7, 8, i))}
			]);
		}
	}

	var max_val = 0;
	console.log("stacked_radar_chart_data", d);

	//Options for the Radar chart, other than default
	var mycfg = {
		w: w,
		h: h,
		maxValue: max_val,
		levels: 6,
		ExtraWidthX: w/2
	}
	console.log("d", d);
	//Call function to draw the Radar chart
	//Will expect that data is in %'s
	RadarChart.draw(id , d, mycfg);

	////////////////////////////////////////////
	/////////// Initiate legend ////////////////
	////////////////////////////////////////////

	var svg = d3.select(String(id)+'_txt')
		.selectAll('svg')
		.append('svg')
		.attr("width", w+300)
		.attr("height", h)

	// //Create the title for the legend
	// var text = svg.append("text")
	// 	.attr("class", "title")
	// 	.attr('transform', 'translate(90,0)') 
	// 	.attr("x", w + 200)
	// 	.attr("y", 10)
	// 	.attr("font-size", "12px")
	// 	.attr("fill", "#404040")
	// 	.text("What % of owners use a specific service in a week");
			
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
			.attr("x", w - 20)
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
			.attr("x", w )
			.attr("y", function(d, i){ return i * 20 + 9;})
			.attr("font-size", "11px")
			.attr("fill", "#737373")
			.text(function(d) { return d; })
			;	

}
