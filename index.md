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
  // 添加刷新按钮
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
  
  // 添加主题切换按钮到左侧边栏底部
  function addThemeToggleToSidebar() {
    // 查找左侧边栏
    var sidebar = document.querySelector('.sidebar-panel');
    if (!sidebar) {
      // 尝试其他选择器
      sidebar = document.querySelector('#sidebar');
    }
    if (!sidebar) {
      sidebar = document.querySelector('.aside-column');
    }
    if (!sidebar) return;
    
    // 检查是否已存在
    if (document.querySelector('.sidebar-theme-toggle')) return;
    
    var toggleDiv = document.createElement('div');
    toggleDiv.className = 'sidebar-theme-toggle';
    toggleDiv.style.cssText = 'position:fixed;bottom:20px;left:20px;z-index:1000;';
    toggleDiv.innerHTML = '<button id="sidebar-theme-btn" style="background:#333;border:none;color:#fff;width:40px;height:40px;border-radius:50%;cursor:pointer;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.3);"><i class="fas fa-moon"></i></button>';
    
    document.body.appendChild(toggleDiv);
    
    var btn = document.getElementById('sidebar-theme-btn');
    btn.onclick = function() {
      var html = document.documentElement;
      var isDark = html.getAttribute('data-theme') === 'dark' || (!html.getAttribute('data-theme') && document.body.classList.contains('dark'));
      
      if (isDark) {
        html.setAttribute('data-theme', 'light');
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        btn.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        html.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        btn.innerHTML = '<i class="fas fa-moon"></i>';
      }
    };
    
    // 恢复保存的主题
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
      btn.innerHTML = '<i class="fas fa-sun"></i>';
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { 
      setTimeout(addRefreshButton, 800);
      setTimeout(addThemeToggleToSidebar, 1000);
    });
  } else {
    setTimeout(addRefreshButton, 800);
    setTimeout(addThemeToggleToSidebar, 1000);
  }
})();
</script>

<style>
.sidebar-theme-toggle button:hover {
  transform: scale(1.1);
  transition: transform 0.2s;
}
</style>

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
