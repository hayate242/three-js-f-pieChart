/** グループを継承したサブクラスです。 */
class PieChart extends THREE.Group {

  
  constructor(start, end, chartColor, sectorNum, text) {
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
      for(i = 0; i < 360; i+= stride){
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

    console.log(max_damage);

    // chart 描く
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