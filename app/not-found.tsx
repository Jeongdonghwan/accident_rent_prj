import Link from 'next/link';
import { Actions } from '../components/Common';
export default function NotFound() {
  return (<main><section className="page-head"><div className="wrap"><h1 className="page-title">페이지를 찾을 수 없습니다</h1><p><Link href="/area/">지역 목록</Link>에서 찾아보시거나 바로 접수하세요.</p><Actions dark /></div></section></main>);
}
