  (function() {
    "use strict";

    // DOM 元素
    const avatarImg = document.getElementById('avatarImg');
    const displayNameSpan = document.getElementById('displayName');
    const displayBioDiv = document.getElementById('displayBio');
    const displayArea = document.getElementById('displayArea');
    const viewActions = document.getElementById('viewActions');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const resetBtn = document.getElementById('resetBtn');
    const editArea = document.getElementById('editArea');
    const editNameInput = document.getElementById('editName');
    const editBioTextarea = document.getElementById('editBio');
    const saveButton = document.getElementById('saveBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const fileInput = document.getElementById('avatarUpload');
    const avatarModal = document.getElementById('avatarModal');
    const modalImage = document.getElementById('modalImage');
    const avatarHint = document.querySelector('.avatar-hint');

    // 存储键名
    const STORAGE_NAME = 'userProfile_name';
    const STORAGE_BIO = 'userProfile_bio';
    const STORAGE_AVATAR = 'userProfile_avatar';
    const STORAGE_CONFIGURED = 'userProfile_configured';

    const DEFAULT_AVATAR_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%237788aa'/%3E%3Ccircle cx='50' cy='38' r='14' fill='%23ffffff'/%3E%3Cpath d='M25 72 Q50 85 75 72' stroke='%23ffffff' stroke-width='5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E";

    // 当前模式标记 (辅助判断)
    let isEditMode = false;

    // 轻提示
    function showToast(msg, duration = 1500) {
      const toast = document.createElement('div');
      toast.className = 'info-toast';
      toast.textContent = msg;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => { if (toast.parentNode) toast.remove(); }, 200);
      }, duration);
    }

    // 更新提示文字
    function updateHintText() {
      if (isEditMode) {
        avatarHint.textContent = '📸 点击更换';
        avatarImg.title = '点击更换头像';
      } else {
        avatarHint.textContent = '🔍 点击查看';
        avatarImg.title = '点击查看大图';
      }
    }

    // 更新展示区
    function updateDisplayContent(name, bio) {
      if (name && name.trim() !== '') {
        displayNameSpan.textContent = name.trim();
        displayNameSpan.classList.remove('placeholder-text');
      } else {
        displayNameSpan.textContent = '未设置姓名';
        displayNameSpan.classList.add('placeholder-text');
      }

      if (bio && bio.trim() !== '') {
        displayBioDiv.textContent = bio.trim();
        displayBioDiv.classList.remove('placeholder-text');
      } else {
        displayBioDiv.textContent = '暂无简介';
        displayBioDiv.classList.add('placeholder-text');
      }
    }

    function syncDisplayToEditForm() {
      const storedName = localStorage.getItem(STORAGE_NAME);
      const storedBio = localStorage.getItem(STORAGE_BIO);
      editNameInput.value = (storedName !== null && storedName.trim() !== '') ? storedName.trim() : '';
      editBioTextarea.value = (storedBio !== null && storedBio.trim() !== '') ? storedBio.trim() : '';
    }

    function loadAvatarFromStorage() {
      const storedAvatar = localStorage.getItem(STORAGE_AVATAR);
      if (storedAvatar && storedAvatar.startsWith('data:image')) {
        avatarImg.src = storedAvatar;
      } else {
        avatarImg.src = DEFAULT_AVATAR_SVG;
        if (!storedAvatar) localStorage.setItem(STORAGE_AVATAR, DEFAULT_AVATAR_SVG);
      }
    }

    function persistProfile(name, bio, avatarDataUrl, isConfigured = true) {
      if (name !== undefined) localStorage.setItem(STORAGE_NAME, name);
      if (bio !== undefined) localStorage.setItem(STORAGE_BIO, bio);
      if (avatarDataUrl !== undefined) localStorage.setItem(STORAGE_AVATAR, avatarDataUrl);
      if (isConfigured !== undefined) localStorage.setItem(STORAGE_CONFIGURED, isConfigured ? 'true' : 'false');
    }

    // 切换查看模式
    function switchToViewMode() {
      editArea.classList.add('hidden');
      displayArea.classList.remove('hidden');
      viewActions.classList.remove('hidden');
      isEditMode = false;
      updateHintText();
    }

    // 切换编辑模式
    function switchToEditMode() {
      syncDisplayToEditForm();
      displayArea.classList.add('hidden');
      viewActions.classList.add('hidden');
      editArea.classList.remove('hidden');
      isEditMode = true;
      updateHintText();
    }

    function hasUserConfigured() {
      return localStorage.getItem(STORAGE_CONFIGURED) === 'true';
    }

    // 头像预览模态
    function openAvatarModal() {
      modalImage.src = avatarImg.src;
      avatarModal.classList.add('show');
    }

    function closeAvatarModal() {
      avatarModal.classList.remove('show');
    }

    // 重置功能
    function performReset() {
      localStorage.removeItem(STORAGE_NAME);
      localStorage.removeItem(STORAGE_BIO);
      localStorage.setItem(STORAGE_AVATAR, DEFAULT_AVATAR_SVG);
      localStorage.setItem(STORAGE_CONFIGURED, 'false');
      avatarImg.src = DEFAULT_AVATAR_SVG;
      updateDisplayContent('', '');
      editNameInput.value = '';
      editBioTextarea.value = '';
      switchToEditMode();
      showToast('🔄 卡片已重置，可以重新填写', 1600);
    }

    function handleReset() {
      if (confirm('确定要重置所有个人信息吗？头像、姓名和简介将被清空。')) {
        performReset();
      } else {
        showToast('↩️ 已取消重置', 1000);
      }
    }

    // 初始化
    function initializeProfile() {
      loadAvatarFromStorage();
      const storedName = localStorage.getItem(STORAGE_NAME);
      const storedBio = localStorage.getItem(STORAGE_BIO);
      const isConfigured = hasUserConfigured();
      let displayNameValue = '', displayBioValue = '';

      if (isConfigured) {
        displayNameValue = storedName !== null ? storedName : '';
        displayBioValue = storedBio !== null ? storedBio : '';
        if (storedName === null) localStorage.setItem(STORAGE_NAME, '');
        if (storedBio === null) localStorage.setItem(STORAGE_BIO, '');
      } else {
        localStorage.removeItem(STORAGE_NAME);
        localStorage.removeItem(STORAGE_BIO);
        localStorage.setItem(STORAGE_CONFIGURED, 'false');
        displayNameValue = '';
        displayBioValue = '';
      }

      updateDisplayContent(displayNameValue, displayBioValue);

      if (!isConfigured) {
        switchToEditMode();
        showToast('👋 欢迎！请填写你的信息', 1800);
      } else {
        switchToViewMode();
      }
    }

    // 保存
    function handleSave() {
      let newName = editNameInput.value.trim();
      let newBio = editBioTextarea.value.trim();
      updateDisplayContent(newName, newBio);
      const currentAvatar = avatarImg.src;
      persistProfile(newName, newBio, currentAvatar, true);
      switchToViewMode();
      showToast('✅ 资料已保存', 1200);
    }

    function handleCancelEdit() {
      const storedName = localStorage.getItem(STORAGE_NAME);
      const storedBio = localStorage.getItem(STORAGE_BIO);
      updateDisplayContent(storedName || '', storedBio || '');
      switchToViewMode();
      showToast('↩️ 已取消编辑', 1000);
    }

    // 头像上传处理
    function handleAvatarUpload(file) {
      if (!file) return;
      if (!file.type.startsWith('image/')) { showToast('❌ 请选择图片文件', 1500); return; }
      if (file.size > 2 * 1024 * 1024) { showToast('⚠️ 图片不能超过 2MB', 1800); return; }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        avatarImg.src = base64;
        const currentName = localStorage.getItem(STORAGE_NAME) || '';
        const currentBio = localStorage.getItem(STORAGE_BIO) || '';
        persistProfile(currentName, currentBio, base64, hasUserConfigured());
        showToast('🖼️ 头像已更新并自动保存', 1300);
      };
      reader.onerror = () => showToast('图片读取失败', 1200);
      reader.readAsDataURL(file);
    }

    // ---------- 核心：头像点击行为分流 ----------
    function onAvatarClick(e) {
      e.stopPropagation();
      if (isEditMode) {
        // 编辑模式：触发上传
        fileInput.click();
      } else {
        // 查看模式：打开大图预览
        openAvatarModal();
      }
    }

    // 事件绑定
    avatarImg.addEventListener('click', onAvatarClick);
    
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleAvatarUpload(file);
      fileInput.value = '';
    });

    editProfileBtn.addEventListener('click', switchToEditMode);
    resetBtn.addEventListener('click', handleReset);
    saveButton.addEventListener('click', handleSave);
    cancelEditBtn.addEventListener('click', handleCancelEdit);

    // 模态关闭事件
    avatarModal.addEventListener('click', closeAvatarModal);
    modalImage.addEventListener('click', (e) => {
      e.stopPropagation(); // 防止点击图片立即关闭（但模态背景仍可关）
    });

    // 启动
    initializeProfile();
  })();