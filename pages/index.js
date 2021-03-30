import Page, { getStaticProps } from './list/[[...slug]]';

export default Page;//src/pages/page/[page].js と同じ実装

export { getStaticProps };//src/pages/page/[page].js と同じ実装→pageはundefinedで渡る
