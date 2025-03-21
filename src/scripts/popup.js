import { automations } from "./automations.js"

const allowedHosts = ['plataforma.dataprev.gov.br']

const automationButtons = document.querySelectorAll('button')
const loadingElement = document.querySelector('.loading')

automationButtons.forEach((button, key) => button.addEventListener('click', async () => {
    // const selectedProfile = document.getElementById('profiles-select').value
    // if(!selectedProfile){
    //     alert('⚠ Por favor, selecione um perfil.')
    //     return
    // }

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    const url = new URL(tab.url)
    if (!allowedHosts.includes(url.hostname)) {
        alert("⚠ Você só pode utilizar as automações na plataforma UNA - CAPE DIGITAL.")
        return
    }

    if (tab.url.includes('/login')) {
        alert("⚠ Você precisa estar autenticado na UNA - CAPE DIGITAL para utilizar as automações.")
        return
    }

    const automationFunction = automations[key].action

    if (automationFunction) {
        automationButtons.forEach(button => button.disabled = true)
        loadingElement.classList.remove('hidden')
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: automationFunction,
            // args: [selectedProfile]
        })
        automationButtons.forEach(button => button.disabled = false)
        loadingElement.classList.add('hidden')
    } else {
        alert('Automação não encontrada.')
    }

}))