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