
const url = "https://www.melon.com/new/index.htm";
const titles = [];

let chart_list = [];

const refresh_list = () => {
	fetch(url)
		.then(respone => respone.text())
		.then((data) =>{
			const parser = new DOMParser();
			let root = parser.parseFromString(data, 'text/html');

			chart_list = [];
			root.querySelectorAll(".rank01").forEach((item) => {
				chart_list.push(item.querySelector("a").innerText);
			});
			chart_list = chart_list.slice(0, 10);
		})
		.catch(error => console.error('Error:', error));
	return ;
}

document.addEventListener('DOMContentLoaded', () => {
	refresh_list();
	let i = 1;
	let count = 0;
	let chart_div = document.getElementById("realtime-chart");

	chart_div.textContent = chart_list[0];
	setInterval(() => {
		if (count >= 4500) { // 5시간마다 실시간 차트 받아옴
			count = 0;
			refresh_list();
		}
		else count++;
		chart_div.textContent = chart_list[i];
		chart_div.style.animation = 'none'; // 애니메이션 리셋
    	chart_div.offsetHeight; // 리플로우 발생
    	chart_div.style.animation = 'slideUp 0.5s ease-in-out'; // 애니메이션 재적용
		i = (i + 1) % chart_list.length;
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
