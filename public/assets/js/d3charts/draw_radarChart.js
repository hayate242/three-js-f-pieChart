

function draw_radar_chart( crane_id , is_time, id, max_val){
	var w = 400,
		h = 400;
	
	var colorscale = d3.scaleOrdinal(d3.schemeCategory10);

	//Legend titles
	var LegendOptions = ['0-10%','10-50%','50-63%','63-80%','80-100%','100%以上'];
	
	//Data
	const index = calc_index(crane_id);
	console.log(crane_data[index]._0_10);
	if(is_time === false){
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
						{axis:"A",value: Number(crane_data[index]._10_50)},
						{axis:"B",value: Number(crane_data[index+1]._10_50)},
						{axis:"C",value: Number(crane_data[index+2]._10_50)},
						{axis:"D",value: Number(crane_data[index+3]._10_50)},
						{axis:"E",value: Number(crane_data[index+4]._10_50)},
						{axis:"F",value: Number(crane_data[index+5]._10_50)},
						{axis:"G",value: Number(crane_data[index+6]._10_50)},
						{axis:"H",value: Number(crane_data[index+7]._10_50)}
					],[
						{axis:"A",value: Number(crane_data[index]._50_63)},
						{axis:"B",value: Number(crane_data[index+1]._50_63)},
						{axis:"C",value: Number(crane_data[index+2]._50_63)},
						{axis:"D",value: Number(crane_data[index+3]._50_63)},
						{axis:"E",value: Number(crane_data[index+4]._50_63)},
						{axis:"F",value: Number(crane_data[index+5]._50_63)},
						{axis:"G",value: Number(crane_data[index+6]._50_63)},
						{axis:"H",value: Number(crane_data[index+7]._50_63)}
					],[
						{axis:"A",value: Number(crane_data[index]._63_80)},
						{axis:"B",value: Number(crane_data[index+1]._63_80)},
						{axis:"C",value: Number(crane_data[index+2]._63_80)},
						{axis:"D",value: Number(crane_data[index+3]._63_80)},
						{axis:"E",value: Number(crane_data[index+4]._63_80)},
						{axis:"F",value: Number(crane_data[index+5]._63_80)},
						{axis:"G",value: Number(crane_data[index+6]._63_80)},
						{axis:"H",value: Number(crane_data[index+7]._63_80)}
					],[
						{axis:"A",value: Number(crane_data[index]._80_100)},
						{axis:"B",value: Number(crane_data[index+1]._80_100)},
						{axis:"C",value: Number(crane_data[index+2]._80_100)},
						{axis:"D",value: Number(crane_data[index+3]._80_100)},
						{axis:"E",value: Number(crane_data[index+4]._80_100)},
						{axis:"F",value: Number(crane_data[index+5]._80_100)},
						{axis:"G",value: Number(crane_data[index+6]._80_100)},
						{axis:"H",value: Number(crane_data[index+7]._80_100)}
					],[
						{axis:"A",value: Number(crane_data[index]._100_over)},
						{axis:"B",value: Number(crane_data[index+1]._100_over)},
						{axis:"C",value: Number(crane_data[index+2]._100_over)},
						{axis:"D",value: Number(crane_data[index+3]._100_over)},
						{axis:"E",value: Number(crane_data[index+4]._100_over)},
						{axis:"F",value: Number(crane_data[index+5]._100_over)},
						{axis:"G",value: Number(crane_data[index+6]._100_over)},
						{axis:"H",value: Number(crane_data[index+7]._100_over)}
					]
				];
		}else {
			var d = [
				[
					{axis:"A",value: Number(crane_data[index]._0_10_time)},
					{axis:"B",value: Number(crane_data[index+1]._0_10_time)},
					{axis:"C",value: Number(crane_data[index+2]._0_10_time)},
					{axis:"D",value: Number(crane_data[index+3]._0_10_time)},
					{axis:"E",value: Number(crane_data[index+4]._0_10_time)},
					{axis:"F",value: Number(crane_data[index+5]._0_10_time)},
					{axis:"G",value: Number(crane_data[index+6]._0_10_time)},
					{axis:"H",value: Number(crane_data[index+7]._0_10_time)}
				],[
					{axis:"A",value: Number(crane_data[index]._10_50_time)},
					{axis:"B",value: Number(crane_data[index+1]._10_50_time)},
					{axis:"C",value: Number(crane_data[index+2]._10_50_time)},
					{axis:"D",value: Number(crane_data[index+3]._10_50_time)},
					{axis:"E",value: Number(crane_data[index+4]._10_50_time)},
					{axis:"F",value: Number(crane_data[index+5]._10_50_time)},
					{axis:"G",value: Number(crane_data[index+6]._10_50_time)},
					{axis:"H",value: Number(crane_data[index+7]._10_50_time)}
				],[
					{axis:"A",value: Number(crane_data[index]._50_63_time)},
					{axis:"B",value: Number(crane_data[index+1]._50_63_time)},
					{axis:"C",value: Number(crane_data[index+2]._50_63_time)},
					{axis:"D",value: Number(crane_data[index+3]._50_63_time)},
					{axis:"E",value: Number(crane_data[index+4]._50_63_time)},
					{axis:"F",value: Number(crane_data[index+5]._50_63_time)},
					{axis:"G",value: Number(crane_data[index+6]._50_63_time)},
					{axis:"H",value: Number(crane_data[index+7]._50_63_time)}
				],[
					{axis:"A",value: Number(crane_data[index]._63_80_time)},
					{axis:"B",value: Number(crane_data[index+1]._63_80_time)},
					{axis:"C",value: Number(crane_data[index+2]._63_80_time)},
					{axis:"D",value: Number(crane_data[index+3]._63_80_time)},
					{axis:"E",value: Number(crane_data[index+4]._63_80_time)},
					{axis:"F",value: Number(crane_data[index+5]._63_80_time)},
					{axis:"G",value: Number(crane_data[index+6]._63_80_time)},
					{axis:"H",value: Number(crane_data[index+7]._63_80_time)}
				],[
					{axis:"A",value: Number(crane_data[index]._80_100_time)},
					{axis:"B",value: Number(crane_data[index+1]._80_100_time)},
					{axis:"C",value: Number(crane_data[index+2]._80_100_time)},
					{axis:"D",value: Number(crane_data[index+3]._80_100_time)},
					{axis:"E",value: Number(crane_data[index+4]._80_100_time)},
					{axis:"F",value: Number(crane_data[index+5]._80_100_time)},
					{axis:"G",value: Number(crane_data[index+6]._80_100_time)},
					{axis:"H",value: Number(crane_data[index+7]._80_100_time)}
				],[
					{axis:"A",value: Number(crane_data[index]._100_over_time)},
					{axis:"B",value: Number(crane_data[index+1]._100_over_time)},
					{axis:"C",value: Number(crane_data[index+2]._100_over_time)},
					{axis:"D",value: Number(crane_data[index+3]._100_over_time)},
					{axis:"E",value: Number(crane_data[index+4]._100_over_time)},
					{axis:"F",value: Number(crane_data[index+5]._100_over_time)},
					{axis:"G",value: Number(crane_data[index+6]._100_over_time)},
					{axis:"H",value: Number(crane_data[index+7]._100_over_time)}
				]
			];
		}

	//Options for the Radar chart, other than default
	var mycfg = {
		w: w,
		h: h,
		maxValue: max_val,
		levels: 6,
		ExtraWidthX: w/2
	}

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