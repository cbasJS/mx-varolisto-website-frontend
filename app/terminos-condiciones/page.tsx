import type { Metadata } from "next";
import LegalPageLayout from "@/components/layout/LegalPageLayout";

export const metadata: Metadata = {
  title: "Términos y Condiciones — VaroListo.mx",
  description:
    "Términos y Condiciones Generales de Uso del servicio de préstamos personales VaroListo.mx.",
};

export default function TerminosCondicionesPage() {
  return (
    <LegalPageLayout
      titulo="Términos y Condiciones Generales de Uso"
      fechaActualizacion="Abril 2026 · Actualización"
    >

        <p className="mb-6 leading-relaxed">
          <strong>VaroListo.mx</strong> (en lo sucesivo &quot;VaroListo&quot;),
          con domicilio en Tapachula, Chiapas, México, te da a conocer por este
          medio los Términos y Condiciones Generales de Uso (en lo sucesivo
          &quot;Términos&quot; y/o &quot;Condiciones&quot;) que regulan el
          servicio de préstamos personales ofrecido a través del sitio web
          varolisto.mx, formulario de solicitud en línea y canal de WhatsApp.
        </p>

        <p className="mb-6 leading-relaxed">
          Los presentes Términos tienen carácter obligatorio y vinculante. Todo
          usuario deberá abstenerse de utilizar el servicio en caso de no
          aceptarlos. Toda solicitud de préstamo, gestión o comunicación con
          VaroListo.mx se entenderá como la aceptación expresa de los presentes
          Términos y Condiciones. Al aceptarlos, aceptas que existe una relación
          jurídica válida y vinculante entre VaroListo y tú.
        </p>

        <p className="mb-6 leading-relaxed">
          VaroListo podrá poner fin de inmediato a estos Términos y Condiciones
          o al servicio respecto de ti, en cualquier momento y por cualquier
          motivo, incluyendo comportamiento crediticio o conducta contraria a
          los presentes Términos, sin que para ello deba mediar justificación
          alguna.
        </p>

        <p className="mb-10 leading-relaxed">
          <strong>
            LEE ESTOS TÉRMINOS Y CONDICIONES DETENIDAMENTE ANTES DE SOLICITAR
            CUALQUIER SERVICIO.
          </strong>
        </p>

        {/* I */}
        <h2 className="text-xl font-bold mt-10 mb-3">I. Definiciones</h2>
        <p className="mb-4 leading-relaxed">
          Para efectos de los presentes Términos y Condiciones, se entenderá
          por:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-10 text-gray-800 leading-relaxed">
          <li>
            <strong>VaroListo / el Responsable:</strong> persona física con
            actividad empresarial, titular del servicio de préstamos personales
            bajo la marca VaroListo.mx, con domicilio en Tapachula, Chiapas,
            México.
          </li>
          <li>
            <strong>Cliente / Deudor / Titular:</strong> persona física mayor de
            edad que solicita, acepta y recibe un préstamo personal de
            VaroListo.mx.
          </li>
          <li>
            <strong>Crédito / Préstamo:</strong> préstamo personal de corto
            plazo (2 a 6 meses) formalizado mediante pagaré y contrato firmados
            digitalmente.
          </li>
          <li>
            <strong>Pagaré:</strong> título de crédito ejecutivo suscrito
            conforme al Art. 170 de la Ley General de Títulos y Operaciones de
            Crédito (LGTOC).
          </li>
          <li>
            <strong>Contrato:</strong> contrato de préstamo personal que
            establece las condiciones específicas de cada crédito, firmado
            digitalmente por ambas partes.
          </li>
          <li>
            <strong>Propuesta:</strong> documento informativo enviado al Cliente
            con las condiciones aprobadas del crédito, previo a su
            formalización. Tiene una vigencia de 15 días naturales.
          </li>
          <li>
            <strong>ZapSign:</strong> plataforma de firma electrónica avanzada
            utilizada para la formalización digital de documentos (zapsign.co).
          </li>
          <li>
            <strong>Aviso de Privacidad:</strong> documento que regula el
            tratamiento de los datos personales del Cliente, disponible en
            varolisto.mx y parte integral de los presentes Términos.
          </li>
        </ul>

        {/* II */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          II. Uso y restricciones
        </h2>
        <p className="mb-4 leading-relaxed">
          El servicio de VaroListo.mx estará únicamente disponible para personas
          que gocen de capacidad legal para contratar conforme a la legislación
          mexicana vigente, y para quienes no hayan sido vetados definitiva o
          parcialmente por VaroListo, a su sola discreción, en relación con su
          comportamiento crediticio o personal.
        </p>
        <p className="mb-4 leading-relaxed">
          Para acceder al servicio, el solicitante debe cumplir los siguientes
          requisitos:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-800 leading-relaxed">
          <li>Ser mayor de 18 años cumplidos.</li>
          <li>
            Residir en México, con domicilio verificable mediante comprobante
            reciente.
          </li>
          <li>
            Contar con identificación oficial vigente (INE/IFE o pasaporte
            mexicano).
          </li>
          <li>
            Presentar comprobante de ingresos verificable: recibo de nómina,
            CFDI, estados de cuenta o documentación de negocio propio.
          </li>
          <li>
            Proporcionar dos referencias personales con nombre completo y número
            de teléfono verificables.
          </li>
          <li>
            La cuota mensual del crédito solicitado no debe exceder el 40% del
            ingreso neto mensual verificable.
          </li>
          <li>
            Contar con una cuenta bancaria a su nombre con CLABE interbancaria
            para recibir el desembolso. En caso de no contar con cuenta propia,
            deberá firmar una carta de autorización de depósito a tercero.
          </li>
          <li>No tener un crédito vencido activo con VaroListo.mx.</li>
        </ul>
        <p className="mb-10 leading-relaxed">
          La recopilación y el uso que hacemos de la información personal en
          relación con el servicio es conforme a lo dispuesto en nuestro{" "}
          <strong>Aviso de Privacidad Integral</strong>, disponible en
          varolisto.mx. La presentación de una solicitud no garantiza la
          aprobación del crédito. La evaluación y decisión final es discrecional
          de VaroListo.mx.
        </p>

        {/* III */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          III. Descripción del servicio y condiciones financieras
        </h2>
        <p className="mb-4 leading-relaxed">
          VaroListo.mx ofrece préstamos personales a personas físicas residentes
          en México. Las condiciones de cada crédito dependen del perfil
          crediticio asignado al Cliente conforme al sistema de evaluación
          interno de VaroListo.mx. Se establecen tres perfiles de cliente:
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 border border-gray-300 font-semibold">
                  Perfil
                </th>
                <th className="text-left p-3 border border-gray-300 font-semibold">
                  Tasa efectiva mensual
                </th>
                <th className="text-left p-3 border border-gray-300 font-semibold">
                  Comisión apertura
                </th>
                <th className="text-left p-3 border border-gray-300 font-semibold">
                  Plazo
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-gray-300 font-medium">
                  Perfil A
                </td>
                <td className="p-3 border border-gray-300 font-semibold">
                  4.64% – 5.22%
                </td>
                <td className="p-3 border border-gray-300">2% + IVA</td>
                <td className="p-3 border border-gray-300">2 – 6 meses</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-3 border border-gray-300 font-medium">
                  Perfil B
                </td>
                <td className="p-3 border border-gray-300 font-semibold">
                  6.96% – 8.12%
                </td>
                <td className="p-3 border border-gray-300">3% + IVA</td>
                <td className="p-3 border border-gray-300">2 – 6 meses</td>
              </tr>
              <tr>
                <td className="p-3 border border-gray-300 font-medium">
                  Perfil C
                </td>
                <td className="p-3 border border-gray-300 font-semibold">
                  9.86% – 11.60%
                </td>
                <td className="p-3 border border-gray-300">4% + IVA</td>
                <td className="p-3 border border-gray-300">2 – 6 meses</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mb-4 leading-relaxed">
          Adicionalmente, aplican las siguientes condiciones generales a todos
          los perfiles:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-800 leading-relaxed">
          <li>
            <strong>Comisión por apertura:</strong> se descuenta del monto al
            momento del desembolso. No es reembolsable. El IVA (16%) se aplica
            sobre la comisión conforme a la LIVA. La amortización del crédito se
            calcula sobre el monto bruto aprobado.
          </li>
          <li>
            <strong>Cuota de servicio mensual (IVA incluido):</strong> cobrada
            en cada pago junto con capital e intereses, según el monto bruto del
            préstamo: $99/mes para préstamos de $2,000 a $5,000; $129/mes para
            préstamos de $5,001 a $10,000; $149/mes para préstamos de $10,001 a
            $20,000.
          </li>
          <li>
            <strong>Periodicidad de pago:</strong> mensual. El pago incluye
            capital, intereses y cuota de servicio en una sola cuota nivelada.
          </li>
          <li>
            <strong>Método de cálculo:</strong> sistema francés (cuota
            nivelada). El pago mensual total es idéntico durante toda la
            vigencia del crédito.
          </li>
          <li>
            <strong>IVA sobre intereses:</strong> 16% conforme al Art. 14 LIVA,
            absorbido en la tasa efectiva y desglosado en los documentos de
            crédito.
          </li>
          <li>
            <strong>Cargo por pago tardío:</strong> a partir del cuarto día
            natural de atraso, se aplicará un cargo administrativo fijo de $200
            pesos, independiente del saldo insoluto.
          </li>
          <li>
            <strong>Tasa moratoria:</strong> 1.5% mensual adicional sobre el
            saldo insoluto, aplicable desde el día 16 de atraso, sin necesidad
            de requerimiento previo. El cargo fijo y la tasa moratoria son
            acumulables a partir del día 16.
          </li>
          <li>
            <strong>Pago anticipado:</strong> permitido en cualquier momento, en
            cualquier perfil, pagando capital insoluto más intereses devengados
            a la fecha, sin penalización.
          </li>
        </ul>
        <p className="mb-10 leading-relaxed">
          Las condiciones específicas de cada crédito —monto, perfil, tasa,
          comisión, cuota de servicio y fechas de pago— quedan establecidas en
          el Pagaré y el Contrato firmados por ambas partes, los cuales
          prevalecen sobre cualquier comunicación informal o verbal. Se podrán
          aplicar condiciones suplementarias a determinados créditos o
          promociones particulares, las cuales se comunicarán oportunamente al
          Cliente y se considerarán parte integrante de los presentes Términos.
        </p>

        {/* IV */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          IV. Proceso de solicitud y formalización
        </h2>
        <p className="mb-4 leading-relaxed">
          El proceso de obtención de un crédito con VaroListo.mx consta de las
          siguientes etapas:
        </p>
        <ol className="list-decimal pl-6 space-y-3 mb-10 text-gray-800 leading-relaxed">
          <li>
            <strong>Solicitud inicial:</strong> el Cliente completa el
            formulario de solicitud en línea o por WhatsApp, proporcionando sus
            datos personales, laborales y financieros de manera precisa,
            verdadera y libre de vicios de mala fe. VaroListo no se
            responsabilizará bajo ninguna circunstancia de la imprecisión o
            falsedad de los datos que el Cliente proporcione, reservándose la
            facultad de requerir documentación comprobatoria adicional.
          </li>
          <li>
            <strong>Evaluación crediticia:</strong> VaroListo.mx analiza la
            solicitud mediante su sistema de evaluación interno. El plazo de
            respuesta es de 24 a 48 horas hábiles.
          </li>
          <li>
            <strong>Propuesta de préstamo:</strong> en caso de aprobación, se
            envía al Cliente una propuesta informativa por WhatsApp con las
            condiciones del crédito. La propuesta tiene una vigencia de 15 días
            naturales a partir de su emisión.
          </li>
          <li>
            <strong>Firma digital de documentos:</strong> el Cliente recibe por
            WhatsApp el enlace de ZapSign con el Pagaré y el Contrato de
            Préstamo Personal para su firma electrónica. La firma digital tiene
            plena validez jurídica conforme a la Ley de Firma Electrónica
            Avanzada (LFEA), los artículos 89 y 90 del Código de Comercio y
            demás disposiciones aplicables.
          </li>
          <li>
            <strong>Desembolso:</strong> una vez firmados ambos documentos,
            VaroListo.mx realiza la transferencia bancaria del monto neto a la
            CLABE registrada del Cliente, generalmente el mismo día hábil.
          </li>
        </ol>

        {/* V */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          V. Obligaciones del cliente
        </h2>
        <p className="mb-4 leading-relaxed">
          Al aceptar un crédito con VaroListo.mx, el Cliente se obliga a:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-10 text-gray-800 leading-relaxed">
          <li>
            Proporcionar información veraz, completa y actualizada durante todo
            el proceso de solicitud y vigencia del crédito, asumiendo el
            compromiso de notificar cualquier cambio relevante.
          </li>
          <li>
            Realizar los pagos mensuales en la fecha pactada mediante depósito o
            transferencia bancaria a la CLABE del Acreedor indicada en el
            Contrato.
          </li>
          <li>
            Destinar los recursos del crédito exclusivamente al fin declarado en
            el Contrato. El uso para fines distintos constituye causa de
            vencimiento anticipado.
          </li>
          <li>
            Notificar a VaroListo.mx de forma inmediata cualquier cambio en su
            domicilio, número de teléfono, empleo o situación financiera que
            pueda afectar su capacidad de pago.
          </li>
          <li>
            Mantener vigente la CLABE bancaria registrada durante toda la
            vigencia del crédito.
          </li>
          <li>
            No ceder, transferir ni usar los recursos del crédito en actividades
            ilícitas o contrarias a las leyes mexicanas.
          </li>
          <li>
            Leer, entender y aceptar todas las condiciones establecidas en los
            presentes Términos, en el Aviso de Privacidad y en los documentos de
            crédito correspondientes (Pagaré y Contrato).
          </li>
        </ul>

        {/* VI */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          VI. Incumplimiento de pago y consecuencias
        </h2>
        <p className="mb-4 leading-relaxed">
          En caso de retraso en el pago de cualquier mensualidad, VaroListo.mx
          aplicará el siguiente protocolo:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-800 leading-relaxed">
          <li>
            <strong>Días 1 a 3 de atraso:</strong> margen operativo.
            VaroListo.mx realizará contacto directo por WhatsApp y llamada
            telefónica. No se aplica cargo adicional durante este período.
          </li>
          <li>
            <strong>Días 4 a 15 de atraso:</strong> se aplicará un{" "}
            <strong>cargo administrativo fijo de $200 pesos</strong>,
            independiente del saldo insoluto. VaroListo.mx continuará el
            contacto por WhatsApp y llamada telefónica. En el día 15 se emitirá
            advertencia formal del inicio de intereses moratorios.
          </li>
          <li>
            <strong>Día 16 en adelante:</strong> el saldo insoluto generará
            automáticamente{" "}
            <strong>intereses moratorios a la tasa de 1.5% mensual adicional</strong>{" "}
            a la ordinaria, por cada día natural de demora, sin necesidad de
            requerimiento previo. El cargo fijo de $200 pesos y la tasa
            moratoria son acumulables. Se emitirá notificación formal y se
            contactará a las referencias autorizadas por el Cliente.
          </li>
          <li>
            <strong>Día 46 en adelante:</strong> el crédito se clasifica como
            cartera vencida. VaroListo.mx podrá iniciar el proceso de ejecución
            del pagaré ante el juzgado civil mercantil competente, sin necesidad
            de declaración judicial previa, conforme al Art. 170 LGTOC.
          </li>
        </ul>
        <p className="mb-4 leading-relaxed">
          En caso de ejecución judicial, todos los gastos de cobranza
          extrajudicial y/o judicial, incluidos honorarios de abogados y costas
          procesales, serán a cargo exclusivo del deudor.
        </p>
        <p className="mb-10 leading-relaxed">
          VaroListo.mx podrá declarar el <strong>vencimiento anticipado</strong>{" "}
          del crédito y exigir el pago total del saldo insoluto más intereses en
          los siguientes casos: (a) falta de pago de dos o más mensualidades
          consecutivas; (b) declaración de insolvencia del Cliente; (c) uso del
          préstamo para fines distintos a los declarados; (d) falsedad en la
          información proporcionada durante la solicitud.
        </p>

        {/* VII */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          VII. Reestructura de crédito
        </h2>
        <p className="mb-10 leading-relaxed">
          VaroListo.mx podrá ofrecer, a su exclusiva discreción, una
          reestructura del crédito en caso de atraso justificado. La
          reestructura se formaliza mediante un nuevo pagaré con folio distinto,
          consolidando el saldo insoluto más los intereses devengados a la
          fecha. Se permite un máximo de una reestructura por Cliente. En caso
          de reincidencia en el incumplimiento después de una reestructura,
          VaroListo.mx procederá directamente a la ejecución del título
          ejecutivo sin más negociación.
        </p>

        {/* VIII */}
        <h2 className="text-xl font-bold mt-10 mb-3">VIII. Indemnización</h2>
        <p className="mb-10 leading-relaxed">
          El Cliente indemnizará y mantendrá indemne a VaroListo.mx, así como a
          sus representantes y colaboradores, por cualquier reclamo, demanda o
          responsabilidad de terceros derivada de: (a) el incumplimiento de los
          presentes Términos y Condiciones; (b) el uso indebido de los recursos
          del crédito; (c) la falsedad o inexactitud de la información
          proporcionada durante el proceso de solicitud; o (d) la violación de
          cualquier ley o derecho de terceros. Esta obligación incluye el pago
          de honorarios de abogados en una cantidad razonable.
        </p>

        {/* IX */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          IX. Limitación de responsabilidad
        </h2>
        <p className="mb-4 leading-relaxed">
          VaroListo.mx no será responsable por:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-10 text-gray-800 leading-relaxed">
          <li>
            Daños directos o indirectos causados por el uso inadecuado de los
            recursos del crédito por parte del Cliente.
          </li>
          <li>
            Fallas, interrupciones o indisponibilidad de la plataforma ZapSign,
            servicios bancarios de terceros o cualquier otro proveedor externo.
          </li>
          <li>
            Consecuencias derivadas de información incorrecta, incompleta o
            falsa proporcionada por el Cliente durante el proceso de solicitud.
          </li>
          <li>
            Pérdidas o daños derivados de caso fortuito o fuerza mayor que
            impidan el cumplimiento de las obligaciones de cualquiera de las
            partes.
          </li>
        </ul>

        {/* X */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          X. Propiedad intelectual
        </h2>
        <p className="mb-10 leading-relaxed">
          La marca <strong>VaroListo.mx</strong>, el logotipo, el diseño del
          sistema de documentos y demás contenidos propietarios son de
          titularidad exclusiva de VaroListo. Queda prohibida su reproducción,
          uso comercial o distribución sin autorización expresa y por escrito.
          Los documentos de crédito generados (propuesta, pagaré, contrato) son
          de uso exclusivo del Cliente para quien fueron emitidos y no podrán
          ser reproducidos, cedidos ni utilizados por terceros no autorizados.
        </p>

        {/* XI */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          XI. Comunicaciones y notificaciones
        </h2>
        <p className="mb-10 leading-relaxed">
          Todas las comunicaciones entre VaroListo.mx y el Cliente se realizarán
          preferentemente por <strong>WhatsApp</strong> al número registrado en
          la solicitud, o al correo electrónico{" "}
          <strong>contacto@varolisto.mx</strong>. El Cliente acepta estos
          canales como medios oficiales para el envío de notificaciones de pago,
          recordatorios, estados de cuenta y comunicaciones de carácter legal
          relacionadas con su crédito. Las notificaciones enviadas al número o
          correo registrado se tendrán por realizadas aunque no sean leídas. El
          Cliente es responsable de mantener actualizado su información de
          contacto.
        </p>

        {/* XII */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          XII. Domicilio, legislación aplicable y jurisdicción
        </h2>
        <p className="mb-4 leading-relaxed">
          Se fija como domicilio de VaroListo.mx el ubicado en Tapachula,
          Chiapas, México. Los presentes Términos y Condiciones, así como los
          documentos de crédito de VaroListo.mx, se rigen por la legislación
          vigente en los Estados Unidos Mexicanos, incluyendo de forma
          enunciativa mas no limitativa:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-800 leading-relaxed">
          <li>
            <strong>LGTOC:</strong> Ley General de Títulos y Operaciones de
            Crédito (Arts. 170–174 — Pagaré).
          </li>
          <li>
            <strong>Código Civil Federal:</strong> contratos de mutuo con
            interés y obligaciones civiles.
          </li>
          <li>
            <strong>Código de Comercio:</strong> Arts. 89 y siguientes — validez
            de firma electrónica.
          </li>
          <li>
            <strong>LFEA:</strong> Ley de Firma Electrónica Avanzada.
          </li>
          <li>
            <strong>LFPDPPP:</strong> Ley Federal de Protección de Datos
            Personales en Posesión de los Particulares.
          </li>
          <li>
            <strong>LISR y LIVA:</strong> legislación fiscal aplicable a
            ingresos por intereses.
          </li>
        </ul>
        <p className="mb-10 leading-relaxed">
          Para cualquier controversia derivada de los presentes Términos o de la
          relación crediticia, las partes se someten a la jurisdicción de los
          tribunales competentes del domicilio del Deudor o del lugar de
          celebración del contrato, a elección de VaroListo.mx, con renuncia
          expresa al fuero de cualquier otro domicilio presente o futuro.
        </p>

        {/* XIII */}
        <h2 className="text-xl font-bold mt-10 mb-3">
          XIII. Modificaciones a los Términos
        </h2>
        <p className="mb-10 leading-relaxed">
          VaroListo.mx podrá modificar libremente y en cualquier momento los
          presentes Términos y Condiciones cuando lo considere oportuno. Las
          modificaciones serán efectivas después de su publicación en{" "}
          <strong>varolisto.mx</strong> y/o de su notificación al Cliente por
          WhatsApp o correo electrónico. El uso continuado del servicio o la
          solicitud de un nuevo crédito después de dicha publicación constituye
          tu consentimiento a vincularte por los Términos y Condiciones
          modificados, siendo la última versión publicada la que regulará
          inmediatamente las relaciones que se generen. Los créditos ya
          formalizados continuarán rigiéndose por los términos vigentes al
          momento de su firma, salvo acuerdo expreso en contrario.
        </p>
    </LegalPageLayout>
  );
}
