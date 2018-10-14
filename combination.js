import * as Rx from 'rxjs';
import {
  concat,
  merge,
  map,
  toArray,
  take,
  zip,
  combineLatest,
  withLatestFrom,
  race,
  startWith,
  concatAll,
  concatMap,
  mergeAll,
  mergeMap,
  combineAll,
  switchAll,
  exhaust
} from 'rxjs/operators';



/* 
 * concat 
 */
const source1$ = Rx.of(1, 2, 3);
const source2$ = Rx.of(4, 5, 6);

source1$.pipe(
    concat(source2$),
    toArray()
  )
  // .subscribe(console.log)

// source1 : |--- ( 1 , 2 , 3 ) ---|--->  

// source2 : |--------------- ( 4 , 5 , 6) ---|---> 

// concat  : |--- ( 1 , 2 , 3 , 4 , 5 , 6) ---|---> 

// 按照順序，前一個 observable 完成了，再訂閱下一個 observable 並發出值
// demo: https://rxviz.com/v/j8ArPmZo
// source1若沒完成 ， source2永遠沒有上場的機會
// demo: https://rxviz.com/v/38lk5l2J


/* 
 * merge 
 */
const source3$ = Rx.timer(0, 5000).pipe(map(x => x + 'A'));
const source4$ = Rx.timer(500, 5000).pipe(map(x => x + 'B'));

source3$.pipe(
  merge(source4$)
)
// .subscribe(console.log)

// source3 : |--- 0A ------ 1A ------ 2A ------>  

// source4 : |-------- 0B ------ 1B ------ 2B ------>  

// merge  : |--- 0A - 0B - 1A - 1B - 2A - 2B -----> 

// 先到先得，將多個 Observable 對象合併為一個 Observable
// 處理非同步數據才有意義，否則用concat即可(或是產生值有順序考量的話也用concat即可)
// demo: https://rxviz.com/v/2ORy1Vlo

const source5$ = Rx.timer(1000, 5000).pipe(map(x => x + 'C'), take(2));
source3$.pipe(
  merge(source5$, source4$, 2) // --> 可選參數concurrent ， 可以設置同時合併的 Observable 對象
)
// .subscribe(console.log)

// source3 : |--- 0A ------ 1A ------ 2A ------>  

// source5 : |------------- 0C ------ 1C ------>  take(2)

// source4 : |-------- 0B ------ 1B ------ 2B ------>  

// merge  : |--- 0A - 0C - 1A - 1C - 0B - 2A - 1B - 3A -----> 

// demo: https://rxviz.com/v/qJwPnrg8


/* 
 * zip 
 */
const source6$ = Rx.interval(1000);
const source7$ = Rx.of('a', 'b', 'c');

source6$.pipe(
  zip(source7$, (a, b) => `${a} + ${b}`)
)
// .subscribe(console.log)

// 一對一合併，返回陣列，只要有一個 Observable 完結（complete），zip 就會完結

// source6 : |--- 0 --- 1 --- 2 ------>  

// source7 : |--- ('a' , 'b' , 'c') ---|--->

// source4 : |--- 0,a --- 1,b --- 2,c ---|---> 

// demo: https://rxviz.com/v/WJx2KZqo



/* 
 * combineLatest 
 */
const combineFn = (x, y) => `${x} : ${y}`;

source6$.pipe(
  combineLatest(source7$, combineFn)
)
// .subscribe(console.log)
source7$.pipe(
  combineLatest(source1$, combineFn) //Rx.of(1, 2, 3)
)
// .subscribe(console.log)

// 合併最後一個數據
// 每個 observable 都至少發出一個值後才會開始
// 全部的 Observable 完結（complete），combineLatest 才會完結
// demo: https://rxviz.com/v/VJ4njZbo
// https://stackblitz.com/edit/typescript-ihcxud?file=index.ts&devtoolsheight=50


/* 
 * withLatestFrom 
 */

const source8$ = Rx.timer(0, 2000).pipe(
  map(x => x * 100),
  take(6)
);
const source9$ = Rx.timer(500, 1000);

source8$.pipe(
  withLatestFrom(source9$, (a, b) => a + b)
)
// .subscribe(console.log)

// 調用 withLatestFrom 的 Observable 主導數據產生 （範例是source8$

// source8 : |- 0 ---- 100 ------- 200 ------- 300 ---->  

// source9 : |--- 0 --- 1 --- 2 --- 3 --- 4 --- 5 --->

// withLatestFrom : |--- 101 --- 203 --- 305 ------>  產生時機和 source8 一樣

// source8 = 0 時 source9 還沒產生數據，所以 withLatestFrom 還不會執行
// 當 source9 = 2 時 ， source8 還沒產生數據， 所以 2 被忽略了
// demo: https://rxviz.com/v/d8djmlvO


/* 
 * race 
 */

// source3$ = Rx.timer(0, 5000).pipe(map(x => x+'A'));
// source4$ = Rx.timer(500, 5000).pipe(map(x => x+'B'));
source3$.pipe(
  race(source4$)
)
// .subscribe(console.log)
// 第一個吐出數據的 Observable 就會被完全採用
// demo: https://rxviz.com/v/1o7zrRj8


/* 
 * startWith 
 */
Rx.timer(0, 2000).pipe(
  startWith('Start!')
)
// .subscribe(console.log)
// 數據是同步吐出，若要非同步吐出資料要用 concat


/* 
 * forkJoin 
 */

const source10$ = Rx.interval(1000).pipe(
  map(x => x + 'A'),
  take(2)
);
const source11$ = Rx.interval(1000).pipe(
  map(x => x + 'B'),
  take(5)
);

Rx.forkJoin(source10$, source11$)
// .subscribe(console.log)

// forkJoin 會把所有 Observable 產生的最後一個數據合併
// 可以把 forkJoin 想成 Rxjs 中的 Promise.all
// demo: https://rxviz.com/v/qJwPnZp8


/*
 * concatAll
 */
Rx.interval(1000)
  .pipe(
    map(x => Rx.of(x + 10)),
    take(2),
    concatAll()
  )
  // .pipe(
  //   concatMap(x => Rx.of(x + 10)),
  //   take(2),
  // )
  // .subscribe(console.log)

// concatAll 會訂閱所有 Observable ， 並依照順序合併結果
// 大部分情況可以用 concatMap === map + concatAll
// demo: https://rxviz.com/v/moYQGe2o



/*
 * mergeAll
 */
Rx.interval(1000)
  .pipe(
    map(
      x => Rx.interval(500).pipe(
        map(y=> `${x} : ${y}`),
        take(2),
      )
    ),
    take(2),
    mergeAll()
  )
  // .subscribe(console.log)

// mergeAll 會訂閱所有 Observable ， 只要訂閱對象有產生結果就會先合併
// 大部分情況可以用 mergeMap === map + mergeAll
// demo: https://rxviz.com/v/7J2lDn7o


/* 
 * combineAll 
 */

 Rx.interval(1000)
 .pipe(
   take(2),
   map( x => Rx.interval(1500).pipe( take(2), map(y => `${x} : ${y}`) )),
   combineAll()
 )
//  .subscribe(console.log)

// |------- (1秒) ---- (2秒) ---|

//           ↓          |

// |------ ( 0 , 0 ) --1.5秒-- ( 0 , 1 ) ----|  

//                      ↓

// |---------------- ( 1 , 0 ) --1.5秒-- ( 1 , 1 ) ---|  

// combineAll

// |------ ( 0 , 0 )( 1 , 0 ) ------ ( 0 , 1 )( 1 , 0 ) ( 0 , 1 )( 1 , 1 ) ---|

// demo: https://rxviz.com/v/jOLQgzBJ


/* 
 * switch 永遠訂閱最新的 Observable ， 退定過時的 Observable
 */
Rx.interval(1000)
 .pipe(
   take(2),
   map( x => Rx.interval(1500).pipe( take(2), map(y => `${x} : ${y}`) )),
   switchAll()
 )
//  .subscribe(console.log)

// ------- (1秒) ---- (2秒) ---|

//           ↓          |

// ------ ( 0 , 0 ) --1.5秒-- ( 0 , 1 ) ----|  

//                      ↓

// ---------------- ( 1 , 0 ) --1.5秒-- ( 1 , 1 ) ---|  

// switchAll

// ---------------- ( 1 , 0 ) -------- ( 1 , 1 ) ---| 



Rx.interval(1000)
 .pipe(
   take(3),
   map( x => Rx.interval(700).pipe( take(2), map(y => `${x} : ${y}`) )),
	 switchAll()
 )

// ------- (1秒) ---- (2秒) ---- (3秒) ---|

//           ↓ 切換      |         |

// ------ ( 0 , 0 ) -------- ( 0 , 1 ) ----|  

//                      ↓ 切換     |

// ---------------- ( 1 , 0 ) -------- ( 1 , 1 ) ---|  

//                                ↓ 切換 

// ---------------------------- ( 2 , 0 ) ---- ( 1 , 1 ) ---|  

// switchAll

// ----- ( 0 , 0 ) - ( 1 , 0 ) - ( 2 , 0 ) -- ( 1 , 1 )---| 

// demo: https://rxviz.com/v/L8kD3EQo



/*
 * exhaust 和 switch相反
 */

Rx.interval(1000)
.pipe(
  take(3),
  map( x => Rx.interval(700).pipe( take(2), map(y => `${x} : ${y}`) )),
  exhaust()
)

// ------- (1秒) ---- (2秒) ---- (3秒) ---|

//           ↓          |         |

// ------ ( 0 , 0 ) -------- ( 0 , 1 ) ----|  這裡完結才會到下一個訂閱

//                      ↓         |

// ---------------- ( 1 , 0 ) -------- ( 1 , 1 ) ---|   當上一個還在執行時，這裡會被直接忽略

//                                ↓  

// ---------------------------- ( 2 , 0 ) ---- ( 1 , 1 ) ---|  

// exhaust

// ----- ( 0 , 0 ) -- ( 0 , 1 ) -- ( 2 , 0 ) -- ( 1 , 1 )---| 

// demo: https://rxviz.com/v/Y86rQ0N8