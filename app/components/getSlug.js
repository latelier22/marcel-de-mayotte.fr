export default function slugify(text) {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')         // Remplace les espaces par des tirets
      .replace(/[^\w\-]+/g, '')     // Supprime tous les caractères non word, non dash
      .replace(/\-\-+/g, '-');      // Remplace multiple dashes par un seul tiret
  }


  