import type { Metadata } from "next";
import LegalPageLayout from "@/components/layout/LegalPageLayout";

export const metadata: Metadata = {
  title: "Aviso de Privacidad Integral — VaroListo.mx",
  description:
    "Aviso de Privacidad Integral de VaroListo.mx conforme a la Ley Federal de Protección de Datos Personales en Posesión de Particulares.",
};

export default function AvisoPrivacidadPage() {
  return (
    <LegalPageLayout
      titulo="Aviso de Privacidad Integral"
      fechaActualizacion="Abril 2026 · Actualización"
    >

        <p className="mb-6 leading-relaxed">
          En virtud de lo dispuesto por la{" "}
          <strong>
            Ley Federal de Protección de Datos Personales en Posesión de
            Particulares (LFPDPPP)
          </strong>
          , su Reglamento, los Lineamientos del Aviso de Privacidad y las demás
          disposiciones aplicables (en adelante conjuntamente &quot;la
          Ley&quot;), se emite el presente Aviso de Privacidad en los siguientes
          términos.
        </p>

        <p className="mb-10 leading-relaxed">
          Al solicitar un préstamo personal con VaroListo.mx, ya sea a través de
          nuestro sitio web, formulario de solicitud o por WhatsApp, aceptas el
          tratamiento de tus datos personales conforme a lo establecido en el
          presente Aviso. Asimismo, hacemos de tu conocimiento que podremos dar
          tratamiento a tus datos personales sin necesidad de obtener tu
          consentimiento previo en cualquiera de los supuestos considerados en
          el <strong>artículo 10 de la LFPDPPP</strong>.
        </p>

        {/* I */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          I. Responsable de los datos personales
        </h2>
        <p className="mb-10 leading-relaxed">
          Para efectos del presente Aviso de Privacidad,{" "}
          <strong>Sebastian Martha García</strong>, persona física con actividad
          empresarial (en adelante &quot;el Responsable&quot; o
          &quot;VaroListo&quot;, indistintamente), con domicilio en Tapachula,
          Chiapas, México, y contacto en <strong>contacto@varolisto.mx</strong>,
          es el responsable en los términos de la Ley de la obtención,
          divulgación, almacenamiento y uso —incluido acceso, manejo,
          aprovechamiento, transferencia o disposición (en adelante el
          &quot;Tratamiento&quot;)— de los datos personales que recabe de sus
          clientes y usuarios (en adelante el/los &quot;Titular(es)&quot;).
        </p>

        {/* II */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          II. Datos personales que recabamos
        </h2>
        <p className="mb-4 leading-relaxed">
          Para la evaluación, formalización y administración de tu crédito, el
          Responsable podrá recabar las siguientes categorías de datos
          personales:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-800 leading-relaxed">
          <li>
            <strong>Identificación:</strong> nombre completo, INE o pasaporte,
            RFC (cuando se cuente con él), fecha de nacimiento y estado civil.
          </li>
          <li>
            <strong>Contacto:</strong> domicilio, número de teléfono, correo
            electrónico y referencias personales (nombre y teléfono).
          </li>
          <li>
            <strong>Laborales y financieros:</strong> empleo actual, antigüedad
            laboral, ingresos mensuales, comprobante de nómina, CFDI, estados de
            cuenta o documentación de negocio propio, deudas activas y CLABE
            interbancaria.
          </li>
        </ul>
        <p className="mb-10 leading-relaxed">
          VaroListo.mx <strong>no recaba datos sensibles</strong> —biométricos,
          de salud, ideología política, creencias religiosas, vida sexual u
          origen étnico— como parte de su operación ordinaria.
        </p>

        {/* III */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          III. Finalidades del tratamiento
        </h2>
        <p className="mb-3 leading-relaxed">
          VaroListo.mx utiliza tus datos personales para las siguientes{" "}
          <strong>finalidades primarias</strong>, necesarias para la prestación
          del servicio y la relación jurídica:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-800 leading-relaxed">
          <li>Identificación y verificación de identidad del solicitante.</li>
          <li>Integración del expediente de información del cliente.</li>
          <li>
            Evaluación de tu solicitud de préstamo conforme a los criterios de
            capacidad de pago de VaroListo.mx.
          </li>
          <li>
            Elaboración, envío y gestión de la firma digital del pagaré y
            contrato de crédito a través de ZapSign.
          </li>
          <li>
            Administración del cobro de mensualidades y control del saldo de tu
            crédito.
          </li>
          <li>
            Atención de consultas, dudas, aclaraciones o quejas del cliente.
          </li>
          <li>
            Envío de recordatorios de pago, notificaciones de vencimiento y
            estados de cuenta por WhatsApp o correo electrónico.
          </li>
          <li>Cumplimiento de obligaciones de carácter fiscal o comercial.</li>
          <li>
            Estadística y registro histórico de clientes para mejora del modelo
            crediticio interno.
          </li>
          <li>
            Mantenimiento de la seguridad de la información y de la operación.
          </li>
          <li>
            En caso de incumplimiento, gestiones de cobranza extrajudicial de
            forma ética y conforme a la ley, incluyendo el contacto a las
            referencias que autorizaste.
          </li>
        </ul>

        <p className="mb-3 leading-relaxed">
          Adicionalmente, con carácter <strong>secundario</strong> (puedes
          oponerte sin que ello afecte tu crédito ni sea motivo para negarte el
          servicio):
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4 text-gray-800 leading-relaxed">
          <li>
            Informarte sobre nuevos productos financieros, promociones o
            condiciones mejoradas disponibles en VaroListo.mx.
          </li>
          <li>
            Fines mercadotécnicos, publicitarios y/o de prospección comercial.
          </li>
          <li>
            Uso de datos anonimizados para análisis estadístico interno de
            comportamiento de pago.
          </li>
        </ul>
        <p className="mb-10 leading-relaxed">
          Para oponerte al uso de tus datos con finalidades secundarias, envía
          un correo a <strong>contacto@varolisto.mx</strong> con el asunto
          &quot;No deseo publicidad&quot;, indicando tu nombre completo. Tu
          solicitud será atendida sin afectar la administración de tu crédito.{" "}
          <strong>
            La negativa respecto al uso de tus datos para estas finalidades
            secundarias no será motivo para negarte el servicio.
          </strong>
        </p>

        {/* IV */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          IV. Transferencia de datos personales
        </h2>
        <p className="mb-4 leading-relaxed">
          VaroListo.mx podrá transferir, comunicar o remitir tus datos
          personales, en forma parcial o total, a los terceros que se indican a
          continuación. Las transferencias marcadas con <strong>(*)</strong>{" "}
          requieren tu consentimiento, el cual otorgas al aceptar el presente
          Aviso de Privacidad. Para el resto de las transferencias no se
          requiere consentimiento en virtud del{" "}
          <strong>artículo 37 de la LFPDPPP</strong>.
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 border border-gray-300 font-semibold w-1/4">
                  Receptor
                </th>
                <th className="text-left p-3 border border-gray-300 font-semibold w-1/6">
                  País
                </th>
                <th className="text-left p-3 border border-gray-300 font-semibold">
                  Finalidad
                </th>
                <th className="text-left p-3 border border-gray-300 font-semibold w-1/5">
                  Consentimiento
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-gray-300 font-medium">
                  ZapSign (zapsign.co)
                </td>
                <td className="p-3 border border-gray-300 text-gray-600">
                  Brasil / México
                </td>
                <td className="p-3 border border-gray-300 text-gray-600">
                  Procesamiento y custodia de firma electrónica avanzada de
                  documentos de crédito (pagaré y contrato).
                </td>
                <td className="p-3 border border-gray-300 text-sm">
                  No requerido — Art. 37 LFPDPPP
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border border-gray-300 font-medium">
                  Instituciones bancarias
                </td>
                <td className="p-3 border border-gray-300 text-gray-600">
                  México
                </td>
                <td className="p-3 border border-gray-300 text-gray-600">
                  Procesamiento de transferencias electrónicas y verificación de
                  CLABE interbancaria para el desembolso del crédito y recepción
                  de pagos.
                </td>
                <td className="p-3 border border-gray-300 text-sm">
                  No requerido — Art. 37 LFPDPPP
                </td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-300 font-medium">
                  Autoridades judiciales y/o ministeriales
                </td>
                <td className="p-3 border border-gray-300 text-gray-600">
                  México
                </td>
                <td className="p-3 border border-gray-300 text-gray-600">
                  Ejecución del pagaré ante juzgado civil mercantil en caso de
                  incumplimiento de pago, conforme al Art. 170 LGTOC.
                </td>
                <td className="p-3 border border-gray-300 text-sm">
                  No requerido — Art. 37 LFPDPPP
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border border-gray-300 font-medium">
                  Autoridades fiscales (SAT)
                </td>
                <td className="p-3 border border-gray-300 text-gray-600">
                  México
                </td>
                <td className="p-3 border border-gray-300 text-gray-600">
                  Cumplimiento de obligaciones tributarias derivadas de los
                  ingresos por intereses, conforme a la LISR y LIVA.
                </td>
                <td className="p-3 border border-gray-300 text-sm">
                  No requerido — Art. 37 LFPDPPP
                </td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-300 font-medium">
                  Proveedores de cobranza extrajudicial
                </td>
                <td className="p-3 border border-gray-300 text-gray-600">
                  México
                </td>
                <td className="p-3 border border-gray-300 text-gray-600">
                  Gestión de cobranza extrajudicial en caso de incumplimiento de
                  pago, de manera ética y conforme a la ley aplicable.
                </td>
                <td className="p-3 border border-gray-300 text-sm">
                  No requerido — Art. 37 LFPDPPP
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border border-gray-300 font-medium">
                  Meta Platforms, Inc. (WhatsApp) *
                </td>
                <td className="p-3 border border-gray-300 text-gray-600">
                  Estados Unidos
                </td>
                <td className="p-3 border border-gray-300 text-gray-600">
                  Envío de notificaciones operativas, recordatorios de pago y
                  comunicaciones relacionadas con tu crédito a través de la
                  plataforma WhatsApp.
                </td>
                <td className="p-3 border border-gray-300 font-medium text-sm">
                  Requerido (*)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mb-4 leading-relaxed">
          Para la transferencia marcada con asterisco (*) requerimos tu
          consentimiento, el cual nos otorgas al aceptar el presente Aviso. En
          caso de que no desees que tus datos sean transferidos para dicha
          finalidad, envía un correo a <strong>contacto@varolisto.mx</strong>{" "}
          indicando tu nombre completo y la transferencia a la que te opones.
          Puedes solicitar la revocación de tu consentimiento en cualquier
          momento.{" "}
          <strong>
            La negativa respecto a esta transferencia no será motivo para
            negarte el servicio.
          </strong>
        </p>
        <p className="mb-10 leading-relaxed">
          VaroListo.mx <strong>no vende, cede ni comercializa</strong> tus datos
          personales a terceros con fines de mercadotecnia sin tu consentimiento
          previo y expreso.
        </p>

        {/* V */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          V. Transferencias internacionales de datos
        </h2>
        <p className="mb-10 leading-relaxed">
          Con motivo de las transferencias señaladas en la sección IV
          —particularmente a ZapSign (Brasil) y Meta Platforms/WhatsApp (Estados
          Unidos)— tus datos personales podrán ser tratados fuera del territorio
          mexicano. Dichas transferencias se realizan con proveedores que
          cuentan con estándares de seguridad y protección de datos equivalentes
          o superiores a los exigidos por la legislación mexicana. Al aceptar el
          presente Aviso, otorgas tu consentimiento expreso para dichas
          transferencias internacionales en los términos del{" "}
          <strong>Art. 36 LFPDPPP</strong>.
        </p>

        {/* VI */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          VI. Opciones para limitar el uso de tus datos
        </h2>
        <p className="mb-10 leading-relaxed">
          Puedes limitar el uso o divulgación de tus datos personales en
          cualquier momento mediante los siguientes mecanismos: (i) enviando un
          correo a <strong>contacto@varolisto.mx</strong> con el asunto
          &quot;Limitar uso de datos&quot;, indicando tu nombre completo y la
          finalidad o transferencia específica a la que deseas oponerte; o (ii)
          enviando un mensaje de WhatsApp al número registrado en tu expediente
          con la misma instrucción. VaroListo.mx atenderá tu solicitud en un
          plazo máximo de <strong>5 días hábiles</strong> y te confirmará los
          efectos de la limitación sobre tu servicio, si los hubiera.
        </p>

        {/* VII */}
        <h2 className="text-xl font-bold mt-10 mb-3">VII. Derechos ARCO</h2>
        <p className="mb-4 leading-relaxed">
          Tienes derecho a{" "}
          <strong>Acceder, Rectificar, Cancelar u Oponerte</strong> al
          tratamiento de tus datos personales (Derechos ARCO), conforme a los
          Arts. 28–33 LFPDPPP:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-800 leading-relaxed">
          <li>
            <strong>Acceso:</strong> conocer qué datos tenemos, para qué los
            usamos y a quién los hemos transferido.
          </li>
          <li>
            <strong>Rectificación:</strong> corregir datos inexactos,
            incorrectos o incompletos.
          </li>
          <li>
            <strong>Cancelación:</strong> solicitar la supresión de tus datos
            cuando ya no sean necesarios para el fin que motivó su tratamiento,
            o cuando consideres que no están siendo usados conforme a la Ley.
          </li>
          <li>
            <strong>Oposición:</strong> oponerte al tratamiento de tus datos
            para finalidades secundarias o transferencias específicas.
          </li>
        </ul>
        <p className="mb-4 leading-relaxed">
          Para ejercer tus derechos, envía tu solicitud a{" "}
          <strong>contacto@varolisto.mx</strong> con el asunto &quot;Derechos
          ARCO&quot;. Tu solicitud deberá contener y acompañarse de:
        </p>
        <ol className="list-decimal pl-6 space-y-2 mb-6 text-gray-800 leading-relaxed">
          <li>
            Tu nombre completo y domicilio u otro medio para recibir la
            respuesta.
          </li>
          <li>
            Copia de tu identificación oficial vigente que acredite tu
            identidad, o en su caso la de tu representante legal debidamente
            facultado.
          </li>
          <li>
            Descripción clara y precisa de los datos personales sobre los que
            deseas ejercer tu derecho y el derecho específico que deseas
            ejercer.
          </li>
          <li>
            Cualquier documento o elemento que facilite la localización de tus
            datos en nuestros registros.
          </li>
        </ol>
        <p className="mb-4 leading-relaxed">
          El Responsable responderá en un plazo máximo de{" "}
          <strong>20 días hábiles</strong> a partir de la recepción de la
          solicitud.{" "}
          <strong>
            El ejercicio de tus Derechos ARCO es completamente gratuito.
          </strong>{" "}
          VaroListo.mx en ningún momento realizará cobro alguno por este
          servicio.
        </p>
        <p className="mb-3 leading-relaxed">
          VaroListo.mx podrá negar el ejercicio de los Derechos ARCO únicamente
          en los siguientes supuestos:
        </p>
        <ol className="list-decimal pl-6 space-y-2 mb-6 text-gray-800 leading-relaxed">
          <li>
            Cuando el solicitante no sea el Titular de los datos personales, o
            su representante legal no esté debidamente facultado para ello.
          </li>
          <li>
            Cuando los datos personales del solicitante no se encuentren en la
            base de datos de VaroListo.mx.
          </li>
          <li>
            Cuando el ejercicio del derecho lesione los derechos de un tercero.
          </li>
          <li>
            Cuando exista un impedimento legal o la resolución de una autoridad
            competente que lo restrinja.
          </li>
          <li>
            Cuando la rectificación, cancelación u oposición haya sido
            previamente realizada.
          </li>
        </ol>
        <p className="mb-10 leading-relaxed">
          En cualquiera de estos casos, VaroListo.mx informará al solicitante el
          motivo de su decisión por el mismo medio en que se realizó la
          solicitud, dentro de los plazos establecidos en la LFPDPPP y su
          Reglamento. La cancelación de datos no procederá mientras exista un
          crédito activo, conforme al Art. 25 LFPDPPP.
        </p>

        {/* VIII */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          VIII. Revocación del consentimiento
        </h2>
        <p className="mb-6 leading-relaxed">
          En cualquier momento puedes revocar el consentimiento que nos has
          otorgado para el tratamiento de tus datos personales, siempre y cuando
          dicha revocación sea legítima y no suponga la imposibilidad de cumplir
          obligaciones derivadas de una relación contractual vigente entre
          VaroListo.mx y tú, o no sea posible en virtud de un mandato legal o
          judicial.
        </p>
        <p className="mb-10 leading-relaxed">
          Para revocar tu consentimiento, envía un correo a{" "}
          <strong>contacto@varolisto.mx</strong> con el asunto &quot;Revocación
          de consentimiento&quot;, indicando tu nombre completo, los datos sobre
          cuyo tratamiento deseas revocar el consentimiento y el motivo de la
          revocación. VaroListo.mx te informará en un plazo de{" "}
          <strong>20 días hábiles</strong> sobre la procedencia de tu solicitud
          y sus efectos. La revocación del consentimiento no tendrá efectos
          retroactivos sobre el tratamiento ya realizado de forma legítima.
        </p>

        {/* IX */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          IX. Medidas de seguridad
        </h2>
        <p className="mb-10 leading-relaxed">
          VaroListo.mx ha implementado medidas de seguridad administrativas,
          técnicas y físicas para proteger tus datos personales contra pérdida,
          uso no autorizado, alteración o destrucción, incluyendo:
          almacenamiento en plataformas con acceso restringido y autenticación
          de dos factores, firma digital certificada a través de ZapSign, acceso
          limitado a expedientes únicamente al personal autorizado, y
          destrucción segura de documentos físicos que contengan datos
          personales.
        </p>

        {/* X */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          X. Cambios al Aviso de Privacidad
        </h2>
        <p className="mb-10 leading-relaxed">
          El presente Aviso puede ser modificado en cualquier momento. Cualquier
          cambio será notificado mediante publicación en{" "}
          <strong>varolisto.mx</strong> y/o por correo electrónico o WhatsApp al
          contacto registrado, con la fecha de la última actualización visible.
          El uso continuado de los servicios de VaroListo.mx después de la
          notificación implica tu aceptación de las modificaciones.
        </p>

        {/* XI */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          XI. Autoridad competente
        </h2>
        <p className="mb-10 leading-relaxed">
          Si consideras que tu derecho a la protección de datos personales ha
          sido vulnerado, puedes presentar una queja o denuncia ante el{" "}
          <strong>
            Instituto Nacional de Transparencia, Acceso a la Información y
            Protección de Datos Personales (INAI)
          </strong>
          , en <strong>inai.org.mx</strong>.
        </p>
    </LegalPageLayout>
  );
}
