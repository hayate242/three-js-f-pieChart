/** グループを継承したサブクラスです。 */
class PieChart extends THREE.Group {

  
  constructor(start, end, chartColor, sectorNum, text) {
    // 何かのクラスを継承した場合はsuper()を呼び出す必要がある
    super();
    // 刻み幅
    const stride = 0.2;
    // 円の半径
    const radius = 100;
    // piechartの1sectorの角度
    const sectorAngle = 45;

    const max_damage = 100;


    // 角度から座標を取得(x,z)
    const getRotPosition = (angle, radius) => {
      // ラジアンに変換する
      const radian = angle * Math.PI / 180;
      // 角度に応じて位置を設定
      var x = radius * Math.sin(radian);
      var z = radius * Math.cos(radian);
      
      var positions = {
        x: x,
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
      
    }


    // chart 描く
    let prev_damage_position = 0;
    const drowPie = (start, end, chartColor, sectorNum) => {

      for(var i = start; i < end; i+= stride){
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
        const interval = 20;
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
        var damage_geometry = new THREE.Geometry();
        if(i == 0){
          prev_damage_position = getSin(i);
        }else if( i < 360 ){
          const damage_position = getSin(i);
          //頂点座標の追加
          damage_geometry.vertices.push( new THREE.Vector3( positions.x, prev_damage_position, positions.z) ); 
          damage_geometry.vertices.push( new THREE.Vector3( positions.x, damage_position, positions.z) ); 
          material = new THREE.LineBasicMaterial( { color: 0xff0000} );
          material.linewidth = 2;
          //線オブジェクトの生成	
          var line = new THREE.Line( damage_geometry, material );
          //sceneにlineを追加
          this.add( line );
          prev_damage_position = damage_position;
        }
      }
    }
    // 縦の線を書く
    const drawVerticalLines = (start) => {
      const positions = getRotPosition(start, radius);
        // console.log(positions);
        // 縦の線
        var ver_geometry = new THREE.Geometry();
        ver_geometry.vertices.push( new THREE.Vector3( positions.x, 0, positions.z) );
        ver_geometry.vertices.push( new THREE.Vector3( positions.x, max_damage, positions.z) );
        var material = new THREE.LineBasicMaterial( { color: 0x000000} );
        material.linewidth = 2;
        var vertical_line = new THREE.Line( ver_geometry, material );
        //sceneにlineを追加
        console.log(this);
        this.add( vertical_line );
    }
    

    // textを描く
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
    drowPie(start, end, chartColor, sectorNum);
    drawVerticalLines(start);
    drawText(text, (sectorNum+1)*sectorAngle-25);
  }
}


var chart = new CanvasJS.Chart("columnChartContainer", {
    theme: "light1", // "light2", "dark1", "dark2"
    animationEnabled: false, // change to true		
    title:{
        text: "棒グラフ"
    },
    data: [
    {
        // Change type to "bar", "area", "spline", "pie",etc.
        type: "column",
        dataPoints: [
            { label: "apple",  y: 10  },
            { label: "orange", y: 15  },
            { label: "banana", y: 25  },
            { label: "mango",  y: 30  },
            { label: "grape",  y: 28  }
        ]
    }
    ]
});
chart.render();
    
    

    var limit = 1000;
    
    var y = 0;
    var data = [];
    var dataSeries = { type: "line" };
    var dataPoints = [];
    for (var i = 0; i < limit; i += 1) {
        y += (Math.random() * 10 - 5);
        dataPoints.push({
            x: i - limit / 2,
            y: y
        });
    }
    dataSeries.dataPoints = dataPoints;
    data.push(dataSeries);

    var chart = new CanvasJS.Chart("lineChartContainer", {
        animationEnabled: true,
        zoomEnabled: true,
        title:{
            text: "折れ線グラフ" 
        },
        axisY :{
            includeZero:false
        },
        data: data  // random generator below
    });
    chart.render();
    

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
  controls.enableZoom = false;

// to disable pan 
controls.enablePan = false; 
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
    renderer.render(scene, camera);
    // animation
    requestAnimationFrame(render);
    controls.update();
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
var chart = new CanvasJS.Chart("mixChartContainer", {
	animationEnabled: true,
	theme: "light2",
	title: {
		text: "月別xxxデータ"
	},
	axisX: {
		valueFormatString: "MMM"
	},
	axisY: {
		prefix: "",
		labelFormatter: addSymbols
	},
	toolTip: {
		shared: true
	},
	legend: {
		cursor: "pointer",
		itemclick: toggleDataSeries
	},
	data: [
	{
		type: "column",
		name: "実際の量",
		showInLegend: true,
		xValueFormatString: "MMMM YYYY",
		yValueFormatString: "#,##0",
		dataPoints: [
			{ x: new Date(2018, 0), y: 20000 },
			{ x: new Date(2018, 1), y: 30000 },
			{ x: new Date(2018, 2), y: 25000 },
			{ x: new Date(2018, 3), y: 70000, indexLabel: "High Renewals" },
			{ x: new Date(2018, 4), y: 50000 },
			{ x: new Date(2018, 5), y: 35000 },
			{ x: new Date(2018, 6), y: 30000 },
			{ x: new Date(2018, 7), y: 43000 },
			{ x: new Date(2018, 8), y: 35000 },
			{ x: new Date(2018, 9), y:  30000},
			{ x: new Date(2018, 10), y: 40000 },
			{ x: new Date(2018, 11), y: 50000 }
		]
	}, 
	{
		type: "line",
		name: "予想量",
		showInLegend: true,
		yValueFormatString: "#,##0",
		dataPoints: [
			{ x: new Date(2018, 0), y: 40000 },
			{ x: new Date(2018, 1), y: 42000 },
			{ x: new Date(2018, 2), y: 45000 },
			{ x: new Date(2018, 3), y: 45000 },
			{ x: new Date(2018, 4), y: 47000 },
			{ x: new Date(2018, 5), y: 43000 },
			{ x: new Date(2018, 6), y: 42000 },
			{ x: new Date(2018, 7), y: 43000 },
			{ x: new Date(2018, 8), y: 41000 },
			{ x: new Date(2018, 9), y: 45000 },
			{ x: new Date(2018, 10), y: 42000 },
			{ x: new Date(2018, 11), y: 50000 }
		]
	},
	{
		type: "area",
		name: "xxxx",
		markerBorderColor: "white",
		markerBorderThickness: 2,
		showInLegend: true,
		yValueFormatString: "#,##0",
		dataPoints: [
			{ x: new Date(2018, 0), y: 5000 },
			{ x: new Date(2018, 1), y: 7000 },
			{ x: new Date(2018, 2), y: 6000},
			{ x: new Date(2018, 3), y: 30000 },
			{ x: new Date(2018, 4), y: 20000 },
			{ x: new Date(2018, 5), y: 15000 },
			{ x: new Date(2018, 6), y: 13000 },
			{ x: new Date(2018, 7), y: 20000 },
			{ x: new Date(2018, 8), y: 15000 },
			{ x: new Date(2018, 9), y:  10000},
			{ x: new Date(2018, 10), y: 19000 },
			{ x: new Date(2018, 11), y: 22000 }
		]
	}]
});
chart.render();

function addSymbols(e) {
	var suffixes = ["", "K", "M", "B"];
	var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);

	if(order > suffixes.length - 1)                	
		order = suffixes.length - 1;

	var suffix = suffixes[order];      
	return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
}

function toggleDataSeries(e) {
	if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	} else {
		e.dataSeries.visible = true;
	}
	e.chart.render();
}

