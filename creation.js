import * as Rx from 'rxjs';
import {
  repeat
} from 'rxjs/operators';

/* 
 * of 
 */
Rx.of(1, 2, 3)
  .subscribe(
    console.log,
    () => console.log('error'),
    () => console.log('of complete')
  )

// source : |--- (1 , 2 , 3) ---|--->  
// 無時間間隔一次把1,2,3給Observer
// demo: https://rxviz.com/v/38lkjrKJ


/* 
 * range 
 */
// Rx.range(1.5, 10)
Rx.range(1, 10)
  // .map( x => x * 2 )
  .subscribe(
    console.log,
    () => console.log('error'),
    () => console.log('range complete')
  )

// source : |--- (1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10) ---|--->  
// 第一個參數代表從1開始,第二個參數為遞增100次,每次遞增1
// demo: https://rxviz.com/v/9J9X0mdO



/* 
 * generate 
 */
Rx.generate(
  1, //初始值 
  value => value < 10, //繼續的條件
  value => value + 2, //每次遞增的值
  value => value * value // 產生結果
).subscribe(
  console.log,
  () => console.log('error'),
  () => console.log('generate complete')
)

// source : |--- (1 , 9 , 25 , 49 , 81) ---|--->  
// demo: https://rxviz.com/v/A8Dl9gK8



/* 
 * repeat 
 */
Rx.of(1, 2, 3)
  .pipe(
    repeat(2)
  )
  .subscribe(
    console.log,
    () => console.log('error'),
    () => console.log('repeat complete')
  )
// source : |--- 1 --- 2 --- 3 ------ 1 --- 2 --- 3 ----->  
// demo: https://rxviz.com/v/38lkjDKJ


/* 
 * empty 
 */
Rx.empty()
// source : |-------------------------->
// 沒有任何（不會產生）數據，直接結束訂閱
// demo: https://rxviz.com/v/XJzlRGgo

/* 
 * throw 
 */
Rx.throwError(new Error('oops!'))
// 5版 throw
// source : X-------------------------->
// 直接拋錯
// demo: https://rxviz.com/v/1o7zpvV8

/* 
 * never 
 */
Rx.never()
// source : -------------------------->
// 什麼都不做，不會產生數據，不會拋出錯誤，也不會結束，一直呆著到永遠
// demo: https://rxviz.com/v/RObNvGdO


/* 
 * interval 
 */
Rx.interval(1000)
// source : ---0---1---2---3---4---5---6---7--->
// 參數代表產生數據的間隔時間，從0開始，也可以搭配map改變初始值
// demo: https://rxviz.com/v/WJx21z1o


/* 
 * timer
 */
Rx.timer(1000, 1000)
// 第一個參數代表 N 秒後開始執行
// 第二個參數代表每 N 秒執行一次
// source : ---0---1---2---3---4---5---6---7--->
// demo: https://rxviz.com/v/58Gn2LpJ


/* 
 * from
 */
Rx.from([1, 2, 3])
  // .toArray()
  .subscribe(
    console.log,
    () => console.log('error'),
    () => console.log('from complete')
  )
// 把一切轉換成 Observable



/*
 * fromEvent
 */
// Rx.fromEvent(document.body, 'body')

// 把DOM事件轉換成 Observable
// https://stackblitz.com/edit/typescript-mfyefr?file=index.ts&devtoolsheight=50