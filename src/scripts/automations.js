import { getBackOfficeTasks, getFaceToFaceServices } from './actions.js'

export const automations = [
    {
        name: '🤖 Baixar planilhas de relação de atendimentos',
        action: getFaceToFaceServices
    },
    {
        name: '🤖 Baixar planilhas de todas as tarefas',
        action: getBackOfficeTasks
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