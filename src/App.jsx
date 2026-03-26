import { useState, useEffect, useCallback, useMemo } from "react";

// ─── Types & Initial State ─────────────────────────────────────────────────

const DAYS_MAP = { automatic: 5, resistant: 3, blank: 0 };

function createConcept(question = "", answer = "") {
  return {
    id: crypto.randomUUID(),
    question,
    answer,
    nextReview: new Date().toISOString(),
    interval: 0,
    repetitions: 0,
  };
}

function createModule(name) {
  return { id: crypto.randomUUID(), name, concepts: [] };
}

const SEED_DATA = [
  {
    ...createModule("Acto Jurídico"),
    concepts: [
      createConcept("¿Qué es un acto jurídico?", "Manifestación de voluntad hecha con el propósito de crear, modificar o extinguir derechos y obligaciones, y que produce los efectos queridos por su autor o por las partes porque el derecho sanciona dicha manifestación de voluntad. (Víctor Vial)"),
      createConcept("¿Cómo se clasifica el acto jurídico?", "El acto jurídico se clasifica en: 1. Unilateral y bilateral. 2. A título gratuito o a título oneroso. 3. Conmutativos o aleatorios. 4. Puros y simples, o sujetos a modalidad. 5. Consensuales, reales o solemnes. 6. De familia o patrimoniales. 7. Principales y accesorios. 8. Solemnes o no solemnes. 9. Típicos o nominados, y atípicos o innominados. 10. De disposición o administración. 11. De ejecución instantánea, ejecución diferida o indefinido. 12. Constitutivos, traslaticios o declarativos. 13. Entre vivos o por causa de muerte. 14. Verdaderos o simulados."),
      createConcept("¿Qué es un acto jurídico unilateral y bilateral?", "Esta clasificación obedece al número de voluntades que se requiere para que el acto jurídico se forme. Acto Jurídico Unilateral: aquel para cuyo nacimiento requiere de la manifestación de voluntad de una sola parte. Ejemplo: testamento, la oferta y la aceptación. Acto Jurídico Bilateral (o Convención): aquel para cuyo nacimiento requiere de la manifestación de voluntad de dos o más partes. Ejemplo: contratos, tradición, el matrimonio, entre otros."),
      createConcept("¿Convención y contrato son sinónimos?", "No. La convención es un acto jurídico bilateral destinado a crear, modificar o extinguir derechos y obligaciones. Por su parte, el contrato es un acto jurídico bilateral destinado exclusivamente a crear derechos y obligaciones. Por tanto existe una relación de género (convención) y especie (contrato)."),
      createConcept("¿Qué es un acto jurídico gratuito y oneroso?", "Esta clasificación se efectúa en atención a si el acto jurídico procura ventaja o utilidad a una sola de las partes o de ambos contratantes. Acto Jurídico Gratuito: aquel que solo tiene por objeto la utilidad de una de las partes, sufriendo la otra el gravamen. Acto Jurídico Oneroso: aquel que tiene por objeto la utilidad de ambas partes contratantes, gravándose cada uno a beneficio del otro."),
      createConcept("¿Qué es un acto jurídico conmutativo y aleatorio?", "Los actos jurídicos onerosos se subclasifican en conmutativos o aleatorios, atendiendo a la determinación de la equivalencia de las prestaciones. Acto Jurídico Conmutativo: cuando cada una de las partes se obliga a dar o hacer una cosa que se mira como equivalente a lo que la otra parte debe dar o hacer a su vez. Acto Jurídico Aleatorio: cuando el equivalente consiste en una contingencia incierta de ganancia o pérdida."),
      createConcept("¿Qué es un acto jurídico principal o accesorio?", "Esta clasificación atiende a si el acto jurídico subsiste por sí mismo, sin necesidad de otra convención. Acto Jurídico principal: aquel que subsiste por sí mismo sin necesidad de otra convención. Acto Jurídico accesorio: cuando no puede subsistir sin otro acto jurídico principal al cual accede. Los actos jurídicos accesorios a su vez se subclasifican en: acto jurídico de garantía o dependiente."),
      createConcept("¿Qué es una caución?", "Art. 46 CC: Caución significa generalmente cualquiera obligación que se contrae para la seguridad de otra obligación propia o ajena. Son especies de caución la fianza, la hipoteca y la prenda."),
      createConcept("¿Qué es un acto jurídico real, solemne o consensual?", "Esta clasificación atiende a la forma de perfeccionar el acto jurídico. Acto Jurídico Real: aquel que se perfecciona con la tradición o entrega de la cosa a que se refiere. Acto Jurídico Solemne: aquel que está sujeto a la observación de ciertas formalidades especiales, de manera que sin ellas no produce efecto civil. Acto Jurídico Consensual: aquel que se perfecciona por el solo consentimiento."),
      createConcept("¿Qué es un acto jurídico puro y simple o sujeto a modalidad?", "Esta clasificación atiende a si los efectos del acto jurídico se producen de inmediato o están sujetos a alguna modalidad. Acto Jurídico Simple: aquellos que producen sus efectos de inmediato, sin limitación de ninguna especie. Acto Jurídico sujeto a Modalidad: aquellos en que sus efectos se encuentran subordinados al cumplimiento de una modalidad, esto es, ciertas cláusulas que se incorporan a un acto jurídico con el fin de alterar sus efectos normales."),
      createConcept("¿Cuáles son las características de las modalidades del acto jurídico?", "A. Por regla general constituyen un elemento accidental; por excepción pueden ser de la esencia (ej. el plazo en el usufructo, la condición en la propiedad fiduciaria) o de la naturaleza (ej. condición resolutoria tácita). B. Son excepcionales: la regla general es que el acto es puro y simple. C. No se presumen; las partes deben incluirlas expresamente (excepciones: Arts. 1489 y 738 CC). D. Por regla general proceden en actos patrimoniales (excepciones: Arts. 1277 y 1192 CC). E. Las principales modalidades son: la condición, el plazo y el modo. Algunos autores agregan la representación y la solidaridad."),
      createConcept("¿Qué es el plazo?", "Art. 1494 CC. Definición legal: El plazo es la época que se fija para el cumplimiento de la obligación, y puede ser expreso o tácito. Definición doctrinaria: hecho futuro y cierto, del cual pende el ejercicio o extinción de un derecho."),
      createConcept("¿Qué es una condición?", "Art. 1473 CC. Definición legal: Es obligación condicional la que depende de una condición, esto es, de un acontecimiento futuro que puede suceder o no. Definición doctrinaria: hecho futuro e incierto del cual depende el nacimiento o la extinción de un derecho."),
      createConcept("¿Qué es el modo?", "Los autores lo han definido como Gravamen que se impone al beneficiario de una liberalidad o la obligación accesoria de realizar una prestación impuesta al adquirente de un derecho."),
      createConcept("¿Qué es la representación?", "Art. 1448 CC. Definición legal: Lo que una persona ejecuta a nombre de otra, estando facultada por ella o por la ley para representarla, produce respecto del representado iguales efectos que si hubiese contratado él mismo. Definición doctrinaria: figura jurídica por la cual las consecuencias de un acto jurídico celebrado por una persona a nombre de otra, afectan en forma directa e inmediata a esta última tal como si ella misma hubiese actuado, y puede tener su origen en la ley o en la voluntad del representado."),
      createConcept("¿Cuáles son las fuentes de la representación?", "A. Legal: aquella que deriva de la ley, sin que intervenga la voluntad del interesado. B. Voluntaria: emana de la voluntad de las partes y puede tener su origen en un contrato (mandato) o en un cuasicontrato (agencia oficiosa), en la cual habrá representación si el negocio fue bien administrado."),
      createConcept("¿Quiénes son representantes legales de una persona?", "Art. 43 CC: Son representantes legales de una persona el padre o la madre, el adoptante y su tutor o curador. Alessandri estima que este artículo no es taxativo, pues hay otros casos de representantes designados por la ley, por ejemplo, el juez que representa al deudor en las ventas forzadas."),
      createConcept("¿Es lo mismo representación que mandato?", "No. Diferencias: a. El mandato supone un contrato, mientras que la representación puede tener distintas fuentes (la representación es el género y el mandato una especie de representación voluntaria). b. La representación es independiente del mandato; puede haber mandato sin representación y viceversa. c. La facultad de representar no es de la esencia del mandato sino de la naturaleza, ya que es posible que el mandatario no represente al mandante."),
      createConcept("¿Cuáles son los requisitos para que exista representación?", "1. Celebración de un acto jurídico. 2. Declaración de voluntad del representante. 3. El representante debe actuar a nombre del representado al contratar (contemplatio domini). 4. Existencia de poder, es decir, que quien obra por cuenta de otro debe estar facultado para representarlo."),
      createConcept("¿Cuáles son los elementos del acto o contrato?", "Art. 1444 CC: Se distinguen en cada contrato las cosas que son de su esencia, las que son de su naturaleza, y las puramente accidentales. Son de la esencia aquellas cosas sin las cuales o no produce efecto alguno, o degenera en otro contrato diferente; son de la naturaleza las que no siendo esenciales, se entienden pertenecerle sin necesidad de cláusula especial; y son accidentales aquellas que ni esencial ni naturalmente le pertenecen, y que se le agregan por medio de cláusulas especiales."),
      createConcept("¿Cuáles son los requisitos de existencia del acto jurídico?", "Los requisitos de existencia son: 1. La voluntad. 2. El objeto. 3. La causa. 4. Solemnidades en aquellos actos en que la ley lo exige."),
      createConcept("¿Cuáles son los requisitos de validez del acto jurídico?", "Los requisitos de validez son: 1. Voluntad exenta de vicio. 2. Capacidad de las partes. 3. Objeto lícito. 4. La causa lícita. Algunos autores agregan las solemnidades exigidas por la ley para la validez del acto."),
      createConcept("¿Qué es la voluntad?", "Dícese de la aptitud para querer algo, o facultad humana que impele a realizar, o no, alguna cosa."),
      createConcept("¿Cuáles son los requisitos para que la voluntad origine efectos jurídicos?", "Los requisitos de la voluntad son: 1. Debe ser seria: cuando se emite con la intención de producir efectos jurídicos. 2. Debe manifestarse: la voluntad se debe exteriorizar (ya sea en forma expresa o tácita), no puede quedar en el fuero interno."),
      createConcept("¿El silencio constituye manifestación de voluntad?", "Por regla general no constituye manifestación de voluntad. Sin embargo, excepcionalmente se le entrega valor en tres casos: 1. Cuando la ley le asigna valor (ej. Arts. 1767, 1233, 2125 CC). 2. Cuando las partes del contrato así lo han convenido (ej. cláusulas de renovación automática en el arrendamiento). 3. Caso del Silencio Circunstanciado: cuando las circunstancias que acompañan al silencio permiten al juez atribuirle el carácter de manifestación de voluntad."),
      createConcept("¿Qué es el consentimiento?", "Acuerdo de las voluntades de dos o más partes, dirigido a producir efectos jurídicos."),
      createConcept("¿Cuáles son los actos necesarios para que se forme el consentimiento?", "Se forma por la concurrencia de dos actos jurídicos unilaterales: 1. La oferta: acto jurídico unilateral mediante el cual una persona propone a otra celebrar determinada convención, bastando para que ésta se perfeccione la aceptación de aquél a quien fue dirigida. 2. La aceptación de la oferta: acto jurídico unilateral mediante el cual su destinatario da a conocer que está conforme con ella. La regulación está en el Código de Comercio (Arts. 97 al 108), no en el Código Civil."),
      createConcept("¿Cuáles son los vicios del consentimiento?", "Art. 1451 CC: Los vicios de que puede adolecer el consentimiento, son error, fuerza y dolo. Algunos autores agregan la lesión enorme."),
      createConcept("¿Qué es el error?", "Es el falso concepto que se tiene de la realidad o la disconformidad que existe entre las ideas de nuestra mente y el orden de las cosas."),
      createConcept("¿Cómo se clasifica el error?", "El error puede ser de derecho o de hecho. El error de hecho a su vez puede ser: error esencial, sustancial, accidental y en la persona."),
      createConcept("¿El error de derecho vicia el consentimiento?", "Art. 1452 CC: El error sobre un punto de derecho no vicia el consentimiento. Excepcionalmente la ley admite que pueda alegarse error de derecho, así ocurre en el cuasicontrato de pago de lo no debido (Arts. 2297 y 2299 CC). Relacionar con Arts. 8 y 706 inciso final CC."),
      createConcept("¿En qué consiste el error esencial?", "Art. 1453 CC: El error de hecho vicia el consentimiento cuando recae sobre la especie de acto o contrato que se ejecuta o celebra, como si una de las partes entendiese empréstito y la otra donación; o sobre la identidad de la cosa específica de que se trata, como si en el contrato de venta el vendedor entendiese vender cierta cosa determinada, y el comprador entendiese comprar otra. Puede ser in negotio (en el acto jurídico) o in corpore (en la identidad de la cosa)."),
      createConcept("¿En qué consiste el error sustancial?", "Art. 1454 inciso 1 CC: es aquel que se produce cuando la sustancia o calidad esencial del objeto sobre que versa el acto o contrato, es diversa de lo que se cree; como si por alguna de las partes se supone que el objeto es una barra de plata, y realmente es una masa de algún otro metal semejante."),
      createConcept("¿En qué consiste el error accidental?", "Art. 1454 inciso 2 CC: el error accidental recae sobre una cualidad no esencial de la cosa. Por regla general no vicia el consentimiento. Para que lo vicie se requiere: 1. Que la calidad accidental haya sido el motivo principal de una de las partes para contratar. 2. Que ese motivo haya sido conocido por la otra parte."),
      createConcept("¿En qué consiste el error en la persona?", "Art. 1455 CC: El error acerca de la persona con quien se tiene intención de contratar no vicia el consentimiento, salvo que la consideración de esta persona sea la causa principal del contrato. Pero en este caso la persona que erró tendrá derecho a ser indemnizada de los perjuicios en que de buena fe haya incurrido por la nulidad del contrato."),
      createConcept("¿Cómo se sanciona el error?", "El error sustancial, accidental y en la persona (previo cumplimiento de requisitos) se sanciona con nulidad relativa. La sanción del error esencial es discutida: algunos señalan inexistencia por falta de voluntad; quienes no recogen la inexistencia, nulidad absoluta; y otros postulan nulidad relativa."),
      createConcept("¿Qué es el error común?", "Es aquel compartido por un gran número de personas, de manera tal que produce la validación de un acto que en principio adolecía de nulidad. Requisitos: 1. Debe existir un error. 2. Debe ser compartido o susceptible de serlo por un gran número de personas. 3. Debe ser excusable (justo motivo para incurrir en él). 4. Debe padecerse de buena fe."),
      createConcept("¿Definición de fuerza?", "Apremios físicos o morales que se ejercen sobre una persona destinada a que ella preste su consentimiento para la celebración de un acto jurídico. Víctor Vial."),
      createConcept("¿Cómo se clasifica la fuerza?", "La fuerza puede ser física o moral. A. Física: empleo de medios o procedimientos materiales de violencia (ej. conducirle la mano al declarante). No vicia el consentimiento pues lo suprime. B. Moral: amenazas de un mal que será inferido a una persona en caso de no consentir. Esta fuerza es la que vicia el consentimiento."),
      createConcept("¿Cuáles son los requisitos para que la fuerza vicie el consentimiento?", "1. Debe ser injusta, contraria a la ley o al derecho. 2. Debe ser grave, de acuerdo al artículo 1456 CC. 3. Debe ser determinante: obra de la contraparte o un tercero con el fin de obtener la manifestación de voluntad, y sin ella no se hubiera prestado el consentimiento. 4. Debe ser actual o inminente, coetánea al acto o contrato."),
      createConcept("¿Cuándo la fuerza es grave?", "Art. 1456 CC: La fuerza no vicia el consentimiento, sino cuando es capaz de producir una impresión fuerte en una persona de sano juicio, tomando en cuenta su edad, sexo y condición. Se mira como una fuerza de este género todo acto que infunde a una persona un justo temor de verse expuesta ella, su consorte o alguno de sus ascendientes o descendientes a un mal irreparable y grave."),
      createConcept("¿Qué es el temor reverencial?", "Art. 1456 inciso 2 CC: El temor reverencial, esto es, el solo temor de desagradar a las personas a quienes se debe sumisión y respeto, no basta para viciar el consentimiento."),
      createConcept("¿Cómo se sanciona la fuerza?", "La fuerza física se sanciona con inexistencia o nulidad absoluta, por falta de voluntad o consentimiento. La fuerza moral se sanciona con nulidad relativa."),
      createConcept("¿Qué es el dolo?", "El dolo como vicio del consentimiento es toda maquinación fraudulenta empleada para engañar al autor o contraparte de un acto o contrato, con el fin de arrancarle una declaración de voluntad o modificarla en los términos deseados por el individuo que actúa dolosamente, el cual no habría consentido de no mediar el engaño."),
      createConcept("¿Cuál es el ámbito de aplicación del dolo?", "El dolo se puede estudiar desde tres puntos de vista: A. Como vicio del consentimiento. B. Como elemento agravante de la responsabilidad del deudor por incumplimiento de su obligación (Art. 1558 CC). C. Como elemento constitutivo de la responsabilidad extracontractual (Art. 2284 inciso 3 CC)."),
      createConcept("¿Cómo se clasifica el dolo?", "A. Dolo positivo (maniobras directas para engañar) y dolo negativo (simple ocultación de un hecho que, conocido por la contraparte, le hubiera impedido contratar). B. Dolo bueno (comportamiento lícito, astucia o halagos permitidos) y dolo malo (comportamiento ilícito destinado a engañar). C. Dolo principal o directo (induce directamente a la declaración de voluntad) y dolo incidental (no es determinante, pero trae la celebración del acto en condiciones desfavorables)."),
      createConcept("¿A quién le corresponde probar el dolo?", "Por regla general, al que ha sido víctima de la maquinación fraudulenta. Art. 1459 CC: El dolo no se presume sino en los casos especialmente previstos por la ley. En los demás debe probarse. Excepcionalmente se presume en: Art. 706 inciso final, 968 n°5, 1301, 2510 n°3 y 94 n°1 del CC."),
      createConcept("¿Cuáles son los requisitos para que el dolo vicie el consentimiento?", "Art. 1458 CC: El dolo no vicia el consentimiento sino cuando es obra de una de las partes, y cuando además aparece claramente que sin él no hubieran contratado. En los actos jurídicos unilaterales basta que sea determinante, ya que solo existe una parte."),
      createConcept("¿Cómo se sanciona el dolo?", "Si cumple los requisitos del Art. 1458 inciso 1: nulidad relativa. Si no los reúne, se aplica el Art. 1458 inciso 2: solo da lugar a la acción de perjuicios contra quienes lo fraguaron (por el total de los perjuicios) o se aprovecharon de él (hasta concurrencia del provecho reportado)."),
      createConcept("¿Se puede condonar el dolo futuro?", "Art. 1465 CC: La condonación del dolo futuro no vale y constituye un caso de objeto ilícito, el cual será sancionado con nulidad absoluta."),
      createConcept("¿En qué consiste el dolo del incapaz?", "Art. 1685 CC: Si de parte del incapaz ha habido dolo para inducir al acto o contrato, ni él ni sus herederos o cesionarios podrán alegar nulidad. Sin embargo, la aserción de mayor edad, o de no existir la interdicción u otra causa de incapacidad, no inhabilitará al incapaz para obtener el pronunciamiento de nulidad."),
      createConcept("¿Qué se entiende por lesión?", "La lesión es el detrimento patrimonial que una parte experimenta cuando, en un contrato conmutativo, recibe de la otra un valor sustancialmente inferior al de la prestación suministrada por ella. El perjuicio nace de la desigualdad."),
      createConcept("¿En qué materias se aplica la lesión enorme?", "La lesión enorme se regula en: 1. Compraventa de bien inmueble (Arts. 1889 y 1890 CC). 2. Permuta de bien inmueble (Art. 1900 CC). 3. Aceptación de una asignación hereditaria (Art. 1234 CC). 4. Partición de bienes (Art. 1348 CC). 5. Mutuo (Art. 2206 en relación con Art. 8 Ley 18.010). 6. Anticresis (Art. 2443 CC). 7. Cláusula penal enorme (Art. 1544 CC). 8. Liquidación de la sociedad conyugal (Art. 1776 CC)."),
      createConcept("¿Cuál es la sanción a la lesión enorme?", "En general, la sanción de la lesión es la nulidad relativa del acto en que incide o la reducción de la desproporción de las prestaciones."),
      createConcept("¿Qué es el objeto?", "El objeto consiste en los derechos y obligaciones que el acto jurídico crea, modifica o extingue. (Eugenio Velasco)"),
      createConcept("¿Cómo se regula el objeto en nuestro Código Civil?", "Art. 1460 CC: Toda declaración de voluntad debe tener por objeto una o más cosas que se trata de dar, hacer o no hacer. Se ha criticado este artículo porque confunde el objeto de la declaración de voluntad con el objeto de la obligación. Podemos distinguir: Objeto del acto jurídico: obligación y derecho que genera. Objeto de la obligación: la prestación. Objeto de la prestación: una o más cosas que se deben dar, hacer o no hacer."),
      createConcept("¿Cuáles son los requisitos del objeto?", "Cuando recae en una cosa que debe darse o entregarse: a. Real. b. Determinado. c. Comerciable. Cuando recae en un hecho: a. Debe ser determinado o determinable. b. Debe ser físicamente posible. c. Debe ser moralmente posible."),
      createConcept("¿Qué es el objeto ilícito?", "Es aquel contrario al orden público, a las buenas costumbres o la ley. El Código señala determinados casos: 1. Actos que contravienen el derecho público chileno (Art. 1462). 2. Pactos sobre sucesiones futuras (Art. 1463). 3. Enajenación de cosas del Art. 1464. 4. Condonación del dolo futuro (Art. 1465). 5. Deudas contraídas en juegos de azar (Art. 1466). 6. Ventas de libros u objetos prohibidos o inmorales (Art. 1466). 7. Actos prohibidos por la ley (Art. 1466)."),
      createConcept("¿Qué casos se contemplan en el artículo 1464?", "Art. 1464 CC: Hay un objeto ilícito en la enajenación: 1°. De las cosas que no están en el comercio; 2°. De los derechos o privilegios que no pueden transferirse a otra persona; 3°. De las cosas embargadas por decreto judicial, a menos que el juez lo autorice o el acreedor consienta en ello; 4°. De especies cuya propiedad se litiga, sin permiso del juez que conoce en el litigio."),
      createConcept("¿Qué es la causa?", "Art. 1467 inciso 2 CC: Se entiende por causa el motivo que induce al acto o contrato; y por causa ilícita la prohibida por ley, o contraria a las buenas costumbres o al orden público."),
      createConcept("¿Cuáles son los requisitos de la causa?", "1. Debe ser real: debe existir al momento en que se celebra el contrato o acto jurídico. El Art. 1467 señala: No puede haber obligación sin una causa real y lícita; pero no es necesario expresarla. La pura liberalidad o beneficencia es causa suficiente. 2. Debe ser lícita: aquella que no es contraria a la ley, a las buenas costumbres o al orden público."),
      createConcept("¿Qué tipos de causa se distinguen en los actos jurídicos?", "1. Eficiente: el elemento generador del acto, en general las fuentes de las obligaciones. 2. Ocasional: el fin estrictamente personal que se persigue con la celebración del acto. 3. Final: el fin o motivo por el cual se celebra el acto o contrato; es la misma en todos los actos jurídicos de la misma especie. 4. Económica: el fin económico que las partes persiguen al contratar."),
      createConcept("¿El Código Civil a qué causa se refiere?", "Para la mayoría de la doctrina se refiere a la causa final, por tanto, en cada tipo de contrato habrá siempre una misma causa de valor constante y abstracto, precisada de antemano por el Derecho."),
      createConcept("¿Qué es la causa ilícita?", "Art. 1467 inciso 2 CC: Se entiende por causa ilícita la prohibida por ley, o contraria a las buenas costumbres o al orden público."),
      createConcept("¿Qué es la capacidad?", "La aptitud legal de una persona para contraer derechos y obligaciones, ejercerlos por sí misma sin el ministerio o la autorización de otra persona."),
      createConcept("¿Cómo se clasifica la capacidad?", "La capacidad puede ser de goce y de ejercicio. La capacidad de goce es la aptitud de una persona para adquirir derechos. La capacidad de ejercicio, definida en el Art. 1445 inciso final: La capacidad legal de una persona consiste en poderse obligar por sí misma, y sin el ministerio o la autorización de otra."),
      createConcept("¿Quiénes son incapaces absolutos y relativos?", "Art. 1447 CC. Son absolutamente incapaces: el demente, los impúberes y los sordos o sordomudos que no pueden darse a entender claramente. Son incapaces relativos: los menores adultos y los disipadores que se hallen bajo interdicción de administrar lo suyo."),
      createConcept("¿Qué son las formalidades?", "Aquellos requisitos que dicen relación con la forma o aspecto externo del acto jurídico, exigidos por la ley con diferentes finalidades y cuya omisión se sancionará en la forma prevista por el legislador."),
      createConcept("¿Cómo se clasifican las formalidades?", "Las formalidades pueden ser: A. Propiamente tales o solemnidades. B. Formalidades habilitantes. C. Formalidades por vía de prueba. D. Formalidades de publicidad."),
      createConcept("¿Cuáles son las formalidades propiamente tales?", "Son los requisitos externos prescritos por la ley como indispensables para la existencia misma o para la validez del acto jurídico, exigidos en atención a la naturaleza del acto. Pueden ser: Solemnidades de existencia (el único medio a través del cual se puede manifestar la voluntad en ciertos actos) y Solemnidades de validez (exigidas en atención al valor y naturaleza del acto)."),
      createConcept("¿Qué ejemplos de solemnidad de existencia y validez existen?", "Solemnidades de existencia: contrato de promesa debe constar por escrito (Art. 1554 N°1); compraventa de bienes raíces por escritura pública (Art. 1801 inc. 2); hipoteca por escritura pública (Art. 2409); presencia de oficial del registro civil o ministro de culto en el matrimonio. Solemnidades de validez: presencia de tres o cinco testigos en el testamento solemne (Arts. 1014 y 1021); insinuación en la donación (Art. 1401); presencia de dos testigos en el matrimonio (Art. 17 LMC)."),
      createConcept("¿Cuáles son las formalidades habilitantes?", "Son aquellas que se requieren para cumplir con los requisitos externos exigidos por la ley en atención a la calidad o estado de las personas que ejecutan o celebran el acto. Son requisitos exigidos para completar la voluntad de un incapaz o para protegerlo. Pueden ser de tres tipos: A. Autorización. B. Asistencia. C. Homologación."),
      createConcept("¿Cuáles son las formalidades de prueba?", "Son aquellas requeridas por la ley como medio de prueba de un acto no solemne y que se traducen en la exigencia de que exista un documento, de forma que si éste falta, el acto tiene validez, pero no es posible su prueba a través de testigos (Arts. 1708, 1709 incs. 1 y 2; 1710 inc. 1 y 1711 inc. 1 CC)."),
      createConcept("¿Cuáles son las formalidades de publicidad?", "Son los requisitos externos exigidos por la ley para poner en conocimiento de los terceros el otorgamiento o celebración de un acto, y en algunos casos para que sea eficaz ante terceros. Puede ser de simple noticia (poner en conocimiento de terceros las relaciones jurídicas en que puedan tener interés; ej. Arts. 447 y 461 CC) o sustanciales (precaver a los terceros interesados; ej. Art. 1902 CC)."),
      createConcept("¿Qué es la ineficacia del acto jurídico?", "Corresponde a la pérdida de efectos de un acto jurídico. Puede ser: de origen (inexistencia o nulidad), o sobrevenida (resolución, revocación, resciliación, caducidad, inoponibilidad)."),
      createConcept("¿Qué es la nulidad?", "Art. 1681 CC: La nulidad es una sanción para todo acto o contrato a que falta alguno de los requisitos que la ley prescribe para el valor del mismo acto o contrato según su especie (nulidad absoluta) y la calidad o estado de las partes (nulidad relativa)."),
      createConcept("¿Cuáles son las causales de nulidad absoluta?", "Art. 1682 CC. Son causales de nulidad absoluta: objeto ilícito, causa ilícita, omisión de algún requisito o formalidad que la ley prescribe para el valor del acto en consideración a su naturaleza, y actos y contratos de personas absolutamente incapaces. Quienes rechazan la teoría de la inexistencia agregan: falta de voluntad, de objeto, de causa, de solemnidades de existencia y error esencial."),
      createConcept("¿Quién puede solicitar la nulidad absoluta?", "Art. 1683 CC: puede y debe ser declarada por el juez cuando aparece de manifiesto en el acto o contrato; puede alegarse por todo el que tenga interés en ello (interés actual y pecuniario), excepto el que ejecutó el acto sabiendo o debiendo saber el vicio que lo invalidaba; puede pedirse por el ministerio público en el interés de la moral o de la ley."),
      createConcept("¿Se puede sanear la nulidad absoluta?", "Art. 1683 parte final CC: sólo se puede sanear por el transcurso de 10 años desde la celebración del acto o contrato."),
      createConcept("¿Cuáles son las causales de nulidad relativa?", "Son causales de nulidad relativa: incapacidad relativa; error sustancial; error accidental cuando haya sido el principal motivo para contratar y era conocido por la otra parte; error en la persona cuando haya sido determinante; fuerza moral, grave, injusta y determinante; dolo determinante; omisión de algún requisito o formalidad en relación a la calidad o estado de las personas que ejecuten el acto; lesión, en ciertos casos."),
      createConcept("¿Quién puede solicitar la nulidad relativa?", "Art. 1684 CC: La nulidad relativa no puede ser declarada por el juez sino a pedimento de parte; ni puede pedirse su declaración por el ministerio público en el solo interés de la ley; ni puede alegarse sino por aquellos en cuyo beneficio la han establecido las leyes o por sus herederos o cesionarios."),
      createConcept("¿Cómo se puede sanear la nulidad relativa?", "Art. 1684 parte final CC: se produce el saneamiento por el lapso del tiempo y por ratificación o confirmación de las partes."),
      createConcept("¿Cuál es el plazo para solicitar la nulidad relativa?", "Art. 1691 CC: el plazo es de cuatro años. Este cuadrienio se contará según la causal: 1. Fuerza moral: desde el día en que ésta hubiere cesado. 2. Error o dolo: desde el día de la celebración del acto o contrato. 3. Incapacidad legal: desde el día en que haya cesado esta incapacidad. Todo ello en los casos en que leyes especiales no hubieren designado otro plazo."),
      createConcept("¿Se suspende el plazo para solicitar la nulidad relativa?", "Art. 1692 CC: sí, se suspende por la muerte del beneficiado, quien transmitirá a sus herederos. A. Herederos mayores de edad: gozan del cuadrienio entero si no hubiere principiado a correr, y del residuo en caso contrario. B. Herederos menores: el cuadrienio o su residuo empieza a correr desde que llegaren a edad mayor. En este caso no se podrá pedir la nulidad pasados 10 años desde la celebración del acto."),
      createConcept("¿Qué es la confirmación o ratificación?", "Acto jurídico unilateral en virtud del cual la parte que tenía derecho de alegar la nulidad relativa renuncia a esa facultad saneando el vicio de que adolecía el acto o contrato. (Arturo Alessandri)"),
      createConcept("¿Cuáles son los tipos de confirmación?", "Arts. 1693 y siguientes CC. La ratificación puede ser: 1. Expresa: se formula una declaración en la cual, en términos explícitos y formales, se manifiesta la voluntad de validar un determinado acto. 2. Tácita: consiste en la ejecución voluntaria de la obligación contraída o convenida."),
      createConcept("¿Cuáles son los efectos de la nulidad entre las partes?", "Art. 1687 CC: La nulidad pronunciada en sentencia que tiene la fuerza de cosa juzgada, da a las partes derecho para ser restituidas al mismo estado en que se hallarían si no hubiese existido el acto o contrato nulo; sin perjuicio de lo prevenido sobre el objeto o causa ilícita. Si las obligaciones no se cumplieron, la nulidad opera como modo de extinguirlas."),
      createConcept("¿Cuáles son los efectos de la nulidad respecto de terceros?", "Art. 1689 CC: La nulidad judicialmente pronunciada da acción reivindicatoria contra terceros poseedores; sin perjuicio de las excepciones legales."),
      createConcept("¿Qué es la conversión del acto nulo?", "El medio jurídico en virtud del cual un negocio se salva de la nulidad, convirtiéndose en otro diferente que sustituye al primero, salvaguardado en lo posible el fin perseguido por las partes. (José Luis de los Mozos)"),
      createConcept("¿Qué es la resolución?", "La pérdida de efectos de un acto jurídico, como consecuencia de haber operado una condición resolutoria tácita, la que generalmente produce efectos retroactivos de manera tal que las partes vuelven al mismo estado en que se encontraban al momento de celebrar el acto jurídico y por lo tanto se entiende que éste nunca ha existido."),
      createConcept("¿Qué es la revocación?", "Una declaración unilateral de voluntad que consiste en la retractación de un acto jurídico precedente, incluso bilateral, consentida por la ley al autor de dicha retractación. Por ejemplo, la revocación del testamento o del mandato."),
      createConcept("¿Qué es la resciliación?", "La resciliación es aquella convención en virtud de la cual las partes, de común acuerdo, estipulan dejar sin efecto un contrato válidamente celebrado, en la medida que sus efectos no estén totalmente cumplidos."),
      createConcept("¿Qué es la caducidad?", "La caducidad tiene diversos significados: 1. Pérdida de un derecho por no hacerlo valer en el plazo legal o contractual. 2. Ineficacia de un acto jurídico por el solo ministerio de la ley, a causa de hechos sobrevinientes (ej. testamentos privilegiados, Art. 1212 CC). 3. Exigibilidad anticipada de las obligaciones, como la caducidad del plazo. 4. Extinción de usufructos sucesivos o alternativos o de fideicomisos sucesivos."),
      createConcept("¿Qué es la inoponibilidad?", "Es la ineficacia de un acto jurídico o de su nulidad, respecto de ciertos terceros, por no haber cumplido las partes algún requisito externo de eficacia, dirigido precisamente a proteger a esos terceros."),
      createConcept("¿Qué es la suspensión?", "Hay suspensión del acto jurídico cuando los efectos de éste, para tener lugar, están subordinados a la ocurrencia de un hecho que aún no se ha verificado. Tal hecho puede emanar de las partes o de la ley. Por ejemplo, mediante una condición suspensiva o un plazo suspensivo pactados por los contratantes, o mediante una condición legal (ej. en el testamento, las disposiciones están supeditadas a la muerte del causante)."),
      createConcept("¿Qué es el desistimiento unilateral?", "Es aquel que se produce cuando una de las partes decide y comunica a la otra el término de la relación contractual. Este derecho es excepcional y puede ejercitarse solo cuando la ley lo establece o los contratantes lo pactan. Por ejemplo, el desahucio en el contrato de arrendamiento."),
      createConcept("¿Qué es la simulación?", "Declaración de un contenido de voluntad no real, emitida conscientemente y de acuerdo entre las partes para producir, con fines de engaño, la apariencia de un negocio jurídico que no existe o que es distinto de aquel que realmente se ha llevado a cabo. (Francisco Ferrara)"),
      createConcept("¿Cómo se clasifica la simulación?", "La simulación puede ser: A. Lícita o ilícita: según si tiene o no por finalidad perjudicar a terceros o violar la ley. B. Absoluta o relativa: según si se contempla un único acto simulado, o dos actos (el simulado y el disimulado)."),
      createConcept("¿Cuáles son los requisitos de la simulación?", "Los requisitos para que exista simulación son: 1. Declaración que, deliberadamente, se contrapone con la verdadera intención de las partes. 2. Que tal declaración haya sido concertada por las partes. 3. Que el fin perseguido por las partes sea el engaño a terceros."),
      createConcept("¿Cuáles son los efectos de la simulación?", "A. Entre las partes: el acto simulado no existe, rigiéndose éstas por su voluntad real. Por regla general las partes extienden una contraescritura, que se regirá por el artículo 1707 CC. B. Respecto de terceros: prevalecerá la voluntad declarada por las partes (el acto aparente), ya que es el que los terceros conocen; la voluntad real de las partes no afecta a terceros por regla general."),
    ],
  },
  {
    ...createModule("Teoría de las Obligaciones"),
    concepts: [
      createConcept("¿Qué es una obligación?", "Vínculo jurídico entre dos personas determinadas, en virtud del cual el deudor se encuentra en la necesidad jurídica de dar, hacer o no hacer algo a favor del acreedor."),
      createConcept("¿Cuáles son los elementos de la obligación?", "Sujeto activo (acreedor), sujeto pasivo (deudor) y objeto (prestación)."),
      createConcept("¿Cuáles son las fuentes de las obligaciones según el artículo 1437 del Código Civil?", "Contrato, cuasicontrato, delito, cuasidelito y la ley."),
      createConcept("¿Qué es un contrato o convención?", "Acto por el cual una parte se obliga para con otra a dar, hacer o no hacer alguna cosa."),
      createConcept("¿Cómo se clasifican las obligaciones según su eficacia?", "En obligaciones civiles y obligaciones naturales."),
      createConcept("¿Qué son las obligaciones civiles?", "Aquellas que dan derecho para exigir su cumplimiento."),
      createConcept("¿Qué son las obligaciones naturales?", "Aquellas que no confieren derecho para exigir su cumplimiento, pero que cumplidas, autorizan para retener lo que se ha dado o pagado en razón de ellas."),
      createConcept("¿Cuáles son los casos de obligaciones naturales del artículo 1470?", "Las contraídas por incapaces relativos; las civiles extinguidas por prescripción; las que proceden de actos a que faltan solemnidades; y las no reconocidas en juicio por falta de prueba."),
      createConcept("¿Qué clase de incapacidad genera una obligación natural según el artículo 1470 N°1?", "La incapacidad relativa de los menores adultos (y excluye a los disipadores según la doctrina mayoritaria)."),
      createConcept("¿Desde cuándo la obligación civil extinguida por prescripción pasa a ser natural?", "Desde que se declara judicialmente la prescripción (doctrina mayoritaria) o desde que transcurre el tiempo (doctrina minoritaria)."),
      createConcept("¿A qué tipo de actos se refiere el artículo 1470 N°3 sobre obligaciones naturales que proceden de actos a que faltan las solemnidades?", "A los actos jurídicos unilaterales, como el testamento (según la doctrina clásica de Claro Solar y Somarriva)."),
      createConcept("¿Cuáles son los efectos de las obligaciones naturales?", "Autorizan a retener lo pagado, pueden ser novadas, pueden ser caucionadas (por terceros), no producen excepción de cosa juzgada y no pueden compensarse legalmente."),
      createConcept("¿Qué es la obligación de dar?", "Aquella en que el deudor se obliga a transferir el dominio o a constituir un derecho real sobre la cosa."),
      createConcept("¿Qué obligación se entiende legalmente contenida en la de dar?", "La obligación de entregar la cosa, y si es una especie o cuerpo cierto, la de conservarla hasta la entrega."),
      createConcept("¿Qué es la obligación de entregar?", "Aquella que consiste en el simple traspaso material de la cosa (mera tenencia), sin transferir el dominio."),
      createConcept("¿Qué es una obligación de hacer?", "Aquella en que el deudor se obliga a realizar un hecho material o jurídico."),
      createConcept("¿Qué es una obligación de no hacer?", "Aquella en que el deudor se obliga a abstenerse de un hecho que de otro modo le sería lícito ejecutar."),
      createConcept("¿Qué es una obligación de especie o cuerpo cierto?", "Aquella en que se debe determinadamente un individuo de una clase o género determinado."),
      createConcept("¿Qué efecto produce la pérdida fortuita de la especie o cuerpo cierto debido?", "Extingue la obligación por imposibilidad de ejecución (pérdida de la cosa que se debe)."),
      createConcept("¿Qué es una obligación de género?", "Aquella en que se debe indeterminadamente un individuo de una clase o género determinado."),
      createConcept("¿Cómo cumple el deudor una obligación de género?", "Entregando cualquier individuo del género, con tal que sea de una calidad a lo menos mediana."),
      createConcept("¿Perece el género (genus nunquam perit)?", "No, el género no perece, por lo que la pérdida fortuita de algunas cosas no extingue la obligación de género."),
      createConcept("¿Qué son las obligaciones con pluralidad de objeto?", "Aquellas en que se deben varias cosas (acumulativas), una de varias cosas (alternativas) o una cosa con facultad de pagar con otra (facultativas)."),
      createConcept("¿Qué es una obligación alternativa?", "Aquella por la cual se deben varias cosas, de tal manera que la ejecución de una de ellas exonera de la ejecución de las otras."),
      createConcept("¿A quién corresponde la elección en la obligación alternativa por regla general?", "Al deudor, a menos que se haya pactado expresamente lo contrario."),
      createConcept("¿Qué es una obligación facultativa?", "Aquella que tiene por objeto una cosa determinada, pero concediéndose al deudor la facultad de pagar con esta cosa o con otra que se designa."),
      createConcept("¿Qué son las obligaciones puras y simples?", "Aquellas que producen sus efectos de inmediato, sin estar sujetas a modalidades."),
      createConcept("¿Qué son las modalidades?", "Cláusulas que se insertan en un acto jurídico para modificar sus efectos normales, ya sea en cuanto a su nacimiento, exigibilidad o extinción."),
      createConcept("¿Qué es la condición?", "El hecho futuro e incierto del cual depende el nacimiento o la extinción de un derecho y su correlativa obligación."),
      createConcept("¿Qué es una condición suspensiva?", "Aquella de la cual depende el nacimiento de un derecho."),
      createConcept("¿Qué es una condición resolutoria?", "Aquella de la cual depende la extinción de un derecho."),
      createConcept("¿En qué tres estados puede encontrarse la condición?", "Pendiente, cumplida y fallida."),
      createConcept("¿Qué es la condición resolutoria ordinaria?", "Cualquier hecho futuro e incierto, que no sea el incumplimiento de una obligación, del cual dependa la extinción de un derecho. Opera de pleno derecho."),
      createConcept("¿Qué es la condición resolutoria tácita?", "La que va envuelta en todo contrato bilateral, para el caso de no cumplirse por la otra parte lo pactado. Requiere resolución judicial."),
      createConcept("¿Qué es el pacto comisorio?", "Es la condición resolutoria tácita expresada en el contrato. Puede ser simple o calificado."),
      createConcept("¿Qué es el plazo?", "El hecho futuro y cierto del cual depende el ejercicio o la extinción de un derecho."),
      createConcept("¿Cuál es la principal diferencia entre plazo y condición?", "La certeza. El plazo es un hecho cierto que fatalmente llegará; la condición es un hecho incierto."),
      createConcept("¿A favor de quién se entiende establecido el plazo por regla general?", "A favor del deudor, salvo que se estipule o se infiera lo contrario."),
      createConcept("¿Cómo se extingue el plazo?", "Por vencimiento (regla general), por renuncia o por caducidad (convencional o legal por insolvencia)."),
      createConcept("¿Qué es el modo como modalidad?", "La carga o gravamen que se impone a la persona a quien se otorga una liberalidad."),
      createConcept("¿Qué son las obligaciones simplemente conjuntas?", "Aquellas en que hay varios deudores y/o acreedores, y un solo objeto divisible, donde cada deudor está obligado a su cuota y cada acreedor solo exige su cuota. Son la regla general."),
      createConcept("¿Qué ocurre con la insolvencia de un deudor en la obligación simplemente conjunta?", "No grava a los demás codeudores."),
      createConcept("¿Qué es la obligación solidaria?", "Aquella en que, debiéndose un objeto divisible y habiendo pluralidad de sujetos, la ley, el testamento o la convención dispone que cada acreedor pueda exigir el total y cada deudor esté obligado al total."),
      createConcept("¿Cuáles son las fuentes de la solidaridad?", "La convención, el testamento y la ley. La solidaridad no se presume."),
      createConcept("¿Qué es la solidaridad activa?", "Aquella en que hay varios acreedores y un deudor, pudiendo cualquier acreedor exigir el pago total de la deuda."),
      createConcept("¿Qué es la solidaridad pasiva?", "Aquella en que hay varios deudores y un acreedor, pudiendo este exigir a cualquiera de los deudores el pago total de la deuda."),
      createConcept("¿Qué ocurre si un codeudor solidario paga la deuda íntegramente?", "Extingue la obligación respecto del acreedor y subroga al deudor que pagó en los derechos del acreedor contra los demás codeudores (acción de reembolso)."),
      createConcept("¿Qué excepciones puede oponer el codeudor solidario demandado?", "Excepciones reales (inherentes a la obligación, como nulidad absoluta o pago) y excepciones personales suyas."),
      createConcept("¿Se propaga la interrupción de la prescripción en la solidaridad?", "Sí, la interrupción que obra en perjuicio de uno de los codeudores solidarios perjudica a los demás."),
      createConcept("¿Qué es la obligación indivisible?", "Aquella en que el objeto de la prestación no admite división, sea física o intelectual, obligando a cada deudor al cumplimiento íntegro."),
      createConcept("¿Cuál es la principal diferencia funcional entre solidaridad e indivisibilidad?", "La indivisibilidad se transmite a los herederos (cada heredero debe el total); la solidaridad no se transmite como tal, sino que la deuda se divide a prorrata entre los herederos del deudor solidario."),
      createConcept("¿Cuáles son los efectos de las obligaciones (derechos del acreedor)?", "El derecho a exigir el cumplimiento forzado, la indemnización de perjuicios y los derechos auxiliares."),
      createConcept("¿Qué es el derecho de prenda general?", "El derecho del acreedor para perseguir la ejecución de sus créditos sobre todos los bienes raíces y muebles del deudor, presentes y futuros, exceptuando los inembargables."),
      createConcept("¿Qué es la ejecución forzada?", "El procedimiento judicial mediante el cual el acreedor exige el cumplimiento de la obligación en naturaleza, apoyado en un título ejecutivo."),
      createConcept("¿Qué es la indemnización de perjuicios?", "El derecho del acreedor a obtener del deudor el pago de una cantidad de dinero equivalente al beneficio pecuniario que le habría reportado el cumplimiento exacto, íntegro y oportuno de la obligación."),
      createConcept("¿Cuáles son las clases de indemnización de perjuicios?", "Compensatoria (reemplaza el cumplimiento) y moratoria (repara el retardo en el cumplimiento)."),
      createConcept("¿Se puede acumular el cumplimiento forzado con la indemnización compensatoria?", "Por regla general no, porque implicaría un doble pago, salvo que se haya estipulado una cláusula penal."),
      createConcept("¿Cuáles son los requisitos de la responsabilidad contractual?", "Infracción de la obligación, imputabilidad (dolo o culpa), mora del deudor, daño y relación de causalidad."),
      createConcept("¿Qué es la culpa en materia contractual?", "La falta del cuidado o diligencia debida en el cumplimiento de una obligación. Por regla general, se presume."),
      createConcept("¿Cuáles son los tres grados de culpa según el artículo 44?", "Culpa grave o lata, culpa leve y culpa o descuido levísimo."),
      createConcept("¿A qué equivale jurídicamente la culpa lata en materias civiles?", "Al dolo."),
      createConcept("¿De qué culpa responde el deudor en los contratos que ceden en beneficio mutuo (ej. compraventa)?", "De culpa leve."),
      createConcept("¿De qué culpa responde el deudor cuando el contrato cede solo en su propio beneficio (ej. comodato)?", "De culpa levísima."),
      createConcept("¿Qué es el dolo contractual?", "La intención positiva de inferir injuria a la persona o propiedad de otro mediante el incumplimiento sistemático. No se presume, debe probarse."),
      createConcept("¿Qué efecto tiene el dolo en la cuantía de la indemnización?", "Agrava la responsabilidad, haciendo que el deudor responda tanto de los perjuicios directos previstos como de los directos imprevistos."),
      createConcept("¿Qué es la mora del deudor?", "El retardo imputable en el cumplimiento de la obligación, unido a la interpelación del acreedor."),
      createConcept("¿Cuándo se encuentra en mora el deudor (art. 1551)?", "1) Al expirar el término estipulado; 2) Cuando la cosa no ha podido ser dada o ejecutada sino dentro de cierto espacio de tiempo y el deudor lo ha dejado pasar; 3) En los demás casos, cuando ha sido judicialmente reconvenido."),
      createConcept("¿Qué significa el aforismo la mora purga la mora (art. 1552)?", "Que en los contratos bilaterales ninguno de los contratantes está en mora dejando de cumplir lo pactado, mientras el otro no lo cumpla por su parte, o no se allane a cumplirlo en la forma y tiempo debidos."),
      createConcept("¿Qué es el daño o perjuicio?", "El detrimento, menoscabo o lesión que experimenta el acreedor en su patrimonio o en su persona a causa del incumplimiento del deudor."),
      createConcept("¿Cómo se clasifica el daño material?", "En daño emergente (empobrecimiento real y efectivo) y lucro cesante (utilidad legítima que deja de percibirse)."),
      createConcept("¿Qué son los derechos auxiliares del acreedor?", "Medios que la ley otorga al acreedor para mantener intacto el patrimonio del deudor, impidiendo que los bienes salgan de él o haciendo que vuelvan."),
      createConcept("¿Cuáles son los cuatro principales derechos auxiliares?", "Las medidas conservativas, la acción oblicua o subrogatoria, la acción pauliana o revocatoria y el beneficio de separación de patrimonios."),
      createConcept("¿Qué es la acción pauliana o revocatoria?", "La acción que la ley otorga a los acreedores para dejar sin efecto los actos celebrados por el deudor en fraude de sus derechos y que le han causado un perjuicio (insolvencia)."),
      createConcept("¿Qué es la acción oblicua o subrogatoria?", "El ejercicio de los derechos y acciones del deudor por parte de sus acreedores, cuando el primero es negligente en ejercerlos y esto perjudica a los segundos."),
      createConcept("¿Cuáles son los modos de extinguir las obligaciones (art. 1567)?", "Resciliación, pago, novación, transacción, remisión, compensación, confusión, pérdida de la cosa, nulidad o rescisión, condición resolutoria y prescripción extintiva."),
      createConcept("¿Qué es la resciliación o mutuo disenso?", "La convención en que las partes interesadas, siendo capaces de disponer libremente de lo suyo, consienten en dar la obligación por nula o extinguida."),
      createConcept("¿Qué es el pago efectivo?", "La prestación de lo que se debe. Es el modo normal y natural de extinguir las obligaciones."),
      createConcept("¿Quiénes pueden hacer el pago?", "El deudor, un tercero interesado (codeudor solidario, fiador, tercer poseedor de la finca hipotecada) y un tercero extraño."),
      createConcept("¿Qué efecto produce el pago hecho por un tercero extraño con el consentimiento del deudor?", "Se configura un mandato y opera la subrogación legal a favor del tercero."),
      createConcept("¿A quién debe hacerse válidamente el pago?", "Al acreedor mismo, a su representante legal o convencional, o al actual poseedor del crédito."),
      createConcept("¿Cuándo el pago hecho al acreedor es nulo?", "1) Si el acreedor no tiene la administración de sus bienes; 2) Si el crédito fue embargado o mandado a retener judicialmente; 3) Si se paga al deudor insolvente en fraude de sus acreedores en concurso."),
      createConcept("¿Dónde debe hacerse el pago?", "En el lugar designado por la convención. Si no hay estipulación: si es especie, donde existía al constituirse la obligación; si es otra cosa, en el domicilio del deudor."),
      createConcept("¿Qué es el pago por consignación?", "El depósito de la cosa que se debe en manos de un tercero, con las formalidades legales, ante la repugnancia o no comparecencia del acreedor a recibirla."),
      createConcept("¿Qué es el pago con subrogación?", "La transmisión de los derechos del acreedor a un tercero que le paga. Puede ser legal (art. 1610) o convencional."),
      createConcept("¿Qué es la dación en pago?", "Convención entre acreedor y deudor por la cual el primero acepta en pago una cosa distinta de la debida, extinguiéndose la obligación."),
      createConcept("¿Qué es la novación?", "La substitución de una nueva obligación a otra anterior, la cual queda por tanto extinguida."),
      createConcept("¿Cuáles son los requisitos de la novación?", "Obligación anterior válida, obligación nueva válida, diferencia esencial entre ambas, capacidad para novar y animus novandi (intención de novar)."),
      createConcept("¿Qué es la novación subjetiva por cambio de deudor?", "Cuando un nuevo deudor sustituye al antiguo, que queda libre."),
      createConcept("¿Cuál es la diferencia entre delegación y expromisión?", "En la delegación el cambio de deudor se hace con el consentimiento del primer deudor. En la expromisión se hace sin su consentimiento."),
      createConcept("¿Qué es la compensación?", "Modo de extinguir que opera por el solo ministerio de la ley cuando dos personas son deudoras una de otra, extinguiendo las deudas hasta la concurrencia de la de menor valor."),
      createConcept("¿Cuáles son los requisitos de la compensación legal?", "Que ambas deudas sean de dinero o fungibles del mismo género/calidad, líquidas, actualmente exigibles y pagaderas en el mismo lugar."),
      createConcept("¿Qué es la remisión?", "La condonación o perdón de la deuda que hace el acreedor. Si es gratuita, se sujeta a las reglas de la donación."),
      createConcept("¿Qué es la confusión?", "Modo de extinguir que opera cuando concurren en una misma persona las calidades de acreedor y deudor de la misma obligación."),
      createConcept("¿Qué es la pérdida de la cosa que se debe (imposibilidad de ejecución)?", "Modo de extinguir que opera cuando el cuerpo cierto debido perece, se destruye, deja de estar en el comercio o desaparece y se ignora si existe."),
      createConcept("¿Qué ocurre si la especie perece por culpa del deudor o estando en mora?", "La obligación subsiste, pero varía de objeto: el deudor es obligado al pago del precio de la cosa y a indemnizar los perjuicios."),
      createConcept("¿Qué es la prescripción extintiva?", "Modo de extinguir las acciones y derechos ajenos, por no haberse ejercido durante cierto lapso de tiempo, y concurriendo los demás requisitos legales."),
      createConcept("¿Cuáles son los requisitos de la prescripción extintiva?", "Que la acción sea prescriptible, inacción del acreedor, transcurso del tiempo, que no haya operado suspensión o interrupción, y que sea alegada."),
      createConcept("¿Qué es la interrupción civil de la prescripción extintiva?", "Todo recurso judicial intentado por el que se pretende acreedor, notificado legalmente al deudor antes de que transcurra el tiempo de prescripción."),
      createConcept("¿Cuál es el efecto de la interrupción de la prescripción?", "Hace perder todo el tiempo de prescripción que hubiere transcurrido."),
      createConcept("¿A favor de quiénes opera la suspensión de la prescripción extintiva?", "A favor de los menores, dementes, sordos/sordomudos que no se dan a entender claramente, y la mujer casada en sociedad conyugal (mientras dure la incapacidad o el régimen)."),
      createConcept("¿Cuál es el plazo ordinario de prescripción de las acciones?", "La acción ejecutiva prescribe en 3 años, y la acción ordinaria en 5 años (la ejecutiva se convierte en ordinaria por los 2 años restantes)."),
    ],
  },
  {
    ...createModule("Teoría de los Bienes"),
    concepts: [
      createConcept("¿Qué son los bienes?", "Los bienes son cosas que, pudiendo procurar al hombre una utilidad, son susceptibles de apropiación por los particulares. En doctrina se distingue 'cosa y bien'. En cambio, para el Código Civil, cosa y bien se utilizan como sinónimos."),
      createConcept("¿Cómo se clasifican los bienes?", "Los bienes o cosas se clasifican en: 1. Cosas corporales e incorporales. 2. Cosas corporales muebles e inmuebles. 3. Cosas específicas y genéricas. 4. Cosas consumibles y no consumibles. 5. Cosas fungibles y no fungibles. 6. Cosas divisibles e indivisibles. 7. Cosas presentes y cosas futuras. 8. Cosas principales y accesorias. 9. Cosas comerciables y no comerciables. 10. Cosas singulares y universales. 11. Cosas apropiables e inapropiables. 12. Bienes particulares o nacionales."),
      createConcept("¿En qué consisten las cosas corporales e incorporales?", "Corporales son las que tienen un ser real y pueden ser percibidas por los sentidos, como una casa, un libro. Las cosas corporales se clasifican en bienes muebles e inmuebles. Incorporales las que consisten en meros derechos, como los créditos, y las servidumbres activas. Las cosas incorporales pueden consistir en derechos reales y personales."),
      createConcept("¿Qué son los bienes muebles e inmuebles?", "Bienes muebles: los que pueden transportarse de un lugar a otro sin detrimento de su sustancia. Se clasifican en mueble por naturaleza y mueble por anticipación. Bienes inmuebles o fincas o bienes raíces: los que no pueden transportarse sin que se altere su sustancia. Se clasifican en inmueble por naturaleza, por adherencia y por destinación."),
      createConcept("¿Qué importancia tiene distinguir entre bienes muebles e inmuebles?", "1. La tradición de inmuebles se realiza por inscripción en el CBR; la de muebles por simple entrega. 2. La compraventa de mueble es consensual; la de inmueble es solemne. 3. Para incapaces, los requisitos son más estrictos para enajenar bienes raíces. 4. La hipoteca recae solo sobre inmuebles; la prenda solo sobre muebles. 5. La posesión de inmuebles se adquiere, prueba y conserva mediante inscripción. 6. Prescripción ordinaria: 2 años (muebles), 5 años (inmuebles). 7. La acción rescisoria por lesión enorme solo procede en venta o permuta de inmuebles."),
      createConcept("¿Qué son los bienes muebles por naturaleza?", "Son los que pueden transportarse de un lugar a otro sin detrimento de su sustancia. Se dividen en: A. Semovientes: se trasladan moviéndose por sí solos, como los animales. B. Inanimados: requieren fuerza externa para trasladarse, como un libro."),
      createConcept("¿Qué son los bienes muebles por anticipación?", "Son bienes inmuebles por naturaleza, por adherencia o por destinación que, para el efecto de constituir un derecho sobre ellos en favor de persona distinta del dueño, se reputan muebles antes de su separación del inmueble al que pertenecen."),
      createConcept("¿Qué son los bienes inmuebles por naturaleza?", "Inmuebles o fincas o bienes raíces son las cosas que no pueden transportarse de un lugar a otro, como las tierras y minas."),
      createConcept("¿Qué son los bienes inmuebles por adherencia?", "Son aquellos bienes que adhieren permanentemente a las cosas que no pueden transportarse de un lugar a otro, como los edificios y los árboles."),
      createConcept("¿Qué son los bienes inmuebles por destinación?", "Son bienes muebles que se reputan inmuebles al estar permanentemente destinados al uso, cultivo y beneficio de un inmueble, aunque puedan separarse sin detrimento."),
      createConcept("¿Cuándo los derechos y acciones se reputan bienes muebles o inmuebles?", "Se reputan muebles o inmuebles según lo sea la cosa en que han de ejercerse o que se debe. El derecho de usufructo sobre un inmueble es inmueble; la acción del comprador para que se le entregue la finca comprada es inmueble; la acción del que prestó dinero para que se le pague es mueble."),
      createConcept("¿Los hechos que se deben se reputan muebles o inmuebles?", "Los hechos que se deben se reputan muebles. La acción para que un artífice ejecute la obra convenida o resarza los perjuicios causados por la inejecución del convenio entra en la clase de los bienes muebles."),
      createConcept("¿Cómo pueden ser los bienes incorporales?", "Las cosas incorporales consisten en meros derechos: Derecho real (art. 577 CC): el que tenemos sobre una cosa sin respecto a determinada persona. Derecho personal (art. 578 CC): los que solo pueden reclamarse de ciertas personas que han contraído las obligaciones correlativas."),
      createConcept("¿Cuáles son los derechos reales?", "Son derechos reales el de dominio, el de herencia, los de usufructo, uso o habitación, los de servidumbres activas, el de prenda y el de hipoteca. Fuera de la enumeración del art. 577, existen otros como el derecho de aprovechamiento de aguas o de concesiones mineras."),
      createConcept("¿Cuáles son los elementos del derecho real?", "1. Sujeto activo: persona natural o jurídica titular del derecho real. 2. Objeto: la cosa sobre la cual recae el derecho. 3. Sujeto pasivo: la comunidad, obligada a abstenerse de perturbar el derecho real."),
      createConcept("¿Cuáles son los elementos del derecho personal?", "1. Sujeto activo o acreedor: titular del derecho, quien puede exigir el cumplimiento. 2. Sujeto pasivo o deudor: quien debe cumplir la obligación. 3. Objeto: la prestación, que puede ser un hecho positivo o negativo."),
      createConcept("¿Cuál es la fuente de un derecho real y un derecho personal?", "La fuente de los derechos reales son los modos de adquirir. Los derechos personales surgen de las fuentes de las obligaciones: contrato, cuasicontrato, delito, cuasidelito y la ley (arts. 578, 1437 y 2284 CC)."),
      createConcept("¿Cuáles son las diferencias entre derecho real y personal?", "1. Los reales son limitados (solo la ley puede crearlos); los personales son ilimitados. 2. Los reales se constituyen por modos de adquirir; los personales por fuentes de obligaciones. 3. El sujeto pasivo del derecho real es indeterminado (la colectividad); el del personal es determinado. 4. El objeto del derecho real es una cosa; el del personal es una prestación. 5. El derecho real es absoluto (oponible a todos); el personal es relativo (solo contra el obligado)."),
      createConcept("¿Qué son las cosas específicas y genéricas?", "Cosas específicas o cuerpos ciertos: determinadas por características propias que las distinguen de todas las demás del mismo género. Cosas genéricas: diferenciadas solo por características comunes a todos los individuos del mismo género."),
      createConcept("¿Qué son las cosas consumibles y no consumibles?", "Son objetivamente consumibles las que, por sus caracteres específicos, se destruyen natural o civilmente por el primer uso. Son no consumibles las que no se destruyen por el primer uso, como un cuaderno o un automóvil. Esta distinción solo aplica a bienes muebles."),
      createConcept("¿Qué son las cosas fungibles y no fungibles?", "Son fungibles las que pueden ser reemplazadas por otras equivalentes y tienen igual poder liberatorio, como monedas, vino o agua. Son no fungibles las que tienen individualidad propia y no admiten reemplazo, como un cuadro de Da Vinci."),
      createConcept("¿Qué son las cosas divisibles e indivisibles?", "Materialmente divisibles: las que pueden fraccionarse sin destruirse ni perder notablemente su valor. Intelectualmente divisibles: las que pueden fraccionarse en partes ideales o imaginarias aunque no puedan serlo materialmente."),
      createConcept("¿Qué son las cosas presentes y cosas futuras?", "Son bienes presentes los que tienen existencia real al momento de constituirse la relación jurídica. Son bienes futuros los que no existen al momento de celebrarse el acto jurídico, pero se espera que existan."),
      createConcept("¿Qué son las cosas comerciables e incomerciables?", "Comerciables: pueden ser objeto de relaciones jurídicas privadas y son susceptibles de dominio por particulares. Incomerciables: no pueden ser objeto de relaciones jurídicas por particulares ni susceptibles de dominio privado."),
      createConcept("¿Qué es el derecho real de dominio?", "El dominio (o propiedad) es el derecho real en una cosa corporal, para gozar y disponer de ella arbitrariamente, no siendo contra la ley o contra derecho ajeno. La propiedad separada del goce de la cosa se llama mera o nuda propiedad."),
      createConcept("¿Cuáles son las características del dominio?", "A. Es un derecho real. B. Es absoluto: otorga la plenitud de derechos sobre la cosa (uso, goce y disposición). C. Es exclusivo: supone un titular único. D. Es perpetuo: no está limitado en el tiempo. Excepción: propiedad fiduciaria."),
      createConcept("¿Cuáles son los atributos del dominio?", "Uso: servirse de la cosa según el fin al que está destinada. Goce: aprovecharse de los frutos naturales y civiles. Disposición: destruir materialmente la cosa, transformarla, conservarla o enajenarla."),
      createConcept("¿Se puede limitar la facultad de enajenar?", "Sí, por disposición de la ley (arts. 819, 1464, 1192 CC) o por voluntad del hombre mediante cláusulas de no enajenar (ej. en el usufructo, la propiedad fiduciaria o la donación, arts. 793, 751 y 1432 N°1 CC)."),
      createConcept("¿Cómo se clasifica el derecho de propiedad?", "Según su extensión: plena, nuda, absoluta o fiduciaria. Según su titular: individual o copropiedad/condominio. Según su objeto: civil, intelectual e industrial."),
      createConcept("¿Qué es la comunidad y la copropiedad?", "La comunidad (art. 2304 CC) es una especie de cuasicontrato entre dos o más personas sobre una cosa universal o singular. La copropiedad es el derecho de propiedad de dos o más personas sobre una misma cosa pro indiviso, correspondiendo a cada una una parte alícuota, ideal y abstracta. La comunidad es el género y la copropiedad es la especie."),
      createConcept("¿Qué son los modos de adquirir el dominio?", "Son hechos jurídicos a los cuales la ley atribuye la facultad de hacer nacer o traspasar el dominio: 1. Ocupación. 2. Accesión. 3. Tradición. 4. Sucesión por causa de muerte. 5. Prescripción adquisitiva. 6. La ley."),
      createConcept("¿Cómo se clasifican los modos de adquirir el dominio?", "A. Originarios o derivativos. B. A título universal o singular. C. A título oneroso o gratuito. D. Por acto entre vivos o por causa de muerte."),
      createConcept("¿Qué es la ocupación?", "Es un modo de adquirir el dominio de las cosas que no pertenecen a nadie, cuya adquisición no está prohibida por las leyes chilenas o el Derecho Internacional, mediante la aprehensión material con intención de adquirir el dominio."),
      createConcept("¿Cuáles son las características de la ocupación?", "1. Es un modo entre vivos. 2. Es a título gratuito. 3. Es originario. 4. Es a título singular. 5. Opera solo respecto de cosas corporales muebles. 6. Para algunos es un acto jurídico; para otros, un hecho jurídico."),
      createConcept("¿Cuáles son los requisitos de la ocupación?", "1. Que se trate de cosas sin dueño. 2. Que la adquisición no esté prohibida por la ley chilena o el Derecho Internacional. 3. Aprehensión material de la cosa. 4. Intención de adquirir el dominio."),
      createConcept("¿Qué es la accesión?", "Es un modo de adquirir por el cual el dueño de una cosa pasa a serlo de lo que ella produce o de lo que se junta a ella. Los productos de las cosas son frutos naturales o civiles."),
      createConcept("¿Cuáles son las características de la accesión?", "1. Es un modo entre vivos. 2. Generalmente es a título gratuito. 3. Es originario. 4. Es a título singular. 5. Recae solo sobre cosas corporales. 6. Es un hecho jurídico."),
      createConcept("¿Cuáles son las clases de accesión?", "1. Accesión de frutos o discreta (generación de frutos). 2. Accesión propiamente tal o continua: A. De inmueble a inmueble: aluvión, avulsión, mutación del álveo, formación de nuevas islas. B. De mueble a mueble: adjunción, especificación, mezcla. C. De mueble a inmueble: edificación, plantación, siembra."),
      createConcept("¿Cómo se clasifican los frutos y en qué estado pueden encontrarse?", "Frutos naturales: los que da la naturaleza ayudada o no de la industria humana. Estados: pendiente, percibidos, consumidos. Frutos civiles: utilidades o rendimientos equivalentes al uso y goce de la cosa por un tercero. Estados: pendiente, percibidos, devengados."),
      createConcept("¿Qué es la tradición?", "Es un modo de adquirir el dominio que consiste en la entrega que el dueño hace de la cosa a otro, habiendo por una parte la facultad e intención de transferir el dominio, y por otra la capacidad e intención de adquirirlo."),
      createConcept("¿Cuáles son las características de la tradición?", "1. Es un modo entre vivos. 2. Puede ser a título oneroso o gratuito. 3. Es derivativo. 4. Por regla general es a título singular, salvo la tradición del derecho real de herencia. 5. Sirve para adquirir el dominio y demás derechos reales. 6. Se refiere a bienes corporales e incorporales. 7. Es un acto jurídico bilateral."),
      createConcept("¿Cuáles son los requisitos de la tradición?", "1. Concurrencia de tradente y adquirente. 2. Consentimiento de ambas partes. 3. Existencia de un título traslaticio de dominio. 4. Entrega de la cosa."),
      createConcept("¿Es válida la tradición si el tradente no es dueño?", "Es válida, pero no transfiere el dominio; solo se adquieren los derechos transmisibles del tradente. Si el tradente adquiere después el dominio, se entiende transferido desde el momento de la tradición (arts. 682 y 683 CC)."),
      createConcept("¿Cómo se efectúa la tradición del dominio y otros derechos reales en inmuebles?", "Por la inscripción del título en el Registro del Conservador de Bienes Raíces. Del mismo modo se realiza la tradición de los derechos de usufructo, uso, habitación, censo e hipoteca sobre inmuebles."),
      createConcept("¿Qué finalidad puede tener la inscripción en el Conservador de Bienes Raíces?", "1. Forma de realizar la tradición de derechos reales sobre inmuebles. 2. Publicidad y mantener la historia de la propiedad raíz. 3. Prueba, requisito y garantía de la posesión de bienes inmuebles. 4. En ciertos actos constituye el cumplimiento de una solemnidad (arts. 1400, 767, 812, 2409 y 2410 CC)."),
      createConcept("¿Cómo se efectúa la tradición de una cosa corporal mueble?", "Significando una de las partes a la otra que le transfiere el dominio, y figurando esta transferencia por uno de los medios que señala el artículo 684 CC."),
      createConcept("¿Cuáles son las formas de realizar la tradición de un bien mueble?", "1°. Permitiéndole la aprehensión material de una cosa presente. 2°. Mostrándosela. 3°. Entregándole las llaves del lugar en que esté guardada. 4°. Encargándose de poner la cosa a disposición del otro en el lugar convenido. 5°. Por la venta, donación u otro título de enajenación conferido al que tiene la cosa como usufructuario, arrendatario, depositario, etc.; y recíprocamente por el mero contrato en que el dueño se constituye en esas calidades."),
      createConcept("¿Cómo se efectúa la tradición de la servidumbre?", "Por escritura pública en que el tradente exprese constituirla y el adquirente la acepte. Esta escritura puede ser la misma del acto o contrato."),
      createConcept("¿Cómo se efectúa la tradición del derecho real de herencia?", "El Código no lo regula expresamente. Existen dos doctrinas: 1. Si la herencia es una universalidad jurídica, se aplican las reglas generales del art. 684 CC. 2. Si se atiende a los bienes singulares, se aplican las reglas de muebles o inmuebles según los bienes que comprenda."),
      createConcept("¿Cómo se efectúa la tradición de los derechos personales?", "La tradición de los derechos personales que un individuo cede a otro se verifica por la entrega del título hecha por el cedente al cesionario."),
      createConcept("¿Cuáles son los efectos de la tradición?", "A. Si el tradente es dueño: la tradición transfiere el dominio en las mismas condiciones en que lo tenía el tradente. B. Si el tradente no es dueño: la tradición es válida, aunque no transfiere el dominio. Se aplican los arts. 682 y 683 CC."),
      createConcept("¿Qué es la posesión?", "La posesión es la tenencia de una cosa determinada con ánimo de señor o dueño, sea que el dueño o el que se da por tal tenga la cosa por sí mismo o por otra persona a su nombre. El poseedor es reputado dueño mientras otra persona no justifica serlo."),
      createConcept("¿Cuáles son los elementos de la posesión?", "El Corpus: poder físico o potestad de hecho sobre la cosa. El Animus: comportarse como propietario, como señor o dueño."),
      createConcept("¿Cuáles son las semejanzas y diferencias entre la posesión y el dominio?", "Semejanzas: A. Ambos recaen en una cosa determinada. B. Ambos son exclusivos. C. Sus utilidades se ejercen de igual modo. Diferencias: A. El dominio es un derecho real; la posesión, un hecho. B. El dominio se adquiere solo por un modo; la posesión puede adquirirse por varios títulos. C. El dominio está protegido por la acción reivindicatoria; la posesión, por las acciones posesorias."),
      createConcept("¿Cómo se clasifica la posesión?", "La posesión puede clasificarse en: regular o irregular; útil o inútil; viciosa o no viciosa; tranquila o no tranquila."),
      createConcept("¿Cuáles son los requisitos de la posesión regular?", "1. Justo título. 2. Buena fe inicial. 3. Tradición (si el título es traslaticio de dominio)."),
      createConcept("¿Qué es un justo título?", "El hecho o acto en que se funda la posesión que, por su naturaleza o por ser verdadero y válido, es apto en abstracto para transferir el dominio."),
      createConcept("¿Cuáles son los títulos injustos?", "1. El falsificado. 2. El conferido por quien actúa como mandatario o representante legal sin serlo, o excediéndose en sus facultades. 3. El que adolece de un vicio de nulidad. 4. El meramente putativo."),
      createConcept("¿De qué clase pueden ser los títulos?", "Constitutivos de dominio: dan origen al dominio (ocupación, accesión, prescripción). Traslaticios de dominio: sirven para transferirlo (venta, permuta, donación). Declarativos de dominio: reconocen una situación preexistente (sentencias judiciales sobre derechos litigiosos)."),
      createConcept("¿Qué es la buena fe en materia de posesión?", "La conciencia de haberse adquirido el dominio de la cosa por medios legítimos, exentos de fraude y de todo otro vicio. En títulos traslaticios, supone la persuasión de haber recibido la cosa de quien tenía facultad de enajenarla."),
      createConcept("¿Cuál es la posesión viciosa?", "Son posesiones viciosas la violenta (adquirida por la fuerza) y la clandestina (ejercida ocultándola a quienes tienen derecho a oponerse)."),
      createConcept("¿Cómo se adquiere, conserva y pierde la posesión de un bien mueble?", "Se adquiere con aprehensión material y voluntad. Se conserva mientras subsistan corpus y animus, o solo el animus. Se pierde cuando se pierden ambos elementos, cuando se pierde el corpus (otro se apodera con ánimo de dueño) o cuando se pierde el animus (constituto posesorio)."),
      createConcept("¿Cómo se adquiere la posesión de un bien inmueble no inscrito?", "Depende del título: si es simple apoderamiento, basta ese hecho. Si es título no traslaticio, no requiere inscripción. Si es título traslaticio: la posesión regular requiere inscripción en el CBR; la posesión irregular se discute en doctrina."),
      createConcept("¿Cómo se adquiere la posesión de un bien inmueble inscrito?", "Si es título constitutivo de dominio, no requiere inscripción. Si es título traslaticio, se requiere inscripción en el CBR para la posesión regular. Para la posesión irregular, una opinión muy minoritaria estima que no se necesita inscripción."),
      createConcept("¿Cómo se pierde la posesión de un bien inmueble inscrito?", "Es necesario que la inscripción se cancele, sea por voluntad de las partes, por una nueva inscripción en que el poseedor transfiere su derecho a otro, o por decreto judicial. Mientras subsista la inscripción, quien se apodera del inmueble no adquiere posesión ni pone fin a la existente."),
      createConcept("¿En qué consiste la teoría de la posesión inscrita?", "La inscripción en el CBR es requisito (nadie puede adquirir posesión de inmuebles sino por inscripción), prueba (la posesión se prueba por la inscripción subsistente por un año completo) y garantía (mientras subsista la inscripción, quien se apodera del inmueble no adquiere posesión)."),
      createConcept("¿Qué es la mera tenencia?", "La que se ejerce sobre una cosa no como dueño, sino en lugar o a nombre del dueño. El mero tenedor reconoce dominio ajeno (ej. acreedor prendario, secuestre, usufructuario, arrendatario)."),
      createConcept("¿Puede el mero tenedor cambiar su calidad a poseedor?", "Por regla general no, la mera tenencia es inmutable (art. 716 CC). Existe una aparente excepción en el art. 2510 n°3 CC, pero la doctrina mayoritaria señala que requiere otros antecedentes además del simple transcurso del tiempo."),
      createConcept("¿Qué es la prescripción adquisitiva?", "Es un modo de adquirir las cosas ajenas, por haberlas poseído durante cierto lapso de tiempo y concurriendo los demás requisitos legales."),
      createConcept("¿Cuáles son las características de la prescripción adquisitiva?", "1. Es un modo entre vivos. 2. Es a título gratuito. 3. Es originario. 4. Generalmente a título singular, salvo prescripción del derecho real de herencia. 5. Sirve para adquirir el dominio y los demás derechos reales, salvo servidumbres discontinuas y continuas inaparentes. 6. La posesión es el elemento fundamental. 7. Naturaleza mixta: hecho (posesión por cierto tiempo) y acto jurídico (alegarla)."),
      createConcept("¿Cuáles son los requisitos de la prescripción adquisitiva?", "1. Que la cosa sea susceptible de ganarse por prescripción. 2. La posesión. 3. Que la prescripción no esté interrumpida. 4. Que no esté suspendida. 5. Transcurso del tiempo."),
      createConcept("¿Qué cosas son susceptibles de ganarse por prescripción?", "La regla general es que todas las cosas sean susceptibles. Por excepción, no lo son: 1. Las cosas fuera del comercio humano. 2. Los derechos de la personalidad. 3. Los derechos personales. 4. Las servidumbres discontinuas y continuas inaparentes. 5. Las cosas indeterminadas. 6. Las cosas propias."),
      createConcept("¿Qué es la interrupción de la prescripción?", "El hecho de la naturaleza o del hombre que, destruyendo uno de los elementos necesarios para prescribir (posesión o inacción del propietario), hace inútil todo el tiempo transcurrido."),
      createConcept("¿Cuándo se produce la interrupción natural?", "1°. Cuando se ha hecho imposible el ejercicio de actos posesorios sin pasar la posesión a otras manos (ej. heredad permanentemente inundada): se descuenta su duración. 2°. Cuando se ha perdido la posesión por haber entrado en ella otra persona: se pierde todo el tiempo, salvo que se haya recobrado legalmente."),
      createConcept("¿Qué es la interrupción civil?", "Todo recurso judicial intentado por el que se pretende verdadero dueño de la cosa contra el poseedor."),
      createConcept("¿En qué casos no se produce la interrupción civil?", "1. Si la notificación de la demanda no fue hecha en forma legal. 2. Si el recurrente desistió expresamente de la demanda. 3. Si se declaró abandonada la instancia. 4. Si el demandado obtuvo sentencia de absolución."),
      createConcept("¿Qué es la suspensión de la prescripción?", "Beneficio legal que impide que la prescripción ordinaria corra contra ciertas personas mientras dura su incapacidad: menores, dementes, sordos/sordomudos que no pueden darse a entender, los bajo potestad paterna o tutela/curaduría, la mujer casada en sociedad conyugal y la herencia yacente."),
      createConcept("¿Cuál es el plazo para adquirir por prescripción adquisitiva?", "Ordinaria (art. 2508): 2 años para muebles, 5 años para bienes raíces. Extraordinaria (art. 2511): 10 años contra toda persona, sin suspensión."),
      createConcept("¿Qué es la acción reivindicatoria?", "La que tiene el dueño de una cosa singular de que no está en posesión, para que el poseedor sea condenado a restituírsela."),
      createConcept("¿Cuáles son los requisitos de la acción reivindicatoria?", "1. Que quien la intenta sea dueño de la cosa. 2. Que haya perdido la posesión. 3. Que se trate de cosas susceptibles de reivindicarse."),
      createConcept("¿Qué son las prestaciones mutuas?", "Las devoluciones e indemnizaciones que recíprocamente se deben el reivindicante y el poseedor vencido."),
      createConcept("¿Qué prestaciones debe el poseedor vencido al reivindicante?", "1. La restitución de la cosa. 2. Pago de los deterioros. 3. Pago de los frutos. 4. Indemnización de gastos de custodia y conservación durante el juicio reivindicatorio."),
      createConcept("¿Qué prestaciones debe el reivindicante al poseedor vencido?", "1. Indemnización de los gastos ordinarios por la producción de los frutos. 2. Indemnización por las mejoras introducidas en la cosa."),
      createConcept("¿En qué consiste el derecho legal de retención del poseedor vencido?", "Cuando el poseedor vencido tuviere un saldo que reclamar en razón de expensas y mejoras, podrá retener la cosa hasta que se verifique el pago o se le asegure a su satisfacción."),
      createConcept("¿Qué son las acciones posesorias?", "Las que tienen por objeto conservar o recuperar la posesión de bienes raíces o de derechos reales constituidos en ellos."),
      createConcept("¿Cuáles son las características de las acciones posesorias?", "1. Naturaleza inmueble. 2. Nace de un hecho, no de un derecho, pero se califica de acción real porque puede ejercerse sin respecto a determinada persona. 3. Tiene por objeto la conservación o recuperación de la posesión. 4. Se requiere posesión tranquila y no interrumpida por un año. 5. Queda a salvo el derecho a discutir el dominio posteriormente."),
      createConcept("¿Cuáles son los requisitos para entablar una acción posesoria?", "1. Posesión tranquila y no interrumpida durante un año completo. 2. El objeto debe ser susceptible de acción posesoria. 3. Perturbación o despojo de la posesión. 4. Que la acción no esté prescrita."),
      createConcept("¿Qué es la querella de amparo?", "Acción que tiene por objeto conservar la posesión de bienes raíces o de derechos reales constituidos en ellos."),
      createConcept("¿Qué es la querella de restitución?", "Acción para recuperar la posesión de bienes raíces o derechos reales cuando el poseedor ha sido injustamente privado de ella."),
      createConcept("¿Qué es la querella de restablecimiento?", "Acción concedida al que ha sido despojado violentamente de la posesión o mera tenencia de un inmueble, para que le sea restituida en el estado existente antes del acto de violencia."),
      createConcept("¿Qué es la acción publiciana?", "La que se concede, aunque no se pruebe dominio, al que ha perdido la posesión regular de la cosa y se hallaba en el caso de poderla ganar por prescripción."),
      createConcept("¿Qué es la propiedad fiduciaria?", "La que está sujeta al gravamen de pasar a otra persona por el hecho de verificarse una condición."),
      createConcept("¿Cuáles son los requisitos de la propiedad fiduciaria?", "1. Que la cosa sea susceptible de darse en fideicomiso. 2. Existencia del constituyente, propietario fiduciario y del fideicomisario. 3. Existencia de una condición. 4. Cumplimiento de las solemnidades o formalidades."),
      createConcept("¿Cómo se constituye la propiedad fiduciaria?", "Los fideicomisos no pueden constituirse sino por acto entre vivos otorgado en instrumento público, o por acto testamentario. La constitución de todo fideicomiso que comprenda o afecte un inmueble deberá inscribirse en el competente Registro."),
      createConcept("¿Qué es el usufructo?", "Derecho real que consiste en la facultad de gozar de una cosa con cargo de conservar su forma y sustancia y de restituirla a su dueño, o de devolver igual cantidad y calidad del mismo género o pagar su valor si la cosa es fungible."),
      createConcept("¿Cuáles son las características del usufructo?", "1. Es un derecho real de goce. 2. Es una limitación al dominio. 3. Es temporal. 4. Es intransmisible. 5. El usufructuario es dueño de su derecho (puede ejercer acción reivindicatoria). 6. El usufructuario es mero tenedor de la cosa dada en usufructo."),
      createConcept("¿Cuáles son los requisitos del usufructo?", "1. Cosas susceptibles de usufructo. 2. Sujetos: constituyente, nudo propietario y usufructuario. 3. Existencia de un plazo."),
      createConcept("¿Se puede constituir dos o más usufructos sucesivos o alternativos?", "Se prohíbe. Si de hecho se constituyeren, los usufructuarios posteriores se consideran como substitutos para el caso de faltar los anteriores. El primer usufructo que tenga efecto hará caducar los otros, pero no durará sino por el tiempo designado."),
      createConcept("¿Qué es el derecho de uso y habitación?", "El derecho de uso es un derecho real que consiste en la facultad de gozar de una parte limitada de las utilidades y productos de una cosa. Si se refiere a una casa y a la utilidad de morar en ella, se llama derecho de habitación."),
      createConcept("¿Qué es la servidumbre?", "Art. 820 CC: Servidumbre predial, o simplemente servidumbre, es un gravamen impuesto sobre un predio en utilidad de otro predio de distinto dueño."),
    ],
  },
  {
    ...createModule("Contratos Parte Especial"),
    concepts: [
      createConcept("¿Qué es el contrato de promesa?", "Es aquel en que dos o más personas se comprometen a celebrar un contrato futuro, cumpliéndose los requisitos legales (Arturo Alessandri)."),
      createConcept("¿Cuáles son las características del contrato de promesa?", "a. Contrato Principal. b. Contrato Solemne. c. Contrato Preparatorio. d. Puede ser Unilateral o Bilateral. e. De derecho estricto. f. Puede ser a título gratuito u oneroso. g. Contrato sujeto a modalidad (plazo o condición). h. Genera una obligación indivisible, de hacer. i. Genera una acción de carácter mueble."),
      createConcept("¿Cuáles son los requisitos del contrato de promesa?", "Art. 1554 CC: 1ª. Que la promesa conste por escrito. 2ª. Que el contrato prometido no sea de aquellos que las leyes declaran ineficaces. 3ª. Que la promesa contenga un plazo o condición que fije la época de la celebración del contrato. 4ª. Que en ella se especifique de tal manera el contrato prometido, que sólo falten para que sea perfecto, la tradición de la cosa, o las solemnidades que las leyes prescriban."),
      createConcept("¿Cuáles son los efectos del contrato de promesa?", "Genera una obligación de hacer. Si se cumple: se extingue la promesa y pasa a tener vida el contrato definitivo. Si no se cumple: se puede solicitar al juez que apremie al contratante renuente para que celebre el contrato, y de negarse, que suscriba dicho contrato por la parte rebelde o que declare resuelto el contrato y ordene indemnización de perjuicios (arts. 1553 y 1489 CC)."),
      createConcept("¿Qué es el contrato de compraventa?", "Art. 1793 CC: La compraventa es un contrato en que una de las partes se obliga a dar una cosa y la otra a pagarla en dinero. Aquélla se dice vender y ésta comprar. El dinero que el comprador da por la cosa vendida se llama precio."),
      createConcept("¿Cuáles son las características del contrato de compraventa?", "a. Contrato Bilateral. b. Contrato Oneroso. c. Generalmente conmutativo. d. Contrato Principal. e. Regla general es consensual, excepcionalmente solemne. f. Regla general de ejecución instantánea, excepcionalmente diferida. g. Es un título traslaticio de dominio. h. Regla general los gastos son a cargo del vendedor."),
      createConcept("¿Cuáles son los requisitos del contrato de compraventa?", "1. Consentimiento. 2. La cosa vendida: debe ser comerciable, existir o esperarse que exista, determinada y singular, y no ser propiedad del comprador. 3. El precio: debe ser en dinero, real y determinado."),
      createConcept("¿La compraventa de cosa ajena es válida?", "Art. 1815 CC: La venta de cosa ajena vale, sin perjuicio de los derechos del dueño de la cosa vendida, mientras no se extingan por el lapso de tiempo."),
      createConcept("¿Cuáles son las modalidades particulares de la compraventa?", "1. Venta con arras: suma de dinero o cosas muebles que se dan en garantía de la celebración del contrato o como parte del precio (Arts. 1803-1805). 2. Venta a peso, cuenta o medida: necesario pesar, contar o medir para determinar la cosa o el precio (Art. 1821). 3. Venta al gusto o prueba: no hay contrato mientras el comprador no declara que le agrada la cosa (Art. 1823)."),
      createConcept("¿Cómo se perfecciona el contrato de compraventa?", "Art. 1801 CC: La venta se reputa perfecta desde que las partes han convenido en la cosa y en el precio. Excepción: la venta de bienes raíces, servidumbre, censos y sucesión hereditaria no se reputa perfecta mientras no se haya otorgado escritura pública."),
      createConcept("¿Cuáles son las obligaciones del vendedor y del comprador?", "Obligaciones del vendedor: 1. Entrega o tradición de la cosa. 2. Saneamiento de la cosa vendida. 3. Conservar la especie o cuerpo cierto hasta la entrega. Obligaciones del comprador: 1. Pagar el precio. 2. Recibir la cosa comprada."),
      createConcept("¿Cómo debe efectuarse la entrega en la compraventa?", "Art. 1824 CC: Bien mueble: significando una de las partes a la otra que le transfiere el dominio, por alguna de las formas del art. 684. Bien inmueble: mediante la inscripción del contrato en el CBR. Se ha discutido si basta la inscripción, señalándose que también debe comprender la entrega material del inmueble."),
      createConcept("¿En qué consiste la obligación de saneamiento?", "Tiene dos objetos: A. Amparar al comprador en el dominio y posesión pacífica de la cosa. B. Responder de los defectos ocultos o redhibitorios. Es una obligación de la naturaleza (puede excluirse), eventual, y supone una deficiencia jurídica o material de la cosa."),
      createConcept("¿En qué consiste el saneamiento de la evicción?", "Consiste en amparar al comprador en el dominio y posesión pacífica. Comprende: 1ª etapa: obligación de hacer, defender al comprador contra terceros que reclaman derechos sobre la cosa. 2ª etapa (si fracasa): obligación de dar, indemnizar al comprador. Art. 1838: hay evicción cuando el comprador es privado del todo o parte de la cosa por sentencia judicial."),
      createConcept("¿Qué son los vicios redhibitorios?", "Son los vicios o defectos que existiendo al tiempo de la venta y no siendo conocidos por el comprador, hacen que la cosa sea impropia para su uso natural o que solo sirva imperfectamente. Requisitos (Art. 1858): 1. El vicio debe haber existido al tiempo de la venta. 2. Debe ser grave. 3. Debe ser oculto. Dan derecho a la acción redhibitoria (resolución) o acción quanti minoris (rebaja de precio)."),
      createConcept("¿Qué es el contrato de permuta?", "Art. 1897 CC: La permutación o cambio es un contrato en que las partes se obligan mutuamente a dar una especie o cuerpo cierto por otro."),
      createConcept("¿Qué es la cesión de derechos?", "Es la transferencia de un derecho por acto entre vivos. El CC regula tres especies: A. Cesión de derechos personales. B. Cesión del derecho real de herencia. C. Cesión de derechos litigiosos."),
      createConcept("¿En qué consiste la cesión de derechos personales?", "Es el traspaso o tradición por el cual una persona transfiere voluntariamente a otra los derechos personales que tiene contra un tercero. Intervinientes: Cedente (acreedor que transfiere), Cesionario (adquiere el derecho, pasando a ocupar el lugar del acreedor), Deudor (sujeto pasivo que queda obligado a favor del cesionario)."),
      createConcept("¿Cómo se perfecciona la cesión de derechos personales?", "Entre cedente y cesionario: no tiene efecto sino en virtud de la entrega del título (Art. 1901). Respecto del deudor y terceros: no produce efecto mientras no ha sido notificada por el cesionario al deudor o aceptada por éste (Art. 1902). Si no hay notificación o aceptación se aplica el art. 1905."),
      createConcept("¿Qué efectos produce la cesión de derechos personales?", "1. En cuanto a su extensión: Art. 1906 CC: la cesión comprende sus fianzas, privilegios e hipotecas, pero no traspasa las excepciones personales del cedente. 2. Nulidad relativa: pasa al cesionario la facultad de solicitarla. 3. Excepción de compensación (Art. 1659). 4. Responsabilidad: si fue a título gratuito, el cedente no responde; si es a título oneroso, solo responde de la existencia del crédito al momento de la cesión."),
      createConcept("¿Qué es la cesión del derecho real de herencia?", "Es la transferencia que efectúa el heredero a un tercero, del todo o parte de sus derechos en la herencia, una vez producido el fallecimiento del causante. Regulada en los artículos 1909 y 1910 CC."),
      createConcept("¿En qué consiste la cesión de derechos litigiosos?", "Art. 1911 CC: Se cede un derecho litigioso cuando el objeto directo de la cesión es el evento incierto de la litis, del que no se hace responsable el cedente. Se entiende litigioso un derecho desde que se notifica judicialmente la demanda."),
      createConcept("¿Qué es el contrato de arrendamiento?", "Art. 1915 CC: Es un contrato en que las dos partes se obligan recíprocamente, la una a conceder el goce de una cosa, o a ejecutar una obra o prestar un servicio, y la otra a pagar por este goce, obra o servicio un precio determinado. Comprende: arrendamiento de cosa, confección de obra material, y prestación de servicio."),
      createConcept("¿Cuáles son las características del contrato de arrendamiento?", "a. Contrato Principal. b. Consensual (salvo predios rústicos). c. Bilateral. d. De derecho estricto. e. Oneroso. f. Conmutativo. g. De tracto sucesivo. h. Título de mera tenencia."),
      createConcept("¿Cuáles son los requisitos del contrato de arrendamiento de cosa?", "1. Consentimiento. 2. La cosa arrendada: debe ser real, determinada y susceptible de darse en arrendamiento. 3. El precio (renta): debe ser en dinero o frutos naturales (aparcería en predios rústicos), real y determinado."),
      createConcept("¿Cómo se perfecciona el contrato de arrendamiento?", "Se perfecciona por el solo acuerdo de las partes, sin necesidad de solemnidad. Sin embargo: se limita la prueba de testigos (Art. 1709), puede convenirse solemnidad voluntaria (Art. 1921), es preferible reducirla a escritura pública e inscribirla en el CBR para efectos del Art. 1962. En predios urbanos, sin escritura se presume que la renta es la que declare el arrendatario (Ley 18.101, Art. 20)."),
      createConcept("¿Cuáles son las obligaciones del arrendador?", "1. Entrega de la cosa arrendada. 2. Mantenerla en estado de servir para el fin arrendado. 3. Librar al arrendatario de toda turbación o embarazo. 4. Sanear los vicios redhibitorios. 5. Reembolsar las sumas destinadas a reparaciones que eran cargo del arrendador. 6. Restituir la suma de dinero por concepto de garantía."),
      createConcept("¿Cuáles son las obligaciones del arrendatario?", "1. Pagar el precio o renta. 2. Usar la cosa según los términos del contrato. 3. Cuidar la cosa como un buen padre de familia. 4. Efectuar reparaciones locativas. 5. Restituir el bien una vez terminado el contrato."),
      createConcept("¿Quién responde de las reparaciones locativas y necesarias?", "Reparaciones locativas (deterioros normales del goce): de cargo del arrendatario, salvo que provengan de caso fortuito o mala calidad de la cosa arrendada. Reparaciones necesarias (sin las cuales la cosa desaparece o no puede usarse): de cargo del arrendador, siempre que el arrendatario no las haya hecho necesarias por su culpa y haya dado aviso oportuno."),
      createConcept("¿En qué casos el sucesor del arrendador está obligado a respetar el arriendo?", "Art. 1962 CC: 1. Todo aquel a quien se transfiere el derecho del arrendador por título lucrativo (gratuito). 2. A título oneroso, si el arrendamiento ha sido contraído por escritura pública; exceptuados los acreedores hipotecarios. 3. Los acreedores hipotecarios, si el arrendamiento fue otorgado por escritura pública inscrita en el CBR antes de la inscripción hipotecaria."),
      createConcept("¿Qué es el desahucio?", "Es una manifestación unilateral de voluntad por la cual una de las partes da aviso anticipado a la otra de su voluntad de poner fin al contrato de arrendamiento. Puede ser judicial o extrajudicial. En la Ley 18.101 de predios urbanos, solo se puede poner término al contrato mediante desahucio judicial."),
      createConcept("¿Qué es la tácita reconducción?", "Consiste en la renovación del contrato de arriendo por el hecho de retener el arrendatario la cosa con la aparente anuencia del arrendador. Por regla general no es aceptada (Art. 1956 inc. 1 y 2), pero se permite si: A. Se trate de un bien raíz. B. El arrendatario conserve la tenencia. C. El arrendatario con beneplácito del arrendador haya pagado la renta de tiempo subsiguiente a la terminación, o ambas partes hayan manifestado inequívocamente su intención de perseverar en el contrato."),
      createConcept("¿Cómo se termina el contrato de arrendamiento de cosas?", "Art. 1950 CC: 1°. Por la destrucción total de la cosa arrendada. 2°. Por la expiración del tiempo estipulado. 3°. Por la extinción del derecho del arrendador. 4°. Por sentencia del juez en los casos que la ley ha previsto. Además, se aplican los modos generales de extinción de contratos."),
      createConcept("¿Qué es el censo?", "Art. 2022 CC: Se constituye un censo cuando una persona contrae la obligación de pagar a otra un rédito anual, reconociendo el capital correspondiente, y gravando una finca suya con la responsabilidad del rédito y del capital. Este rédito se llama censo o canon; la persona que lo debe, censuario; y su acreedor, censualista."),
      createConcept("¿Qué es el contrato de sociedad?", "Art. 2053 CC: La sociedad o compañía es un contrato en que dos o más personas estipulan poner algo en común con la mira de repartir entre sí los beneficios que de ello provengan. La sociedad forma una persona jurídica, distinta de los socios individualmente considerados."),
      createConcept("¿Cuáles son las características del contrato de sociedad?", "a. Contrato Plurilateral. b. Oneroso. c. Conmutativo. d. Principal. e. Consensual. f. Intuito personae."),
      createConcept("¿Cuáles son los elementos del contrato de sociedad?", "1. Aporte de los socios. 2. Participación en las utilidades. 3. Contribución a las pérdidas. 4. Affectio societatis."),
      createConcept("¿Cuáles son las obligaciones de los socios?", "1. Efectuar el aporte. 2. Sanear la evicción del cuerpo cierto aportado. 3. Cuidar como un buen padre de familia los intereses sociales. 4. Prohibición de incorporar nuevos socios."),
      createConcept("¿Cuáles son las causales de disolución de la sociedad?", "1. Expiración del plazo o evento de una condición (Art. 2098). 2. Finalización del negocio para que fue contraída (Art. 2099). 3. Insolvencia de la sociedad (Art. 2100). 4. Pérdida total de los bienes sociales (Art. 2100). 5. Incumplimiento de efectuar el aporte prometido (Art. 2101). 6. Muerte de un socio (Art. 2103). 7. Incapacidad sobreviniente de un socio (Art. 2106). 8. Insolvencia sobreviniente de un socio (Art. 2106). 9. Acuerdo unánime de los socios (Art. 2107). 10. Renuncia de un socio (Art. 2108)."),
      createConcept("¿Qué es el contrato de mandato?", "Art. 2116 CC: El mandato es un contrato en que una persona confía la gestión de uno o más negocios a otra, que se hace cargo de ellos por cuenta y riesgo de la primera. El que confiere el encargo: comitente o mandante. El que acepta: apoderado, procurador o mandatario. El mandatario actúa por cuenta y riesgo del mandante (elemento de la esencia), quien aprovecha los beneficios y soporta las pérdidas."),
      createConcept("¿Cuáles son las características del contrato de mandato?", "a. Generalmente consensual (salvo mandato judicial, mandato para contraer matrimonio). b. Naturalmente oneroso. c. En principio bilateral. d. Contrato principal. e. Contrato de confianza (intuito personae). f. Mandatario obra por cuenta y riesgo del mandante."),
      createConcept("¿Cuáles son los requisitos del mandato?", "1. Que se confíe la ejecución de uno o más negocios jurídicos. 2. Que el mandato no interese solo al mandatario (Art. 2119: el negocio que interesa solo al mandatario es un mero consejo, sin obligación alguna). 3. Capacidad del mandante (reglas generales) y del mandatario (regla especial: puede ser menor adulto, Art. 2128)."),
      createConcept("¿Cuál es la relación entre mandato y representación?", "La representación (Art. 1448) es un elemento de la naturaleza del mandato, no de la esencia, por lo que el mandatario puede actuar a nombre propio. Son instituciones distintas: la representación es una modalidad de los actos jurídicos; el mandato, un contrato. La representación puede originarse en convención, ley o sentencia; el mandato solo en convención. Puede existir mandato sin representación."),
      createConcept("¿Cuáles son los efectos si el mandatario actúa a nombre propio (sin representación)?", "Art. 2151 CC: Si contrata a su propio nombre, no obliga respecto de terceros al mandante. Los efectos jurídicos del acto se radican en el patrimonio del mandatario, quien debe luego rendir cuenta: ceder los derechos adquiridos respecto de terceros, traspasar los bienes adquiridos para el mandante y las deudas contraídas a favor de terceros."),
      createConcept("¿Cuáles son las obligaciones del mandatario y del mandante?", "Obligaciones del mandatario: 1. Cumplir el mandato según lo convenido. 2. Rendir cuenta. Obligaciones del mandante: 1. Proveer lo necesario para la ejecución. 2. Reembolsar gastos razonables. 3. Pagar la remuneración estipulada o usual. 4. Pagar las anticipaciones de dinero con intereses corrientes. 5. Indemnizar las pérdidas sufridas sin culpa del mandatario y por causa del mandato."),
      createConcept("¿Se puede delegar el mandato?", "Art. 2135 CC: El mandatario puede delegar si no se le ha prohibido (elemento de la naturaleza). Los efectos dependen de si el mandante autoriza la delegación (con o sin indicación del delegado), la prohíbe expresamente, o nada dice. Regulado en los artículos 2135 a 2138 CC."),
      createConcept("¿Cuándo termina el contrato de mandato?", "Art. 2163 CC: 1°. Por el desempeño del negocio para que fue constituido. 2°. Por expiración del término o evento de la condición. 3°. Por la revocación del mandante. 4°. Por la renuncia del mandatario. 5°. Por la muerte del mandante o del mandatario. 6°. Por tener la calidad de deudor en un procedimiento concursal de liquidación. 7°. Por la interdicción del uno o del otro. 8°. Por la cesación de las funciones del mandante, si el mandato fue dado en ejercicio de ellas."),
      createConcept("¿Qué es el contrato de transacción?", "Art. 2446 CC: Es un contrato en que las partes terminan extrajudicialmente un litigio pendiente, o precaven un litigio eventual. La doctrina agrega: haciéndose las partes sacrificios o concesiones recíprocas. No es transacción el acto que solo consiste en la renuncia de un derecho que no se disputa."),
      createConcept("¿Cuáles son las características del contrato de transacción?", "a. Consensual. b. Bilateral. c. Oneroso. d. Equivalente jurisdiccional. e. Generalmente conmutativo. f. Principal. g. Puede ser título traslaticio de dominio y también declarativo. h. Intuito personae."),
      createConcept("¿Cuáles son los elementos del contrato de transacción?", "A. Existencia de un derecho dudoso. B. Concesiones recíprocas. C. Capacidad para transigir."),
      createConcept("¿Qué es el contrato de comodato?", "Art. 2174 CC: El comodato o préstamo de uso es un contrato en que una de las partes entrega a la otra gratuitamente una especie, mueble o raíz, para que haga uso de ella, y con cargo de restituir la misma especie después de terminado el uso. No se perfecciona sino por la tradición de la cosa (entendida como simple entrega, no como modo de adquirir el dominio, pues es título de mera tenencia)."),
      createConcept("¿Cuáles son las características del contrato de comodato?", "a. Real. b. Esencialmente gratuito. c. Unilateral. d. Principal. e. Título de mera tenencia."),
      createConcept("¿Cuáles son las obligaciones del comodatario?", "1. Conservar la cosa. 2. Usar la cosa en los términos convenidos. 3. Restituir la cosa."),
      createConcept("¿Cuáles son las obligaciones del comodante?", "Si bien el comodato es unilateral, pueden surgir obligaciones eventuales para el comodante (contrato sinalagmático imperfecto): 1. Pagar las expensas de conservación de la cosa. 2. Indemnizar los perjuicios que le haya causado al comodatario la mala calidad o condición de la cosa."),
      createConcept("¿Qué es el comodato precario y el simple precario?", "Comodato precario (Art. 2194): El comodante se reserva la facultad de pedir la restitución en cualquier tiempo. Simple precario (Art. 2195): No se presta la cosa para un servicio particular ni se fija tiempo para su restitución. También constituye precario la tenencia de una cosa ajena sin previo contrato y por ignorancia o mera tolerancia del dueño."),
      createConcept("¿Qué es el contrato de mutuo?", "Art. 2196 CC: El mutuo o préstamo de consumo es un contrato en que una de las partes entrega a la otra cierta cantidad de cosas fungibles con cargo de restituir otras tantas del mismo género y calidad."),
      createConcept("¿Cuáles son las características del contrato de mutuo?", "a. Real. b. Unilateral. c. Naturalmente gratuito. d. Principal. e. Título traslaticio de dominio. f. El objeto consiste en cosas fungibles que no sean dinero."),
      createConcept("¿Qué es una operación de crédito de dinero?", "Art. 1° Ley 18.010: Son aquellas por las cuales una de las partes entrega o se obliga a entregar una cantidad de dinero y la otra a pagarla en un momento distinto de aquél en que se celebra la convención. Constituye también operación de crédito de dinero el descuento de documentos representativos de dinero."),
      createConcept("¿Cuáles son las características de la operación de crédito de dinero?", "a. Puede ser real o consensual. b. Puede ser unilateral o bilateral. c. Naturalmente oneroso. d. Principal. e. Título traslaticio de dominio. f. El objeto consiste en una suma de dinero."),
      createConcept("¿Cuáles son las obligaciones del mutuario?", "Art. 2198 CC: Restituir igual cantidad de cosas del mismo género y calidad; si no fuere posible, podrá pagar lo que valgan en el tiempo y lugar en que ha debido hacerse el pago. También estará obligado a pagar intereses si se pactaron. En operaciones de crédito de dinero (Ley 18.010), se obliga a restituir la suma de dinero."),
      createConcept("¿En qué momento se debe hacer la restitución en el mutuo?", "Mutuo de cosas fungibles: en la época estipulada. Si no se fijó término, no habrá derecho de exigirlo dentro de los 10 días subsiguientes a la entrega (Art. 2200). Si se pactó que pagará cuando le sea posible, el juez fijará el plazo (Art. 2201). Operación de crédito de dinero: solo podrá exigirse el pago después de los 10 días contados desde la entrega (Art. 13 Ley 18.010)."),
      createConcept("¿Se puede anticipar el pago en el mutuo?", "Mutuo de cosas fungibles: Art. 2204 CC: el mutuario puede pagar toda la suma prestada aun antes del término estipulado, salvo que se hayan pactado intereses. Operación de crédito de dinero: el derecho a pagar anticipadamente es irrenunciable, conforme al Art. 10 Ley 18.010."),
      createConcept("¿Qué es el anatocismo?", "Es el interés calculado sobre interés. Antiguamente prohibido por el Art. 2210 CC, hoy está expresamente autorizado por el Art. 9° Ley 18.010: podrá estipularse el pago de intereses sobre intereses, capitalizándolos en cada vencimiento o renovación. En ningún caso la capitalización podrá hacerse por períodos inferiores a treinta días."),
      createConcept("¿Qué es el contrato de depósito?", "Art. 2211 CC: Llámase en general depósito el contrato en que se confía una cosa corporal a una persona que se encarga de guardarla y de restituirla en especie. La cosa depositada se llama también depósito."),
      createConcept("¿Cuáles son las características del contrato de depósito?", "a. Real. b. Unilateral. c. Esencialmente gratuito. d. Principal. e. Intuito personae. f. Título de mera tenencia."),
      createConcept("¿Cómo se clasifica el depósito?", "A. Regular: puede ser propiamente dicho (voluntario o necesario) o secuestro (convencional o judicial). B. Irregular."),
      createConcept("¿En qué consiste el contrato de depósito voluntario?", "Art. 2215 CC: Es un contrato en que una de las partes entrega a la otra una cosa corporal y mueble para que la guarde y la restituya en especie a voluntad del depositante. Obligaciones del depositario: 1. Guardar la cosa con la debida fidelidad. 2. Restituir la cosa a requerimiento del depositante."),
      createConcept("¿Qué es el depósito necesario?", "Art. 2236 CC: El depósito propiamente dicho se llama necesario cuando la elección de depositario no depende de la libre voluntad del depositante, como en el caso de un incendio, ruina, saqueo u otra calamidad semejante."),
      createConcept("¿Qué es el secuestro?", "Art. 2249 CC: El secuestro es el depósito de una cosa que se disputan dos o más individuos, en manos de otro que debe restituirla al que obtenga una decisión a su favor. El depositario se llama secuestre."),
      createConcept("¿Qué es el depósito irregular?", "Art. 2221 CC: En el depósito de dinero, si no es en arca cerrada cuya llave tiene el depositante, o con otras precauciones que hagan imposible tomarlo sin fractura, se presumirá que se permite emplearlo, y el depositario será obligado a restituir otro tanto en la misma moneda."),
      createConcept("¿Qué es el contrato de fianza?", "Art. 2335 CC: La fianza es una obligación accesoria, en virtud de la cual una o más personas responden de una obligación ajena, comprometiéndose para con el acreedor a cumplirla en todo o parte, si el deudor principal no la cumple. La fianza puede constituirse no solo a favor del deudor principal, sino de otro fiador."),
      createConcept("¿Cuáles son las características del contrato de fianza?", "a. Consensual. b. Unilateral. c. Gratuito. d. Accesorio. e. Pura y simple, pero admite modalidades. f. Admite subcontratación. g. Transmisible. h. Fiador responde de culpa leve."),
      createConcept("¿Cuáles son los efectos de la fianza entre acreedor y fiador?", "Antes que el acreedor demande al fiador: A. Derecho del fiador de anticipar el pago de la deuda. B. Derecho del fiador de exigir al acreedor que proceda contra el deudor. Efectos posteriores al requerimiento: A. Beneficio de excusión. B. Beneficio de división. C. Excepción de subrogación. D. Excepciones reales y personales."),
      createConcept("¿Qué es el beneficio de excusión?", "Art. 2357 CC: El fiador reconvenido puede exigir que antes de proceder contra él se persiga la deuda en los bienes del deudor principal, y en las hipotecas o prendas prestadas por éste para la seguridad de la misma deuda. Para hacerse valer, debe cumplir con los requisitos del artículo 2358 CC."),
      createConcept("¿Qué acciones tiene el fiador en contra del deudor?", "Una vez realizado el pago, el fiador tiene: Acción de reembolso o personal: emana del contrato de fianza, permite al fiador quedar totalmente indemne; comprende capital pagado, intereses, gastos y perjuicios. Acción subrogatoria: opera por el ministerio de la ley (Art. 1610 n°3), respecto del que paga una deuda a que se halla obligado subsidiariamente, pasando a ocupar el lugar del acreedor y gozar de sus garantías."),
      createConcept("¿Qué es el contrato de prenda?", "Art. 2384 CC: Por el contrato de empeño o prenda se entrega una cosa mueble a un acreedor para la seguridad de su crédito. La cosa entregada se llama prenda. El acreedor que la tiene se llama acreedor prendario."),
      createConcept("¿Cuáles son las características de la prenda?", "Características del contrato: a. Real (en prendas especiales es solemne). b. Unilateral. c. Accesorio. d. Título de mera tenencia. e. Regla general oneroso. Características del derecho de prenda: a. Derecho real (Art. 577). b. Derecho mueble (Art. 580). c. Concede privilegio de segunda clase. d. Indivisible (Art. 2405). e. Accesorio."),
      createConcept("¿Cuáles son los derechos del acreedor prendario?", "1. Derecho de retención. 2. Derecho de persecución. 3. Derecho de realización o venta. 4. Derecho de preferencia. 5. Derecho de ser indemnizado."),
      createConcept("¿En qué consiste el derecho de retención del acreedor prendario?", "Consiste en conservar la prenda hasta el pago total de la obligación (solo opera en prendas con desplazamiento). Comprende: la totalidad de la deuda en capital e intereses, gastos necesarios para conservar la prenda, y perjuicios ocasionados por la tenencia. Excepciones: el acreedor puede estar obligado a restituir si el deudor solicita reemplazo de la prenda o si el acreedor hace uso indebido de ella. Existe también la prenda tácita que permite retener aún pagado el crédito."),
      createConcept("¿Qué es la prenda tácita?", "Art. 2401 CC: Aun satisfecho el crédito en todas sus partes, el acreedor puede retener la prenda si tuviera contra el mismo deudor otros créditos que: 1. Sean ciertos y líquidos. 2. Se hayan contraído después que la obligación para la cual se constituyó la prenda. 3. Se hayan hecho exigibles antes del pago de la obligación anterior. No procede cuando el acreedor haya perdido la tenencia de la prenda (Art. 2393) ni cuando el deudor vende la cosa empeñada o constituye un derecho (Art. 2404)."),
      createConcept("¿Cuáles son las obligaciones del acreedor prendario?", "1. Restituir la cosa. 2. Cuidar y conservar la cosa como un buen padre de familia. 3. No puede usar la cosa."),
      createConcept("¿Cómo se extingue la prenda?", "Art. 2406 CC. Por vía consecuencial: extinguida la obligación principal se extingue la prenda (lo accesorio sigue la suerte de lo principal). Por vía principal o directa: A. Destrucción total de la prenda. B. Cuando la propiedad de la cosa pasa al acreedor por cualquier título. C. Resolución del derecho del constituyente. D. Abuso de la prenda por el acreedor."),
      createConcept("¿Qué es el contrato de hipoteca?", "Definición legal (Art. 2407 CC): La hipoteca es un derecho de prenda constituido sobre inmuebles que no dejan por eso de permanecer en poder del deudor. Definición doctrinaria (Somarriva): Derecho real que grava a un inmueble, que no deja de permanecer en poder del constituyente, destinado a asegurar el cumplimiento de una obligación principal, otorgando al acreedor la facultad de perseguir la finca en manos de quien se encuentre y pagarse preferentemente con el producto de su realización."),
      createConcept("¿Cuáles son las características de la hipoteca?", "Características del contrato: a. Unilateral. b. Accesorio. c. Puede ser gratuito u oneroso. d. Solemne (Arts. 2409 y 2410). Características del derecho: a. Derecho real (Art. 577). b. Derecho inmueble (Art. 580). c. La cosa hipotecada permanece en poder del deudor. d. Concede preferencia de tercera clase. e. Indivisible (Art. 2408). f. Accesorio."),
      createConcept("¿Cuáles son los efectos de la hipoteca en relación al inmueble hipotecado?", "La hipoteca se extiende a: A. El bien hipotecado (inmueble por naturaleza). B. Inmuebles por destinación (Art. 2420). C. Aumentos y mejoras que reciba la cosa hipotecada (Art. 2421). D. Rentas de arrendamiento e indemnizaciones de aseguradoras del bien (Art. 2422). E. Precio de la expropiación del inmueble (Art. 924 CPC)."),
      createConcept("¿Cuáles son los efectos de la hipoteca en relación al constituyente?", "La hipoteca no limita la facultad de disposición: Art. 2415: el dueño puede siempre enajenar o hipotecar los bienes gravados, no obstante cualquier estipulación en contrario. En cuanto al uso y goce, los conserva, pero no puede afectar al acreedor hipotecario: Art. 2427 permite al acreedor exigir mejoramiento de la hipoteca, otra seguridad equivalente, o demandar el pago inmediato si la finca se perdiere o deteriorare en términos de no ser suficiente para la seguridad de la deuda."),
      createConcept("¿Cuáles son los efectos de la hipoteca en relación al acreedor hipotecario?", "La hipoteca confiere al acreedor tres derechos: A. Derecho de venta: vender el bien hipotecado y pagarse con el producto. B. Derecho de persecución: perseguir el inmueble hipotecado sea quien fuere su poseedor y a cualquier título que lo haya adquirido. C. Derecho de pago preferente: la hipoteca constituye un crédito preferente de tercera clase."),
      createConcept("¿En qué consiste la acción de desposeimiento?", "Es la acción que dirige el acreedor hipotecario contra el tercer poseedor de la finca hipotecada. Notificado, tiene 10 días para: Pagar (se subroga en los derechos del acreedor en los mismos términos que la fianza). Abandonar la finca (no importa abandono del dominio ni posesión; puede recobrarla pagando la deuda antes de la adjudicación). No hacer nada (se procede al desposeimiento, Art. 759 CPC). Si abandona o es desposeído, debe ser plenamente indemnizado, incluidas las mejoras."),
      createConcept("¿Cómo se extingue la hipoteca?", "Por vía consecuencial: extinguida la obligación principal se extingue la hipoteca. Por vía principal o directa: A. Resolución del derecho del que la constituyó. B. Evento de la condición resolutoria o llegada del día hasta el cual fue constituida. C. Prórroga del plazo. D. Confusión. E. Cancelación por escritura pública tomada razón al margen de la inscripción. F. Expropiación por causa de utilidad pública. G. Purga de la hipoteca."),
      createConcept("¿En qué consiste la purga de la hipoteca?", "Art. 2428 CC: Forma de extinción mediante la cual cesa el derecho de persecución respecto del tercero que adquirió la finca hipotecada en pública subasta ordenada por el juez. Requisitos: venta en pública subasta ordenada por el juez, citación personal a los acreedores hipotecarios, y que la subasta se verifique transcurrido el término de emplazamiento. El Art. 492 CPC permite al acreedor hipotecario de grado preferente optar entre pagarse con el producto o conservar la hipoteca, si sus créditos no están devengados."),
      createConcept("¿Qué es el contrato de donación?", "Art. 1386 CC: La donación entre vivos es un acto por el cual una persona transfiere gratuita e irrevocablemente una parte de sus bienes a otra persona, que la acepta."),
      createConcept("¿Cuáles son las características del contrato de donación?", "a. Unilateral (salvo donación con cargas, que es bilateral). b. Gratuito. c. Principal. d. Consensual, aunque en la práctica es solemne. e. Entre vivos. f. Contrato de excepción. g. Título traslaticio de dominio. h. Irrevocable, salvo excepciones."),
      createConcept("¿Cuáles son los principales contratos aleatorios?", "Art. 2258 CC: 1°. El contrato de seguros. 2°. El préstamo a la gruesa ventura. 3°. El juego. 4°. La apuesta. 5°. La constitución de renta vitalicia. 6°. La constitución del censo vitalicio. Los dos primeros pertenecen al Código de Comercio."),
      createConcept("¿Qué es un cuasicontrato?", "Es un hecho voluntario, no convencional y lícito que produce obligaciones. El fundamento de sus obligaciones, según la doctrina mayoritaria, es el propósito de la ley de reparar el enriquecimiento sin causa. Los principales cuasicontratos son: la agencia oficiosa, el pago de lo no debido y la comunidad. Otros autores agregan: la aceptación de un legado y el depósito necesario hecho a un incapaz."),
      createConcept("¿Qué es la agencia oficiosa?", "Art. 2286 CC: La agencia oficiosa o gestión de negocios ajenos es un cuasicontrato por el cual el que administra sin mandato los negocios de alguna persona, se obliga para con ésta, y la obliga en ciertos casos. Intervinientes: agente oficioso o gerente (quien realiza la gestión) e interesado (por cuya cuenta se realiza)."),
      createConcept("¿Cuáles son los requisitos de la agencia oficiosa?", "1. La intrusión puede ser en uno o más negocios del interesado. 2. La intrusión debe ser espontánea. 3. El gestor debe actuar sin mandato. 4. No debe existir prohibición del interesado. 5. Intención del gestor de obligar al interesado. 6. Capacidad de los intervinientes."),
      createConcept("¿Cuáles son los efectos de la agencia oficiosa?", "Obligaciones del gerente: A. Emplear el cuidado de un buen padre de familia. B. Hacerse cargo de todas las dependencias del negocio y continuar la gestión hasta que el interesado pueda tomarla. C. Rendir cuenta regular de su gestión (Art. 2294). Obligaciones del interesado: A. Si la gestión le fue útil: cumplir las obligaciones contraídas por el gerente y reembolsarle las mejoras útiles o necesarias, sin obligación de pagar salario (Art. 2290). B. Si el negocio fue mal administrado: el interesado no se obliga ni con el gerente ni con terceros, siendo el gerente responsable de los perjuicios."),
      createConcept("¿Qué es el pago de lo no debido?", "Es un cuasicontrato por el cual, habiéndose pagado erróneamente una cosa que no se debe, se obliga quien la recibe a devolverla, y si estaba de mala fe, a devolver además sus productos e intereses. Requisitos: 1. Debe existir un pago. 2. Inexistencia de una obligación. 3. Que el pago se haya hecho por error."),
      createConcept("¿Cuáles son los efectos del pago de lo no debido?", "Si recibió dinero o cosa fungible: mala fe → restituir otro tanto con intereses corrientes; buena fe → restituir otro tanto sin intereses. Si es especie o cuerpo cierto: mala fe → responde de frutos, deterioros o pérdidas y contrae obligaciones del poseedor de mala fe; buena fe → no responde, salvo en cuanto se haya hecho más rico. Si vendió la cosa a un tercero: mala fe → obligado como poseedor que dolosamente dejó de poseer; buena fe → obligado a restituir el precio de la venta y ceder las acciones contra el comprador."),
      createConcept("¿Qué es la comunidad?", "La comunidad es un cuasicontrato en virtud del cual los que poseen en común una cosa universal o singular, sin que ninguno de ellos haya contratado sociedad o celebrado otra convención relativa a la misma cosa, contraen ciertas obligaciones recíprocas."),
    ],
  },
  {
    ...createModule("Contratos General"),
    concepts: [
      createConcept("¿Cuál es la definición legal de contrato?", "Art. 1438 CC: Contrato o convención es un acto por el cual una parte se obliga para con otra a dar, hacer o no hacer alguna cosa. Cada parte puede ser una o muchas personas."),
      createConcept("¿Cuáles son las críticas a la definición legal de contrato?", "Se emplea como sinónimo contrato y convención (la convención es el género — acto jurídico bilateral destinado a crear, modificar o extinguir derechos y obligaciones —, el contrato es la especie, destinada únicamente a crear derechos y obligaciones). Se confunde el objeto del contrato con el objeto de la obligación (el primero corresponde a las obligaciones que crea; el objeto de la obligación es la prestación de dar, hacer o no hacer)."),
      createConcept("¿Cuál es la definición doctrinaria de contrato?", "El contrato es un acto jurídico bilateral que crea derechos y obligaciones."),
      createConcept("¿Cuáles son los elementos del contrato?", "Art. 1444 CC: cosas de la esencia, de la naturaleza y puramente accidentales."),
      createConcept("¿Ejemplos de elementos de la esencia?", "Compraventa: el precio debe ser en dinero; si no, degenera en permuta, y si falta el precio, degenera en donación. Depósito: la gratuidad es esencial; si se pacta remuneración, degenera en arrendamiento de servicios (Art. 2219). Comodato: esencialmente gratuito; si se pacta precio, degenera en arrendamiento."),
      createConcept("¿Ejemplos de elementos de la naturaleza?", "Compraventa: obligación de saneamiento (evicción y vicios redhibitorios). Mandato: delegación, representación y remuneración. Contratos bilaterales: condición resolutoria tácita."),
      createConcept("¿Ejemplos de elementos accidentales?", "En general corresponden a las modalidades (plazo, condición o modo), como el pacto comisorio, pacto de retroventa y pacto de retracto en la compraventa."),
      createConcept("¿Cuáles son las funciones del contrato?", "Función económica: principal vehículo de las relaciones económicas, circulación de la riqueza e intercambio de bienes y servicios. Función social: medio de colaboración entre los hombres, relacionada directamente con el principio de buena fe."),
      createConcept("¿Cuáles son las subfunciones del contrato?", "Función de cambio (títulos traslaticios de dominio). Función de crédito (mutuo, contratos bancarios). Función de garantía (prenda, hipoteca, fianza). Función de custodia (depósito). Función laboral (trabajo, arrendamiento de servicios, mandato). Función de previsión (seguro). Función de recreación (transporte turístico, hotelería). Función de cooperación (actos intuito personae). Función de uso y goce (arrendamiento)."),
      createConcept("¿Cómo se clasifican los contratos en el Código Civil?", "Unilateral y bilateral. Gratuito y oneroso. Conmutativo o aleatorio. Principal o accesorio. Real, solemne o consensual."),
      createConcept("¿Qué es un contrato unilateral y bilateral?", "Art. 1439 CC: unilateral cuando una de las partes se obliga para con otra que no contrae obligación alguna; bilateral cuando las partes contratantes se obligan recíprocamente."),
      createConcept("¿Cómo se subclasifica el contrato bilateral?", "Sinalagmático perfecto: todas las obligaciones surgen al perfeccionarse el contrato y son interdependientes entre sí. Sinalagmático imperfecto: nace como unilateral, pero con posterioridad surgen obligaciones para la parte que originalmente no se encontraba obligada."),
      createConcept("¿En qué consisten los contratos plurilaterales?", "Son aquellos que provienen de la manifestación de voluntad de dos o más partes, todas las cuales resultan obligadas en vistas de un objetivo común. Ej.: contrato de sociedad, donde todos los socios se obligan a efectuar un aporte y a soportar las eventuales pérdidas."),
      createConcept("¿Cuáles son las diferencias entre contratos plurilaterales y bilaterales?", "Derechos y obligaciones: en los bilaterales surgen obligaciones correlativas; en los plurilaterales cada parte adquiere derechos y obligaciones respecto a todos los demás. Vicios del consentimiento: en los bilaterales un vicio implica la nulidad del acto; en los plurilaterales solo genera ineficacia del concurso de ese contratante, siendo válido respecto de los demás. Ingreso de nuevas partes: los bilaterales están limitados a quienes concurrieron a la celebración; los plurilaterales admiten ingreso y retiro de partes. Extinción: los bilaterales tienen corta duración; los plurilaterales tienen por objeto perdurar en el tiempo."),
      createConcept("¿Ejemplos de contrato unilateral y bilateral?", "Unilateral: comodato, mutuo, donación, depósito. Bilateral: compraventa, arrendamiento, mandato, permuta."),
      createConcept("¿Cuál es la importancia de distinguir entre contrato unilateral y bilateral?", "Ciertas instituciones solo son aplicables al contrato bilateral: condición resolutoria tácita (Art. 1489), teoría de los riesgos (Art. 1550), excepción de contrato no cumplido (Art. 1552) y revisión del contrato."),
      createConcept("¿Qué es un contrato gratuito y oneroso?", "Art. 1440 CC: gratuito cuando solo tiene por objeto la utilidad de una de las partes, sufriendo la otra el gravamen; oneroso cuando tiene por objeto la utilidad de ambos contratantes, gravándose cada uno a beneficio del otro."),
      createConcept("¿Ejemplos de contrato gratuito y oneroso?", "Gratuito: donación, depósito, mutuo sin interés. Oneroso: compraventa, arrendamiento, permuta, sociedad, mutuo con interés."),
      createConcept("¿Cuál es la importancia de distinguir entre contrato gratuito y oneroso?", "Determinar el grado de culpa del deudor. La obligación de saneamiento de la evicción es propia de los contratos onerosos. Los gratuitos son generalmente intuito personae. Los gratuitos imponen deber de reconocimiento y lealtad. Requisitos de la acción pauliana. Casos en que se respeta el contrato de arrendamiento por terceros. Reivindicación en el cuasicontrato de pago de lo no debido. Restricción de ciertos contratos gratuitos (insinuación en donación). En los gratuitos la pura liberalidad es causa suficiente."),
      createConcept("¿Qué es un contrato conmutativo y aleatorio?", "Art. 1441 CC: oneroso es conmutativo cuando cada una de las partes se obliga a dar o hacer una cosa que se mira como equivalente a lo que la otra parte debe dar o hacer a su vez; y si el equivalente consiste en una contingencia incierta de ganancia o pérdida, se llama aleatorio."),
      createConcept("¿Ejemplos de contrato conmutativo y aleatorio?", "Conmutativo: compraventa, arrendamiento, permuta, mutuo con interés. Aleatorio: renta vitalicia, el juego, la apuesta, el seguro, venta de derechos litigiosos."),
      createConcept("¿Cuál es la importancia de distinguir entre contrato conmutativo y aleatorio?", "En los contratos conmutativos son aplicables dos instituciones: la lesión enorme (en los casos expresamente señalados) y la teoría de la imprevisión."),
      createConcept("¿Qué es un contrato principal y accesorio?", "Art. 1442 CC: principal cuando subsiste por sí mismo sin necesidad de otra convención; accesorio cuando tiene por objeto asegurar el cumplimiento de una obligación principal, de manera que no pueda subsistir sin ella."),
      createConcept("¿Ejemplos de contrato principal y accesorio?", "Principal: promesa, compraventa, arrendamiento, transacción, depósito, mandato, comodato. Accesorios: hipoteca, prenda, fianza, anticresis."),
      createConcept("¿Importancia de distinguir entre contrato principal y accesorio?", "Permite determinar la aplicación del principio 'lo accesorio sigue la suerte de lo principal', es decir, la extinción del contrato accesorio por consecuencia del principal. Dos alcances: a) hay casos en que extinguido el principal subsisten los accesorios (ej. reserva de cauciones al operar una novación); b) excepcionalmente el accesorio puede influir en el principal (ej. inmueble hipotecado que se deteriora: el acreedor puede exigir otra garantía o el pago inmediato de la deuda líquida)."),
      createConcept("¿Qué es un contrato real, solemne y consensual?", "Art. 1443 CC: real cuando para que sea perfecto es necesaria la tradición de la cosa a que se refiere; solemne cuando está sujeto a la observancia de ciertas formalidades especiales, de manera que sin ellas no produce ningún efecto civil; consensual cuando se perfecciona por el solo consentimiento."),
      createConcept("¿Ejemplos de contrato real, solemne y consensual?", "Real: comodato, depósito, mutuo, prenda civil. Solemne: compraventa de bien raíz, matrimonio, promesa. Consensual: compraventa de bien mueble, arrendamiento, mandato, sociedad civil."),
      createConcept("¿Cómo se clasifican los contratos en la doctrina?", "Nominados/típicos o innominados/atípicos. Ejecución instantánea, ejecución diferida, tracto sucesivo o duración indefinida. Individuales o colectivos. Preparatorios o definitivos. Libre discusión o adhesión."),
      createConcept("¿Cuáles son los contratos nominados o innominados?", "Los contratos nominados o típicos son aquellos expresamente reglamentados por el legislador en códigos o leyes especiales. Los innominados o atípicos son los que no lo han sido."),
      createConcept("¿Cuáles son los contratos de ejecución instantánea, diferida, tracto sucesivo o duración indefinida?", "Ejecución instantánea: las obligaciones se cumplen apenas se celebra el contrato; nace y se extingue simultáneamente. Ejecución diferida: todas o algunas obligaciones se cumplen en cierto plazo. Tracto sucesivo: el cumplimiento se escalone en el tiempo durante un lapso prolongado; la relación contractual tiene permanencia. Duración indefinida: nacen sin plazo expreso o tácito de vigencia, con pretensión de prolongarse en el tiempo."),
      createConcept("¿Cuáles son los contratos individuales o colectivos?", "Individuales: requieren el consentimiento unánime de las partes jurídicamente vinculadas. Colectivos: crean obligaciones para personas que no concurrieron a su celebración, que no consintieron o que incluso se opusieron a la conclusión del contrato."),
      createConcept("¿Qué es un contrato preparatorio o definitivo?", "Preparatorio o preliminar: aquel mediante el cual las partes estipulan que en el futuro celebrarán otro contrato que por ahora no pueden concluir o está sujeto a incertidumbre. Definitivo: el que se celebra cumpliendo con la obligación (de hacer) generada por el contrato preparatorio, suscribiendo el futuro contrato dentro de un plazo o al cumplirse una condición."),
      createConcept("¿Qué es un contrato de libre discusión o de adhesión?", "Libre discusión: las partes han deliberado en cuanto a su contenido, examinando atentamente las cláusulas; es resultado de las negociaciones preliminares. Adhesión: las cláusulas son dictadas o redactadas por una sola de las partes; la otra se limita a aceptarlas en bloque, adhiriendo a ellas."),
      createConcept("¿Qué son las categorías contractuales?", "Son ciertas figuras que pueden presentarse en toda clase de contratos, sin importar su clase. Afectan o alteran algunos de los principios generales de la contratación o inciden en ellos."),
      createConcept("¿Cuáles son las categorías contractuales?", "A. Contrato dirigido. B. Contrato forzoso. C. Contrato tipo o condiciones generales de contratación. D. Contrato ley. E. Subcontrato. F. Autocontrato. G. Contrato por persona a nombrar. H. Contrato por cuenta de quién corresponda."),
      createConcept("¿Qué es un contrato dirigido?", "Son aquellos en que la reglamentación legal asume carácter imperativo, sin que las partes puedan alterar lo señalado por el legislador en su contenido, efectos o en relación con la persona con quien se debe contratar. Ejemplos según contenido: contrato de trabajo, matrimonio, arrendamiento de predios urbanos. Según persona: Art. 25 Ley de Sociedades Anónimas y Art. 10 Código de Minería."),
      createConcept("¿Qué es un contrato forzoso?", "Aquel que el legislador obliga a celebrar o a dar por celebrado (Jorge López Santa María). Contrato forzoso ortodoxo: se forma en dos etapas; primero un mandato de la autoridad que exige contratar, luego quien lo recibió celebra el contrato pudiendo elegir contraparte y discutir cláusulas (hay autonomía de la voluntad en la segunda etapa). Contrato forzoso heterodoxo: pérdida completa de la libertad contractual; el vínculo jurídico, las partes y el contenido vienen determinados por el poder público."),
      createConcept("¿Qué es un contrato tipo?", "Acuerdo de voluntades en cuya virtud las partes predisponen o anticipan las cláusulas de futuros contratos que se celebrarán masivamente (Jorge López Santa María). También llamado 'condiciones generales de contratación'. Las partes adoptan un formulario o modelo que será reproducido sin alteraciones importantes en diversos casos posteriores, equivaliendo cada uno a un contrato prerredactado."),
      createConcept("¿Qué es un contrato ley?", "Aquel por el cual el Estado garantiza que en el futuro no modificará ni derogará las franquicias contractuales vigentes. Tiene su origen en una oferta del Estado a los particulares para aprovechar ciertas franquicias o beneficios, con el propósito de fomentar el ahorro, el desarrollo de ciertas actividades productivas o alcanzar metas económicas o sociales. Constituye un estatuto jurídico de excepción."),
      createConcept("¿Qué es el subcontrato?", "Nuevo contrato derivado y dependiente de otro contrato previo de la misma naturaleza (Jorge López Santa María). Ejemplos: subarrendamiento, delegación en el mandato, formación de sociedad particular con un tercero usando la parte social de un socio, subfianza."),
      createConcept("¿Qué es el autocontrato?", "Acto jurídico que una persona celebra consigo misma, sin que sea menester la concurrencia de otra, actuando a la vez como parte directa y representante de la otra parte; o como representante de ambas partes; o como titular de dos patrimonios (o dos fracciones de un mismo patrimonio) sometidos a regímenes jurídicos diferentes (Jorge López Santa María)."),
      createConcept("¿Qué es el contrato por persona a nombrar y por cuenta de quien corresponda?", "Por persona a nombrar: una de las partes se reserva la facultad de designar, mediante declaración posterior, a la persona que adquirirá retroactivamente los derechos y obligaciones radicadas en su patrimonio desde el principio. Por cuenta de quien corresponda: una de las partes inicialmente queda indeterminada o en blanco, en la seguridad que después será especificada."),
      createConcept("¿Cuáles son los principios fundamentales de la contratación?", "1. Autonomía de la voluntad, con sus subprincipios: A. Consensualismo. B. Libertad contractual. C. Fuerza obligatoria de los contratos. D. Efecto relativo de los contratos. 2. Buena fe (independiente de la autonomía de la voluntad, no es propiamente un subprincipios)."),
      createConcept("¿En qué consiste el principio de autonomía de la voluntad?", "La libertad de que gozan los particulares para pactar los contratos que les plazcan, y de determinar su contenido, efectos y duración (Alessandri). Doctrinariamente: es una doctrina de filosofía jurídica según la cual toda obligación reposa esencialmente sobre la voluntad de las partes, siendo ésta a la vez la fuente y la medida de los derechos y obligaciones que el contrato produce (López Santa María)."),
      createConcept("¿En qué consiste el principio de consensualismo?", "Principio encaminado a determinar si los contratos surgen por la sola manifestación de voluntad (pactos desnudos) o requieren formalidades externas (pactos vestidos). Contratos consensuales propiamente tales: corresponden a la concepción moderna de contrato (ej. compraventa de bien mueble). Contratos consensuales formales: siendo consensuales, requieren ciertas formalidades para producir sus efectos (ej. Art. 9 Código del Trabajo o Art. 20 Ley 18.101)."),
      createConcept("¿Cuáles son las excepciones y atenuantes del consensualismo?", "Excepciones: A. Contratos reales. B. Contratos solemnes. Atenuantes: A. Formalidades habilitantes. B. Formalidades de publicidad. C. Formalidades de prueba. D. Formalidades convencionales."),
      createConcept("¿En qué consiste el principio de libertad contractual?", "Comprende la libertad de conclusión (las partes son libres para contratar o no, y para elegir al co-contratante) y la libertad de configuración (las partes pueden debatir y fijar el contenido de los contratos). Constituyen un deterioro a este principio los contratos dirigidos y los contratos forzosos."),
      createConcept("¿En qué consiste la fuerza obligatoria de los contratos?", "Principio expresado en el aforismo 'pacta sunt servanda': los contratos deben cumplirse estrictamente. Art. 1545 CC: todo contrato legalmente celebrado es una ley para los contratantes, y no puede ser invalidado sino por su consentimiento mutuo o por causas legales. Existen múltiples diferencias entre el contrato y la ley en cuanto a su aplicación, formación, permanencia en el tiempo, forma de dejarlas sin efecto e interpretación."),
      createConcept("¿Qué ocurre con la fuerza obligatoria de los contratos frente al legislador?", "La obligatoriedad del contrato se traduce en su intangibilidad: el contrato válidamente celebrado no puede ser modificado ni por el legislador ni por el juez. Sin embargo, esta intangibilidad es relativa, ya que en ciertos casos el legislador vulnera la fuerza obligatoria: leyes de emergencia (leyes moratorias que conceden facilidades de pago), normas permanentes (ej. Arts. 1879, 2180 CC) y leyes especiales que modifican contratos en curso."),
      createConcept("¿Cuándo termina un contrato o se agota su fuerza obligatoria?", "Terminación normal: cuando se cumplen totalmente las obligaciones (pago u otro modo de extinción equivalente), por vencimiento del plazo estipulado, o por desahucio de una de las partes (tiempo indefinido). Terminación anormal o invalidación (Art. 1545): por consentimiento mutuo de las partes (resciliación) o por causas legales (nulidad absoluta o relativa, resolución, revocación, entre otras)."),
      createConcept("¿Es procedente el recurso de casación en el fondo por infracción de ley del contrato?", "Se ha discutido si la 'ley del contrato' queda comprendida en el concepto de infracción de ley que habilita el recurso de casación en el fondo. Se ha señalado que sí es posible, argumentando que la obligatoriedad del contrato para las partes y para el juez es suficiente para concluir que su violación autoriza el recurso, considerándose también el principio de libertad contractual y la historia fidedigna del artículo 767 CPC."),
      createConcept("¿En qué consiste el principio de efecto relativo de los contratos?", "Aquel mediante el cual los contratos solo generan derechos y obligaciones para las partes contratantes que concurren a su celebración, sin beneficiar ni perjudicar a terceros. Si bien no tiene consagración expresa, se puede colegir del artículo 1545 CC, que señala que todo contrato legalmente celebrado es una ley 'para los contratantes'."),
      createConcept("¿Qué sujetos se pueden diferenciar en el principio de efecto relativo?", "Partes: quienes concurren a la celebración del contrato, personalmente o a través de representante legal o convencional. Terceros absolutos: extraños al contrato que no han tenido participación alguna ni están vinculados con las partes. Terceros relativos: quienes con posterioridad a la celebración se encuentran en relación jurídica con alguna de las partes, sea por su propia voluntad o disposición de la ley. Pueden ser causahabientes a título singular (suceden en un bien específicamente determinado) o acreedores de las partes (alcanzados indirectamente por el efecto expansivo del contrato)."),
      createConcept("¿Cuáles son las excepciones al efecto relativo de los contratos?", "Son excepciones al principio de efecto relativo: A. Contratos colectivos. B. Estipulación en favor de otro. C. Promesa de hecho ajeno."),
      createConcept("¿En qué consiste la estipulación a favor de otro?", "Art. 1449 CC: cualquiera puede estipular a favor de una tercera persona, aunque no tenga derecho para representarla; pero solo esta tercera persona podrá demandar lo estipulado; y mientras no intervenga su aceptación expresa o tácita, es revocable el contrato por la sola voluntad de las partes que concurrieron a él. Constituyen aceptación tácita los actos que solo hubieran podido ejecutarse en virtud del contrato. Ejemplo típico: el contrato de seguro."),
      createConcept("¿Cuáles son las teorías sobre la naturaleza jurídica de la estipulación a favor de otro?", "A. Teoría de la oferta. B. Teoría de la gestión de negocios ajenos. C. Teoría de la declaración unilateral de voluntad. D. Teoría de la adquisición directa del derecho."),
      createConcept("¿Quiénes intervienen en la estipulación a favor de otro?", "Estipulante: quien estipula a favor de otro. Promitente: quien contrae la obligación. Tercero beneficiario: quien no ha intervenido y en cuyo favor nace el derecho del referido contrato."),
      createConcept("¿Cuáles son los efectos de la estipulación a favor de otro?", "Entre estipulante y promitente: son las partes del contrato; el estipulante no puede pedir el cumplimiento forzado (corresponde al tercero); pueden revocar el contrato mientras no haya aceptación del beneficiario. Entre promitente y beneficiario: el promitente queda directamente obligado frente al beneficiario; este es acreedor desde la celebración y tiene acción de cumplimiento forzado e indemnización desde la aceptación; no tiene acción resolutoria; si fallece antes de aceptar, transmite la facultad de aceptar. Entre estipulante y beneficiario: son jurídicamente extraños."),
      createConcept("¿En qué consiste la promesa de hecho ajeno?", "Art. 1450 CC: cuando uno de los contratantes se compromete a que por una tercera persona, de quien no es legítimo representante, ha de darse, hacerse o no hacerse alguna cosa, esta tercera persona no contraerá obligación alguna sino en virtud de su ratificación; y si no ratifica, el otro contratante tendrá acción de perjuicios contra el que hizo la promesa. No es propiamente una excepción al efecto relativo, porque la convención no crea derechos ni obligaciones respecto del tercero; el único obligado es el promitente."),
      createConcept("¿Quiénes intervienen en la promesa de hecho ajeno?", "Promitente: quien hizo la promesa y contrae la obligación de hacer que otro acepte. Prometido: es el acreedor. Tercero: la persona que asumirá la obligación una vez ratifique lo obrado por el promitente."),
      createConcept("¿Cuáles son los efectos de la promesa de hecho ajeno?", "El único obligado es el promitente (obligación de hacer). Si el tercero no ratifica, hay lugar a indemnización de perjuicios. Mientras el tercero no acepta, no contrae obligación alguna. Si el tercero acepta y después no cumple, se aplican las reglas de los efectos de las obligaciones entre acreedor y tercero (sin que el acreedor pueda demandar al promitente, salvo que este se hubiera obligado solidaria o subsidiariamente). Si el tercero no acepta, el acreedor solo puede demandar al promitente el cumplimiento forzado por equivalencia."),
      createConcept("¿Qué se entiende por efecto expansivo del contrato?", "Consiste en que un tercero absoluto puede invocar un contrato a su favor o bien la convención celebrada puede ser opuesta al tercero en su detrimento. No se considera una excepción al efecto relativo, ya que no surgen derechos ni obligaciones para el tercero, sino que éste puede invocar el contrato o bien puede oponérsele."),
      createConcept("¿En qué casos se aplica el efecto expansivo del contrato?", "A. En procedimiento concursal, los demás acreedores no pueden desconocer un crédito verificado por otro acreedor. B. Ventas sucesivas, Art. 1817 CC. C. Acción directa contra el co-contratante (Arts. 2138, 1973, 2003 n°5 CC). D. Acción pauliana, Art. 2468 CC. E. Contratos de derecho de familia, que producen efecto erga omnes. F. Materia de responsabilidad extracontractual."),
      createConcept("¿Qué es la inoponibilidad de los contratos?", "Consiste en la ineficacia, respecto de terceros, de un derecho nacido como consecuencia de la celebración o de la nulidad de un acto jurídico."),
      createConcept("¿Cuáles son las diferencias entre inoponibilidad y nulidad?", "Vicios: la nulidad deriva de vicios al momento de la celebración; la inoponibilidad es independiente de la generación del acto. Efectos: la nulidad produce efectos entre las partes y respecto de terceros; la inoponibilidad solo opera respecto de terceros. Renuncia: la nulidad es de orden público y no puede renunciarse anticipadamente; la inoponibilidad es una sanción privada y por tanto renunciable. Declaración de oficio: la nulidad absoluta puede y debe declararse de oficio; la inoponibilidad nunca."),
      createConcept("¿Cuáles son las causales de inoponibilidad?", "Incumplimiento de formalidades de publicidad. Por falta de fecha cierta. Por falta de consentimiento. Nulidad. Quiebra. Fraude. Simulación. Resolución."),
      createConcept("¿En qué consiste la inoponibilidad por omisión de formalidades de publicidad?", "Las formalidades de publicidad tienen por finalidad poner en conocimiento de terceros la existencia de ciertos actos o contratos. Ejemplos: contraescrituras (Art. 1707 inc. 2 CC), prescripción adquisitiva (Art. 2513 CC), cesión de créditos (Art. 1901 CC), enajenación de cosas embargadas (Art. 453 CPC)."),
      createConcept("¿En qué consiste la inoponibilidad por falta de fecha cierta?", "Los instrumentos privados son inoponibles a terceros respecto a su fecha, ya que son susceptibles de antedatarse o posdatarse. Sin embargo, esta regla no es absoluta: existen circunstancias que permiten fijar con claridad la fecha de un instrumento privado, por ejemplo el artículo 1703 CC."),
      createConcept("¿En qué consiste la inoponibilidad por falta de consentimiento?", "Se produce cuando una persona no ha concurrido al negocio que se pretende hacer valer en su contra. Ejemplos: compraventa de cosa ajena (Art. 1815 — inoponible al verdadero dueño, quien puede reivindicarla mientras su acción no se extinga por prescripción adquisitiva), promesa de hecho ajeno, arrendamiento de cosa ajena (Art. 1916 inc. 2), contrato de prenda (Art. 2390)."),
      createConcept("¿En qué consiste la inoponibilidad por nulidad?", "Si bien la nulidad judicialmente declarada da acción reivindicatoria contra terceros poseedores, existen excepciones en que la nulidad es inoponible a terceros: lesión enorme (Art. 1895 CC), contrato de sociedad (Art. 2058 CC), derecho de familia (Art. 51 Ley de Matrimonio Civil)."),
      createConcept("¿En qué consiste la inoponibilidad por fraude?", "El deudor mantiene la libertad de actuar con su patrimonio en el mundo de los negocios jurídicos. El acreedor debe soportar la posible disminución del patrimonio de su deudor, pero no está obligado a tolerar actos que supongan una disminución fraudulenta. El acreedor puede ejercer la acción pauliana (Art. 2468 CC), cuya naturaleza jurídica es de inoponibilidad, para que los contratos celebrados por el deudor en fraude de sus acreedores sean revocados."),
      createConcept("¿En qué consiste la inoponibilidad por simulación?", "En los casos de contratos simulados, las partes no pueden oponer el acto secreto u oculto a terceros. Los terceros pueden optar por el acto ostensible o por el acto secreto. La simulación confiere a los terceros un derecho de opción para invocar según sus intereses el acto aparente o el secreto."),
      createConcept("¿Qué es la simulación de los contratos?", "Declaración de un contenido de voluntad no real, emitida conscientemente y de acuerdo entre las partes para producir, con fines de engaño, la apariencia de un negocio jurídico que no existe o que es distinto de aquel que realmente se ha llevado a cabo (Francisco Ferrara)."),
      createConcept("¿Cómo se clasifica la simulación?", "Lícita e ilícita: lícita (engaño sin ánimo de perjudicar a terceros) e ilícita (realizada en perjuicio de terceros). Absoluta, relativa o por interposición de personas: absoluta (el acto ostensible no oculta realidad alguna), relativa (se celebra un acto real pero disfrazado bajo apariencia distinta), por interposición de persona (se utiliza un intermediario consciente para burlar incapacidades o prohibiciones legales)."),
      createConcept("¿Cuáles son los efectos de la simulación entre las partes?", "Prevalece la voluntad real, es decir, el acto secreto (interpretación a contrario sensu del Art. 1707 CC). En simulación absoluta demostrada: inexistente o nulidad absoluta por falta de consentimiento. En simulación relativa o por interposición de personas: puede tener varios destinos según el caso concreto."),
      createConcept("¿Cuáles son los efectos de la simulación respecto de terceros?", "Prevalece la voluntad declarada (acto aparente), ya que el acto secreto es inoponible según el Art. 1707 CC. Sin perjuicio de ello, los terceros que tengan interés en hacer valer el acto secreto pueden ejercer la acción de simulación. En conclusión, la simulación confiere a los terceros un derecho de opción para invocar el acto aparente o el secreto según sus intereses."),
      createConcept("¿Cómo se prueba la simulación?", "Entre las partes: mediante la exhibición del documento (contraescritura donde consta la verdadera intención); se excluye la prueba de testigos (Arts. 1708 y 1709, salvo Art. 1711 CC); también puede probarse por confesión, absolución de posiciones y presunciones judiciales. Respecto de terceros: por todos los medios de prueba, incluso testigos (aun cuando el monto supere dos UTM, ya que se prueba la simulación y no la obligación propiamente tal); también por presunciones."),
      createConcept("¿Qué es la buena fe?", "En términos generales, evoca la idea de rectitud, corrección, de estar actuando o haber actuado correctamente. Proyectada al Derecho Civil, asume dos direcciones: buena fe subjetiva y buena fe objetiva."),
      createConcept("¿En qué consiste la buena fe subjetiva?", "Consiste en la convicción interna o psicológica de encontrarse el sujeto en una situación jurídica regular. Art. 706 CC (a propósito de la posesión): la buena fe es la conciencia de haberse adquirido el dominio de la cosa por medios legítimos, exentos de fraude y de todo otro vicio. En los títulos traslaticios de dominio supone la persuasión de haberse recibido la cosa de quien tenía la facultad de enajenarla. Se aprecia in concreto por el sentenciador."),
      createConcept("¿Dónde se manifiesta la buena fe subjetiva?", "Posesión de buena fe. Matrimonio putativo (Art. 51 Ley de Matrimonio Civil). Pago de lo no debido (Art. 2300 CC). Pacto de irresponsabilidad de la obligación de saneamiento del vendedor en compraventa (Arts. 1842 y 1859 CC). Renuncia del socio (Art. 2110 CC). Acción pauliana (Art. 2468 CC)."),
      createConcept("¿En qué consiste la buena fe objetiva?", "Art. 1546 CC: los contratos deben ejecutarse de buena fe, y por consiguiente obligan no solo a lo que en ellos se expresa, sino a todas las cosas que emanan precisamente de la naturaleza de la obligación, o que por la ley o la costumbre pertenecen a ella. Impone a los contratantes el deber de comportarse correctamente y lealmente en sus relaciones mutuas, desde los tratos preliminares hasta la terminación del contrato. Se aprecia in abstracto."),
      createConcept("¿Cuáles son las manifestaciones de la buena fe objetiva?", "Aunque el CC solo señala que los contratos deben ejecutarse de buena fe, hay una proyección normativa a todo el iter contractual: tratos preliminares, celebración del contrato, cumplimiento del contrato, terminación del contrato y relaciones post contractuales."),
      createConcept("¿En qué consiste la interpretación de los contratos?", "Interpretar un contrato consiste en determinar el sentido y alcance de las declaraciones o estipulaciones que forman un contrato."),
      createConcept("¿Cuándo se deben interpretar los contratos?", "a) Por ambigüedad en el contrato. b) Obscuridad en el contrato. c) Los términos del contrato son insuficientes. d) Los términos del contrato son excesivos. e) Los términos del contrato son empleados de manera dudosa."),
      createConcept("¿Cuáles son los sistemas de interpretación?", "Sistema subjetivo: busca la voluntad psicológica real de las partes contratantes. Es el sistema vigente en Chile (Art. 1560 CC). Sistema objetivo: escapa de las intenciones de los contratantes, preguntándose qué es lo socialmente más útil o lo que la justicia indica como más saludable; la preeminencia está dada por la voluntad declarada (cómo habría actuado un hombre medio en la circunstancia de la cláusula descrita)."),
      createConcept("¿En qué consisten las reglas de interpretación de los contratos?", "Son los principios y moldes que sirven de base a los razonamientos del intérprete, y que le ayudan en la búsqueda de la intención común de los contratantes (Jorge López Santa María)."),
      createConcept("¿Cuáles son los casos de interpretación legal?", "1. El legislador fija anticipadamente el sentido que debe darse a una cláusula dudosa si las partes la introducen sin explicar su extensión. 2. La ley suple el silencio de las partes sobre un aspecto particular de la convención, dando la solución que corresponde a la voluntad que habrían tenido. 3. La ley interpreta la voluntad de las partes frente a un silencio absoluto (ej. régimen de sociedad conyugal como supletorio en el matrimonio; normas de sucesión intestada)."),
      createConcept("¿Cuál es el principio rector en materia de interpretación?", "Art. 1560 CC: conocida claramente la intención de los contratantes, debe estarse a ella más que a lo literal de las palabras."),
      createConcept("¿Cuáles son las reglas de interpretación relativas a los elementos intrínsecos del contrato?", "Se interpreta el texto del contrato por sí mismo sin recurrir a elementos extraños. a. Regla de la armonía o elemento sistemático (Art. 1564 CC). b. Regla de la utilidad de las cláusulas (Art. 1562 CC). c. Regla del sentido natural (Art. 1563 inc. 1 CC)."),
      createConcept("¿En qué consiste la regla de la armonía de las cláusulas?", "Art. 1564 inc. 1 CC: las cláusulas de un contrato se interpretarán unas por otras, dándole a cada una el sentido que mejor convenga al contrato en su totalidad. El intérprete debe analizar la totalidad del contrato como un todo orgánico y coherente, ya que lo normal es que las cláusulas estén subordinadas unas a otras."),
      createConcept("¿En qué consiste la regla de la utilidad de las cláusulas?", "Art. 1562 CC: el sentido en que una cláusula puede producir algún efecto deberá preferirse a aquel en que no sea capaz de producir efecto alguno. Si una cláusula puede interpretarse de dos formas — una sin efecto y otra con efecto —, debe preferirse la segunda. La idea central es suponer que las partes no han deseado introducir cláusulas inútiles o sin sentido."),
      createConcept("¿En qué consiste la regla del sentido natural del contrato?", "Art. 1563 inc. 1 CC: en aquellos casos en que no apareciere voluntad contraria, deberá estarse a la interpretación que mejor cuadre con la naturaleza del contrato. Según Pothier: cuando en un contrato los términos son susceptibles de dos sentidos, debe entendérselos en el sentido más conveniente a la naturaleza del contrato."),
      createConcept("¿Cuáles son las reglas de interpretación relativas a los elementos extrínsecos del contrato?", "Se refiere a circunstancias que configuran el contorno del contrato: a. Regla de aplicación restringida del texto contractual (Art. 1561). b. Regla de la natural extensión del contrato y de la declaración (Art. 1565). c. Regla de los otros contratos de las partes sobre igual materia (Art. 1564 inc. 2). d. Regla de la ejecución práctica o interpretación auténtica (Art. 1564 inc. 3)."),
      createConcept("¿En qué consiste la regla de aplicación restringida del texto contractual?", "Art. 1561 CC: por generales que sean los términos de un contrato, solo se aplicarán a la materia sobre que se ha contratado. El intérprete no puede exceder del marco objetivo de la convención. Ej.: Art. 2462 CC en la transacción: la renuncia general de todo derecho solo se entiende respecto del objeto u objetos sobre que se transige."),
      createConcept("¿En qué consiste la regla de la natural extensión del contrato y de la declaración?", "Art. 1565 CC: cuando en un contrato se ha expresado un caso para explicar la obligación, no se entenderá por solo eso haberse querido restringir la convención a ese caso, excluyendo los otros a que naturalmente se extienda. Los ejemplos puestos en un contrato no implican que se aplique solo al caso puesto como ejemplo. La aparente contradicción con la regla anterior es solo aparente; son manifestaciones distintas del mismo principio general."),
      createConcept("¿En qué consiste la regla de los otros contratos de las partes sobre igual materia?", "Art. 1564 inc. 2 CC: las cláusulas de un contrato podrán también interpretarse por las de otro contrato entre las mismas partes y sobre la misma materia. Esta regla permite al juez buscar la intención de las partes en otra convención, otorgada con anterioridad o posterioridad al contrato objeto de la interpretación."),
      createConcept("¿En qué consiste la regla de la interpretación auténtica?", "Art. 1564 inc. 3 CC: podrán también interpretarse por la aplicación práctica que hayan hecho de ellas ambas partes, o una de las partes con aprobación de la otra. Es considerada por muchos autores como la más importante de las reglas de interpretación, porque es en la aplicación del contrato donde queda mejor clarificada la intención que tuvieron las partes."),
      createConcept("¿Cuáles son las reglas subsidiarias de interpretación contractual?", "a. Regla de las cláusulas usuales (Arts. 1564 y 1563 inc. 2). b. Regla de la última alternativa (Art. 1566 inc. 1)."),
      createConcept("¿En qué consiste la regla de las cláusulas usuales?", "Art. 1563 inc. 2 CC: las cláusulas de uso común se presumen aunque no se expresen. Consecuencia de la referencia del Art. 1546 CC a la costumbre. Su objeto es incorporar al contrato las cláusulas usuales silenciadas en la declaración. Tiene poca aplicación práctica porque la costumbre en materia civil solo tiene valor según ley."),
      createConcept("¿En qué consiste la regla de la última alternativa?", "Art. 1566 inc. 1 CC: no pudiendo aplicarse ninguna de las reglas precedentes de interpretación, se interpretarán las cláusulas ambiguas a favor del deudor. Se utiliza como último recurso. La jurisprudencia ha aplicado este precepto especialmente respecto de los contratos de adhesión."),
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────

function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function isDue(concept) {
  return new Date(concept.nextReview) <= new Date();
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQueue(modules, currentModuleIdx, injectionCount, limit = null, allModules = false, activeModules = null, materiaMode = "module") {
  const CIVIL = ["Acto Jurídico","Teoría de las Obligaciones","Contratos General","Teoría de los Bienes","Contratos Parte Especial","Personas","Familia","Sucesorio","Daños"];
  const PROCESAL = ["Procesal Orgánico","Proceso y Procedimiento","Ordinario y Sumario","Ejecutivo y Juicios Especiales","Recursos Civiles","Procesal Penal","Recursos Penales"];

  // Modos pool: mezcla sin jerarquía ni inyección
  if (allModules || materiaMode === "all" || materiaMode === "civil" || materiaMode === "procesal") {
    let pool;
    if (materiaMode === "civil") {
      pool = modules.filter(m => CIVIL.includes(m.name) && (!activeModules || activeModules.has(m.id))).flatMap(m => m.concepts);
    } else if (materiaMode === "procesal") {
      pool = modules.filter(m => PROCESAL.includes(m.name) && (!activeModules || activeModules.has(m.id))).flatMap(m => m.concepts);
    } else {
      pool = modules.filter(m => !activeModules || activeModules.has(m.id)).flatMap(m => m.concepts);
    }
    const q = limit ? shuffle(pool).slice(0, limit) : shuffle(pool);
    return { queue: q, forced: false, injectedCount: 0 };
  }

  // Modo módulo individual con inyección
  const currentModule = modules[currentModuleIdx];
  const otherModules = modules.filter((_, i) => {
    if (i === currentModuleIdx) return false;
    if (activeModules && activeModules.size > 0) return activeModules.has(modules[i].id);
    return true;
  });

  const currentAll = currentModule?.concepts || [];
  const otherAll = otherModules.flatMap(m => m.concepts);

  if (currentAll.length === 0 && otherAll.length === 0) return { queue: [], forced: false };

  const currentPool = limit ? shuffle(currentAll).slice(0, limit) : shuffle(currentAll);

  const injectCount = injectionCount === 0 ? 0 : Math.min(injectionCount, otherAll.length);

  const injected = shuffle(otherAll).slice(0, Math.min(injectCount, otherAll.length));
  const queue = shuffle([...currentPool, ...injected]);

  return { queue, forced: false, injectedCount: injected.length };
}

const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=Fraunces:ital,wght@0,300;0,600;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #F0FAFA; --surface: #FFFFFF; --border: #CCEDE9;
    --text: #1A2E2C; --text-muted: #6B8E8A;
    --accent: #0D9488; --accent-light: #0F766E;
    --auto: #059669; --resist: #D97706; --blank: #DC2626;
    --tag-bg: #E6F7F5;
  }
  .dark-mode {
    --bg: #1C1A2E; --surface: #252338; --border: #3A3750;
    --text: #F0EDE6; --text-muted: #9B98B8;
    --accent: #E05C5C; --accent-light: #F07070;
    --auto: #4CAF7D; --resist: #F0B840; --blank: #E05C5C;
    --tag-bg: #2E2B45;
  }

  html, body, #root { margin: 0; padding: 0; width: 100%; height: 100%; }
  body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 999px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--accent); }
  .app { display: flex; height: 100vh; overflow: hidden; }

  /* SIDEBAR */
  .sidebar { width: 280px; min-width: 280px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; overflow: hidden; }
  .sidebar-header { padding: 16px 18px 12px; border-bottom: 1px solid var(--border); display: flex; flex-direction: column; gap: 10px; }
  .sidebar-header-top { display: flex; align-items: center; justify-content: space-between; }
  .sidebar-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); }
  .sidebar-scroll { flex: 1; overflow-y: auto; padding: 10px 0; }
  .sidebar-scroll::-webkit-scrollbar { width: 3px; }
  .sidebar-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .module-item { border-bottom: 1px solid var(--border); }
  .module-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 18px; cursor: pointer; transition: background 0.15s; border-radius: 8px; }
  .module-header:hover { background: var(--bg); }
  .module-name { font-size: 13px; font-weight: 700; letter-spacing: 0.01em; }
  .module-meta { font-size: 11px; color: var(--text-muted); margin-top: 1px; font-weight: 500; }
  .module-chevron { font-size: 9px; color: var(--accent); transition: transform 0.2s; }
  .module-chevron.open { transform: rotate(90deg); }
  .concept-list { padding: 0 10px 8px; }
  .concept-item { background: var(--bg); border: 1px solid var(--border); border-radius: 4px; padding: 8px 10px; margin-bottom: 5px; }
  .concept-q { font-size: 10px; color: var(--text); margin-bottom: 4px; line-height: 1.4; }
  .concept-a { font-size: 10px; color: var(--text-muted); line-height: 1.4; }
  .concept-due { font-size: 9px; color: var(--accent); margin-top: 4px; }

  .add-form { padding: 8px 10px; }
  .input-field {
    width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: 4px;
    padding: 8px 10px; font-family: 'DM Mono', monospace; font-size: 11px; color: var(--text);
    outline: none; margin-bottom: 8px; transition: border-color 0.15s;
  }
  .input-field:focus { border-color: var(--accent); }
  .input-field::placeholder { color: var(--text-muted); }
  textarea.input-field { resize: vertical; min-height: 48px; }

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.55);
    backdrop-filter: blur(4px); display: flex; align-items: center;
    justify-content: center; z-index: 100; padding: 20px;
    animation: overlayIn 0.2s ease;
  }
  @keyframes overlayIn { from { opacity:0; } to { opacity:1; } }
  .modal-content {
    background: var(--surface); border: 1px solid var(--border);
    padding: 32px 36px; border-radius: 10px; width: 640px; max-width: 100%;
    box-shadow: 0 24px 64px rgba(0,0,0,0.18);
    animation: modalIn 0.22s ease;
  }
  .dark-mode .modal-content { box-shadow: 0 24px 64px rgba(0,0,0,0.6); }
  @keyframes modalIn { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
  .modal-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 300; margin-bottom: 6px; }
  .modal-desc { font-size: 11px; color: var(--text-muted); margin-bottom: 14px; line-height: 1.65; }
  .modal-desc b { color: var(--text); font-weight: 500; }
  .format-hint {
    background: var(--bg); border: 1px solid var(--border); border-radius: 4px;
    padding: 12px 14px; margin-bottom: 16px; font-size: 10px; color: var(--text-muted); line-height: 1.8;
  }
  .format-hint strong { color: var(--text); font-weight: 500; display: block; margin-bottom: 4px; }
  .format-hint code {
    font-family: 'DM Mono', monospace; background: var(--tag-bg);
    padding: 1px 5px; border-radius: 2px; color: var(--accent);
  }
  .import-feedback {
    margin-top: 10px; padding: 9px 13px; border-radius: 4px;
    font-size: 10px; border: 1px solid; line-height: 1.5;
    animation: fadeIn 0.2s ease;
  }
  .import-feedback.success { color: var(--auto); border-color: var(--auto); background: rgba(45,74,62,0.07); }
  .import-feedback.error { color: #C0392B; border-color: #C0392B; background: rgba(192,57,43,0.07); }
  .dark-mode .import-feedback.success { background: rgba(39,174,96,0.1); }
  .dark-mode .import-feedback.error { background: rgba(231,76,60,0.1); }

  /* Buttons */
  .btn { font-family: 'Inter', sans-serif; cursor: pointer; border: none; border-radius: 999px; font-size: 10px; letter-spacing: 0.04em; transition: all 0.15s; display: inline-flex; align-items: center; gap: 5px; }
  .btn-primary { background: var(--accent); color: #fff; padding: 10px 18px; font-weight: 700; }
  .btn-primary:hover { background: var(--accent-light); }
  .btn-ghost { background: transparent; color: var(--text-muted); padding: 6px 14px; border: 1.5px solid var(--border); border-radius: 999px; }
  .btn-ghost:hover { background: var(--bg); color: var(--text); border-color: var(--text-muted); }
  .btn-sm { padding: 4px 10px; font-size: 9px; }
  .btn-danger { background: transparent; color: #DC2626; border: 1.5px solid #DC2626; border-radius: 999px; }
  .btn-danger:hover { background: #DC2626; color: #fff; }
  .btn-full { width: 100%; justify-content: center; }
  .btn-dashed { border-style: dashed !important; }

  .sidebar-footer { padding: 12px 18px; border-top: 1px solid var(--border); }

  /* MAIN */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .topbar { padding: 14px 28px; border-bottom: 1px solid var(--border); background: var(--surface); display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .topbar-left { display: flex; align-items: center; gap: 8px; }
  .topbar-logo { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; }
  .topbar-logo span { color: var(--accent); }
  .topbar-right { display: flex; align-items: center; gap: 10px; }

  .toggle-wrap { display: flex; align-items: center; gap: 7px; }
  .toggle-label { font-size: 10px; color: var(--text-muted); letter-spacing: 0.04em; text-transform: uppercase; }
  .toggle { position: relative; width: 36px; height: 20px; cursor: pointer; }
  .toggle input { opacity: 0; width: 0; height: 0; }
  .toggle-track { position: absolute; inset: 0; background: var(--border); border-radius: 10px; transition: background 0.2s; }
  .toggle input:checked ~ .toggle-track { background: var(--accent); }
  .toggle-thumb { position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; background: white; border-radius: 50%; transition: transform 0.2s; }
  .toggle input:checked ~ .toggle-thumb { transform: translateX(16px); }

  .select-wrap { display: flex; align-items: center; gap: 6px; }
  .select-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; }
  .select-field { background: var(--bg); border: 1px solid var(--border); border-radius: 3px; padding: 5px 8px; font-family: 'DM Mono', monospace; font-size: 10px; color: var(--text); outline: none; cursor: pointer; }
  .select-field:focus { border-color: var(--accent); }
  .dark-mode .select-field { background: var(--surface); color: var(--text); }
  .dark-mode .select-field option { background: #252338; color: #F0EDE6; }
  .dark-mode .input-field { background: var(--surface); color: var(--text); border-color: var(--border); }
  .dark-mode .concept-q { color: var(--text); }
  .dark-mode .concept-a { color: var(--text-muted); }
  .dark-mode .stat-num { color: var(--accent); }
  .dark-mode .card-answer { color: var(--text-muted); }
  .dark-mode .progress-info { color: var(--text-muted); }
  .dark-mode .module-name { color: var(--text); }
  .dark-mode .module-meta { color: var(--text-muted); }
  .dark-mode .sidebar-title { color: var(--text-muted); }

  .study-area { flex: 1; display: flex; align-items: flex-start; justify-content: center; overflow-y: auto; padding: 28px; }
  .study-center { width: 100%; max-width: 560px; }

  /* Selector de módulo prominente */
  .module-selector-block {
    background: var(--surface); border: 1.5px solid var(--border); border-radius: 20px;
    padding: 18px 22px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 6px;
    box-shadow: 0 2px 12px rgba(13,148,136,0.08);
  }
  .module-selector-label {
    font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); font-weight: 700;
  }
  .module-selector-select {
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; font-weight: 700;
    color: var(--text); background: var(--bg); border: 1.5px solid var(--border); border-radius: 12px; outline: none;
    width: 100%; cursor: pointer; padding: 8px 36px 8px 12px; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%230D9488' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 10px center;
    transition: border-color 0.15s;
  }
  .module-selector-select:hover { border-color: var(--accent); }
  .module-selector-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(13,148,136,0.12); }

  .progress-bar-wrap { margin-bottom: 20px; }
  .progress-info { display: flex; justify-content: space-between; font-size: 10px; color: var(--text-muted); margin-bottom: 6px; font-weight: 600; }
  .progress-track { height: 4px; background: var(--border); border-radius: 999px; overflow: hidden; }
  .progress-fill { height: 100%; background: var(--accent); border-radius: 999px; transition: width 0.4s ease; }

  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 32px 36px; margin-bottom: 16px; box-shadow: 0 2px 12px rgba(13,148,136,0.08); }
  .card-tag { font-size: 9px; color: var(--accent); background: var(--tag-bg); padding: 4px 12px; border-radius: 999px; display: inline-block; margin-bottom: 14px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; }
  .card-question { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 22px; font-weight: 700; line-height: 1.45; }
  .dark-mode .card-question { font-style: italic; }
  .card-divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }
  .card-answer { font-family: 'Inter', sans-serif; font-size: 13px; line-height: 1.75; color: var(--text-muted); }
  .answer-fade { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity:0; transform: translateY(4px); } to { opacity:1; transform:translateY(0); } }

  .rating-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 14px; }
  .btn-rating { font-family: 'Inter', sans-serif; cursor: pointer; border-radius: 999px; padding: 12px 8px; font-size: 10px; font-weight: 700; letter-spacing: 0.02em; transition: all 0.15s; display: flex; flex-direction: column; align-items: center; gap: 3px; border: 2px solid; }
  .btn-rating .rating-days { font-size: 9px; opacity: 0.7; font-weight: 400; }
  .btn-auto { background: transparent; color: var(--auto); border-color: var(--auto); }
  .btn-auto:hover { background: var(--auto); color: #fff; }
  .btn-resist { background: transparent; color: var(--resist); border-color: var(--resist); }
  .btn-resist:hover { background: var(--resist); color: #fff; }
  .btn-blank { background: transparent; color: var(--blank); border-color: var(--blank); }
  .btn-blank:hover { background: var(--blank); color: #fff; }

  .state-box { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 48px 36px; text-align: center; box-shadow: 0 2px 12px rgba(13,148,136,0.08); }
  .state-icon { font-size: 32px; margin-bottom: 14px; }
  .state-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 8px; }
  .state-sub { font-size: 11px; color: var(--text-muted); line-height: 1.6; }

  .stats-row { display: flex; gap: 8px; }
  .stat-pill { flex: 1; border: 1.5px solid; border-radius: 16px; padding: 12px 12px; text-align: center; }
  .stat-pill-revisados { background: rgba(13,148,136,0.08); border-color: rgba(13,148,136,0.2); }
  .stat-pill-perfecta { background: rgba(5,150,105,0.08); border-color: rgba(5,150,105,0.2); }
  .stat-pill-incompleta { background: rgba(217,119,6,0.08); border-color: rgba(217,119,6,0.2); }
  .stat-pill-blank { background: rgba(220,38,38,0.08); border-color: rgba(220,38,38,0.2); }
  .stat-num { font-size: 20px; font-weight: 800; color: var(--accent); font-family: 'Plus Jakarta Sans', sans-serif; }
  .stat-lbl { font-size: 9px; color: var(--text-muted); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }

  .select-field:disabled { opacity: 0.45; cursor: not-allowed; }
  .toggle input:disabled ~ .toggle-track { opacity: 0.45; cursor: not-allowed; }
  .btn-end-early { background: transparent; color: var(--blank); border: 1px solid var(--blank); font-family: 'DM Mono', monospace; cursor: pointer; border-radius: 3px; font-size: 10px; letter-spacing: 0.04em; padding: 5px 10px; transition: all 0.15s; }
  .btn-end-early:hover { background: var(--blank); color: #fff; }

  .interrogator-badge { font-size: 9px; background: var(--accent); color: #fff; padding: 3px 8px; border-radius: 2px; letter-spacing: 0.08em; text-transform: uppercase; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{ opacity:1; } 50%{ opacity:0.6; } }

  /* ── RESPONSIVE MOBILE ── */
  .hamburger { display: none; background: transparent; border: 1px solid var(--border); border-radius: 3px; color: var(--text-muted); cursor: pointer; padding: 5px 8px; font-size: 14px; line-height: 1; }
  .sidebar-overlay { display: none; }

  @media (max-width: 700px) {
    .hamburger { display: flex; align-items: center; justify-content: center; }
    .sidebar {
      position: fixed; top: 0; left: 0; height: 100vh; z-index: 200;
      transform: translateX(-100%); transition: transform 0.25s ease;
      box-shadow: 4px 0 20px rgba(0,0,0,0.15);
    }
    .sidebar.open { transform: translateX(0); }
    .sidebar-overlay {
      display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.45);
      z-index: 199; backdrop-filter: blur(2px);
    }

    /* Topbar: apila left y right en dos filas limpias */
    .topbar { padding: 10px 14px; gap: 6px; flex-wrap: wrap; align-items: center; }
    .topbar-left { flex-wrap: wrap; gap: 5px; align-items: center; }
    .linkedin-btn { display: none; }
    .topbar-right { flex: 1; min-width: 0; gap: 6px; flex-wrap: wrap; justify-content: flex-end; align-items: center; }

    /* Selectores: ocultar label, ancho flexible para no truncar */
    .select-label { display: none; }
    .select-wrap { min-width: 0; }
    .select-field { font-size: 10px; padding: 5px 6px; max-width: none; width: auto; min-width: 0; max-width: 160px; }

    /* Área de estudio */
    .study-area { padding: 14px; align-items: flex-start; }
    .study-center { max-width: 100%; }
    .card { padding: 20px 18px; }
    .card-question { font-size: 17px; }
    .btn-terminar-mobile { font-size: 9px !important; padding: 3px 8px !important; }

    /* Stats */
    .stats-row { gap: 5px; }
    .stat-pill { padding: 8px 6px; }
    .stat-num { font-size: 15px; }
    .stat-lbl { font-size: 8px; }

    /* Rating: una columna en pantallas muy pequeñas, tres en el resto */
    .rating-row { gap: 6px; }
    .btn-rating { padding: 10px 6px; font-size: 10px; }

    .modal-content { padding: 20px 18px; }
  }

  /* Pantallas muy pequeñas (iPhone SE, < 400px): rating en columna única */
  @media (max-width: 399px) {
    .rating-row { grid-template-columns: 1fr; }
    .btn-rating { flex-direction: row; justify-content: space-between; padding: 12px 14px; }
    .select-field { max-width: 130px; }
  }
`;

const LS_KEY = "repaso_progress"; // personal progress stays in localStorage
const SHARED_KEY = "repaso_modules_shared";
const EDITOR_PIN = "1212";
const ACTIVE_MODULES_KEY = "repaso_active_modules";

function loadActiveModules() {
  try {
    const raw = localStorage.getItem(ACTIVE_MODULES_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return null; // null = no preference saved yet → use default (all active)
}

function saveActiveModules(activeSet) {
  try {
    localStorage.setItem(ACTIVE_MODULES_KEY, JSON.stringify([...activeSet]));
  } catch {}
}

async function loadModulesShared() {
  try {
    const result = await window.storage.get(SHARED_KEY, true);
    if (result?.value) return JSON.parse(result.value);
  } catch {}
  return null;
}

async function saveModulesShared(modules) {
  try { await window.storage.set(SHARED_KEY, JSON.stringify(modules), true); } catch {}
}

function loadLastSessions() {
  try { const r = localStorage.getItem("spare_last_sessions"); return r ? JSON.parse(r) : {}; } catch { return {}; }
}
function saveLastSession(moduleId) {
  try {
    const s = loadLastSessions();
    s[moduleId] = Date.now();
    localStorage.setItem("spare_last_sessions", JSON.stringify(s));
  } catch {}
}
function daysAgo(timestamp) {
  return Math.floor((Date.now() - timestamp) / 86400000);
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveProgress(modules) {
  // Only save nextReview, interval, repetitions per concept id
  try {
    const progress = {};
    modules.forEach(m => m.concepts.forEach(c => {
      progress[c.id] = { nextReview: c.nextReview, interval: c.interval, repetitions: c.repetitions };
    }));
    localStorage.setItem(LS_KEY, JSON.stringify(progress));
  } catch {}
}

function mergeProgress(modules, progress) {
  return modules.map(m => ({
    ...m,
    concepts: m.concepts.map(c => progress[c.id] ? { ...c, ...progress[c.id] } : c)
  }));
}

function WipBadge() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <span
        onClick={() => setOpen(v => !v)}
        style={{ fontSize: 10, background: "#B8860B", color: "#fff", padding: "2px 6px", borderRadius: 3, fontFamily: "monospace", cursor: "pointer", userSelect: "none" }}
      >WIP</span>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 998 }} />
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 999,
            background: "#1A1814", color: "#F0EDE6", borderRadius: 6, padding: "10px 14px",
            fontSize: 11, lineHeight: 1.6, width: 220, boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            fontFamily: "'DM Mono', monospace"
          }}>
            <div style={{ fontWeight: 500, marginBottom: 4, color: "#B8860B" }}>⚠ En desarrollo</div>
            Este producto se presenta <em>as-is</em>, sin garantías de ningún tipo. El contenido es de carácter académico y puede contener errores. Úsalo bajo tu propio criterio.
            <div style={{ marginTop: 8, borderTop: "1px solid #333", paddingTop: 6, fontSize: 10, color: "#7A7468" }}>Click fuera para cerrar</div>
          </div>
        </>
      )}
    </div>
  );
}

function AutorBadge() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <span
        onClick={() => setOpen(v => !v)}
        style={{ fontSize: 9, background: "var(--accent)", color: "#fff", padding: "4px 12px", borderRadius: 999, fontFamily: "'Inter', sans-serif", fontWeight: 700, cursor: "pointer", userSelect: "none", whiteSpace: "nowrap", letterSpacing: "0.06em" }}
      >💡 Sobre mí</span>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 998 }} />
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 999,
            background: "#1A1814", color: "#F0EDE6", borderRadius: 6, padding: "14px 16px",
            fontSize: 11, lineHeight: 1.7, width: 280, boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            fontFamily: "'DM Mono', monospace"
          }}>
            <div style={{ fontWeight: 500, marginBottom: 8, color: "#4CAF7D" }}>Para la comunidad jurídica ⚖️</div>
            <div style={{ marginBottom: 10 }}>Creado por <strong>Alejandro Véliz Isla</strong> para estudiantes de derecho, gradistas y abogados que buscan mantener fresco su conocimiento.</div>
            <div style={{ marginBottom: 10 }}>Esta herramienta es de uso <strong>100% libre y gratuito</strong>. Si alguien te cobró por acceder a ella, exige tu dinero de vuelta de inmediato.</div>
            <div style={{ marginBottom: 8 }}>No soy un experto en programación, así que levanté este proyecto apoyándome en inteligencia artificial <em>(Powered by Claude AI)</em>. Está hecha con harto cariño y está pensada con la gran misión de hacer más amenas las sesiones de estudio. ¡Espero que sea provechosa para ti!</div>
            <div style={{ borderTop: "1px solid #333", paddingTop: 6, fontSize: 10, color: "#7A7468" }}>Click fuera para cerrar</div>
          </div>
        </>
      )}
    </div>
  );
}

function Onboarding({ modules, onComplete }) {
  const [step, setStep] = useState(1); // 1: perfil, 2: gradista-pregunta, 3: selección módulos
  const [perfil, setPerfil] = useState(null);
  const [selectedMods, setSelectedMods] = useState(new Set());

  const ONBOARDING_STYLE = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
    .ob-wrap { position: fixed; inset: 0; background: #0F0A2E; display: flex; align-items: center; justify-content: center; font-family: 'Plus Jakarta Sans', sans-serif; overflow-y: auto; z-index: 1000; }
    .ob-inner { width: 100%; max-width: 420px; padding: 48px 32px; text-align: center; }
    .ob-badge { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #7C6FCD; background: rgba(124,111,205,0.15); padding: 6px 16px; border-radius: 999px; display: inline-block; margin-bottom: 24px; }
    .ob-title { font-size: 26px; font-weight: 800; color: #FFFFFF; line-height: 1.2; margin: 0 0 8px; }
    .ob-sub { font-size: 14px; color: #7C6FCD; margin: 0 0 36px; }
    .ob-options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
    .ob-option { background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 999px; padding: 16px 24px; color: #FFFFFF; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; text-align: left; display: flex; align-items: center; gap: 14px; }
    .ob-option:hover { background: rgba(255,255,255,0.08); }
    .ob-option.selected { background: rgba(79,70,229,0.3); border-color: #4F46E5; }
    .ob-option-icon { width: 36px; height: 36px; border-radius: 50%; background: rgba(99,85,210,0.3); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
    .ob-option-sub { font-size: 12px; color: #7C6FCD; font-weight: 400; margin-top: 2px; }
    .ob-btn { width: 100%; background: linear-gradient(135deg, #4F46E5, #7C3AED); border: none; border-radius: 999px; padding: 18px; color: #FFFFFF; font-size: 16px; font-weight: 800; cursor: pointer; font-family: inherit; transition: all 0.2s; }
    .ob-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .ob-btn-ghost { background: none; border: none; color: #7C6FCD; font-size: 13px; cursor: pointer; font-family: inherit; margin-top: 16px; display: block; width: 100%; }
    .ob-chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-bottom: 36px; }
    .ob-chip { background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 999px; padding: 12px 20px; color: #FFFFFF; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
    .ob-chip:hover { background: rgba(255,255,255,0.08); }
    .ob-chip.selected { background: rgba(79,70,229,0.3); border-color: #4F46E5; }
    .ob-simple-options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
    .ob-simple-btn { background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 999px; padding: 18px 28px; color: #FFFFFF; font-size: 15px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
    .ob-option.ob-option-gold { background: rgba(184,134,11,0.15); border-color: #B8860B; }
    .ob-option.ob-option-gold:hover { background: rgba(212,160,23,0.25); border-color: #D4A017; }
    .ob-simple-btn:hover { background: rgba(255,255,255,0.08); }
  `;

  function handlePerfilSelect(p) {
    setPerfil(p);
    if (p === "grado") setStep(2);
    else setStep("placeholder");
  }

  function handleTodosLosMods() {
    const allIds = new Set(modules.filter(m => m.concepts.length > 0).map(m => m.id));
    onComplete(allIds, true);
  }

  function handleElegirMods() {
    setStep(3);
  }

  function toggleMod(id) {
    setSelectedMods(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleComenzar() {
    if (selectedMods.size === 0) return;
    onComplete(selectedMods, false);
  }

  const availableMods = modules.filter(m => m.concepts.length > 0);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ONBOARDING_STYLE }} />
      <div className="ob-wrap">
        <div className="ob-inner">

          {/* ── STEP 1: Perfil ── */}
          {step === 1 && (
            <>
              <span className="ob-badge">SPARE</span>
              <div style={{ fontSize: 10, color: "#E05C5C", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>⚠ En desarrollo</div>
              <h1 className="ob-title">¿Cuál es tu<br/>situación actual?</h1>
              <p className="ob-sub">Personalicemos tu experiencia</p>
              <div className="ob-options">
                <button className="ob-option ob-option-gold" onClick={() => handlePerfilSelect("grado")}>
                  <span className="ob-option-icon" style={{ background: "rgba(184,134,11,0.3)" }}>🎯</span>
                  <div>
                    <div>Preparando el grado</div>
                    <div className="ob-option-sub" style={{ color: "#D4A017" }}>Examen de grado en el horizonte</div>
                  </div>
                </button>
                <button className="ob-option" onClick={() => handlePerfilSelect("pregrado")}>
                  <span className="ob-option-icon">📚</span>
                  <div>
                    <div>Estudiante de pregrado</div>
                    <div className="ob-option-sub">Cursando la carrera</div>
                  </div>
                </button>
                <button className="ob-option" onClick={() => handlePerfilSelect("abogado")}>
                  <span className="ob-option-icon">⚖️</span>
                  <div>
                    <div>Abogado</div>
                    <div className="ob-option-sub">Refrescando conocimientos</div>
                  </div>
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2: Gradista — ¿ya estudiaste todo? ── */}
          {step === 2 && (
            <>
              <span className="ob-badge">2 de 3</span>
              <h1 className="ob-title">¿Ya estudiaste<br/>todos los ramos?</h1>
              <p className="ob-sub">Activaremos los módulos que necesitas</p>
              <div className="ob-simple-options">
                <button className="ob-simple-btn" onClick={handleTodosLosMods}>Sí, los estudié todos</button>
                <button className="ob-simple-btn" onClick={handleElegirMods}>No, quiero elegir ramos</button>
              </div>
              <button className="ob-btn-ghost" onClick={() => setStep(1)}>← Volver</button>
            </>
          )}

          {/* ── STEP 3: Selección de módulos ── */}
          {step === 3 && (
            <>
              <span className="ob-badge">3 de 3</span>
              <h1 className="ob-title">¿Qué ramos<br/>quieres practicar?</h1>
              <p className="ob-sub">Selecciona al menos uno. Puedes cambiar esto después.</p>
              <div className="ob-chips">
                {availableMods.map(m => (
                  <button
                    key={m.id}
                    className={`ob-chip${selectedMods.has(m.id) ? " selected" : ""}`}
                    onClick={() => toggleMod(m.id)}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
              <button className="ob-btn" disabled={selectedMods.size === 0} onClick={handleComenzar}>
                Comenzar →
              </button>
              <button className="ob-btn-ghost" onClick={() => setStep(2)}>← Volver</button>
            </>
          )}

          {/* ── PLACEHOLDER: Pregrado y Abogado ── */}
          {step === "placeholder" && (
            <>
              <span className="ob-badge">SPARE</span>
              <h1 className="ob-title">{perfil === "abogado" ? "Todo listo." : "¡Bienvenido!"}</h1>
              <p className="ob-sub">
                {perfil === "abogado"
                  ? "Hemos preseleccionado todos los módulos disponibles. Puedes ajustar tu selección en cualquier momento desde la barra lateral."
                  : "Este flujo estará personalizado muy pronto. Por ahora dejamos todos los módulos activos."}
              </p>
              <button className="ob-btn" onClick={handleTodosLosMods}>Entrar a SPARE →</button>
              <button className="ob-btn-ghost" onClick={() => setStep(1)}>← Volver</button>
            </>
          )}

        </div>
      </div>
    </>
  );
}

export default function App() {
  const [modules, setModules] = useState(SEED_DATA);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [interrogatorMode, setInterrogatorMode] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  const [addingConcept, setAddingConcept] = useState(null);
  const [newConceptQ, setNewConceptQ] = useState("");
  const [newConceptA, setNewConceptA] = useState("");
  const [newModuleName, setNewModuleName] = useState("");
  const [addingModule, setAddingModule] = useState(false);

  const [showPinInput, setShowPinInput] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modal confirm states
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);

  // Bulk import
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [importFeedback, setImportFeedback] = useState(null);

  // Study
  const [queue, setQueue] = useState([]);
  const [queueIdx, setQueueIdx] = useState(0);
  const [originalQueueSize, setOriginalQueueSize] = useState(0);
  const [injectedCount, setInjectedCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionLimit, setSessionLimit] = useState(20);
  const [allModulesMode, setAllModulesMode] = useState(false);
  const [materiaMode, setMateriaMode] = useState("module"); // "module" | "all" | "civil" | "procesal"
  const [injectionEnabled, setInjectionEnabled] = useState(true);
  const [injectionFixedCount, setInjectionFixedCount] = useState(5);
  const [activeModules, setActiveModules] = useState(() => loadActiveModules() || new Set(SEED_DATA.filter(m => m.concepts.length > 0).map(m => m.id)));
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionStats, setSessionStats] = useState({ done: 0, automatic: 0, resistant: 0, blank: 0 });
  const seenIds = useState(() => new Set())[0];
  const [repasoCards, setRepasoCards] = useState({ resistant: [], blank: [] });
  const [repasoRound, setRepasoRound] = useState(0);

  // Load shared modules on mount, merge with local progress
  useEffect(() => {
    loadModulesShared().then(shared => {
      const base = shared || SEED_DATA;
      const progress = loadProgress();
      const merged = mergeProgress(base, progress);
      setModules(merged);
      // If no saved preference, activate all modules that have content
      if (!loadActiveModules()) {
        const allIds = new Set(merged.filter(m => m.concepts.length > 0).map(m => m.id));
        setActiveModules(allIds);
        saveActiveModules(allIds);
      }
      setShowOnboarding(true);
      setLoading(false);
    });
  }, []);

  // Save bank to shared storage (editor only) and progress to localStorage
  useEffect(() => {
    if (loading) return;
    if (isEditor) saveModulesShared(modules);
    saveProgress(modules);
  }, [modules, isEditor, loading]);

  useEffect(() => {
    const activeMods = modules.filter(m => m.concepts.length > 0 && activeModules.has(m.id));
    if (activeMods.length === 0) {
      setQueue([]); setOriginalQueueSize(0); setInjectedCount(0);
      setQueueIdx(0); setShowAnswer(false);
      setSessionStats({ done: 0, automatic: 0, resistant: 0, blank: 0 }); setRepasoCards({ resistant: [], blank: [] }); setRepasoRound(0);
      seenIds.clear(); setSessionActive(false); setSessionStarted(false);
      return;
    }
    // Auto-adjust: si queda solo 1 módulo activo y estamos en modo "all", cambiar a módulo individual
    if (activeMods.length === 1 && materiaMode === "all") {
      const idx = modules.findIndex(m => m.id === activeMods[0].id);
      if (idx !== -1) setCurrentModuleIdx(idx);
      setMateriaMode("module");
      return;
    }

    // Auto-adjust: si el módulo actual no está en activeModules, reconfigurar
    const currentMod = modules[currentModuleIdx];
    if (materiaMode === "module" && currentMod && !activeModules.has(currentMod.id)) {
      if (activeMods.length === 0) return; // caso "Sin materias activas" — ya manejado arriba
      if (activeMods.length === 1) {
        const idx = modules.findIndex(m => m.id === activeMods[0].id);
        if (idx !== -1) setCurrentModuleIdx(idx);
        setMateriaMode("module");
      } else {
        setMateriaMode("all");
      }
      return;
    }
    const limit = (sessionLimit === 0 || sessionLimit === -1) ? null : sessionLimit;
    const { queue: q, injectedCount: ic } = buildQueue(modules, currentModuleIdx, injectionEnabled ? injectionFixedCount : 0, limit, allModulesMode, activeModules, materiaMode);
    setQueue(q);
    setOriginalQueueSize(q.length);
    setInjectedCount(ic);
    setQueueIdx(0);
    setShowAnswer(false);
    setSessionStats({ done: 0, automatic: 0, resistant: 0, blank: 0 }); setRepasoCards({ resistant: [], blank: [] }); setRepasoRound(0);
    seenIds.clear();
    setSessionActive(false);
    setSessionStarted(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentModuleIdx, sessionLimit, allModulesMode, injectionEnabled, injectionFixedCount, activeModules, materiaMode]);

  const currentCard = queue[queueIdx] ?? null;
  const progress = originalQueueSize > 0 ? Math.round((Math.min(queueIdx, originalQueueSize) / originalQueueSize) * 100) : 0;

  const getModuleName = useCallback((conceptId) => {
    for (const m of modules) {
      if (m.concepts.find((c) => c.id === conceptId)) return m.name;
    }
    return "—";
  }, [modules]);

  function rateCard(rating) {
    const days = DAYS_MAP[rating];
    setModules(prev => prev.map(mod => ({
      ...mod,
      concepts: mod.concepts.map(c =>
        c.id === currentCard.id
          ? { ...c, nextReview: addDays(days), interval: days, repetitions: c.repetitions + 1 }
          : c
      ),
    })));
    const isFirstTime = !seenIds.has(currentCard.id);
    seenIds.add(currentCard.id);
    setSessionStats(prevStats => ({
      ...prevStats,
      done: isFirstTime ? prevStats.done + 1 : prevStats.done,
      [rating]: isFirstTime ? prevStats[rating] + 1 : prevStats[rating]
    }));
    // Track para repaso final (solo primera vez)
    if (isFirstTime && (rating === "resistant" || rating === "blank")) {
      setRepasoCards(prev => ({ ...prev, [rating]: [...prev[rating], currentCard] }));
    }
    if (rating === "blank" && isFirstTime) {
      // No se reinserta — el repaso se elige en la pantalla de resultados
    }
    setShowAnswer(false);
    setQueueIdx(i => i + 1);
    // Registrar última sesión solo si es modo módulo y la tarjeta pertenece al módulo actual
    if (materiaMode === "module") {
      const currentMod = modules[currentModuleIdx];
      if (currentMod && currentMod.concepts.find(c => c.id === currentCard.id)) {
        saveLastSession(currentMod.id);
      }
    }
  }

  function addModule() {
    if (!newModuleName.trim()) return;
    setModules(prev => [...prev, createModule(newModuleName.trim())]);
    setNewModuleName("");
    setAddingModule(false);
  }

  function addConcept(moduleId) {
    if (!newConceptQ.trim() || !newConceptA.trim()) return;
    const c = createConcept(newConceptQ.trim(), newConceptA.trim());
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, concepts: [...m.concepts, c] } : m));
    setNewConceptQ(""); setNewConceptA(""); setAddingConcept(null);
  }

  function deleteModule(id) {
    const mod = modules.find(m => m.id === id);
    const idx = modules.findIndex(m => m.id === id);
    if (mod) {
      const deletedIds = new Set(mod.concepts.map(c => c.id));
      setQueue(prev => prev.filter(c => !deletedIds.has(c.id)));
    }
    setModules(prev => prev.filter(m => m.id !== id));
    if (idx === currentModuleIdx) setCurrentModuleIdx(0);
    setConfirmDeleteId(null);
  }

  function deleteConcept(moduleId, conceptId) {
    setModules(prev => prev.map(m =>
      m.id === moduleId ? { ...m, concepts: m.concepts.filter(c => c.id !== conceptId) } : m
    ));
    setQueue(prev => prev.filter(c => c.id !== conceptId));
  }

  function handleBulkImport() {
    if (!bulkText.trim()) {
      setImportFeedback({ type: "error", message: "El campo está vacío. Pega el contenido de tu Excel." });
      return;
    }

    const lines = bulkText.split('\n').filter(l => l.trim());
    let added = 0, skipped = 0;
    const updatedModules = modules.map(m => ({ ...m, concepts: [...m.concepts] }));

    for (const line of lines) {
      const sep = line.includes('\t') ? '\t' : ';';
      const parts = line.split(sep).map(p => p.trim());
      if (parts.length < 3) { skipped++; continue; }
      const [modName, q, a] = parts;
      if (!modName || !q || !a) { skipped++; continue; }

      let mod = updatedModules.find(m => m.name.toLowerCase() === modName.toLowerCase());
      if (!mod) {
        mod = createModule(modName);
        updatedModules.push(mod);
      }

      const dup = mod.concepts.some(c => c.question.toLowerCase() === q.toLowerCase());
      if (!dup) { mod.concepts.push(createConcept(q, a)); added++; }
      else skipped++;
    }

    if (added === 0) {
      setImportFeedback({ type: "error", message: `Sin cambios: ${skipped} fila${skipped !== 1 ? "s" : ""} omitida${skipped !== 1 ? "s" : ""} (duplicadas o formato incorrecto).` });
      return;
    }

    setModules(updatedModules);
    setImportFeedback({
      type: "success",
      message: `✓ ${added} concepto${added !== 1 ? "s" : ""} importado${added !== 1 ? "s" : ""}.${skipped > 0 ? ` ${skipped} omitido${skipped !== 1 ? "s" : ""} (duplicados o formato inválido).` : ""}`,
    });
    setBulkText("");
    setTimeout(() => { setShowBulkImport(false); setImportFeedback(null); }, 2200);
  }

  function openBulkModal() { setBulkText(""); setImportFeedback(null); setShowBulkImport(true); }
  function closeBulkModal() { setShowBulkImport(false); setImportFeedback(null); }

  const totalDue = useMemo(() => modules.flatMap(m => m.concepts).filter(isDue).length, [modules]);

  function handleOnboardingComplete(selectedIds, selectAll = false) {
    setActiveModules(selectedIds);
    saveActiveModules(selectedIds);
    if (selectAll || selectedIds.size > 1) {
      setMateriaMode("all");
    } else if (selectedIds.size === 1) {
      setMateriaMode("module");
      const idx = modules.findIndex(m => selectedIds.has(m.id));
      if (idx !== -1) setCurrentModuleIdx(idx);
    }
    setShowOnboarding(false);
  }

  if (loading) return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLE }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--bg)", fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--text-muted)" }}>
        Cargando banco de preguntas…
      </div>
    </>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLE }} />
      {showOnboarding && (
        <Onboarding modules={modules} onComplete={handleOnboardingComplete} />
      )}
      {!showOnboarding && (
      <div className={`app${interrogatorMode ? " dark-mode" : ""}`}>

        {/* ── MODAL ──────────────────────────────────────── */}
        {showBulkImport && (
          <div className="modal-overlay" onClick={closeBulkModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-title">Carga Masiva desde Excel</div>
              <div className="modal-desc">
                Selecciona las celdas en tu hoja de cálculo, <b>cópialas (Ctrl+C)</b> y pégalas aquí.<br />
                Acepta separación por <b>tabulación</b> (Excel/Sheets nativo) o <b>punto y coma</b>.
              </div>
              <div className="format-hint">
                <strong>Formato — 3 columnas obligatorias:</strong>
                <div><code>Módulo</code> → <code>Pregunta</code> → <code>Respuesta</code></div>
                <div style={{ marginTop: 6, opacity: 0.8 }}>
                  Ej: <code>Bienes</code> <code>[tab]</code> <code>¿Qué es el dominio?</code> <code>[tab]</code> <code>El derecho real sobre cosa corporal...</code>
                </div>
                <div style={{ marginTop: 4, opacity: 0.65 }}>Los módulos nuevos se crean automáticamente. Los duplicados se omiten.</div>
              </div>
              <textarea
                className="input-field"
                style={{ height: 180, fontSize: 10, lineHeight: 1.65 }}
                placeholder={"Módulo\tPregunta\tRespuesta\nBienes\t¿Qué es el dominio?\tEl derecho real en una cosa corporal..."}
                value={bulkText}
                onChange={e => { setBulkText(e.target.value); setImportFeedback(null); }}
              />
              {importFeedback && (
                <div className={`import-feedback ${importFeedback.type}`}>{importFeedback.message}</div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: "center", padding: "10px 14px", fontSize: 11 }}
                  onClick={handleBulkImport}
                >
                  📥 Importar conceptos
                </button>
                <button className="btn btn-ghost" onClick={closeBulkModal}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* ── SIDEBAR ────────────────────────────────────── */}
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
          <div className="sidebar-header">
            <div style={{ paddingBottom: 10, borderBottom: "1px solid var(--border)", marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--accent)" }}>SPARE</span>
              {isEditor ? (
                <div style={{ display: "flex", gap: 5 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setAddingModule(v => !v)}>
                    {addingModule ? "✕" : "+ Nuevo"}
                  </button>
                  <button className="btn btn-ghost btn-sm" title="Cerrar edición" onClick={() => setIsEditor(false)}>🔓</button>
                </div>
              ) : showPinInput ? (
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <input
                    className="input-field"
                    type="password"
                    placeholder="PIN…"
                    value={pinValue}
                    autoFocus
                    style={{ width: 60, marginBottom: 0, padding: "4px 6px", fontSize: 11 }}
                    onChange={e => setPinValue(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        if (pinValue === EDITOR_PIN) { setIsEditor(true); setShowPinInput(false); setPinValue(""); }
                        else { setPinValue(""); }
                      }
                      if (e.key === "Escape") { setShowPinInput(false); setPinValue(""); }
                    }}
                  />
                  <button className="btn btn-ghost btn-sm" onClick={() => { setShowPinInput(false); setPinValue(""); }}>✕</button>
                </div>
              ) : (
                <button className="btn btn-ghost btn-sm" title="Modo editor" onClick={() => setShowPinInput(true)}>🔒</button>
              )}
            </div>
            <div className="sidebar-header-top">
              <span className="sidebar-title">Examen de grado</span>
            </div>
            {isEditor && (
              <button className="btn btn-ghost btn-full btn-dashed" style={{ fontSize: 10 }} onClick={openBulkModal}>
                📥 Carga masiva (Excel)
              </button>
            )}
          </div>

          {isEditor && addingModule && (
            <div className="add-form" style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)" }}>
              <input
                className="input-field"
                placeholder="Nombre del módulo…"
                value={newModuleName}
                onChange={e => setNewModuleName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addModule()}
              />
              <button className="btn btn-primary btn-full" onClick={addModule}>Crear módulo</button>
            </div>
          )}

          <div className="sidebar-scroll">
            {/* ── CATEGORÍAS ── */}
            {[
              {
                categoria: "Derecho Civil",
                modulos: [
                  "Acto Jurídico",
                  "Teoría de las Obligaciones",
                  "Contratos General",
                  "Teoría de los Bienes",
                  "Contratos Parte Especial",
                  "Personas",
                  "Familia",
                  "Sucesorio",
                  "Daños",
                ]
              },
              {
                categoria: "Derecho Procesal",
                modulos: [
                  "Procesal Orgánico",
                  "Proceso y Procedimiento",
                  "Ordinario y Sumario",
                  "Ejecutivo y Juicios Especiales",
                  "Recursos Civiles",
                  "Procesal Penal",
                  "Recursos Penales",
                ]
              }
            ].map(({ categoria, modulos }) => {
              const isCatOpen = expandedModules[`cat_${categoria}`];
              return (
                <div key={categoria}>
                  {/* Cabecera de categoría */}
                  <div
                    onClick={() => setExpandedModules(p => ({ ...p, [`cat_${categoria}`]: !p[`cat_${categoria}`] }))}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px 8px", cursor: "pointer", borderBottom: "1px solid var(--border)" }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--accent)" }}>{categoria}</span>
                    <span style={{ fontSize: 9, color: "var(--text-muted)", transition: "transform 0.2s", display: "inline-block", transform: isCatOpen ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                  </div>

                  {/* Módulos de la categoría */}
                  {isCatOpen && modulos.map(modName => {
                    const mod = modules.find(m => m.name === modName);
                    const isPlaceholder = !mod || mod.concepts.length === 0;
                    const isExpanded = mod && expandedModules[mod.id];
                    const dueCount = mod ? mod.concepts.filter(isDue).length : 0;
                    const isActive = mod ? activeModules.has(mod.id) : false;

                    return (
                      <div key={modName} className="module-item" style={{ opacity: isPlaceholder ? 0.45 : 1 }}>
                        <div
                          className="module-header"
                          onClick={() => isEditor && mod && !isPlaceholder && setExpandedModules(p => ({ ...p, [mod.id]: !p[mod.id] }))}
                          style={{ cursor: isEditor && !isPlaceholder ? "pointer" : "default" }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                            {!isPlaceholder && (
                              <input
                                type="checkbox"
                                checked={isActive}
                                onClick={e => e.stopPropagation()}
                                onChange={e => {
                                  const next = new Set(activeModules);
                                  if (e.target.checked) next.add(mod.id);
                                  else next.delete(mod.id);
                                  setActiveModules(next);
                                  saveActiveModules(next);
                                }}
                                style={{ accentColor: "var(--accent)", cursor: "pointer", flexShrink: 0 }}
                              />
                            )}
                            <div style={{ minWidth: 0 }}>
                              <div className="module-name">{modName}</div>
                              <div className="module-meta">
                                {isPlaceholder
                                  ? "Próximamente"
                                  : (() => {
                                      const sessions = loadLastSessions();
                                      const last = sessions[mod.id];
                                      const days = last !== undefined ? daysAgo(last) : null;
                                      return `${mod.concepts.length} preguntas${days !== null ? ` · hace ${days} día${days !== 1 ? "s" : ""}` : ""}`;
                                    })()
                                }
                              </div>
                            </div>
                          </div>
                          {isEditor && !isPlaceholder && <span className={`module-chevron${isExpanded ? " open" : ""}`}>▶</span>}
                        </div>

                        {isEditor && isExpanded && mod && (
                          <div className="concept-list">
                            {mod.concepts.map(c => (
                              <div key={c.id} className="concept-item">
                                <div className="concept-q">{c.question}</div>
                                <div className="concept-a">{c.answer}</div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                                  <span className="concept-due">
                                    {isDue(c) ? "● Pendiente" : `Próximo: ${new Date(c.nextReview).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}`}
                                  </span>
                                  {isEditor && <button className="btn btn-danger btn-sm" onClick={() => deleteConcept(mod.id, c.id)}>✕</button>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", borderBottom: "1px solid var(--border)", borderTop: "1px solid var(--border)" }}>
                <span className="sidebar-title">Tus módulos</span>
              </div>
              <div style={{ padding: "10px 18px", borderBottom: "1px solid var(--border)", opacity: 0.45 }}>
                <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.02em" }}>Próximamente podrás cargar tus propias preguntas</div>
              </div>
            </div>
          </div>

          <div className="sidebar-footer">
            <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6 }}>
              <div style={{ marginBottom: 6, fontWeight: 500, color: "var(--text)" }}>¿Tienes alguna sugerencia, encontraste un error? Contáctame:</div>
              <div style={{ display: "flex", gap: 8 }}>
                <a href="https://www.linkedin.com/in/alejandrovi/" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 10, color: "var(--accent)", textDecoration: "none", borderBottom: "1px solid var(--accent)" }}>
                  LinkedIn
                </a>
                <a href="mailto:alevelizisla@gmail.com?subject=Observaciones%20sobre%20SPARE&body=Hola%20Alejandro%2C%20estuve%20probando%20SPARE%20y%20debo%20comentarte%20lo%20siguiente%3A%0A%0A%0A%0ASaludos"
                  style={{ fontSize: 10, color: "var(--accent)", textDecoration: "none", borderBottom: "1px solid var(--accent)" }}>
                  Correo
                </a>
              </div>
            </div>
          </div>

        </aside>
        {/* ── MAIN ───────────────────────────────────────── */}
        <main className="main">
          <div className="topbar">
            <div className="topbar-left">
              <button className="hamburger" onClick={() => setSidebarOpen(v => !v)}>☰</button>
              <div className="autor-badge-wrap" style={{ display: "inline-flex", alignItems: "center" }}><AutorBadge /></div>
              <a
                href="https://ko-fi.com/alejandroveliz"
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: "#B8860B", color: "#fff", fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", padding: "4px 12px", borderRadius: 999, textDecoration: "none", whiteSpace: "nowrap" }}
              >☕ Invítame un café</a>
              <a
                className="linkedin-btn"
                href="https://www.linkedin.com/in/alejandrovi/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "none" }}
              >Mi LinkedIn</a>
            </div>
            <div className="topbar-right">
            </div>
          </div>

          <div className="study-area">
            <div className="study-center">

              {/* ── SIN MATERIAS SELECCIONADAS ── */}
              {!sessionActive && modules.filter(m => m.concepts.length > 0 && activeModules.has(m.id)).length === 0 && (
                <div className="state-box">
                  <div className="state-icon">📚</div>
                  <div className="state-title">Sin materias activas</div>
                  <div className="state-sub">Selecciona al menos una materia en el menú de la izquierda para comenzar.</div>
                </div>
              )}

              {/* ── SELECTOR DE MÓDULO PROMINENTE ── */}
              {!sessionActive && modules.filter(m => m.concepts.length > 0 && activeModules.has(m.id)).length > 0 && (
                <div className="module-selector-block">

                  {/* — MATERIA — */}
                  <div className="module-selector-label">Materia</div>
                  {(() => {
                    const CIVIL = ["Acto Jurídico","Teoría de las Obligaciones","Contratos General","Teoría de los Bienes","Contratos Parte Especial","Personas","Familia","Sucesorio","Daños"];
                    const PROCESAL = ["Procesal Orgánico","Proceso y Procedimiento","Ordinario y Sumario","Ejecutivo y Juicios Especiales","Recursos Civiles","Procesal Penal","Recursos Penales"];
                    const activeMods = modules.filter(m => m.concepts.length > 0 && activeModules.has(m.id));
                    const activeCivil = activeMods.filter(m => CIVIL.includes(m.name));
                    const activeProcesal = activeMods.filter(m => PROCESAL.includes(m.name));
                    // "Todo" solo si están todos los de esa área con contenido
                    const allCivilWithContent = modules.filter(m => CIVIL.includes(m.name) && m.concepts.length > 0);
                    const allProcesalWithContent = modules.filter(m => PROCESAL.includes(m.name) && m.concepts.length > 0);
                    const isTodoCivil = activeCivil.length === allCivilWithContent.length && activeCivil.length > 1;
                    const isTodoProcesal = activeProcesal.length === allProcesalWithContent.length && activeProcesal.length > 1;
                    const isPoolMode = materiaMode !== "module";

                    return (
                      <select
                        className="module-selector-select"
                        value={isPoolMode ? materiaMode : String(currentModuleIdx)}
                        onChange={e => {
                          const val = e.target.value;
                          if (val === "all") {
                            setMateriaMode("all");
                            setAllModulesMode(false);
                          } else {
                            setMateriaMode("module");
                            setAllModulesMode(false);
                            setCurrentModuleIdx(Number(val));
                            setSidebarOpen(false);
                          }
                        }}
                      >
                        {activeMods.length > 1 && <option value="all">🌐 Todo lo seleccionado</option>}
                        {activeMods.map((m) => {
                          const i = modules.indexOf(m);
                          return <option key={m.id} value={i}>{m.name}</option>;
                        })}
                      </select>
                    );
                  })()}

                  {/* Lista inmediata debajo del selector cuando es "Todo lo seleccionado" */}
                  {materiaMode === "all" && (
                    <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.7 }}>
                      {modules.filter(m => activeModules.has(m.id) && m.concepts.length > 0).map(m => m.name).join(" · ")}
                    </div>
                  )}

                  {/* Descripción en modo pool — debajo de extensión */}

                  {/* — EXTENSIÓN — */}
                  <div style={{ borderTop: "1px solid var(--border)", marginTop: 12, paddingTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span className="module-selector-label" style={{ marginBottom: 0 }}>Extensión</span>
                    <select
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, color: "var(--accent)", background: "var(--tag-bg)", border: "1.5px solid var(--border)", borderRadius: 999, outline: "none", cursor: "pointer", padding: "4px 12px" }}
                      value={String(sessionLimit)}
                      onChange={e => setSessionLimit(Number(e.target.value))}
                    >
                      <option value="10">10 preguntas</option>
                      <option value="20">20 preguntas</option>
                      <option value="40">40 preguntas</option>
                      <option value="60">60 preguntas</option>
                      <option value="0">Todas</option>
                    </select>
                  </div>

                  {/* Checkbox inyección — solo en modo módulo individual */}
                  {materiaMode === "module" && (
                    <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 11, color: "var(--text-muted)" }}>
                        <input
                          type="checkbox"
                          checked={injectionEnabled}
                          onChange={e => setInjectionEnabled(e.target.checked)}
                          style={{ accentColor: "var(--accent)", cursor: "pointer" }}
                        />
                        Incluir temas de asignaturas activas
                      </label>
                      {injectionEnabled && (
                        <div style={{ display: "flex", gap: 6, paddingLeft: 20, flexWrap: "wrap" }}>
                          {[2, 5, 10, 15].map(count => (
                            <button
                              key={count}
                              onClick={() => setInjectionFixedCount(count)}
                              style={{
                                fontFamily: "'Inter', sans-serif", fontSize: 10, cursor: "pointer",
                                padding: "3px 9px", borderRadius: 999, border: "1.5px solid",
                                borderColor: injectionFixedCount === count ? "var(--accent)" : "var(--border)",
                                background: injectionFixedCount === count ? "var(--accent)" : "transparent",
                                color: injectionFixedCount === count ? "#fff" : "var(--text-muted)",
                                transition: "all 0.15s", fontWeight: 700
                              }}
                            >{count}</button>
                          ))}
                        </div>
                      )}
                      {injectionEnabled && injectionFixedCount >= sessionLimit && sessionLimit !== 0 && (
                        <div style={{ fontSize: 10, color: "var(--resist)", paddingLeft: 20, marginTop: 4, fontWeight: 600 }}>
                          ⚠ Las preguntas inyectadas superan la extensión del test
                        </div>
                      )}
                      {!injectionEnabled && (
                        <div style={{ fontSize: 10, color: "var(--resist)", lineHeight: 1.5, paddingLeft: 20 }}>
                          Si estás estudiando para tu examen de grado es recomendado dejar esta opción encendida.
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

              {sessionStarted && <div className="stats-row" style={{ marginBottom: 16 }}>
                {[
                  { num: sessionStats.done, lbl: "Revisados", color: "var(--accent)", cls: "stat-pill-revisados" },
                  { num: sessionStats.automatic, lbl: "Perfecta", color: "var(--auto)", cls: "stat-pill-perfecta" },
                  { num: sessionStats.resistant, lbl: "Incompleta", color: "var(--resist)", cls: "stat-pill-incompleta" },
                  { num: sessionStats.blank, lbl: "Sin respuesta", color: "var(--blank)", cls: "stat-pill-blank" },
                ].map(({ num, lbl, color, cls }) => (
                  <div key={lbl} className={`stat-pill ${cls}`}>
                    <div className="stat-num" style={{ color }}>{num}</div>
                    <div className="stat-lbl">{lbl}</div>
                  </div>
                ))}
              </div>}

              {queue.length > 0 && (
                <div className="progress-bar-wrap">
                  <div className="progress-info">
                    <span>{materiaMode === "all" ? (
                      <span
                        onClick={() => setExpandedModules(p => ({ ...p, _popurri: !p._popurri }))}
                        style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, borderBottom: "1px dashed var(--text-muted)", paddingBottom: 1, position: "relative" }}
                      >
                        Popurrí de ramos
                        <span style={{ fontSize: 10, color: "var(--accent)", fontWeight: 700, width: 14, height: 14, borderRadius: "50%", border: "1.5px solid var(--accent)", display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: 1, flexShrink: 0 }}>i</span>
                        {expandedModules._popurri && (
                          <>
                            <div onClick={e => { e.stopPropagation(); setExpandedModules(p => ({ ...p, _popurri: false })); }} style={{ position: "fixed", inset: 0, zIndex: 49 }} />
                            <div onClick={e => e.stopPropagation()} style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 50, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", minWidth: 200, boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
                              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Ramos en este test</div>
                              {modules.filter(m => activeModules.has(m.id) && m.concepts.length > 0).map(m => (
                                <div key={m.id} style={{ fontSize: 11, color: "var(--text)", paddingBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
                                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", display: "inline-block", flexShrink: 0 }} />
                                  {m.name}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </span>
                    ) : <>Test de <b>{modules[currentModuleIdx]?.name}</b>{injectedCount > 0 ? ` · repasando ${injectedCount} pregunta${injectedCount !== 1 ? "s" : ""} del resto de asignaturas` : ""}</> }</span>
                    <span>{Math.min(queueIdx, originalQueueSize)}/{originalQueueSize}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}


              {modules.length === 0 ? (
                <div className="state-box">
                  <div className="state-icon">📚</div>
                  <div className="state-title">Sin contenido</div>
                  <div className="state-sub">Usa el botón de Carga Masiva en la barra lateral<br />para importar tus conceptos desde Excel.</div>
                </div>
              ) : !sessionStarted && queue.length > 0 ? (
                <div className="state-box">
                  <div className="state-icon">📋</div>
                  <div className="state-title">Listo para comenzar</div>
                  <div className="state-sub" style={{ marginBottom: 20 }}>
                    <b style={{ color: "var(--text)" }}>{originalQueueSize} preguntas</b>
                    {materiaMode !== "module"
                      ? <span> · Popurrí de ramos</span>
                      : <>
                          <span> · {modules[currentModuleIdx]?.name}</span>
                          {injectionEnabled && injectedCount > 0 && (
                            <span> · {injectedCount} pregunta{injectedCount !== 1 ? "s" : ""} de otras asignaturas</span>
                          )}
                        </>
                    }
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ padding: "12px 28px", fontSize: 12 }}
                    onClick={() => { setSessionStarted(true); setSessionActive(true); }}
                  >Iniciar test</button>
                </div>
              ) : !currentCard && queueIdx >= queue.length && queue.length > 0 ? (
                <div className="state-box">
                  <div className="state-icon">🎯</div>
                  <div className="state-title">Sesión completada</div>
                  {sessionStats.done > 0 && (() => {
                    const pct = Math.round((sessionStats.automatic / sessionStats.done) * 100);
                    if (pct === 100) return <div style={{ fontSize: 13, color: "var(--auto)", marginBottom: 4 }}>Has respondido a la perfección ✨</div>;
                    if (pct >= 80) return <div style={{ fontSize: 13, color: "var(--auto)", marginBottom: 4 }}>Excelente, te ha ido muy bien 👏</div>;
                    return null;
                  })()}

                  {/* Resumen de resultados */}
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "18px 0 8px", flexWrap: "wrap" }}>
                    <div style={{ textAlign: "center", padding: "10px 16px", background: "var(--bg)", borderRadius: 6, border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 22, fontWeight: 500, color: "var(--auto)" }}>{sessionStats.automatic}</div>
                      <div style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.05em", marginTop: 2 }}>PERFECTAS</div>
                    </div>
                    <div style={{ textAlign: "center", padding: "10px 16px", background: "var(--bg)", borderRadius: 6, border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 22, fontWeight: 500, color: "var(--resist)" }}>{sessionStats.resistant}</div>
                      <div style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.05em", marginTop: 2 }}>INCOMPLETAS</div>
                    </div>
                    <div style={{ textAlign: "center", padding: "10px 16px", background: "var(--bg)", borderRadius: 6, border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 22, fontWeight: 500, color: "var(--blank)" }}>{sessionStats.blank}</div>
                      <div style={{ fontSize: 9, color: "var(--text-muted)", letterSpacing: "0.05em", marginTop: 2 }}>SIN RESPUESTA</div>
                    </div>
                  </div>

                  {/* Bifurcación de repaso */}
                  {(repasoCards.blank.length > 0 || repasoCards.resistant.length > 0) && (
                    <div style={{ marginTop: 18, borderTop: "1px solid var(--border)", paddingTop: 16, width: "100%" }}>
                      {repasoRound >= 2 && (
                        <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginBottom: 12, fontStyle: "italic" }}>
                          😮‍💨 Quizás deberías respirar antes de seguir practicando
                        </div>
                      )}
                      <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 12, textAlign: "center" }}>¿Quieres repasar ahora?</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {repasoCards.blank.length > 0 && (
                          <button className="btn btn-primary btn-full" style={{ justifyContent: "center", padding: "10px", fontSize: 11 }}
                            onClick={() => {
                              const q = [...repasoCards.blank].sort(() => Math.random() - 0.5);
                              setQueue(q); setOriginalQueueSize(q.length); setInjectedCount(0); setQueueIdx(0); setShowAnswer(false);
                              setSessionStats({ done: 0, automatic: 0, resistant: 0, blank: 0 }); setRepasoCards({ resistant: [], blank: [] });
                              setRepasoRound(r => r + 1);
                              seenIds.clear(); setSessionActive(true); setSessionStarted(true);
                            }}>
                            Solo las que no supe ({repasoCards.blank.length})
                          </button>
                        )}
                        {(repasoCards.resistant.length > 0 || repasoCards.blank.length > 0) && (
                          <button className="btn btn-ghost btn-full" style={{ justifyContent: "center", padding: "10px", fontSize: 11 }}
                            onClick={() => {
                              const q = [...repasoCards.resistant, ...repasoCards.blank].sort(() => Math.random() - 0.5);
                              setQueue(q); setOriginalQueueSize(q.length); setInjectedCount(0); setQueueIdx(0); setShowAnswer(false);
                              setSessionStats({ done: 0, automatic: 0, resistant: 0, blank: 0 }); setRepasoCards({ resistant: [], blank: [] });
                              setRepasoRound(r => r + 1);
                              seenIds.clear(); setSessionActive(true); setSessionStarted(true);
                            }}>
                            Incompletas + no supe ({repasoCards.resistant.length + repasoCards.blank.length})
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    className="btn btn-ghost btn-full"
                    style={{ marginTop: 14, justifyContent: "center", padding: "10px", fontSize: 11 }}
                    onClick={() => {
                      const limit = (sessionLimit === 0 || sessionLimit === -1) ? null : sessionLimit;
                      const { queue: q, injectedCount: ic } = buildQueue(modules, currentModuleIdx, injectionEnabled ? injectionFixedCount : 0, limit, allModulesMode, activeModules, materiaMode);
                      setQueue(q); setOriginalQueueSize(q.length); setInjectedCount(ic); setQueueIdx(0); setShowAnswer(false);
                      setSessionStats({ done: 0, automatic: 0, resistant: 0, blank: 0 }); setRepasoCards({ resistant: [], blank: [] }); setRepasoRound(0);
                      seenIds.clear();
                      setSessionActive(false); setSessionStarted(false);
                    }}
                  >Terminar</button>
                </div>
              ) : currentCard ? (
                <>
                  <div className="card" style={{ position: "relative" }}>
                    {sessionActive && (
                      <div style={{ position: "absolute", top: 16, right: 16 }}>
                        {confirmEnd ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>¿Terminar?</span>
                            <button
                              onClick={() => {
                                setSessionActive(false); setSessionStarted(false);
                                setQueueIdx(0); setShowAnswer(false);
                                setSessionStats({ done: 0, automatic: 0, resistant: 0, blank: 0 }); setRepasoCards({ resistant: [], blank: [] }); setRepasoRound(0);
                                seenIds.clear(); setConfirmEnd(false);
                              }}
                              style={{ background: "#E05C5C", color: "#fff", border: "none", borderRadius: 999, padding: "3px 10px", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                            >Sí</button>
                            <button
                              onClick={() => setConfirmEnd(false)}
                              style={{ background: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 999, padding: "3px 10px", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                            >No</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmEnd(true)}
                            className="btn-terminar-mobile"
                            style={{ background: "#E05C5C", color: "#fff", border: "none", borderRadius: 999, padding: "4px 12px", fontSize: 10, fontWeight: 700, cursor: "pointer", letterSpacing: "0.03em", fontFamily: "inherit" }}
                          >✕ Terminar</button>
                        )}
                      </div>
                    )}
                    <span className="card-tag">{getModuleName(currentCard.id)}</span>
                    <div className="card-question">{currentCard.question}</div>
                    {showAnswer && (
                      <>
                        <hr className="card-divider" />
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <div className="card-answer answer-fade" style={{ flex: 1 }}>{currentCard.answer}</div>
                          <button
                            title="Leer en voz alta"
                            style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", fontSize: 16, opacity: 0.5, padding: "2px 4px", lineHeight: 1 }}
                            onClick={() => {
                              window.speechSynthesis.cancel();
                              const u = new SpeechSynthesisUtterance(currentCard.answer);
                              u.lang = "es-CL";
                              window.speechSynthesis.speak(u);
                            }}
                          >🔊</button>
                        </div>
                      </>
                    )}
                  </div>
                  {!showAnswer ? (
                    <button
                      className="btn btn-primary btn-full"
                      style={{ padding: "14px", fontSize: 12, borderRadius: 4 }}
                      onClick={() => setShowAnswer(true)}
                    >Mostrar respuesta</button>
                  ) : (
                    <>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center", marginBottom: 10, letterSpacing: "0.04em" }}>
                        ¿Qué tal estuvo tu respuesta?
                      </div>
                      <div className="rating-row">
                        <button className="btn-rating btn-auto" onClick={() => rateCard("automatic")}>
                          Respuesta perfecta
                        </button>
                        <button className="btn-rating btn-resist" onClick={() => rateCard("resistant")}>
                          Más o menos / Incompleta
                        </button>
                        <button className="btn-rating btn-blank" onClick={() => rateCard("blank")}>
                          No supe responder
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </main>
      </div>
      )}
    </>
  );
}
