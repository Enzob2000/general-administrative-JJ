import React from "react";
import {
  FaShieldAlt,
  FaLock,
  FaUserCheck,
  FaMobileAlt,
  FaSyncAlt,
  FaEnvelope,
  FaExternalLinkAlt,
  FaCookie,
  FaChild,
  FaInfoCircle,
} from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";

export default function PrivacyPolicy() {
  const today = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans w-full">
      <div className="max-w-5xl mx-auto">
        {/* Card Principal */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-100">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black p-10 sm:p-16 text-center">
            <div className="inline-flex p-4 rounded-2xl bg-white/10 mb-6 backdrop-blur-md border border-white/20">
              <FaShieldAlt className="text-5xl text-blue-400" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Política de Privacidad
            </h1>
            <p className="text-blue-300 text-xl font-medium opacity-90">
              [Nombre de tu Aplicación]
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 text-slate-400 text-sm bg-black/20 w-fit mx-auto px-4 py-2 rounded-full">
              <FaSyncAlt className="animate-spin-slow text-blue-400" />
              <span>Efectiva a partir del {today}</span>
            </div>
          </div>

          <div className="p-8 sm:p-16 space-y-16">
            {/* Introducción y Contexto */}
            <section className="prose prose-slate max-w-none">
              <div className="flex items-center gap-3 mb-6">
                <HiOutlineDocumentText className="text-4xl text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900 m-0">
                  Información General
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg">
                <span className="font-bold text-slate-900">
                  [Nombre de tu Aplicación]
                </span>{" "}
                (en adelante, "la Aplicación") ha sido desarrollada por{" "}
                <span className="font-semibold text-blue-600">
                  [Tu Nombre o Nombre de tu Empresa]
                </span>{" "}
                como una aplicación de tipo{" "}
                <span className="italic">[Gratuita / Comercial]</span>. Este
                SERVICIO es proporcionado por [Tu Nombre] sin coste alguno [o
                "tal cual" si es de pago] y está diseñado para ser utilizado tal
                cual.
              </p>
              <p className="text-slate-600 leading-relaxed mt-4">
                Esta página se utiliza para informar a los visitantes sobre
                nuestras políticas con la recopilación, el uso y la divulgación
                de información personal si alguien decide utilizar nuestro
                Servicio. Si elige utilizar nuestro Servicio, acepta la
                recopilación y el uso de información en relación con esta
                política.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
                <p className="text-blue-800 text-sm font-medium m-0">
                  La información personal que recopilamos se utiliza para
                  proporcionar y mejorar el Servicio. No utilizaremos ni
                  compartiremos su información con nadie, excepto como se
                  describe en esta Política de Privacidad.
                </p>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Grid de Secciones Detalladas */}
            <div className="grid grid-cols-1 gap-12">
              {/* Recopilación y Uso */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                    <FaUserCheck size={28} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Recopilación y Uso de la Información
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Para una mejor experiencia al usar nuestro Servicio, es
                    posible que le solicitemos que nos proporcione cierta
                    información de identificación personal, incluyendo pero no
                    limitado a:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none p-0">
                    <li className="flex items-center gap-2 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <strong>Autenticación:</strong> Número de teléfono o
                      correo electrónico para fines de inicio de sesión único.
                    </li>
                    <li className="flex items-center gap-2 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <strong>Funcionamiento:</strong> Datos necesarios para que
                      la aplicación funcione en su dispositivo.
                    </li>
                  </ul>
                  <p className="mt-4 p-4 bg-emerald-50 text-emerald-800 rounded-xl text-sm italic border border-emerald-100">
                    <strong>Aclaración Importante:</strong> La información que
                    solicitamos será retenida por nosotros y utilizada como se
                    describe en esta política de privacidad. No vendemos,
                    comercializamos ni alquilamos su información de
                    identificación personal a terceros.
                  </p>
                </div>
              </div>

              {/* Terceros */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="p-4 bg-slate-800 text-white rounded-2xl">
                    <FaExternalLinkAlt size={28} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    Servicios de Terceros
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    La aplicación utiliza servicios de terceros que pueden
                    recopilar información utilizada para identificarlo
                    (necesario para el funcionamiento técnico de la app en
                    Android).
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {["Google Play Services", "Firebase Auth / Analytics"].map(
                      (service) => (
                        <span
                          key={service}
                          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 shadow-sm flex items-center gap-2 hover:border-blue-300 transition-colors cursor-default"
                        >
                          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                          {service}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* Sección: Logs y Cookies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                  <FaMobileAlt className="text-3xl text-blue-600 mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    Datos de Registro (Log Data)
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Queremos informarle que cada vez que utiliza nuestro
                    Servicio, en caso de error en la aplicación, recopilamos
                    datos e información (a través de productos de terceros) en
                    su teléfono llamado Datos de Registro. Estos datos de
                    registro pueden incluir información como la dirección de
                    Protocolo de Internet (IP) de su dispositivo, la versión del
                    sistema operativo, la configuración de la aplicación cuando
                    utiliza nuestro Servicio, la hora y fecha de su uso del
                    Servicio y otras estadísticas. Estos datos son puramente
                    técnicos y no se utilizan para rastrear su actividad con
                    fines publicitarios.
                  </p>
                </div>
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                  <FaCookie className="text-3xl text-amber-500 mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    Cookies
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Esta aplicación no utiliza explícitamente 'cookies' para
                    fines de marketing o seguimiento directo por parte de los
                    propietarios. Sin embargo, para garantizar un funcionamiento
                    óptimo, la plataforma integra códigos y bibliotecas de
                    terceros (como servicios de autenticación, análisis de
                    rendimiento y proveedores de infraestructura) que pueden
                    implantar cookies en su dispositivo.
                  </p>
                </div>
              </div>

              {/* Sección: Seguridad, Enlaces y Niños (Ajustado con bordes y nuevos iconos) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Seguridad */}
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <FaLock className="text-3xl text-emerald-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Seguridad
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Valoramos su confianza al proporcionarnos su información
                    personal, por lo que nos esforzamos por utilizar medios
                    comercialmente aceptables para protegerla. Pero recuerde que
                    ningún método de transmisión a través de Internet o método
                    de almacenamiento electrónico es 100% seguro y confiable.
                  </p>
                </div>

                {/* Enlaces a Otros Sitios */}
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <FaExternalLinkAlt className="text-3xl text-purple-600" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Enlaces a Otros Sitios
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Este Servicio puede contener enlaces a otros sitios. Si hace
                    clic en un enlace de un tercero, será dirigido a ese sitio.
                    Tenga en cuenta que estos sitios externos no son operados
                    por nosotros. Le recomendamos revisar su Política de
                    Privacidad.
                  </p>
                </div>

                {/* Privacidad de los Niños */}
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-3 mb-4">
                    <FaChild className="text-3xl text-pink-500" />
                    <h3 className="text-lg font-bold text-slate-900">
                      Privacidad de los Niños
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    No recopilamos a sabiendas información de niños menores de
                    13 años. Si descubrimos que un niño nos ha proporcionado
                    información personal, la eliminamos inmediatamente. Si es
                    padre o tutor, por favor contáctenos para realizar las
                    acciones necesarias.
                  </p>
                </div>
              </div>
            </div>

            {/* Cambios en la política */}
            <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
              <div className="flex items-center gap-3 mb-4">
                <FaInfoCircle className="text-2xl text-amber-600" />
                <h3 className="text-xl font-bold text-slate-900 m-0">
                  Cambios a Esta Política de Privacidad
                </h3>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                ​Es posible que actualicemos nuestra Política de Privacidad de
                vez en cuando. Por lo tanto, se le recomienda revisar esta
                página periódicamente para ver si hay cambios. Le notificaremos
                cualquier cambio publicando la nueva Política de Privacidad en
                esta página. ​Esta política es efectiva a partir del [Fecha de
                hoy].
              </p>
            </div>

            {/* Footer de Contacto */}
            <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                  ¿Preguntas o sugerencias?
                </h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  Si tiene alguna duda sobre nuestra política de privacidad, no
                  dude en contactarnos.
                </p>
                <a
                  href="mailto:[Tu Correo Electrónico]"
                  className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-900/20 active:scale-95"
                >
                  <FaEnvelope />
                  [Tu Correo Electrónico]
                </a>
              </div>
              {/* Decoración de fondo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/10 rounded-full -ml-16 -mb-16 blur-3xl"></div>
            </div>
          </div>

          {/* Copyright Final */}
          <div className="bg-slate-50 border-t border-slate-100 p-8 text-center">
            <p className="text-slate-400 text-xs tracking-widest uppercase font-semibold">
              © {new Date().getFullYear()} [Tu Nombre o Empresa] • Todos los
              derechos reservados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
