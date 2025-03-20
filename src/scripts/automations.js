import { getTasksCsv } from './actions.js'

export const automations = [
    {
        name: '🤖 Baixar planilha de tarefas',
        action: getTasksCsv
    }
]

function createAutomationButtons(){
    const buttonsList = document.getElementById('buttons-list')
    automations.forEach(({ name }) => {
        const buttonItem = document.createElement('li')
        const button = document.createElement('button')
        button.setAttribute('type', 'button')
        button.innerText = name
        buttonItem.appendChild(button)
        buttonsList.appendChild(buttonItem)
    })

}

createAutomationButtons()