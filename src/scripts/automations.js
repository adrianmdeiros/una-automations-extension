
export async function getTasksCsv() {
    const menu = document.querySelector('[aria-controls="menu-appbar"]')
    menu.click()
    const menuItems = document.querySelectorAll('[role="menu"] li')

    let changeProfile

    menuItems.forEach(item => {
        const innerTexts = item.innerHTML.split('<')
        innerTexts.map(text => {
            if (text === 'Trocar Perfil') {
                changeProfile = item
                changeProfile.click()
            }
        })
    })


    setTimeout(() => {
        const selectUnit = document.querySelector('#select-selectUnidades button')
        selectUnit.click()
        setTimeout(() => {
            const units = document.querySelectorAll('#select-selectUnidades-popup [role="option"]')
            units.forEach((unit) => {
                setTimeout(() => {
                    selectUnit.click()
                    unit.click()
                }, 3000)
                document.querySelector('#select-selectPerfil button').click()
                setTimeout(() => {
                    document.querySelector('#select-selectPerfil-popup [data-option-index="1"]').click()
                }, 1000)
                setTimeout(() => {
                    document.querySelector('#BtnConfirmarExclusaoOrgao').click()
                }, 1000)
                setTimeout(() => {
                    window.location.href = 'https://plataforma.dataprev.gov.br/#/capedigital/painel-tarefas'
                    setTimeout(() => document.getElementById('buttonExportarTarefas').click(), 3000)
                }, 3000)
                setTimeout(() => {
                    menu.click()
                    changeProfile.click()
                }, 3000)
            })
        }, 1000)
    }, 3000)

}