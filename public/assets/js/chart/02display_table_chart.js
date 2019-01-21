var sum  = function(arr) {
  return arr.reduce(function(prev, current, i, arr) {
      return prev+current;
  });
};

var sum_class_num = [0,0,0,0,0,0];
var sum_class_time = [0,0,0,0,0,0];


// 変更を反映する
function update_data( crane_id ){
  // 最大値を更新
  calc_max_val(crane_id);
  display_spec_data(crane_id);
  display_date_selection(crane_id);
  display_table_data(crane_id);
  // chart描画
  draw_radar_chart( crane_id, false, "#radar_chart" , max_val_list[0]);
  draw_radar_chart( crane_id, true, "#radar_chart_time", max_val_list[1]);
  draw_stacked_chart( crane_id ,'#stacked_chart', false);
  draw_stacked_chart( crane_id ,'#stacked_chart_time', true);
  draw_bar_chart( crane_id ,'#bar_chart', sum_class_num, false);
  draw_bar_chart( crane_id ,'#bar_chart_time', sum_class_time, true);
  // draw_stacked_chart( crane_id , '#stacked_chart' , false);
}

// セレクトボックスを変更した際
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
// dateFormat 関数の定義
function dateFormat(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();

  if (m < 10) { m = '0' + m; }
  if (d < 10) { d = '0' + d; }
  // フォーマット整形済みの文字列を戻り値にする
  return y + '-' + m + '-' + d;
}
// 期間を表示
function display_date_selection( crane_id ){
  console.log(crane_date_list[crane_id].start_y);
  const s = crane_date_list[crane_id].start_y;
  const e = crane_date_list[crane_id].end_y;
  const start = dateFormat(s);
  const end = dateFormat(e);
  console.log(start);
  console.log(end);
  $('#date_selection_start').val(start);
  $('#date_selection_end').val(end);
  // 選択範囲の設定
  $('#date_selection_start').attr({
    "min" : start,
    "max" : end
  });
  $('#date_selection_end').attr({
    "min" : start,
    "max" : end
  });

}

function display_table_data(crane_id){
  const index = (crane_id - 1) * segment_num;
  console.log(index);
  // 合計を計算
  var sum_segments_num = [];
  var sum_segments_time = [];
  // 初期化
  for(var i = 0, len = sum_class_num.length; i < len; i++){
    sum_class_num[i] = 0;
    sum_class_time[i] = 0;
  }
  for(var i = 0; i < segment_num; i++){ 
    sum_segments_num.push(crane_data[index+i][2] + crane_data[index+i][3] + crane_data[index+i][4] + crane_data[index+i][5] + crane_data[index+i][6] + crane_data[index+i][7]);
    sum_segments_time.push(crane_data[index+i][8] + crane_data[index+i][9] + crane_data[index+i][10] + crane_data[index+i][11] + crane_data[index+i][12] + crane_data[index+i][13]);
  }
  // console.log('sum_segments_num',sum_segments_num);
  // console.log('sum_segments_time',sum_segments_time);

  
  // 回数合計
  for(var ittr = 0; ittr < 6; ittr++){
    for(var j = 0; j < segment_num; j++){ 
      sum_class_num[ittr] += crane_data[index+j][ittr+2];
    } 
  }

  // 回数合計
  for(var ittr = 0; ittr < 6; ittr++){
    for(var j = 0; j < segment_num; j++){ 
      sum_class_time[ittr] += crane_data[index+j][ittr+8];
    }
  }
  // for(var ittr = 0; ittr < 6; ittr++){
  //   sum_class_time[ittr] = sum_class_time[ittr].toFixed(1);
  // }

  console.log('sum_class_num',sum_class_num);
  console.log('sum_class_time',sum_class_time);




  // 表示
  for(var i = 0; i < segment_num; i++){ 
    // 回数データ
    for(var j = 2; j < 8; j++ ){
      $('body > section.summary_sheet > div.flex.tables > table:nth-child(1) > tbody > tr:nth-child('+ String(j) +') > td:nth-child('+ String(2+i) +')').text(crane_data[index+i][j]);
    }
    $('body > section.summary_sheet > div.flex.tables > table:nth-child(1) > tbody > tr:nth-child(8) > td:nth-child('+ String(2+i) +')').text(sum_segments_num[i]);
    // 時間データ
    for(var j = 2; j < 8; j++){
      $('body > section.summary_sheet > div.flex.tables > table:nth-child(2) > tbody > tr:nth-child('+ String(j) +') > td:nth-child('+ String(2+i) +')').text(crane_data[index+i][j+6].toFixed(1));
    }
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