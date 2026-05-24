//内容栏
<template>
    <div class="content-panel1">
        <div class="hot">
            <h2>网站更新日志</h2>
            <ul>
                <li><a href="#">2026年5月24日，OpenWeb，AI制作的小游戏？</a></li>
                <li><a href="#">2026年5月23日，样式修改</a></li>
                <li><a href="#">2026年5月21日，换了个导航栏</a></li>
                <li><a href="#">2026年5月10日，商品表格组件</a></li>
                <li><a href="#">2026年4月28日，修改网站名称为枫叶残雪的博客网站，图标，更新学习页面UI.</a></li>
                <li><a href="#">2026年4月19日，前端作业ToDoList，在学习页面可用。</a></li>
                <li><a href="#">2026年4月18日，网站上线！</a></li>
            </ul>
        </div>
        <div class="recommend">
            <h2>ISFP</h2>
            <ul>
                <li><a href="#">显然，做为ISFP,最重要的是享受生活。</a></li>
            </ul>
        </div>
        <div class="newest">
            <h2>最新文章</h2>
            <ul>
                <li><a href="#">写在金融之前</a></li>
                <li><a href="#">网站的基石</a></li>
                <li><a href="#">为什么要理财</a></li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.content-panel1 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;            /* 子元素之间的间距 */
}
.hot, .recommend, .newest {
    background-color: #ffffff; /* 背景颜色 */
    padding: 20px;         /* 内边距 */
    border-radius: 8px;    /* 圆角 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影效果 */
    flex: 1;              /* 每个栏目占据相等的宽度 */
}
</style>