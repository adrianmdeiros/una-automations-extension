import { getTasksCsv } from "./automations.js"

const automations = {
    'tasks-csv': getTasksCsv
}

const startButtons = document.querySelectorAll('button')

startButtons.forEach(button => button.addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    const buttonId = button.getAttribute('id')

    const automationFunction = automations[buttonId]

    if (automationFunction) {
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: automationFunction,
        })
    } else {
        console.error('Automação não encontrada.');
    }

}))


const fullYear = new Date().getFullYear()
const footerYearSpan = document.getElementById('actual-year') 
footerYearSpan.innerHTML = fullYear