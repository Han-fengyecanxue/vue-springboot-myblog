<template>
  <div class="splash-screen" ref="screenRef" @click="enterSite">
    <canvas ref="canvasRef" class="particle-canvas" />

    <!-- 内容层（不受 Canvas 影响） -->
    <div class="content-overlay">
      <h1 class="countdown-number">{{ countdown }}</h1>
      <button class="enter-btn" @click.stop="enterSite">
        进 入 网 站
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const emit = defineEmits(['enter'])
const countdown = ref(5)
let timer = null

// 画布相关
const screenRef = ref(null)
const canvasRef = ref(null)
let ctx = null
let animationId = null
let particles = []
let hue = 0 // 全局色相滚动

const PARTICLE_COUNT = 220
const canvasWidth = ref(0)
const canvasHeight = ref(0)

// 粒子类
class Particle {
  constructor(w, h) {
    this.reset(w, h, true)
  }

  reset(w, h, initial = false) {
    this.x = Math.random() * w
    this.y = initial ? Math.random() * h : -10 - Math.random() * 60
    this.size = Math.random() * 3 + 1.5
    this.speedY = 0.8 + Math.random() * 2.5
    this.speedX = (Math.random() - 0.5) * 1.2
    this.life = 0.6 + Math.random() * 0.4
    this.fade = 0.01 + Math.random() * 0.02
    this.colorHue = Math.random() * 360
  }

  update(w, h) {
    this.x += this.speedX
    this.y += this.speedY
    this.life -= this.fade

    // 超出画布或生命结束则重置
    if (this.y > h + 20 || this.x < -20 || this.x > w + 20 || this.life <= 0) {
      this.reset(w, h)
    }
  }

  draw(ctx, globalHue) {
    // 颜色混合自身色调与全局色调，产生丰富渐变
    const h = (this.colorHue + globalHue) % 360
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${h}, 90%, 65%, ${this.life * 0.8})`
    ctx.fill()
    // 外发光
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${h}, 100%, 70%, ${this.life * 0.15})`
    ctx.fill()
  }
}

// 初始化粒子
function initParticles() {
  particles = []
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle(canvasWidth.value, canvasHeight.value))
  }
}

// 动画循环
function animate() {
  if (!ctx) return
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value)

  // 全局色相缓慢滚动，让颜色一直流动
  hue = (hue + 0.2) % 360

  for (const p of particles) {
    p.update(canvasWidth.value, canvasHeight.value)
    p.draw(ctx, hue)
  }

  animationId = requestAnimationFrame(animate)
}

// 调整画布大小
function resizeCanvas() {
  if (!canvasRef.value) return
  const rect = screenRef.value.getBoundingClientRect()
  canvasWidth.value = rect.width
  canvasHeight.value = rect.height
  canvasRef.value.width = canvasWidth.value
  canvasRef.value.height = canvasHeight.value
  // 重新初始化粒子位置以适应新尺寸
  initParticles()
}

// 进入网站
function enterSite() {
  clearInterval(timer)
  cancelAnimationFrame(animationId)
  emit('enter')
}

onMounted(async () => {
  await nextTick()
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    resizeCanvas()
    animate()
    window.addEventListener('resize', resizeCanvas)
  }

  // 倒计时
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) enterSite()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
/* ===== 全屏容器 ===== */
.splash-screen {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: radial-gradient(ellipse at center, #0a0a1a 0%, #020108 100%);
  overflow: hidden;
  cursor: pointer;
  user-select: none;
}

/* ===== Canvas 画布铺满全屏 ===== */
.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
}

/* ===== 内容覆盖层（中下方） ===== */
.content-overlay {
  position: absolute;
  bottom: 18%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  z-index: 3;
  pointer-events: none; /* 让点击穿透到下层容器 */
}

.content-overlay > * {
  pointer-events: auto; /* 按钮本身可点击 */
}

/* 倒计时数字 */
.countdown-number {
  font-size: clamp(4rem, 10vw, 7rem);
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, #ff6ec7, #7873f5, #3bd1d3, #f9d56e);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 3s ease infinite, numberPop 0.4s ease-out;
  text-shadow: none;
  filter: drop-shadow(0 0 25px rgba(120, 115, 245, 0.5));
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes numberPop {
  0% { transform: scale(0.6); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* 进入按钮 */
.enter-btn {
  padding: 16px 56px;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, #ff6ec7, #7873f5, #3bd1d3) 1;
  border-radius: 50px;
  backdrop-filter: blur(12px);
  cursor: pointer;
  transition: all 0.4s;
  box-shadow: 0 0 30px rgba(120, 115, 245, 0.3);
  position: relative;
  overflow: hidden;
}

/* 按钮内部光泽 */
.enter-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.6s;
}
.enter-btn:hover::before {
  left: 100%;
}

.enter-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 55px rgba(120, 115, 245, 0.7), 0 0 100px rgba(255, 110, 199, 0.4);
  transform: scale(1.05);
}
</style>