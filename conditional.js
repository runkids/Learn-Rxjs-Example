import { 
  of,
  range,
  from,
  interval,
  zip,
  empty
} from 'rxjs';
import {
  concat,
  count,
  max,
  min,
  reduce,
  scan,
  every,
  findIndex,
  find,
  isEmpty,
  defaultIfEmpty
} from 'rxjs/operators';


/* 
 * count 統計上游 Observable 吐出數據的數量
 */
of (1, 2, 3).pipe(
    concat( of (4, 5, 6)),
    count()
  )
  // .subscribe(console.log);
// demo: https://rxviz.com/v/6Jr7ZKm8


/*
 * max mix  
 */
of(5, 4, 7, 2, 8).pipe(
  // max(),
  min(),
)
// .subscribe(console.log) 

of(
  { name: 'Rxjs', year: 2011 },
  { name: 'React', year: 2013 },
  { name: 'Redux', year: 2015 }
).pipe(
  max((a, b)=> a.year > b.year ? 1: -1)
)
// .subscribe(console.log)


/*
 * reduce  和 ES6 reduce 差不多 可以給第二個參數當作預設值
 */
range(1, 100).pipe(
  reduce((acc, cur) => acc + cur, 1)
)
// .subscribe(console.log)

from(['w', 'o', 'r', 'd']).pipe(
  reduce((acc, cur) => acc + cur, '!')
)
// .subscribe(console.log)

/*
 * scan  和 reduce 差不多 可以給第二個參數當作預設值 , 但每次都會返回一個新值
 */
from(['w', 'o', 'r', 'd']).pipe(
  scan((acc, cur) => acc + cur, '!')
)
// .subscribe(console.log)

// 比較reduce 和 scan http://reactive.how/reduce

/*
 * every 依照檢查的函式若判定結果都返回 true ， 最後 every 會吐出 true ， 否則為 false
 */

 of(5, 7, 3, 9).pipe(
   every( x => x%2 !==0 )
 )
//  .subscribe(console.log)

// 這個例子是一個不會完結的數據流，吐出 3 時就已經不成立every的條件，
// every 會直接吐出 false，因為沒必要繼續往下檢查了
 interval(1000).pipe(  
   every( x => x < 3 )
 )
//  .subscribe(console.log)

// 這個例子永遠不會成立，所以every就不會吐出結果
interval(1000).pipe(  
  every( x => x >= 0 )
)
.subscribe(console.log)


/*
 * find & findIndex 
 */
// find 會找第一個出條件成立的值 ， 若找不到會返回 undefined
// findIndex 會找第一個出條件成立的index ， 若找不到會返回 -1
const source1$ = of(2, 4, 1, 8);
const check1$ = x => x % 2 !== 0;

const find$ = source1$.pipe( find( check1$ ) )
const findIndex$ = source1$.pipe( findIndex( check1$ ) )

zip(find$, findIndex$, (x, y) => `Value = ${x} ; Index = ${y}`)
// .subscribe(console.log)

// demo: https://rxviz.com/v/QJVmGr7O


/*
 * isEmpty 檢查上游 Observable 是不是未吐出數據就完結
 */

interval(1000).pipe(
  isEmpty()
)
// .subscribe(console.log)

empty().pipe(
  isEmpty()
)
// .subscribe(console.log)
 

/*
 * defaultIfEmpty 
 * 若上游是空的 ， 就吐出預設值給下游 （預設值就是defaultIfEmpty的參數，若不給參數就是null）
 * 若上游不是空的 ， 就把上游的值給下游
 */

of().pipe(defaultIfEmpty('Is Empty!'))
// .subscribe(console.log)
of().pipe(defaultIfEmpty())
// .subscribe(console.log)
of(1, 2, 3).pipe(defaultIfEmpty())
// .subscribe(console.log)