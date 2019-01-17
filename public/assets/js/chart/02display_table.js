var sum  = function(arr) {
  return arr.reduce(function(prev, current, i, arr) {
      return prev+current;
  });
};

// 変更を反映する
function update_data( crane_id ){
  // 最大値を更新
  calc_max_val(crane_id);
  display_spec_data(crane_id);
  display_table_data(crane_id);
  // chart描画
  draw_radar_chart( crane_id, false, "#radar_chart" , max_val_list[0]);
  draw_radar_chart( crane_id, true, "#radar_chart_time", max_val_list[1]);
}

$(function(){
  $('.select_crane').change(function() {
    //選択された地方のvalueを取得し変数に入れる
    var crane_id = $(this).val();
    console.log("selected_craneID", crane_id);
    update_data(crane_id);
  });
});

function display_crane_selection(){
  // クレーンのセレクトボックス
  for(var i = 1; i < spec_data_list.length; i++){
    $('.select_crane').append($('<option>').html(spec_data_list[i][0]).val(spec_data_list[i][0]));
  }
}

function display_spec_data(crane_id){
  console.log('spec_data_list', spec_data_list);
  
  $('.max_weight').text(spec_data_list[crane_id][1]);
  $('.max_turn_radius').text(spec_data_list[crane_id][2]);
  $('.ttb_pcd').text(spec_data_list[crane_id][3]);
  
}

function display_table_data(crane_id){
  const index = (crane_id - 1) * segment_num;
  console.log(index);
  // 合計を計算
  var sum_segments_num = [];
  var sum_segments_time = [];
  var sum_class_num = [];
  var sum_class_time = [];
  for(var i = 0; i < segment_num; i++){ 
    sum_segments_num.push(crane_data[index+i][2] + crane_data[index+i][3] + crane_data[index+i][4] + crane_data[index+i][5] + crane_data[index+i][6] + crane_data[index+i][7]);
    sum_segments_time.push(crane_data[index+i][8] + crane_data[index+i][9] + crane_data[index+i][10] + crane_data[index+i][11] + crane_data[index+i][12] + crane_data[index+i][13]);
  }
  // console.log('sum_segments_num',sum_segments_num);
  // console.log('sum_segments_time',sum_segments_time);

  var sum_class_num = [0,0,0,0,0,0];
  var sum_class_time = [0,0,0,0,0,0];
  // 回数合計
  for(var ittr = 0; ittr < 6; ittr++){
    for(var j = 0; j < segment_num; j++){ 
      for(var k = 2; k < 8; k++){
        sum_class_num[ittr] += crane_data[index+j][k]
      }
    } 
  }
   
  // for(var j = 0; j < segment_num; j++){ sum_class_num[ittr] += crane_data[index+j]._10_50 }  ittr++;
  // for(var j = 0; j < segment_num; j++){ sum_class_num[ittr] += crane_data[index+j]._50_63 }  ittr++;
  // for(var j = 0; j < segment_num; j++){ sum_class_num[ittr] += crane_data[index+j]._63_80 }  ittr++;
  // for(var j = 0; j < segment_num; j++){ sum_class_num[ittr] += crane_data[index+j]._80_100 }  ittr++;
  // for(var j = 0; j < segment_num; j++){ sum_class_num[ittr] += crane_data[index+j]._100_over }  ittr++;
  
  // 時間合計
  ittr = 0;
  // 回数合計
  for(var ittr = 0; ittr < 6; ittr++){
    for(var j = 0; j < segment_num; j++){ 
      for(var k = 8; k < 14; k++){
        sum_class_time[ittr] += crane_data[index+j][k]
      }
    } 
  }
  // for(var j = 0; j < segment_num; j++){ sum_class_time[ittr] += crane_data[index+j]._0_10_time }  ittr++;
  // for(var j = 0; j < segment_num; j++){ sum_class_time[ittr] += crane_data[index+j]._10_50_time }  ittr++;
  // for(var j = 0; j < segment_num; j++){ sum_class_time[ittr] += crane_data[index+j]._50_63_time }  ittr++;
  // for(var j = 0; j < segment_num; j++){ sum_class_time[ittr] += crane_data[index+j]._63_80_time }  ittr++;
  // for(var j = 0; j < segment_num; j++){ sum_class_time[ittr] += crane_data[index+j]._80_100_time }  ittr++;
  // for(var j = 0; j < segment_num; j++){ sum_class_time[ittr] += crane_data[index+j]._100_over_time }  ittr++;

  console.log('sum_class_num',sum_class_num);
  console.log('sum_class_time',sum_class_time);




  // 表示
  for(var i = 0; i < segment_num; i++){ 
    // 回数データ
    for(var j = 2; j < 8; j++ ){
      $('body > section.summary_sheet > div.flex.tables > table:nth-child(1) > tbody > tr:nth-child('+ String(j) +') > td:nth-child('+ String(2+i) +')').text(crane_data[index+i][j]);
    }
    // $('body > section.summary_sheet > div.flex.tables > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child('+ String(2+i) +')').text(crane_data[index+i]._0_10);
    // $('body > section.summary_sheet > div.flex.tables > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child('+ String(2+i) +')').text(crane_data[index+i]._10_50);
    // $('body > section.summary_sheet > div.flex.tables > table:nth-child(1) > tbody > tr:nth-child(4) > td:nth-child('+ String(2+i) +')').text(crane_data[index+i]._50_63);
    // $('body > section.summary_sheet > div.flex.tables > table:nth-child(1) > tbody > tr:nth-child(5) > td:nth-child('+ String(2+i) +')').text(crane_data[index+i]._63_80);
    // $('body > section.summary_sheet > div.flex.tables > table:nth-child(1) > tbody > tr:nth-child(6) > td:nth-child('+ String(2+i) +')').text(crane_data[index+i]._80_100);
    // $('body > section.summary_sheet > div.flex.tables > table:nth-child(1) > tbody > tr:nth-child(7) > td:nth-child('+ String(2+i) +')').text(crane_data[index+i]._100_over);
    $('body > section.summary_sheet > div.flex.tables > table:nth-child(1) > tbody > tr:nth-child(8) > td:nth-child('+ String(2+i) +')').text(sum_segments_num[i]);
    // 時間データ
    for(var j = 2; j < 8; j++){
      $('body > section.summary_sheet > div.flex.tables > table:nth-child(2) > tbody > tr:nth-child('+ String(j) +') > td:nth-child('+ String(2+i) +')').text(crane_data[index+i][j+6].toFixed(1));
    }
    // $('body > section.summary_sheet > div.flex.tables > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child('+ String(2+i) +')').text(crane_data[index+i]._0_10_time.toFixed(1));
    // $('body > section.summary_sheet > div.flex.tables > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child('+ String(2+i) +')').text(crane_data[index+i]._10_50_time.toFixed(1));
    // $('body > section.summary_sheet > div.flex.tables > table:nth-child(2) > tbody > tr:nth-child(4) > td:nth-child('+ String(2+i) +')').text(crane_data[index+i]._50_63_time.toFixed(1));
    // $('body > section.summary_sheet > div.flex.tables > table:nth-child(2) > tbody > tr:nth-child(5) > td:nth-child('+ String(2+i) +')').text(crane_data[index+i]._63_80_time.toFixed(1));
    // $('body > section.summary_sheet > div.flex.tables > table:nth-child(2) > tbody > tr:nth-child(6) > td:nth-child('+ String(2+i) +')').text(crane_data[index+i]._80_100_time.toFixed(1));
    // $('body > section.summary_sheet > div.flex.tables > table:nth-child(2) > tbody > tr:nth-child(7) > td:nth-child('+ String(2+i) +')').text(crane_data[index+i]._100_over_time.toFixed(1));
    $('body > section.summary_sheet > div.flex.tables > table:nth-child(2) > tbody > tr:nth-child(8) > td:nth-child('+ String(2+i) +')').text(sum_segments_time[i].toFixed(1));
  }
  // 合計(縦列)
  for(var i = 0; i < sum_class_num.length; i++){
    // 荷重区分
    // 回数
    $('body > section.summary_sheet > div.flex.tables > table:nth-child(1) > tbody > tr:nth-child('+ String(2+i) +') > td:nth-child(10)').text(sum_class_num[i]);
    // 時間
    $('body > section.summary_sheet > div.flex.tables > table:nth-child(2) > tbody > tr:nth-child('+ String(2+i) +') > td:nth-child(10)').text(sum_class_time[i].toFixed(1));
  }
  $('body > section.summary_sheet > div.flex.tables > table:nth-child(1) > tbody > tr:nth-child(8) > td:nth-child(10)').text(sum(sum_class_num));
  $('body > section.summary_sheet > div.flex.tables > table:nth-child(2) > tbody > tr:nth-child(8) > td:nth-child(10)').text(sum(sum_class_time).toFixed(1));

}