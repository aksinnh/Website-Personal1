const canvas = document.getElementById('canvas')
const svg = document.getElementById('connectionLayer')
const stats = document.getElementById('stats')

const devices = []
const connections = []

let selectedDevice = null
let dragged = null
let offsetX = 0
let offsetY = 0

const deviceData = {
  pc: { icon: '💻', name: 'PC Client' },
  switch: { icon: '🖧', name: 'Switch' },
  router: { icon: '📡', name: 'Router' },
  server: { icon: '🌐', name: 'Server' },
  printer: { icon: '🖨️', name: 'Printer' },
}

function updateStats() {
  stats.textContent = `${devices.length} Device • ${connections.length} Connection`
}

function drawConnections() {
  svg.innerHTML = ''

    connections.forEach((conn) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')

    line.setAttribute('x1', conn.from.x + 55)
    line.setAttribute('y1', conn.from.y + 55)
    line.setAttribute('x2', conn.to.x + 55)
    line.setAttribute('y2', conn.to.y + 55)
    line.setAttribute('stroke', '#38bdf8')
    line.setAttribute('stroke-width', '4')
    line.setAttribute('stroke-dasharray', '10 8')

    svg.appendChild(line)

    const packet = document.createElementNS('http://www.w3.org/2000/svg', 'circle')

    packet.setAttribute('r', '6')
    packet.setAttribute('class', 'packet')

    const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion')

    animate.setAttribute('dur', '2s')
    animate.setAttribute('repeatCount', 'indefinite')
    animate.setAttribute(
      'path',
      `M ${conn.from.x + 55} ${conn.from.y + 55} L ${conn.to.x + 55} ${conn.to.y + 55}`,
    )

        packet.appendChild(animate)
    svg.appendChild(packet)
  })
}

function createDevice(type) {
  const data = deviceData[type]

  const el = document.createElement('div')
  el.className = 'device'
  el.innerHTML = `
    <div class="icon">${data.icon}</div>
    <div class="label">${data.name}</div>
  `

  const device = {
    el,
    type,
    x: 150 + Math.random() * 400,
    y: 100 + Math.random() * 300,
  }

  el.style.left = device.x + 'px'
  el.style.top = device.y + 'px'

  canvas.appendChild(el)
  devices.push(device)

  updateStats()

    el.addEventListener('mousedown', (e) => {
    dragged = device
    offsetX = e.offsetX
    offsetY = e.offsetY
  })

  el.addEventListener('click', () => {
    if (!selectedDevice) {
      selectedDevice = device
      el.classList.add('selected')
      return
    }

    if (selectedDevice === device) {
      selectedDevice.el.classList.remove('selected')
      selectedDevice = null
      return
    }

    connections.push({
      from: selectedDevice,
      to: device,
    })

    selectedDevice.el.classList.remove('selected')
    selectedDevice = null

        drawConnections()
    updateStats()
  })
}

window.addEventListener('mousemove', (e) => {
  if (!dragged) return

  dragged.x = e.clientX - 300 - offsetX
  dragged.y = e.clientY - offsetY

  dragged.el.style.left = dragged.x + 'px'
  dragged.el.style.top = dragged.y + 'px'

  drawConnections()
})

window.addEventListener('mouseup', () => {
  dragged = null
})

document.querySelectorAll('.device-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    createDevice(btn.dataset.type)
  })
})

document.getElementById('resetBtn').addEventListener('click', () => {
  devices.forEach((d) => {
    d.el.remove()
  })

  devices.length = 0;
  connections.length = 0;

  svg.innerHTML = '';

  selectedDevice = null;

  updateStats();
});