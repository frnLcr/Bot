const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

// Flujos secundarios
const flowVolverMenu = addKeyword(['menu', '7', 'volver', 'inicio'])
    .addAnswer('↩️ Volviendo al menú principal...')
    .addAnswer([
        '🔄 Seleccione una opción:',
        '',
        '1️⃣ Ver dirección y ubicación',
        '2️⃣ Consultar horarios de atención',
        '3️⃣ Hablar con un asesor',
        '4️⃣ Contactar soporte técnico',
        '5️⃣ Ver foto de la empresa',
        '6️⃣ Finalizar bot',
    ])

const flowUbicacion = addKeyword(['1', 'ubicacion', 'direccion', 'donde'])
    .addAnswer([
        '📍 *Nuestra dirección es:*',
        'Olga Orozco 2855, Nuevo Poeta Lugones'
    ])
    // Enviamos primero la dirección en texto para asegurar que llegue
    .addAnswer([
        '🗺️ Link directo a Google Maps:',
        'https://maps.app.goo.gl/ufec8A4TtuSgcVS67'
    ])
    .addAnswer([
        '📱 Escriba *menu* para volver al menú principal'
    ], null, null, [flowVolverMenu])

const flowHorarios = addKeyword(['2', 'horario', 'horarios', 'atencion'])
    .addAnswer([
        '⏰ *Nuestros horarios de atención es:*',
        'Lunes a Viernes de 9:00 a 18:00',
        '',
        '📱 Escriba *menu* para volver al menú principal'
    ], null, null, [flowVolverMenu])

const flowAsesor = addKeyword(['3', 'asesor', 'ventas', 'comercial'])
    .addAnswer([
        '👨‍💼 *Contacto del asesor comercial:*',
    ])
    .addAnswer(['*Fernando Lucero*',
        'WhatsApp/Teléfono: +54 351 616-5091',])
    .addAnswer([
        '✅ Puede contactarlo directamente',
        '',
        '📱 Escriba *menu* para volver al menú principal'
        ], null, null, [flowVolverMenu])

    const flowTecnico = addKeyword(['4', 'tecnico', 'soporte', 'ayuda'])
    .addAnswer([
        '👨‍🔧 *Contacto del soporte técnico:*'
    ])
    .addAnswer([
        '*Alejandro Sosa*',
        'WhatsApp/Teléfono: +54 9 351 619-6983'
    ])
    .addAnswer([
        '*Cristian Lobato*',
        'WhatsApp/Teléfono: +54 9 351 256-7768'
    ])
    .addAnswer([
        '*Santiago Quinteros*',
        'WhatsApp/Teléfono: +54 9 351 758-6762'
    ])
    .addAnswer([
        '✅ Puede contactar a cualquiera de nuestros técnicos directamente',
        '',
        '📱 Escriba *menu* para volver al menú principal'
    ], null, null, [flowVolverMenu])

const flowFoto = addKeyword(['5', 'foto', 'imagen', 'empresa'])
    .addAnswer([
        '🏢 *Nuestra empresa:*',
        'Enviando imagen...'
    ])
    .addAnswer('📍 *Sede de nuestra empresa:*', {
        media: 'https://i.imgur.com/gOBAKUe.jpeg'
    })
    .addAnswer(['Visítanos en nuestra ubicación:', 'https://maps.app.goo.gl/ufec8A4TtuSgcVS67'])
    .addAnswer([
        '📱 Escriba *menu* para volver al menú principal'
    ], null, null, [flowVolverMenu])

const flowNoReconocido = addKeyword(['error'])
    .addAnswer([
        '❌ No he podido entender su solicitud.',
        'Por favor, seleccione una de las siguientes opciones:',
        '',
        '1️⃣ Ver dirección y ubicación',
        '2️⃣ Consultar horarios de atención',
        '3️⃣ Hablar con un asesor',
        '4️⃣ Contactar soporte técnico',
        '5️⃣ Ver foto de la empresa',
        '6️⃣ Finalizar bot',

    ])

const flowTerminar = addKeyword(['6','terminar', 'cortar', 'apagar', 'finalizar'])
.addAnswer([
    '🚀 Muchas gracias por comunicarte con Importadora Latinoamericana',
])
.addAnswer([
    '🔄 Para conversar con el bot nuevamente, escriba "hola"',
])

const flowPrincipal = addKeyword([
    'hola', 'buenos dias', 'buenas tardes', 'buenas noches', 
    'hi', 'hello', 'ola', 'ole', 'inicio', 'empezar', 'comenzar', 'hola ale', 'ale', 'hermano',
])
    .addAnswer([
        '👋 ¡Hola! Soy el asistente virtual de la empresa',
        '*[Versión Experimental]*'
    ])
    .addAnswer([
        '🔄 ¿En qué puedo ayudarte?',
        '',
        'Selecciona una opción:',
        '',
        '1️⃣ Ver dirección y ubicación',
        '2️⃣ Consultar horarios de atención',
        '3️⃣ Hablar con un asesor',
        '4️⃣ Contactar soporte técnico',
        '5️⃣ Ver foto de la empresa',
        '6️⃣ Finalizar bot',
    ], 
    null, 
    null, 
    [flowUbicacion, flowHorarios, flowAsesor, flowTecnico, flowFoto, flowVolverMenu, flowNoReconocido, flowTerminar]
)

const main = async () => {
    try {
        const adapterDB = new MockAdapter()
        const adapterFlow = createFlow([
            flowPrincipal,
            flowUbicacion,
            flowHorarios,
            flowAsesor,
            flowTecnico,
            flowFoto,
            flowVolverMenu,
            flowNoReconocido,
            flowTerminar
        ])
        const adapterProvider = createProvider(BaileysProvider)

        createBot({
            flow: adapterFlow,
            provider: adapterProvider,
            database: adapterDB,
        })

        QRPortalWeb()
    } catch (error) {
        console.error('Error al iniciar el bot:', error)
        process.exit(1)
    }
}

// Manejo de errores globales
process.on('unhandledRejection', (error) => {
    console.error('Error no manejado:', error)
})

process.on('uncaughtException', (error) => {
    console.error('Excepción no capturada:', error)
    process.exit(1)
})

main().catch((error) => {
    console.error('Error en la función principal:', error)
    process.exit(1)
})