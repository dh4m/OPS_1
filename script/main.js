
const proxy_url = "http://localhost:3000/api"; // 프록시 서버 url

const titles = []; // 음악 제목
const names = []; // 가수

let chart_list = ["차트 불러오는 중..."]; // 출력문 저장

async function refresh_list() { // 차트 갱신
	fetch(proxy_url) // 구축한 프록시 서버에 get요청 보냄
		.then(respone => respone.text()) // 응답 텍스트로 변환
		.then((data) =>{
			const parser = new DOMParser(); // html 파싱 객체 생성
			let root = parser.parseFromString(data, 'text/html'); // 파싱

			root.querySelectorAll(".rank01").forEach((item) => { // 노래 이름 저장
				titles.push(item.querySelector("a").innerText);
			});
			root.querySelectorAll(".rank02").forEach((item) => { // 노래 가수 저장
				names.push(item.querySelector("a").innerText);
			});
			titles.forEach((title, i) => {
				chart_list.push(`${i + 1}. ${title} - ${names[i]}`); // 출력 문자열 생성
			})
			chart_list = chart_list.slice(0, 15); // 15위까지만 표시
		})
		.catch(error => console.error('Error:', error)); // http 요청 에러
	return ;
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

document.getElementById('make-list-button').addEventListener('click', function() {
	var oldDiv = document.getElementById('music-condition-container');
	var newDiv = document.getElementById('music-play-container');
  
	// Old div 움직임
	oldDiv.classList.add('hidden-left');
  
	// 애니메이션이 끝난 후 새로운 div 표시
	oldDiv.addEventListener('transitionend', function() {
	  oldDiv.style.display = 'none';
	  newDiv.style.display = 'flex';
	});
  });
