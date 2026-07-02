const today_ida = new Date()
const today_volta = new Date()

let inputPartida = document.getElementById('filtrodataIda')
let inputRetorno = document.getElementById('filtrodataVolta')

let dias_ano = 365 // 365 e 366 para anos bissextos

const formatDate = (date) => date.toISOString().split('T')[0]

var dataInvalida = false

//Pega parâmetros da URL
var QueryString = (function () {
	var query_string = {}
	var query = window.location.search.substring(1)
	var vars = query.split('&')
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=')
		var key = pair[0] || '';
		var value = pair[1] || '';
		try {
			key = decodeURIComponent(key);
		} catch (e) {
			console.warn('Chave malformada:', key);
		}

		try {
			value = decodeURIComponent(value);
		} catch (e) {
			console.warn('Valor malformado:', value);
		}
		
		if (typeof query_string[key] === 'undefined') {
			query_string[key] = value;
		} else if (typeof query_string[key] === 'string') {
			query_string[key] = [query_string[key], value];
		} else {
			query_string[key].push(value);
		}
	}
	return query_string
})()

const formatDateToAdd = (daysToAdd = 0) => {
	const date = new Date()
	date.setDate(date.getDate() + daysToAdd)
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const hoje = formatDateToAdd()

function isBrDateFormat(dateStr) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/
    return regex.test(dateStr)
}

function convertToISO(dateStr) {
    const [day, month, year] = dateStr.split("/")
    return `${year}-${month}-${day}`
}

if(QueryString.dataIda != undefined) {
    var t = QueryString.dataIda.split('/')
} else {
	var dt_volta_min = formatDateToAdd(1)
	var dt_volta_limite = formatDateToAdd(dias_ano)
}

async function setDtVoltaMin(t) {
	return new Promise(resolve => {
		setTimeout(() => {
			const dt = new Date( t[2] + '-' + t[1] + '-' + t[0] )
			dt.setDate(dt.getDate() + 1);
			resolve(dt.toISOString().split("T")[0]);
		}, 100);
	});
}

async function setDtVoltaLimite(t) {
	return new Promise(resolve => {
		setTimeout(() => {
			const dt = new Date( t[2] + '-' + t[1] + '-' + t[0] )
			dt.setDate(dt.getDate() + dias_ano)
			resolve(dt.toISOString().split("T")[0]);
		}, 100);
	});
}

function validaData(date1, date2){
	msgDataError = ''
	inputPartida.style.border = ''
	inputRetorno.style.border = ''
	
	//Validação Data
	if( typeof date1 !== 'undefined' && date1 !== null &&
		typeof date2 !== 'undefined' && date2 !== null) {
		
		if(isBrDateFormat(date1)) {
			date1 = convertToISO(date1)
		} else {
			date1 = formatDate(date1)
		}

		if(isBrDateFormat(date2)) {
			date2 = convertToISO(date2)
		} else {
			date2 = formatDate(date2)
		}

		//Ao carregar o site
		if(date1 < hoje || date2 < hoje) {
			inputPartida.value = ''
			inputRetorno.value = ''
			QueryString.dataIda = ''
			QueryString.dataVolta = ''
			dataInvalida = true
			msgDataError = 'Data de partida e Retorno são inválidas!'
			inputRetorno.style.border = '1px solid red'
			inputPartida.style.border = '1px solid red'
			// return
			// DataPikerIda.clearSelection()
			// DataPikerVolta.clearSelection()
            // if(document.querySelector(".dataIdaTexto")) {
            //     document.querySelector(".dataIdaTexto").innerHTML = ''
            // }
            // if(document.querySelector(".dataVoltaTexto")) {
            //     document.querySelector(".dataVoltaTexto").innerHTML = ''
            // }
			
		} else if(date1 < hoje) {
			DataPikerIda.clearSelection();
            if(document.querySelector(".dataIdaTexto")) {
                document.querySelector(".dataIdaTexto").innerHTML = ''
            }
			QueryString.dataIda = ''
			dataInvalida = true
			msgDataError = 'Data inválida! A data de partida é menor que a data de hoje.'
			inputPartida.style.border = '1px solid red'
		} else if(date2 < hoje) {
			DataPikerVolta.clearSelection();
            // if(document.querySelector(".dataVoltaTexto")) {
            //     document.querySelector(".dataVoltaTexto").innerHTML = ''
            // }
			QueryString.dataVolta = ''
			dataInvalida = true
			msgDataError = 'Data de retorno inválida!'
			inputRetorno.style.border = '1px solid red'
		} else if(date1 > date2) {
			DataPikerIda.clearSelection();
			if(document.querySelector(".dataIdaTexto")) {
                document.querySelector(".dataIdaTexto").innerHTML = ''
            }
			QueryString.dataIda = ''
			dataInvalida = true
			msgDataError = 'Data inválida! Data de partida maior que a data de retorno.'	
			inputPartida.style.border = '1px solid red'
		} else if(date2 < hoje) {
			DataPikerVolta.clearSelection();
            // if(document.querySelector(".dataVoltaTexto")) {
            //     document.querySelector(".dataVoltaTexto").innerHTML = ''
            // }
			QueryString.dataVolta = ''
			dataInvalida = true
			msgDataError = 'Data de retorno é inválida!'
			inputRetorno.style.border = '1px solid red'
		} else {
			dataInvalida = false
		}
	} else {
		//caso as datas estejam erradas
		dataInvalida = true;
	}

	//insere dados nos textos indicativos
    if(document.querySelector(".destinoTexto")) {
        const select = document.querySelector("#SelectDestino");
        const textoSelecionado = select.selectedOptions[0].text
        document.querySelector(".destinoTexto").innerHTML = textoSelecionado
    }
    if(document.querySelector(".dataIdaTexto")) {
        document.querySelector(".dataIdaTexto").innerHTML = QueryString.dataIda
    }
    if(document.querySelector(".dataVoltaTexto")) {
        document.querySelector(".dataVoltaTexto").innerHTML = QueryString.dataVolta
    }
}

document.addEventListener("DOMContentLoaded", async function() {
	
	if(QueryString.dataIda != undefined) {
		var t = QueryString.dataIda.split('/')
		dt_volta_min = await setDtVoltaMin(t)
		dt_volta_limite = await setDtVoltaLimite(t)
	}

	// Um único Litepicker em modo RANGE (2 meses lado a lado, mesma UX do
	// calendário da LP-B): clicar em qualquer um dos dois campos abre o
	// calendário e o período é selecionado de uma vez (ida -> volta).
	// Adapters preservam a API que o restante do arquivo usa
	// (getDate/clearSelection/setOptions).
	const RangePicker = new Litepicker({
		element: inputPartida,
		elementEnd: inputRetorno,
		singleMode: false,
		numberOfMonths: 2,
		numberOfColumns: 2,
		tooltipText: {
			one: 'dia',
			other: 'dias'
		},
		format: 'DD/MM/YYYY',
		lang: 'pt-BR',
		minDate: today_ida.setDate(today_ida.getDate()),
		maxDays: dias_ano,
		autoApply: true,
		mobileFriendly: true
	})

	const DataPikerIda = {
		getDate: function(){ return RangePicker.getStartDate() },
		clearSelection: function(){ RangePicker.clearSelection() },
		setOptions: function(o){ RangePicker.setOptions(o) }
	}
	const DataPikerVolta = {
		getDate: function(){ return RangePicker.getEndDate() },
		clearSelection: function(){ RangePicker.clearSelection() },
		// o modo range já garante volta > ida e maxDays limita o período
		setOptions: function(){}
	}

	if(QueryString.dataIda && QueryString.dataVolta){
		RangePicker.setDateRange(new Date(convertToISO(QueryString.dataIda) + 'T12:00:00'), new Date(convertToISO(QueryString.dataVolta) + 'T12:00:00'))
		data1 = dataPickerFormatDate()
		date1 = new Date(data1)
		data2 = dataPickerFormatDate(true)
		date2 = new Date(data2)
	} else if(QueryString.dataIda){
		RangePicker.setDateRange(new Date(convertToISO(QueryString.dataIda) + 'T12:00:00'), new Date(convertToISO(QueryString.dataIda) + 'T12:00:00'))
		inputRetorno.value = ''
		data1 = dataPickerFormatDate()
		date1 = new Date(data1)
		date2 = null
	} else {
		date1 = null
		date2 = null
	}

	RangePicker.on('selected', (dateIda, dateVolta) => {
		filtroDataIdaChange(dateIda)
		filtroDataVoltaChange()
	})

	var dataInvalida = false;
	var msgDataError = ''	

	function dataPickerFormatDate(volta=false) {
		if(volta) {
			var dataSelecionada = DataPikerVolta.getDate()
		} else {
			var dataSelecionada = DataPikerIda.getDate()
		}

		if(dataSelecionada) {
			const ano = dataSelecionada.getFullYear()
			const mes = (dataSelecionada.getMonth() + 1).toString().padStart(2, '0')
			const dia = dataSelecionada.getDate().toString().padStart(2, '0')
			
			return `${ano}-${mes}-${dia}`
		} else {
			return
		}
	}

	validaData(date1, date2)

	//Ao trocar as datas com o teclado
	document.getElementById("filtrodataIda").addEventListener("change", (e) => {
		filtroDataIdaChange()
	})

	function filtroDataIdaChange() {
		
		var data1 = dataPickerFormatDate()
		var data2 = dataPickerFormatDate(true)

		// if(DataPikerIda.getDate() !== null) {
		// 	if(document.querySelector(".dataIdaTexto")) {
		// 		document.querySelector(".dataIdaTexto").innerHTML = DataPikerIda.getDate().format('DD/MM/YYYY')
		// 	}
		// }

		// if(DataPikerVolta.getDate() !== null) {
		// 	if(document.querySelector(".dataVoltaTexto")) {
		// 		document.querySelector(".dataVoltaTexto").innerHTML = DataPikerVolta.getDate().format('DD/MM/YYYY')
		// 	}
		// }
		
		if(data1 < hoje) {
			
			DataPikerIda.clearSelection()
			DataPikerVolta.clearSelection()
			dataInvalida = true

		} else if(data1 > data2) {

			DataPikerVolta.clearSelection()
			inputRetorno.value = ''
			inputRetorno.dispatchEvent(new Event('change', { bubbles: true }))
			inputRetorno.dispatchEvent(new Event('input'))
			
			QueryString.dataVolta = ''
			dataInvalida = true

		} else {
			msgDataError = ''
			inputPartida.style.border = ''
			dataInvalida = false
		}

		var dataLimiteMin = new Date(data1)
		dataLimiteMin.setDate(dataLimiteMin.getDate() + 1)

		var dataLimiteMax = new Date(data1)
		dataLimiteMax.setDate(dataLimiteMax.getDate() + dias_ano)

		DataPikerVolta.setOptions({
			minDate: formatDate(dataLimiteMin),
			maxDate: formatDate(dataLimiteMax)
		})
	}

	document.getElementById("filtrodataVolta").addEventListener("change", (e) => {
		filtroDataVoltaChange()
	})

	function filtroDataVoltaChange() {
		
		var data1 = dataPickerFormatDate()
		var data2 = dataPickerFormatDate(true)

		// if(document.querySelector(".dataIdaTexto")) {
		// 	document.querySelector(".dataIdaTexto").innerHTML = DataPikerIda.getDate().format('DD/MM/YYYY')    
		// }
		// if(document.querySelector(".dataVoltaTexto")) {
		// 	document.querySelector(".dataVoltaTexto").innerHTML = DataPikerVolta.getDate().format('DD/MM/YYYY')
		// }
		
		if(data1 > data2) {

			DataPikerVolta.clearSelection()
			inputRetorno.value = ''
			inputRetorno.dispatchEvent(new Event('change', { bubbles: true }))
			inputRetorno.dispatchEvent(new Event('input'))

			QueryString.dataVolta = ''
			dataInvalida = true

			// if(document.querySelector(".dataVoltaTexto")) {
			// 	document.querySelector(".dataVoltaTexto").innerHTML = ''
			// }
			
		} else if(data2 < hoje) {

			DataPikerVolta.clearSelection()

			// if(document.querySelector(".dataVoltaTexto")) {
			// 	document.querySelector(".dataVoltaTexto").innerHTML = ''
			// }
			QueryString.dataVolta = ''
			dataInvalida = true

		} else {
			msgDataError = ''
			inputPartida.style.border = ''
			inputRetorno.style.border = ''
			dataInvalida = false
		}
	}
})