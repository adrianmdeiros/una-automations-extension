document.getElementById('sheets').addEventListener('change', () => {
  const fileInput = document.getElementById('sheets');
  const files = fileInput.files;

  if (files.length === 0) {
    document.getElementById('merge-sheet-files').disabled = true
    return
  }

  if (files.length >= 2) {
    document.getElementById('merge-sheet-files').disabled = false
    return
  }

})


document.getElementById('merge-sheet-files').addEventListener('click', () => {
  const fileInput = document.getElementById('sheets');
  const files = fileInput.files;
  const mergeButton = document.getElementById('merge-sheet-files');

  if (files.length === 0) {
    mergeButton.disabled = true;
    alert('Anexe pelo menos 2 arquivos.');
    return;
  }

  let allRows = [];
  const uniqueHeaders = new Set();

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file, 'UTF-8');
    });
  };

  Promise.all([...files].map(readFile))
    .then(contents => {
      // Primeiro coleta todos os cabeçalhos
      contents.forEach(csv => {
        const lines = csv.split(/\r?\n/).filter(l => l.trim() !== '');
        if (lines.length === 0) return;
        const headers = lines[0].split(';').map(h => h.trim()); // 🧼 limpa os headers
        headers.forEach(header => uniqueHeaders.add(header));
      });

      const mergedHeaders = Array.from(uniqueHeaders);

      // Processa cada linha de dados
      contents.forEach(csv => {
        const lines = csv.split(/\r?\n/).filter(l => l.trim() !== '');
        if (lines.length === 0) return;
        const currentHeaders = lines[0].split(';').map(h => h.trim()); // 🧼 limpa os headers
        const dataRows = lines.slice(1);

        dataRows.forEach(row => {
          const values = row.split(';').map(v => v.trim()); // 🧼 limpa os valores
          const rowMap = {};
          currentHeaders.forEach((header, index) => {
            rowMap[header] = values[index] || '';
          });

          const mergedRow = mergedHeaders.map(header => rowMap[header] || '');
          allRows.push(mergedRow.join(';'));
        });
      });

      // Adiciona BOM e cabeçalho consolidado
      const mergedCsv = '\uFEFF' + mergedHeaders.join(';') + '\n' + allRows.join('\n');

      // Cria e baixa o arquivo
      const blob = new Blob([mergedCsv], { type: 'text/csv;charset=UTF-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Mescladas.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      fileInput.value = '';
      mergeButton.disabled = true;
    })
    .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao processar arquivos!');
    });
});
