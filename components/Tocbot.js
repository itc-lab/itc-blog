import { useEffect } from 'react'
import tocbot from 'tocbot'
const Tocbot = (props) => {
  //console.log( 'TocBot Component Load');
  //console.log( 'props.isCheck', props.isCheck);
  useEffect(() => {
    //console.log( 'tocbot.init' )
    //tocbot.destroy();
      tocbot.init({
        headingsOffset: 85,//アクティブ表示認識位置調整　ヘッダー固定バーの高さ分ずれが生じるため、調整＋やや早めに反応
        scrollSmoothOffset: -60,//ジャンプ位置調整　やや上に余裕気味
        tocSelector: '.js-toc',
        contentSelector: '.js-toc-content',
        headingSelector: 'h1, h2, h3',
        // For headings inside relative or absolute positioned containers within content.
        hasInnerContainers: true,
        scrollSmooth: true,
        orderedList: false,
        //skipRendering: true,
        //scrollSmoothDuration: 420,
      })
  })
  //}, [])
  //}, [props.isCheck])
  return null;
}
export default Tocbot