const express = require('express'); // 서버 모듈
const cors = require('cors'); // 서버 CORS 설정 모듈
const parser = require("node-html-parser");
const axios = require('axios');

const app = express(); // 서버 객체 생성
const port = 3000; // 프록시로 쓸 포트 지정

app.use( // 해당 url에 대해 CORS 허용 설정
	cors()
);

app.get('/api', (req, res) => { // /api 소스로 get요청이 들어온 경우
	let html_data_promise = crawling_melon_top100(); // 크롤링 실행
	html_data_promise.then(d => res.send(d)); // 해당 결과 전송
});

app.get('/youtube_get', (req, res) => {
	const music_name = req.query.name;
	const api_key = req.query.key;
	getFirstVideoId(music_name, api_key)
		.then(youtube_video_id => {
			const youtube_embed_url = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${youtube_video_id}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
			res.send(youtube_embed_url);
		})
});

app.listen(port, () => { // port로 오는 요청을 인가함
	console.log('server listen start');
});

async function crawling_melon_top100() {
	const url = "https://www.melon.com/chart/index.htm"; // 멜론 URL

	let data = await fetch(url) // url로 요청을 보냄
		.then(respone => respone.text()) // 문자열로 변환
		.catch(error => console.error('Error:', error)); // 에러 발생 시
	return data; // 요청으로 받은 문자열 반환
}

async function getFirstVideoId(searchQuery, apiKey) {
    const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(searchQuery)}&key=${apiKey}&maxResults=1`;

    try {
        const response = await axios.get(youtubeApiUrl);
        const videos = response.data.items;

		console.log(videos[0].id.videoId);
        if (videos.length > 0) {
            return videos[0].id.videoId;
        } else {
            return null; // 동영상이 없는 경우
        }
    } catch (error) {
        console.error('YouTube API 요청 중 오류 발생');
    }
}