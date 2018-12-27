window.addEventListener('load', getCSV_drawColumnLineChart("assets/data/moment.csv"));

//CSVファイルを読み込む関数getCSV()の定義
function getCSV_drawColumnLineChart(targetFile){
  var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
  req.open("get", targetFile, true); // アクセスするファイルを指定
  req.send(null); // HTTPリクエストの発行
  var result = [];
  // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
  req.onload = function(){
    result = convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ
    drawColumnLineChart(result);
  }
}

function drawColumnLineChart( damage_data ){
  // console.log(damage_data);

  var dataPoints = [];
  for(var i = 0; i < damage_data.length; i++){
    console.log(damage_data.length);
    dataPoints.push({
      label: damage_data[i][0],
      y: Number(damage_data[i][1])
    });
  }

  var chart = new CanvasJS.Chart("columnChartContainer", {
    animationEnabled: true,
    exportEnabled: true,
    theme: "light1", // "light1", "light2", "dark1", "dark2"
    title:{
      text: "モーメントの分布"
    },
    axisX: {
      title:"モーメント（100kg×メートル）",
    },
    axisY :{
      title:"回数",
      includeZero:false
    },
    data: [{
      type: "column", //change type to bar, line, area, pie, etc
      //indexLabel: "{y}", //Shows y value on all Data Points
      indexLabelFontColor: "#5A5757",
      indexLabelPlacement: "outside",
      dataPoints: dataPoints
    }]
  });
  chart.render();
    
}