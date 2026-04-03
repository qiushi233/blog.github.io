---
layout: page
title: 文章索引
description: 所有博客文章的索引目录
permalink: /
---

<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">

<script>
/* 强制刷新 + 主题切换按钮 */
(function() {
  // 添加刷新按钮到顶部导航栏
  function addRefreshButton() {
    var navbar = document.querySelector('.navbar-nav, .nav-links, .links');
    if (!navbar) return;
    if (document.querySelector('.refresh-btn')) return;
    
    var li = document.createElement('li');
    li.className = 'refresh-btn nav-item';
    li.innerHTML = '<a href="javascript:location.reload()" title="刷新页面" style="cursor:pointer;"><i class="fas fa-sync-alt"></i></a>';
    li.style.cssText = 'margin-left:auto;';
    navbar.appendChild(li);
  }
  
  // 主题切换按钮 - 优雅地放在头像附近
  function addThemeToggle() {
    // 查找侧边栏或头像容器
    var target = document.querySelector('.profile-block') || 
                 document.querySelector('.sidebar') || 
                 document.querySelector('.author-info') ||
                 document.querySelector('.avatar');
    
    if (!target) return;
    if (document.querySelector('.theme-toggle-btn')) return;
    
    var toggleDiv = document.createElement('div');
    toggleDiv.className = 'theme-toggle-btn';
    toggleDiv.innerHTML = `
      <style>
        .theme-toggle-btn { 
          display: flex; 
          justify-content: center; 
          margin-top: 1rem;
          padding: 0.5rem;
        }
        .theme-toggle-btn button {
          background: var(--btn-bg, #f0f0f0);
          border: 1px solid var(--btn-border, #ddd);
          border-radius: 2rem;
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: var(--text-color, #333);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .theme-toggle-btn button:hover {
          background: var(--btn-hover, #e0e0e0);
          transform: scale(1.02);
        }
        .theme-toggle-btn button i {
          font-size: 1rem;
        }
        html[data-theme="dark"] .theme-toggle-btn button {
          background: #2a2a2a;
          border-color: #444;
          color: #e0e0e0;
        }
      </style>
      <button id="themeSwitchBtn" title="切换主题">
        <i class="fas fa-moon" id="themeIcon"></i>
        <span id="themeText">深色模式</span>
      </button>
    `;
    
    target.appendChild(toggleDiv);
    
    var btn = document.getElementById('themeSwitchBtn');
    var icon = document.getElementById('themeIcon');
    var text = document.getElementById('themeText');
    
    function updateThemeUI(isDark) {
      if (isDark) {
        icon.className = 'fas fa-sun';
        text.textContent = '浅色模式';
      } else {
        icon.className = 'fas fa-moon';
        text.textContent = '深色模式';
      }
    }
    
    btn.onclick = function() {
      var html = document.documentElement;
      var isDark = html.getAttribute('data-theme') === 'dark' || 
                   (!html.getAttribute('data-theme') && 
                    (document.body.classList.contains('dark') || 
                     document.body.getAttribute('data-theme') === 'dark'));
      
      if (isDark) {
        html.setAttribute('data-theme', 'light');
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        updateThemeUI(false);
      } else {
        html.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        updateThemeUI(true);
      }
    };
    
    // 恢复保存的主题
    var savedTheme = localStorage.getItem('theme');
    var currentIsDark = savedTheme === 'dark' || (!savedTheme && document.body.classList.contains('dark'));
    updateThemeUI(currentIsDark);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { 
      setTimeout(addRefreshButton, 800);
      setTimeout(addThemeToggle, 1000);
    });
  } else {
    setTimeout(addRefreshButton, 800);
    setTimeout(addThemeToggle, 1000);
  }
})();
</script>

# 📚 文章索引

> 这里收录了我所有的博客文章，持续更新中...

---

{% assign posts = site.posts | where_exp: "post", "post.url != '/posts/'" %}

{% for post in posts %}
## [{{ post.title }}]({{ post.url }})

**📅 {{ post.date | date: "%Y-%m-%d" }}** &nbsp;|&nbsp; **🏷️ {{ post.categories | join: ", " }}**

{{ post.excerpt | strip_html | truncate: 120 }}

[阅读全文 →]({{ post.url }})

---

{% endfor %}

## 📊 统计信息

- **文章总数：** {{ posts | size }}
- **更新日期：** {{ "now" | date: "%Y-%m-%d" }}
