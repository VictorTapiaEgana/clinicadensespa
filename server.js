import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';
import moment from 'moment';
import axios from 'axios';
import _ from 'lodash';
import cors from 'cors';
import { engine } from 'express-handlebars';

import 'dotenv/config'
import path from 'path';

const app = express()
app.use(cors())

app.engine('hbs', engine());
app.set('view engine', 'hbs');
app.set('views', './views');


const PORT = process.env.PORT || 3001;
moment.locale('es');

app.use('/assets',express.static(path.join(process.cwd(),'/public')));

app.get('/',(req,res)=>{
    res.sendFile(path.join(process.cwd(),'/paginas/index.html'));
});

app.post('/ObtenerDatos',(req,res)=>{

    let pacientes = [];

    axios('https://randomuser.me/api/?results=20')
    .then(datos =>{
       
        datos.data.results.forEach( persona =>{

        const pacientes1 =
                {                   
                   Nombre: persona.name.first,
                   Apellido:persona.name.last,
                   ID:uuidv4().slice(0,5),
                   Timestamp:moment().format('MMMM-DD-YYYY hh:mm:ss A'),
                   sexo:persona.gender
                }

             pacientes.push(pacientes1);
       })

    const arregloDividido = _.partition(pacientes,(paci) =>paci.sexo == 'female' );

    res.render('resultado', {
        arregloDividido1:arregloDividido[0],
        arregloDividido2:arregloDividido[1],
        layout: false
    });   

    // Resultado por Consola
    console.log(chalk.bgWhite(chalk.blue('MUJERES:')))
    arregloDividido[0].forEach((female,index) =>{
        console.log(chalk.bgWhite(chalk.blue(`${index + 1}. Nombre:${female.Nombre} - Apellido:${female.Apellido} - ID:${female.ID} - Timestamp:${female.Timestamp}`)));
    });

    console.log(chalk.bgWhite(chalk.blue('HOMBRES:')))
    arregloDividido[1].forEach((men,index) =>{
        console.log(chalk.bgWhite(chalk.blue(`${index + 1}. Nombre:${men.Nombre} - Apellido:${men.Apellido} - ID:${men.ID} - Timestamp:${men.Timestamp}`)));
    })

    })
    .catch(error =>{
        console.log(error)
    })
    
});

app.listen(PORT,()=>{
    console.clear()
    console.log(chalk.bgYellow(chalk.blue.bold(`Holiwis en PORT : `)) + chalk.bgWhite(chalk.red(PORT)));      
});

