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

function SearchArticle(item) {
  fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${item}&api-key=qbVKMvjD8NnyNN4dAYbv7kIxGZs0mrjK`)
  .then((response)=>  response.json())
  .then((data)=>{
    for(let i=0;i<=data.response.docs.length; i++){
      const articleDiv = document.createElement("div");
      const headlineDiv = document.createElement("div");
      const newsDate = document.createElement("div");
      const clipBtn = document.createElement("button");
      const urlLink = document.createElement("a");
      const urlBtn = document.createElement("button");
      
      articleDiv.setAttribute("id","article");
      headlineDiv.setAttribute("id", "newsHead");
      newsDate.setAttribute("id","newsDate");
      clipBtn.setAttribute("id", "clipBtn");
      urlLink.setAttribute("id", "urlLink");
      urlBtn.setAttribute("id", "detailBtn");
      function convertDate(item) {
        console.log(data.response.docs[item].pub_date);
        const NYTdate = new Date(data.response.docs[item].pub_date)
        let convDate = NYTdate.getFullYear()+". "+ (NYTdate.getMonth()+1)+". "+NYTdate.getDate()+". "+NYTdate.toLocaleTimeString();
        return convDate
      }
      headlineDiv.innerHTML = data.response.docs[i].headline.main
      newsDate.innerHTML = convertDate(i);
      urlLink.href = data.response.docs[i].web_url
      urlLink.target="_blank"
      clipBtn.innerHTML = "Clip This"
      urlBtn.innerHTML = "See Detail"
      console.log("출력");
      // console.log(newsDate);
      
      const articleInfo = document.querySelector("#article")
      document.body.append(articleDiv)
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
test(); 구조확인용


inputVal.addEventListener("compositionupdate", (e) => {
  //keyup 후보
  setTimeout;
});
