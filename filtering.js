import { 
  of,
  range,
  interval,
  timer
} from 'rxjs';

import {
  filter,
  first,
  last,
  take,
  takeLast,
  takeWhile,
  takeUntil,
  skip,
  skipLast,
  skipUntil,
  skipWhile
} from 'rxjs/operators';


/*
 * filter 
 */

range(1, 10).pipe(
  filter(x => x > 5)
)
// .subscribe(console.log)

// filter產生數據的時間和上游一致
interval(1000).pipe(
  filter(x => x % 2 === 0)
)
// source : --- 0 --- 1 --- 2 --- 3 --- 4 --- 5 --->
// filter : --- 0 --------- 2 --------- 4 --------->



/*
 * first
 * 與 findIndex 很像，但可以沒有判定的參數，若吐出數據後就會完結
 * 若找不到回拋 error ， 可以給第2個參數當作預設值
 */
const source1$ = of(2, 4, 1, 8);

source1$.pipe(
  first( (value, index, observable) => {
    // console.log(value)
    // console.log(index)
    // console.log(observable)
    return value => value % 2 === 1
  }, 'Nothing'),
)
// .subscribe(console.log)

/*
 * last 與 first 就是找最後一個符合條件的值
 */

source1$.pipe(
  last(),
)
// .subscribe(console.log)



/*
 * take 拿 N 個值 
 */

interval(1000).pipe(
  take(3)
)
// .subscribe(console.log)

// source : --- 0 --- 1 --- 2 --- 3 --- 4 --- 5 --->
// filter : --- 0 --- 1 --- 2 |


/*
 * takeLast 拿最後 N 個值 
 */
source1$.pipe(
  takeLast(3)
)


/*
 * takeWhile 依照判定結果吐出值，若返回false直接結束
 * 判定的函式有兩個參數可用 (value, index) => value
 */
source1$.pipe(
  takeWhile( x => x === 0 )
)
// .subscribe(console.log)


/*
 * take 和 filter 的組合 
 * take 只接受數值參數， takeWhile 只接受判定參數
 * 所以 take 和 filter 的組合 可以達到接受 數值參數 和 判定參數 的效果
 */

source1$.pipe(
  filter(value => value % 2 === 0),
  take(2)
)
// .subscribe(console.log)


/*
 * takeUntil 開始取值並直到某個條件後結束
 * 若上游拋錯 takeUntil 也會拋錯
 */

 interval(1000).pipe(
   takeUntil( timer(2500) ) // 在2.5秒後結束
 )
//  .subscribe(console.log)

// interval : --- 0 --- 1 --- 2 --- 3 --- 4 --- 5 --->
// timer    : ------------ 0 |
// takeUntil: --- 0 --- 1 ---|
// demo: https://rxviz.com/v/6Jr7ZBQ8
// 簡單應用: 5 秒內點擊次數 https://stackblitz.com/edit/rxjs-c5nqxt



/*
 * skip  跳過N個後開始吐數據
 */
interval(1000).pipe(
  skip(3)
)
// .subscribe(console.log)


/*
 * skipLast  跳過最後N個
 */
range(1,5).pipe(
  skipLast(2)
)
// .subscribe(console.log)

