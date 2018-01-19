GET /jobs
GET /jobs/i/:id

Create Job
```
POST /jobs
<- jobId
```
Upload train data
```
POST /jobs/i/:jobId/trainData
<- OK
```
Upload test data
```
POST /jobs/i/:jobId/testData
<- OK
```
Submit job data for configuration
```
POST /jobs/i/:jobId/submit
<- configurationId
```
- You can submit one Job several times
- Everytime you submit your Job you get a Configuraton
- Configuration data is stored on the middleware in the MongoDB

Gets configuration data (Name, Metric, Criteria, Counters)
```
GET /configuration/i/:configurationId
<- Configuration
```
Gets columns from train data
```
GET /configuration/i/:configurationId/columns
<- Columns
```
Updates column settings
```
POST /configuration/i/:configurationId/columns
<- OK
```
Launches training process
```
POST /configuration/i/:configurationId/start
<- iterationId
```
- You can start a set of seed iterations processes for different configuratons
- Iteration requires uploading triplets and curation at the beginning
- iterationId is not an index, it is an unique string

Gets training data (including status and data)
```
GET /iterations/i/:iterationId
<- Gets iteration data
```

TODO: Curation process here

Launch training using curation data
```
POST /iterations/i/:iterationsId/train
<- trainingId
```
Gets training data and status
```
GET /training/i/:trainingId
<- Training data and status
```
Gets training data
```
GET /training/i/:trainingId/data
<- Training data
```
Gets training data
```
GET /training/i/:trainingId/status
<- Training status
```
Updates training data (to use from the docker container)
```
PUT /training/i/:trainingId
<- OK
```
Launches the prediction process
```
POST /training/i/:trainingId/predict
<- predictionId
```
Stops the prediction
```
POST /predictions/i/:predictionId/stop
<- OK
```
Starts the existend prediction
```
POST /predictions/i/:predictionId/start
<- OK
```
