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
const countdown = ref(60)
let timer = null

// 画布相关
const screenRef = ref(null)
const canvasRef = ref(null)
let ctx = null
let animationId = null
let fallingStars = []
let starDusts = []
let shootingStars = []
let orbitingStars = []

const FALLING_STAR_COUNT = 120
const STAR_DUST_COUNT = 55
const canvasWidth = ref(0)
const canvasHeight = ref(0)

// 地球数据
const earth = ref({
  x: 0,
  y: 0,
  radius: 90,
  captureRadius: 180
})

// ========= 拖动相关状态 =========
const isDragging = ref(false)
const dragStartEarth = ref({ x: 0, y: 0 })
const dragStartPointer = ref({ x: 0, y: 0 })
const hasMoved = ref(false)

// 流星计时
let lastShootingStarTime = 0
let nextShootingStarInterval = 2000

// ==================== 坠落星星类 (保持不变) ====================
class FallingStar {
  constructor(w, h) {
    this.reset(w, h, true)
  }
  reset(w, h, initial = false) {
    this.x = Math.random() * w
    this.y = initial ? Math.random() * h : -15 - Math.random() * 80
    this.size = 1.5 + Math.random() * 4.5
    this.innerRatio = 0.35 + Math.random() * 0.08
    this.speedY = 1.2 + Math.random() * 3.8
    this.speedX = (Math.random() - 0.5) * 0.9
    this.rotation = Math.random() * Math.PI * 2
    this.rotationSpeed = (Math.random() - 0.5) * 0.04
    this.opacity = 0.65 + Math.random() * 0.35
    this.twinklePhase = Math.random() * Math.PI * 2
    this.twinkleSpeed = 0.03 + Math.random() * 0.08
    if (Math.random() < 0.18) {
      this.colorHue = 200 + Math.random() * 35
      this.saturation = 60 + Math.random() * 30
    } else if (Math.random() < 0.12) {
      this.colorHue = 270 + Math.random() * 25
      this.saturation = 50 + Math.random() * 30
    } else {
      this.colorHue = 30 + Math.random() * 35
      this.saturation = 85 + Math.random() * 15
    }
    this.lightness = 70 + Math.random() * 25
    this.bottomFade = 0
  }
  update(w, h) {
    this.y += this.speedY
    this.x += this.speedX
    this.rotation += this.rotationSpeed
    this.twinklePhase += this.twinkleSpeed
    if (this.y > h - 60) {
      this.bottomFade = Math.min(1, (this.y - (h - 60)) / 60)
    } else {
      this.bottomFade = 0
    }
    if (this.y > h + 25 || this.x < -25 || this.x > w + 25) {
      this.reset(w, h)
    }
  }
  draw(ctx) {
    const twinkleAlpha = 0.55 + 0.45 * Math.sin(this.twinklePhase)
    const fadeFactor = 1 - this.bottomFade * 0.75
    const alpha = this.opacity * twinkleAlpha * fadeFactor
    if (alpha < 0.02) return
    const hue = this.colorHue
    const sat = this.saturation
    const light = this.lightness
    const glowRadius = this.size * 3.5
    const glowGrad = ctx.createRadialGradient(this.x, this.y, this.size * 0.3, this.x, this.y, glowRadius)
    glowGrad.addColorStop(0, `hsla(${hue}, ${sat}%, ${light}%, ${alpha * 0.55})`)
    glowGrad.addColorStop(0.5, `hsla(${hue}, ${sat}%, ${light}%, ${alpha * 0.18})`)
    glowGrad.addColorStop(1, `hsla(${hue}, ${sat}%, ${light}%, 0)`)
    ctx.beginPath()
    ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2)
    ctx.fillStyle = glowGrad
    ctx.fill()
    const trailY = this.y - this.size * 2.2
    const trailGrad = ctx.createRadialGradient(this.x, trailY, 0, this.x, trailY, this.size * 2.8)
    trailGrad.addColorStop(0, `hsla(${hue}, ${sat}%, ${light}%, ${alpha * 0.3})`)
    trailGrad.addColorStop(1, `hsla(${hue}, ${sat}%, ${light}%, 0)`)
    ctx.beginPath()
    ctx.ellipse(this.x, trailY, this.size * 1.8, this.size * 3.5, 0, 0, Math.PI * 2)
    ctx.fillStyle = trailGrad
    ctx.fill()
    this.drawStarShape(ctx, this.x, this.y, this.size, this.innerRatio, this.rotation, alpha, hue, sat, light)
  }
  drawStarShape(ctx, cx, cy, outerR, innerRatio, rotation, alpha, hue, sat, light) {
    const innerR = outerR * innerRatio
    const spikes = 5
    const step = Math.PI / spikes
    ctx.beginPath()
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerR : innerR
      const angle = i * step + rotation - Math.PI / 2
      const x = cx + Math.cos(angle) * radius
      const y = cy + Math.sin(angle) * radius
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fillStyle = `hsla(${hue}, ${sat}%, ${Math.min(100, light + 8)}%, ${alpha})`
    ctx.fill()
    ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${Math.min(100, light + 15)}%, ${alpha * 0.7})`
    ctx.lineWidth = 0.4 + outerR * 0.08
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(cx, cy, outerR * 0.22, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${hue}, 30%, 96%, ${alpha * 0.75})`
    ctx.fill()
  }
}

// ==================== 星尘类 (保持不变) ====================
class StarDust {
  constructor(w, h) {
    this.reset(w, h, true)
  }
  reset(w, h, initial = false) {
    this.x = Math.random() * w
    this.y = initial ? Math.random() * h : -10 - Math.random() * 60
    this.size = 0.6 + Math.random() * 1.6
    this.speedY = 0.25 + Math.random() * 1.1
    this.speedX = (Math.random() - 0.5) * 0.4
    this.opacity = 0.35 + Math.random() * 0.45
    this.swayPhase = Math.random() * Math.PI * 2
    this.swaySpeed = 0.015 + Math.random() * 0.04
    this.swayAmount = 0.2 + Math.random() * 1.8
    this.twinklePhase = Math.random() * Math.PI * 2
    this.twinkleSpeed = 0.04 + Math.random() * 0.1
    const hueChoices = [195, 210, 260, 280, 35, 45, 180, 220]
    this.colorHue = hueChoices[Math.floor(Math.random() * hueChoices.length)] + (Math.random() - 0.5) * 20
    this.saturation = 40 + Math.random() * 40
    this.lightness = 70 + Math.random() * 25
    this.bottomFade = 0
  }
  update(w, h) {
    this.swayPhase += this.swaySpeed
    this.x += Math.sin(this.swayPhase) * this.swayAmount * 0.08
    this.y += this.speedY
    this.twinklePhase += this.twinkleSpeed
    if (this.y > h - 50) {
      this.bottomFade = Math.min(1, (this.y - (h - 50)) / 50)
    } else {
      this.bottomFade = 0
    }
    if (this.y > h + 15 || this.x < -15 || this.x > w + 15) {
      this.reset(w, h)
    }
  }
  draw(ctx) {
    const twinkle = 0.5 + 0.5 * Math.sin(this.twinklePhase)
    const fade = 1 - this.bottomFade * 0.8
    const alpha = this.opacity * twinkle * fade
    if (alpha < 0.015) return
    const glowGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5)
    glowGrad.addColorStop(0, `hsla(${this.colorHue}, ${this.saturation}%, ${this.lightness}%, ${alpha})`)
    glowGrad.addColorStop(1, `hsla(${this.colorHue}, ${this.saturation}%, ${this.lightness}%, 0)`)
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2)
    ctx.fillStyle = glowGrad
    ctx.fill()
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size * 0.45, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${this.colorHue}, 20%, 93%, ${alpha * 0.9})`
    ctx.fill()
  }
}

// ==================== 流星类 (保持不变) ====================
class ShootingStar {
  constructor(w, h) {
    this.init(w, h)
  }
  init(w, h) {
    const side = Math.random()
    if (side < 0.5) {
      this.headX = Math.random() * w * 0.6
      this.headY = Math.random() * h * 0.25
      this.angle = (Math.PI / 5) + Math.random() * (Math.PI / 5)
    } else if (side < 0.8) {
      this.headX = w * 0.4 + Math.random() * w * 0.6
      this.headY = Math.random() * h * 0.2
      this.angle = Math.PI - (Math.PI / 5) - Math.random() * (Math.PI / 5)
    } else {
      this.headX = -30 - Math.random() * 60
      this.headY = Math.random() * h * 0.5
      this.angle = (Math.random() - 0.5) * 0.6
    }
    this.speed = 6 + Math.random() * 10
    this.speedX = Math.cos(this.angle) * this.speed
    this.speedY = Math.sin(this.angle) * this.speed
    this.tailLength = 60 + Math.random() * 140
    this.tailX = this.headX - Math.cos(this.angle) * this.tailLength
    this.tailY = this.headY - Math.sin(this.angle) * this.tailLength
    this.life = 1.0
    this.decay = 0.008 + Math.random() * 0.018
    this.headSize = 1.5 + Math.random() * 2.5
  }
  update(w, h) {
    this.headX += this.speedX
    this.headY += this.speedY
    this.tailX = this.headX - Math.cos(this.angle) * this.tailLength
    this.tailY = this.headY - Math.sin(this.angle) * this.tailLength
    this.life -= this.decay
    return this.life <= 0 ||
           this.headX > w + 40 || this.headX < -40 ||
           this.headY > h + 40 || this.headY < -40
  }
  draw(ctx) {
    const alpha = this.life
    if (alpha < 0.02) return
    const grad = ctx.createLinearGradient(this.headX, this.headY, this.tailX, this.tailY)
    grad.addColorStop(0, `rgba(255, 255, 250, ${alpha})`)
    grad.addColorStop(0.06, `rgba(255, 240, 210, ${alpha * 0.9})`)
    grad.addColorStop(0.3, `rgba(255, 200, 140, ${alpha * 0.55})`)
    grad.addColorStop(0.7, `rgba(255, 160, 100, ${alpha * 0.12})`)
    grad.addColorStop(1, `rgba(255, 140, 80, 0)`)
    ctx.beginPath()
    ctx.moveTo(this.headX, this.headY)
    ctx.lineTo(this.tailX, this.tailY)
    ctx.strokeStyle = grad
    ctx.lineWidth = 1.2 + this.headSize * 0.5
    ctx.lineCap = 'round'
    ctx.stroke()
    const headGlow = ctx.createRadialGradient(this.headX, this.headY, 0, this.headX, this.headY, this.headSize * 4)
    headGlow.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
    headGlow.addColorStop(0.3, `rgba(255, 240, 220, ${alpha * 0.6})`)
    headGlow.addColorStop(1, `rgba(255, 200, 150, 0)`)
    ctx.beginPath()
    ctx.arc(this.headX, this.headY, this.headSize * 4, 0, Math.PI * 2)
    ctx.fillStyle = headGlow
    ctx.fill()
  }
}

// ==================== 绘制地球 (您提供的写实风格) ====================
function drawEarth(ctx, x, y, r) {
  // 大气光
  const aGrad = ctx.createRadialGradient(x, y, r*0.85, x, y, r*1.3);
  aGrad.addColorStop(0, 'rgba(80, 160, 255, 0.3)');
  aGrad.addColorStop(1, 'rgba(20, 60, 150, 0)');
  ctx.beginPath();
  ctx.arc(x, y, r*1.3, 0, Math.PI*2);
  ctx.fillStyle = aGrad;
  ctx.fill();

  // 海洋渐变
  const sea = ctx.createRadialGradient(x - r*0.2, y - r*0.2, r*0.1, x, y, r);
  sea.addColorStop(0, '#3b9fd4');
  sea.addColorStop(0.7, '#1a5a8a');
  sea.addColorStop(1, '#0b2b44');
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.fillStyle = sea;
  ctx.fill();

  // 剪裁后画大陆
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.clip();

  ctx.fillStyle = '#5a9e4b';
  ctx.beginPath();
  ctx.ellipse(x - r*0.45, y - r*0.35, r*0.55, r*0.35, 0.2, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(x + r*0.35, y + r*0.1, r*0.4, r*0.5, -0.3, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#7ab648';
  ctx.beginPath();
  ctx.ellipse(x + r*0.15, y - r*0.55, r*0.3, r*0.45, 0.4, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#8dc63f';
  ctx.beginPath();
  ctx.ellipse(x - r*0.1, y + r*0.45, r*0.4, r*0.3, -0.35, 0, Math.PI*2);
  ctx.fill();

  // 云
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.beginPath();
  ctx.ellipse(x - r*0.3, y - r*0.15, r*0.5, r*0.15, 0.1, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.beginPath();
  ctx.ellipse(x + r*0.2, y + r*0.3, r*0.4, r*0.12, -0.15, 0, Math.PI*2);
  ctx.fill();

  ctx.restore();

  // 高光
  const hl = ctx.createRadialGradient(x - r*0.3, y - r*0.35, 0, x, y, r);
  hl.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  hl.addColorStop(0.5, 'rgba(255, 255, 255, 0.03)');
  hl.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.fillStyle = hl;
  ctx.fill();
}

// ==================== 初始化粒子 ====================
function initAllParticles() {
  fallingStars = []
  starDusts = []
  shootingStars = []
  orbitingStars = []
  for (let i = 0; i < FALLING_STAR_COUNT; i++) {
    fallingStars.push(new FallingStar(canvasWidth.value, canvasHeight.value))
  }
  for (let i = 0; i < STAR_DUST_COUNT; i++) {
    starDusts.push(new StarDust(canvasWidth.value, canvasHeight.value))
  }
  lastShootingStarTime = performance.now()
  nextShootingStarInterval = 1800 + Math.random() * 4000
}

// ==================== 底部光雾 ====================
function drawBottomGlow(ctx, w, h) {
  const glowHeight = Math.min(140, h * 0.18)
  const grad = ctx.createLinearGradient(0, h - glowHeight, 0, h)
  grad.addColorStop(0, 'rgba(255, 170, 80, 0)')
  grad.addColorStop(0.4, 'rgba(255, 150, 60, 0.03)')
  grad.addColorStop(0.75, 'rgba(255, 130, 40, 0.07)')
  grad.addColorStop(1, 'rgba(255, 100, 30, 0.12)')
  ctx.fillStyle = grad
  ctx.fillRect(0, h - glowHeight, w, glowHeight)
}

// ==================== 动画循环 ====================
function animate(timestamp) {
  if (!ctx) return
  const w = canvasWidth.value
  const h = canvasHeight.value
  const e = earth.value
  ctx.clearRect(0, 0, w, h)

  drawBottomGlow(ctx, w, h)

  // 星尘
  for (const d of starDusts) {
    d.update(w, h)
    d.draw(ctx)
  }

  // 绘制地球
  drawEarth(ctx, e.x, e.y, e.radius)

  // 坠落星星：检测捕获 + 绘制
  for (let i = fallingStars.length - 1; i >= 0; i--) {
    const star = fallingStars[i]
    star.update(w, h)

    const dx = star.x - e.x
    const dy = star.y - e.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < e.captureRadius && orbitingStars.length < 200) {
      const orbitStar = {
        orbitRadius: Math.max(e.radius * 1.3, dist),
        angle: Math.atan2(dy, dx),
        angularSpeed: (0.008 + Math.random() * 0.015) * (e.radius / Math.max(e.radius, dist)),
        size: star.size,
        innerRatio: star.innerRatio,
        opacity: star.opacity,
        colorHue: star.colorHue,
        saturation: star.saturation,
        lightness: star.lightness,
        twinklePhase: star.twinklePhase,
        twinkleSpeed: star.twinkleSpeed,
        rotation: star.rotation,
        rotationSpeed: star.rotationSpeed,
        orbitDecay: 0.9995 + Math.random() * 0.0004,
        spawnTime: performance.now()      // ★ 新增：记录捕获时间
      }
      orbitingStars.push(orbitStar)
      fallingStars.splice(i, 1)
    } else {
      star.draw(ctx)
    }
  }

  // 绕转星星更新与绘制 (加入10秒生命周期)
  const now = performance.now()
  for (let i = orbitingStars.length - 1; i >= 0; i--) {
    const os = orbitingStars[i]

    // ★ 生命周期检查：超过10秒移除
    if (now - os.spawnTime > 10000) {
      orbitingStars.splice(i, 1)
      continue
    }

    os.angle += os.angularSpeed
    os.orbitRadius *= os.orbitDecay
    os.twinklePhase += os.twinkleSpeed

    const starX = e.x + Math.cos(os.angle) * os.orbitRadius
    const starY = e.y + Math.sin(os.angle) * os.orbitRadius

    // 过于靠近地球也移除
    if (os.orbitRadius < e.radius + 5) {
      orbitingStars.splice(i, 1)
      continue
    }

    const twinkleAlpha = 0.55 + 0.45 * Math.sin(os.twinklePhase)
    const alpha = os.opacity * twinkleAlpha
    if (alpha < 0.02) continue

    const hue = os.colorHue
    const sat = os.saturation
    const light = os.lightness
    const size = os.size

    const glowGrad = ctx.createRadialGradient(starX, starY, size * 0.3, starX, starY, size * 2.8)
    glowGrad.addColorStop(0, `hsla(${hue}, ${sat}%, ${light}%, ${alpha * 0.5})`)
    glowGrad.addColorStop(1, `hsla(${hue}, ${sat}%, ${light}%, 0)`)
    ctx.beginPath()
    ctx.arc(starX, starY, size * 2.8, 0, Math.PI * 2)
    ctx.fillStyle = glowGrad
    ctx.fill()

    const innerR = size * os.innerRatio
    const spikes = 5
    const step = Math.PI / spikes
    ctx.beginPath()
    for (let j = 0; j < spikes * 2; j++) {
      const radius = j % 2 === 0 ? size : innerR
      const angle = j * step + os.rotation - Math.PI / 2
      const x = starX + Math.cos(angle) * radius
      const y = starY + Math.sin(angle) * radius
      if (j === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fillStyle = `hsla(${hue}, ${sat}%, ${Math.min(100, light + 8)}%, ${alpha})`
    ctx.fill()
    ctx.strokeStyle = `hsla(${hue}, ${sat}%, ${Math.min(100, light + 15)}%, ${alpha * 0.7})`
    ctx.lineWidth = 0.4 + size * 0.08
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(starX, starY, size * 0.22, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${hue}, 30%, 96%, ${alpha * 0.75})`
    ctx.fill()
  }

  // 流星
  if (timestamp - lastShootingStarTime > nextShootingStarInterval) {
    shootingStars.push(new ShootingStar(w, h))
    lastShootingStarTime = timestamp
    nextShootingStarInterval = 1800 + Math.random() * 4500
  }

  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const ss = shootingStars[i]
    const shouldRemove = ss.update(w, h)
    if (shouldRemove) {
      shootingStars.splice(i, 1)
    } else {
      ss.draw(ctx)
    }
  }

  animationId = requestAnimationFrame(animate)
}

// ==================== 拖动事件处理 ====================
function getCanvasPos(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  const clientY = e.touches ? e.touches[0].clientY : e.clientY
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  }
}

function onPointerDown(e) {
  const pos = getCanvasPos(e)
  const dx = pos.x - earth.value.x
  const dy = pos.y - earth.value.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist <= earth.value.radius) {
    // 点中地球，开始拖动
    isDragging.value = true
    hasMoved.value = false
    dragStartEarth.value = { x: earth.value.x, y: earth.value.y }
    dragStartPointer.value = { x: pos.x, y: pos.y }
    e.preventDefault()
    e.stopPropagation()
  }
}

function onPointerMove(e) {
  if (!isDragging.value) return
  e.preventDefault()
  const pos = getCanvasPos(e)
  const dx = pos.x - dragStartPointer.value.x
  const dy = pos.y - dragStartPointer.value.y
  earth.value.x = dragStartEarth.value.x + dx
  earth.value.y = dragStartEarth.value.y + dy
  if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
    hasMoved.value = true
  }
}

function onPointerUp(e) {
  if (!isDragging.value) return
  e.preventDefault()
  e.stopPropagation()
  isDragging.value = false
  // 如果没有实际移动，视为轻点地球 → 进入网站
  if (!hasMoved.value) {
    enterSite()
  }
}

// ==================== 调整画布大小 ====================
function resizeCanvas() {
  if (!canvasRef.value || !screenRef.value) return
  const rect = screenRef.value.getBoundingClientRect()
  canvasWidth.value = rect.width
  canvasHeight.value = rect.height
  canvasRef.value.width = canvasWidth.value
  canvasRef.value.height = canvasHeight.value

  // 地球初始位置 (可在此调整垂直位置，数值越小越靠上)
  earth.value.x = canvasWidth.value / 2
  earth.value.y = canvasHeight.value * 0.55    // 0.55 表示画布55%高度处
  earth.value.radius = Math.min(110, Math.max(70, canvasHeight.value * 0.12))
  earth.value.captureRadius = earth.value.radius * 2.2

  initAllParticles()
}

// ==================== 进入网站 ====================
function enterSite() {
  clearInterval(timer)
  if (animationId) cancelAnimationFrame(animationId)
  emit('enter')
}

// ==================== 生命周期 ====================
onMounted(async () => {
  await nextTick()
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')

    // 绑定拖动事件
    const canvas = canvasRef.value
    canvas.addEventListener('mousedown', onPointerDown)
    canvas.addEventListener('touchstart', onPointerDown, { passive: false })
    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('touchmove', onPointerMove, { passive: false })
    window.addEventListener('mouseup', onPointerUp)
    window.addEventListener('touchend', onPointerUp)
    window.addEventListener('touchcancel', onPointerUp)

    resizeCanvas()
    animationId = requestAnimationFrame(animate)
    window.addEventListener('resize', resizeCanvas)
  }

  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) enterSite()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resizeCanvas)

  if (canvasRef.value) {
    const canvas = canvasRef.value
    canvas.removeEventListener('mousedown', onPointerDown)
    canvas.removeEventListener('touchstart', onPointerDown)
    window.removeEventListener('mousemove', onPointerMove)
    window.removeEventListener('touchmove', onPointerMove)
    window.removeEventListener('mouseup', onPointerUp)
    window.removeEventListener('touchend', onPointerUp)
    window.removeEventListener('touchcancel', onPointerUp)
  }
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

/* ===== Canvas 画布 ===== */
.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
}

/* ===== 内容覆盖层 ===== */
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
  pointer-events: none;
}

.content-overlay > * {
  pointer-events: auto;
}

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