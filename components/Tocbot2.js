import { useEffect } from 'react'
import tocbot from 'tocbot'
const Tocbot2 = (props) => {
  console.log( 'TocBot2 ');
  useEffect(() => {
    console.log( 'tocbot2.init' )
    //tocbot.destroy();
      tocbot.init({
        headingsOffset: 40,//40=ヘッダー固定バーの高さ　その分ずれが生じるため、調整
        scrollSmoothOffset: -40,
        tocSelector: '.js-toc2',
        contentSelector: '.js-toc-content',
        headingSelector: 'h1, h2, h3',
        // For headings inside relative or absolute positioned containers within content.
        hasInnerContainers: true,
        scrollSmooth: false,
        orderedList: false,
      })
  }, [props.isCheck])
  return null;
}
export default Tocbot2