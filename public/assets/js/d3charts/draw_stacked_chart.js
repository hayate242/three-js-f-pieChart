function draw_stacked_chart( crane_id ){
  var cfg = {
    w: 400,
    h: 300,
    factor: 1,
    factorLegend: .85,
    levels: 3,
    maxValue: 0,
    opacityArea: 0.5,
    ToRight: 5,
    TranslateX: 80,
    TranslateY: 30,
    ExtraWidthX: 100,
    ExtraWidthY: 100,
    color: d3.scaleOrdinal(d3.schemeCategory10)
   };
  // 要素の上書き回避
  $('#stacked_chart').remove();
  $('#main').append('<svg width="'+ cfg.w + cfg.ExtraWidthX+'" height="'+ cfg.h + cfg.ExtraWidthY+'" id="stacked_chart"></svg>');

 

  // create the svg
  var svg = d3.select("#stacked_chart"),
  margin = {top: 20, right: 20, bottom: 30, left: 40},
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

  // // load the csv and create the chart
  // d3.csv("assets/data/agegroups.csv", function(d, i, columns) {
  //   for (i = 1, t = 0; i < columns.length; ++i){ 
  //     // console.log("d[columns[i]]", i ,d[columns[i]]);
  //     t += d[columns[i]] = +d[columns[i]]; 
  //   }
  //   // console.log("total = ",t);
  //   d.total = t;
  //   // console.log("csv d",d);
  //   return d;
  // }).then( function(data) {
  // // if (error) throw error;
  // console.log("data", data);
  // console.log("data.columns",data.columns);

  // var keys = data.columns.slice(1);
  // console.log('keys', keys);
  

  // // data.sort(function(a, b) { return b.total - a.total; });
  // x.domain(data.map(function(d) { return d.State; }));
  // y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
  // z.domain(keys);

  // g.append("g")
  // .selectAll("g")
  // .data(d3.stack().keys(keys)(data))
  // .enter().append("g")
  //   .attr("fill", function(d) { return z(d.key); })
  // .selectAll("rect")
  // .data(function(d) { return d; })
  // .enter().append("rect")
  //   .attr("x", function(d) { return x(d.data.State); })
  //   .attr("y", function(d) { return y(d[1]); })
  //   .attr("height", function(d) { return y(d[0]) - y(d[1]); })
  //   .attr("width", x.bandwidth())
  // .on("mouseover", function() { tooltip.style("display", null); })
  // .on("mouseout", function() { tooltip.style("display", "none"); })
  // .on("mousemove", function(d) {
  //   console.log(d);
  //   var xPosition = d3.mouse(this)[0] - 5;
  //   var yPosition = d3.mouse(this)[1] - 5;
  //   tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
  //   tooltip.select("text").text(d[1]-d[0]);
  // });

  // g.append("g")
  //   .attr("class", "axis")
  //   .attr("transform", "translate(0," + height + ")")
  //   .call(d3.axisBottom(x));

  // g.append("g")
  //   .attr("class", "axis")
  //   .call(d3.axisLeft(y).ticks(null, "s"))
  // .append("text")
  //   .attr("x", 2)
  //   .attr("y", y(y.ticks().pop()) + 0.5)
  //   .attr("dy", "0.32em")
  //   .attr("fill", "#000")
  //   .attr("font-weight", "bold")
  //   .attr("text-anchor", "start");

  // var legend = g.append("g")
  //   .attr("font-family", "sans-serif")
  //   .attr("font-size", 10)
  //   .attr("text-anchor", "end")
  // .selectAll("g")
  // .data(keys.slice().reverse())
  // .enter().append("g")
  //   .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // legend.append("rect")
  //   .attr("x", width - 19)
  //   .attr("width", 19)
  //   .attr("height", 19)
  //   .attr("fill", z);

  // legend.append("text")
  //   .attr("x", width - 24)
  //   .attr("y", 9.5)
  //   .attr("dy", "0.32em")
  //   .text(function(d) { return d; });
  // });

  // Data
  var d = [];
  var totals = [];
  const index = calc_index(crane_id);
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
  console.log("d",d);
  create_chart(d, totals);

  function create_chart(data, totals) {
    // if (error) throw error;
    console.log(data);
    var keys = [];
    var key_flag = false;
    for(key in data[0]){
      if(key_flag === true){ keys.push(key); }
      key_flag = true;
    }
    console.log("keys", keys);
    
    // data.sort(function(a, b) { return b.total - a.total; });
    x.domain(data.map(function(d) { return d.State; }));
    y.domain([0, d3.max(totals, function(d) { return d; })]).nice();
    z.domain(keys);

    console.log("d",d);
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
  
    var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  
    legend.append("rect")
      .attr("x", width + 19)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", z);
  
    legend.append("text")
      .attr("x", width + 84)
      .attr("y", 5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
    }

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
