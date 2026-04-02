document.addEventListener('DOMContentLoaded', () => {
    const scannerZone = document.getElementById('scannerZone');
    const progressBar = document.getElementById('progressBar');
    const statusText = document.getElementById('statusText');
    const introView = document.getElementById('introView');
    const resultView = document.getElementById('resultView');
    const bgMusic = document.getElementById('bgMusic');
    const starsContainer = document.querySelector('.stars-container');

    let scanProgress = 0;
    let isScanning = false;
    let scanInterval;
    let musicStarted = false;

    // Explicit Mobile Audio Unlock
    const unlockBtn = document.getElementById('unlockBtn');
    const unlockOverlay = document.getElementById('unlockOverlay');

    unlockBtn.addEventListener('click', () => {
        bgMusic.play().then(() => {
            musicStarted = true;
        }).catch(err => {
            console.log("Audio blocked despite explicit click:", err);
            // Some browsers require the promise to resolve, but we'll hide the overlay anyway
        });
        
        // Hide overlay smoothly
        unlockOverlay.style.opacity = '0';
        unlockOverlay.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            unlockOverlay.style.display = 'none';
        }, 500);
    });

    const messages = [
        "Initializing scan...",
        "Accessing biometric data...",
        "Analyzing heart rate...",
        "Detecting charm frequency...",
        "Identifying vibe signature...",
        "Filtering average vibes...",
        "Critical levels of cuteness...",
        "Calibrating IRRESISTIBILITY...",
        "Finalizing analysis..."
    ];

    // Create background stars
    function createStars() {
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const size = Math.random() * 2 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.background = '#fff';
            star.style.position = 'absolute';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.opacity = Math.random() * 0.7;
            star.style.borderRadius = '50%';
            star.style.boxShadow = '0 0 5px #fff';
            
            // Random animation
            star.animate([
                { opacity: 0.2 },
                { opacity: 1 },
                { opacity: 0.2 }
            ], {
                duration: 2000 + Math.random() * 3000,
                iterations: Infinity
            });

            starsContainer.appendChild(star);
        }
    }

    createStars();

    function startScan(e) {
        e.preventDefault();
        if (isScanning) return;
        
        isScanning = true;
        scannerZone.classList.add('active');
        
        if (!musicStarted) {
            bgMusic.play().catch(err => console.log("Audio blocked:", err));
            musicStarted = true;
        }

        scanInterval = setInterval(() => {
            if (scanProgress < 100) {
                scanProgress += 0.8;
                progressBar.style.width = `${scanProgress}%`;
                
                // Cycle through messages based on progress
                const msgIndex = Math.min(
                    Math.floor((scanProgress / 100) * messages.length),
                    messages.length - 1
                );
                statusText.innerText = messages[msgIndex];
            } else {
                completeScan();
            }
        }, 30);
    }

    function stopScan() {
        if (!isScanning) return;
        
        isScanning = false;
        clearInterval(scanInterval);
        scannerZone.classList.remove('active');
        
        // If not finished, reset with a cool reverse animation
        if (scanProgress < 100) {
            let resetInterval = setInterval(() => {
                if (scanProgress > 0) {
                    scanProgress -= 2;
                    progressBar.style.width = `${scanProgress}%`;
                    statusText.innerText = "LINK INTERRUPTED - HOLD TO SCAN";
                    statusText.style.color = "#ff007b";
                } else {
                    scanProgress = 0;
                    clearInterval(resetInterval);
                    statusText.innerText = "AWAITING INPUT...";
                    statusText.style.color = "";
                }
            }, 10);
        }
    }

    function completeScan() {
        clearInterval(scanInterval);
        isScanning = false;
        
        // Short delay for impact
        statusText.innerText = "SUCCESS: ACCESS GRANTED";
        statusText.style.color = "#00ffca";
        
        setTimeout(() => {
            introView.classList.remove('active');
            setTimeout(() => {
                introView.style.display = 'none';
                resultView.style.display = 'block';
                setTimeout(() => {
                    resultView.classList.add('active');
                }, 50);
            }, 500);
        }, 800);
    }

    // Touch and Mouse listeners
    scannerZone.addEventListener('mousedown', startScan);
    window.addEventListener('mouseup', stopScan);

    scannerZone.addEventListener('touchstart', startScan);
    window.addEventListener('touchend', stopScan);
});
