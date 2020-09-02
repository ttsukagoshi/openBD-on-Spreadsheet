// MIT License
// 
// Copyright (c) 2020 Taro TSUKAGOSHI
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// Global variables
const OPENBD_API_VERSION = 'v1'; // openBDのAPIバージョン。 https://openbd.jp/
const ISBN_CELL = { 'row': 7, 'column': 3 }; // ISBNを入力するセルの場所（行＆列番号）。例）{'row': 7, 'column': 3}＝セル「C7」
const DATA_CELL_START = { 'row': 13, 'column': 4 }; // 書籍データを入力するセル範囲の起点（行＆列番号）。
const REPORTING_DATE_CELL = { 'row': 11, 'column': 6 }; // データ取得時点を入力するセルの場所（行＆列番号）。
/**
 * onOpen()
 * Add menu to spreadsheet
 */
function onOpen() {
  let ui = SpreadsheetApp.getUi();
  ui.createMenu('openBD')
    .addItem('調べる', 'lookupOpenBD')
    .addToUi();
}


function lookupOpenBD() {
  var ui = SpreadsheetApp.getUi();
  var currentSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var isbn = currentSheet.getRange(ISBN_CELL.row, ISBN_CELL.column).getValue();
  var url = `https://api.openbd.jp/${OPENBD_API_VERSION}/get?isbn=${encodeURIComponent(isbn)}`;
  var now = Utilities.formatDate(new Date(), SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(), 'yyyy-MM-dd HH:mm:ss Z');
  try {
    // openBDのAPIを叩く
   let responses = JSON.parse(UrlFetchApp.fetch(url).getContentText());
    if (!responses.length) {
      throw new Error('該当する書籍が見つかりません。')
    }
    // 必要な情報の抽出
    let bookInfos = responses.map(element => {
      let bookSummary = {
        'isbn': element.summary.isbn,
        'title': element.summary.title,
        'volume': element.summary.volume,
        'series': element.summary.series,
        'author': element.summary.author,
        'publisher': element.summary.publisher,
        'pubdate': element.summary.pubdate,
        'coverUrl': element.summary.cover,
        'coverImage': `=image("${element.summary.cover}")`
      };
      return bookSummary;
    });
    console.log(bookInfos);/////////////////////////////////////
    // 配列の組み換え
    let isbns = [];
    let titles = [];
    let volumes = [];
    let seriesArr = [];
    let authors = [];
    let publishers = [];
    let pubdates = [];
    let coverUrls = [];
    let coverImages = [];
    for (let i = 0; i < bookInfos.length; i++) {
      let book = bookInfos[i];
      isbns.push(book.isbn);
      titles.push(book.title);
      volumes.push(book.volume);
      seriesArr.push(book.series);
      authors.push(book.author);
      publishers.push(book.publisher);
      pubdates.push(book.pubdate);
      coverUrls.push(book.coverUrl);
      coverImages.push(book.coverImage);
    }
    let recordArray = [isbns, titles, volumes, seriesArr, authors, publishers, pubdates, coverImages, coverUrls];
    // Spreadsheetへの転記
    currentSheet.getRange(DATA_CELL_START.row, DATA_CELL_START.column, recordArray.length, recordArray[0].length)
      .setValues(recordArray);
    currentSheet.getRange(REPORTING_DATE_CELL.row, REPORTING_DATE_CELL.column)
      .setValue(now);
    // 完了メッセージ
    ui.alert('書籍データ 取得完了。')
  } catch (error) {
    let errorMessage = errorMessage_(error);
    ui.alert(errorMessage);
  }
}

/**
 * Standarized error message
 * @param {Object} e Error object
 * @return {string} Standarized error message
 */
function errorMessage_(e) {
  let message = `Error: line - ${e.lineNumber}\n${e.stack}`
  return message;
}