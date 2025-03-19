export async function getTasksCsv() {

    waitFor('[aria-controls="menu-appbar"]', (menu) => {
        menu.click()
    })

    function waitFor(selector, callback, timeout = 3000) {
        const element = document.querySelector(selector)
        if (element) {
            callback(element)
            return
        }
        const observer = new MutationObserver((_mutations, obs) => {
            const element = document.querySelector(selector)
            if (element) {
                obs.disconnect()
                callback(element)
            }
        })
        observer.observe(document.body, { childList: true, subtree: true })
        setTimeout(() => observer.disconnect(), timeout)
    }

    // const menu = document.querySelector('[aria-controls="menu-appbar"]')
    // menu.click()
    // const menuItems = document.querySelectorAll('[role="menu"] li')

    // let changeProfile

    // menuItems.forEach(item => {
    //     const innerTexts = item.innerHTML.split('<')
    //     innerTexts.map(text => {
    //         if (text === 'Trocar Perfil') {
    //             changeProfile = item
    //             changeProfile.click()
    //         }
    //     })
    // })


    // setTimeout(() => {
    //     const selectUnit = document.querySelector('#select-selectUnidades button')
    //     selectUnit.click()
    //     setTimeout(() => {
    //         const units = document.querySelectorAll('#select-selectUnidades-popup [role="option"]')
    //         units.forEach((unit) => {
    //             unit.click()
    //             setTimeout(() => {
    //                 document.querySelector('#select-selectPerfil button').click()
    //             }, 3000)
    //             setTimeout(() => {
    //                 document.querySelector('#select-selectPerfil-popup [data-option-index="1"]').click()
    //             }, 3000)
    //             setTimeout(() => {
    //                 document.querySelector('#BtnConfirmarExclusaoOrgao').click()
    //             }, 3000)
    //             setTimeout(() => {
    //                 window.location.href = 'https://plataforma.dataprev.gov.br/#/capedigital/painel-tarefas'
    //                 setTimeout(() => document.getElementById('buttonExportarTarefas').click(), 3000)
    //             }, 3000)
    //             setTimeout(() => {
    //                 menu.click()
    //                 changeProfile.click()
    //                 selectUnit.click()
    //             }, 3000)
    //         })
    //     }, 3000)
    // }, 3000)

}