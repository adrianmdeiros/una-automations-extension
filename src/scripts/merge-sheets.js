document.getElementById('sheets').addEventListener('change', () => {
  const fileInput = document.getElementById('sheets');
  const files = fileInput.files;

  if(files.length >= 2){
    document.getElementById('merge-sheet-files').disabled = false
    return
  }

})


document.getElementById('merge-sheet-files').addEventListener('click', () => {
  const fileInput = document.getElementById('sheets');
  const files = fileInput.files;

  let allRows = [];
  const uniqueHeaders = new Set();

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file, 'UTF-8'); // Define encoding como UTF-8
    });
  };

  Promise.all([...files].map(readFile))
    .then(contents => {
      // Primeiro coleta todos os cabeçalhos
      contents.forEach(csv => {
        const lines = csv.split(/\r?\n/).filter(l => l.trim() !== '');
        if (lines.length === 0) return;
        const headers = lines[0].split(',');
        headers.forEach(header => uniqueHeaders.add(header));
      });

      const mergedHeaders = Array.from(uniqueHeaders);

      // Processa cada linha de dados
      contents.forEach(csv => {
        const lines = csv.split(/\r?\n/).filter(l => l.trim() !== '');
        if (lines.length === 0) return;
        const currentHeaders = lines[0].split(',');
        const dataRows = lines.slice(1);

        dataRows.forEach(row => {
          const values = row.split(',');
          const rowMap = {};
          currentHeaders.forEach((header, index) => {
            rowMap[header] = values[index] || ''; // Associa valor ao header
          });
          // Alinha valores com os headers consolidados
          const mergedRow = mergedHeaders.map(header => rowMap[header] || '');
          allRows.push(mergedRow.join(','));
        });
      });

      // Adiciona BOM e cabeçalho consolidado
      const mergedCsv = '\uFEFF' + mergedHeaders.join(',') + '\n' + allRows.join('\n');

      // Cria o Blob com UTF-8
      const blob = new Blob([mergedCsv], { type: 'text/csv;charset=UTF-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao processar arquivos!');
    });
});