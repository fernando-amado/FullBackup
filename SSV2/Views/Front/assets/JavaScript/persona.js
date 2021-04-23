const tabla = document.querySelector(".tbody");
const boton = document.getElementById("ButtonAdd");
const btnGuardarMateria = document.getElementById("ButtonAddEditar");

let inputNombre = document.getElementById("nombre");
let inputApellido = document.getElementById("apellido");
let inputDocumento = document.getElementById("documento");
let inputTipo = document.getElementById("tipoId");
let inputId = document.getElementById("idMaestro");

let documentoEditar = document.getElementById("documentoEditar");
let nombreEditar = document.getElementById("nombreEditar");
let apellidoEditar = document.getElementById("apellidoEditar");
let tipoIdEditar = document.getElementById("tipoIdEditar");
let estadoEditar = document.getElementById("estadoEditar");
let htmlLocation = window.location;

boton.addEventListener("click", () => {
  inputNombre = document.getElementById("nombre").value;
  inputApellido = document.getElementById("apellido").value;
  inputTipo = parseInt(document.getElementById("tipoId").value);
  inputDocumento = document.getElementById("documento").value;
  Agregar(inputNombre, inputApellido, inputTipo, inputDocumento);
});

function listarPersona() {
  fetch("https://localhost:44351/api/Personas/ConsultarTodo")
    .then((response) => response.json())
    .then((personas) =>
      personas.forEach((persona) => {
        console.log(persona)
        if (
          persona.Tp_Id == 1 &&
          htmlLocation == "http://127.0.0.1:5500/views/alumnos.html"
        ) {
          llenarTablaPersona(persona);
        } else if (
          persona.Tp_Id == 2 &&
          htmlLocation == "http://127.0.0.1:5500/views/maestros.html"
        ) {
            llenarTablaPersona(persona);
        }
      })
    );
}

function llenarTablaPersona(p) {
	let profe = document.createElement("tr");

	profe.innerHTML += `<td> ${p.NDoc} </td>
  <td>  ${p.Nombres} </td>
  <td>  ${p.Apellidos} </td>
  <td>  ${p.TDoc_Id == 1 ? "CC" : "TI"}  </td>
  <td>  ${p.Activo ? "Activo" : "Inactivo"}  </td>`;
	profe.innerHTML += `<td class="tdBoton ">
  <button class="buttonEditar far fa-edit"onclick="AbrirEditar
	(${p.Id},
	${p.NDoc},
	'${p.Nombres}',
    '${p.Apellidos}',
    ${p.TDoc_Id},
	${p.Activo}
	)">Editar</button>
  <button class="fas fa-trash-alt buttonEliminar" onclick="ConfirmarEliminar(${p.Id})">Eliminar</button></td>`;
	profe.setAttribute("data-id", p.Id);
	tabla.appendChild(profe);
	inputNombre.value = "";
}

function Capitalize(name){
    return  name ? 
    name[0].toUpperCase()+name.slice(1):
    console.log("esta vacio")
}

function Agregar(nombre, apellido, tdoc, ndoc) {
    
	fetch("https://localhost:44351/api/Personas", {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		method: "POST",
		body: JSON.stringify({
			Nombres: Capitalize(nombre),
			Apellidos: Capitalize(apellido),
			TDoc_Id: tdoc,
			NDoc: ndoc,
			Activo: true,
			Tp_Id: ((htmlLocation == "http://127.0.0.1:5500/views/alumnos.html") ? 1 : 2)
		})
	})
		.then((response) =>{ 
			if(response.status==400)
			{
				swal ( "¡Transaccion Fallida! " ,"-Error el documento esta repetido \n -Campos Vacios", "error" );
			}
			else{
				swal ( "¡Transaccion Exitosa! " , "¡Se ha agregado un nuevo alumno! " , "success" );
				response.json().then((a)=>{
					llenarTablaPersona(a);
				});
			}

		})
}

function AbrirEditar(id, nDoc, nombres, apellidos, tDoc, estado) {
	OpenUpdate();
	documentoEditar.value = nDoc;
	nombreEditar.value = nombres;
	apellidoEditar.value = apellidos;
	tipoIdEditar.value = tDoc;
	estadoEditar.value = estado;
	btnGuardarMateria.addEventListener("click", () => {
		Editar(
			id,
			documentoEditar.value,
			nombreEditar.value,
			apellidoEditar.value,
			tipoIdEditar.value,
			estadoEditar.value
		);
	});
}

function Editar(id, nDoc, nombres, apellidos, tDoc, estado) {
	if (nombre == "" || apellidos == "" || tDoc == "" || nDoc == "" || estado == "") {
		swal("¡Transaccion Fallida! ", "Diligencie todos los campos", "error");
	} else {
		fetch("https://localhost:44351/api/Personas/" + id, {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				method: "PUT",
				body: JSON.stringify({
					Id: id,
					Nombres: nombres,
					Apellidos: apellidos,
					Tdoc_Id: parseInt(tDoc),
					NDoc: nDoc,
					Activo: estado == "1" ? true : false,

					Tp_Id: (htmlLocation == "http://127.0.0.1:5500/views/alumnos.html") ? 1 : 2

				})

			})
			.then((p) => {
				swal("¡Transaccion Exitosa! ", "¡Se ha actualizado el alumno! ", "success");
				location.reload();
			})
			.catch((error) => {
				console.error(error);
			});
		CloseUpdate();
	}
}

function Eliminar(id) {
	ConfirmarEliminar();
	fetch("https://localhost:44351/api/Personas/" + id, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		method: "DELETE",
		body: JSON.stringify({
			Id: parseInt(id)
		})
	}).then((response) => {
        if(response.status==400)
		{
            swal ( "¡Transaccion Fallida! " ,"Alumno asignado a una materia", "error" );
        }else{
            let tr = document.querySelector(`tr[data-id="${id}"]`);
            tabla.removeChild(tr);
        }


	});
}

function ConfirmarEliminar(id){
	swal({
		title: "Esta seguro de eliminar esta persona?",
		text: "No podra recuperar la información de esta persona si lo elimina y por favor verifique que la persona no tenga una materia asiganda",
		icon: "warning",
		buttons: true,
		dangerMode: true,
	  })
	  .then((willDelete) => {
		if (willDelete) {
			Eliminar(id);
		  swal("La persona ha sido eliminado correctamente", {
			icon: "success",
		  });
		} else {
		  swal("No se elimino la persona");
		}
	  });
}
listarPersona();
