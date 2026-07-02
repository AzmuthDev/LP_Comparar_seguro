function checkUTMs()
{
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    var utm_email = urlParams.get('email')
    var utm_campaign = urlParams.get('utm_campaign')
    var utm_content = urlParams.get('utm_content')
    var utm_medium = urlParams.get('utm_medium')
    var utm_source = urlParams.get('utm_source')
    var utm_term = urlParams.get('utm_term')

    let utms = JSON.parse(localStorage.getItem('utms')) || []

    let utm = {
        'utm_email' : utm_email ?? '',
        'utm_campaign' : utm_campaign ?? '',
        'utm_content' : utm_content ?? '',
        'utm_medium' : utm_medium ?? '',
        'utm_source' : utm_source ?? '',
        'utm_term' : utm_term ?? ''
    }

    let t = []

    if( utms.length == 0 ) {
        t.push(utm)
        localStorage.setItem('utms', JSON.stringify(t))
    } else if(utms[0].utm_email != utm_email) {
        utms = []
        t.push(utm)
        localStorage.setItem('utms', JSON.stringify(t))
    }

    // localStorage.setItem('utms', null)
}

function mountURL_UTM(utm_array) {
    if(utm_array.length == 0) {
        return '';
    }

    let utm_campaign = utm_array[0].utm_campaign ?? '';
    let utm_content = utm_array[0].utm_content ?? '';
    let utm_medium = utm_array[0].utm_medium ?? '';
    let utm_source = utm_array[0].utm_source ?? '';
    let utm_term = utm_array[0].utm_term ?? '';

    return 'utm_campaign=' + utm_campaign + '&utm_content=' + utm_content + '&utm_medium=' + utm_medium + '&utm_source=' + utm_source + '&utm_term=' + utm_term;
}

function mountURL_UTM_Nemu(utm_string) {
    if (!utm_string || typeof utm_string !== 'string') {
        return '';
    }

    try {
        const queryString = utm_string.startsWith('?') ? utm_string.slice(1) : utm_string;
        const params = new URLSearchParams(queryString);

        const utmSource = params.get('nemu_source') || params.get('utm_source') || '';
        const utmMedium = params.get('nemu_medium') || params.get('utm_medium') || '';
        const utmTerm = params.get('nemu_term') || params.get('utm_term') || '';
        const utmContent = params.get('nemu_content') || params.get('utm_content') || '';
        const utmCampaignCompleta = params.get('nemu_campaign') || params.get('utm_campaign') || '';
        const utmAdSet = params.get('nemu_adset') || '';

        let idCampanha = utmCampaignCompleta;
        let idAdset = utmAdSet;
        let idContent = utmContent;
        let idTerm = utmTerm;

        if (utmSource.toLowerCase().includes('facebook')) {
            
            const extrairParteUm = (valor) => {
                if (!valor) return '';
                const partes = valor.split('||');
                return partes[0] ? partes[0].trim() : valor.trim();
            };

            const extrairIdFacebook = (valor) => {
                if (!valor) return '';
                const partes = valor.split('||');
                return partes[1] ? partes[1].trim() : partes[0].trim();
            };

            idCampanha = extrairParteUm(utmCampaignCompleta);
            idContent = extrairParteUm(utmContent);
            
            // No Facebook, o utm_term carrega o Adset. 
            // Se o utmAdSet original vier vazio, nós extraímos o ID do utmTerm.
            idAdset = utmAdSet ? extrairIdFacebook(utmAdSet) : extrairIdFacebook(utmTerm);
            idTerm = utmTerm.includes('||') ? '' : utmTerm;
        }
        else if (utmCampaignCompleta) {
            const primeiroUnderlineIndex = utmCampaignCompleta.indexOf('_');
            
            if (primeiroUnderlineIndex !== -1) {
                idCampanha = utmCampaignCompleta.slice(0, primeiroUnderlineIndex);
                idAdset = utmCampaignCompleta.slice(primeiroUnderlineIndex + 1);

                if (idAdset.startsWith('_')) {
                    idAdset = idAdset.replace(/^_+/, '');
                }
            }
        }

        const novosParametros = new URLSearchParams();

        if (utmSource && utmSource !== null && utmSource !== 'null') novosParametros.append('nemu_source', utmSource);
        if (idTerm && idTerm !== null && idTerm !== 'null') novosParametros.append('nemu_term', idTerm);
        if (idContent && idContent !== null && idContent !== 'null') novosParametros.append('nemu_content', idContent);
        if (idCampanha && idCampanha !== null && idCampanha !== 'null') novosParametros.append('nemu_campaign', idCampanha);
        if (idAdset && idAdset !== null && idAdset !== 'null') novosParametros.append('nemu_adset', idAdset);

        return novosParametros.toString();

    } catch (error) {
        console.error("Erro ao processar UTM Nemu:", error);
        return '';
    }
}