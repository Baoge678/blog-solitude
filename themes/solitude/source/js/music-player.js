// 高级音乐播放器功能
class AdvancedMusicPlayer {
  constructor() {
    this.audio = new Audio();
    this.playlist = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.playMode = 'random'; // random, list, single
    this.volume = 0.6;
    this.isPlaylistExpanded = false;
    this.isEditMode = false;
    
    this.init();
  }
  
  async init() {
    await this.loadConfig();
    this.bindEvents();
    this.updatePlaylist();
    this.updateModeDisplay();
    this.audio.volume = this.volume;
  }
  
  async loadConfig() {
    try {
      // 尝试从配置文件加载
      const response = await fetch('/_data/music-player.yml');
      if (response.ok) {
        const yamlText = await response.text();
        const config = this.parseYAML(yamlText);
        if (config.playlist) {
          this.playlist = config.playlist;
        }
        if (config.settings) {
          this.volume = config.settings.default_volume || 0.6;
          this.playMode = config.settings.default_mode || 'random';
        }
      } else {
        // 如果配置文件不存在，使用默认列表
        this.playlist = [
          {
            name: '高山槐花开',
            artist: '凤凰传奇',
            url: 'https://flaredrive.baoge.wang/webdav/mp3/凤凰传奇-高山槐花开.mp3',
            duration: '4:30'
          },
          {
            name: '最炫民族风',
            artist: '凤凰传奇',
            url: 'https://flaredrive.baoge.wang/webdav/mp3/凤凰传奇-最炫民族风.mp3',
            duration: '3:45'
          }
        ];
      }
    } catch (error) {
      console.warn('加载配置文件失败，使用默认列表:', error);
      // 使用默认列表
      this.playlist = [
        {
          name: '高山槐花开',
          artist: '凤凰传奇',
          url: 'https://flaredrive.baoge.wang/webdav/mp3/凤凰传奇-高山槐花开.mp3',
          duration: '4:30'
        },
        {
          name: '最炫民族风',
          artist: '凤凰传奇',
          url: 'https://flaredrive.baoge.wang/webdav/mp3/凤凰传奇-最炫民族风.mp3',
          duration: '3:45'
        }
      ];
    }
  }
  
  parseYAML(yamlText) {
    // 简单的YAML解析器
    const config = {};
    const lines = yamlText.split('\n');
    let currentSection = null;
    
    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith('#')) continue;
      
      if (line === 'playlist:') {
        currentSection = 'playlist';
        config.playlist = [];
      } else if (line === 'settings:') {
        currentSection = 'settings';
        config.settings = {};
      } else if (line.startsWith('- name:')) {
        // 解析歌曲信息
        const song = {};
        const nameMatch = line.match(/name:\s*(.+)/);
        if (nameMatch) song.name = nameMatch[1].trim();
        
        // 查找后续的artist和url行
        const currentIndex = lines.indexOf(line);
        for (let i = currentIndex + 1; i < lines.length; i++) {
          const nextLine = lines[i].trim();
          if (nextLine.startsWith('artist:')) {
            const artistMatch = nextLine.match(/artist:\s*(.+)/);
            if (artistMatch) song.artist = artistMatch[1].trim();
          } else if (nextLine.startsWith('url:')) {
            const urlMatch = nextLine.match(/url:\s*(.+)/);
            if (urlMatch) song.url = urlMatch[1].trim();
          } else if (nextLine.startsWith('duration:')) {
            const durationMatch = nextLine.match(/duration:\s*(.+)/);
            if (durationMatch) song.duration = durationMatch[1].trim();
          } else if (nextLine.startsWith('-') || nextLine.startsWith('#')) {
            break;
          }
        }
        if (song.name && song.artist && song.url) {
          config.playlist.push(song);
        }
      } else if (currentSection === 'settings' && line.includes(':')) {
        const [key, value] = line.split(':').map(s => s.trim());
        if (key && value) {
          config.settings[key] = value;
        }
      }
    }
    
    return config;
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
    
    // 播放模式
    document.getElementById('mode-btn')?.addEventListener('click', () => this.togglePlayMode());
    
    // 播放列表
    document.getElementById('playlist-toggle')?.addEventListener('click', () => this.togglePlaylist());
    document.getElementById('edit-btn')?.addEventListener('click', () => this.toggleEditMode());
    document.getElementById('close-edit')?.addEventListener('click', () => this.toggleEditMode());
    
    // 搜索
    document.getElementById('search-input')?.addEventListener('input', (e) => this.searchSongs(e.target.value));
    
    // 添加歌曲
    document.getElementById('add-song-btn')?.addEventListener('click', () => this.addSong());
    
    // 音频事件
    this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.onSongEnd());
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
      this.updatePlaylist();
    }).catch(error => {
      console.error('播放失败:', error);
      this.showError('播放失败，请检查音频文件链接');
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
    this.updateVolumeIcon();
  }
  
  togglePlayMode() {
    const modes = ['random', 'list', 'single'];
    const currentIndex = modes.indexOf(this.playMode);
    this.playMode = modes[(currentIndex + 1) % modes.length];
    this.updateModeDisplay();
  }
  
  togglePlaylist() {
    this.isPlaylistExpanded = !this.isPlaylistExpanded;
    const content = document.querySelector('.playlist-content');
    const toggle = document.getElementById('playlist-toggle');
    
    if (this.isPlaylistExpanded) {
      content.style.display = 'block';
      toggle.innerHTML = '<i class="fas fa-chevron-up"></i>';
    } else {
      content.style.display = 'none';
      toggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
    }
  }
  
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    const editPanel = document.querySelector('.player-edit');
    
    if (this.isEditMode) {
      editPanel.classList.add('show');
      this.updateEditList();
    } else {
      editPanel.classList.remove('show');
    }
  }
  
  searchSongs(keyword) {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach(item => {
      const title = item.querySelector('.item-title').textContent.toLowerCase();
      const artist = item.querySelector('.item-artist').textContent.toLowerCase();
      const searchTerm = keyword.toLowerCase();
      
      if (title.includes(searchTerm) || artist.includes(searchTerm)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }
  
  addSong() {
    const name = document.getElementById('edit-song-name').value.trim();
    const artist = document.getElementById('edit-song-artist').value.trim();
    const url = document.getElementById('edit-song-url').value.trim();
    
    if (!name || !artist || !url) {
      this.showError('请填写完整的歌曲信息');
      return;
    }
    
    const newSong = {
      name: name,
      artist: artist,
      url: url,
      duration: '0:00'
    };
    
    this.playlist.push(newSong);
    this.updatePlaylist();
    this.updateEditList();
    
    // 清空输入框
    document.getElementById('edit-song-name').value = '';
    document.getElementById('edit-song-artist').value = '';
    document.getElementById('edit-song-url').value = '';
    
    this.showSuccess('歌曲添加成功');
  }
  
  removeSong(index) {
    this.playlist.splice(index, 1);
    if (this.currentIndex >= this.playlist.length) {
      this.currentIndex = Math.max(0, this.playlist.length - 1);
    }
    this.updatePlaylist();
    this.updateEditList();
    this.showSuccess('歌曲删除成功');
  }
  
  playSong(index) {
    this.currentIndex = index;
    this.play();
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
  
  updateVolumeIcon() {
    const volumeIcon = document.querySelector('.player-volume i');
    if (volumeIcon) {
      if (this.volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
      } else if (this.volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
      } else {
        volumeIcon.className = 'fas fa-volume-up';
      }
    }
  }
  
  updateModeDisplay() {
    const modeBtn = document.getElementById('mode-btn');
    const modeText = document.getElementById('mode-text');
    
    if (modeBtn) {
      const icons = {
        random: 'fas fa-random',
        list: 'fas fa-list',
        single: 'fas fa-redo'
      };
      modeBtn.innerHTML = `<i class="${icons[this.playMode]}"></i>`;
    }
    
    if (modeText) {
      const texts = {
        random: '随机播放',
        list: '顺序播放',
        single: '单曲循环'
      };
      modeText.textContent = texts[this.playMode];
    }
  }
  
  updatePlaylist() {
    const content = document.getElementById('playlist-content');
    if (!content) return;
    
    content.innerHTML = '';
    this.playlist.forEach((song, index) => {
      const item = document.createElement('div');
      item.className = 'playlist-item';
      item.dataset.index = index;
      
      if (index === this.currentIndex && this.isPlaying) {
        item.classList.add('playing');
      }
      
      item.innerHTML = `
        <div class="item-info">
          <div class="item-title">${song.name}</div>
          <div class="item-artist">${song.artist}</div>
        </div>
        <div class="item-duration">${song.duration}</div>
      `;
      
      item.addEventListener('click', () => this.playSong(index));
      content.appendChild(item);
    });
  }
  
  updateEditList() {
    const editList = document.getElementById('edit-list');
    if (!editList) return;
    
    editList.innerHTML = '';
    this.playlist.forEach((song, index) => {
      const item = document.createElement('div');
      item.className = 'edit-item';
      
      item.innerHTML = `
        <div class="edit-item-info">
          <span>${song.name} - ${song.artist}</span>
        </div>
        <button class="remove-song-btn" onclick="musicPlayer.removeSong(${index})">
          <i class="fas fa-trash"></i>
        </button>
      `;
      
      editList.appendChild(item);
    });
  }
  
  onSongEnd() {
    switch (this.playMode) {
      case 'random':
        this.currentIndex = Math.floor(Math.random() * this.playlist.length);
        break;
      case 'list':
        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        break;
      case 'single':
        // 单曲循环，不改变索引
        break;
    }
    this.play();
  }
  
  onError() {
    this.showError('音频文件加载失败');
  }
  
  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  showError(message) {
    // 简单的错误提示
    console.error(message);
    // 可以添加更美观的提示组件
  }
  
  showSuccess(message) {
    // 简单的成功提示
    console.log(message);
    // 可以添加更美观的提示组件
  }
}

// 初始化播放器
let musicPlayer;
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.card-music-player')) {
    musicPlayer = new AdvancedMusicPlayer();
  }
}); 