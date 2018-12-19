/** グループを継承したサブクラスです。 */
class PieChart extends THREE.Group {

  
  constructor(startAngle, endAngle, chartColor, sectorNum, text) {
    // 何かのクラスを継承した場合はsuper()を呼び出す必要がある
    super();

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
    // 適当な負荷値を返す関数
    const getDamage = ( angle ) => {
      if( angle >= 0 && angle < 15)        { return 100; }
      else if(angle >= 15 && angle < 30)   { return 100; }
      else if(angle >= 30 && angle < 45)   { return 100; }
      else if(angle >= 45 && angle < 60)   { return 100; }
      else if(angle >= 60 && angle < 75)   { return 100; }
      else if(angle >= 75 && angle < 90)   { return 100; }
      else if(angle >= 90 && angle < 105)  { return 100; }
      else if(angle >= 105 && angle < 120) { return 100; }
      else if(angle >= 120 && angle < 135) { return 100; }
      else if(angle >= 135 && angle < 150) { return 100; }
      else if(angle >= 150 && angle < 165) { return 100; }
      else if(angle >= 165 && angle < 180) { return 100; }
      else if(angle >= 180 && angle < 195) { return 100; }
      else if(angle >= 195 && angle < 210) { return 100; }
      else if(angle >= 210 && angle < 225) { return 100; }
      else if(angle >= 225 && angle < 240) { return 100; }
      else if(angle >= 240 && angle < 255) { return 100; }
      else if(angle >= 255 && angle < 270) { return 100; }
      else if(angle >= 270 && angle < 285) { return 100; }
      else if(angle >= 285 && angle < 300) { return 100; }
      else if(angle >= 300 && angle < 315) { return 100; }
      else if(angle >= 315 && angle < 330) { return 100; }
      else if(angle >= 330 && angle < 345) { return 100; }
      else if(angle >= 345 && angle < 360) { return 100; }
      // else                                 { return 100; }
    }
    const getMaxDamage = () => {
      var max_damage = 0;
      for(var i = 0; i < 360; i+= stride){
        const damage = getDamage(i);
        // 最大値の更新
        if( max_damage < damage ){ max_damage = Number(damage); }
      }
      return max_damage;
    }


//--------------------
//     定数
//--------------------

    // 刻み幅
    const stride = 0.2;
    // 円の半径
    const radius = 100;
    // piechartの1sectorの角度
    const sectorAngle = 45;

    // 横の線
    const interval = 20;
    var max_damage = getMaxDamage();

    this.axisLabelGroup = new THREE.Group();

    console.log(max_damage);

    // chart 描く
    const drowPie = (startAngle, endAngle, chartColor, sectorNum) => {

      for(var i = startAngle; i < endAngle; i+= stride){
        const positions = getRotPosition(i, radius);
        const next_positions = getRotPosition(i + stride, radius);

        // Draw each segments
        const group = new THREE.Group();
        const geometry = new THREE.BoxGeometry( 1, 15, radius );
        var material = new THREE.MeshBasicMaterial( {color: chartColor} );
        const box = new THREE.Mesh( geometry, material );
        box.position.y = -7.5;
        box.position.z = radius/2;
        group.add( box );
        const radian = i * Math.PI / 180;
        group.rotation.y = radian;
        this.add(group);

        // 横の線
        for(var line_height = interval; line_height <= max_damage; line_height += interval){
          var holi_geometry = new THREE.Geometry();
          holi_geometry.vertices.push( new THREE.Vector3( positions.x, line_height, positions.z) );
          holi_geometry.vertices.push( new THREE.Vector3( next_positions.x, line_height, next_positions.z) );
          material = new THREE.LineBasicMaterial( { color: 0x000000} );
          material.linewidth = 2;
          var holizontal_line = new THREE.Line( holi_geometry, material );
          //sceneにlineを追加
          // console.log(this);
          this.add( holizontal_line );
        }

        // 負荷のグラフ
        //geometryの宣言と生成
        if( i+stride <= 360 ){
          var damage_geometry = new THREE.Geometry();
          const damage_position = getDamage(i);
          const next_damage_position = getDamage(i+stride);

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
      ver_geometry.vertices.push( new THREE.Vector3( positions.x, max_damage, positions.z) );
      var material = new THREE.LineBasicMaterial( { color: 0x000000} );
      material.linewidth = 2;
      var vertical_line = new THREE.Line( ver_geometry, material );
      //sceneにlineを追加
      this.add( vertical_line );

      for(var i = 0; i <= max_damage; i += interval){
        // positions.y = i + 5;
        drawAxisLabelVal( positions, String(i) , i+5 ,startAngle);
      }
    }

    const drawAxisLabelVal = (positions, text, y, angle) => {

      // 縦軸の数値を追加
      const that = this;
      const loader = new THREE.FontLoader();
      loader.load('../../../assets/fonts/helvetiker_regular.typeface.json', function(font){
        const textGeometry = new THREE.TextGeometry(text, {
          font: font,
          size: 5,
          height: 1,
          curveSegments: 12
        });
        const materials = [
          new THREE.MeshBasicMaterial( { color: 0x0f0f0f, overdraw: 0.5 } ),
          new THREE.MeshBasicMaterial( { color: 0x000000, overdraw: 0.5 } )
        ];
        const textMesh = new THREE.Mesh(textGeometry, materials);
        textMesh.position.set(positions.x, y, positions.z);
        textMesh.rotation.set( 0,Math.PI * angle / 180,0 );
        that.axisLabelGroup.add(textMesh);
        that.add(that.axisLabelGroup);
      });
    }
    

    // pie上のtextを描く
    const drawText = (text, angle) => {
      const positions = getRotPosition(angle, radius*0.7);
      // function内でthisの内容が変わるためthatで記憶しておく
      const that = this;
      const loader = new THREE.FontLoader();
      loader.load('../../../assets/fonts/helvetiker_regular.typeface.json', function(font){
        const textGeometry = new THREE.TextGeometry(text, {
          font: font,
          size: 20,
          height: 5,
          curveSegments: 12
        });
        const materials = [
          new THREE.MeshBasicMaterial( { color: 0xffffff, overdraw: 0.5 } ),
          new THREE.MeshBasicMaterial( { color: 0x000000, overdraw: 0.5 } )
        ];
        const textMesh = new THREE.Mesh(textGeometry, materials);
        textMesh.position.set(positions.x-10, -3, positions.z-10);
        textMesh.rotation.set(-Math.PI/2, 0, -Math.PI/2);
        that.add(textMesh);
      });
    }

    // 関数呼び出し
    drowPie(startAngle, endAngle, chartColor, sectorNum);
    drawVerticalLines(startAngle);
    drawText(text, (sectorNum+1)*sectorAngle-25);
  }

  // /** 更新命令を定義します。 */
  // update() {
  //   // this.axisLabelGroup.rotation.setFromRotationMatrix( this.camera.matrix );　//これを追加
  // }
}


// var chart = new CanvasJS.Chart("columnChartContainer", {
//     theme: "light1", // "light2", "dark1", "dark2"
//     animationEnabled: false, // change to true		
//     title:{
//         text: "棒グラフ"
//     },
//     data: [
//     {
//         // Change type to "bar", "area", "spline", "pie",etc.
//         type: "column",
//         dataPoints: [
//             { label: "apple",  y: 10  },
//             { label: "orange", y: 15  },
//             { label: "banana", y: 25  },
//             { label: "mango",  y: 30  },
//             { label: "grape",  y: 28  }
//         ]
//     }
//     ]
// });
// chart.render();
    
    

    // var limit = 1000;
    
    // var y = 0;
    // var data = [];
    // var dataSeries = { type: "line" };
    // var dataPoints = [];
    // for (var i = 0; i < limit; i += 1) {
    //     y += (Math.random() * 10 - 5);
    //     dataPoints.push({
    //         x: i - limit / 2,
    //         y: y
    //     });
    // }
    // dataSeries.dataPoints = dataPoints;
    // data.push(dataSeries);

    // var chart = new CanvasJS.Chart("lineChartContainer", {
    //     animationEnabled: true,
    //     zoomEnabled: true,
    //     title:{
    //         text: "クレーンの使用頻度" 
    //     },
    //     axisY :{
    //         includeZero:false
    //     },
    //     data: data  // random generator below
    // });
    // chart.render();
    

// ページの読み込みを待つ
window.addEventListener('load', init);

function init() {
  // サイズを指定
  const width = 600;
  const height = 400;
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

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height);
  // カメラの初期座標を設定
  camera.position.set(0, 350, 0);
  camera.rotation.set(0, -Math.PI/2,0);
  // カメラコントローラーを作成
  const controls = new THREE.OrbitControls(camera);
  // controls.minDistance = radius*2;
  // controls.maxDistance = Infinity;
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
  var geometry = new THREE.PlaneGeometry(107*0.2, 199*0.2);
  var mesh = new THREE.Mesh( geometry, material );
  mesh.rotation.set(-Math.PI/2, 0, -Math.PI/2);
  mesh.position.set(130,0,20);
  scene.add( mesh );


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
    sectorlist[sectorNum] = new PieChart(i, i+sectorAngle, color_list[sectorNum], sectorNum, String.fromCharCode(65+sectorNum));
    sectorlist[sectorNum].rotation.y = Math.PI/2;
    scene.add(sectorlist[sectorNum]);
    // console.log(sectorlist[sectorNum]);
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
// var chart = new CanvasJS.Chart("mixChartContainer", {
// 	animationEnabled: true,
// 	theme: "light2",
// 	title: {
// 		text: "月別xxxデータ"
// 	},
// 	axisX: {
// 		valueFormatString: "MMM"
// 	},
// 	axisY: {
// 		prefix: "",
// 		labelFormatter: addSymbols
// 	},
// 	toolTip: {
// 		shared: true
// 	},
// 	legend: {
// 		cursor: "pointer",
// 		itemclick: toggleDataSeries
// 	},
// 	data: [
// 	{
// 		type: "column",
// 		name: "実際の量",
// 		showInLegend: true,
// 		xValueFormatString: "MMMM YYYY",
// 		yValueFormatString: "#,##0",
// 		dataPoints: [
// 			{ x: new Date(2018, 0), y: 20000 },
// 			{ x: new Date(2018, 1), y: 30000 },
// 			{ x: new Date(2018, 2), y: 25000 },
// 			{ x: new Date(2018, 3), y: 70000, indexLabel: "High Renewals" },
// 			{ x: new Date(2018, 4), y: 50000 },
// 			{ x: new Date(2018, 5), y: 35000 },
// 			{ x: new Date(2018, 6), y: 30000 },
// 			{ x: new Date(2018, 7), y: 43000 },
// 			{ x: new Date(2018, 8), y: 35000 },
// 			{ x: new Date(2018, 9), y:  30000},
// 			{ x: new Date(2018, 10), y: 40000 },
// 			{ x: new Date(2018, 11), y: 50000 }
// 		]
// 	}, 
// 	{
// 		type: "line",
// 		name: "予想量",
// 		showInLegend: true,
// 		yValueFormatString: "#,##0",
// 		dataPoints: [
// 			{ x: new Date(2018, 0), y: 40000 },
// 			{ x: new Date(2018, 1), y: 42000 },
// 			{ x: new Date(2018, 2), y: 45000 },
// 			{ x: new Date(2018, 3), y: 45000 },
// 			{ x: new Date(2018, 4), y: 47000 },
// 			{ x: new Date(2018, 5), y: 43000 },
// 			{ x: new Date(2018, 6), y: 42000 },
// 			{ x: new Date(2018, 7), y: 43000 },
// 			{ x: new Date(2018, 8), y: 41000 },
// 			{ x: new Date(2018, 9), y: 45000 },
// 			{ x: new Date(2018, 10), y: 42000 },
// 			{ x: new Date(2018, 11), y: 50000 }
// 		]
// 	},
// 	{
// 		type: "area",
// 		name: "xxxx",
// 		markerBorderColor: "white",
// 		markerBorderThickness: 2,
// 		showInLegend: true,
// 		yValueFormatString: "#,##0",
// 		dataPoints: [
// 			{ x: new Date(2018, 0), y: 5000 },
// 			{ x: new Date(2018, 1), y: 7000 },
// 			{ x: new Date(2018, 2), y: 6000},
// 			{ x: new Date(2018, 3), y: 30000 },
// 			{ x: new Date(2018, 4), y: 20000 },
// 			{ x: new Date(2018, 5), y: 15000 },
// 			{ x: new Date(2018, 6), y: 13000 },
// 			{ x: new Date(2018, 7), y: 20000 },
// 			{ x: new Date(2018, 8), y: 15000 },
// 			{ x: new Date(2018, 9), y:  10000},
// 			{ x: new Date(2018, 10), y: 19000 },
// 			{ x: new Date(2018, 11), y: 22000 }
// 		]
// 	}]
// });
// chart.render();

// function addSymbols(e) {
// 	var suffixes = ["", "K", "M", "B"];
// 	var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);

// 	if(order > suffixes.length - 1)                	
// 		order = suffixes.length - 1;

// 	var suffix = suffixes[order];      
// 	return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
// }

// function toggleDataSeries(e) {
// 	if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
// 		e.dataSeries.visible = false;
// 	} else {
// 		e.dataSeries.visible = true;
// 	}
// 	e.chart.render();
// }




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