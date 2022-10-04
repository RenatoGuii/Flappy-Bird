function novoElemento (tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function criarBarreira (reverse = false) {
    this.elemento = novoElemento('div', 'barrier')
    
    const corpo = novoElemento('div', 'body')
    const borda = novoElemento('div', 'border')
    this.elemento.appendChild(reverse ? corpo : borda)
    this.elemento.appendChild(reverse ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

function parBarreiras(alturaJogo, abertura, x) {
    this.elemento = novoElemento('div', 'barries')

    this.superior = new criarBarreira(true)
    this.inferior = new criarBarreira(false)
    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (alturaJogo - abertura)
        const alturaInferior = alturaJogo - abertura - alturaSuperior

        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split("px")[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)
}


function cicloBarreiras (alturaJogo, larguraJogo, abertura,  espaco, notificarPonto) {
    this.pares = [
        new parBarreiras (alturaJogo, abertura, larguraJogo),
        new parBarreiras (alturaJogo, abertura, larguraJogo + espaco),
        new parBarreiras (alturaJogo, abertura, larguraJogo + espaco * 2),
        new parBarreiras (alturaJogo, abertura, larguraJogo + espaco * 3)
    ]

    const deslocamento = 4
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }
        
            const meio = larguraJogo / 2
            const cruzouMeio = par.getX() + deslocamento >= meio 
                && par.getX() < meio
            if (cruzouMeio) notificarPonto()
        })
    }
}

function Passaro(alturaJogo) {
    let voando = false

    this.elemento = novoElemento('img', 'bird')
    this.elemento.src = 'imgs/passaro.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onmousedown = e => voando = true
    window.onmouseup = e => voando = false
    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar = () => {
        const novoY = this.getY() + (voando ? 7 : -4)
        const alturaMaxima = alturaJogo - this.elemento.clientHeight

        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }

    this.setY(alturaJogo / 2)    
}

function Progresso () {
    this.elemento = novoElemento('h2', 'progress')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}


function sobrepostos(elemA, elemB) {
    const a = elemA.getBoundingClientRect()
    const b = elemB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top
    return horizontal && vertical
}

function colidiu(passaro, barreiras) {
    let colidiu = false
    barreiras.pares.forEach(parBarreiras => {
        if (!colidiu) {
            const superior = parBarreiras.superior.elemento
            const inferior = parBarreiras.inferior.elemento
            colidiu = sobrepostos(passaro.elemento, superior) || sobrepostos(passaro.elemento, inferior)
        }
    })
    return colidiu
}


function flappyBird () {
    let pontos = 0

    const areaDoJogo = document.querySelector('#mainContainer')
    const alturaJogo = areaDoJogo.clientHeight
    const larguraJogo = areaDoJogo.clientWidth

    const progresso = new Progresso()
    const barreiras = new cicloBarreiras(alturaJogo, larguraJogo, 170, 320, () => progresso.atualizarPontos(++pontos))
    const passaro = new Passaro(alturaJogo)

    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    this.start = () => {
        const temporizador = setInterval(() => {
            barreiras.animar()
            passaro.animar()

            if (colidiu(passaro, barreiras)) {
                const aviso = document.querySelector('.avisoRefresh')
                aviso.innerHTML = `Sua pontuação foi de ${pontos} ponto(s) <br> Reinicie a página para jogar novamente!`
                clearInterval(temporizador)
            }

        }, 20)
    }
}

new flappyBird().start()

