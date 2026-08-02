const getData = (req, res) => {
  // Shape matches exactly what frontend/script.js expects (see displayAllData)
  const professionalData = {
    professionalName: "Zureyma Manrique",
    // NOTE: script.js already prepends "data:image/png;base64, " itself,
    // so this should be the raw base64 string only (no data URI prefix).
    base64Image:
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    nameLink: {
      firstName: "Zureyma",
      url: "https://github.com/Zureyma-Manrique",
    },
    primaryDescription:
      " is a Computer Science student at BYU-Idaho, focused on building clean, well-documented backend APIs.",
    workDescription1:
      "Experienced with Node.js, Express, and MongoDB, building RESTful APIs that follow clear architectural patterns.",
    workDescription2:
      "Currently deepening skills in API documentation with Swagger and deployment with Render.",
    linkTitleText: "Find me online:",
    linkedInLink: {
      text: "LinkedIn",
      link: "https://linkedin.com/in/your-profile-here",
    },
    githubLink: {
      text: "GitHub",
      link: "https://github.com/Zureyma-Manrique",
    },
  };

  res.status(200).json(professionalData);
};

module.exports = { getData };
