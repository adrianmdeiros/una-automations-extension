export async function getFaceToFaceServices(_selectedProfile) {
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
            const unitNameEstate = units[i + 1].textContent.substring(0, 7).trim()

            units[i + 1].click()

            const selectProfile = await waitFor('#select-selectPerfil button');
            selectProfile[0].click();

            await delay(3000)
            const profiles = await waitFor('#select-selectPerfil-popup [role="option"]');

            if (!Array.from(profiles).some(el => el.textContent.trim().includes('GESTOR_UNIDADE'))) {
                alert('❌ Você precisa de um perfil GESTOR_UNIDADE para ter acesso a essas planilhas.')
                return
            }

            for (const profile of profiles) {
                if (profile.textContent.trim() === 'GESTOR_UNIDADE') {
                    profile.click()
                    break
                }
            }

            const confirmButton = await waitFor('#BtnConfirmarExclusaoOrgao');
            confirmButton[0].click();

            await delay(3000);
            window.location.href = 'https://plataforma.dataprev.gov.br/#/capedigital/monitoramento-unidade';

            const servicesReportTab = await waitFor('[aria-label="Relação de Atendimentos"]')
            servicesReportTab[0].click()

            const selectPeriod = await waitFor('#select-selectPeriodoRelacao_ button')
            selectPeriod[0].click()

            await delay(3000)
            const periods = await waitFor('#select-selectPeriodoRelacao_-popup [role="option"]')

            for (const period of periods) {
                if (period.textContent.trim() === 'Mês passado') {
                    period.click()
                    break
                }
            }

            const searchButton = await waitFor('#buttonPesquisarMonitoramentoRelacaoAtendimento')
            searchButton[0].click()

            // await delay(5000)
            // tableToCSV(unitNameEstate);

            await delay(3000)
            const exportButton = await waitFor('#buttonExportarMonitoramentoUnidadeCSV', 5000);
            exportButton[0].click()

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

    // ToDo - arrumar headers que ele nao está separando
    async function tableToCSV(unidade) {
        let table = await waitFor('[name="tableRelacaoAtendimentos"] table');
        let rows = table[0].querySelectorAll("tr"); 
        let csvContent = "";
        
        let headers = table[0].querySelectorAll("th");
        let headerRow = ["Unidade"]; 
        headers.forEach(th => headerRow.push(th.innerText.trim()));
        csvContent += headerRow.join(";") + "\n"; 
    
        rows.forEach(row => {
            let cols = row.querySelectorAll("td");
            if (cols.length === 0) return; 
    
            let rowData = [unidade]; 
            cols.forEach(td => {
                
                let values = td.innerHTML.split("<br>").map(v => v.trim());
                rowData.push(...values);
            });
    
            csvContent += rowData.join(";") + "\n"; 
        });
   
        let blob = new Blob([csvContent], { type: "text/csv;charset=UTF-8" });
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `RELAÇÃO DE ATENDIMENTOS ${unidade}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    
}

export async function getBackOfficeTasks(_selectedProfile) {
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

            if (!Array.from(profiles).some(el => el.textContent.trim().includes('GESTOR_UNIDADE'))) {
                alert('❌ Você precisa de um perfil GESTOR_UNIDADE para ter acesso a essas planilhas.')
                return
            }

            for (const profile of profiles) {
                if (profile.textContent.trim() === 'GESTOR_UNIDADE') {
                    profile.click()
                    break
                }
            }

            const confirmButton = await waitFor('#BtnConfirmarExclusaoOrgao');
            confirmButton[0].click();

            await delay(3000);
            window.location.href = 'https://plataforma.dataprev.gov.br/#/capedigital/painel-tarefas';

            const allTasksTab = await waitFor('[aria-label="Todas as Tarefas"]')
            allTasksTab[0].click()

            await delay(3000)
            const filterTasksButton = await waitFor('#buttonFilterTarefas')
            filterTasksButton[0].click()

            await delay(3000)
            const filterLabels = await waitFor(".br-input label");
            let createdAtInput, untilInput

            filterLabels.forEach(label => {
                const trimmedText = label.textContent.trim();

                if (trimmedText.includes("Criada em (Período)")) {
                    createdAtInput = label.nextElementSibling
                }

                if (trimmedText.includes("até (período)") && !untilInput) {
                    untilInput = label.nextElementSibling
                    return
                }

            });
            
            const { firstDay, lastDay } = getPreviousMonthRange();
            createdAtInput.value = firstDay;
            createdAtInput.dispatchEvent(new Event("input", { bubbles: true }));
            untilInput.value = lastDay;
            untilInput.dispatchEvent(new Event("input", { bubbles: true }));
            
            await delay(3000)
            const searchTasksButton = await waitFor('#buttonPesquisarFilaUnidade')
            searchTasksButton[0].click()

            await delay(5000)
            const exportButton = await waitFor('#buttonExportarTodasTarefas', 5000);
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

    function getPreviousMonthRange() {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}${month}${year}`;
        };

        return {
            firstDay: formatDate(firstDay),
            lastDay: formatDate(lastDay)
        };
    }
}