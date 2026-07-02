//- UTMs
checkUTMs()

var mensagemErro = document.getElementById('erroComparar2')

document.getElementById("destino").addEventListener("change", (e) => {
    if(mensagemErro) {
        fadeOut(mensagemErro)
    }
})
document.getElementById("filtrodataIda").addEventListener("focusout", (e) => {
    if(mensagemErro) {
        fadeOut(mensagemErro)
    }
})
document.getElementById("filtrodataIda").addEventListener("keydown", (e) => {
    mascara(e.target,data_check)
})
document.getElementById("filtrodataVolta").addEventListener("focusout", (e) => {
    if(mensagemErro) {
        fadeOut(mensagemErro)
    }
})
document.getElementById("filtrodataVolta").addEventListener("keydown", (e) => {
    mascara(e.target,data_check)
})
document.getElementById("nome").addEventListener("change", (e) => {
    if(e.target.value != '') {
        fadeOut(mensagemErro)
    }
    mascara(e.target,nome_check)
})
document.getElementById("nome").addEventListener("keydown", (e) => {
    mascara(e.target,nome_check)
})
document.getElementById("email").addEventListener("change", (e) => {
    if(e.target.value != '') {
        fadeOut(mensagemErro)
    }
})
if(document.getElementById("pais")) {
    document.getElementById("pais").addEventListener("change", (e) => {
        document.getElementById("phone").value = ''
    })
}
if(document.getElementById("phone")) {
    document.getElementById("phone").addEventListener("change", (e) => {
        if (document.querySelector("#pais").value == '55') {
            mascara(e.target,telefone_check)
        } else {
            mascara(e.target,phone_check)
        }
    })
    document.getElementById("phone").addEventListener("keyup", (e) => {
        if (document.querySelector("#pais").value == '55') {
            mascara(e.target,telefone_check)
        } else {
            mascara(e.target,phone_check)
        }
    })
}
if(document.querySelector(".button")) {
    document.querySelector('.button').addEventListener('click', function(e){
        e.preventDefault()
        var show_erro = false
        var destino = document.getElementById('destino')
        var dataIda = document.getElementById('filtrodataIda')
        var dataVolta = document.getElementById('filtrodataVolta')
        var dataIda_en = (dataIda && dataIda.value && dataIda.value.length > 0) ? convertToISO(dataIda.value) : null;
        var dataVolta_en = (dataVolta && dataVolta.value && dataVolta.value.length > 0) ? convertToISO(dataVolta.value) : null;
        var nome = document.getElementById('nome')
        var email = document.getElementById('email').value.trim().toLowerCase()
        var email_element = document.getElementById('email')
        var code = document.getElementById('pais').value
        var telefone = document.getElementById('phone').value.replace('(', '').replace(')', '').replace('-', '').replace(' ', '') ?? ''
        var telefone_element = document.getElementById('phone')

        destino.style.border = 'none'
        dataIda.style.border = 'none'
        dataVolta.style.border = 'none'
        nome.style.border = 'none'
        email_element.style.border = 'none'
        telefone_element.style.border = 'none'

        if(destino.value == 'no'){  
            destino.style.borderColor = 'red'
            mensagemErro.innerHTML = 'Selecione um Destino.'
            show_erro = true
        } else if(!dataIda_en) {
            dataIda.style.border = '1px solid red'
            mensagemErro.innerHTML = 'Selecione uma data de partida.'
            show_erro = true
        } else if(!dataVolta_en) {
            dataVolta.style.border = '1px solid red'
            mensagemErro.innerHTML = 'Selecione uma data de retorno.'
            show_erro = true
        } else if(dataIda_en == dataVolta_en) {
            mensagemErro.innerHTML = 'A data de partida é igual a data de retorno.'
            show_erro = true
        } else if(dataIda_en > dataVolta_en) {
            mensagemErro.innerHTML = 'A data de retorno é anterior a data de partida.'
            show_erro = true
        } else if(!nome.value) {
            nome.style.borderColor = 'red'
            mensagemErro.innerHTML = 'Digite seu nome.'
            show_erro = true
        } else if(!validaEmail(email)) {
            email = ''
            email_element.style.borderColor = 'red'
            mensagemErro.innerHTML = 'Digite um email válido.'
            show_erro = true
        } else if(telefone.length > 0) {
            var msgPhone = validaPhone(telefone)
            if(msgPhone != '') {
                mensagemErro.innerHTML = msgPhone
                show_erro = true
            }
        } else {
            telefone_element.style.borderColor = 'red'
            mensagemErro.innerHTML = 'Digite um número de telefone'
            show_erro = true
        }

        if(destino.value !== 'no' && dataIda.value !== '' && dataVolta.value !== '' && nome.value !== '' && email !== '' && telefone !== '' && msgPhone == '') {
            var query = '/?destino=' + destino.value + '&dataIda=' + dataIda.value + '&dataVolta=' + dataVolta.value + '&email=' + encodeURIComponent(email) + '&telefone=' + code + telefone + '&nome=' + nome.value.trim()

            // abre o fundo e o loading
            document.getElementById("backg").style.display = 'block'
            document.getElementById("preloaderSeguros").style.display = 'block'
            
            // Cria o datalayer do botão buscar
            window.dataLayer = window.dataLayer || []
            dataLayer.push({
                'event': 'clickPesquisar',
                'location': 'home',
                'transactionAffiliation': 'Comparar Seguros de Viagem',
                'Destination': destino.value,
                'dataIda': dataIda.value,
                'dataVolta': dataVolta.value,
                'Customer_Name': nome.value.trim(),
                'Telephone': code + ' ' + telefone,
                'Email': email
            })

            // UTMs
            let utm_array = JSON.parse(localStorage.getItem('utms')) || []
            let utms_url = ''
            const atendente = document.getElementById('atendente');

            if (utm_array.length > 0) {

                if(utm_array[0].utm_medium == '' && atendente) {
                    utm_array[0].utm_medium = atendente.value

                    if(utm_array[0].utm_source == '') {
                        utm_array[0].utm_source = 'WhatsApp';
                    }
                }
                
            } else {
                if(atendente) {
                    utm_array[0].utm_medium = atendente.value;
                    utm_array[0].utm_source = 'WhatsApp';
                }
            }

            utms_url = '&' + mountURL_UTM(utm_array);

            var utm_nemu = window.trackingNemu?.nemuUtms?.toString() ||
						getCookieNemu("nemuUtmsTrack") ||
						localStorage.getItem("nemu:utmsTrack");
            
            var utms_nemu = '&' + mountURL_UTM_Nemu(utm_nemu);

            window.open(window.location.origin + query + window.location.search.replace('?', '&') + "&l=seguros" + utms_url + utms_nemu, "_self")
        }

        if(show_erro){
            // Registra o erro no banco de dados
            async function enviarErro() {
                try {
                    var dadosErro = {
                        destino: destino.value,
                        dataIda: dataIda_en,
                        dataVolta: dataVolta_en,
                        nome: nome.value.trim(),
                        email: email,
                        phone: code + telefone,
                        msgErro: document.getElementById('erroComparar2').textContent,
                        hostname: window.location.hostname,
                        userAgent: navigator.userAgent,
                        plataforma: navigator.platform,
                        dataLead: new Date()
                    }

                    const resposta = await fetch('/lead-log-erro', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dadosErro)
                    })

                    if (!resposta.ok) {
                        console.error('Erro ao registrar o log de erro.');
                    }

                    const data = await resposta.json();
                    console.log('Servidor respondeu:', data);

                } catch (error) {
                    console.error('Erro ao registrar o log de erro:', error);
                }
            }

            email = document.getElementById('email').value.trim().toLowerCase()
            if(email != '' && email != undefined && email != null && dataIda_en != 'undefined-undefined-' && dataVolta_en != 'undefined-undefined-') {
                enviarErro()
            }
            
            fadeIn(mensagemErro)
        }
        else
        {
            fadeOut(mensagemErro)
        }  
    })
}

document.cookie = "avisoPassageiroEmViagem=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
const img = document.createElement("img")
if (typeof lp_tipo_palavra !== "undefined" && lp_tipo_palavra) {
    switch(lp_tipo_palavra) {
        case 'Black November':
            if (isMobile) {
                img.src = "/images/landingpage/black-november-mobile-2024.png"
            } else {
                img.src = "/images/landingpage/black-november-2024.png"
            }
            img.alt = 'Black November 2024 Comparar Seguro de Viagem'
        break
        case 'todos':
            if (isMobile) {
                img.src = "/images/landingpage/foto-todos-mobile.png"
            } else {
                img.src = "/images/landingpage/foto-todos.png"
            }
            img.alt = 'Melhor seguro para todos Comparar Seguro de Viagem'
            document.getElementById('ParaTodos').classList.remove('hide')
        break
        case 'intercâmbio':
            if (isMobile) {
                img.src = "/images/landingpage/intercambio-mobile.png"
            } else {
                img.src = "/images/landingpage/intercambio.png"
            }
            img.alt = 'Melhor seguro para intercâmbio Comparar Seguro de Viagem'
        break
        case 'América do Norte':
            if (isMobile) {
                img.src = "/images/landingpage/foto-america-do-norte-mobile.png"
            } else {
                img.src = "/images/landingpage/foto-america-do-norte.png"
                img.style = "width:80%;"
            }
            img.alt = 'Seguro viagem para América do Norte Comparar Seguro de Viagem'
        break
        case 'América do Sul':
            if (isMobile) {
                img.src = "/images/landingpage/foto-america-do-sul-mobile.png"
            } else {
                img.src = "/images/landingpage/foto-america-do-sul.png"
                img.style = "width:75%;"
            }
            img.alt = 'Seguro viagem para América do Sul Comparar Seguro de Viagem'
        break
        case 'esportes':
            if (isMobile) {
                img.src = "/images/landingpage/foto-esportes-mobile.png"
            } else {
                img.src = "/images/landingpage/foto-esportes.png"
            }
            img.alt = 'Seguro viagem para Esportes Comparar Seguro de Viagem'
        break
        case 'esqui':
            if (isMobile) {
                img.src = "/images/landingpage/foto-esqui-mobile.png"
            } else {
                img.src = "/images/landingpage/foto-esqui.png"
                img.style = "width:80%;"
            }
            img.alt = 'Seguro viagem para Esqui Comparar Seguro de Viagem'
        break
        case 'idoso':
            if (isMobile) {
                img.src = "/images/landingpage/foto-idoso-mobile.png"
            } else {
                img.src = "/images/landingpage/foto-idoso.png"
                img.style = "width:80%;"
            }
            img.alt = 'Seguro viagem para Idosos Comparar Seguro de Viagem'
        break
        case 'Estados Unidos':
            if (isMobile) {
                img.src = "/images/landingpage/foto-eua-mobile.png"
            } else {
                img.src = "/images/landingpage/foto-eua.png"
            }
            img.alt = 'Seguro viagem para Estados Unidos Comparar Seguro de Viagem'
        break
        case 'Europa':
            if (isMobile) {
                img.src = "/images/landingpage/foto-europa-mobile.png"
            } else {
                img.src = "/images/landingpage/foto-europa.png"
                img.style = "width:82%;margin-left:5%;"
            }
            img.alt = 'Seguro viagem para Europa Comparar Seguro de Viagem'
        break

        // case 'lp2':
        //     if (isMobile) {
        //         img.src = "/images/selos/selo-viva-viagem.png"
        //     } else {
        //         img.src = "/images/selos/selo-viva-viagem.png"
        //         img.style = "width:60%;float:right;"
        //     }
        //     img.alt = 'Com seguro, você vive a viagem. Sem o seguro, você sobrevive a ela.'
        // break
    }
} else {
    // img.src = "/images/selos/selo-600x600-padrao-2025.png" // padrão 2025
    // img.src = "/images/selos/selo-site-comparar-aniversario-9-anos.png"
    // img.src = "/images/selos/selo-viva-viagem.png"
    // img.alt = 'Seguro viagem: aproveite as férias com segurança.'
    // img.alt = 'O aniversário é nosso, mas quem ganha o presente é você: aproveite até 30% de desconto em todos os nossos planos.'
    img.alt = 'Com seguro, você vive a viagem. Sem o seguro, você sobrevive a ela.'
}

if (isMobile) {
    if(document.getElementById("img_mobile")) {
        document.getElementById("img_mobile").appendChild(img)
    }
} else {
    if(document.getElementById("img_desktop")) {
        document.getElementById("img_desktop").appendChild(img)
    }
}

if (document.getElementById('btnToTop1')) {
    document.getElementById("btnToTop1").addEventListener("click", (e) => {
        scrollToTop()
    })
    document.getElementById("btnToTop2").addEventListener("click", (e) => {
        scrollToTop()
    })
    document.getElementById("btnToTop3").addEventListener("click", (e) => {
        scrollToTop()
    })
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

function validaEmail(email){
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

function mascara(o, f){
    v_obj = o
    v_fun = f
    setTimeout("execmascara()", 1)
}

function execmascara(){
    v_obj.value = v_fun(v_obj.value)
}

function telefone_check(v){
    v=v.replace(/\D/g,"")
    v=v.replace(/^(\d{2})(\d)/g,"($1) $2")
    v=v.replace(/(\d)(\d{4})$/,"$1-$2")
    return v
}

function phone_check(v){
    v=v.replace(/\D/g,"")
    return v
}

function nome_check(v){
    v = v.replace(/[0-9!@#¨$%^&*)(+=._-]+/g, "");
    return v; 
}

function data_check(v) {
    v = v.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/, "$1/$2");
    v = v.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    return v.substring(0, 10);
}

function validaPhone(phone) {
    // Verificar se é um número de celular ou não e fazer a validação
    var msg = ''

    if (document.querySelector("#pais").value == '55') {
        if(phone.length < 10) {
            msg = 'Número de telefone precisa ter 10 dígitos com o DDD!'
        }
        if(phone.charAt(2) == '9' && phone.length > 2 && phone.length < 11) {
            // mobile
            msg = 'Número de celular precisa ter 11 dígitos com o DDD!'
        }
    } else {
        if(phone.length <= 7) {
            msg = 'Número de telefone precisa ter 7 dígitos!'
        }
    }

    return msg
}

function parseDate(str) {
    var mdy = str.split('/');
    return new Date(mdy[2], mdy[1] - 1, mdy[0]);
}
function daydiff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24)) + 1;
}
function fadeOut(el) {
    el.style.opacity = 1;

    function fade() {
        let opacity = parseFloat(el.style.opacity);
        opacity = Math.round((opacity - 0.1) * 10) / 10;

        if (opacity <= 0) {
            el.style.opacity = 0; // Garante que não fique um valor negativo
            el.style.display = "none";
        } else {
            el.style.opacity = opacity;
            requestAnimationFrame(fade);
        }
    }

    requestAnimationFrame(fade);
}

function fadeIn(el, display = "block") {
    el.style.opacity = 0;
    el.style.display = display;

    let opacity = 0;

    setTimeout(() => { // Pequeno delay para garantir que o display seja aplicado
        function fade() {
            opacity = Math.round((opacity + 0.1) * 10) / 10; // Corrige imprecisão do float
            el.style.opacity = opacity;

            if (opacity < 1) {
                requestAnimationFrame(fade);
            } else {
                el.style.opacity = 1; // Garante que termine exatamente em 1
            }
        }

        requestAnimationFrame(fade);
    }, 200);
}

//- window.cookieconsent.initialise({
//-     "name": "comparar_seguro_de_viagem",
//-     "expiryDays": -1,
//-     "secure": true,
//-     "palette": {
//-         "popup": {
//-         "background": "#f5f5f5",
//-         "text": "#000000"
//-         },
//-         "button": {
//-         "background": "#0001ff",
//-         "text": "#ffffff"
//-         }
//-     },
//-     "content": {
//-         "message": "Este site usa cookies para garantir que você obtenha a melhor experiência de navegação. Desativar os cookies do site pode prejudicar a funcionalidade de alguns recursos.",
//-         "dismiss": "Concordar e fechar",
//-         "allow": "Concordar",
//-         "deny": "Não permitir",
//-         "close": "&#x274c;",
//-         "link": "Ler mais",
//-         "href": "https://www.compararsegurodeviagem.com.br/politica-de-privacidade",
//-         "target": "_blank"
//-     }
//- })