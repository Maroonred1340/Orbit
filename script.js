const movingSquare = document.getElementById('movingSquare');
const resultArea = document.getElementById('resultArea');
const resultMessage = document.getElementById('resultMessage');
const restartBtn = document.getElementById('restartBtn');
const timer = document.getElementById('timer');

let isGameActive = true;
let gameStarted = false;
let position = 0;
let isInTargetZone = false;

const SPEED = 5; // 네모 이동 속도 (픽셀/프레임)
const TARGET_ZONE_START = window.innerWidth * 0.6; // 대략 화면의 60% 지점부터
const TARGET_ZONE_END = window.innerWidth * 0.85; // 화면의 85% 지점까지
const GAME_DURATION = 5000; // 5초 동안 네모 이동

// 게임 시작
function startGame() {
    position = 0;
    isGameActive = true;
    gameStarted = true;
    resultArea.style.display = 'none';
    restartBtn.style.display = 'none';
    movingSquare.classList.remove('clicked');
    
    animate();
    
    // 5초 후 자동으로 게임 종료 (클릭하지 않으면 실패)
    setTimeout(() => {
        if (isGameActive) {
            endGame(false);
        }
    }, GAME_DURATION);
}

// 애니메이션 루프
function animate() {
    if (!isGameActive) return;
    
    // 트랙의 실제 너비 계산
    const trackWidth = document.querySelector('.track').offsetWidth;
    const squareWidth = movingSquare.offsetWidth;
    const maxPosition = trackWidth - squareWidth;
    
    position += SPEED;
    
    if (position >= maxPosition) {
        position = maxPosition;
        isGameActive = false;
        endGame(false); // 끝까지 클릭하지 않으면 실패
        return;
    }
    
    movingSquare.style.left = position + 'px';
    
    // 목표 영역 체크 (화면 좌표 기준이 아닌 트랙 내 상대적 위치)
    const targetZonePixels = trackWidth * 0.5; // 트랙의 50% 지점부터
    const targetZonePixelsEnd = trackWidth * 0.85; // 85% 지점까지
    
    if (position >= targetZonePixels && position <= targetZonePixelsEnd) {
        isInTargetZone = true;
        movingSquare.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.8)';
    } else {
        isInTargetZone = false;
        movingSquare.style.boxShadow = 'none';
    }
    
    requestAnimationFrame(animate);
}

// 네모 클릭 이벤트
movingSquare.addEventListener('click', (e) => {
    if (!isGameActive) return;
    
    e.stopPropagation();
    movingSquare.classList.add('clicked');
    isGameActive = false;
    
    // 목표 영역 내에서 클릭했는지 확인
    const success = isInTargetZone;
    
    endGame(success);
});

// 게임 종료 및 결과 표시
function endGame(success) {
    isGameActive = false;
    
    resultArea.style.display = 'block';
    
    if (success) {
        resultMessage.textContent = '✓ 성공!';
        resultMessage.className = 'result-message success';
    } else {
        resultMessage.textContent = '✗ 실패!';
        resultMessage.className = 'result-message failure';
    }
    
    // 20초 카운트다운
    let countdown = 20;
    timer.textContent = countdown;
    
    const countdownInterval = setInterval(() => {
        countdown--;
        timer.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            restartBtn.style.display = 'block';
        }
    }, 1000);
}

// 다시 시작 버튼
restartBtn.addEventListener('click', startGame);

// 게임 시작
startGame();

// 윈도우 리사이즈 시 게임 초기화
window.addEventListener('resize', () => {
    if (!gameStarted || !isGameActive) {
        startGame();
    }
});
