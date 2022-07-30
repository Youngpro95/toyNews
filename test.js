const inputVal = document.body.querySelector("input");
const searchButton = document.body.querySelector("body > button");

let index = 1;

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
  SearchArticle(inputVal.value , 0)
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
    return console.log("패스");
  }
  while(articleInfo.hasChildNodes()){
    articleInfo.removeChild(articleInfo.firstChild);
  }
}


document.body.addEventListener("click", (e)=>{
  const searchHistoryBox = document.body.querySelector("#searchHistoryBox");
  if(e.target == e.currentTarget.querySelector("#clipedNews")){
    console.log("버튼클릭")
    if(e.currentTarget.querySelector("#clipedNews").innerText == "Clip된 뉴스만 보기"){
      // 7/31 일 구현해야할 내용 : .searchResult 안에있는 class가 article 인것 display : none으로 바꾸기
      
      e.currentTarget.querySelector("#clipedNews").innerText= "모든 뉴스 보기"
    }else{
      e.currentTarget.querySelector("#clipedNews").innerText= "Clip된 뉴스만 보기"
    }
    

  }
  if(e.target == e.currentTarget.querySelector("input")){ // input 클릭시 만족하여 보여지게끔 함
    console.log("나타남")
    searchHistoryBox.style.display = "block";
  }else{
   console.log("사라짐");
    searchHistoryBox.style.display = "none";
  }
  
  const clipBtn = document.querySelectorAll(".clipBtn")
  
  clipBtn.forEach((el,index)=>{
    el.onclick= () =>{
      clip(el, index);
    }
  })

  
})



function clip(el ,index){
  const clipArticle = document.querySelectorAll(".article")
  const searchResult = document.querySelector("#searchResult")
  
  if(clipArticle.item(index).childNodes[2].innerText == "Clip This"){
    const nodeClip = clipArticle.item(index).cloneNode(true);
    nodeClip.setAttribute("class" , "cliped")
    console.log(nodeClip);
    searchResult.appendChild(nodeClip)
    const changeDivStyle = document.body.querySelector(".cliped")
    changeDivStyle.style.display="none";
    
    clipArticle.item(index).childNodes[2].innerText = "Unclip this"
  }else{
    const changeDivStyle = document.body.querySelector(".cliped")
    clipArticle.item(index).childNodes[2].innerText = "Clip This"
    changeDivStyle.style.display="block";
  }
}








// 옵저버 생성
function observe() {
  const listEnd = document.querySelector(".endDiv");
  const searchResultDiv = document.querySelector("#searchResult");
  const endDiv = document.querySelector(".endDiv")

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
        searchResultDiv.removeChild(endDiv);
        SearchArticle(inputVal.value, index);
        return index++;
      }
    });
  };

  const observer = new IntersectionObserver(onIntersect, option);
  observer.observe(listEnd);
}


// window.addEventListener("scroll", (e)=>{
//   const curScroll = window.scrollY;
//   const windowHeight = window.innerHeight;
//   const bodyHeight = document.body.clientHeight;
//   // console.log("현재스크롤 : " ,curScroll);
//   // console.log("windowHeight : ", windowHeight);
//   // console.log("bodyHeight : ", bodyHeight);
//   const paddingBottom = 200;

//   if(curScroll + windowHeight + paddingBottom>= bodyHeight){
//     console.log("-----");
//     SearchArticle(inputVal.value, index)
//     return index++;
//   }
// }
// );   잦은 scroll 이벤트로 인한 제거 



function SearchArticle(item, index) {
  console.log(item, index);
  fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${item}&page=${index}&api-key=qbVKMvjD8NnyNN4dAYbv7kIxGZs0mrjK`)
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
      clipBtn.setAttribute("class", "clipBtn");
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
      // console.log("출력");
      // console.log(headlineDiv);
      
      searchResult.appendChild(articleDiv);
      articleDiv.appendChild(headlineDiv);
      articleDiv.appendChild(newsDate);
      articleDiv.appendChild(clipBtn);
      articleDiv.appendChild(urlLink);
      urlLink.appendChild(urlBtn);
      if(i == data.response.docs.length-2){
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


inputVal.addEventListener("compositionupdate", (e) => {
  //keyup 후보
  setTimeout;
});
