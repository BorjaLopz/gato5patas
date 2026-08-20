export interface Nominado {
    id: string;
    nombre: string;
    fotoUrl?: string;
}

export interface Categoria {
    id: string;
    titulo: string;
    descripcion: string;
    nominados: Nominado[];
}

/**
 * Extensión del archivo de foto para cada nominado con foto ya recibida
 * (carpeta public/fotos-nominados/). Los nominados que no aparecen aquí
 * todavía no han mandado su foto — se muestra un placeholder para ellos.
 */
const FOTOS_DISPONIBLES: Record<string, string> = {
    "aliada-ayto-rivas": ".jpg",
    "aliada-caixa-rivas": ".jpg",
    "aliada-joni-bl": ".jpg",
    "aliada-radio-ciguena": ".jpg",
    "aliada-upr-danzas": ".jpg",
    "companero-azu-adultis": ".jpg",
    "companero-elias-jovenes": ".png",
    "companero-juancar-adultis": ".png",
    "companero-julia-jovenes": ".png",
    "companero-miguel-adultis": ".jpg",
    "comprometida-diana-requena": ".jpg",
    "comprometida-pablo-voluntario": ".png",
    "corazon-clara-jovenes": ".jpg",
    "corazon-david-jovenes": ".jpg",
    "corazon-jorge-adultis": ".jpg",
    "corazon-moya-adultis": ".jpg",
    "creativo-agus-adultis": ".jpg",
    "creativo-brais-jovenes": ".jpg",
    "creativo-dani-adultis": ".jpg",
    "creativo-david-lorenzo-adultis": ".jpg",
    "creativo-guada-jovenes": ".jpg",
    "creativo-isa-equipo": ".png",
    "emergente-alejandro": ".png",
    "emergente-andrea-m": ".png",
    "emergente-carlos-adolescente": ".jpeg",
    "emergente-carol-jovenes": ".jpg",
    "emergente-jesus": ".png",
    "emergente-sergio-adolescentes": ".jpeg",
    "evolucion-carlos-jovenes": ".jpg",
    "evolucion-dani-jovenes": ".png",
    "evolucion-domingo-adultis": ".jpg",
    "evolucion-estela-jovenes": ".jpg",
    "evolucion-pablo-m-adultis": ".jpg",
    "inspirador-jose-adultis": ".jpg",
    "inspirador-mery": ".jpg",
    "inspirador-paloma": ".png",
    "inspirador-sergio-adultis": ".jpg",
    "legendario-laura-pichi": ".png",
    "legendario-martus": ".jpg",
    "legendario-yudith": ".jpg",
    "motor-eder-adolescentes": ".jpeg",
    "motor-lorena-adultxs": ".jpg",
    "motor-lucia-adultis": ".jpg",
    "pionero-christian-jovenes": ".jpg",
    "pionero-isa-adultis": ".jpg",
    "pionero-raul-adultis": ".jpg",
    "pionero-susi-adolescentes": ".jpeg",
    "pionero-vanesa-adultis": ".jpg",
    "puente-casas": ".jpg",
    "puente-gari": ".jpg",
    "puente-richard-jovenes": ".jpg",
    "referente-andrea-s": ".jpg",
    "referente-david-apoyo": ".jpg",
    "referente-quino": ".jpg",
    "valiente-alina-adultis": ".jpg",
    "valiente-alvaro-jovenes": ".jpg",
    "valiente-galisteo-adultis": ".jpg",
    "valiente-juanky": ".jpg",
};

function nominado(id: string, nombre: string): Nominado {
    const ext = FOTOS_DISPONIBLES[id];
    return { id, nombre, fotoUrl: ext ? `/fotos-nominados/${id}${ext}` : undefined };
}

export const CATEGORIAS: Categoria[] = [
    {
        id: "gatuna-legendario",
        titulo: "Gatuna/o legendario",
        descripcion: "Por una trayectoria que ha dejado huella.",
        nominados: [
            nominado("legendario-diana-lima", "Diana Lima"),
            nominado("legendario-martus", "Martus"),
            nominado("legendario-laura-pichi", "Laura (Pichi)"),
            nominado("legendario-candela", "Candela"),
            nominado("legendario-yudith", "Yudith"),
        ],
    },
    {
        id: "gatuna-pionero",
        titulo: "Gatuna/o pionero",
        descripcion: "Por estar desde los inicios y abrir camino.",
        nominados: [
            nominado("pionero-isa-adultis", "Isa (adultis)"),
            nominado("pionero-vanesa-adultis", "Vanesa (adultis)"),
            nominado("pionero-raul-adultis", "Raúl (adultis)"),
            nominado("pionero-christian-jovenes", "Christian (jóvenes)"),
            nominado("pionero-susi-adolescentes", "Susi (adolescentes)"),
        ],
    },
    {
        id: "gatuna-referente",
        titulo: "Gatuna/o referente",
        descripcion: "Persona que inspira dentro y fuera de la asociación.",
        nominados: [
            nominado("referente-quino", "Quino"),
            nominado("referente-david-apoyo", "David (apoyo)"),
            nominado("referente-andrea-s", "Andrea S."),
            nominado("referente-samu", "Samu"),
        ],
    },
    {
        id: "gatuna-comprometida",
        titulo: "Gatuna/o comprometida/o",
        descripcion: "Por su dedicación constante.",
        nominados: [
            nominado("comprometida-diana-requena", "Diana Requena"),
            nominado("comprometida-yaiza", "Yaiza"),
            nominado("comprometida-juli", "Juli"),
            nominado("comprometida-monica", "Mónica"),
            nominado("comprometida-pablo-voluntario", "Pablo (voluntario)"),
        ],
    },
    {
        id: "gatuna-motor",
        titulo: "Gatuna/o motor",
        descripcion: "Persona que impulsa al grupo y hace que las cosas pasen.",
        nominados: [
            nominado("motor-lorena-adultxs", "Lorena (adultxs)"),
            nominado("motor-violeta-jovenes", "Violeta (jóvenes)"),
            nominado("motor-eder-adolescentes", "Éder (adolescentes)"),
            nominado("motor-lucia-adultis", "Lucía (adultis)"),
        ],
    },
    {
        id: "gatuna-emergente",
        titulo: "Gatuna/o emergente",
        descripcion: "Persona que ha entrado recientemente en el Gato con mucha fuerza.",
        nominados: [
            nominado("emergente-carlos-adolescente", "Carlos (adolescente)"),
            nominado("emergente-andrea-m", "Andrea M."),
            nominado("emergente-sergio-adolescentes", "Sergio (adolescentes)"),
            nominado("emergente-carol-jovenes", "Carol (jóvenes)"),
            nominado("emergente-alvaro-gestor", "Álvaro (gestor)"),
            nominado("emergente-jesus", "Jesús"),
            nominado("emergente-alejandro", "Alejandro"),
        ],
    },
    {
        id: "entidad-aliada",
        titulo: "Entidad aliada",
        descripcion: "Por apoyar al Gato durante estos años.",
        nominados: [
            nominado("aliada-radio-ciguena", "Radio Cigüeña"),
            nominado("aliada-ayto-rivas", "Ayuntamiento de Rivas-Vaciamadrid"),
            nominado("aliada-caixa-rivas", "Sucursal La Caixa Rivas"),
            nominado("aliada-upr-danzas", "Universidad Popular de Rivas (Festival de Danzas orientales)"),
            nominado("aliada-joni-bl", "Joni. BL (libro solidario)"),
        ],
    },
    {
        id: "gatuna-evolucion",
        titulo: "Gatuna/o en evolución",
        descripcion: "Por su crecimiento personal.",
        nominados: [
            nominado("evolucion-carlos-jovenes", "Carlos (jóvenes)"),
            nominado("evolucion-domingo-adultis", "Domingo (adultis)"),
            nominado("evolucion-pablo-m-adultis", "Pablo M. (adultis)"),
            nominado("evolucion-estela-jovenes", "Estela (jóvenes)"),
            nominado("evolucion-dani-jovenes", "Dani (jóvenes)"),
        ],
    },
    {
        id: "gatuno-valiente",
        titulo: "Gatuna/o valiente",
        descripcion: "Por afrontar nuevos desafíos.",
        nominados: [
            nominado("valiente-galisteo-adultis", "Galisteo (adultis)"),
            nominado("valiente-alvaro-jovenes", "Álvaro (jóvenes)"),
            nominado("valiente-juanky", "Juanky"),
            nominado("valiente-alina-adultis", "Alina (adultis)"),
            nominado("valiente-diego-adolescentes", "Diego (adolescentes)"),
        ],
    },
    {
        id: "gatuno-creativo",
        titulo: "Gatuna/o creativo",
        descripcion: "Por aportar ideas nuevas.",
        nominados: [
            nominado("creativo-isa-equipo", "Isa (equipo)"),
            nominado("creativo-brais-jovenes", "Brais (jóvenes)"),
            nominado("creativo-david-lorenzo-adultis", "David Lorenzo (adultis)"),
            nominado("creativo-agus-adultis", "Agus (adultis)"),
            nominado("creativo-guada-jovenes", "Guada (jóvenes)"),
            nominado("creativo-dani-adultis", "Dani (adultis)"),
        ],
    },
    {
        id: "gatuno-inspirador",
        titulo: "Gatuna/o inspirador",
        descripcion: "Por motivar a otros con su actitud y energía.",
        nominados: [
            nominado("inspirador-mery", "Mery"),
            nominado("inspirador-jose-adultis", "Jose (adultis)"),
            nominado("inspirador-javi-adolescentes", "Javi (adolescentes)"),
            nominado("inspirador-sergio-adultis", "Sergio (adultis)"),
            nominado("inspirador-paloma", "Paloma"),
        ],
    },
    {
        id: "gatuno-puente",
        titulo: "Gatuna/o puente",
        descripcion: "Por conectar personas y generaciones y crear comunidad.",
        nominados: [
            nominado("puente-gari", "Gari"),
            nominado("puente-casas", "Casas"),
            nominado("puente-richard-jovenes", "Richard (jóvenes)"),
            nominado("puente-cris-de-tena", "Cris de Tena"),
            nominado("puente-oscar-jovenes", "Óscar (jóvenes)"),
        ],
    },
    {
        id: "gatuno-companero",
        titulo: "Gatuna/o compañero",
        descripcion: "Por su apoyo constante a los demás.",
        nominados: [
            nominado("companero-juancar-adultis", "Juancar (adultis)"),
            nominado("companero-elias-jovenes", "Elías (jóvenes)"),
            nominado("companero-azu-adultis", "Azu (adultis)"),
            nominado("companero-miguel-adultis", "Miguel (adultis)"),
            nominado("companero-lauri-jovenes", "Lauri (jóvenes)"),
            nominado("companero-julia-jovenes", "Julia (jóvenes)"),
        ],
    },
    {
        id: "gatuno-corazon",
        titulo: "Gatuna/o de corazón",
        descripcion: "Por su calidad humana.",
        nominados: [
            nominado("corazon-moya-adultis", "Moya (adultis)"),
            nominado("corazon-clara-jovenes", "Clara (jóvenes)"),
            nominado("corazon-jorge-adultis", "Jorge (adultis)"),
            nominado("corazon-david-jovenes", "David (jóvenes)"),
            nominado("corazon-rodrigo-adolescentes", "Rodrigo (adolescentes)"),
        ],
    },
];