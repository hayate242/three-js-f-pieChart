// window.addEventListener('load', getCSV_drawStartLineChart("assets/data/start.csv"));

// //CSVファイルを読み込む関数getCSV()の定義
// function getCSV_drawStartLineChart(targetFile){
//   var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
//   req.open("get", targetFile, true); // アクセスするファイルを指定
//   req.send(null); // HTTPリクエストの発行
//   var result = [];
//   // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
//   req.onload = function(){
//     result = convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ
//     // console.log(result);
//     // return result;
//     drawStartLineChart(result);
//   }
// }
// function drawStartLineChart( damage_data ){
//   // console.log(damage_data);
//   var y = 0;
//   var data = [];
//   var dataSeries = { type: "line" };
//   var dataPoints = [];
//   for (var i = 0; i < damage_data.length; i += 1) {
//       dataPoints.push({
//           x: i,
//           y: Number(damage_data[i][1])
//       });
//   }
//   dataSeries.dataPoints = dataPoints;
//   data.push(dataSeries);
  
//   var chart = new CanvasJS.Chart("startLineChartContainer", {
//       animationEnabled: true,
//       zoomEnabled: true,
//       title:{
//           text: "吊り上げ地点" 
//       },
//       axisX:{
//         title:"角度",
//         interval: 45,
//         gridThickness: 1,
//       },
//       axisY:{
//         title:"回数",
//         includeZero:false
//       },
//       data: data  // random generator below
//   });
//   chart.render();
// }

    
