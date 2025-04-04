import { automations } from "./automations.js"

const allowedHosts = ['plataforma.dataprev.gov.br']

const automationButtons = document.querySelectorAll('#buttons-list li button')
const loadingElement = document.querySelector('.loading')
const mergeSheetsSection = document.querySelector('.merge-sheets')
const automationsSection = document.querySelector('.automations')

automationButtons.forEach((button, key) => button.addEventListener('click', async () => {
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
        loadingElement.classList.remove('hidden')
        mergeSheetsSection.classList.add('hidden')
        automationsSection.classList.add('hidden')
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: automationFunction,
        })
        loadingElement.classList.add('hidden')
        mergeSheetsSection.classList.remove('hidden')
        automationsSection.classList.remove('hidden')
        alert('Automação finalizou.')
    } else {
        alert('❌ Ocorreu um erro.')
        alert('❌ Automação não encontrada.')
        loadingElement.classList.add('hidden')
        mergeSheetsSection.classList.remove('hidden')
        automationsSection.classList.remove('hidden')
    }

}))