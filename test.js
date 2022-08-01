const searchResult = document.querySelector("#searchResult") //최상위
const inputVal = document.body.querySelector("input");
const searchButton = document.body.querySelector("body > button");
const dom = document.querySelector("#searchHistory:nth-child(5)");
const keywordHistory = document.querySelector("#recentKeyword");
const searchHistoryBox = document.querySelector("#searchHistoryBox");
const article = document.querySelectorAll(".article")
const clipArticle = document.querySelectorAll(".article")

let searchArray = [];
let index = 1;

function addDiv() {
  let searchHistoryDiv = document.createElement("div");
  searchHistoryDiv.innerHTML = inputVal.value;
  searchHistoryDiv.setAttribute("id", "searchHistory");

  if (searchArray.length === 6) {
    (function () {
      dom.parentElement.removeChild(dom);
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
  let headnews = document.querySelector(".newsHead")
  console.log(searchResult)
  if(searchResult === null){
    return console.log("패스");
  }
  while(searchResult.hasChildNodes()){
    searchResult.removeChild(searchResult.firstChild);
  }
}


document.body.addEventListener("click", (e)=>{
  const clipedClass = document.querySelector(".cliped")
  
  if(e.target == e.currentTarget.querySelector("#clipedNews")){

    if(e.currentTarget.querySelector("#clipedNews").innerText == "Clip된 뉴스만 보기"){
      // 7/31 일 구현해야할 내용 : .searchResult 안에있는 class가 article 인것 display : none으로 바꾸기
      e.currentTarget.querySelector("#clipedNews").innerText= "모든 뉴스 보기"
      
      if(clipedClass == null){ //클립된 뉴스가 있는지 확인 없으면 article class 전체 display none
        console.log("클립된 뉴스가 없습니다.");
        article.forEach((el, index)=>{
          console.log(article[el])
          console.log(index);
          article[index].style.display = "none";
          document.body.querySelector(".endDiv").style.display = "none";
        })
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
      e.currentTarget.querySelector("#clipedNews").innerText= "Clip된 뉴스만 보기"

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
  
  if(clipArticle.item(index).childNodes[2].innerText == "Clip This"){
    const nodeClip = clipArticle.item(index).cloneNode(true);
    nodeClip.setAttribute("class" , "cliped")
    console.log(nodeClip);
    nodeClip.querySelector(".clipBtn").innerHTML = "Unclip this"
    searchResult.appendChild(nodeClip)
    const changeDivStyle = document.body.querySelector(".cliped")
    changeDivStyle.style.display="none";
    
    clipArticle.item(index).childNodes[2].innerText = "Unclip this"
  }else{
    const changeDivStyle = document.body.querySelector(".cliped")
    clipArticle.item(index).childNodes[2].innerText = "Clip This"
    nodeClip.querySelector(".clipBtn").innerHTML = "Clip This"
    changeDivStyle.style.display="block";
  }
}








// 옵저버 생성
function observe() {
  const listEnd = document.querySelector(".endDiv");
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
        searchResult.removeChild(endDiv);
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
