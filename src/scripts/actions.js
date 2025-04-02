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
        const selectUnits = await waitFor('#select-selectUnidades-popup [role="option"]');

        const closeSelectUnitButton = await waitFor('[aria-label="Close"]')
        closeSelectUnitButton[0].click()

        for (let i = 1; i < selectUnits.length; i++) {
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

            while (i < units.length && units[i].textContent.includes('Equipe')) {
                i++
            }

            if (i >= units.length) break

            const unitTextContent = units[i].textContent
            const unitNameState = unitTextContent.includes('GO/TO')
                ? unitTextContent.substring(0, 10).trim()
                : unitTextContent.substring(0, 7).trim()

            units[i].click()

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

            await delay(5000)
            await tableToCSV(unitNameState);

            // await delay(3000)
            // const exportButton = await waitFor('#buttonExportarMonitoramentoUnidadeCSV', 5000);
            // exportButton[0].click()

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
        let rows = table[0].querySelectorAll("tr"); // Garantindo que estamos acessando a tabela corretamente
        let csvContent = "";

        // Definir os headers EXATAMENTE como no Excel
        let headerRow = [
            "Unidade", "Senha", "Nome", "CPF", "Serviço", "Triagem", "Chamada",
            "Início Atendimento", "Fim Atendimento", "TE (Tempo de Espera)",
            "TA (Tempo de Atendimento)", "TP (Tempo de Permanência)", "Triador",
            "Atendente", "Agendado", "Status"
        ];
        csvContent += "\uFEFF" + headerRow.join(";") + "\n"; // Adiciona BOM para UTF-8 e os headers

        // Percorrer as linhas da tabela (dados)
        rows.forEach(row => {
            let cols = row.querySelectorAll("td");
            if (cols.length === 0) return; // Ignorar linhas sem <td>

            let rowData = [unidade]; // Adiciona a unidade fixa na primeira coluna

            cols.forEach((td, index) => {
                let textContent = td.innerText.trim(); // Pegando apenas texto puro, sem HTML ou atributos extras
                let values = textContent.split("\n").map(v => v.replace(/^(Triagem|Chamada|Início Atend|Fim Atend) /, "").trim()); // Separando valores por quebra de linha

                // Se for a coluna do Nome/CPF, garantir que sejam duas colunas
                if (index === 1) {
                    rowData.push(values[0] || ""); // Nome
                    rowData.push(values[1] || ""); // CPF
                }
                // Se for a coluna de Hora, garantir 4 valores
                else if (index === 3) {
                    rowData.push(values[0] || ""); // Triagem
                    rowData.push(values[1] || ""); // Chamada
                    rowData.push(values[2] || ""); // Início Atendimento
                    rowData.push(values[3] || ""); // Fim Atendimento
                }
                // Se for a coluna de Indicadores, garantir 3 valores
                else if (index === 4) {
                    rowData.push(values[0]?.replace("TE:", "").trim() || ""); // TE (Tempo de Espera)
                    rowData.push(values[1]?.replace("TA:", "").trim() || ""); // TA (Tempo de Atendimento)
                    rowData.push(values[2]?.replace("TP:", "").trim() || ""); // TP (Tempo de Permanência)
                }
                // Se for a coluna de Profissionais, garantir 2 valores
                else if (index === 5) {
                    rowData.push(values[0]?.replace("Triador:", "").trim() || ""); // Triador
                    rowData.push(values[1]?.replace("Atendente:", "").trim() || ""); // Atendente
                }
                // Outras colunas seguem normalmente
                else {
                    rowData.push(values.join(" ")); // Junta valores com espaço se houver mais de um
                }
            });

            csvContent += rowData.join(";") + "\n"; // Junta os valores no CSV
        });

        // Criar e baixar o arquivo CSV
        let blob = new Blob([csvContent], { type: "text/csv;charset=UTF-8" });
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `RELACAO ATENDIMENTOS PRESENCIAIS ${unitNameState}.csv`;
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