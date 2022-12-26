const fs = require('fs');
const express = require('express');

const app = express();
const port = 3000;

//middleware
app.use(express.json());

// app.get('/', (req, res) => {
//     res.status(200).json({message: 'Hello from the server side!', app: 'Natours'});
// });

// app.post('/', (req, res) => {
//     res.send('You can now post to this endpoint');
// });

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
};

const getTour = (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1;

    const tour = tours.find(element => element.id === id);

    if(!tour){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });

};

const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    //console.log(req.body);
    const newTour = Object.assign({id : newId}, req.body);

 
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                newTour
            }
        });
    });
};

const updateTour = (req, res) => {
    console.log(req.params);
    if(req.params.id * 1 >= tours.length){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated here ...>'
        }
    });
};

const deleteTour = (req, res) => {
    if(req.params.id * 1 >= tours.length){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
};

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app
    .route('/api/v1/tours')
    .get(getAllTours)
    .post(createTour);

app
    .route('/api/v1/tours/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);


app.listen(port, () => {
    console.log(`App is running on ${port}....`);
});


