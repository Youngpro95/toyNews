const inputVal = document.body.querySelector('input')
const searchButton = document.body.querySelector('body > button')

console.log(inputVal.value);
let searchArray = [];

inputVal.addEventListener('keydown', (e)=>{
  if(e.key==="Enter"){
    // console.log(e.target.value);
    // searchArray.push(e.target.value);
    searchArray.unshift(e.target.value);
    if(searchArray.length === 6){
      searchArray.pop();
      console.log(searchArray)
    }else{
      console.log(searchArray)
    }
  }
}) // 검색 히스토리 배열 저장 및 5개이상 시 가장 처음 검색했던 내용 삭제
