const readlineSync = require('readline-sync');

class Profesor {
    #tarifaHora;
    #horasTrabajadas;
    constructor(nombre, tipo, tarifaHora, horasTrabajadas, titulacion) {
        if (!nombre) {
            throw new Error(`El profesor requiere un nombre.`);
        }
        if (!tipo) {
            throw new Error(`El profesor debe tener al menos un tipo seleccionado.`);
        }
        if (!tarifaHora || tarifaHora < 0) {
            throw new Error(`El profesor debe tener una tarifa por hora definida válida.`);
        }
        if (!horasTrabajadas || horasTrabajadas < 0) {
            throw new Error(`El profesor debe tener horas trabajadas definidas válidas.`);
        }
        this.nombre = nombre;
        this.tipo = tipo;
        this.tarifaHora = tarifaHora;
        this.horasTrabajadas = horasTrabajadas;
        this.programas = [];
        this.asignaturas = [];
        this.titulacion = titulacion;
    }

    get tarifaHora() {
        return this.#tarifaHora;
    }

    set tarifaHora(nuevoValorTarifa) {
        if (nuevoValorTarifa < 0) {
            throw new Error(`El valor de la tarifa no puede ser un valor negativo.`);
        }
        this.#tarifaHora = nuevoValorTarifa;
    }

    get horasTrabajadas() {
        return this.#horasTrabajadas;
    }

    set horasTrabajadas(nuevoValorHoras) {
        if (nuevoValorHoras < 0) {
            throw new Error(`El valor de las horas no puede ser negativo`);
        }
        this.#horasTrabajadas = nuevoValorHoras;
    }

    calcularSalario(programaTipo) {
        let salario = this.tarifaHora * this.horasTrabajadas;
        if (this.titulacion === 'maestria') {
            salario *= 1.07; // Recargo del 7% por maestría
        }
        if (programaTipo === 'diurno') {
            salario *= 1.1; // Recargo del 10% para programas diurnos   
        } else if (programaTipo === 'nocturno') {
            salario *= 1.15; // Recargo del 15% para programas nocturnos
        }
        return salario;
    }

    agregarHorasTrabajadas(horas) {
        this.horasTrabajadas += horas;
    }

    asignarPrograma(programa) {
        this.programas.push(programa);
    }

    asignarAsignatura(asignatura) {
        this.asignaturas.push(asignatura);
    }

    calcularHorasTrabajadas() {
        let totalHoras = 0;
        this.asignaturas.forEach(asignatura => {
            totalHoras += asignatura.horas;
        });
        return totalHoras;
    }
}

class ProfesorPlanta extends Profesor {
    constructor(nombre, tarifaHora, horasTrabajadas, titulacion) {
        super(nombre, 'planta', tarifaHora, horasTrabajadas, titulacion);
    }

    mostrarTipo() {
        return `Soy un profesor de planta.`;
    }

    calcularSalario(programaTipo) {
        let salario = super.calcularSalario(programaTipo);
        return salario;
    }
}

class ProfesorCatedratico extends Profesor {
    constructor(nombre, tarifaHora, horasTrabajadas, titulacion) {
        super(nombre, 'catedratico', tarifaHora, horasTrabajadas, titulacion);
    }

    mostrarTipo() {
        return `Soy un profesor catedrático.`;
    }

    calcularSalario(programaTipo) {
        let salario = super.calcularSalario(programaTipo);
        return salario;
    }
}

class ProfesorCatedraticoAsociado extends Profesor {
    constructor(nombre, tarifaHora, horasTrabajadas, titulacion) {
        super(nombre, 'catedratico asociado', tarifaHora, horasTrabajadas, titulacion);
    }

    mostrarTipo() {
        return `Soy un profesor catedrático asociado.`;
    }

    calcularSalario(programaTipo) {
        let salario = super.calcularSalario(programaTipo) * 1.07;
        return salario;
    }
}

class Programa {
    constructor(nombre, tipo) {
        if (!nombre) {
            throw new Error(`El programa requiere un nombre.`);
        }
        if (!tipo) {
            throw new Error(`El programa requiere saber si es diurno o nocturno.`);
        }
        this.nombre = nombre;
        this.tipo = tipo;
        this.asignaturas = [];
        this.profesoresAsignados = [];
    }

    agregarAsignatura(asignatura) {
        this.asignaturas.push(asignatura);
    }

    obtenerTipo() {
        return this.tipo;
    }
}

class Asignatura {
    #horas;
    constructor(nombre, horas, requiereMaestria) {
        if (!nombre) {
            throw new Error(`La asignatura debe tener un nombre.`);
        }
        if (!horas || horas < 0) {
            throw new Error(`La asignatura debe tener horas definidas válidas.`);
        }
        this.nombre = nombre;
        this.horas = horas;
        this.requiereMaestria = requiereMaestria;
        this.profesor = null;
    }

    get horas() {
        return this.#horas;
    }

    set horas(nuevoValorHoras) {
        if (nuevoValorHoras < 0) {
            throw new Error(`El valor de las horas no puede ser negativo.`);
        }
        this.#horas = nuevoValorHoras;
    }

    asignarProfesor(profesor) {
        this.profesor = profesor;
    }
}

function calcularProemdioCostoProfesoresDia() {
    const profesoresDia = profesores.filter(profesor => {
        return profesor.programas.some(p => p.obtenerTipo() === 'diurno');
    });

    let costoTotalProfesorDia = 0;
    profesoresDia.forEach(profesor => {
        costoTotalProfesorDia += profesor.calcularSalario('diurno');
    });

    const ProemdioCostoProfesoresDia = costoTotalProfesorDia / profesoresDia.length;

    console.log(`El promedio de costo de los profesores que dan clases en el dia es: $${ProemdioCostoProfesoresDia.toFixed(2)}`);
}

function calcularCostoTotalNomina(programa) {
    const profesoresEnPrograma = profesores.filter(profesor => {
        return profesor.programas.some(p => p.nombre === programa);
    });

    let costoTotalNomina = 0;
    profesoresEnPrograma.forEach(profesor => {
        costoTotalNomina += profesor.calcularSalario();
    });

    console.log(`El costo total de la nomina del programa ${programa} es: $${costoTotalNomina}`);
}

function calcularSalarioProfesoresCatedraticos() {
    const profesoresCatedraticos = profesores.filter(profesor => profesor.tipo.toLowerCase() === 'catedratico');
    let costoTotalProfesoresCatedraticos = 0;

    profesoresCatedraticos.forEach(profesor => {
        costoTotalProfesoresCatedraticos += profesor.calcularSalario();
    });

    console.log(`El costo total de los salarios de los profesores catedraticos es: $${costoTotalProfesoresCatedraticos}`);
}

function contarProfesoresConMaestria(profesores){
    let contadorMaestria = 0;

    profesores.forEach(profesor => {
        if (profesor.titulacion.toLowerCase() === 'maestria'){
            contadorMaestria++;
        }
    });

    console.log(`El numero de profesores con maestria es: ${contadorMaestria}`);
}

function ingresarDatosProfesor() {
    const nombreProfesor = readlineSync.question(`Ingrese el nombre del profesor: `);
    const tipoProfesor = readlineSync.question(`Ingrese el tipo del profesor: `);
    const tarifaHora = parseFloat(readlineSync.question(`Ingrese la tarifa por hora del profesor: `));
    const horasTrabajadas = parseFloat(readlineSync.question(`Ingrese las horas trabajadas del profesor: `));
    const titulacion = readlineSync.question(`Ingrese la titulacion del profesor: `);
    const horasExtra = readlineSync.question(`El profesor hizo horas extra? (si/no): `);
    let pagoTotal;

    if (horasExtra.toLowerCase() === 'si') {
        const horasExtras = parseFloat(readlineSync.question(`Ingrese la cantidad de horas extra trabajadas: `));
        pagoTotal = (horasTrabajadas + horasExtras) * tarifaHora;
    } else {
        pagoTotal = horasTrabajadas * tarifaHora;
    }

    return {
        nombre: nombreProfesor,
        tipo: tipoProfesor,
        tarifaHora: tarifaHora,
        horasTrabajadas: horasTrabajadas,
        titulacion: titulacion,
        pagoTotal: pagoTotal
    };
}

function crearProfesor(datosProfesor) {
    switch (datosProfesor.tipo.toLowerCase()) {
        case 'planta':
            return new ProfesorPlanta(datosProfesor.nombre, datosProfesor.tarifaHora, datosProfesor.horasTrabajadas, datosProfesor.titulacion);
        case 'catedratico':
            return new ProfesorCatedratico(datosProfesor.nombre, datosProfesor.tarifaHora, datosProfesor.horasTrabajadas, datosProfesor.titulacion);
        case 'catedratico asociado':
            return new ProfesorCatedraticoAsociado(datosProfesor.nombre, datosProfesor.tarifaHora, datosProfesor.horasTrabajadas, datosProfesor.titulacion);
        default:
            throw new Error(`Tipo de profesor no valido.`);
    }
}

const programaIngenieria = new Programa('Ingenieria de Sistemas', 'diurno');
const programaPsicologia = new Programa('Psicologia', 'nocturno');

const asignatura1 = new Asignatura('Programacion', 4, true);
const asignatura2 = new Asignatura('Psicologia Social', 3, false);

programaIngenieria.agregarAsignatura(asignatura1);
programaIngenieria.agregarAsignatura(asignatura2);

const cantidadProfesores = parseInt(readlineSync.question(`Ingrese la cantidad de profesores a registrar: `));

let costoTotal = 0;
let costoTotalPlanta = 0;

const profesores = [];

for (let i = 0; i < cantidadProfesores; i++) {
    console.log(`Ingrese los datos del profesor ${i + 1}:`);
    const datosProfesor = ingresarDatosProfesor();
    const nuevoProfesor = crearProfesor(datosProfesor);
    console.log('Lista de programas disponibles: ');
    console.log('1. Ingenieria de Sistemas (diurno)');
    console.log('2. Psicologia (nocturno)');
    const opcionPrograma = parseInt(readlineSync.question('Seleccione un programa (1 o 2): '));
    if (opcionPrograma !== 1 && opcionPrograma !== 2) {
        throw new Error(`Opcion de programa no valida.`);
    }

    switch (opcionPrograma) {
        case 1:
            nuevoProfesor.asignarPrograma(programaIngenieria);
            break;
        case 2:
            nuevoProfesor.asignarPrograma(programaPsicologia);
            break;
        default:
            throw new Error('Opción de programa no válida.');
    }

    profesores.push(nuevoProfesor);
}

console.log('Información de los profesores:');
profesores.forEach((profesor, index) => {
    costoTotal += profesor.calcularSalario();
    if (profesor.tipo === 'planta') {
        costoTotalPlanta += profesor.calcularSalario(); // Sumar al costo total solo si es de tipo "planta"
    }
    console.log(`Profesor ${index + 1}:`);
    console.log(`Nombre: ${profesor.nombre}`);
    console.log(`Tipo: ${profesor.tipo}`);
    console.log(`El salario de ${profesor.nombre} es: $${profesor.calcularSalario()}`);
    console.log(`Se ha asignado el programa "${profesor.programas[0].nombre}" al profesor ${profesor.nombre}.`);
});

console.log(`El costo total de los salarios de todos los profesores es: $${costoTotal}`);
console.log(`El costo total de los salarios de los profesores de planta es: $${costoTotalPlanta}`);

calcularCostoTotalNomina('Ingenieria de Sistemas');
calcularCostoTotalNomina('Psicologia');
calcularProemdioCostoProfesoresDia();
calcularSalarioProfesoresCatedraticos();
contarProfesoresConMaestria(profesores);
