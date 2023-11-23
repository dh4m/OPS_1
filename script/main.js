let chart_list = [];


const refresh_list = () => {
	// 여기 대충 실시간 차트 받아오는 코드 ㅇㅇ 배열 chart_list에 10개 채우면 됨
	chart_list = [
		"good music 1", "good music 2", "good music 3", "good music 4", "good music 5", 
		"good music 6", "good music 7", "good music 8", "good music 9", "good music 10"
	]; // 임시 코드
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
