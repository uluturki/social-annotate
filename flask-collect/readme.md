# Data collection

This is a simple web server application implemented in Python using the Flask package. Once application initiated, it creates an API that can receive submission requests and stores results into a file.

To run the Flask application simply run `python main.py` on your console. This will initialize a local webserver hosted locally using port 5000. Everytime the server receive a JSON payload to its `/response` endpoint, it stores the result.

This application is based on simple DataStorage object for simplicity. The `DataStorage` object initializes with a default argument for file name and everytime `appendResponse` function called, it appends a json payload to a file.

```python
class DataStorage(object):
    def __init__(self, filename='reponses.jsons'):
        self.filename = filename

    def appendResponse(self, response):
        with open(self.filename, 'a') as fl:
            fl.write('{}\n'.format(json.dumps(response)))
```

You can extend this object or implement a new class by inheriting it to use other DataStorage mechanisms such as Sqlite3, SQL databases, etc.

