const movingSquare = document.getElementById('movingSquare');
const resultArea = document.getElementById('resultArea');
const resultMessage = document.getElementById('resultMessage');
const restartBtn = document.getElementById('restartBtn');
const timer = document.getElementById('timer');

let isGameActive = true;
let gameStarted = false;
let gameCompleted = false; // 한 번만 플레이 가능하게 하는 플래그
let restartBtnClicked = false; // 버튼을 한 번만 누르게 하는 플래그
let position = 0;
let isInTargetZone = false;

const SPEED = 5; // 네모 이동 속도 (픽셀/프레임)
const TARGET_ZONE_START = 0.6; // 트랙의 60% 지점부터
const TARGET_ZONE_END = 0.7; // 트랙의 70% 지점까지
const GAME_DURATION = 5000; // 5초 동안 네모 이동
const INITIAL_SHOW_DURATION = 200; // 처음 0.2초 보이기
const RESULT_DELAY = 10000; // 결과 표시 전 10초 대기

// 게임 시작
function startGame() {
    // 게임이 이미 완료되었으면 시작하지 않음
    if (gameCompleted) return;
    
    position = 0;
    isGameActive = true;
    gameStarted = true;
    resultArea.style.display = 'none';
    restartBtn.style.display = 'none';
    movingSquare.classList.remove('clicked');
    movingSquare.style.opacity = '1'; // 처음에 보이게
    
    animate();
    
    // 0.2초 후 큐브 투명하게
    setTimeout(() => {
        if (isGameActive) {
            movingSquare.style.opacity = '0';
        }
    }, INITIAL_SHOW_DURATION);
    
    // 5초 후 자동으로 게임 종료 (클릭하지 않으면 실패)
    setTimeout(() => {
        if (isGameActive) {
            isGameActive = false;
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
    
    // 목표 영역 체크 (트랙 내 상대적 위치 기반)
    const targetZoneStart = trackWidth * TARGET_ZONE_START; // 트랙의 60%
    const targetZoneEnd = trackWidth * TARGET_ZONE_END; // 트랙의 70%
    
    if (position >= targetZoneStart && position <= targetZoneEnd) {
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
    if (!isGameActive || gameCompleted) return;
    
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
    gameCompleted = true; // 게임 완료 플래그 설정
    
    // 10초 후에 결과 표시
    setTimeout(() => {
        resultArea.style.display = 'block';
        restartBtn.style.display = 'block'; // 버튼 표시
        
        if (success) {
            resultMessage.textContent = '✓ 성공!';
            resultMessage.className = 'result-message success';
        } else {
            resultMessage.textContent = '✗ 실패!';
            resultMessage.className = 'result-message failure';
        }
        
        // 카운트다운
        let countdown = 10;
        timer.textContent = countdown;
        
        const countdownInterval = setInterval(() => {
            countdown--;
            timer.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
    }, RESULT_DELAY);
}

// 다시 시작 버튼 - 한 번만 누를 수 있음
restartBtn.addEventListener('click', (e) => {
    // 이미 클릭했거나 게임이 완료되었으면 무시
    if (restartBtnClicked || gameCompleted) {
        e.preventDefault();
        return;
    }
    
    // 첫 번째 클릭 처리
    restartBtnClicked = true;
    restartBtn.disabled = true; // 버튼 비활성화
    restartBtn.style.opacity = '0.5'; // 회색으로 표시
    restartBtn.style.cursor = 'not-allowed';
    
    // 클릭 효과 제거
    e.preventDefault();
});

// 게임 시작
startGame();

// 윈도우 리사이즈 시 게임 초기화
window.addEventListener('resize', () => {
    if (!gameStarted || !isGameActive) {
        // 게임이 완료되면 리사이즈 시에도 시작하지 않음
        if (!gameCompleted) {
            startGame();
        }
    }
});
