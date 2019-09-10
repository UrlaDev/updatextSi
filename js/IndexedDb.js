

  


export function pintaVerde(mes, anio){


    //crear la base de datos


    let diasDeVerde = [];
   
    let objectStore = DB.transaction('posts').objectStore('posts');
    objectStore.openCursor().onsuccess = function(e){
        let cursor = e.target.result;
        if(cursor){
            let fechaPOst = cursor.value.fecha;
            if(mes === fechaPOst.getMonth() && anio === fechaPOst.getFullYear()){
                       diasDeVerde.push(fechaPOst.getDate())
            }
            cursor.continue();
                      
        }else{
            console.log(e.target, 'NO CURSOR')
        }
     return diasDeVerde;
                    };
};