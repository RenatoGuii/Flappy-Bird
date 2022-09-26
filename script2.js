function newElement (tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

/*
    reverse = top pipe
    no reverse = bottom pipe
*/

function barrier (reverse = false) {
    this.element = newElement('div', 'barrier')
    
    const body = newElement('div', 'body')
    const border = newElement('div', 'border')

    this.element.appendChild(reverse ? body : border)
    this.element.appendChild(reverse ? border : body)

    this.setHeight = height => body.style.height = `${height}px`
}

/*  const b = new barrier(true)
    b.setHeight(150)
    document.querySelector('#mainContainer').appendChild(b.element)
*/

function barries(height, opening, x) {
    this.element = newElement('div', 'barries')

    this.top = new barrier(true)
    this.bottom = new barrier(false)

    this.element.appendChild(this.top.element)
    this.element.appendChild(this.bottom.element)

    this.raffle = () => {
        const topHeight = Math.random() * (height - opening)
        const bottomHeight = height - opening - topHeight
        this.top.setHeight(topHeight)
        this.bottom.setHeight(bottomHeight)
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth

    this.raffle()
    this.setX(x)
}

const b = new barries(700, 200, 800)
document.querySelector('#mainContainer').appendChild(b.element)