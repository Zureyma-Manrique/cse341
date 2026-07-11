const getData = (req, res) => {
  // Construye este objeto EXACTAMENTE con las llaves que pide script.js
  const mockData = {
    nombre: "Tu Nombre",
    descripcion: "Texto largo de ejemplo...",
    enlace1: "https://github.com",
    enlace2: "https://linkedin.com",
    imagenBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=" 
  };

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(mockData);
};

module.exports = { getData };