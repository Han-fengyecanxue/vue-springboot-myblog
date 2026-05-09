<template>
  <div class="about-container">
    <!-- 左侧目录区 -->
    <aside class="directory">
      <h2>📖 目录</h2>
      <ul class="menu">
        <li v-for="category in categories" :key="category.id" class="category">
          <div class="category-title" @click="toggleCategory(category.id)">
            <span>{{ category.title }}</span>
            <span class="arrow">{{ expandedCategories[category.id] ? '▼' : '▶' }}</span>
          </div>
          <ul v-if="expandedCategories[category.id]" class="sub-menu">
            <li
              v-for="article in category.articles"
              :key="article.id"
              :class="{ active: selectedArticle?.id === article.id }"
              @click="selectArticle(article)"
            >
              {{ article.title }}
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <!-- 右侧文章内容区 -->
    <main class="content">
      <div v-if="selectedArticle" class="article-wrapper">
        <h1>{{ selectedArticle.title }}</h1>
        <div class="article-body" v-html="selectedArticle.content"></div>
      </div>
      <div v-else class="placeholder">
        <p>👈 从左侧目录选择一篇文章</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// ---------- 静态文章数据 ----------
// 你可以在这里添加任意多篇文章，内容支持 HTML
const categories = ref([
  {
    id: 1,
    title: '金融',
    articles: [
      {
        id: 101,
        title: '写在金融之前',
        content: `
          <h2>本网站的资金来源</h2>
          <p>要想增长资金有两种途径，一种是开源，另一种是节流，那我分两点细说开源和节流。</p>
          <ul>
            <li><strong>开源</strong>：即获得资金，那么现阶段能增加收入来源的无非这几种，增加生活费，打工和理财。最简单的(可能吧)就是理财了，存款，基金和股票。但理财有一个非常大的前提，那就是要有财才能理财。</li>
            <li><strong>节流</strong>：如何实现个人资本的初步积累呢？节流。虽然节流不能增加收入，但非常有助于个人资本的初步积累。经过测算生活费最低标准为：1000元/月。晚饭：12元，午饭：12元，早餐一个月一箱面包加一箱牛奶：60元。极限：780元/月，所以我认为1000元/月是一个合理的最低标准(记住是最低，至少我是这样的)。或许还有杂七杂八的支出，很明显我要说的是能省则省。</li>
          </ul>
        `
      },
      {
        id: 102,
        title: '网站的基石',
        content: `
          <h2>理财品类</h2>
          <p>理财品类大致按照风险等级和收益预期进行分类：</p>
          <ul>
            <li>余额宝和零钱通</li>
            <li>定期存款</li>
            <li>基金（股票型、混合型、债券型）</li>
            <li>股票</li>
            <li>期货和衍生品</li>
            <li>比特币等加密货币</li>
          </ul>
          <p>注意：投资有风险，入市需谨慎。</p>
        `
      },
      {
        id: 103,
        title: '为什么要理财',
        content: `
          <h2>理财的原因</h2>
          <ul>
            <li><strong>通货膨胀</strong>：通货膨胀是指货币价值下降，导致商品和服务价格上升。每年大概都会有2-3%的通货膨胀，这有利于经济的发展，促进消费，毕竟现在不花，钱会越来越不值钱。</li>
            <li><strong>通货紧缩</strong>：通货紧缩是指货币供应量减少，导致物价上涨。不用懂，只要知道这还不如通胀时期好。</li>
            <li><strong>对抗通胀</strong>：理财年化3%，个人财富才不算缩水。</li>
            <li><strong>ISFP的追求，自由不是奢侈，而是选择权</strong>：你可以换一份更喜欢但薪水较低的工作，可以提前退休去旅行，可以更有底气地拒绝不合理的要求。理财，就是在积累这份底气。</li>
            <li><strong>钱少而不去尝试</strong>：追求的不是财富本身，而是财富的积累。学会理财，而不是盲目追求收益。</li>
            <li><strign>大环境</string>:“当前通胀率持续远低于3%的温和水平，反映出国内内循环疲软、总需求不足。我们主观上感觉‘东西都在涨、没钱去买’，但实际上宏观物价整体处于低位运行，供大于求。这种‘感觉’与‘数据’的背离，恰恰是因为涨价的往往是日常刚需（如食品、服务、水电燃气），而降价的主要是可选工业品（如汽车、手机）。”</li>
         `
      },
      {
        id: 104,
        title: '研究',
        content: `<div class="content"><img src="/images/photo2.png" alt="photo2"></div><p>注意：投资有风险，入市需谨慎。</p>`
      }
    ]
  },
  {
    id: 2,
    title: '摄影',
    articles: [
      {
        id: 201,
        title: '曝光三要素',
        content: `
          <h2>光圈、快门、ISO</h2>
          <p>曝光三要素共同决定照片亮度：</p>
          <ul>
            <li><strong>光圈（F值）</strong>：影响景深，数值越小背景越虚。</li>
            <li><strong>快门速度</strong>：决定运动物体清晰度，1/500秒可定格跑步。</li>
            <li><strong>ISO</strong>：感光度，越高噪点越多。</li>
          </ul>
          <p>示例参数：人像常用 F/1.8，风光常用 F/8。</p>
        `
      },
      {
        id: 202,
        title: '构图技巧',
        content: `
          <h2>三分法与引导线</h2>
          <p>好的构图让照片更具吸引力：</p>
          <ul>
            <li><strong>三分法</strong>：将主体放在四条分割线的交点上。</li>
            <li><strong>引导线</strong>：利用道路、河流等线条将视线引向主体。</li>
            <li><strong>对称与平衡</strong>：建筑摄影常用。</li>
          </ul>
          <p>多拍多练</p>
        `
      }
    ]
  }
])

// 控制每个分类的展开/折叠（默认全部展开）
const expandedCategories = reactive({
  1: true,
  2: true,
})

// 当前选中的文章
const selectedArticle = ref(null)

// 切换分类展开状态
const toggleCategory = (categoryId) => {
  expandedCategories[categoryId] = !expandedCategories[categoryId]
}

// 选择文章
const selectArticle = (article) => {
  selectedArticle.value = article
  // 移动端友好：选择文章后自动滚动到内容区域顶部
  if (window.innerWidth <= 768) {
    setTimeout(() => {
      document.querySelector('.content')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }
}

// 可选：默认选中第一篇文章（取消注释即可）
// selectArticle(categories.value[0].articles[0])
</script>

<style scoped>
.article-body :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1rem 0;
}

/* 基础样式 & 桌面端布局 (宽度 > 768px) */
.about-container {
  display: flex;
  gap: 2rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 80vh;
}

/* 左侧目录样式 */
.directory {
  flex: 0 0 260px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  height: fit-content;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}

.directory h2 {
  font-size: 1.25rem;
  margin-top: 0;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #4da0f4;
}

.menu, .sub-menu {
  list-style: none;
  padding-left: 0;
}

.category {
  margin-bottom: 0.5rem;
}

.category-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.category-title:hover {
  background: #dee2e6;
}

.arrow {
  font-size: 0.75rem;
  color: #6c757d;
}

.sub-menu {
  margin-top: 0.5rem;
  margin-left: 1rem;
}

.sub-menu li {
  padding: 0.5rem 0.75rem;
  margin: 0.25rem 0;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.sub-menu li:hover {
  background: #e9ecef;
}

.sub-menu li.active {
  background: #0d6efd;
  color: white;
  font-weight: 500;
}

/* 右侧内容样式 */
.content {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  min-height: 400px;
}

.article-wrapper h1 {
  font-size: 1.8rem;
  margin-top: 0;
  margin-bottom: 1rem;
  border-left: 4px solid #0d6efd;
  padding-left: 1rem;
}

.article-body {
  line-height: 1.7;
  color: #212529;
}

.article-body h2 {
  font-size: 1.4rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.article-body p {
  margin-bottom: 1rem;
}

.article-body ul {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #6c757d;
  font-size: 1.1rem;
  background: #f8f9fa;
  border-radius: 12px;
}

/* 滚动条美化（桌面端） */
.directory::-webkit-scrollbar {
  width: 6px;
}
.directory::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.directory::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

/* ========== 移动端适配 (屏幕宽度 ≤ 768px) ========== */
@media screen and (max-width: 768px) {
  /* 整体布局改为垂直排列，内容更流畅 */
  .about-container {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  /* 目录区域占满宽度，移除固定高度和滚动条（跟随页面滚动） */
  .directory {
    flex: auto;
    width: 100%;
    max-height: none;
    overflow-y: visible;
    padding: 0.75rem;
  }

  /* 增大目录标题的可触区域 */
  .directory h2 {
    font-size: 1.2rem;
    margin-bottom: 0.75rem;
  }

  /* 增大分类标题的点击区域，更利于手指操作 */
  .category-title {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }

  /* 箭头符号适当放大 */
  .arrow {
    font-size: 0.9rem;
  }

  /* 文章列表项增加内边距，触摸更友好 */
  .sub-menu li {
    padding: 0.75rem 1rem;
    margin: 0.3rem 0;
    font-size: 0.95rem;
  }

  /* 内容区域宽度100%，内边距适当缩小 */
  .content {
    width: 100%;
    padding: 1rem;
    min-height: 300px;
  }

  /* 文章标题字号优化 */
  .article-wrapper h1 {
    font-size: 1.5rem;
    padding-left: 0.75rem;
  }

  /* 文章正文排版更紧凑，字号适中 */
  .article-body {
    font-size: 0.95rem;
    line-height: 1.6;
  }

  .article-body h2 {
    font-size: 1.25rem;
    margin-top: 1.2rem;
  }

  /* 占位符区域高度缩小，适配小屏 */
  .placeholder {
    height: 200px;
    font-size: 1rem;
  }

  /* 移除所有 hover 效果，避免移动端误触闪烁 (保留active样式用于点击反馈) */
  .category-title:hover,
  .sub-menu li:hover {
    background: inherit;
  }

  /* 点击时给出即时反馈 (移动端专用) */
  .category-title:active {
    background: #dee2e6;
  }
  .sub-menu li:active {
    background: #1fd7b2;
  }
  .sub-menu li.active:active {
    background: #0d6efd;
  }
}

/* 针对超小手机 (≤480px) 进一步微调 */
@media screen and (max-width: 480px) {
  .about-container {
    padding: 0.75rem;
  }
  .directory {
    padding: 0.5rem;
  }
  .sub-menu li {
    padding: 0.65rem 0.9rem;
  }
  .article-body {
    font-size: 0.9rem;
  }
}
</style>