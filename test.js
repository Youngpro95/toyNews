const inputVal = document.body.querySelector("input");
const searchButton = document.body.querySelector("body > button");

console.log(inputVal.value);
let searchArray = [];

function addDiv() {
  let keywordHistory = document.querySelector("#recentKeyword");
  let searchHistoryDiv = document.createElement("div");
  searchHistoryDiv.innerHTML = inputVal.value;
  searchHistoryDiv.setAttribute("id", "searchHistory");

  if (searchArray.length === 6) {
    (function () {
      const dom = document.querySelector("#searchHistory:nth-child(5)");
      let p = dom.parentElement;
      p.removeChild(dom);
      console.log("실행");
      console.log(dom);
    })();
  }
  keywordHistory.prepend(searchHistoryDiv);
}

inputVal.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchArray.unshift(e.target.value);
    addDiv();
    if (searchArray.length === 6) {
      searchArray.pop();
      console.log(searchArray);
    } else {
      console.log(searchArray);
    }
  }
}); // 검색 히스토리 배열 저장 및 5개이상 시 가장 처음 검색했던 내용 삭제

inputVal.addEventListener("click", (e) => {
  console.log("눌렸습니다");
  // const keywordDiv = document.body.querySelector("#recentKeyword");
  // console.log(keywordDiv)
  // if (keywordDiv.style.visibility === "hidden") {
  //   keywordDiv.style.visibility = "visible";
  // } else {
  //   keywordDiv.style.visibility = "hidden";
  // }
});

inputVal.addEventListener("compositionupdate", (e) => {
  //keyup 후보
  setTimeout;
});
