const inputEl = document.querySelector("input");
const clipedNewsEl = document.querySelector("#clipedNews");
const API_KEY = "qbVKMvjD8NnyNN4dAYbv7kIxGZs0mrjK";
let searchArray = [];
let pageIndex = 1;
let articleArr = [];
let clipedArr = [];
let unclipText = [];

document.body.addEventListener("click", () => {
  const clipBtn = document.querySelectorAll(".clipBtn");

  clipBtn.forEach((el, index) => {
    el.onclick = () => {
      clip(el, index);
    };
  });
});

function addDiv() {
  const keywordHistory = document.querySelector("#recentKeyword");
  const inputEl = document.querySelector("input");
  const searchHistoryDiv = document.createElement("div");
  const searchHistoryChild = document.querySelector(
    "#searchHistory:nth-child(5)"
  );

  searchHistoryDiv.innerHTML = inputEl.value;
  searchHistoryDiv.setAttribute("id", "searchHistory");

  if (searchArray.length === 6) {
    (function () {
      searchHistoryChild.parentElement.removeChild(searchHistoryChild);
    })();
  }
  keywordHistory.prepend(searchHistoryDiv);
  if (inputEl.value != "") {
    SearchArticle(inputEl.value, 0);
  }
}

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    clearDiv();
    searchArray.unshift(e.target.value);
    addDiv();
    if (searchArray.length === 6) {
      searchArray.pop();
    }
  }
}); // 검색 히스토리 배열 저장 및 5개이상 시 가장 처음 검색했던 내용 삭제

function clearDiv() {
  const searchResult = document.querySelector("#searchResult"); //최상위
  if (searchResult === null) {
    return 
  }
  while (searchResult.hasChildNodes()) {
    searchResult.removeChild(searchResult.firstChild);
  }
}

function checkClip() {
  const searchResult = document.querySelector("#searchResult"); //최상위
  const clipedNewsEl = document.querySelector("#clipedNews");

  if (clipedNewsEl.innerText == "Clip된 뉴스만 보기") {
    clipedNewsEl.innerText = "모든 뉴스 보기";
    if (clipedArr.length == 0) {
      while (searchResult.hasChildNodes()) {
        searchResult.removeChild(searchResult.firstChild);
      }
    } else {
      while (searchResult.hasChildNodes()) {
        //지우기
        searchResult.removeChild(searchResult.firstChild);
      }
      for (let i = 0; i < clipedArr.length; i++) {
        searchResult.appendChild(clipedArr[i]);
      }
      const clipBtn = document.querySelectorAll(".clipBtn");
    }
  } else {
    clipedNewsEl.innerText = "Clip된 뉴스만 보기";
    while (searchResult.hasChildNodes()) {
      searchResult.removeChild(searchResult.firstChild);
    }
    articleArr.forEach((el, index) => {
      searchResult.appendChild(articleArr[index]);
    });
    const article = document.querySelectorAll(".article");
    article.forEach((articleEl) => {
      unclipText.forEach((el) => {
        if (articleEl.childNodes[1].innerText == el) {
          articleEl.childNodes[5].innerText = "Clip this";
        }
      });
    });
  }
}

clipedNewsEl.addEventListener("click", () => {
  checkClip();
});
inputEl.addEventListener("click", (e) => {
  const searchHistoryBox = document.querySelector("#searchHistoryBox");
  // input 클릭시 만족하여 보여지게끔 함
  if (searchArray.length === 0) {
    searchHistoryBox.style.display = "none";
  } else {
    searchHistoryBox.style.display = "block";
  }
});
inputEl.addEventListener("focusout", () => {
  const searchHistoryBox = document.querySelector("#searchHistoryBox");
  searchHistoryBox.style.display = "none";
});

function clip(el, index) {
  const clipArticle = document.querySelectorAll(".article");
  const searchResult = document.querySelector("#searchResult"); //최상위
  const cloneArticle = clipArticle.item(index).cloneNode(true);
  const article = document.querySelectorAll(".article");
  const clipedNewsEl = document.querySelector("#clipedNews");

  if (el.innerText == "Clip this") {
    clipedArr.push(cloneArticle);
    cloneArticle.querySelector(".clipBtn").innerHTML = "Unclip this";
    el.innerHTML = "Unclip this";
  } else {
    el.innerHTML = "Clip this";
    clipedArr.splice(index, 1);
    if (clipedNewsEl.innerText == "모든 뉴스 보기") {
      searchResult.removeChild(article[index]);
      unclipText.push(el.parentElement.childNodes[1].innerText);
    }
  }
}

// 옵저버 생성
function observe() {
  const listEnd = document.querySelector(".endDiv");
  const endDiv = document.querySelector(".endDiv");
  const searchResult = document.querySelector("#searchResult"); //최상위
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
  fetch(
    `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${item}&page=${index}&api-key=${API_KEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.response.docs.length; i++) {
        const article = document.querySelectorAll(".article");
        const searchResult = document.querySelector("#searchResult");
        const articleDiv = document.createElement("div");
        articleDiv.setAttribute("class", "article");
        function convertDate(item) {
          const NYTdate = new Date(data.response.docs[item].pub_date)
          return NYTdate.getFullYear()+". "+ (NYTdate.getMonth()+1)+". "+NYTdate.getDate()+". "+NYTdate.toLocaleTimeString();     
        }
        articleDiv.innerHTML = `
          <div class="newsHead">${data.response.docs[i].headline.main}</div>
          <div class="newsDate">${convertDate(i)}</div>
          <button class="clipBtn">Clip this</button>
          <a class="linkClass" rel="noopener" href="${data.response.docs[i].web_url}" target="_blank" >
          <button class="detailBtn">See Detail</button>
          </a>
        `;
        searchResult.appendChild(articleDiv);
        articleArr.push(articleDiv);

        if (i == data.response.docs.length - 2) {
          //obeserve target 생성
          const endDiv = document.createElement("div");
          endDiv.setAttribute("class", "endDiv");
          searchResult.appendChild(endDiv);
          articleArr.push(endDiv);
          observe();
        }
      }
    });
}
