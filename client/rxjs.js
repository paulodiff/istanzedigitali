/* Using Observable sequences */
var source1 = Rx.Observable.return([{name:'mario',age:22},{name:'luigi',age:23}]);
var source2 = Rx.Observable.return([{name:'aa', age: 56}]);
var source3 = Rx.Observable.return([{name:'source3', age: 100}]);


function firstTransform(x, y, z){
	console.log('firstTransform:');
	console.log(x);
	return x;
}

function secondTransform(x, y, z){
	console.log('secondTransform');
	console.log(x);
	return x;
}

var source = Rx.Observable.zip(source1.takeLast(), source2, source3)
	.map( x => {console.log(x); return x;})
	.map( firstTransform )
	.map( secondTransform );

var subscription = source.subscribe(
  x => console.log(`onNext: ${x}`),
  e => console.log(`onError: ${e}`),
  () => console.log('onCompleted'));