let titles = []; // 음악 제목
let names = []; // 가수

let chart_list = ["차트 불러오는 중..."]; // 출력문 저장

async function refresh_list() { // 차트 갱신
	chart_list = ["차트 불러오는 중..."];
	fetch("http://localhost:3000/topchart") // 구축한 프록시 서버에 get요청 보냄
		.then(respone => respone.text()) // 응답 텍스트로 변환
		.then((data) => {
			const receive_data = JSON.parse(data);
			titles = receive_data.title;
			names = receive_data.name;

			chart_list = [];
			titles.forEach((title, i) => {
				chart_list.push(`${i + 1}. ${title} - ${names[i]}`); // 출력 문자열 생성
			})
			chart_list = chart_list.slice(0, 15); // 15위까지만 표시
		})
		.catch(error => console.error('Error:', error)); // http 요청 에러
	return;
}

document.addEventListener('DOMContentLoaded', () => { // 사이트 로드 시
	refresh_list(); // 리스트 갱신
	let i = 0;
	let count = 0;
	let chart_div = document.getElementById("realtime-chart");

	chart_div.textContent = chart_list[0]; // 첫 원소 넣음
	i = (i + 1) % chart_list.length;
	setInterval(() => {
		if (count >= 4500) { // 5시간마다 실시간 차트 받아옴
			count = 0;
			refresh_list(); // 리스트 갱신
		}
		else count++;
		chart_div.textContent = chart_list[i]; // i번째 문자열 출력
		chart_div.style.animation = 'none'; // 애니메이션 리셋
		chart_div.offsetHeight; // 리플로우 발생
		chart_div.style.animation = 'slideUp 0.5s ease-in-out'; // 애니메이션 재적용
		i = (i + 1) % chart_list.length; // 인덱스 갱신
	}, 4000);
});

document.getElementById('make-list-button').addEventListener('click', function () {
	var oldDiv = document.getElementById('music-condition-container');
	var oldDiv2 = document.getElementById("music-list-container");
	var newDiv = document.getElementById('music-play-container');

	// Old div 움직임
	oldDiv.classList.add('hidden-left');
	oldDiv2.classList.add('hidden-width');
	newDiv.classList.add('show-right');

	// 애니메이션이 끝난 후 새로운 div 표시
	oldDiv.addEventListener('animationend', function () {
		newDiv.style.display = 'flex';
		oldDiv.style.display = 'none';
	});

	let genre = document.querySelector('input[name="genre-radio"]:checked').value;
	fetch("http://localhost:3000/genre?genre=" + genre) // 구축한 프록시 서버에 get요청 보냄
		.then(respone => respone.text()) // 응답 텍스트로 변환
		.then(data => {
			const receive_data = JSON.parse(data);
			let show_list = receive_data.list;
			show_list = show_list.slice(0, 20);
		
			for (i in show_list)
			{
				let div = document.createElement("div");
				div.className= "p-1 rounded-2 ps-2 d-flex align-items-center my-1";
				div.style.backgroundColor = "#CC66CC"

				let span = document.createElement("span");
				span.classList.add("me-auto");
				span.textContent = show_list[i];
				div.appendChild(span);

				let list_contain = document.querySelector("#music-list");
				list_contain.appendChild(div);
			}
			
		});
});

document.querySelectorAll('.play-pause-button').forEach(button => {
	button.addEventListener('click', function() {
			var audio = document.getElementById("audio");

			if (this.classList.contains('playing')) {
					this.classList.remove('playing');
					this.classList.add('paused');
					audio.pause();
			} else {
					this.classList.remove('paused');
					this.classList.add('playing');
					audio.play();
			}
	}); // 여기에 괄호를 추가함

	if (!button.classList.contains('paused')) {
			button.classList.add('paused');
	}
});

var timer;
var percent = 0;
var audio = document.getElementById("audio");
audio.addEventListener("playing", function(_event) {
	var duration = _event.target.duration;
	advance(duration, audio);
});

audio.addEventListener("pause", function(_event) {
	clearTimeout(timer);
});

var advance = function(duration, element) {
	var progress = document.getElementById("progress");
	increment = 10/duration
	percent = Math.min(increment * element.currentTime * 10, 100);
	progress.style.width = percent+'%'
	startTimer(duration, element);
}

var startTimer = function(duration, element){ 
	if(percent < 100) {
		timer = setTimeout(function (){advance(duration, element)}, 100);
	}
}