const inputVal = document.querySelector("input");
let searchArray = [];
let pageIndex = 1;
let articleArr =[];
let clipedArr = [];

function addDiv() {
  const keywordHistory = document.querySelector("#recentKeyword");
  const inputVal = document.querySelector("input");
  const searchHistoryDiv = document.createElement("div");
  const searchHistoryChild = document.querySelector("#searchHistory:nth-child(5)");

  searchHistoryDiv.innerHTML = inputVal.value;
  searchHistoryDiv.setAttribute("id", "searchHistory");

  if (searchArray.length === 6) {
    (function () {
      searchHistoryChild.parentElement.removeChild(searchHistoryChild);
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
  const clipedClass = document.querySelector(".cliped")
  const clipedNewsEl = document.querySelector("#clipedNews")
  const article = document.querySelectorAll(".article")

  if(clipedNewsEl.innerText == "Clip된 뉴스만 보기"){
    // 7/31 일 구현해야할 내용 : .searchResult 안에있는 class가 article 인것 display : none으로 바꾸기
    clipedNewsEl.innerText= "모든 뉴스 보기"
    // articleArr.forEach((el, index)=>{
    //   // console.log("el : ", el)
    //   console.log("index : ", index);
    // })
    
    if(clipedClass == null){ //클립된 뉴스가 있는지 확인 없으면 article class 전체 display none
      console.log("클립된 뉴스가 없습니다.");

      // article.forEach((el, index)=>{
      //   console.log(article[el])
      //   console.log(index);
      //   article[index].style.display = "none";
      //   document.body.querySelector(".endDiv").style.display = "none";
      // })
    }else{
      console.log("clip한 뉴스 있음");
      article.forEach((el, index)=>{
        console.log(article[el])
        console.log(index);
        article[index].style.display = "none";
        document.body.querySelector(".endDiv").style.display = "none";
        clipedClass.style.display = "block";
      })
    }

  }else{
    clipedNewsEl.innerText= "Clip된 뉴스만 보기"

    article.forEach((el, index)=>{
      console.log(article[el])
      article[index].style.display = "block";
      document.body.querySelector(".endDiv").style.display = "block";
      if(clipedClass != null) {
        clipedClass.style.display="none";
      }
    })

    
  }
  

}



document.body.addEventListener("click", (e)=>{
  const searchHistoryBox = document.querySelector("#searchHistoryBox");
  
  if(e.target == e.currentTarget.querySelector("#clipedNews")){
    checkClip();
  }  
  if(e.target == e.currentTarget.querySelector("input")){ // input 클릭시 만족하여 보여지게끔 함
    if(searchArray.length === 0){
      searchHistoryBox.style.display = "none";
      console.log("아무것도 없음");
    }else{
      console.log("나타남")
      searchHistoryBox.style.display = "block";
    }
  }else{
   console.log("사라짐");
    searchHistoryBox.style.display = "none";
  }
  
  const clipBtn = document.querySelectorAll(".clipBtn")
  
  clipBtn.forEach((el,index)=>{
    el.onclick= () =>{
      console.log(el);
      console.log(index);
      clip(el, index);
      
    }
  })

  
})



function clip(el ,index){
  const clipArticle = document.querySelectorAll(".article")
  const searchResult = document.querySelector("#searchResult") //최상위
  
  console.log(el.innerText);
  if(el.innerText == "Clip this"){
    const nodeClip = clipArticle.item(index).cloneNode(true);
    nodeClip.setAttribute("class" , "cliped")
    console.log("nodeClip : ", nodeClip);
    nodeClip.querySelector(".clipBtn").innerHTML = "Unclip this"
    searchResult.appendChild(nodeClip)
    // const changeDivStyle = document.body.querySelector(".cliped")
    // changeDivStyle.style.display="none";
    
    clipArticle.item(index).childNodes[2].innerText = "Unclip this"
  }else{
    console.log("실행 실패");
    const changeDivStyle = document.body.querySelector(".cliped")
    clipArticle.item(index).childNodes[2].innerText = "Clip this"
    // nodeClip.querySelector(".clipBtn").innerHTML = "Clip This"
    // changeDivStyle.style.display="block";
  }
}








// 옵저버 생성
function observe() {
  const listEnd = document.querySelector(".endDiv");
  const endDiv = document.querySelector(".endDiv")
  const searchResult = document.querySelector("#searchResult") //최상위
  const inputVal = document.querySelector("input");

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
        SearchArticle(inputVal.value, pageIndex);
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
      <a href="${data.response.docs[i].web_url}" target="_blank" >
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


inputVal.addEventListener("compositionupdate", (e) => {
  //keyup 후보
  setTimeout;
});
