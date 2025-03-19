import { getTasksCsv } from "./automations.js"

const allowedHosts = ['plataforma.dataprev.gov.br']

const automations = [
    {
        name: '🤖 Baixar planilha de tarefas',
        action: getTasksCsv
    }
]

createAutomationButtons(automations)

const startButtons = document.querySelectorAll('button')

startButtons.forEach((button, key) => button.addEventListener('click', async () => {
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

    const automationFunction = automations[key].action
    
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

function createAutomationButtons(automations){
    const buttonsList = document.getElementById('buttons-list')

    automations.forEach(({ name }) => {
        const buttonItem = document.createElement('li')
        const button = document.createElement('button')
        button.innerText = name
        buttonItem.appendChild(button)
        buttonsList.appendChild(buttonItem)
    })

}