export function apiUrl(path: string){
	if (typeof window === 'undefined') return path; //ssr보호
	const host = window.location.hostname; //현재 브라우저 호스트
	return `http://${host}:8080${path}`;
}