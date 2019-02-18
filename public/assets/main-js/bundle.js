/*@cc_on _d=document;eval('var document=_d')@*/
// 絶対値計算
function abs(val) {
  return val < 0 ? -val : val;
};
// csvファイル読み込み関数(同期)
function openFile(url) {
  const xhr = new XMLHttpRequest();
  const p = new Promise((resolve, reject) => {
      xhr.open('GET', url);
      xhr.addEventListener('load', (e) => resolve(xhr));
      xhr.send();
  });
  return p;
}

async function loadAllFiles() {
  const xhr1 = await openFile('assets/data/crane_specs.csv');
  const xhr2 = await openFile('assets/data/crane_log.csv');
  // const xhr3 = await openFile('baz.txt');
  console.log('load_done!');
  save_spec_data(xhr1);
  save_log_data(xhr2);

  // id=1のクレーンのデータを表示
  display_crane_selection();
  // 選択可能最小，最大日時
  display_min_max_date(crane_date_list[1].start_y, crane_date_list[1].end_y);
  // chart描画
  update_data(1, crane_date_list[1].start_y, crane_date_list[1].end_y);
}



function save_spec_data( spec_data ){
  // console.log(spec_data.responseText);
  spec_data_list = convertCSVtoArray(spec_data.responseText); // 渡されるのは読み込んだCSVデータ
}
function save_log_data( log_data ){
  // console.log(log_data.responseText);
  log_data_list = convertCSVtoArray(log_data.responseText); // 渡されるのは読み込んだCSVデータ
  // console.log(log_data_list);
  // 日付指定範囲を計算
  calc_date_list();
  // format_crane_data(crane_date_list[1].start_y, crane_date_list[2].end_y);
}

function format_crane_data( start, end ){
  // console.log("format_start", start);
  // console.log("format_end", end);

  var j = 0;
  // 全部のidを調べて保存用配列の作成
  var added_id = [];
  for(var i = 1, len = log_data_list.length; i < len; i++ ){
    // 登録されたことがなかったら,crane_dataに追加
    if(added_id.indexOf(log_data_list[i][0]) == -1){
      crane_data[j] = new Array(log_data_list[i][0],"A",0,0,0,0,0,0,0,0,0,0,0,0);j++;
      crane_data[j] = new Array(log_data_list[i][0],"B",0,0,0,0,0,0,0,0,0,0,0,0);j++;
      crane_data[j] = new Array(log_data_list[i][0],"C",0,0,0,0,0,0,0,0,0,0,0,0);j++;
      crane_data[j] = new Array(log_data_list[i][0],"D",0,0,0,0,0,0,0,0,0,0,0,0);j++;
      crane_data[j] = new Array(log_data_list[i][0],"E",0,0,0,0,0,0,0,0,0,0,0,0);j++;
      crane_data[j] = new Array(log_data_list[i][0],"F",0,0,0,0,0,0,0,0,0,0,0,0);j++;
      crane_data[j] = new Array(log_data_list[i][0],"G",0,0,0,0,0,0,0,0,0,0,0,0);j++;
      crane_data[j] = new Array(log_data_list[i][0],"H",0,0,0,0,0,0,0,0,0,0,0,0);j++;
      added_id.push(log_data_list[i][0]);
    }
  }
  // console.log("init",crane_data);
  var isFirst = true;
  log_data_list.forEach(function(data){
    if(isFirst){
      isFirst = false;
    }else{
      const y = Number(data[1]);
      const m = Number(data[2]);
      const d = Number(data[3]);
      var the_date = new Date(y+"/"+m+"/"+d);
      // console.log("the_date", the_date);

      if(the_date >= start && the_date <= end){
        // console.log("data", data);
        // 負荷率
        if     (data[7] > 0    && data[7] <= 0.10)  { classify_data(data,0); }
        else if(data[7] > 0.10 && data[7] <= 0.50)  { classify_data(data,1); }
        else if(data[7] > 0.50 && data[7] <= 0.63)  { classify_data(data,2); }
        else if(data[7] > 0.63 && data[7] <= 0.80)  { classify_data(data,3); }
        else if(data[7] > 0.80 && data[7] <= 1   )  { classify_data(data,4); }
        else if(data[7] > 1)                        { classify_data(data,5); }
      }
    }
  });

  // 最後に出力
  console.log(crane_data);
}
function get_segment_num(segment){
  if(segment == "A"){ return 0;}
  if(segment == "B"){ return 1;}
  if(segment == "C"){ return 2;}
  if(segment == "D"){ return 3;}
  if(segment == "E"){ return 4;}
  if(segment == "F"){ return 5;}
  if(segment == "G"){ return 6;}
  if(segment == "H"){ return 7;}
}
function classify_data(data, range_id) {
  // start
  const start = (data[0] - 1) * segment_num + get_segment_num(data[8]);
  // end
  const end = (data[0] - 1) * segment_num + get_segment_num(data[9]);
  const pass_time = calc_pass_time(data[4], data[5]);
  // console.log(pass_time);
  add_damage_data(start, end, range_id, pass_time);
}

// 通過回数のデータ
function add_damage_data(start, end, range_id, pass_time){
  // console.log("start", start,"end", end);
  // console.log("diff abs", abs(start-end));
  // 差の絶対値が4以下なら普通に通過 (segmentが8つに分割されているので)
  if( abs(start-end) <= 4){
    if( start < end ) {
      for(var i = start; i <= end; i++){
        add_passes_num(i, range_id);
        add_passes_time(i, range_id, pass_time);
      }
    }else if ( start > end ){
      for(var i = start; i >= end; i--){
        add_passes_time(i, range_id, pass_time);
        add_passes_num(i, range_id);
      }
    }else {
      // startとendが同じ時
        add_passes_time(start, range_id, pass_time);
        add_passes_num(start, range_id);
    }
  }else { //4より大きいなら逆回り
    const itr_length = segment_num - abs(start-end);
    // console.log("itter_length", itr_length);
    if( start < end ) {
      var j = end;
      for(var i = 0; i <= itr_length; i++){
        add_passes_time((j%segment_num), range_id, pass_time);
        add_passes_num((j%segment_num), range_id);
        j++;
      }
    }else if ( start > end ){
      var j = start;
      for(var i = 0; i <= itr_length; i++){
        add_passes_time((j%segment_num), range_id, pass_time);
        add_passes_num((j%segment_num), range_id);
        j++;
      }
    }
  }
  // cnt = 1;
}
// var cnt = 1;
// 通過回数を加算
function add_passes_num(index, range_id){
  // console.log("index", index);
  // console.log("range_id", range_id);
  // console.log("cnt", cnt);
  // cnt++;
  const range = range_id+2;
  crane_data[index][range] += 1;
  // if(range_id == 0){ crane_data[index]._0_10 += 1; }
  // if(range_id == 1){ crane_data[index]._10_50 += 1;}
  // if(range_id == 2){ crane_data[index]._50_63 += 1;}
  // if(range_id == 3){ crane_data[index]._63_80 += 1;}
  // if(range_id == 4){ crane_data[index]._80_100 += 1;}
  // if(range_id == 5){ crane_data[index]._100_over += 1;}
}

function calc_pass_time( start_time, end_time ){
  const start_h_m = start_time.split(':');
  const end_h_m = end_time.split(':');
  // console.log(start_h_m, end_h_m);

  var hour = Number(end_h_m[0] - start_h_m[0]);
  var min = Number(end_h_m[1] - start_h_m[1])/60.0;
  if( min < 0 ){
    hour -= 1;
    min = Number( (60 - Number(start_h_m[1])) + Number(end_h_m[1]) )/60.0;
  }
  // console.log("hour", hour, "min", min);
  return hour + min;
}
// 通過時間のデータ
function add_passes_time(index, range_id, pass_time){
  // console.log(pass_time);
  pass_time = Number(pass_time);
  const range = range_id+8;
  crane_data[index][range] += pass_time;
  // if(range_id == 0){ crane_data[index]._0_10_time += pass_time; }
  // if(range_id == 1){ crane_data[index]._10_50_time += pass_time;}
  // if(range_id == 2){ crane_data[index]._50_63_time += pass_time;}
  // if(range_id == 3){ crane_data[index]._63_80_time += pass_time;}
  // if(range_id == 4){ crane_data[index]._80_100_time += pass_time;}
  // if(range_id == 5){ crane_data[index]._100_over_time += pass_time;}
}

function calc_index( crane_id ){
  return (crane_id - 1) * segment_num;
}

function calc_max_val( crane_id ){
  // console.log("calc_mac_val_!");
  const index = calc_index(crane_id);
  // 最大値を求める
  var max = [0,0];
  for(var i = 0, len = segment_num; i < len; i++){
    for(var j = 2; j < 8; j++){
      if (crane_data[index+i][j] > max[0]) { max[0] = crane_data[index+i][j] }
    }
    // if      (crane_data[index+i]._0_10 > max[0]) { max[0] = crane_data[index+i]._0_10 }
    // else if (crane_data[index+i]._10_50 > max[0]) { max[0] = crane_data[index+i]._10_50 }
    // else if (crane_data[index+i]._50_63 > max[0]) { max[0] = crane_data[index+i]._50_63 }
    // else if (crane_data[index+i]._63_80 > max[0]) { max[0] = crane_data[index+i]._63_80 }
    // else if (crane_data[index+i]._80_100 > max[0]) { max[0] = crane_data[index+i]._80_100 }
    // else if (crane_data[index+i]._100_over > max[0]) { max[0] = crane_data[index+i]._100_over }
  }
  for(var i = 0, len = segment_num; i < len; i++){
    for(var j = 8; j < 14; j++){
      if (crane_data[index+i][j] > max[1]) { max[1] = crane_data[index+i][j] }
    }
    // if      (crane_data[index+i]._0_10_time > max[1]) { max[1] = crane_data[index+i]._0_10_time }
    // else if (crane_data[index+i]._10_50_time > max[1]) { max[1] = crane_data[index+i]._10_50_time }
    // else if (crane_data[index+i]._50_63_time > max[1]) { max[1] = crane_data[index+i]._50_63_time }
    // else if (crane_data[index+i]._63_80_time > max[1]) { max[1] = crane_data[index+i]._63_80_time }
    // else if (crane_data[index+i]._80_100_time > max[1]) { max[1] = crane_data[index+i]._80_100_time }
    // else if (crane_data[index+i]._100_over_time > max[1]) { max[1] = crane_data[index+i]._100_over_time }
  }
  max_val_list = max;
  // console.log("max_val_list",max_val_list);
}
// 年のリストを作成
function calc_date_list(){

  for(var i = 1, len = spec_data_list.length; i < len; i++){
    crane_date_list[i] = new Object({
      'crane_id': (i),
      'start_y': new Date(Number(275755), Number(1), Number(1)),
      'end_y': new Date(Number(1970), Number(1), Number(1))
    });
  }
  // console.log("init crane_date_list", crane_date_list);
  // console.log(crane_date_list[1].start_y);
  // console.log(crane_date_list[1].end_y);
  // console.log(crane_date_list[2].start_y);
  // console.log(crane_date_list[2].end_y);
  // var d2 = new Date(2014, 3, 1, 12, 34, 56);
  // console.log(d2);
  for( var i = 1, len = log_data_list.length; i < len; i++){
    const y = Number(log_data_list[i][1]);
    const m = Number(log_data_list[i][2]);
    const d = Number(log_data_list[i][3]);
    var d1 = new Date(y+"/"+m+"/"+d);
    // 対象日より小さければ
    if( d1 < crane_date_list[log_data_list[i][0]].start_y ){
      crane_date_list[log_data_list[i][0]].start_y = d1;
    }
    if( d1 > crane_date_list[log_data_list[i][0]].end_y ){
      crane_date_list[log_data_list[i][0]].end_y = d1;
    }
  }
  console.log("crane_date_list", crane_date_list);
} 

/* ----------------------------
変数定義
 ----------------------------*/
//  グローバル変数　後で絶対名前空間に変換
const segment_num = 8;
var spec_data_list = [];
var log_data_list = [];
var max_val_list = [];

var crane_data = [];
var crane_date_list = [];
// function Info(_id, _segment, _0_10, _10_50, _50_63, _63_80, _80_100, _100_over, _0_10_time, _10_50_time, _50_63_time, _63_80_time, _80_100_time, _100_over_time) {
//   this.id = _id,
//   this.segment = _segment;
//   this._0_10 = _0_10;
//   this._10_50 = _10_50;
//   this._50_63 = _50_63;
//   this._63_80 = _63_80;
//   this._80_100 = _80_100;
//   this._100_over = _100_over;
//   this._0_10_time = _0_10_time;
//   this._10_50_time = _10_50_time;
//   this._50_63_time = _50_63_time;
//   this._63_80_time = _63_80_time;
//   this._80_100_time = _80_100_time;
//   this._100_over_time = _100_over_time;
// }

loadAllFiles();


//Practically all this code comes from https://github.com/alangrafu/radar-chart-d3
//I only made some additions and aesthetic adjustments to make the chart look better 
//(of course, that is only my point of view)
//Such as a better placement of the titles at each line end, 
//adding numbers that reflect what each circular level stands for
//Not placing the last level and slight differences in color
//
//For a bit of extra information check the blog about it:
//http://nbremer.blogspot.nl/2013/09/making-d3-radar-chart-look-bit-better.html




var RadarChart = {
  draw: function(id, d, options){
  var cfg = {
	 radius: 5,
	 w: 600,
	 h: 600,
	 factor: 1,
	 factorLegend: .85,
	 levels: 3,
	 maxValue: 0,
	 radians: 2 * Math.PI,
	 opacityArea: 0,
	//  opacityArea: 0.5,
	 ToRight: 5,
	 TranslateX: 80,
	 TranslateY: 30,
	 ExtraWidthX: 100,
	 ExtraWidthY: 100,
	 color: d3.scaleOrdinal(d3.schemeCategory10)
	};
	// グローバル化
	var dataValues = [];
	// console.log("radarchart.d",d);
	
	if('undefined' !== typeof options){
	  for(var i in options){
			if('undefined' !== typeof options[i]){
				cfg[i] = options[i];
			}
	  }
	}
	cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}))}));
	var allAxis = (d[0].map(function(i, j){return i.axis}));
	var total = allAxis.length;
	var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
	var Format = d3.format('%');
	d3.select(id).select("svg").remove();

	// console.log("cfg.w+cfg.ExtraWidthX",cfg.w+cfg.ExtraWidthX);
	
	var g = d3.select(id)
			.append("svg")
			.attr("width", cfg.w+cfg.ExtraWidthX)
			.attr("height", cfg.h+cfg.ExtraWidthY)
			.append("g")
			.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
			;

	var tooltip;
	
	//Circular segments
	for(var j=0; j<cfg.levels-1; j++){
	  var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
	  g.selectAll(".levels")
	   .data(allAxis)
	   .enter()
	   .append("svg:line")
	   .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
	   .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
	   .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
	   .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
	   .attr("class", "line")
	   .style("stroke", "grey")
	   .style("stroke-opacity", "0.75")
	   .style("stroke-width", "0.3px")
	   .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
	}

	//Text indicating at what % each level is
	for(var j=0; j<cfg.levels; j++){
	  var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
	  g.selectAll(".levels")
	   .data([1]) //dummy data
	   .enter()
	   .append("svg:text")
	   .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
	   .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
	   .attr("class", "legend")
	   .style("font-family", "sans-serif")
	   .style("font-size", "10px")
	   .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
	   .attr("fill", "#737373")
	   .text(((j+1)*cfg.maxValue/cfg.levels).toFixed(1));
	}
	
	var series = 0;

	var axis = g.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
			.attr("class", "axis");

	axis.append("line")
		.attr("x1", cfg.w/2)
		.attr("y1", cfg.h/2)
		.attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
		.attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
		.attr("class", "line")
		.style("stroke", "grey")
		.style("stroke-width", "1px");

	axis.append("text")
		.attr("class", "legend")
		.text(function(d){return d})
		.style("font-family", "sans-serif")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "1.5em")
		.attr("transform", function(d, i){return "translate(0, -10)"})
		.attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
		.attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

 
	d.forEach(function(y, x){
	  dataValues = [];
	  g.selectAll(".nodes")
		.data(y, function(j, i){
		  dataValues.push([
			cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
			cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
		  ]);
		});
	  dataValues.push(dataValues[0]);
	  g.selectAll(".area")
					 .data([dataValues])
					 .enter()
					 .append("polygon")
					 .attr("class", "radar-chart-serie"+series)
					 .style("stroke-width", "2px")
					 .style("stroke", cfg.color(series))
					 .attr("points",function(d) {
						 var str="";
						 for(var pti=0, len = d.length; pti<len; pti++){
							 str=str+d[pti][0]+","+d[pti][1]+" ";
						 }
						 return str;
					  })
					 .style("fill", function(j, i){return cfg.color(series)})
					 .style("fill-opacity", cfg.opacityArea)
					 .on('mouseover', function (d){
										var z = "polygon."+d3.select(this).attr("class");
										g.selectAll("polygon")
										 .transition(200)
										 .style("fill-opacity", 0); 
										g.selectAll(z)
										 .transition(200)
										 .style("fill-opacity", 0);
									  })
					 .on('mouseout', function(){
										g.selectAll("polygon")
										 .transition(200)
										 .style("fill-opacity", cfg.opacityArea);
					 });
	  series++;
	});
	series=0;


	d.forEach(function(y, x){
	  g.selectAll(".nodes")
		.data(y).enter()
		.append("svg:circle")
		.attr("class", "radar-chart-serie"+series)
		.attr('r', cfg.radius)
		.attr("alt", function(j){return Math.max(j.value, 0)})
		.attr("cx", function(j, i){
		  dataValues.push([
			cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
			cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
		]);
		return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
		})
		.attr("cy", function(j, i){
		  return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
		})
		.attr("data-id", function(j){return j.axis})
		.style("fill", cfg.color(series)).style("fill-opacity", .9)
		.on('mouseover', function (d){
					var newX =  parseFloat(d3.select(this).attr('cx')) - 10;
					var newY =  parseFloat(d3.select(this).attr('cy')) - 5;
					
					tooltip
						.attr('x', newX)
						.attr('y', newY)
						.text(d.value)
						.transition(200)
						.style('opacity', 1);
						
					var z = "polygon."+d3.select(this).attr("class");
					g.selectAll("polygon")
						.transition(200)
						.style("fill-opacity", 0); 
					g.selectAll(z)
						.transition(200)
						.style("fill-opacity", 0);
				  })
		.on('mouseout', function(){
					tooltip
						.transition(200)
						.style('opacity', 0);
					g.selectAll("polygon")
						.transition(200)
						.style("fill-opacity", cfg.opacityArea);
				  })
		.append("svg:title")
		.text(function(j){return Math.max(j.value, 0)});

	  series++;
	});
	//Tooltip
	tooltip = g.append('text')
			   .style('opacity', 0)
			   .style('font-family', 'sans-serif')
			   .style('font-size', '13px');
  }
}
var sum  = function(arr) {
  return arr.reduce(function(prev, current, i, arr) {
      return prev+current;
  });
};

// 合計を計算
var sum_segments_num = [];
var sum_segments_time = [];
var sum_class_num = [0,0,0,0,0,0];
var sum_class_time = [0,0,0,0,0,0];
var prev_start_date = new Date();
var prev_end_date = new Date();
// IE判定用
var userAgent = window.navigator.userAgent.toLowerCase();

// 表示可能最小最大年月日
function display_min_max_date(start, end){
  var date = [];
  date.push(start.getFullYear());
  date.push(start.getMonth() + 1);
  date.push(start.getDate()); 
  date.push(end.getFullYear());
  date.push(end.getMonth() + 1);
  date.push(end.getDate());
  for(var i = 0; i < 6; i++){
    $('.date_range > span:nth-child('+ String(i+1) +')').text(date[i]);
  }
}

// 変更を反映する
function update_data( crane_id, start, end ){
  console.log("start",start,crane_date_list[crane_id].start_y);
  // 再計算
  // 最大値を更新
  format_crane_data( start, end );
  calc_max_val(crane_id);
  // データ表示
  display_spec_data(crane_id);
  display_date_selection(crane_id, start, end);
  display_table_data(crane_id);
  // chart描画
  draw_radar_chart( crane_id, false, "#radar_chart" , max_val_list[0]);
  draw_radar_chart( crane_id, true, "#radar_chart_time", max_val_list[1]);
  draw_stacked_radar_chart( crane_id, false, "#stacked_radar_chart");
  draw_stacked_radar_chart( crane_id, true, "#stacked_radar_chart_time");
  draw_stacked_chart( crane_id ,'#stacked_chart', false);
  draw_stacked_chart( crane_id ,'#stacked_chart_time', true);
  draw_bar_chart( crane_id ,'#bar_chart', sum_class_num, false);
  draw_bar_chart( crane_id ,'#bar_chart_time', sum_class_time, true);
  draw_radar_chart_sum("#radar_chart_sum" , sum_segments_num);
  draw_radar_chart_sum("#radar_chart_sum_time" , sum_segments_time);
  console.log("userAgent",userAgent);
  console.log("userAgent", typeof( userAgent));
  // テスト用
  if(userAgent.indexOf('chrome') != -1 ) {
    console.log('お使いのブラウザはchromeですね！');
    // draw_pieChart( calc_pieChart_data( crane_id ) );
  }
  else {
    $('.pieChartContainer').remove();
  }
  draw_pieChart( calc_pieChart_data( crane_id ) );

  // draw_stacked_chart( crane_id , '#stacked_chart' , false);
  // alert("グラフを表示します\n "+crane_id+"号機\n開始　"+slash_dateFormat(start)+"\n終了　"+slash_dateFormat(end));
  
}

function display_crane_selection(){
  // // クレーンのセレクトボックス
  // for(var i = 1, len = spec_data_list.length; i < len; i++){
  //   $('.select_crane').append($('<option>').html(spec_data_list[i][0]).val(spec_data_list[i][0]));
  // }
  console.log("spec_data_list",spec_data_list);
  for(var i = 1, len = spec_data_list.length; i < len; i++){
    var $input = $('<input type="radio" name="crane_id" value="'+spec_data_list[i][0]+'" class="select_crane"/>');
    var $label = $('<label>'+spec_data_list[i][0]+'号機</label>')
    if(i == 1){
      $input = $input.attr("checked", true );
    }
    $("#crane_form").append($input).append($label);
  }
}

function display_spec_data(crane_id){
  // console.log('spec_data_list', spec_data_list);
  $('.crane_id').text(crane_id);
  $('.max_weight').text(spec_data_list[crane_id][1]);
  $('.max_turn_radius').text(spec_data_list[crane_id][2]);
  $('.ttb_pcd').text(spec_data_list[crane_id][3]);
  
}
// dateFormat 関数の定義
function dateFormat(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  if (m < 10) { m = '0' + m; }
  if (d < 10) { d = '0' + d; }
  return y + '-' + m + '-' + d;
}
// dateFormat 関数の定義
function slash_dateFormat(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  if (m < 10) { m = '0' + m; }
  if (d < 10) { d = '0' + d; }
  return y + '/' + m + '/' + d;
}
// 期間を表示
function display_date_selection( crane_id , s, e){
  const start = dateFormat(s);
  const end = dateFormat(e);
  // console.log("display_start", start);
  // console.log("display_end", end);
  prev_start_date = s;
  prev_end_date = e;
  $('#date_selection_start').val(start);
  $('#date_selection_end').val(end);
  // 選択範囲の設定
  const min_date = dateFormat(crane_date_list[crane_id].start_y);
  const max_date = dateFormat(crane_date_list[crane_id].end_y);
  $('#date_selection_start').attr({
    "min" : min_date,
    "max" : max_date
  });
  $('#date_selection_end').attr({
    "min" : min_date,
    "max" : max_date
  });

}

function display_table_data(crane_id){
  const index = (crane_id - 1) * segment_num;
  // console.log(index);
  
  // 初期化
  for(var i = 0, len = sum_class_num.length; i < len; i++){
    sum_class_num[i] = 0;
    sum_class_time[i] = 0;
  }
  for(var i = 0; i < segment_num; i++){ 
    sum_segments_num[i] = (crane_data[index+i][2] + crane_data[index+i][3] + crane_data[index+i][4] + crane_data[index+i][5] + crane_data[index+i][6] + crane_data[index+i][7]);
    sum_segments_time[i] = (crane_data[index+i][8] + crane_data[index+i][9] + crane_data[index+i][10] + crane_data[index+i][11] + crane_data[index+i][12] + crane_data[index+i][13]);
  }
  // console.log('sum_segments_num',sum_segments_num);
  // console.log('sum_segments_time',sum_segments_time);

  
  // 回数合計
  for(var ittr = 0; ittr < 6; ittr++){
    for(var j = 0; j < segment_num; j++){ 
      sum_class_num[ittr] += crane_data[index+j][ittr+2];
    } 
  }

  // 回数合計
  for(var ittr = 0; ittr < 6; ittr++){
    for(var j = 0; j < segment_num; j++){ 
      sum_class_time[ittr] += crane_data[index+j][ittr+8];
    }
  }
  // for(var ittr = 0; ittr < 6; ittr++){
  //   sum_class_time[ittr] = sum_class_time[ittr].toFixed(1);
  // }

  // console.log('sum_class_num',sum_class_num);
  // console.log('sum_class_time',sum_class_time);

  // 表示
  for(var i = 0; i < segment_num; i++){ 
    // 回数データ
    for(var j = 2; j < 8; j++ ){
      $('table.tb_numbers  > tbody > tr:nth-child('+ String(j) +') > td:nth-child('+ String(2+i) +')').text(crane_data[index+i][j]);
    }
    $('table.tb_numbers  > tbody > tr:nth-child(8) > td:nth-child('+ String(2+i) +')').text(sum_segments_num[i]);
    // 時間データ
    for(var j = 2; j < 8; j++){
      $('table.tb_hours > tbody > tr:nth-child('+ String(j) +') > td:nth-child('+ String(2+i) +')').text(crane_data[index+i][j+6].toFixed(1));
    }
    $('table.tb_hours > tbody > tr:nth-child(8) > td:nth-child('+ String(2+i) +')').text(sum_segments_time[i].toFixed(1));
  }
  // 合計(縦列)
  for(var i = 0, len = sum_class_num.length; i < len; i++){
    // 荷重区分
    // 回数
    $('table.tb_numbers  > tbody > tr:nth-child('+ String(2+i) +') > td:nth-child(10)').text(sum_class_num[i]);
    // 時間
    $('table.tb_hours > tbody > tr:nth-child('+ String(2+i) +') > td:nth-child(10)').text(sum_class_time[i].toFixed(1));
  }
  $('table.tb_numbers  > tbody > tr:nth-child(8) > td:nth-child(10)').text(sum(sum_class_num));
  $('table.tb_hours > tbody > tr:nth-child(8) > td:nth-child(10)').text(sum(sum_class_time).toFixed(1));

}

function calc_pieChart_data( crane_id ){
  var damage_data = [];
  var index = calc_index(crane_id);
  // console.log("crane_data", crane_data);
  for( var i = 0; i < segment_num; i++ ){
    const d_index = i * 45;
    for( var j = d_index; j < d_index+45; j++ ){
      damage_data[j] = [j,calc_damage_crane(crane_data[index+i])];
    }
  }
  // console.log("damagedata", damage_data);
  return damage_data;
}
function calc_damage_crane( data ){
  var sum = 0;
  for(var i = 2; i < 8;i++){
    sum += Number(data[i]);
  }
  sum += Number(
    data[2] * 5 * data[8] +  //0-10%
    data[3] * 4 * data[9] +  //10-50%
    data[4] * 3 * data[10] + //50-63%
    data[5] * 2 * data[11] + //63-80%
    data[6] * 1 * data[12] + //80-100%
    data[7] * 6 * data[13]   //100%以上
  );

  // console.log(sum);
  return sum;
}

// 設定変時の動作
$(window).on('load',function(){
  // セレクトボックスを変更した際の処理
  $(function(){
    $('input[name=crane_id]:radio').change(function() {
      on_change_action(true);
    });
    $('#date_selection_start').change(function(){
      on_change_action(false);
    });
    $('#date_selection_end').change(function(){
      on_change_action(false);
    });
    function on_change_action( is_select_crane ){
      var crane_id = $('input[name=crane_id]:checked').val();
      var draw_flag = true;
      console.log("radio crane_id", crane_id);
      if(is_select_crane){
        var start = crane_date_list[crane_id].start_y;
        var end = crane_date_list[crane_id].end_y;
        display_min_max_date(start, end);
      }else{
        var start_date = String($('#date_selection_start').val()).replace(/-/g, '/');
        var end_date = String($('#date_selection_end').val()).replace(/-/g, '/');
        // console.log("selected_craneID", crane_id);
        var start = new Date(start_date);
        var end = new Date(end_date);
        if( start > end ){
          $('#date_selection_start').val( dateFormat(prev_start_date) );
          $('#date_selection_end').val( dateFormat(prev_end_date) );
          alert("開始年月日<終了年月日としてください");
          draw_flag = false;
        }else if( start < crane_date_list[crane_id].start_y ){
          $('#date_selection_start').val( dateFormat(crane_date_list[crane_id].start_y) );
          alert(slash_dateFormat(start)+"以前にはデータが無いため開始年月日を"+slash_dateFormat(crane_date_list[crane_id].start_y)+"にしました");
          start = crane_date_list[crane_id].start_y;
        }else if( end > crane_date_list[crane_id].end_y ){
          $('#date_selection_end').val( dateFormat(crane_date_list[crane_id].end_y) );
          alert(slash_dateFormat(end)+"以降にはデータが無いため終了年月日を"+slash_dateFormat(crane_date_list[crane_id].end_y)+"にしました");
          end = crane_date_list[crane_id].end_y;
        }
      }
      // console.log("start_date", start_date);
      // console.log("end_date", end_date);
      // console.log("start", start);
      // console.log("end", end);
      if(draw_flag){
        update_data(crane_id, start, end);
      }
    }
  });
});
/** グループを継承したサブクラスです。 */
class PieChart extends THREE.Group {
  constructor(startAngle, endAngle, sectorNum, text, damage_data) {
    // 何かのクラスを継承した場合はsuper()を呼び出す必要がある
    super();
    // console.log(damage_data);
    // 角度から座標を取得(x,z)
    const getRotPosition = (angle, radius) => {
      // ラジアンに変換する
      const radian = angle * Math.PI / 180;
      // 角度に応じて位置を設定
      var x = radius * Math.sin(radian);
      var z = radius * Math.cos(radian);
      
      var positions = {
        x: x,
        y: 0,
        z: z
      };
      return positions;
    }
    // //乱数生成最大値・最小値を引数に持つ関数
    // const getRandom = ( min, max ) => {
    //     var random = Math.floor( Math.random() * (max + 1 - min) ) + min;
    //     return random;
    // }
    //sin計算関数
    const getSin = ( angle ) => {
        // ラジアンに変換する
        const radian = angle * Math.PI / 180;
        // 角度に応じて位置を設定
        const sin = 10 * Math.sin(10*radian) + 40 + 10*radian/2;
        return sin;
    }
    // 負荷値を返す関数
    const getOriginalDamage = ( angle ) => {
      // console.log(Math.floor(damage_data[Math.floor(angle)][1]/max_damage * max_hight) );
      return damage_data[Math.floor(angle)][1];
    }
    // 正規化した負荷値を返す関数
    const getDamageHight = ( angle ) => {
      // console.log(Math.floor(damage_data[Math.floor(angle)][1]/max_damage * max_hight) );
      return Math.floor(damage_data[Math.floor(angle)][1]/max_damage * max_hight);
    }
    const getMaxDamage = () => {
      var max_damage = 0;
      for(var i = 0; i < 360; i+= stride){
        const damage = damage_data[Math.floor(i)][1];
        // 最大値の更新
        if( max_damage < damage ){ max_damage = Number(damage); }
      }
      return max_damage;
    }

    const getColor_grad = ( angle ) => {
      const damage = getOriginalDamage(angle);
      if( max_damage*0.8 < damage ){ return 0xd81200; }      //赤
      else if( max_damage*0.7 < damage ){ return 0xd82e00; }
      else if( max_damage*0.6 < damage ){ return 0xd85200; }
      else if( max_damage*0.5 < damage ){ return 0xd88500; }
      else if( max_damage*0.4 < damage ){ return 0xd8b000; }
      else if( max_damage*0.3 < damage ){ return 0xd4d800; }
      else if( max_damage*0.2 < damage ){ return 0x7dd800; }
      else if( max_damage*0.1 < damage ){ return 0x4fd800; } //緑
      else { return 0x00d832; }
    }


//--------------------
//     定数
//--------------------

    // 刻み幅
    const stride = 0.6;
    // 円の半径
    const radius = 100;
    // piechartの1sectorの角度
    const sectorAngle = 45;

    const loader = new THREE.FontLoader();
    // グラフの高さ
    const interval_num = 5;
    const max_hight = 100;
    const interval = max_hight/interval_num;
    // 横の線
    var max_damage = getMaxDamage();
    const damage_interval = max_damage/interval_num;

    const fontPath = "./assets/fonts/helvetiker_regular.typeface.json";
    
    // console.log("max_damage", max_damage, "max_hight", max_hight);

    this.axisLabelGroup = new THREE.Group();

    // console.log(max_damage);

    // chart 描く
    const drowPie = (startAngle, endAngle, sectorNum) => {
      let positions = [];
      let next_positions = [];
      for(var i = startAngle; i < endAngle; i+= stride){
        // 円周のポジションの取得
        if( i == startAngle){
          positions = getRotPosition(i, radius);
          next_positions = getRotPosition(i + stride, radius);
        }else{
          positions = next_positions;
          next_positions = getRotPosition(i + stride, radius);
        }

        // Draw each segments
        const group = new THREE.Group();
        const geometry = new THREE.BoxGeometry( 1, 15, radius );
        if(i == startAngle){
          var material = new THREE.MeshBasicMaterial( {color: 0x000000} );
        }else {
          var material = new THREE.MeshBasicMaterial( {color: getColor_grad(i)} );
        }
        const box = new THREE.Mesh( geometry, material );
        box.position.y = -7.5;
        box.position.z = radius/2;
        group.add( box );
        const radian = i * Math.PI / 180;
        group.rotation.y = radian;
        this.add(group);

        // 角度の表示
        if( i % 45 == 0 ){
          // console.log(String(i)+"角度表示！");
          drawPieAngleLabel(positions, i, 0, i);
        }

        // 横の線
        for(var line_height = interval; line_height <= max_hight; line_height += interval){
          var holi_geometry = new THREE.Geometry();
          holi_geometry.vertices.push( new THREE.Vector3( positions.x, line_height, positions.z) );
          holi_geometry.vertices.push( new THREE.Vector3( next_positions.x, line_height, next_positions.z) );
          material = new THREE.LineBasicMaterial( { color: 0x000000} );
          // material.linewidth = 2;
          var holizontal_line = new THREE.Line( holi_geometry, material );
          //sceneにlineを追加
          // console.log(this);
          this.add( holizontal_line );
        }

        // 負荷のグラフ
        if( i+stride <= 360 ){
          var damage_geometry = new THREE.Geometry();
          const damage_position = getDamageHight(i);
          const next_damage_position = getDamageHight(i+stride);

          //頂点座標の追加
          damage_geometry.vertices.push( new THREE.Vector3( positions.x, damage_position, positions.z) ); 
          damage_geometry.vertices.push( new THREE.Vector3( next_positions.x, next_damage_position, next_positions.z) ); 
          material = new THREE.LineBasicMaterial( { color: 0xff0000} );
          material.linewidth = 2;
          //線オブジェクトの生成	
          var line = new THREE.Line( damage_geometry, material );
          //sceneにlineを追加
          this.add( line );
        }
      }
    }
    // 縦の線を書く
    const drawVerticalLines = (startAngle, angle) => {
      const positions = getRotPosition(startAngle, radius);
      // console.log(positions);
      // 縦の線
      var ver_geometry = new THREE.Geometry();
      ver_geometry.vertices.push( new THREE.Vector3( positions.x, 0, positions.z) );
      ver_geometry.vertices.push( new THREE.Vector3( positions.x, max_hight, positions.z) );
      var material = new THREE.LineBasicMaterial( { color: 0x000000} );
      // material.linewidth = 2;
      var vertical_line = new THREE.Line( ver_geometry, material );
      //sceneにlineを追加
      this.add( vertical_line );

      for(var i = 0; i <= max_hight; i += interval){
        // positions.y = i + 5;
        drawAxisLabelVal( positions, String((damage_interval*i/interval).toFixed(1)) , i+5 ,startAngle);
      }
    }

    // 縦軸の数値を追加
    const drawAxisLabelVal = (positions, text, y, angle) => {
      const that = this;
      loader.load(fontPath , function(font){
        const textGeometry = new THREE.TextGeometry(text, {
          font: font,
          size: 5,
          height: 1,
          curveSegments: 12
        });
        const materials = [
          new THREE.MeshBasicMaterial( { color: 0xff0f0f } ),
          new THREE.MeshBasicMaterial( { color: 0x000000 } )
        ];
        const textMesh = new THREE.Mesh(textGeometry, materials);
        textMesh.position.set(positions.x, y, positions.z);
        textMesh.rotation.set( 0,Math.PI * angle / 180,0 );
        that.axisLabelGroup.add(textMesh);
        that.add(that.axisLabelGroup);
      });
    }

    // draw Pie angle labels
    const drawPieAngleLabel = (positions, text, y, angle) => {

      // Pie Chartの数値を追加
      const that = this;
      loader.load(fontPath, function(font){
        const textGeometry = new THREE.TextGeometry(String(text)+"°", {
          font: font,
          size: 10,
          height: 1,
          curveSegments: 12
        });
        const materials = [
          new THREE.MeshBasicMaterial( { color: 0x0fff0f } ),
          new THREE.MeshBasicMaterial( { color: 0x000000 } )
        ];
        const textMesh = new THREE.Mesh(textGeometry, materials);
        textMesh.rotation.set( -Math.PI/2, 0, -Math.PI );
        if(angle == 0){ textMesh.position.set(positions.x, y, positions.z+5); }
        else if(angle == 45){ textMesh.position.set(positions.x+25, y, positions.z); }
        else if(angle == 90){ textMesh.position.set(positions.x+25, y, positions.z); }
        else if(angle == 135){ textMesh.position.set(positions.x+25, y, positions.z-20); }
        else if(angle == 180){ textMesh.position.set(positions.x+25, y, positions.z-15); }
        else if(angle == 225){ textMesh.position.set(positions.x, y, positions.z-18); }
        else { textMesh.position.set(positions.x, 2, positions.z); }
        that.axisLabelGroup.add(textMesh);
        that.add(that.axisLabelGroup);
      });
    }
    

    // pie上のtextを描く
    const drawText = (text, angle) => {
      const positions = getRotPosition(angle, radius*0.7);
      // function内でthisの内容が変わるためthatで記憶しておく
      const that = this;
      
      loader.load(fontPath, function(font){
        const textGeometry = new THREE.TextGeometry(text, {
          font: font,
          size: 20,
          height: 5,
          curveSegments: 12
        });
        const materials = [
          new THREE.MeshBasicMaterial( { color: 0xffffff } ),
          new THREE.MeshBasicMaterial( { color: 0x000000 } )
        ];
        const textMesh = new THREE.Mesh(textGeometry, materials);
        textMesh.position.set(positions.x+11, -3, positions.z-10);
        textMesh.rotation.set(-Math.PI/2, 0, -Math.PI);
        that.add(textMesh);
      });
    }

    // 関数呼び出し
    drowPie(startAngle, endAngle, sectorNum);
    drawVerticalLines(startAngle);
    drawText(text, (sectorNum+1)*sectorAngle-25);
  }

  // /** 更新命令を定義します。 */
  // update() {
  //   // this.axisLabelGroup.rotation.setFromRotationMatrix( this.camera.matrix );　//これを追加
  // }
}
// ページの読み込みを待つ
// window.addEventListener('load', getCSV_init("assets/data/demo.csv"));

// // //CSVファイルを読み込む関数getCSV()の定義
// function getCSV_init(targetFile){
//   var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
//   req.open("get", targetFile, true); // アクセスするファイルを指定
//   req.send(null); // HTTPリクエストの発行
//   var result = [];
//   // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
//   req.onload = function(){
//     result = convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ
//     // console.log(result);
//     // return result;
//     draw_pieChart(result);
//   }
// }



function draw_pieChart(damage_data) {
  // console.log("getCSV");
  // var result = getCSV("assets/data/demo.csv");
  // console.log(damage_data[0][1]);
  // console.log(damage_data);
  console.log("start drawing 3D chart");


  // サイズを指定
  const width = 600;
  const height = 350;
  // 刻み幅
  const stride = 0.2;
  // 円の半径
  const radius = 100;
  // piechartの1sectorの角度
  const sectorAngle = 45;

  function abs(val) {
    return val < 0 ? -val : val;
  };

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector('#myCanvas'),
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  // 背景色
  renderer.setClearColor(0xf8f8f8);

  // シーンを作成
  const scene = new THREE.Scene();
  // 座標軸を表示
  var axis = new THREE.AxisHelper(300);
  scene.add(axis);

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height);
  // カメラの初期座標を設定
  camera.position.set(0, 350, 0);
  // カメラコントローラーを作成
  let canvas = document.getElementById('myCanvas');
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.minDistance = radius*2;
  controls.maxDistance = radius*6;
  controls.maxPolarAngle = Math.PI/2;
  // to disable zoom 
  // controls.enableZoom = false;

  // to disable pan 
  // controls.enablePan = false; 
  controls.update();

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // // 地面を作成
  scene.add(new THREE.GridHelper(600));
  scene.add(new THREE.AxesHelper(100));
  // 平行光源
  const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  // 環境光源
  const ambientLight = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);


  /*
    *
    * use plot functions from here
    * 
    * 
    * 
  */
  // 画像を指定したmaterialの用意
  var material = new THREE.MeshBasicMaterial( {
    map:THREE.ImageUtils.loadTexture('./assets/imgs/bearing_mark.png', {}, function() {renderer.render(scene, camera);})
  } );

  // 画像貼り付け用板
  // var geometry = new THREE.PlaneGeometry(107*0.2, 199*0.2);
  // var mesh = new THREE.Mesh( geometry, material );
  // mesh.rotation.set(-Math.PI/2, 0, -Math.PI/2);
  // mesh.position.set(130,0,20);
  // scene.add( mesh );


  // draw pieChart
  var color_list = [0x42bcf4,0x41f447,0xf4f441,0xf47941,0xf4424b,0xf441eb,0xc1f441,0x4167f4];
  // グループを作る
  const sectorlist = [];
  var sectorNum = 0;
  for(var i = 0; i < 360; i += sectorAngle){
    // drowPie(i, i+sectorAngle, color_list[i/sectorAngle]);
    sectorNum = i/sectorAngle;
    // 3D空間にグループを追加する
    sectorlist[sectorNum] = new THREE.Group();
    sectorlist[sectorNum] = new PieChart(i, i+sectorAngle, sectorNum, String.fromCharCode(65+sectorNum),damage_data);
    sectorlist[sectorNum].rotation.y = Math.PI;
    scene.add(sectorlist[sectorNum]);
    // console.log("sectorlist = ",sectorlist[sectorNum]);
  }

  render();

  //描画
  function render() {
    // animation
    requestAnimationFrame(render);
    controls.update();

    // directionalLight.position = camera.position; //これを追加
    // for(var i = 0; i <= sectorNum; i++ ){
    //   sectorlist[i].update();
    // }
    renderer.render(scene, camera);
  }

  // // 初期化のために実行
  // onResize();
  // // リサイズイベント発生時に実行
  // window.addEventListener('resize', onResize);
  // function onResize() {
  //   // サイズを取得
  //   const width = window.innerWidth;
  //   const height = window.innerHeight;
  //   // レンダラーのサイズを調整する
  //   renderer.setPixelRatio(window.devicePixelRatio);
  //   renderer.setSize(width, height);
  //   // カメラのアスペクト比を正す
  //   camera.aspect = width / height;
  //   camera.updateProjectionMatrix();
  // }

  // tick();

  // // 毎フレーム時に実行されるループイベントです
  // function tick() {

  //   // レンダリング
  //   renderer.render(scene, camera);
  //   requestAnimationFrame(tick);

  // }

}


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
					{axis:"A",value: Number(crane_data[index][i].toFixed(2))},
					{axis:"B",value: Number(crane_data[index+1][i].toFixed(2))},
					{axis:"C",value: Number(crane_data[index+2][i].toFixed(2))},
					{axis:"D",value: Number(crane_data[index+3][i].toFixed(2))},
					{axis:"E",value: Number(crane_data[index+4][i].toFixed(2))},
					{axis:"F",value: Number(crane_data[index+5][i].toFixed(2))},
					{axis:"G",value: Number(crane_data[index+6][i].toFixed(2))},
					{axis:"H",value: Number(crane_data[index+7][i].toFixed(2))}
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
function draw_radar_chart_sum( id, data ){
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
		{axis:"A",value: Number(data[0].toFixed(2))},
		{axis:"B",value: Number(data[1].toFixed(2))},
		{axis:"C",value: Number(data[2].toFixed(2))},
		{axis:"D",value: Number(data[3].toFixed(2))},
		{axis:"E",value: Number(data[4].toFixed(2))},
		{axis:"F",value: Number(data[5].toFixed(2))},
		{axis:"G",value: Number(data[6].toFixed(2))},
		{axis:"H",value: Number(data[7].toFixed(2))}
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

function draw_stacked_chart( crane_id, id, is_time ){
  var cfg = {
    w: 400,
    h: 300,
    factor: 1,
    factorLegend: .85,
    levels: 3,
    maxValue: 0,
    opacityArea: 0.5,
    TranslateX: 80,
    TranslateY: 30,
    ExtraWidthX: 100,
    ExtraWidthY: 100,
    color: d3.scaleOrdinal(d3.schemeCategory10)
   };

  // Data
  var d = [];
  var totals = [];
  const index = calc_index(crane_id);
  if( is_time ){
    for(var i = 0; i < segment_num; i++){
      const columns = {
        'State': crane_data[index+i][1],
        '0-10%': crane_data[index+i][8],
        '10-50%': crane_data[index+i][9],
        '50-63%': crane_data[index+i][10],
        '63-80%': crane_data[index+i][11],
        '80-100%': crane_data[index+i][12],
        '100%以上': crane_data[index+i][13],
      };
      d.push(columns);
      totals.push( crane_data[index+i][8] + crane_data[index+i][9] + crane_data[index+i][10] + crane_data[index+i][11] + crane_data[index+i][12] + crane_data[index+i][13] );
    }
  }else {
    for(var i = 0; i < segment_num; i++){
      const columns = {
        'State': crane_data[index+i][1],
        '0-10%': crane_data[index+i][2],
        '10-50%': crane_data[index+i][3],
        '50-63%': crane_data[index+i][4],
        '63-80%': crane_data[index+i][5],
        '80-100%': crane_data[index+i][6],
        '100%以上': crane_data[index+i][7],
      };
      d.push(columns);
      totals.push( crane_data[index+i][2] + crane_data[index+i][3] + crane_data[index+i][4] + crane_data[index+i][5] + crane_data[index+i][6] + crane_data[index+i][7] );
    }
  }
  // //console.log("d",d);

      ////////////////////////////////////////////
    /////////// Initiate legend ////////////////
    ////////////////////////////////////////////
    var LegendOptions = ['0-10%','10-50%','50-63%','63-80%','80-100%','100%以上'];
    var colorscale = d3.scaleOrdinal(d3.schemeCategory10);
    //console.log(String(id)+'_txt');
      
    var svg = d3.select(id+"_txt")
      // .selectAll('svg')
      .append('svg')
      .attr("width", 200)
      .attr("height", 200)
      ;

        
    //Initiate Legend	
    var legend = svg.append("g")
      .attr("class", "legend")
      .attr("height", 200)
      .attr("width", 100)
      .attr('transform', 'translate('+ (Number(cfg.w) - 90) +',20)') 
      ;
      //Create colour squares
      legend.selectAll('rect')
        .data(LegendOptions)
        .enter()
        .append("rect")
        .attr("x", cfg.w - 200)
        .attr("y", function(d, i){ return i * 20;})
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d, i){ return colorscale(i);})
        .attr('transform', 'translate(-20,20)') 

        ;
      //Create text next to squares
      legend.selectAll('text')
        .data(LegendOptions)
        .enter()
        .append("text")
        .attr("x", cfg.w -200 )
        .attr("y", function(d, i){ return i * 20 + 9;})
        .attr("font-size", "11px")
        .attr("fill", "#737373")
        .text(function(d) { return d; })
        .attr('transform', 'translate(0,20)') 
        
        ;	

  // console.log("data", d);
  // console.log("totals", totals);

  make_chart_label(id, is_time);
  draw_chart(d, totals, id , cfg, is_time);

}

function draw_bar_chart( crane_id, id, sum_of_class, is_time ){
  var cfg = {
    w: 400,
    h: 300,
    factor: 1,
    factorLegend: .85,
    levels: 3,
    maxValue: 0,
    opacityArea: 0.5,
    TranslateX: 80,
    TranslateY: 30,
    ExtraWidthX: 100,
    ExtraWidthY: 100,
    color: d3.scaleOrdinal(d3.schemeCategory10)
   };
  // Data
  var d = [];
  var totals = [];
  var LegendOptions = ['0-10%','10-50%','50-63%','63-80%','80-100%','100%以上'];

  for(var i = 0, len = LegendOptions.length; i < len; i++){
    const columns = {
      'State': LegendOptions[i],
      'total': sum_of_class[i]
    };
    d.push(columns);
    totals.push( sum_of_class[i] );
  }
  // console.log("data", d);
  // console.log("totals", totals);
  make_chart_label(id, is_time);
  draw_chart(d, totals, id , cfg , is_time);
}

// function get_total( crane_id, range_id ){
//   const index = calc_index(crane_id);
//   var sum = 0;
//   for(var i = 0; i < segment_num; i++){
//     sum += crane_data[index + i][range_id + 2];
//   }
//   console.log("sum", sum);
//   return sum;
// }

function draw_chart( d, totals, id, cfg, is_time ){
  
  // 要素の上書き回避
  $(id).remove();
  $(id+"_main").append('<svg width="'+ (Number(cfg.w) + Number(cfg.ExtraWidthX)) +'" height="'+ (Number(cfg.h) + Number(cfg.ExtraWidthY)) +'" id="'+ id.slice(1) +'"></svg>');

  // create the svg
  var svg = d3.select(id),
  margin = {top: 50, right: 20, bottom: 30, left: 40},
  // width = +svg.attr("width") - margin.left - margin.right,
  width = +cfg.w - margin.left - margin.right + cfg.ExtraWidthX,
  // height = +svg.attr("height") - margin.top - margin.bottom,
  height = +cfg.h - margin.top - margin.bottom + cfg.ExtraWidthY,
  g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // set x scale
  var x = d3.scaleBand()
  .rangeRound([0, width])
  .paddingInner(0.05)
  .align(0.1);

  // set y scale
  var y = d3.scaleLinear()
  .rangeRound([height, 0]);

  // set the colors
  // var z = d3.scaleOrdinal()
  // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
  var z = d3.scaleOrdinal(d3.schemeCategory10);

  // 作図
  create_chart(d, totals);

  function create_chart(data, totals) {
    // if (error) throw error;
    //console.log(data);
    var keys = [];
    var key_flag = false;
    // console.log("data[0]", data[0]);
    for(var key in data[0]){
      if(key_flag === true){ keys.push(key); }
      key_flag = true;
    }
    // console.log("keys", keys);
    
    // data.sort(function(a, b) { return b.total - a.total; });
    x.domain(data.map(function(d) { return d.State; }));
    y.domain([0, d3.max(totals, function(d) { return d; })]).nice();
    z.domain(keys);

    //console.log("d",d);
    g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.State); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      // .attr("width", x.bandwidth())
      .attr("width", x.bandwidth()/2)
      .attr("transform", "translate("+ x.bandwidth()/4 +", 0)")
    .on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", function(d) {
      console.log(d);
      var xPosition = d3.mouse(this)[0] - 5;
      var yPosition = d3.mouse(this)[1] - 5;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d[1]-d[0]);
    });
  
    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  
    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start");
  
    // var legend = g.append("g")
    //   .attr("font-family", "sans-serif")
    //   .attr("font-size", 10)
    //   .attr("text-anchor", "end")
    //   .selectAll("g")
    //   .data(keys.slice().reverse())
    //   .enter().append("g")
    //   .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  
    // legend.append("rect")
    //   .attr("x", width + 19)
    //   .attr("width", 10)
    //   .attr("height", 10)
    //   .attr("fill", z);
  
    // legend.append("text")
    //   .attr("x", width + 84)
    //   .attr("y", 5)
    //   .attr("dy", "0.32em")
    //   .text(function(d) { return d; });
      // Prep the tooltip bits, initial display is hidden
      var tooltip = svg.append("g")
      .attr("class", "tooltip")
      .style("display", "none");
        
      tooltip.append("rect")
      .attr("width", 60)
      .attr("height", 20)
      .attr("fill", "white")
      .style("opacity", 0.5);

      tooltip.append("text")
      .attr("x", 30)
      .attr("dy", "1.2em")
      .style("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold");


    }




}

function make_chart_label(id, is_time){
  // ラベルの作成
  
  var ver_label = "";
  var hor_label = "（区分）";
  if( is_time ){ ver_label = "（時間）"; }
  else         { ver_label = "（回数）"; }

  var svg_ver = d3.select(id+"_ver_label")
  .append('svg')
  .attr("width", 200)
  .attr("height", 200)
  ;
  var label = svg_ver.append("g")
      .attr("class", "legend")
      .attr("height", 200)
      .attr("width", 100)
      .attr('transform', 'translate(20,20)') 
      ;
      label.selectAll('text')
      .data("回数")
      .enter()
      .append("text")
      .attr("font-size", "11px")
      .attr("fill", "#737373")
      .attr("transform", "rotate(-90)")
      .text(ver_label)
      ;
      label.selectAll('text')
      .attr("x", -200)
      .attr("y", -5)
      ;

  var svg_hor = d3.select(id+"_hor_label")
  .append('svg')
  .attr("width", 200)
  .attr("height", 200)
  ;
  var label = svg_hor.append("g")
      .attr("class", "legend")
      .attr("height", 200)
      .attr("width", 100)
      .attr('transform', 'translate(20,20)') 
      ;
      label.selectAll('text')
      .data(hor_label)
      .enter()
      .append("text")
      .attr("font-size", "11px")
      .attr("fill", "#737373")
      .text(hor_label)
      ;
      label.selectAll('text')
      .attr("x", 230)
      .attr("y", 380)
      ;
}
// //CSVファイルを読み込む関数getCSV()の定義
function getCSV(targetFile){
  var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
  req.open("get", targetFile, true); // アクセスするファイルを指定
  req.send(null); // HTTPリクエストの発行
  var result = [];
  // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
  req.onload = function(){
    result = convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ
    // console.log(result);
    return result;
  }
}

// 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
function convertCSVtoArray(str){ // 読み込んだCSVデータが文字列として渡される
  var result = []; // 最終的な二次元配列を入れるための配列
  var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
  // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
  for(var i=0, len = tmp.length;i<len;++i){
      result[i] = tmp[i].split(',');
  }
  return result;
}
// Modernizr.load({
//   test: Modernizr.inputtypes.date,
//   nope: [
//     'http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js',
//     'http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js',
//     'jquery-ui.css'
//   ],
//   complete: function() {
//     $('input[type=date]').datepicker({
//       dateFormat: 'yy-mm-dd'
//     });
//   }
// });
window.addEventListener('load', set_input_type_date());

function set_input_type_date(){
  if (Modernizr.inputtypes.date == false) {

    // // load the JQuery UI styles:
    // var link = document.createElement('link');
    // link.rel = 'stylesheet';
    // // link.href = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery.ui.all.css';
    // link.href = './assets/css/themes/base/jquery.ui.all.css';
    // document.getElementsByTagName('head')[0].appendChild(link);

    // // load JQuery:
    // var newScript = document.createElement('script');
    // newScript.src = '//code.jquery.com/jquery-1.10.2.js';
    // document.getElementsByTagName('head')[0].appendChild(newScript);

    // jquery-ui.js depends on jquery-1.10.2.js being fully loaded,
    // so wait half a second:
    setTimeout(function(){
      // var newScript = document.createElement('script');
      // // newScript.src = '//code.jquery.com/ui/1.11.4/jquery-ui.js';
      // newScript.src = './assets/js/libs/jquery-ui-1.11.4.min.js';
      // document.getElementsByTagName('head')[0].appendChild(newScript);

      // the datepicker plugin depends on jquery-ui.js being fully loaded,
      // so wait another half a second:
      setTimeout(function(){
        $('input[type=date]').datepicker({
          dateFormat: 'yy-mm-dd'  
        });
      }, 500);

    }, 500);
  }
}