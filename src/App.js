import React, { useState, useRef, useEffect } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { Card } from 'primereact/card';
import TextArea from './Components/TextArea';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { grammar } from './docs/grammar';
import { interprete } from './docs/interprete';
import { Graphviz } from 'graphviz-react';
import { Tree } from 'primereact/tree';
import { Fieldset } from 'primereact/fieldset';
import { Toast } from 'primereact/toast';
import { optionsMenu, valueMenu, notacionDiagrama, columnsTable, puntoMejora } from './docs/clases/Ejemplos';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
require('./App.css')

const App = () => {

  let options = {
    fit: true,
    height: "100%",
    width: "100%",
    zoom: true
  };

  const items = [
    { label: 'Código', icon: 'pi pi-fw pi-microsoft' },
    { label: 'Reportes', icon: 'pi pi-fw pi-images' },
    { label: 'Ejemplos', icon: 'pi pi-fw pi-code' }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [analizado, setAnalizado] = useState(false);
  const [consola, setConsola] = useState('');
  const [ejemplo, setEjemplo] = useState('');
  const [astC, setAst] = useState('digraph G {start -> a0;start -> b0;}');
  const [selectedKey, setSelectedKey] = useState(null);
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [dataTable, setDataTable] = useState(null);
  const [accion, setAccion] = useState(null);
  const [data, setData] = useState(null);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 0,
    sortField: null,
    sortOrder: null
  });

  const rowClass = (data) => {
    return {
      'row-co': data.complex === 'CO',
      'row-lo': data.complex === 'LO',
      'row-li': data.complex === 'LI',
      'row-llo': data.complex === 'LL',
      'row-cu': data.complex === 'CU',
      'row-al': data.complex === 'AL',
      'row-ex': data.complex === 'EX',
      'row-fa': data.complex === 'FA'
    }
  }

  useEffect(() => {
    switch(accion) {
      case 'onPage':
        let start = lazyParams.page*10;
        loadLazyData(data.slice(start, start+10));
        break;
      case 'onSort':
        setData(sortLazyData(getData()));
        break;
      default:
        break;
    }
    //loadLazyData(data);
  },[lazyParams])

  useEffect(() => {
    let start = lazyParams.page*10;
    if(data)
      loadLazyData(data.slice(start, start+10));
  },[data])

  const loadLazyData = (datas) => {
    if (datas) {
      setLoading(true);
      setTotalRecords(data.length);
      setDataTable(datas);
      setLoading(false);
    }
  }

  const getData = () => {
    let id = 0;
    return JSON.parse(localStorage.getItem('complex_simbols'))
    .map(e => ({
      "id": id++,
      "tipo": e.type,
      "mejora": puntoMejora(e.value),
      "fila": e.row,
      "columna": e.column,
      "complex": e.value
    }))
  }

  const sortLazyData = (data) => {
    if (lazyParams.sortField) {
      if (lazyParams.sortField !== ('tipo' || 'mejora')) {
        return lazyParams.sortOrder === 1 ?
          data.sort((a, b) =>
            (a[lazyParams.sortField] < b[lazyParams.sortField]) ? 1
              : a[lazyParams.sortField] > b[lazyParams.sortField] ? -1
                : 0
          )
          :
          data.sort((a, b) => 
            (a[lazyParams.sortField] > b[lazyParams.sortField]) ? 1
            : a[lazyParams.sortField] < b[lazyParams.sortField] ? -1
              : 0
          );
      }
      return lazyParams.sortOrder === 1 ?
        data.sort((a, b) => {
          const nameA = a[lazyParams.sortField].toUpperCase(); // ignore upper and lowercase
          const nameB = b[lazyParams.sortField].toUpperCase(); // ignore upper and lowercase
          if (nameA > nameB) {
            return -1;
          }
          if (nameA < nameB) {
            return 1;
          }
          return 0;
        })
        :
        data.sort((a, b) => {
          const nameA = a[lazyParams.sortField].toUpperCase(); // ignore upper and lowercase
          const nameB = b[lazyParams.sortField].toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
    }
    return null;
  }

  const onPage = (event) => {
    setAccion('onPage');
    setLazyParams(event);
    //setLazyParams({...lazyParams, event});
  }

  const onSort = (event) => {
    setAccion('onSort');
    if(!event.page)
      event.page = lazyParams.page;
    setLazyParams(event);
    //setLazyParams({...lazyParams, event});
  }

  const onNodeSelect = (e) => {
    switch (e.node.key) {
      case '0-0':
        setEjemplo(valueMenu.declaracion);
        break;
      case '0-1':
        setEjemplo(valueMenu.asignacion);
        break;
      case '1-0':
        setEjemplo(valueMenu.for);
        break;
      case '1-1':
        setEjemplo(valueMenu.forIn);
        break;
      case '1-2':
        setEjemplo(valueMenu.forOf);
        break;
      case '1-3':
        setEjemplo(valueMenu.while);
        break;
      case '1-4':
        setEjemplo(valueMenu.doWhile);
        break;
      case '2-0':
        setEjemplo(valueMenu.fibonacci);
        break;
      case '2-1':
        setEjemplo(valueMenu.quickSort);
        break;
      default:
        setEjemplo('');
    }
  }

  const changeTab = (index) => {
    setActiveIndex(index);
  }

  const analizar_codigo = () => {

    if (consola === '') {
      toast.current.show({ severity: 'warn', detail: 'Para ejecutar el analisis debe ingresar código.', life: 3000 });
      return;
    }

    var arr = [];
    localStorage.setItem('errores_T', JSON.stringify(arr));
    localStorage.setItem('simbtable_T', JSON.stringify(arr));
    localStorage.setItem('errores_E', JSON.stringify(arr));
    localStorage.setItem('simbtable_E', JSON.stringify(arr));
    localStorage.setItem('complex_simbols', JSON.stringify(arr));
    localStorage.setItem('functions_running', JSON.stringify(arr));
    localStorage.setItem('functions_complex', JSON.stringify(Array.from(new Map())));

    try {
      interprete.parse(consola);

      //generamos el grafo
      let ast = grammar.parse(consola);
      if (ast) {
        setAnalizado(true);
        setAst(ast);
        let data = getData();
        setData(data);
        //loadLazyData(data);
        toast.current.show({ severity: 'success', summary: 'Se realizo con éxito el análisis!', detail: 'Los reportes fueron generados.', life: 3000 });
      }

    } catch (e) {
      toast.current.show({ severity: 'error', detail: 'Ocurrió un error durante el análisis.', life: 3000 });
      console.log(e); console.log("error ast traduccion")
    }
  }

  const agregar_codigo = () => {
    try {
      setConsola(ejemplo);
      toast.current.show({ severity: 'success', detail: 'Se agregó el código para analizar!', life: 3000 });

    } catch (e) {
      toast.current.show({ severity: 'error', detail: e, life: 3000 });
    }
  }

  return (
    <div>
      <Toast ref={toast} />
      <TabMenu model={items} activeIndex={activeIndex} onTabChange={(e) => changeTab(e.index)} />
      {
        {
          0:
            <Card>
              <Fieldset legend="Consola">
                <TextArea text={consola} setText={setConsola}></TextArea>
              </Fieldset>
              <Button style={{ marginLeft: 'auto', display: 'block', marginTop: '15px', width: '100%' }} label="Analizar" className="p-button-rounded p-button-info p-button-outlined" onClick={analizar_codigo} />
            </Card>,
          1:
            <Card>
              <Fieldset>
                {
                  !analizado ?
                    <p>Realice un análisis primero.</p>
                    :
                    <div>
                      <Accordion>
                        <AccordionTab header={<React.Fragment><i className="pi pi-th-large"></i><span> Notación Grafo</span></React.Fragment>}>
                          <Graphviz dot={notacionDiagrama} options={options} />
                        </AccordionTab>
                        <AccordionTab header={<React.Fragment><i className="pi pi-sitemap"></i><span> Grafo de Flujo</span></React.Fragment>}>
                          <Graphviz dot={astC} options={options} />
                        </AccordionTab>
                        <AccordionTab header={<React.Fragment><i className="pi pi-tablet"></i><span> Reporte Puntos Mejora</span></React.Fragment>}>
                          <DataTable value={dataTable} lazy responsiveLayout="scroll" dataKey="id" rowClassName={rowClass}
                            paginator first={lazyParams.first} rows={10} totalRecords={totalRecords} onPage={onPage}
                            onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                            loading={loading} 
                          >
                            {
                              columnsTable.map(e => <Column key={e.field} field={e.field} header={e.header} sortable />)
                            }
                          </DataTable>
                        </AccordionTab>
                      </Accordion>
                    </div>
                }
              </Fieldset>
            </Card>,
          2:
            <Card>
              <Tree value={optionsMenu} selectionMode="single" selectionKeys={selectedKey} onSelectionChange={e => setSelectedKey(e.value)} onSelect={onNodeSelect} />
              <Fieldset legend="Código">
                <TextArea text={ejemplo} setText={setEjemplo}></TextArea>
                <Button style={{ marginLeft: 'auto', display: 'block', marginTop: '15px', width: '100%' }} label="Agregar a la Consola" className="p-button-rounded p-button-info p-button-outlined" onClick={agregar_codigo} />
              </Fieldset>
            </Card>
        }[activeIndex]
      }

    </div>
  );
}



export default App;
