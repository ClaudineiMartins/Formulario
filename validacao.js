export function valida(input) {
    const tipoDeInput = input.dataset.tipo

    if (validadores[tipoDeInput]) {
        validadores[tipoDeInput](input)


        
    }
    if(input.validity.valid){
        input.parentElement.classList.remove('container-invalido')
        input.parentElement.querySelector('.mensagem-erro').innerHTML = ''

    }
    else{
        input.parentElement.classList.add('container-invalido')
        input.parentElement.querySelector('.mensagem-erro').innerHTML = monstraMensagemDeErro(tipoDeInput, input)
    }


}
const tiposDeErro = [
    'customError',
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
]
const mensagensDeErro = {
    nome: {
        valueMissing: 'O campo de nome não pode estar vazio.'
    },
    email: {
        valueMissing: 'O campo de email não pode estar vazio.',
        typeMismatch: 'O email digitado não é válido.'
    },
    Nascimento: {
        valueMissing: 'O campo de data de nascimento não pode estar vazio.',
        customError: 'Você deve ser maior que 18 anos para se cadastrar.'
    },
    cpf: {
        valueMissing: 'O campo de CPF não pode estar vazio.',
        customError: 'O CPF digitado é invalido, verifique se digitou corretamente!' 
    },
    senha: {
        valueMissing: 'O campo de senha não pode estar vazio.',
        patternMismatch: 'A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiúscula, um número e não deve conter símbolos.'
    },
    enderço: {
        valueMissing: 'O campo de logradouro não pode estar vazio.'
    },
    cidade: {
        valueMissing: 'O campo de cidade não pode estar vazio.'
    },
    estado: {
        valueMissing: 'O campo de estado não pode estar vazio.'
    },
    cep: {
        valueMissing: 'O campo de CEP não pode estar vazio.',
        patternMismatch: 'O CEP digitado não é válido.',
        customError: 'Nao foi possivel buscar o CEP informado, reveja os dados!'
    },
    preco: {
        valueMissing: 'O campo de preço não pode estar vazio.'
    }
}


const validadores = {
    Nascimento:input => validaDataNascimento(input),
    cpf:input => consultaCPF(input),
    cep:input => recuperarCep(input),
    
}

function monstraMensagemDeErro(tipoDeInput, input) {
    let mensagem = ''
    tiposDeErro.forEach(erro =>{
        if(input.validity[erro]) {
            mensagem = mensagensDeErro[tipoDeInput][erro]
        }
    })

    return mensagem
}



function validaDataNascimento(input) {
    const dataRecebida = new Date(input.value)
    let mensagem = ''

    if(!maiorQue18(dataRecebida)) {
        mensagem = 'Você deve ser maior que 18 anos para se cadastrar.'
    }
    input.setCustomValidity(mensagem)

 
}

function maiorQue18(data) {
    const dataAtual = new Date()
    const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate())

    return dataMais18 <= dataAtual
}


function consultaCPF(input){
    let mensagem = ''
    if (!validarCPF(input.value)){
        mensagem = 'O CPF digitado é invalido, verifique se digitou corretamente!'
    }
    input.setCustomValidity(mensagem)


}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, ''); // remove caracteres não numéricos
    if (cpf.length !== 11 || /(.)\1{10}/.test(cpf)) { // verifica se o CPF tem 11 dígitos e se todos são iguais
      return false;
    }
    var soma = 0;
    for (var i = 0; i < 9; i++) { // calcula a soma dos primeiros 9 dígitos do CPF
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    var resto = (soma * 10) % 11; // calcula o resto da divisão por 11
    if (resto === 10 || resto === 11) {
      resto = 0; // se o resto for 10 ou 11, o dígito verificador é 0
    }
    if (resto !== parseInt(cpf.charAt(9))) { // verifica se o primeiro dígito verificador é válido
      return false;
    }
    soma = 0;
    for (i = 0; i < 10; i++) { // calcula a soma dos primeiros 10 dígitos do CPF
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11; // calcula o resto da divisão por 11
    if (resto === 10 || resto === 11) {
      resto = 0; // se o resto for 10 ou 11, o dígito verificador é 0
    }
    if (resto !== parseInt(cpf.charAt(10))) { // verifica se o segundo dígito verificador é válido
      return false;
    }
    return true; // se chegou até aqui, o CPF é válido
  }
  


function recuperarCep(input){

const cep = input.value.replace(/\D/g, "") //regex, remove caracteres que nao sejam numeros
const url = `https://viacep.com.br/ws/${cep}/json/`
const options = {
  method: 'GET',
  mode: 'cors',
  headers: {
      'content-type': 'application/json;charset=utf-8'
  }
}
if(!input.validity.patternMismatch && !input.validity.valueMissing){
  fetch(url, options).then(
      response => response.json()
  ).then(
      data => {

          if(data.erro){
            input.setCustomValidity('Nao foi possivel buscar o CEP informado, reveja os dados!')
              
              
              return
          }

          input.setCustomValidity('')
          preencheCamposComCEP(data)
          return
      }
  )
}

  
}

function preencheCamposComCEP(data) {
    var Rua = document.querySelector('[data-tipo="enderço"]')
    var cidade = document.querySelector('[data-tipo="cidade"]')
    var estado = document.querySelector('[data-tipo="estado"]')


        Rua.value = data.logradouro;
        cidade.value = data.localidade;
        estado.value = data.uf;
    
}  
