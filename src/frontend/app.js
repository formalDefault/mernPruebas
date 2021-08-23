import React, {useState, useEffect} from 'react'   
import { Formik, Form, Field, ErrorMessage } from 'formik' //npm i formik --save 
import Axios from 'axios'; 
import Aos from "aos"   
import logo from './img/icono.png';
import { useId } from "react-id-generator";
 
export default function app() {     
    const URL = window.location.origin;
 
    const [htmlId] = useId();
    
    useEffect(() => {
      Axios.get(`${URL}/api/tasks`)
        .then((response) => {
          setTareas(response.data);
          console.log(response.data);
        })
        .then(() => {
          setLoad(false);
        });
      Aos.init({ duration: 750 });
    }, []);

    const ghostConsult = () => {
      Axios.get(`${URL}/api/tasks`)
        .then((response) => {
          setTareas(response.data);
          console.log('ghost consult' + JSON.stringify(response.data));
        });
    }

    //Estados 
    const [tareas, setTareas] = useState([]);
      
    const [agregar, setAgregar] = useState(false);  

    const [abrirTarea, setAbrirTarea] = useState(false); 

    const [abrirAdvertencia, setAbrirAdvertencia] = useState(false); 

    const [editTarea, setEditTarea] = useState(false);  

    const [load, setLoad] = useState(true);
 
    const [idTarea, setIdTarea] = useState();

    const [loadMessage, setLoadMessage] = useState(false);

    const [ramList, setRAMList] = useState([]);

    //Switches 
    const abrirEdit = () => {
      setEditTarea((current) => !current);
    };

    const mostrarForm = () => {
      setAgregar((current) => !current);
    };

    const mostrarTarea = (id) => {
      setIdTarea(id);
      setAbrirTarea((current) => !current);
    }; 

    //borrar tarea 
    const borrarTarea = (id) => {
        Axios.delete(`${URL}/api/tasks/${id}`).then((res) =>{
            setAbrirAdvertencia(false);
        })
        quitarTarea(id);
    }  

    const quitarTarea = (id) => {
      const nuevaLista = tareas.filter((t) => t._id !== id);
      setTareas(nuevaLista);
    }

    //componentes
    const Formulario = () => {
        return (
          <Formik
            //valores de los campos del formulario
            initialValues={{
              titulo: "",
              descripcion: "",
            }}
            //validacion de los input
            validate={(valores) => {
              let errores = {};

              //validacion para nombre
              if (!valores.titulo) {
                errores.titulo = "ingresa un titulo";
              }

              //validacion para telefono
              if (!valores.descripcion) {
                errores.descripcion = "ingresa una descripción";
              }

              return errores;
            }}
            //funcion del boton de enviar
            onSubmit={(valores) => {
              setLoadMessage(true);
              Axios.post(`${URL}/api/tasks`, {
                titulo: valores.titulo,
                descripcion: valores.descripcion,
              }).then((res) =>
                setAgregar(false),
                setLoadMessage(false),
                setTareas([...tareas, {title: valores.titulo, description: valores.descripcion}]), 
                ghostConsult()
              );
            }}
          >
            {({ errors }) => (
              <div
                data-aos="zoom-in"
                className="absolute top-0 z-40 xl:bottom-0 "
              >
                <button
                  onClick={mostrarForm}
                  className="xl:hidden text-white pb-1 px-4 rounded-full border border-yellow-600 relative text-center float-right top-4 xl:top-16 mr-4 "
                >
                  <b>x</b>
                </button>
                <div className="bg-black pt-4 xl:bg-transparent xl:pt-40 xl:pb-0 pb-8 w-screen">
                  <div className="w-5/6 rounded-2xl text-white bg-black bg-opacity-70 m-auto p-4 xl:w-4/12 xl:bg-black xl:py-12  ">
                    <span
                      onClick={mostrarForm}
                      className="hidden xl:block relative float-right bottom-8 bg-red-500 px-4 pb-1 rounded-full cursor-pointer"
                    >
                      <b>x</b>
                    </span>
                    <center>
                      <b>Registrar Tarea</b>
                    </center>
                    <Form>
                      <Field
                        name="titulo"
                        id="titulo"
                        type="text"
                        placeholder="Titulo de la tarea"
                        className="outline-none text-white bg-black bg-opacity-90 border-b-2 border-yellow-600 rounded-lg w-full h-12 my-5 px-4"
                      />
                      <ErrorMessage
                        name="titulo"
                        component={() => (
                          <div className="text-red-500">{errors.titulo}</div>
                        )}
                      />
                      <Field
                        name="descripcion"
                        id="descripcion"
                        type="text"
                        placeholder="Descripcion"
                        className="outline-none text-white bg-black bg-opacity-90 border-b-2 border-yellow-600 rounded-lg w-full h-12 my-5 px-4"
                      />
                      <ErrorMessage
                        name="descripcion"
                        component={() => (
                          <div className="text-red-500">
                            {errors.descripcion}
                          </div>
                        )}
                      />
                      <div>
                        <button
                          type="submit"
                          className="py-1 mt-8 w-full rounded-xl px-8 bg-gradient-to-r from-pink-700 to-yellow-500"
                        > 
                          {loadMessage ? 
                          <div className="m-auto">
                            <i className="animate-spin text-xl fas fa-circle-notch"></i>
                          </div> 
                          : 
                          <h1>Guardar tarea</h1>
                          }
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            )}
          </Formik>
        );
    }  

    const Tarjetas = () => {
        const tarjeta = "bg-gray-100 shadow-xl cursor-pointer p-4 rounded-sm ";
        return (
            <div className="">   
                <div className="mt-10 grid grid-cols-1 xl:grid-cols-4 gap-4 gap-y-12 p-8">
                    {tareas.map((i) => {
                        return(
                            <div key={i._id} data-aos="zoom-in"  className={tarjeta} >
                                <div className="flex justify-between">
                                    <b onClick={() => {mostrarTarea(i._id)}}>{i.title}</b>
                                    <div>
                                        <button className="mr-4 " onClick={() => {
                                            setEditTarea(true);
                                            setIdTarea(i._id);
                                            }}>
                                            <i className="text-white bg-green-400 p-2 rounded-full far fa-edit">
                                            </i>
                                        </button>
                                        <button onClick={() => {
                                            setAbrirAdvertencia(true);
                                            setIdTarea(i._id);
                                            }}>
                                            <i className="bg-red-500 text-white p-2 rounded-full fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}    
                </div>
            </div>
        )
    }  

    const Tarea = () => {
        return(
            <div data-aos="zoom-in" className="absolute top-0 z-40 xl:bottom-0 "> 
                <button onClick={mostrarTarea} className="xl:hidden text-white pb-1 px-4 rounded-full border border-yellow-600 relative text-center float-right top-4 xl:top-16 mr-4 "><b>x</b></button>
                    <div className="bg-black pt-4 xl:bg-transparent xl:pt-40 xl:pb-0 pb-8 w-screen"> 
                        <div className="w-5/6 rounded-2xl text-white bg-black bg-opacity-70 m-auto p-4 xl:w-4/12 xl:bg-black xl:py-12  ">
                            <span onClick={mostrarTarea} className="hidden xl:block relative float-right bottom-8 bg-red-500 px-4 pb-1 rounded-full cursor-pointer"><b>x</b></span> 
                            {tareas.map((i) => { 
                                if(i._id == idTarea){
                                   return(
                                       <div key={i._id}>
                                           <div className="text-2xl text-center"><b>{i.title}</b></div> 
                                           <div className="px-4 pt-4 mb-4"><h1>Descripcion:</h1> </div>
                                           <div className="border-b-2 border-blue-600 px-4 py-2 rounded-2xl mb-4"><h3 className="text-sm">{i.description}</h3></div> 
                                       </div>
                                   )
                                } 
                            })}
                        </div>
                    </div>    
            </div>
        )
    }

    const advertencia = () => {
        return(
            <div data-aos="zoom-in" className="absolute top-0 z-40 xl:bottom-0 ">  
                    <div className="bg-black pt-4 xl:bg-transparent xl:pt-40 xl:pb-0 pb-8 w-screen"> 
                        <div className="w-5/6 rounded-2xl text-white bg-black bg-opacity-70 m-auto p-4 xl:w-4/12 xl:bg-black xl:py-12  "> 
                            {tareas.map((i) => { 
                                if(i._id == idTarea){
                                   return(
                                    <div key={i._id} className="">
                                        <div className="text-2xl text-center "><b>Desea borrar la tarea: {i.title}</b></div> 
                                        <div className="flex justify-between mt-8 w-6/12 m-auto">
                                            <button onClick={() => { borrarTarea(i._id) }} className="bg-red-500 px-6 rounded-2xl">Si</button>
                                            <button onClick={() => { setAbrirAdvertencia(false) }} className="bg-red-500 px-6 rounded-2xl">No</button> 
                                        </div>     
                                    </div> 
                                   )
                                } 
                            })}  
                        </div>
                    </div>    
            </div>
        )
    }

    const tareaEdit = () => { 
        return (
            <div>
                {tareas.map((i) => { 
                    if(i._id == idTarea){
                        return (
                          <div key={i._id}>
                            <Formik
                              //valores de los campos del formulario
                              initialValues={{
                                titulo: ``,
                                descripcion: '', 
                              }}
                              //validacion de los input
                              validate={(valores) => {
                                let errores = {};

                                //validacion para nombre
                                if (!valores.titulo) {
                                  errores.titulo = "ingresa un titulo";
                                }

                                //validacion para telefono
                                if (!valores.descripcion) {
                                  errores.descripcion =
                                    "ingresa una descripción";
                                }

                                return errores;
                              }}
                              //funcion del boton de enviar
                              onSubmit={(valores) => {
                                Axios.put(`${URL}/api/tasks/${i._id}`, {
                                  titulo: valores.titulo,
                                  descripcion: valores.descripcion,
                                }).then((res) =>
                                  console.log(res).catch((req) => console.log(req))
                                );
                              }}
                            >
                              {({ errors }) => (
                                <div
                                  data-aos="zoom-in"
                                  className="absolute top-0 z-40 xl:bottom-0 "
                                >
                                  <button
                                    onClick={abrirEdit}
                                    className="xl:hidden text-white pb-1 px-4 rounded-full border border-yellow-600 relative text-center float-right top-4 xl:top-16 mr-4 "
                                  >
                                    <b>x</b>
                                  </button>
                                  <div className="bg-black pt-4 xl:bg-transparent xl:pt-40 xl:pb-0 pb-8 w-screen">
                                    <div className="w-5/6 rounded-2xl text-white bg-black bg-opacity-70 m-auto p-4 xl:w-4/12 xl:bg-black xl:py-12  ">
                                      <span
                                        onClick={abrirEdit}
                                        className="hidden xl:block relative float-right bottom-8 bg-red-500 px-4 pb-1 rounded-full cursor-pointer"
                                      >
                                        <b>x</b>
                                      </span>
                                      <center>
                                        <b>Editar Tarea</b>
                                      </center>
                                      <Form className="mt-8">
                                        <div className="my-5">
                                          <label htmlFor="nombre_de_la_tarea">
                                            Nombre de la tarea
                                          </label>
                                          <Field
                                            name="titulo"
                                            id="titulo"
                                            type="text"
                                            placeholder="Titulo de la tarea"  
                                            className="outline-none text-white bg-black bg-opacity-90 border-b-2 border-blue-600 rounded-lg w-full h-12 mb-2 px-4"
                                          />
                                          <ErrorMessage
                                            name="titulo"
                                            component={() => (
                                              <div className="text-red-500">
                                                {errors.titulo}
                                              </div>
                                            )}
                                          />
                                        </div>
                                        <div className="my-5">
                                          <label htmlFor="descripcion_de_la_tarea">
                                            Dombre de la tarea
                                          </label>
                                          <Field
                                            name="descripcion"
                                            id="descripcion"
                                            type="text"
                                            placeholder="Descripcion"  
                                            className="outline-none text-white bg-black bg-opacity-90 border-b-2 border-blue-600 rounded-lg w-full h-12 mb-2 px-4"
                                          />
                                          <ErrorMessage
                                            name="descripcion"
                                            component={() => (
                                              <div className="text-red-500">
                                                {errors.descripcion}
                                              </div>
                                            )}
                                          />
                                        </div>
                                        <center>
                                          <button
                                            type="submit"
                                            className="py-1 mt-8 w-full rounded-xl px-8 bg-gradient-to-r from-blue-900 to-blue-600"
                                          >
                                            Actualizar tarea
                                          </button>
                                        </center>
                                      </Form>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Formik>
                          </div>
                        );
                    } 
                })}   
            </div> 
        )
    }  

    const loading = () => {
        return (
          <div className="fixed w-full">
            <div className=" w-3/12 xl:w-1/12 relative mx-auto top-56">
              <div className="animate-spin absolute p-4">
                <i className="text-black text-6xl fas fa-spinner"></i>
              </div>
            </div>
          </div>
        );
    }
 
    return (
      <div>
        <div
          data-aos="fade-down"
          className="bg-blue-700 text-white p-4 w-screen text-2xl flex justify-between"
        >
          <div>
            <a>Sistema Bavel</a>
          </div>
          <button
            onClick={mostrarForm}
            className="px-2 pb-1 rounded-full duration-500 hover:bg-opacity-40 hover:bg-black"
          >
            <b>+</b>
          </button>
        </div>
        {abrirAdvertencia ? advertencia() : null}
        {load ? loading() : Tarjetas()} 
        {editTarea ? tareaEdit() : null}
        {abrirTarea ? Tarea() : null}
        {agregar ? Formulario() : null}
      </div>
    );
    
}

