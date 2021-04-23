const tabla = document.querySelector(".tbody");




function listarAlumno() {
	fetch("https://localhost:44351/api/Personas/ConsultarTodo")
		.then((response) => response.json())
		.then((personas) =>
			personas.forEach((persona) => {
                if (persona.Tp_Id==1) {
                    console.log(persona)
                    llenarTabla(persona);
                }
				
			})
		);
}


function llenarTabla(p) {
	let alumno = document.createElement("tr");
	alumno.innerHTML += `<td>  ${p.Nombres} ${p.Apellidos}</td>
     <td> ${p.NDoc} </td>`;
	 alumno.innerHTML += `<td class="tdBoton ">
	 <button class="fas fa-trash-alt buttonVerReporte" onclick="AbrirReporte(${p.Id})">Ver reporte</button></td>`;
	 alumno.setAttribute("data-id", p.Id);
	 tabla.appendChild(alumno);

		}
        
 function AbrirReporte(id){
    window.open('reporte.html?id='+id, '_blank');

 }       
listarAlumno();
