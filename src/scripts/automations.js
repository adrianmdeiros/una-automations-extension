export async function getTasksCsv() {
    window.location.href = 'https://plataforma.dataprev.gov.br/#/capedigital/painel-tarefas'
    setTimeout(() => {
        const exportTasksButton = document.getElementById('buttonExportarTarefas')
        exportTasksButton.click()
    }, 3000)

}
