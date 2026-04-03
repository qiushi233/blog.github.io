/* 强制刷新按钮 - Chirpy 主题适配 */
(function() {
  function addRefreshButton() {
    var navbar = document.querySelector('.navbar-nav') || document.querySelector('#navbar .links');
    if (!navbar) return;
    
    // 检查是否已存在
    if (document.querySelector('.refresh-btn')) return;
    
    var btn = document.createElement('li');
    btn.className = 'refresh-btn';
    btn.innerHTML = '<a href="javascript:void(0)" title="刷新页面"><i class="fas fa-sync-alt"></i></a>';
    btn.style.cssText = 'margin-left:auto;';
    btn.onclick = function() {
      location.reload();
    };
    navbar.appendChild(btn);
  }
  
  // 等待 DOM 加载完成后添加
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(addRefreshButton, 800);
    });
  } else {
    setTimeout(addRefreshButton, 800);
  }
})();
