let testArr = [];

let testArr2 = [];

testArr.push(<div>test</div>)
testArr2.push(<div>test</div>)

if(JSON.stringify(testArr) == JSON.stringify(testArr2)){
  console.log("성공")
}