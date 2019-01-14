// 絶対値計算
function abs(val) {
  return val < 0 ? -val : val;
};
// csvファイル読み込み関数(同期)
function openFile(url) {
  const xhr = new XMLHttpRequest();
  const p = new Promise((resolve, reject) => {
      xhr.open('GET', url);
      xhr.addEventListener('load', (e) => resolve(xhr));
      xhr.send();
  });
  return p;
}

async function loadAllFiles() {
  const xhr1 = await openFile('assets/data/crane_specs.csv');
  const xhr2 = await openFile('assets/data/crane_log.csv');
  // const xhr3 = await openFile('baz.txt');
  console.log('load_done!');
  save_spec_data(xhr1);
  save_log_data(xhr2);
}


function save_spec_data( spec_data ){
  // console.log(spec_data.responseText);
  spec_data_list = convertCSVtoArray(spec_data.responseText); // 渡されるのは読み込んだCSVデータ
}
function save_log_data( log_data ){
  // console.log(log_data.responseText);
  log_data_list = convertCSVtoArray(log_data.responseText); // 渡されるのは読み込んだCSVデータ
  console.log(log_data_list);

  var j = 0;
  // 全部のidを調べて保存用配列の作成
  var added_id = [];
  for(var i = 1; i < log_data_list.length; i++ ){
    // 登録されたことがなかったら,crane_dataに追加
    if(added_id.indexOf(log_data_list[i][0]) == -1){
      crane_data[j] = new Info(log_data_list[i][0],"A",0,0,0,0,0,0,0,0,0,0,0,0);j++;
      crane_data[j] = new Info(log_data_list[i][0],"B",0,0,0,0,0,0,0,0,0,0,0,0);j++;
      crane_data[j] = new Info(log_data_list[i][0],"C",0,0,0,0,0,0,0,0,0,0,0,0);j++;
      crane_data[j] = new Info(log_data_list[i][0],"D",0,0,0,0,0,0,0,0,0,0,0,0);j++;
      crane_data[j] = new Info(log_data_list[i][0],"E",0,0,0,0,0,0,0,0,0,0,0,0);j++;
      crane_data[j] = new Info(log_data_list[i][0],"F",0,0,0,0,0,0,0,0,0,0,0,0);j++;
      crane_data[j] = new Info(log_data_list[i][0],"G",0,0,0,0,0,0,0,0,0,0,0,0);j++;
      crane_data[j] = new Info(log_data_list[i][0],"H",0,0,0,0,0,0,0,0,0,0,0,0);j++;
      added_id.push(log_data_list[i][0]);
    }
  }
  console.log(crane_data);
  var isFirst = true;
  log_data_list.forEach(function(data){
    if(isFirst){
      isFirst = false;
    }else{
      // console.log(data);
      // 負荷率
      if     (data[7] > 0    && data[7] <= 0.10)  { classify_data(data,0); }
      else if(data[7] > 0.10 && data[7] <= 0.50)  { classify_data(data,1); }
      else if(data[7] > 0.50 && data[7] <= 0.63)  { classify_data(data,2); }
      else if(data[7] > 0.63 && data[7] <= 0.80)  { classify_data(data,3); }
      else if(data[7] > 0.80 && data[7] <= 1)     { classify_data(data,4); }
      else if(data[7] > 1)                        { classify_data(data,5); }
    }
  });
  console.log(crane_data);

}
function get_segment_num(segment){
  if(segment == "A"){ return 0;}
  if(segment == "B"){ return 1;}
  if(segment == "C"){ return 2;}
  if(segment == "D"){ return 3;}
  if(segment == "E"){ return 4;}
  if(segment == "F"){ return 5;}
  if(segment == "G"){ return 6;}
  if(segment == "H"){ return 7;}
}
function classify_data(data, range_id) {
  // start
  const start = data[0] - 1 + get_segment_num(data[8]);
  // end
  const end = data[0] - 1 + get_segment_num(data[9]);
  add_damage_data(start, end, range_id);
  // if(range_id == 0){ crane_data[index1]._0_10 += 1; crane_data[index2]._0_10 += 1;}
  // if(range_id == 1){ crane_data[index1]._10_50 += 1; crane_data[index2]._10_50 += 1;}
  // if(range_id == 2){ crane_data[index1]._50_63 += 1; crane_data[index2]._50_63 += 1;}
  // if(range_id == 3){ crane_data[index1]._63_80 += 1; crane_data[index2]._63_80 += 1;}
  // if(range_id == 4){ crane_data[index1]._80_100 += 1; crane_data[index2]._80_100 += 1;}
  // if(range_id == 5){ crane_data[index1]._100_over += 1; crane_data[index2]._100_over += 1;}
}

function add_damage_data(start, end, range_id){
  console.log("start", start,"end", end);
  console.log("diff abs", abs(start-end));
  // 差の絶対値が4以下なら普通に通過 (segmentが8つに分割されているので)
  if( abs(start-end) <= 4){
    if( start < end ) {
      for(var i = start; i <= end; i++){
        add_passes_num(i, range_id);
      }
    }else if ( start > end ){
      for(var i = start; i >= end; i--){
        add_passes_num(i, range_id);
      }
    }else {
      // startとendが同じ時
      add_passes_num(start, range_id);
    }
  }else { //4より大きいなら逆回り
    const itr_length = 8 - abs(start-end);
    console.log("itter_length", itr_length);
    if( start < end ) {
      var j = end;
      for(var i = 0; i <= itr_length; i++){
        add_passes_num((j%8), range_id);
        j++;
      }
    }else if ( start > end ){
      var j = start;
      for(var i = 0; i <= itr_length; i++){
        add_passes_num((j%8), range_id);
        j++;
      }
    }
  }
  cnt = 1;
}
var cnt = 1;
function add_passes_num(index, range_id){
  console.log("index", index);
  console.log("range_id", range_id);
  console.log("cnt", cnt);
  cnt++;

  if(range_id == 0){ crane_data[index]._0_10 += 1; }
  if(range_id == 1){ crane_data[index]._10_50 += 1;}
  if(range_id == 2){ crane_data[index]._50_63 += 1;}
  if(range_id == 3){ crane_data[index]._63_80 += 1;}
  if(range_id == 4){ crane_data[index]._80_100 += 1;}
  if(range_id == 5){ crane_data[index]._100_over += 1;}
}


/* ----------------------------
変数定義
 ----------------------------*/
var spec_data_list = [];
var log_data_list = [];

var crane_data = [];
function Info(_id, _segment, _0_10, _10_50, _50_63, _63_80, _80_100, _100_over, _0_10_time, _10_50_time, _50_63_time, _63_80_time, _80_100_time, _100_over_time) {
  this.id = _id,
  this.segment = _segment;
  this._0_10 = _0_10;
  this._10_50 = _10_50;
  this._50_63 = _50_63;
  this._63_80 = _63_80;
  this._80_100 = _80_100;
  this._100_over = _100_over;
  this._0_10 = _0_10_time;
  this._10_50 = _10_50_time;
  this._50_63 = _50_63_time;
  this._63_80 = _63_80_time;
  this._80_100 = _80_100_time;
  this._100_over = _100_over_time;
}

loadAllFiles();

