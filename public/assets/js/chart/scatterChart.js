

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
        { x: 23, y: 33 },
        { x: 28, y: 39 },
        { x: 39, y: 40 },
        { x: 44, y: 43 },
        { x: 24, y: 32 },
        { x: 29, y: 25 },
        { x: 9, y: 97 },
        { x: 3, y: 89 },
        { x: 7, y: 95 },
        { x: 3, y: 80 },
        { x: 6, y: 83 },
        { x: 3, y: 90 },
        { x: 2, y: 55 },
        { x: 1, y: 99 }
      ]
    },
    {
      type: "scatter",
      name: "クレーン2",
      showInLegend: true, 
		  toolTipContent: "<span style=\"color:#4F81BC \"><b>{name}</b></span><br/><b> 吊り荷の重さ(100kg):</b> {x} <br/><b> 中心から吊り荷の距離(m):</b></span> {y} ",
      dataPoints: [
        { x: 19, y: 40 },
        { x: 27, y: 20 },
        { x: 35, y: 30 },
        { x: 32, y: 10 },
        { x: 29, y: 59 },
        { x: 22, y: 25 },
        { x: 27, y: 22 },
        { x: 26, y: 19 },
        { x: 4, y: 75 },
        { x: 3, y: 83 },
        { x: 4, y: 85 },
        { x: 3, y: 72 },
        { x: 7, y: 93 },
        { x: 4, y: 96 }
      ]
    }]
  });
  chart.render();