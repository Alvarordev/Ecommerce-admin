import Layout from "@/components/layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';

export default function Categories()  {
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);
 
    useEffect(() => {
        fetchCategories()
    }, []);

    function fetchCategories() {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }

    async function saveCategory(ev) {
        ev.preventDefault();
        const data = {
            name,
            parentCategory,
            properties:properties.map(p => ({name:p.name, values:p.values.split(',')}))};
        
        if (editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        } else {
            await axios.post('/api/categories',data);
        }
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
}

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({name,values}) => ({
            name,
            values:values.join(',')
          }))
          );
    }

    function deleteCategory(category){
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete',
            confirmButtonColor: '#d55',

        }).then(async result => {
            if (result.isConfirmed) {
                const {_id} = category;
                await axios.delete('/api/categories?_id='+_id);
                fetchCategories();
            }
        })
    };
    
    function addProperty() {
        setProperties(prev => {
            return [...prev, {name:'', values:''}];
        });
    };

    function handlePropertyNameChange(index,property,newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
      }

      function handlePropertyValuesChange(index,property,newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
      }

      function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p,pIndex) => {
                return pIndex !== indexToRemove;
            });
        })
      }
    
      return (
        <Layout>
            <h1>Categorias</h1>
            <label>{editedCategory ? `Edit category ${editedCategory.name}`: 'Crear una nueva categoria'}</label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input className=" mb-0" 
                    type="text" 
                    placeholder="Categoria (ej. celulares)" 
                    onChange={ev => setName(ev.target.value)}
                    value={name}/>
                    <select 
                        className=" mb-0" 
                        value={parentCategory} 
                        onChange={ev => setParentCategory(ev.target.value)}>
                        <option value="0">No parent Category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>   
                </div>
                <div className="mb-2">
                    <label className="block">Propierties</label>
                    <button type="button"
                            onClick={addProperty}
                            className="btn-default text-sm mb-1">
                    Agregar caracteristicas
                    </button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div className="flex gap-1 mb-1">
                            <input  type="text"
                                    className="mb-0"
                                    value={property.name}
                                    onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                                    placeholder="property name"/>
                            <input  type="text"
                                    className="mb-0"
                                    onChange={ev =>
                                    handlePropertyValuesChange(
                                        index,
                                        property,ev.target.value
                                    )}
                                    value={property.values}
                                    placeholder="values, comma separated"/>
                            
                            <button className="btn-red"
                                    onClick={() => removeProperty(index)}
                                    type="button">
                                        Remove
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    <button className=" btn-primary py-1">Guardar</button>
                    {editedCategory && <button className=" btn-default"
                            type="button"
                            onClick={() => {
                            setEditedCategory(null);
                            setName('');
                            setParentCategory('');
                            setProperties([]);
                            }}> 
                            Cancel 
                    </button>  }                  
                </div>

            </form>
            {!editedCategory && (
                <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Categorias</td>
                        <td>Parent category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category => (
                        <tr>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td>
                                <button 
                                    onClick={()=> editCategory(category)} 
                                    className="btn-default mr-1">
                                    Editar
                                </button>
                                <button 
                                    onClick={() => deleteCategory(category)}
                                    className="btn-red">
                                    Borrar 
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
            
       
        </Layout>
    )
}

