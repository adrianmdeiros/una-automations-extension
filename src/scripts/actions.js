export async function getFaceToFaceServices() {
    try {
        const selectUnits = await getAllUnits()
        for (let i = 1; i < selectUnits.length; i++) {
            while (i < selectUnits.length && selectUnits[i].textContent.includes('Equipe')) {
                i++
            }

            if (i >= selectUnits.length) break

            const units = await selectUnit(i)
            const unitStateName = await getUnitStateName(units, i)

            await selectProfile()
            await navigateToServicesReportTab()
            await filterServicesReport()
            await generateServicesReportCsv(unitStateName)

            // await downloadServicesReportCsv()
            alert('✅ Automação concluida!')
        }
    } catch (error) {
        alert('❌ Ocorreu um erro: ')
        console.error('Erro durante a automação:', error);
        throw error;
    }

    async function getAllUnits() {
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
        const selectUnits = await waitFor('#selectUnidades-popup [role="option"]');

        const closeSelectUnitButton = await waitFor('[aria-label="Close"]')
        closeSelectUnitButton[0].click()

        return selectUnits
    }

    async function selectUnit(i) {
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

        const unitSelector = await waitFor('#select-selectUnidades button');
        unitSelector[0].click();

        await delay(3000)
        const units = await waitFor('#selectUnidades-popup [role="option"]');

        units[i].click()

        return units
    }

    async function getUnitStateName(units, i) {
        const unitTextContent = units[i].textContent
        const unitStateName = unitTextContent.includes('GO/TO')
            ? unitTextContent.substring(0, 10).trim()
            : unitTextContent.substring(0, 7).trim()
        return unitStateName
    }

    async function selectProfile() {
        const profileSelector = await waitFor('#select-selectPerfil button');
        profileSelector[0].click();

        await delay(3000)
        const profiles = await waitFor('#selectPerfil-popup [role="option"]');

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
    }

    async function navigateToServicesReportTab() {
        await delay(3000);
        window.location.href = 'https://plataforma.dataprev.gov.br/#/capedigital/monitoramento-unidade';

        const servicesReportTab = await waitFor('[aria-label="Relação de Atendimentos"]')
        servicesReportTab[0].click()
    }

    async function filterServicesReport() {
        const selectPeriod = await waitFor('#select-selectPeriodoRelacao_ button')
        selectPeriod[0].click()

        await delay(3000)
        const periods = await waitFor('#selectPeriodoRelacao_-popup [role="option"]')

        for (const period of periods) {
            if (period.textContent.trim() === 'Mês passado') {
                period.click()
                break
            }
        }

        const searchButton = await waitFor('#buttonPesquisarMonitoramentoRelacaoAtendimento')
        searchButton[0].click()
    }

    async function generateServicesReportCsv(unitStateName) {
        await delay(3000)
        await tableToCSV(unitStateName);
    }

    // async function downloadServicesReportCsv() {
    //     await delay(3000)
    //     const exportButton = await waitFor('#buttonExportarMonitoramentoUnidadeCSV', 5000);
    //     exportButton[0].click()
    // }

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

    async function tableToCSV(unidade) {
        let table = await waitFor('[name="tableRelacaoAtendimentos"] table');
        let rows = table[0].querySelectorAll("tr");
        let csvContent = "";


        let headerRow = [
            "Unidade", "Senha", "Nome", "CPF", "Serviço", "Triagem", "Chamada",
            "Início Atendimento", "Fim Atendimento", "TE (Tempo de Espera)",
            "TA (Tempo de Atendimento)", "TP (Tempo de Permanência)", "Triador",
            "Atendente", "Agendado", "Status"
        ];
        csvContent += "\uFEFF" + headerRow.join(";") + "\n";


        rows.forEach(row => {
            let cols = row.querySelectorAll("td");
            if (cols.length === 0) return;

            let rowData = [unidade];

            cols.forEach((td, index) => {
                let textContent = (td.innerText || "").trim();
                let values = textContent.split("\n").map(v => v.replace(/^(Triagem|Chamada|Início Atend|Fim Atend) /, "").trim());


                if (index === 1) {
                    rowData.push(values[0] || "");
                    rowData.push(values[1] || "");
                }

                else if (index === 3) {
                    rowData.push(values[0] || "");
                    rowData.push(values[1] || "");
                    rowData.push(values[2] || "");
                    rowData.push(values[3] || "");
                }

                else if (index === 4) {
                    rowData.push(values[0]?.replace("TE:", "").trim() || "");
                    rowData.push(values[1]?.replace("TA:", "").trim() || "");
                    rowData.push(values[2]?.replace("TP:", "").trim() || "");
                }

                else if (index === 5) {
                    rowData.push(values[0]?.replace("Triador:", "").trim() || "");
                    rowData.push(values[1]?.replace("Atendente:", "").trim() || "");
                }

                else {
                    rowData.push(values.join(" ") || "");
                }
            });

            csvContent += rowData.join(";") + "\n";
        });


        let blob = new Blob([csvContent], { type: "text/csv;charset=UTF-8" });
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `RELACAO ATENDIMENTOS PRESENCIAIS ${unidade}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

}

export async function getBackOfficeTasks(){
    try{
        const selectUnits = await getAllUnits()
        for (let i = 1; i < selectUnits.length; i++) {
            if(selectUnits[i].textContent.includes('Equipe')) {
                await selectUnit(i)
                await selectProfile()
                await navigateToAllTasksTab()
                await filterBackOfficeTasks()
                await downloadBackOfficeTasks()
            }
        }
        alert('✅ Automação Concluída!')
    }catch(error){
        alert('❌ Ocorreu um erro')
        console.error('Erro durante a automação:', error);
        throw error;
    }

    async function getAllUnits() {
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
        const selectUnits = await waitFor('#selectUnidades-popup [role="option"]');

        const closeSelectUnitButton = await waitFor('[aria-label="Close"]')
        closeSelectUnitButton[0].click()

        return selectUnits
    }

    async function selectUnit(i) {
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

        const unitSelector = await waitFor('#select-selectUnidades button');
        unitSelector[0].click();

        await delay(3000)
        const units = await waitFor('#selectUnidades-popup [role="option"]');

        units[i].click()

        return units
    }

    async function selectProfile() {
        const profileSelector = await waitFor('#select-selectPerfil button');
        profileSelector[0].click();

        await delay(3000)
        const profiles = await waitFor('#selectPerfil-popup [role="option"]');

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
    }

    async function navigateToAllTasksTab() {
        await delay(3000);
        window.location.href = 'https://plataforma.dataprev.gov.br/#/capedigital/painel-tarefas';
        const allTasksTab = await waitFor('[aria-label="Todas as Tarefas"]')
        allTasksTab[0].click()
    }

    function getYearStartToLastMonthRange() {
        const now = new Date();
        let firstDayOfYear;
        let lastDayOfLastMonth;

        if (now.getMonth() === 0) {
            firstDayOfYear = new Date(now.getFullYear() - 1, 0, 1);
            lastDayOfLastMonth = new Date(now.getFullYear() - 1, 11, 31);
        } else {
            firstDayOfYear = new Date(now.getFullYear(), 0, 1);
            lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        }

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}${month}${year}`;
        };

        return {
            firstDay: formatDate(firstDayOfYear),
            lastDay: formatDate(lastDayOfLastMonth)
        };
    }

    async function filterBackOfficeTasks() {
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

        const { firstDay, lastDay } = getYearStartToLastMonthRange();
        createdAtInput.value = firstDay;
        createdAtInput.dispatchEvent(new Event("input", { bubbles: true }));
        untilInput.value = lastDay;
        untilInput.dispatchEvent(new Event("input", { bubbles: true }));

        await delay(2000)
        const searchTasksButton = await waitFor('#buttonPesquisarFilaUnidade')
        searchTasksButton[0].click()
    }

    async function downloadBackOfficeTasks() {
        await delay(3000)
        const exportButton = await waitFor('#buttonExportarTodasTarefas', 5000);
        exportButton[0].click();
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