const express = require('express'); // 서버 모듈
const cors = require('cors'); // 서버 CORS 설정 모듈

const app = express(); // 서버 객체 생성
const port = 3000; // 프록시로 쓸 포트 지정

app.use( // 해당 url에 대해 CORS 허용 설정
	cors({ origin: [
		'http://localhost:5500', // live server port: 5500
		'http://127.0.0.1:5500',
		'http://localhost:*',
		'http://127.0.0.1:*'
	]})
);

app.get('/api', (req, res) => { // /api 소스로 get요청이 들어온 경우
	let html_data_promise = crawling_melon(); // 크롤링 실행

	html_data_promise.then(d => res.send(d)); // 해당 결과 전송
});

app.listen(port, () => { // port로 오는 요청을 인가함
	console.log('server listen start');
});

async function crawling_melon() {
	const url = "https://www.melon.com/new/index.htm"; // 멜론 URL

	let data = await fetch(url) // url로 요청을 보냄
		.then(respone => respone.text()) // 문자열로 변환
		.catch(error => console.error('Error:', error)); // 에러 발생 시
	return data; // 요청으로 받은 문자열 반환
}