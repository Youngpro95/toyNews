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
  SearchArticle(inputVal.value)
}

inputVal.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    clearDiv();
    searchArray.unshift(e.target.value);
    addDiv();
    if (searchArray.length === 6) {
      searchArray.pop();
      console.log(searchArray);
    }
  }
}); // 검색 히스토리 배열 저장 및 5개이상 시 가장 처음 검색했던 내용 삭제

function clearDiv(){
  const articleInfo = document.querySelector("#searchResult") //최상위
  let headnews = document.querySelector(".newsHead")
  console.log(articleInfo)
  if(articleInfo === null){
    return console.log("널값");
  }
  while(articleInfo.hasChildNodes()){
    articleInfo.removeChild(articleInfo.firstChild);
  }
}


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

function SearchArticle(item) {
  fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${item}&api-key=qbVKMvjD8NnyNN4dAYbv7kIxGZs0mrjK`)
  .then((response)=>  response.json())
  .then((data)=>{
    for(let i=0;i<=data.response.docs.length; i++){
      const searchResult = document.querySelector("#searchResult")
      const articleDiv = document.createElement("div");
      const headlineDiv = document.createElement("div");
      const newsDate = document.createElement("div");
      const clipBtn = document.createElement("button");
      const urlLink = document.createElement("a");
      const urlBtn = document.createElement("button");
      
      // searchResult.setAttribute("id", "searchResult");
      articleDiv.setAttribute("class","article");
      headlineDiv.setAttribute("class", "newsHead");
      newsDate.setAttribute("id","newsDate");
      clipBtn.setAttribute("id", "clipBtn");
      urlLink.setAttribute("id", "urlLink");
      urlBtn.setAttribute("id", "detailBtn");
      function convertDate(item) {
        const NYTdate = new Date(data.response.docs[item].pub_date)
        return NYTdate.getFullYear()+". "+ (NYTdate.getMonth()+1)+". "+NYTdate.getDate()+". "+NYTdate.toLocaleTimeString();     
      }
      headlineDiv.innerHTML = data.response.docs[i].headline.main
      newsDate.innerHTML = convertDate(i);
      urlLink.href = data.response.docs[i].web_url
      urlLink.target="_blank"
      clipBtn.innerHTML = "Clip This"
      urlBtn.innerHTML = "See Detail"
      console.log("출력");
      console.log(headlineDiv);
      
      
      searchResult.appendChild(articleDiv);
      articleDiv.appendChild(headlineDiv);
      articleDiv.appendChild(newsDate);
      articleDiv.appendChild(clipBtn);
      articleDiv.appendChild(urlLink);
      urlLink.appendChild(urlBtn);
    }
  }
  )
}



function test(){
  fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=covid&api-key=qbVKMvjD8NnyNN4dAYbv7kIxGZs0mrjK`)
  .then((response)=>  response.json())
  .then((data)=>console.log(data))
}
// test(); 구조확인용


inputVal.addEventListener("compositionupdate", (e) => {
  //keyup 후보
  setTimeout;
});
