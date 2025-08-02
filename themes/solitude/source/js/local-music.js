// 本地音乐播放器功能
class LocalMusicPlayer {
  constructor() {
    this.audio = new Audio();
    this.playlist = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.volume = 0.6;
    
    this.init();
  }
  
  init() {
    // 从配置中获取播放列表
    if (window.theme && window.theme.capsule && window.theme.capsule.custom_list) {
      this.playlist = window.theme.capsule.custom_list;
    }
    
    this.bindEvents();
    this.audio.volume = this.volume;
  }
  
  bindEvents() {
    // 播放控制
    document.getElementById('play-btn')?.addEventListener('click', () => this.togglePlay());
    document.getElementById('prev-btn')?.addEventListener('click', () => this.prevSong());
    document.getElementById('next-btn')?.addEventListener('click', () => this.nextSong());
    
    // 进度条
    document.getElementById('progress-input')?.addEventListener('input', (e) => this.seekTo(e.target.value));
    
    // 音量控制
    document.getElementById('volume-slider')?.addEventListener('input', (e) => this.setVolume(e.target.value / 100));
    
    // 音频事件
    this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.nextSong());
    this.audio.addEventListener('error', () => this.onError());
  }
  
  togglePlay() {
    if (this.playlist.length === 0) return;
    
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
  
  play() {
    if (this.playlist.length === 0) return;
    
    const song = this.playlist[this.currentIndex];
    if (this.audio.src !== song.url) {
      this.audio.src = song.url;
    }
    
    this.audio.play().then(() => {
      this.isPlaying = true;
      this.updatePlayButton();
      this.updateCurrentSong();
    }).catch(error => {
      console.error('播放失败:', error);
    });
  }
  
  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updatePlayButton();
  }
  
  prevSong() {
    if (this.playlist.length === 0) return;
    
    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    this.play();
  }
  
  nextSong() {
    if (this.playlist.length === 0) return;
    
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    this.play();
  }
  
  seekTo(percent) {
    const time = (percent / 100) * this.audio.duration;
    this.audio.currentTime = time;
  }
  
  setVolume(volume) {
    this.volume = volume;
    this.audio.volume = volume;
  }
  
  updatePlayButton() {
    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
      playBtn.innerHTML = this.isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    }
  }
  
  updateCurrentSong() {
    if (this.playlist.length === 0) return;
    
    const song = this.playlist[this.currentIndex];
    const titleEl = document.getElementById('current-song-title');
    const artistEl = document.getElementById('current-song-artist');
    
    if (titleEl) titleEl.textContent = song.name;
    if (artistEl) artistEl.textContent = song.artist;
  }
  
  updateProgress() {
    const progressFilled = document.getElementById('progress-filled');
    const progressInput = document.getElementById('progress-input');
    const currentTime = document.getElementById('current-time');
    
    if (this.audio.duration) {
      const percent = (this.audio.currentTime / this.audio.duration) * 100;
      if (progressFilled) progressFilled.style.width = percent + '%';
      if (progressInput) progressInput.value = percent;
    }
    
    if (currentTime) {
      currentTime.textContent = this.formatTime(this.audio.currentTime);
    }
  }
  
  updateDuration() {
    const totalTime = document.getElementById('total-time');
    if (totalTime) {
      totalTime.textContent = this.formatTime(this.audio.duration);
    }
  }
  
  onError() {
    console.error('音频文件加载失败');
  }
  
  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

// 初始化播放器
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.local-music-player')) {
    window.localMusicPlayer = new LocalMusicPlayer();
  }
}); 