# Overflowquery

How to run the app
1. Frontend
    - You will need to install nodejs and yarn to run this application
    - Navigate to Frontend folder in your terminal and run the following command:
        > yarn install
    - Once installation is done run the command
        > yarn start
    - On your browser open locahost:8080. App will be running there.
    - The app is running at http://overflowquery.herokuapp.com/  however to see prediction of tags you will have to run it locally.
    - To run the app locally change every instance of "https://overflowback-api-heroku.herokuapp.com/search" with "http://127.0.0.1:12345/tags"
    [here](https://github.com/sunitasen/queryOverflow/blob/master/FrontEnd/src/Components/DisplayPage/DisplayPage.js)

2. Run the model:
    - You will need python and pip to run the module
    - Navigate to PredictTags folder in your terminal and run the command:
        > pip install -r requirements.txt
    - To run app.py use the following command
        > python app.py
    - This app is running at "https://overflowback-api-heroku.herokuapp.com"

3. Run the backend:
    - You will need python and pip to run the module
    - Navigate to BackendSearch folder in your terminal and run the command:
        > pip install -r requirements.txt
    - To run app.py use the following command
        > python app.py

Note: We are here using unregistered stackoverflow api. The limit to request every day is 300.