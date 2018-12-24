window.addEventListener('load', getCSV_drawScatterChart("assets/data/weight_distance.csv"));

//CSVファイルを読み込む関数getCSV()の定義
function getCSV_drawScatterChart(targetFile){
  var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
  req.open("get", targetFile, true); // アクセスするファイルを指定
  req.send(null); // HTTPリクエストの発行
  var result = [];
  // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
  req.onload = function(){
    result = convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ
    drawScatterChart(result);
  }
}

function drawScatterChart( damage_data ){
  // console.log(damage_data);
  var dataPoints = [];
  for(i = 0; i < damage_data.length; i++){
    // console.log(Number(damage_data[i][1]));
    dataPoints.push({
      x: Number(damage_data[i][0]),
      y: Number(damage_data[i][1]),
      color: "blue"
    });
  }

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
      dataPoints: dataPoints
    }]
  });
  chart.render();
}