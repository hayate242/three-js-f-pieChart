/** グループを継承したサブクラスです。 */
class PieChart extends THREE.Group {

  
  constructor(startAngle, endAngle, sectorNum, text, damage_data) {
    // 何かのクラスを継承した場合はsuper()を呼び出す必要がある
    super();
    console.log(damage_data);
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
      return damage_data[Math.floor(angle)][1];
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
    const sumDamage = () => {
      var sum = 0;
      for(var i = startAngle; i < endAngle; i++){
        // 最大値の更新
        sum += Number(damage_data[i][1]); 
      }
      return sum;
    }
    const getColor = ( max_damage ) => {
      const damageSum = sumDamage();
      console.log(damageSum);
      console.log('threshold',max_damage*45*0.5);
      const maxTimes45 = max_damage*45;
      if( maxTimes45*0.8 < damageSum ){ return 0xd81200; }
      else if( maxTimes45*0.7 < damageSum ){ return 0xd82e00; }
      else if( maxTimes45*0.6 < damageSum ){ return 0xd85200; }
      else if( maxTimes45*0.5 < damageSum ){ return 0xd88500; }
      else if( maxTimes45*0.4 < damageSum ){ return 0xd8b000; }
      else if( maxTimes45*0.3 < damageSum ){ return 0xd4d800; }
      else if( maxTimes45*0.2 < damageSum ){ return 0x7dd800; }
      else if( maxTimes45*0.1 < damageSum ){ return 0x4fd800; }
      else { return 0x00d832; }
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
    var max_damage = getMaxDamage();
    const interval = max_damage/5;

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
        if(i == startAngle){
          var material = new THREE.MeshBasicMaterial( {color: 0x000000} );
        }else {
          var material = new THREE.MeshBasicMaterial( {color: chartColor} );
        }
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
    const chartColor = getColor( max_damage );
    drowPie(startAngle, endAngle, chartColor, sectorNum);
    drawVerticalLines(startAngle);
    drawText(text, (sectorNum+1)*sectorAngle-25);
  }

  // /** 更新命令を定義します。 */
  // update() {
  //   // this.axisLabelGroup.rotation.setFromRotationMatrix( this.camera.matrix );　//これを追加
  // }
}