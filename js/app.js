import {month, dia} from './arrays.js';
// import {pintaVerde} from './IndexedDb.js';
const calo = document.querySelector('.calendo');
const dias = document.querySelectorAll('.dias a');
const diaGrande = document.querySelector('.dia-header h6');
const mesGrande  = document.querySelector('.mes-header h1');
const anioGrande = document.querySelector('#anio-header h5');
const formInput = document.querySelector('.modal-content form'); 
const postContenidoTxt = document.querySelector('.modal-content form #txt');
const postContenidoUrl = document.querySelector('.modal-content form #url');
const tarjeta = document.getElementById('cards');
const ko = new Date();
let DB;
///INDEXED DB
document.addEventListener('DOMContentLoaded', () => {
    //se dispara con el submit de los posts
formInput.addEventListener('submit', guardarPost);
tarjeta.addEventListener('click', borrarPost);

   //crear la base de datos
   let crearDb = window.indexedDB.open('posts', 1);
   //si hay un error enviarlo a la consola
   crearDb.onerror = function(){console.log('Hubo un error')};
   //si todo está bien asigna la base de datos
   crearDb.onsuccess = function(){
       //asignar a la base de datos 
       DB = crearDb.result;
       mostrarPosts();
       cargaFecha();
       cargaVerde();
   }    
   //este método sólo corre una vez y es ideal para crear el scheema de la base de datos
   crearDb.onupgradeneeded = function(e){
       //el evento es la misma base de datos
       let db = e.target.result;
       //definir el object store, toma 2 parámetros: 1. el nombre de la base de datos 2. opciones
       //keyPath es el índice de la base de datos
       let objectStore = db.createObjectStore('posts', {keyPath: 'key',autoIncrement: true} );
       //crear índices y campos de la base de datos, createIndex ..parámetros 
       //1.nombre2.keyPath3.opciones
       objectStore.createIndex('url','url', {unique: false} );
       objectStore.createIndex('txt','txt', {unique: false} );
       objectStore.createIndex('fecha','fecha', {unique: false} );
       console.log('base de datos creada y lista')

   }
   //se dispara con el submit del modal y guarda los posts en IDB
   function guardarPost(e){
    e.preventDefault();
    const post = { post : postContenidoTxt.value,
                   url: postContenidoUrl.value,
                   fecha: new Date()
                 }                                
    //en indexed DB se utilizan las transacciones
    let transaction = DB.transaction(['posts'], 'readwrite'); 
    let objectStore = transaction.objectStore('posts');
    let request = objectStore.add(post);
    request.onsuccess = function(){
               formInput.reset();
    }
    transaction.oncomplete = function(){
        console.log('Post agregado');
        mostrarPosts();
    }
    transaction.onerror = function(){
        console.log('Hubo un error');
    }


};
   function mostrarPosts(){
       //limpiar
       document.getElementById('cards').innerHTML = '';
       //crear objectSTore
       let objectStore = DB.transaction('posts').objectStore('posts');
       //esto retorna una petición
   
       objectStore.openCursor().onsuccess = function(e){
           //cursor se va a ubicar en el registro indicado para acceder a los datos
           let cursor = e.target.result;
           if(cursor){
               let fechaPost = cursor.value.fecha;
               let diaPost =  fechaPost.getDay();
               let mesPost =  fechaPost.getMonth();
               let anioPost =  fechaPost.getFullYear();
               

               let html = `<div class="card p-0" data-post-id=${cursor.value.key}>
                                <div class="card-body p-0">
                                <div class="card-title  p-3">
                                <a class="btn font-weight-bold text-uppercase  btn-success botonDia text-warning  d-flex justify-content-center ">
                               ${dia[diaPost][0]} ${fechaPost.getDate()} ${month[mesPost][1]}</a>
                                   </div>
                                <p class="card-subtitle text-right text-muted px-3 mb-2">
                                <span class="badge badge-secondary">
                                ${cursor.value.fecha.getHours()}:${cursor.value.fecha.getMinutes()<10 ? `0`+cursor.value.fecha.getMinutes(): cursor.value.fecha.getMinutes()}
                                </span></p>
                                <p class="card-text p-3">${cursor.value.post}
                                </p>
                                <div class="w-100 p-3 d-flex justify-content-between"> 
                                <a href="${cursor.value.url}" class="btn btn-info" target="_blank">ir</a>
                                <a href="#" class="btn btn-danger" data-post-id=${cursor.value.key}>borrar</a>                               
                                 </div>
                                </div>
                           </div><!--fin card-->`;
                           document.getElementById('cards').innerHTML += html;
                           cursor.continue();

                           
                        
                       
           }else('no cursor')


       }
 
    
 

}
function borrarPost(e){
    if(e.target.classList.contains('btn-danger')){
        let Id = Number(e.target.getAttribute('data-post-id'));
     
          //en indexed DB se utilizan las transacciones
    let transaction = DB.transaction(['posts'], 'readwrite'); 
    let objectStore = transaction.objectStore('posts');
    let request = objectStore.delete(Id);
    transaction.oncomplete = () => {
      e.target.parentElement.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement.parentElement);
    };
    }

        
   };
   
   

  

});
//fin del event que dispara el Indexed DB


//addEventListeners
//cargar calendario en el mes actual
// document.addEventListener('DOMContentLoaded', cargaFecha());
tarjeta.addEventListener('click', botonPostDia);
//click a los dias
dias.forEach((dia) => {
    dia.addEventListener('click',seleccionadoDia);
});

//se inicializa en el mes actual   
let mas  = ko.getMonth();
let anio  = ko.getFullYear();
//escuhca el scroll EN el calendario nomás
calo.onwheel = (e,mesHoy) =>{
     
    if(e.deltaY === -100){
         if(mas === 11){
             mas = -1;
             anio++;
            }
            mas++ ; 
       //incrementar el mes y llamar a la función
       cargaFecha(mas, anio);
       cargaVerde(mas,anio);
    }else{
       
       if(mas === 0){
        mas = 12
        anio--;
    }
    mas--;
    cargaFecha(mas, anio);
    cargaVerde(mas,anio);   
    }
}
//función que imprime el calendario
function cargaFecha(m =  ko.getMonth(), a = ko.getFullYear(), diaPost = null, sipi = true){
    console.log(diaPost)
    if(sipi){
    //limpia resultados del mes del scroll pasado
   dias.forEach((dia) => {
       dia.textContent = '';
       if(dia.classList.contains('redondel')){
        dia.classList.remove('redondel', 'btn-success');
       }
   });
                 };//cierre if para lavar o no el template
    let mesi =m;
    const d = new Date();
    //obtiene datos actuales desde el objeto Date()
    // var anio = d.getFullYear();
    var dia2 = d.getDay();
    //nombre e id del mes selleccionado
    var mes = month[mesi][0];
    let meso = month[mesi][1];
    //instancia Date() en primer día del mes seleccionado
    var PrimeroDefechaSeleccionada = new Date(Date.parse( `1 ${mes}, ${a}` ));
    console.log(PrimeroDefechaSeleccionada)
    //obtiene el primer día del mes seleccionado
    var day = PrimeroDefechaSeleccionada.getDay();
    //otiene el id del primer día del mes de la fecha seleccionada
    let primero = dia[day][1];
    console.log(primero,'SOY PRIMERO')
    //imprime arriba a la derecha
    mesGrande.textContent = meso;
    anioGrande.textContent = a;  
    diaGrande.textContent = dia[dia2][0];
    // const primeroData = dia[day][1];
    let dia1 = document.getElementById(primero);
    dia1.textContent = `1`;
    var mesFIn = 0;
    var mesCheck = ''
    var misio = ['ENE','MAR','MAY','JUL','AGO','OCT','DIC'];
    var misio30 = ['ABR','JUN','SEP','NOV'];
    if(misio.includes(meso)){mesCheck = 'a';}else if(misio30.includes(meso)){
        mesCheck = 'b';
    }
    switch(mesCheck) {
        case 'a':
      mesFIn = 30;
          break;
        case 'b':
          mesFIn = 29;
          break;
        default: 
        (a % 4 == 0 && a % 100 != 0) || a % 400 == 0 ? mesFIn = 28 : mesFIn = 27;
          
      }
    for(let i = 1; i <= mesFIn; i++){
          const primeroDataNumber = Number(primero);
           let diar = document.getElementById( `${primeroDataNumber + i}` );
          console.log(diar)
         
           if(diar){
           diar.textContent = i+1;
                if(i+1 == diaPost){
                    diar.classList.add('redondel', 'btn-success');
                };
        };
    };
    return;
};
  function cargaVerde(m =  ko.getMonth(), a = ko.getFullYear()){
 //trae los post de la indexedDB
 console.log(m,a,'SOY EN CARGAVERDE')
 let objectStore = DB.transaction('posts').objectStore('posts');
 //esto retorna una petición
 objectStore.openCursor().addEventListener('success', coso, false); 
 function coso(e){
     let cursor = e.target.result;
     if(cursor){
      let fechaPOst = cursor.value.fecha;
      console.log(fechaPOst, 'SOY EL QUE TRAJO CURSOR DESDE DB EN CARGAVERDE')
      console.log(fechaPOst.getMonth(),fechaPOst.getFullYear())
      if(m == fechaPOst.getMonth() && a == fechaPOst.getFullYear()){
                       botonPostDia(false,cursor.key);
                          cursor.continue();
                     
     }else{
        cursor.continue();
     }
    
 }
}
};
//pinta un círculo alrededor del día clickeado
function seleccionadoDia(e){
    if(e.target.classList.contains('redondel')){
        document.getElementById('cards').innerHTML = '';
       let diap =  e.target.textContent;
        let anio = anioGrande.textContent;
        let mes = mesGrande.textContent;
        month.forEach((mou, i)=>{
            if(mou[1] == mes){
                let fecha = `${i}-${diap}-${anio}`;
               
                let objectStore = DB.transaction('posts').objectStore('posts');
                // let indice = objectStore.index('txt');
                // let  rango=IDBKeyRange.only('text bs4')
                objectStore.openCursor().addEventListener('success', oli, false); 
                function oli(e){
                   
                    let cursor = e.target.result;
                    let diaCur = cursor.value.fecha.getDate();
                    let diaSemCur = cursor.value.fecha.getDay();
                    let mesCur = cursor.value.fecha.getMonth();
                    let anioCur = cursor.value.fecha.getFullYear();
                    let fechaCur = `${mesCur}-${diaCur}-${anioCur}`;
                     console.log(fecha);
                     console.log(fechaCur);
                    if(fecha == fechaCur){
                        let html = `<div class="card p-0" data-post-id=${cursor.value.key}>
                        <div class="card-body p-0">
                        <div class="card-title  p-3">
                        <a class="btn font-weight-bold text-uppercase  btn-success botonDia text-warning  d-flex justify-content-center ">
                       ${dia[diaSemCur][0]} ${diaCur} ${month[mesCur][1]}</a>
                           </div>
                        <p class="card-subtitle text-right text-muted px-3 mb-2">
                        <span class="badge badge-secondary">
                        ${cursor.value.fecha.getHours()}:${cursor.value.fecha.getMinutes()<10 ? `0`+cursor.value.fecha.getMinutes(): cursor.value.fecha.getMinutes()}
                        </span></p>
                        <p class="card-text p-3">${cursor.value.post}
                        </p>
                        <div class="w-100 p-3 d-flex justify-content-between"> 
                        <a href="${cursor.value.url}" class="btn btn-info" target="_blank">ir</a>
                        <a href="#" class="btn btn-danger" data-post-id=${cursor.value.key}>borrar</a>                               
                         </div>
                        </div>
                   </div><!--fin card-->`;
                   document.getElementById('cards').innerHTML += html;
                   cursor.continue();
                    }else{
                        console.log('no-holis')
                        cursor.continue();
                    };
                    
                }

                              
            }
        }) 

    }else{
        e.target.classList.add('redondel', 'btn-success');
    } 
};
function botonPostDia(e, dio){
    if(e){
    if(e.target.classList.contains('botonDia')){
        // e.target.classList.remove('redondel', 'btn-success');
       let id = Number(e.target.parentElement.parentElement.parentElement.getAttribute('data-post-id'));
        let objectStore = DB.transaction('posts').objectStore('posts');
        objectStore.openCursor(id).onsuccess = function(e){
            let cursor = e.target.result;
            if(cursor){
            
                let fechaPOst = cursor.value.fecha;
                cargaFecha(fechaPOst.getMonth(),fechaPOst.getFullYear(),fechaPOst.getDate(), true);
            }else{
                console.log(e.target, 'NO CURSOR')
            }
        }
    }}else if(dio){
        // e.target.classList.add('redondel', 'btn-success');
        console.log(dio, 'soy DIO'); 
        let objectStore = DB.transaction('posts').objectStore('posts');
        objectStore.openCursor(dio).onsuccess = function(e){
            let cursor = e.target.result;
            if(cursor){
               
                let fechaPOst = cursor.value.fecha;
                console.log(fechaPOst)
                cargaFecha(fechaPOst.getMonth(),fechaPOst.getFullYear(),fechaPOst.getDate(), false);
            }else{
                console.log(e.target, 'NO CURSOR')
            }
        }
              
    }
};

