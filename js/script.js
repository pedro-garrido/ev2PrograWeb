/*
 * primero que todo, perdon el desorden
 * ando un poco corto de tiempo, pero bueno,
 * intente dejarlo lo mas limpio posible,
 */

$(document).ready(() => {
  // objeto con los regex
  const reges = {
    rut: /^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}$/,
    email: /^[a-zA-z-0-9]+@[a-zA-z]+.com/gm,
    text: /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/gm,
    number: /^[0-9]+$/gm,
  };

  // defino los objetos de la vista para manipular
  // el dom mas facil
  const rut = $("#rut");
  const nombre = $("#nombre");
  const apellido1 = $("#apellido1");
  const apellido2 = $("#apellido2");
  const correo = $("#correo");
  const htrabajadas = $("#htrabajadas");
  const nhijos = $("#nhijos");
  const saldoafp = $("#saldoafp");
  const resultado = $("#resultado");
  const calcular = $("#calcular");

  /* animar formulario al hacer click
    agregando left 200px 
  */
  $("#animarBtn").click(() => {
    $("#formCalculadora")
      .css("position", "relative")
      .animate({ left: "200px" }, 1000 * 3, () => {
        swal("FIN", "ANIMACION", "success");
      });
  });

  // * BORDE ROJO AL ENTRAR EN EL CAMPO
  $("input").focusin(function () {
    $(this).css("border", "5px solid red");
  });
  // * BORDE NORMAL AL SALIR EN EL CAMPO
  $("input").focusout(function () {
    $(this).css("border", "none");
  });

  // * CRECER LABEL FOCUSIN
  nombre.focusin(() => {
    $("#nombreLabel").css("font-size", "150%");
  });
  // * RESTAURAR LABEL FOCUSOUT
  nombre.focusout(() => {
    $("#nombreLabel").css("font-size", "100%");
  });

  // EVENTO CLICK DEL SUBMIT
  calcular.click(function () {
    // VALIDO SI TODOS LOS CAMPOS ESTAN LLENOS
    // Y APRUEBAN EL REGEX
    // SI ES ASI, EL ATRIBUTO ES TRUE
    const validacion = {
      rutTest: reges.rut.test(rut.val()) ? true : false, //regex rut test
      nombre: reges.text.test(nombre.val()) ? true : false, //text regex
      apellido1: reges.text.test(apellido1.val()) ? true : false, //text regex
      apellido2: reges.text.test(apellido2.val()) ? true : false, //text regex
      correoTest: reges.email.test(correo.val()) ? true : false, //email regex test
      htrabajadas: reges.number.test(htrabajadas.val()) ? true : false, //number regex
      nhijos: reges.number.test(nhijos.val()) ? true : false, //number regex
      saldoafp: reges.number.test(saldoafp.val()) ? true : false, //number regex
    };

    if (
      //si hay un campo vacio
      !rut.val() ||
      !nombre.val() ||
      !apellido1.val() ||
      !apellido2.val() ||
      !correo.val() ||
      !htrabajadas.val() ||
      !nhijos.val() ||
      !saldoafp.val()
    ) {
      swal({
        //campo vacio
        title: "Hay un campo vacio!",
        icon: "error",
      });
    } else if (!validacion.rutTest) {
      //si el rut no es valido por regex
      swal({
        title: "Rut no valido!",
        icon: "error",
      });
    } else if (!validacion.correoTest) {
      //si el correo no es valido por regex
      swal({
        title: "Correo no valido!",
        icon: "error",
      });
    } else if (
      //si todos los campos aprueban los regex
      validacion.rutTest &&
      validacion.nombre &&
      validacion.apellido1 &&
      validacion.apellido2 &&
      validacion.correoTest &&
      validacion.htrabajadas &&
      validacion.nhijos &&
      validacion.saldoafp
    ) {
      // calculo el bono
      if (htrabajadas.val() >= 40 && nhijos.val() <= 1 && saldoafp.val() == 0) {
        resultado.val(pesoFormat.format(300000));
      } else if (
        htrabajadas.val() > 45 &&
        nhijos.val() >= 2 &&
        saldoafp.val() == 0
      ) {
        resultado.val(pesoFormat.format(400000));
      } else if (
        htrabajadas.val() >= 41 &&
        htrabajadas.val() <= 44 &&
        nhijos.val() <= 1 &&
        saldoafp.val() > 0 &&
        saldoafp.val() <= 500000
      ) {
        resultado.val(pesoFormat.format(100000));
      } else if (
        htrabajadas.val() == 45 &&
        saldoafp.val() > 0 &&
        saldoafp.val() <= 500000 &&
        nhijos.val() >= 2
      ) {
        resultado.val(pesoFormat.format(200000));
      } else if (saldoafp.val() > 500000) {
        resultado.val("No corresponde bono");
      } else {
        resultado.val("No corresponde bono");
      }
    } else {
      //por si se me escapa un error
      swal({
        title: "error desconocido",
        icon: "error",
      });
    }
  });

  // ! COSAS QUE NO PIDIO PERO ME PARECIERON IMPORTANTES

  // * validacion por algoritmo de rut
  rut.focusin(function () {
    rut.addClass("focusInput");
  });

  rut.focusout(() => {
    rut.css("border", "1px solid #ced4da");

    if (validaRut(rut.val())) {
      $("#rutValidate").css("display", "none");
      rut.val(rutFormat(rut.val()));
    } else {
      $("#rutValidate").css("display", "inherit");
    }
  });

  // * formateadores y validadores

  // TODO: Camiar de archivo

  // formateador para currency
  var pesoFormat = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  });

  //funcion para dar formato al rut
  var rutFormat = (rut) => {
    // format rut with regex
    if (rut.match(reges.rut)) {
      return; //if match return
    } else {
      dv = rut.substr(rut.length - 1);
      rutN = rut.substr(0, rut.length - 1);
      rutN = Intl.NumberFormat("es-CL").format(
        parseInt(rutN.replace(/\./g, ""))
      );
      return rutN + "-" + dv;
      //if not match format with regex
    }
  };

  // funcion algoritmo de rut
  function validaRut(campo) {
    if (campo.length == 0) {
      return false;
    }
    if (campo.length < 8) {
      return false;
    }

    campo = campo.replace("-", "");
    campo = campo.replace(/\./g, "");

    var suma = 0;
    var caracteres = "1234567890kK";
    var contador = 0;
    for (var i = 0; i < campo.length; i++) {
      u = campo.substring(i, i + 1);
      if (caracteres.indexOf(u) != -1) contador++;
    }
    if (contador == 0) {
      return false;
    }

    var rut = campo.substring(0, campo.length - 1);
    var drut = campo.substring(campo.length - 1);
    var dvr = "0";
    var mul = 2;

    for (i = rut.length - 1; i >= 0; i--) {
      suma = suma + rut.charAt(i) * mul;
      if (mul == 7) mul = 2;
      else mul++;
    }
    res = suma % 11;
    if (res == 1) dvr = "k";
    else if (res == 0) dvr = "0";
    else {
      dvi = 11 - res;
      dvr = dvi + "";
    }
    if (dvr != drut.toLowerCase()) {
      return false;
    } else {
      return true;
    }
  }
});
