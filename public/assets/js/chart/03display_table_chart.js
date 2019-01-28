var sum  = function(arr) {
  return arr.reduce(function(prev, current, i, arr) {
      return prev+current;
  });
};

// 合計を計算
var sum_segments_num = [];
var sum_segments_time = [];
var sum_class_num = [0,0,0,0,0,0];
var sum_class_time = [0,0,0,0,0,0];
// IE判定用
var userAgent = window.navigator.userAgent.toLowerCase();

// 表示可能最小最大年月日
function display_min_max_date(start, end){
  var date = [];
  date.push(start.getFullYear());
  date.push(start.getMonth() + 1);
  date.push(start.getDate()); 
  date.push(end.getFullYear());
  date.push(end.getMonth() + 1);
  date.push(end.getDate());
  for(var i = 0; i < 6; i++){
    $('.date_range > span:nth-child('+ String(i+1) +')').text(date[i]);
  }
}

// 変更を反映する
function update_data( crane_id, start, end ){
  console.log("start",start,crane_date_list[crane_id].start_y);
  if( start > end ){
    alert("開始年月日<終了年月日としてください");
  }else if( start < crane_date_list[crane_id].start_y ){
    alert(slash_dateFormat(start)+"以前にはデータが無いため開始年月日を"+slash_dateFormat(crane_date_list[crane_id].start_y)+"にしました");
    $('#date_selection_start').val( dateFormat(crane_date_list[crane_id].start_y) );
  }else if( end > crane_date_list[crane_id].end_y ){
    alert(slash_dateFormat(end)+"以降にはデータが無いため終了年月日を"+slash_dateFormat(crane_date_list[crane_id].end_y)+"にしました");
    $('#date_selection_end').val( dateFormat(crane_date_list[crane_id].end_y) );
  }else {
    // 再計算
    // 最大値を更新
    format_crane_data( start, end );
    calc_max_val(crane_id);
    // データ表示
    display_spec_data(crane_id);
    display_date_selection(crane_id, start, end);
    display_table_data(crane_id);
    // chart描画
    draw_radar_chart( crane_id, false, "#radar_chart" , max_val_list[0]);
    draw_radar_chart( crane_id, true, "#radar_chart_time", max_val_list[1]);
    draw_stacked_chart( crane_id ,'#stacked_chart', false);
    draw_stacked_chart( crane_id ,'#stacked_chart_time', true);
    draw_bar_chart( crane_id ,'#bar_chart', sum_class_num, false);
    draw_bar_chart( crane_id ,'#bar_chart_time', sum_class_time, true);
    draw_radar_chart_sum_time("#radar_chart_sum_time" , sum_segments_time);
    console.log("userAgent",userAgent);
    console.log("userAgent", typeof( userAgent));
    if(userAgent.indexOf('chrome') != -1 ) {
      console.log('お使いのブラウザはchromeですね！');
      // draw_pieChart( calc_pieChart_data( crane_id ) );
    }else {
      $('.pieChartContainer').remove();
      $('.radar_chart_sum_time').css({
        'margin': '0 auto'
      });
    }

    // draw_stacked_chart( crane_id , '#stacked_chart' , false);
    // alert("グラフを表示します\n "+crane_id+"号機\n開始　"+slash_dateFormat(start)+"\n終了　"+slash_dateFormat(end));
  }
}


// セレクトボックスを変更した際の処理
$(function(){
  $('input[name=crane_id]').change(function() {
    on_change_action(true);
  });
  $('#date_selection_start').change(function(){
    on_change_action(false);
  });
  $('#date_selection_end').change(function(){
    on_change_action(false);
  });
  function on_change_action( is_select_crane ){
    var crane_id = $('input[name=crane_id]:checked').val();
    console.log("radio crane_id", crane_id);
    if(is_select_crane){
      var start = crane_date_list[crane_id].start_y;
      var end = crane_date_list[crane_id].end_y;
      display_min_max_date(start, end);
    }else{
      var start_date = String($('#date_selection_start').val()).replace(/-/g, '/');
      var end_date = String($('#date_selection_end').val()).replace(/-/g, '/');
      // console.log("selected_craneID", crane_id);
      var start = new Date(start_date);
      var end = new Date(end_date);
    }
    // console.log("start_date", start_date);
    // console.log("end_date", end_date);
    // console.log("start", start);
    // console.log("end", end);
    update_data(crane_id, start, end);
  }
});

function display_crane_selection(){
  // クレーンのセレクトボックス
  for(var i = 1, len = spec_data_list.length; i < len; i++){
    $('.select_crane').append($('<option>').html(spec_data_list[i][0]).val(spec_data_list[i][0]));
  }
}

function display_spec_data(crane_id){
  // console.log('spec_data_list', spec_data_list);
  $('.crane_id').text(crane_id);
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
  return y + '-' + m + '-' + d;
}
// dateFormat 関数の定義
function slash_dateFormat(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  if (m < 10) { m = '0' + m; }
  if (d < 10) { d = '0' + d; }
  return y + '/' + m + '/' + d;
}
// 期間を表示
function display_date_selection( crane_id , s, e){
  const start = dateFormat(s);
  const end = dateFormat(e);
  // console.log("display_start", start);
  // console.log("display_end", end);
  $('#date_selection_start').val(start);
  $('#date_selection_end').val(end);
  // 選択範囲の設定
  const min_date = dateFormat(crane_date_list[crane_id].start_y);
  const max_date = dateFormat(crane_date_list[crane_id].end_y);
  $('#date_selection_start').attr({
    "min" : min_date,
    "max" : max_date
  });
  $('#date_selection_end').attr({
    "min" : min_date,
    "max" : max_date
  });

}

function display_table_data(crane_id){
  const index = (crane_id - 1) * segment_num;
  // console.log(index);
  
  // 初期化
  for(var i = 0, len = sum_class_num.length; i < len; i++){
    sum_class_num[i] = 0;
    sum_class_time[i] = 0;
  }
  for(var i = 0; i < segment_num; i++){ 
    sum_segments_num[i] = (crane_data[index+i][2] + crane_data[index+i][3] + crane_data[index+i][4] + crane_data[index+i][5] + crane_data[index+i][6] + crane_data[index+i][7]);
    sum_segments_time[i] = (crane_data[index+i][8] + crane_data[index+i][9] + crane_data[index+i][10] + crane_data[index+i][11] + crane_data[index+i][12] + crane_data[index+i][13]);
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

  // console.log('sum_class_num',sum_class_num);
  // console.log('sum_class_time',sum_class_time);




  // 表示
  for(var i = 0; i < segment_num; i++){ 
    // 回数データ
    for(var j = 2; j < 8; j++ ){
      $('table.tb_numbers  > tbody > tr:nth-child('+ String(j) +') > td:nth-child('+ String(2+i) +')').text(crane_data[index+i][j]);
    }
    $('table.tb_numbers  > tbody > tr:nth-child(8) > td:nth-child('+ String(2+i) +')').text(sum_segments_num[i]);
    // 時間データ
    for(var j = 2; j < 8; j++){
      $('table.tb_hours > tbody > tr:nth-child('+ String(j) +') > td:nth-child('+ String(2+i) +')').text(crane_data[index+i][j+6].toFixed(1));
    }
    $('table.tb_hours > tbody > tr:nth-child(8) > td:nth-child('+ String(2+i) +')').text(sum_segments_time[i].toFixed(1));
  }
  // 合計(縦列)
  for(var i = 0, len = sum_class_num.length; i < len; i++){
    // 荷重区分
    // 回数
    $('table.tb_numbers  > tbody > tr:nth-child('+ String(2+i) +') > td:nth-child(10)').text(sum_class_num[i]);
    // 時間
    $('table.tb_hours > tbody > tr:nth-child('+ String(2+i) +') > td:nth-child(10)').text(sum_class_time[i].toFixed(1));
  }
  $('table.tb_numbers  > tbody > tr:nth-child(8) > td:nth-child(10)').text(sum(sum_class_num));
  $('table.tb_hours > tbody > tr:nth-child(8) > td:nth-child(10)').text(sum(sum_class_time).toFixed(1));

}

function calc_pieChart_data( crane_id ){
  var damage_data = [];
  var index = calc_index(crane_id);
  // console.log("crane_data", crane_data);
  for( var i = 0; i < segment_num; i++ ){
    const d_index = i * 45;
    for( var j = d_index; j < d_index+45; j++ ){
      damage_data[j] = [j,calc_damage_crane(crane_data[index+i])];
    }
  }
  // console.log("damagedata", damage_data);
  return damage_data;
}
function calc_damage_crane( data ){
  var sum = 0;
  for(var i = 2; i < 8;i++){
    sum += Number(data[i]);
  }
  sum += Number(
    data[2] * 5 * data[8] +  //0-10%
    data[3] * 4 * data[9] +  //10-50%
    data[4] * 3 * data[10] + //50-63%
    data[5] * 2 * data[11] + //63-80%
    data[6] * 1 * data[12] + //80-100%
    data[7] * 6 * data[13]   //100%以上
  );

  // console.log(sum);
  return sum;
}