

  var chart = new CanvasJS.Chart("scatterChartContainer", {
    animationEnabled: true,
    title:{
      text: "クレーンの吊り荷の分布"
    },
    axisX: {
      title:"吊り荷の重さ(100kg)"
    },
    axisY:{
      title: "中心から吊り荷の距離(m)"
    },
    data: [{
      type: "scatter",
		  toolTipContent: "<span style=\"color:#4F81BC \"><b>{name}</b></span><br/><b> 吊り荷の重さ(100kg):</b> {x} <br/><b> 中心から吊り荷の距離(m):</b></span> {y} ",
      name: "クレーン１",
      showInLegend: true,
      dataPoints: [
        { x: 23, y: 330 },
        { x: 28, y: 390 },
        { x: 39, y: 400 },
        { x: 34, y: 430 },
        { x: 24, y: 321 },
        { x: 29, y: 250 },
        { x: 29, y: 370 },
        { x: 23, y: 290 },
        { x: 27, y: 250 },
        { x: 34, y: 380 },
        { x: 36, y: 320 },
        { x: 33, y: 405 },
        { x: 32, y: 453 },
        { x: 21, y: 292 }
      ]
    },
    {
      type: "scatter",
      name: "クレーン2",
      showInLegend: true, 
		  toolTipContent: "<span style=\"color:#4F81BC \"><b>{name}</b></span><br/><b> 吊り荷の重さ(100kg):</b> {x} <br/><b> 中心から吊り荷の距離(m):</b></span> {y} ",
      dataPoints: [
        { x: 19, y: 200 },
        { x: 27, y: 300 },
        { x: 35, y: 330 },
        { x: 32, y: 190 },
        { x: 29, y: 189 },
        { x: 22, y: 150 },
        { x: 27, y: 200 },
        { x: 26, y: 190 },
        { x: 24, y: 225 },
        { x: 33, y: 330 },
        { x: 34, y: 250 },
        { x: 30, y: 120 },
        { x: 37, y: 153 },
        { x: 24, y: 196 }
      ]
    }]
  });
  chart.render();