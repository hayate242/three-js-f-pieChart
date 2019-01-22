/** グループを継承したサブクラスです。 */
class PieChart extends THREE.Group {
  constructor(startAngle, endAngle, sectorNum, text, damage_data) {
    // 何かのクラスを継承した場合はsuper()を呼び出す必要がある
    super();
    // console.log(damage_data);
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
    // 負荷値を返す関数
    const getOriginalDamage = ( angle ) => {
      // console.log(Math.floor(damage_data[Math.floor(angle)][1]/max_damage * max_hight) );
      return damage_data[Math.floor(angle)][1];
    }
    // 正規化した負荷値を返す関数
    const getDamageHight = ( angle ) => {
      // console.log(Math.floor(damage_data[Math.floor(angle)][1]/max_damage * max_hight) );
      return Math.floor(damage_data[Math.floor(angle)][1]/max_damage * max_hight);
    }
    const getMaxDamage = () => {
      var max_damage = 0;
      for(var i = 0; i < 360; i+= stride){
        const damage = damage_data[Math.floor(i)][1];
        // 最大値の更新
        if( max_damage < damage ){ max_damage = Number(damage); }
      }
      return max_damage;
    }

    const getColor_grad = ( angle ) => {
      const damage = getOriginalDamage(angle);
      if( max_damage*0.8 < damage ){ return 0xd81200; }      //赤
      else if( max_damage*0.7 < damage ){ return 0xd82e00; }
      else if( max_damage*0.6 < damage ){ return 0xd85200; }
      else if( max_damage*0.5 < damage ){ return 0xd88500; }
      else if( max_damage*0.4 < damage ){ return 0xd8b000; }
      else if( max_damage*0.3 < damage ){ return 0xd4d800; }
      else if( max_damage*0.2 < damage ){ return 0x7dd800; }
      else if( max_damage*0.1 < damage ){ return 0x4fd800; } //緑
      else { return 0x00d832; }
    }


//--------------------
//     定数
//--------------------

    // 刻み幅
    const stride = 0.6;
    // 円の半径
    const radius = 100;
    // piechartの1sectorの角度
    const sectorAngle = 45;

    const loader = new THREE.FontLoader();
    // グラフの高さ
    const interval_num = 5;
    const max_hight = 100;
    const interval = max_hight/interval_num;
    // 横の線
    var max_damage = getMaxDamage();
    const damage_interval = max_damage/interval_num;

    const fontPath = "./assets/fonts/helvetiker_regular.typeface.json";
    
    // console.log("max_damage", max_damage, "max_hight", max_hight);

    this.axisLabelGroup = new THREE.Group();

    // console.log(max_damage);

    // chart 描く
    const drowPie = (startAngle, endAngle, sectorNum) => {
      let positions = [];
      let next_positions = [];
      for(var i = startAngle; i < endAngle; i+= stride){
        // 円周のポジションの取得
        if( i == startAngle){
          positions = getRotPosition(i, radius);
          next_positions = getRotPosition(i + stride, radius);
        }else{
          positions = next_positions;
          next_positions = getRotPosition(i + stride, radius);
        }

        // Draw each segments
        const group = new THREE.Group();
        const geometry = new THREE.BoxGeometry( 1, 15, radius );
        if(i == startAngle){
          var material = new THREE.MeshBasicMaterial( {color: 0x000000} );
        }else {
          var material = new THREE.MeshBasicMaterial( {color: getColor_grad(i)} );
        }
        const box = new THREE.Mesh( geometry, material );
        box.position.y = -7.5;
        box.position.z = radius/2;
        group.add( box );
        const radian = i * Math.PI / 180;
        group.rotation.y = radian;
        this.add(group);

        // 角度の表示
        if( i % 45 == 0 ){
          // console.log(String(i)+"角度表示！");
          drawPieAngleLabel(positions, i, 0, i);
        }

        // 横の線
        for(var line_height = interval; line_height <= max_hight; line_height += interval){
          var holi_geometry = new THREE.Geometry();
          holi_geometry.vertices.push( new THREE.Vector3( positions.x, line_height, positions.z) );
          holi_geometry.vertices.push( new THREE.Vector3( next_positions.x, line_height, next_positions.z) );
          material = new THREE.LineBasicMaterial( { color: 0x000000} );
          // material.linewidth = 2;
          var holizontal_line = new THREE.Line( holi_geometry, material );
          //sceneにlineを追加
          // console.log(this);
          this.add( holizontal_line );
        }

        // 負荷のグラフ
        if( i+stride <= 360 ){
          var damage_geometry = new THREE.Geometry();
          const damage_position = getDamageHight(i);
          const next_damage_position = getDamageHight(i+stride);

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
      ver_geometry.vertices.push( new THREE.Vector3( positions.x, max_hight, positions.z) );
      var material = new THREE.LineBasicMaterial( { color: 0x000000} );
      // material.linewidth = 2;
      var vertical_line = new THREE.Line( ver_geometry, material );
      //sceneにlineを追加
      this.add( vertical_line );

      for(var i = 0; i <= max_hight; i += interval){
        // positions.y = i + 5;
        drawAxisLabelVal( positions, String((damage_interval*i/interval).toFixed(1)) , i+5 ,startAngle);
      }
    }

    // 縦軸の数値を追加
    const drawAxisLabelVal = (positions, text, y, angle) => {
      const that = this;
      loader.load(fontPath , function(font){
        const textGeometry = new THREE.TextGeometry(text, {
          font: font,
          size: 5,
          height: 1,
          curveSegments: 12
        });
        const materials = [
          new THREE.MeshBasicMaterial( { color: 0xff0f0f } ),
          new THREE.MeshBasicMaterial( { color: 0x000000 } )
        ];
        const textMesh = new THREE.Mesh(textGeometry, materials);
        textMesh.position.set(positions.x, y, positions.z);
        textMesh.rotation.set( 0,Math.PI * angle / 180,0 );
        that.axisLabelGroup.add(textMesh);
        that.add(that.axisLabelGroup);
      });
    }

    // draw Pie angle labels
    const drawPieAngleLabel = (positions, text, y, angle) => {

      // Pie Chartの数値を追加
      const that = this;
      loader.load(fontPath, function(font){
        const textGeometry = new THREE.TextGeometry(String(text)+"°", {
          font: font,
          size: 10,
          height: 1,
          curveSegments: 12
        });
        const materials = [
          new THREE.MeshBasicMaterial( { color: 0x0fff0f } ),
          new THREE.MeshBasicMaterial( { color: 0x000000 } )
        ];
        const textMesh = new THREE.Mesh(textGeometry, materials);
        textMesh.rotation.set( -Math.PI/2, 0, -Math.PI );
        if(angle == 0){ textMesh.position.set(positions.x, y, positions.z+5); }
        else if(angle == 45){ textMesh.position.set(positions.x+25, y, positions.z); }
        else if(angle == 90){ textMesh.position.set(positions.x+25, y, positions.z); }
        else if(angle == 135){ textMesh.position.set(positions.x+25, y, positions.z-20); }
        else if(angle == 180){ textMesh.position.set(positions.x+25, y, positions.z-15); }
        else if(angle == 225){ textMesh.position.set(positions.x, y, positions.z-18); }
        else { textMesh.position.set(positions.x, 2, positions.z); }
        that.axisLabelGroup.add(textMesh);
        that.add(that.axisLabelGroup);
      });
    }
    

    // pie上のtextを描く
    const drawText = (text, angle) => {
      const positions = getRotPosition(angle, radius*0.7);
      // function内でthisの内容が変わるためthatで記憶しておく
      const that = this;
      
      loader.load(fontPath, function(font){
        const textGeometry = new THREE.TextGeometry(text, {
          font: font,
          size: 20,
          height: 5,
          curveSegments: 12
        });
        const materials = [
          new THREE.MeshBasicMaterial( { color: 0xffffff } ),
          new THREE.MeshBasicMaterial( { color: 0x000000 } )
        ];
        const textMesh = new THREE.Mesh(textGeometry, materials);
        textMesh.position.set(positions.x+11, -3, positions.z-10);
        textMesh.rotation.set(-Math.PI/2, 0, -Math.PI);
        that.add(textMesh);
      });
    }

    // 関数呼び出し
    drowPie(startAngle, endAngle, sectorNum);
    drawVerticalLines(startAngle);
    drawText(text, (sectorNum+1)*sectorAngle-25);
  }

  // /** 更新命令を定義します。 */
  // update() {
  //   // this.axisLabelGroup.rotation.setFromRotationMatrix( this.camera.matrix );　//これを追加
  // }
}