const inputEl = document.querySelector("input");
const clipedNewsEl = document.querySelector('#clipedNews');
let searchArray = [];
let pageIndex = 1;
let articleArr =[];
let clipedArr = [];

document.body.addEventListener("click",()=>{
  const clipBtn = document.querySelectorAll(".clipBtn")
  

  clipBtn.forEach((el,index)=>{
    el.onclick= () =>{
      clip(el, index);
    }
  })
})

function addDiv() {
  const keywordHistory = document.querySelector("#recentKeyword");
  const inputEl = document.querySelector("input");
  const searchHistoryDiv = document.createElement("div");
  const searchHistoryChild = document.querySelector("#searchHistory:nth-child(5)");

  searchHistoryDiv.innerHTML = inputEl.value;
  searchHistoryDiv.setAttribute("id", "searchHistory");

  if (searchArray.length === 6) {
    (function () {
      searchHistoryChild.parentElement.removeChild(searchHistoryChild);
    })();
  }
  keywordHistory.prepend(searchHistoryDiv);
  SearchArticle(inputEl.value , 0)
}

inputEl.addEventListener("keydown", (e) => {
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
  const searchResult = document.querySelector("#searchResult") //최상위
  if(searchResult === null){
    return console.log("패스");
  }
  while(searchResult.hasChildNodes()){
    searchResult.removeChild(searchResult.firstChild);
  }
}

function checkClip(){
  const searchResult = document.querySelector("#searchResult") //최상위
  const clipedNewsEl = document.querySelector("#clipedNews")


  
  if(clipedNewsEl.innerText == "Clip된 뉴스만 보기"){
    // 7/31 일 구현해야할 내용 : .searchResult 안에있는 class가 article 인것 display : none으로 바꾸기
    clipedNewsEl.innerText= "모든 뉴스 보기"
    if(clipedArr.length == 0){ //클립된 뉴스가 있는지 확인 없으면 article class 전체 display none
      console.log("클립된 뉴스가 없습니다.");
    }else{
      console.log("클립된 뉴스가 있습니다.");
      while(searchResult.hasChildNodes()){
        searchResult.removeChild(searchResult.firstChild);
      }
      for(let i = 0; i < clipedArr.length; i++){
        console.log("clipledArr >>>:  ",  clipedArr[i]);
        searchResult.appendChild(clipedArr[i])
      }
      const clipBtn = document.querySelectorAll(".clipBtn")
    }

  }else{
    clipedNewsEl.innerText= "Clip된 뉴스만 보기"
    while(searchResult.hasChildNodes()){
      searchResult.removeChild(searchResult.firstChild);
    }
    articleArr.forEach((el,index)=>{
      searchResult.appendChild(articleArr[index])
    })
  }
}



clipedNewsEl.addEventListener("click",()=>{
  checkClip();
})
inputEl.addEventListener("click", (e)=>{
  const searchHistoryBox = document.querySelector("#searchHistoryBox");
   // input 클릭시 만족하여 보여지게끔 함
    if(searchArray.length === 0){
      searchHistoryBox.style.display = "none";
      console.log("아무것도 없음");
    }else{
      console.log("나타남")
      searchHistoryBox.style.display = "block";
    }
})
inputEl.addEventListener("focusout",()=>{
  const searchHistoryBox = document.querySelector("#searchHistoryBox");
  searchHistoryBox.style.display ="none";
})



function clip(el ,index){
  const clipArticle = document.querySelectorAll(".article")
  const searchResult = document.querySelector("#searchResult") //최상위
  const cloneArticle = clipArticle.item(index).cloneNode(true);
  const article = document.querySelectorAll(".article")
  
  // console.log(el.innerText);
  if(el.innerText == "Clip this"){
    clipedArr.push(cloneArticle)
    cloneArticle.querySelector(".clipBtn").innerHTML = "Unclip this"
    el.innerHTML = "Unclip this";
    console.log("clipedArr : " , clipedArr);
  }else{
    el.innerHTML = "Clip this"
    clipedArr.splice(index,1)
    console.log(index);
    searchResult.removeChild(article[index])
    console.log(clipedArr);
  }
}








// 옵저버 생성
function observe() {
  const listEnd = document.querySelector(".endDiv");
  const endDiv = document.querySelector(".endDiv")
  const searchResult = document.querySelector("#searchResult") //최상위
  const inputEl = document.querySelector("input");

  const option = {
    root: null,
    rootMargin: "0px 0px 0px 0px",
    thredhold: 0,
  };
  const onIntersect = (entries, observer) => {
    // entries는 IntersectionObserverEntry 객체의 리스트로 배열 형식을 반환합니다.
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log("탐지 완료");
        searchResult.removeChild(endDiv);
        SearchArticle(inputEl.value, pageIndex);
        return pageIndex++;
      }
    });
  };

  const observer = new IntersectionObserver(onIntersect, option);
  observer.observe(listEnd);
}


function SearchArticle(item, index) {
  
  console.log(item, index);
  fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${item}&page=${index}&api-key=qbVKMvjD8NnyNN4dAYbv7kIxGZs0mrjK`)
  .then((response)=>  response.json())
  .then((data)=>{
    for(let i=0;i<data.response.docs.length; i++){
      const article = document.querySelectorAll(".article")
      const searchResult = document.querySelector("#searchResult")
      const articleDiv = document.createElement("div");
      articleDiv.setAttribute("class","article");
      
      function convertDate(item) {
        const NYTdate = new Date(data.response.docs[item].pub_date)
        return NYTdate.getFullYear()+". "+ (NYTdate.getMonth()+1)+". "+NYTdate.getDate()+". "+NYTdate.toLocaleTimeString();     
      }
      articleDiv.innerHTML=`
      <div class="newsHead">${data.response.docs[i].headline.main}</div>
      <div class="newsDate">${convertDate(i)}</div>
      <button class="clipBtn">Clip this</button>
      <a class="linkClass" href="${data.response.docs[i].web_url}" target="_blank" >
      <button class="detailBtn">See Detail</button>
      </a>
      `
      searchResult.appendChild(articleDiv)
      articleArr.push(articleDiv)
      
      if(i == data.response.docs.length-2){ //obeserve target 생성
        const endDiv = document.createElement("div")
        endDiv.setAttribute("class","endDiv")
        searchResult.appendChild(endDiv)
        console.log("endDiv 생성");
        observe(); 
      }
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


inputEl.addEventListener("compositionupdate", (e) => {
  //keyup 후보
  setTimeout;
});
