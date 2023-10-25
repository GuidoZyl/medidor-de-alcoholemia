let alcoholLevel = 0;

//Lista que contiene las bebidas prehechas y sus correspondientes propiedades y valores.

let bebidas = [
  { "nombre-bebida": "shtvod", GA: 40, volumen: 60 },
  { "nombre-bebida": "sex", GA: 15, volumen: 500 },
  { "nombre-bebida": "daiki", GA: 15, volumen: 200 },
];

//Lista que contiene los estados de alcoholemia y sus efectos.

let efectos = [
  {
    nombre: "Inestabilidad Emocional",
    descripcion:
      "Memoria, atención y juicio están perturbados. Dificultad para asociar ideas. Falta de compostura y autocrítica. Conducta mucho más espontánea e infantil.",
  },
  {
    nombre: "Confusión",
    descripcion:
      "Alteraciones en el habla, la postura, en la marcha y diplopía (visión doble). La falta de autocontrol puede llevar a agresividad y actos de violencia.",
  },
  {
    nombre: "Estupor",
    descripcion:
      "Sueño profundo que puede llevar a inconsciencia, estupor y coma.",
  },
  {
    nombre: "Coma",
    descripcion:
      "El coma puede ser profundo y desencadenarse una parálisis respiratoria.",
  },
];

//Función ejecutada al seleccionar opción en "Seleccionar trago".

const cargarBebida = () => {
  const select = document.querySelector("#val-select");
  const nombreInput = document.getElementsByName("nombre-bebida")[0];
  const volumenInput = document.getElementsByName("volumen")[0];

  switch (select.value) {
    case "shtvod":
      nombreInput.value = "Shot de Vodka";
      volumenInput.value = 60;
      break;
    case "sex":
      nombreInput.value = "Sex on the Beach";
      volumenInput.value = 500;
      break;
    case "daiki":
      nombreInput.value = "Daikiri";
      volumenInput.value = 200;
      break;
    default:
      nombreInput.value = "";
      volumenInput.value = "";
      break;
  }

  const gaInput = document.getElementsByName("ga")[0];
  switch (select.value) {
    case "shtvod":
      gaInput.value = 40;
      break;
    case "sex":
    case "daiki":
      gaInput.value = 15;
      break;
    default:
      gaInput.value = "";
      break;
  }
};

//Función para calcular alcohol en sangre.

const calcAlcoholLevel = (volumen, ga, peso, sexo, ctxFisica, tiempo) => {
  const alcoholMass = ((volumen * ga) / 100) * 0.789;
  let r;
  if (sexo === "mujer" && ctxFisica === "astenico") {
    r = 0.76;
  } else if (sexo === "hombre" && ctxFisica === "astenico") {
    r = 0.85;
  } else if (sexo === "mujer" && ctxFisica === "atletico") {
    r = 0.67;
  } else if (sexo === "hombre" && ctxFisica === "atletico") {
    r = 0.76;
  } else if (sexo === "mujer" && ctxFisica === "picnico") {
    r = 0.58;
  } else if (sexo === "hombre" && ctxFisica === "picnico") {
    r = 0.64;
  }
  const alcoholLevel = (alcoholMass / peso) * r - (tiempo / 60) * 0.15;
  return parseFloat(alcoholLevel.toFixed(2));
};

//Función ejecutada al enviar el formulario.

const onSubmit = (event) => {
  event.preventDefault();
  const inputs = document.querySelectorAll(".val-consu");
  const select = document.querySelector("#val-select");
  const formData = new FormData(event.target);
  const values = Object.fromEntries(formData.entries());
  console.log(values);

  inputs.forEach((input) => (input.value = ""));
  select.value = "default";

  const valueTiempo = (value) => {
    if ((value === "") | " " | null) {
      return 0;
    } else {
      return value;
    }
  };

  alcoholLevel += calcAlcoholLevel(
    values.volumen,
    values.ga,
    values.peso,
    values.genero,
    values.contextura,
    valueTiempo(values.tiempo)
  );
  console.log(alcoholLevel);

  //h2 sería el elemento que contiene el resultado del cálculo de alcoholemia.
  const calcResult = document.querySelector(".result-container h2");
  calcResult.textContent = alcoholLevel.toFixed(2);

  //pSpan sería el elemento que determina si el nivel de alcoholemia es apto para conducir o no.
  const pSpan = document.querySelector("#driving-status");
  if (alcoholLevel < 0.5) {
    pSpan.textContent = "∙ Nivel apto para conducir";
  } else {
    pSpan.textContent = "∙ Nivel NO apto para conducir";
  }

  const heading = document.querySelector("#effects");
  const p = document.querySelector("#effects-description");

  if (alcoholLevel > 0 && alcoholLevel < 1) {
    heading.textContent = `Efecto: ${efectos[0].nombre}`;
    p.textContent = efectos[0].descripcion;
  } else if (alcoholLevel > 1 && alcoholLevel < 2) {
    heading.textContent = `Efecto: ${efectos[1].nombre}`;
    p.textContent = efectos[1].descripcion;
  } else if (alcoholLevel > 2 && alcoholLevel < 3) {
    heading.textContent = `Efecto: ${efectos[2].nombre}`;
    p.textContent = efectos[2].descripcion;
  } else if (alcoholLevel > 3) {
    heading.textContent = `Efecto: ${efectos[3].nombre}`;
    p.textContent = efectos[3].descripcion;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("consumicion");
  const select = document.querySelector("#val-select");
  select.addEventListener("input", cargarBebida);
  form.addEventListener("submit", onSubmit);
});
