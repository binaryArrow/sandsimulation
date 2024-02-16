const canvas = document.getElementById('board') as HTMLCanvasElement
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
const gramCount = document.getElementById('gramCount') as HTMLDivElement
gramCount.style.color = 'white'

const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
const data = imageData.data
const particles: { index: number } [] = []

function updateParticles() {
    createBoundaries()
    particles.forEach(particle => {
        particle.index = updateParticlePositionY(particle.index)
    })
    ctx.putImageData(imageData, 0, 0)
    requestAnimationFrame(() => updateParticles())
    gramCount.textContent = `Gramm: ${(particles.length / 500).toFixed(2)}`
}

function checkBottom(particleIndex: number): boolean {
    return data[((canvas.width * 4)) + particleIndex] == 255 || particleIndex > canvas.width * canvas.height * 4 - (canvas.width * 4);
}

function checkBottomLeftOrRight(particleIndex: number): number {
    // check bottom left is empty if so return true
    if (particleIndex < canvas.width * canvas.height * 4 - (canvas.width * 4) && data[((canvas.width * 4)) + particleIndex - 4] != 255) {
        return -1
    }
    // check bottom right
    else if (particleIndex < canvas.width * canvas.height * 4 - (canvas.width * 4) && data[((canvas.width * 4)) + particleIndex + 4] != 255) {
        return 1
    }
    return 0
}

createBoundaries()

function createBoundaries() {
    for (let y = 0; y < imageData.height; y++) {
        const index = (y * imageData.width) * 4
        data[index] = 255
        data[index + 1] = 255
        data[index + 2] = 255
        data[index + 3] = 255
    }
    for (let y = 0; y < imageData.height; y++) {
        const index = (y * imageData.width + (imageData.width - 1)) * 4
        data[index] = 255
        data[index + 1] = 255
        data[index + 2] = 255
        data[index + 3] = 255
    }
}

function updateParticlePositionY(particleIndex: number): number {
    if (!checkBottom(particleIndex)) {
        removeOldPixel(particleIndex)

        data[((canvas.width * 4)) + particleIndex] = 255
        data[((canvas.width * 4) + 1) + particleIndex] = 255
        data[((canvas.width * 4) + 2) + particleIndex] = 255
        data[((canvas.width * 4) + 3) + particleIndex] = 255

        return ((canvas.width * 4)) + particleIndex
    } else if (checkBottomLeftOrRight(particleIndex) == -1) {
        removeOldPixel(particleIndex)
        // draw bottom left pixel
        data[((canvas.width * 4)) + particleIndex - 4] = 255
        data[((canvas.width * 4) + 1) + particleIndex - 4] = 255
        data[((canvas.width * 4) + 2) + particleIndex - 4] = 255
        data[((canvas.width * 4) + 3) + particleIndex - 4] = 255
        return ((canvas.width * 4)) + particleIndex - 4
    } else if (checkBottomLeftOrRight(particleIndex) == 1) {
        removeOldPixel(particleIndex)
        data[((canvas.width * 4)) + particleIndex + 4] = 255
        data[((canvas.width * 4) + 1) + particleIndex + 4] = 255
        data[((canvas.width * 4) + 2) + particleIndex + 4] = 255
        data[((canvas.width * 4) + 3) + particleIndex + 4] = 255
        return ((canvas.width * 4)) + particleIndex + 4
    } else {
        data[particleIndex] = 255
        data[particleIndex + 1] = 255
        data[particleIndex + 2] = 255
        data[particleIndex + 3] = 255
        return particleIndex
    }
}

function drawPixelToCanvas(event: MouseEvent) {
    const bounding = canvas.getBoundingClientRect()
    const x = Math.floor((event.clientX - bounding.left) / bounding.width * canvas.width)
    const y = Math.floor((event.clientY - bounding.top) / bounding.height * canvas.height)

    let index = (x + y * imageData.width) * 4
    if (data[index] != 255) {
        particles.push({index})
        data[index] = 255
        data[index + 1] = 255
        data[index + 2] = 255
        data[index + 3] = 255
        ctx.putImageData(imageData, 0, 0)
    }

}

canvas.addEventListener("mousemove", (event) => {
    drawPixelToCanvas(event)
})

canvas.addEventListener("click", (event) => {
    drawPixelToCanvas(event)
})

requestAnimationFrame(() => updateParticles())


function removeOldPixel(particleIndex: number) {
    data[particleIndex] = 114
    data[particleIndex + 1] = 112
    data[particleIndex + 2] = 112
    data[particleIndex + 3] = 255
}