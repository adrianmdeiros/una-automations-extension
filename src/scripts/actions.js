
export async function getTasksCsv() {
    try {
        const menu = await waitFor('[aria-controls="menu-appbar"]');
        menu[0].click();

        const menuItems = await waitFor('[role="menu"] li');
        for (const menuItem of menuItems) {
            if (menuItem.textContent.trim() === 'Trocar Perfil') {
                menuItem.click();
                break;
            }
        }

        const selectUnit = await waitFor('#select-selectUnidades button');
        selectUnit[0].click();

        await delay(3000)
        const units = await waitFor('#select-selectUnidades-popup [role="option"]');

        const closeSelectUnitButton = await waitFor('[aria-label="Close"]')
        closeSelectUnitButton[0].click()

        for (let i = 0; i < units.length - 1; i++) {
            await delay(3000)
            const menu = await waitFor('[aria-controls="menu-appbar"]');
            menu[0].click();

            const menuItems = await waitFor('[role="menu"] li');
            for (const menuItem of menuItems) {
                if (menuItem.textContent.trim() === 'Trocar Perfil') {
                    menuItem.click();
                    break;
                }
            }

            const newSelectUnit = await waitFor('#select-selectUnidades button');
            newSelectUnit[0].click();

            await delay(3000)
            const units = await waitFor('#select-selectUnidades-popup [role="option"]');
            units[i + 1].click()

            const selectProfile = await waitFor('#select-selectPerfil button');
            selectProfile[0].click();

            await delay(3000)
            const profiles = await waitFor('#select-selectPerfil-popup [role="option"]');

            for (const profile of profiles) {
                if (profile.textContent.trim() === 'PROFISSIONAL') {
                    profile.click()
                    break
                }
            }

            const confirmButton = await waitFor('#BtnConfirmarExclusaoOrgao');
            confirmButton[0].click();


            await delay(3000);
            window.location.href = 'https://plataforma.dataprev.gov.br/#/capedigital/atendimento';

            const exportButton = await waitFor('#buttonExportarAtendimentosProfissionalCSV', 5000);
            exportButton[0].click();
        }
    } catch (error) {
        console.error('Erro durante a automação:', error);
        throw error;
    }

    function waitFor(selector, timeout = 3000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelectorAll(selector);
            if (element.length > 0) {
                resolve(element);
                return;
            }
            const observer = new MutationObserver((_mutations, obs) => {
                const element = document.querySelectorAll(selector);
                if (element.length > 0) {
                    obs.disconnect();
                    resolve(element);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Elemento '${selector}' não encontrado após ${timeout}ms`));
            }, timeout);
        });
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}