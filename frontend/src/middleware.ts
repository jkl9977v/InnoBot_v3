//middleware.ts (Next.js)
/*import { NextResponse } from 'next/server';
import type { NextRequest} from 'next/server';*/

/**
 * 간단한 middleware: /admin 경로에 접근할 때
 * - 쿠키에 JSESSIONID가 없으면 바로 /login으로 리다이렉트
 * - 쿠키가 있으면 차단하지 않고 통과(정밀 검사는 클라이언트 훅으로)
 */
/*export function middleware(req: NextRequest){
	const { pathname } = req.nextUrl;
	
	//보호할 경로 패턴
	if (pathname.startsWith('/admin')) {
		const jsid = req.cookies.get('JSESSIONID')?.value;
		if(!jsid) {
			const  url = req.nextURl.clone();
			url.pathname = '/login';
			return NextResponse.redirect(url);
		}
	}
	
	return NextResponse.next();
}*/

//middleware가 적용될 경로 (next.config.js 없이 선언)
/*export const config = {
	mathcher : ['/admin/:path*']
};*/