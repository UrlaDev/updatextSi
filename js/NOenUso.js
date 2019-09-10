//barra desplegable
// calendario.addEventListener('click', (e)=>{
//     e.preventDefault();
//     console.log(latera.style.height)
//     if(latera.style.height == "0px" || latera.style.height == ''){
//         latera.style.height = "200px";
//     }else{
//         latera.style.height = "0px";
//     }
  
    
// })

//estaba en la función cargaFecha() 
  // if(m != 0){
    //     mesi = m;
    // }else{
    //     mesi =  d.getMonth();
    // }

    //intento de que se mostrarn los dias de verde

  //   function pintaVerde(mes, anio){
  //     let tutu = [];
      
  //     let objectStore =  DB.transaction('posts').objectStore('posts');
  //      objectStore.openCursor().onsuccess = async function pipi(e){
  //         let cursor =  e.target.result;
  //         tutu = await olis(cursor,mes,anio);
  //            return tutu;
  //                     }
                  
  //                     .then((res)=>{
  //                         return res;
  //                     })
  //                     .catch((er) => {
  //                         console.log(er)
  //                     })
                     
  // };
  
  
  
  // function olis(cursor,mes,anio){
  //     let  diasDeVerde = new Array();
  // if(cursor){
  //   let fechaPOst = cursor.value.fecha;
  //   console.log(mes, fechaPOst)
  //   if(mes == fechaPOst.getMonth() && anio == fechaPOst.getFullYear()){
  //              diasDeVerde.push(Number(fechaPOst.getDate()));
             
  //   }
  //   cursor.continue();
              
  // }else{
  //   console.log( 'NO CURSOR');
    
  // }
  
  // return   diasDeVerde;}