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
    this.getLargura = this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)
}

/* const ex = new parBarreiras(697, 480, 550)
document.querySelector("#mainContainer").appendChild(ex.elemento) */

function cicloBarreiras (alturaJogo, larguraJogo, abertura,  espaco, notificarPonto) {
    this.pares = [
        new parBarreiras (alturaJogo, abertura, larguraJogo),
        new parBarreiras (alturaJogo, abertura, larguraJogo + espaco),
        new parBarreiras (alturaJogo, abertura, larguraJogo + espaco * 2),
        new parBarreiras (alturaJogo, abertura, larguraJogo + espaco * 3)
    ]

    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            if (par.getX() < par.getLargura()) {
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

const barreiras = new cicloBarreiras(697, 703, 480, 400)
const areaDoJogo = document.querySelector("#mainContainer")
barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

setInterval(() => {
    barreiras.animar()
}, 20)