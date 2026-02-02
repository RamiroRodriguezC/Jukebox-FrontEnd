export const MOCK_ALBUMS = [
  {
    _id: "1",
    titulo: "Artaud",
    anio: 1973,
    url_portada: "https://acdn-us.mitiendanube.com/stores/004/088/117/products/153700-5125962f13f621621d17269575572765-480-0.webp",
    isDeleted: false,
    autores: [
      { _id: "a1", nombre: "Pescado Rabioso" }
    ],
    canciones: [
      { _id: "c1", titulo: "Todas las hojas son del viento" },
      { _id: "c2", titulo: "Cementerio Club" },
      { _id: "c3", titulo: "Por" }
    ]
  },
  {
    _id: "2",
    titulo: "Cosmo's Factory",
    anio: 1970,
    isDeleted: false,
    autores: [
      { _id: "a2", nombre: "Creedence Clearwater Revival" }
    ],
    canciones: [
      { _id: "c4", titulo: "Ramble Tamble" },
      { _id: "c5", titulo: "Travelin' Band" }
    ]
  },
  {
    _id: "3",
    titulo: "Clics Modernos",
    anio: 1983,
    isDeleted: false,
    autores: [
      { _id: "a3", nombre: "Charly García" }
    ],
    canciones: [
      { _id: "c6", titulo: "Nos siguen pegando abajo" },
      { _id: "c7", titulo: "Los Dinosaurios" }
    ]
  },
  {
    _id: "4",
    titulo: "Oktubre",
    anio: 1986,
    url_portada: "https://akamai.sscdn.co/letras/360x360/albuns/6/3/e/4/2183691712605514.jpg",
    isDeleted: false,
    autores: [
      { _id: "a4", nombre: "Patricio Rey y sus Redonditos de Ricota" }
    ],
    canciones: [
        { _id: "c8", titulo: "Preso en mi ciudad" }
    ]
  }
];

export const MOCK_ARTISTAS = [
  {
    _id: "a1",
    nombre: "Pescado Rabioso",
    url_foto: "https://indiehoy.com/wp-content/uploads/2025/10/luis-alberto-spinetta.webp",
    pais: "Argentina",
    descripcion: "Banda de hard rock y blues rock argentina, liderada por Luis Alberto Spinetta.",
    isDeleted: false
  },
  {
    _id: "a2",
    nombre: "Creedence Clearwater Revival",
    pais: "Estados Unidos",
    descripcion: "Banda de rock estadounidense con gran influencia del country y swamp rock.",
    isDeleted: false
  },
  {
    _id: "a3",
    nombre: "Charly García",
    pais: "Argentina",
    descripcion: "Icono absoluto del rock nacional argentino, multiinstrumentista y compositor.",
    isDeleted: false
  }
  
];

export const MOCK_CANCIONES = [
  {
    _id: "c1",
    titulo: "Todas las hojas son del viento",
    duracion: 132, // en segundos
    generos: ["Rock", "Folk"],
    fecha_salida: "1973-10-01",
    isDeleted: false,
    album: {
      _id: "1",
      url_portada: "https://acdn-us.mitiendanube.com/stores/004/088/117/products/153700-5125962f13f621621d17269575572765-480-0.webp",
      titulo: "Artaud",
    },
    autores: [
      { _id: "a1", nombre: "Pescado Rabioso" }
    ]
  },
  {
    _id: "c2",
    titulo: "Have You Ever Seen the Rain?",
    duracion: 159,
    generos: ["Roots Rock", "Country Rock"],
    fecha_salida: "1970-12-01",
    isDeleted: false,
    album: {
      _id: "5",
      titulo: "Pendulum",
    },
    autores: [
      { _id: "a2", nombre: "Creedence Clearwater Revival" }
    ]
  },
  {
    _id: "c3",
    titulo: "Los Dinosaurios",
    duracion: 208,
    generos: ["Rock", "New Wave"],
    fecha_salida: "1983-11-05",
    isDeleted: false,
    album: {
      _id: "3",
      titulo: "Clics Modernos",
    },
    autores: [
      { _id: "a3", nombre: "Charly García" }
    ]
  }
];