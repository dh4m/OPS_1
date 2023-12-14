const express = require('express'); // 서버 모듈
const cors = require('cors'); // 서버 CORS 설정 모듈
const parser = require("node-html-parser");
const axios = require('axios');

require('dotenv').config();

const app = express(); // 서버 객체 생성
const port = 3000; // 프록시로 쓸 포트 지정

app.use( // 해당 url에 대해 CORS 허용 설정
	cors()
);

app.listen(port, () => { // port로 오는 요청을 인가함
	console.log('server listen start');
});

app.get('/genre', (req, res) => { // genre 소스로 get요청이 들어온 경우
	const genre = req.query.genre;
	let crawl_data;
	console.log(genre);

	if (genre === "ballad")
		crawl_data = crawling_melon("https://www.melon.com/genre/song_list.htm?gnrCode=GN0100&steadyYn=Y"); // 크롤링 실행
	else if (genre === "dance")
		crawl_data = crawling_melon("https://www.melon.com/genre/song_list.htm?gnrCode=GN0200&steadyYn=Y"); // 크롤링 실행
	else if (genre === "hiphop")
		crawl_data = crawling_melon("https://www.melon.com/genre/song_list.htm?gnrCode=GN0300&steadyYn=Y"); // 크롤링 실행
	else if (genre === "rnb")
		crawl_data = crawling_melon("https://www.melon.com/genre/song_list.htm?gnrCode=GN0400&steadyYn=Y"); // 크롤링 실행
	else if (genre === "indie")
		crawl_data = crawling_melon("https://www.melon.com/genre/song_list.htm?gnrCode=GN0500&steadyYn=Y"); // 크롤링 실행
	else if (genre === "rock")
		crawl_data = crawling_melon("https://www.melon.com/genre/song_list.htm?gnrCode=GN0600&steadyYn=Y"); // 크롤링 실행
	else if (genre === "trot")
		crawl_data = crawling_melon("https://www.melon.com/genre/song_list.htm?gnrCode=GN0700&steadyYn=Y"); // 크롤링 실행
	else if (genre === "fork")
		crawl_data = crawling_melon("https://www.melon.com/genre/song_list.htm?gnrCode=GN0800&steadyYn=Y"); // 크롤링 실행
	else
		crawl_data = crawling_melon("https://www.melon.com/new/index.htm"); // 크롤링 실행
	crawl_data.then(d => res.send(d)); // 해당 결과 전송
});

app.get('/topchart', (req, res) => { // /api 소스로 get요청이 들어온 경우
	let crawl_data = crawling_melon("https://www.melon.com/chart/index.htm"); // 크롤링 실행
	crawl_data.then(d => res.send(d)); // 해당 결과 전송
});

app.get('/newchart', (req, res) => { // /api 소스로 get요청이 들어온 경우
	let crawl_data = crawling_melon("https://www.melon.com/new/index.htm"); // 크롤링 실행
	crawl_data.then(d => res.send(d)); // 해당 결과 전송
});

app.get('/youtube_get', (req, res) => {
	const music_name = req.query.name;
	getFirstVideoId(music_name + " lyrics", process.env.API_KEY)
		.then(youtube_video_id => {
			const youtube_embed_url = `<iframe width="300" height="200" src="https://www.youtube.com/embed/${youtube_video_id}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
			res.send(youtube_embed_url);
		})
});

async function crawling_melon(url) {
	let chart_list = [];
	let titles = [];
	let names = [];
	let data = await fetch(url) // url로 요청을 보냄
		.then(respone => respone.text()) // 문자열로 변환
		.then((data) => {
			let root = parser.parse(data); // 파싱

			root.querySelectorAll(".rank01").forEach((item) => { // 노래 이름 저장
				titles.push(item.querySelector("a").innerText);
			});
			root.querySelectorAll(".rank02").forEach((item) => { // 노래 가수 저장
				names.push(item.querySelector("a").innerText);
			});
			chart_list = [];
			titles.forEach((title, i) => {
				chart_list.push(`${title} - ${names[i]}`); // 출력 문자열 생성
			})
			chart_list = chart_list.slice(0, 30); // 30위까지만 표시
		})
		.catch(error => console.error('Error:', error)); // 에러 발생 시
	return ({
		list: chart_list,
		title: titles,
		name: names
	}); // 요청으로 받은 문자열 반환
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