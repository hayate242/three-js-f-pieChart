

function draw_radar_chart( crane_id , is_time, id, max_val ){
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
				{axis:"A",value: Number(crane_data[index][i])},
				{axis:"B",value: Number(crane_data[index+1][i])},
				{axis:"C",value: Number(crane_data[index+2][i])},
				{axis:"D",value: Number(crane_data[index+3][i])},
				{axis:"E",value: Number(crane_data[index+4][i])},
				{axis:"F",value: Number(crane_data[index+5][i])},
				{axis:"G",value: Number(crane_data[index+6][i])},
				{axis:"H",value: Number(crane_data[index+7][i])}
			]);
		}
		}else {
			var d = [];
			for(var i = 8; i < 14; i++){
				d.push([
					{axis:"A",value: Number(crane_data[index][i])},
					{axis:"B",value: Number(crane_data[index+1][i])},
					{axis:"C",value: Number(crane_data[index+2][i])},
					{axis:"D",value: Number(crane_data[index+3][i])},
					{axis:"E",value: Number(crane_data[index+4][i])},
					{axis:"F",value: Number(crane_data[index+5][i])},
					{axis:"G",value: Number(crane_data[index+6][i])},
					{axis:"H",value: Number(crane_data[index+7][i])}
				]);
			}
		}

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

/////////////////////////////////
// 時間の合計値 レーダーチャート
/////////////////////////////////
function draw_radar_chart_sum_time( id, data ){
	var w = 370,
		h = 370;
	// var w = $(window).width() / 3,
	// 	h = $(window).width() / 3;
	// if(w > 500){
	// 	console.log("pre w", w);
	// 	w = 500;h = 500;
	// }
	console.log("w", w);
	
	//Data
	var max = 0;
	for(var i = 0, len = data.length; i < len; i++){
		if( max < data[i]){
			max = data[i];
		}
	}
	// console.log(crane_data[index][2]);

	var d = [];
	d.push([
		{axis:"A",value: Number(data[0])},
		{axis:"B",value: Number(data[1])},
		{axis:"C",value: Number(data[2])},
		{axis:"D",value: Number(data[3])},
		{axis:"E",value: Number(data[4])},
		{axis:"F",value: Number(data[5])},
		{axis:"G",value: Number(data[6])},
		{axis:"H",value: Number(data[7])}
	]);
	// console.log("data",data);
	// console.log("d",d);
	

	//Options for the Radar chart, other than default
	var mycfg = {
		w: w,
		h: h,
		maxValue: max,
		levels: 6,
		ExtraWidthX: w/2
	}

	//Call function to draw the Radar chart
	//Will expect that data is in %'s
	RadarChart.draw(id , d, mycfg);


}