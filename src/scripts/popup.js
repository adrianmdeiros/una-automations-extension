import { getTasksCsv } from "./automations.js"

const automations = {
    'tasks-csv': getTasksCsv
}

const allowedHosts = ['plataforma.dataprev.gov.br']

const startButtons = document.querySelectorAll('button')

startButtons.forEach(button => button.addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    
    const url = new URL(tab.url)
    if (!allowedHosts.includes(url.hostname)) {
        alert("⚠ Você só pode utilizar as automações na plataforma UNA - CAPE DIGITAL.")
        return
    }
    
    if(tab.url.includes('/login')){
        alert("⚠ Você precisa estar autenticado na UNA - CAPE DIGITAL para utilizar as automações.")
        return
    }

    const buttonId = button.getAttribute('id')
    const automationFunction = automations[buttonId]
    
    if (automationFunction) {
        button.disabled = true
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: automationFunction,
        })
        button.disabled = false
    } else {
        alert('Automação não encontrada.')
    }

}))


const fullYear = new Date().getFullYear()
const footerYearSpan = document.getElementById('actual-year') 
footerYearSpan.innerHTML = fullYear