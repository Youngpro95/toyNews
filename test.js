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

document.body.addEventListener("click", (e)=>{
  const searchHistoryBox = document.body.querySelector("#searchHistoryBox");
  if(e.target == e.currentTarget.querySelector("input")){ // input 클릭시 만족하여 보여지게끔 함
    console.log("나타남")
    searchHistoryBox.style.display = "block";
  }else{
   console.log("사라짐");
    searchHistoryBox.style.display = "none";
  }
})

inputVal.addEventListener("compositionupdate", (e) => {
  //keyup 후보
  setTimeout;
});
