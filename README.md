# Foncia Stark

## Architecture

The solution here are designed by micro-services. Each component will run inside a single container.
When running the solution, you'll have:
- A Mongo DB Server
- A Mongo Express to read/write data
- An NGINX to proxy request to required service
- Several other containers for services

## How to run
You'll need Docker and Docker-Compose installed on your machine. Just run the following command:

```docker-compose up -d```

## Folders
### init-mongo
This folder contains script to restore mongo data at the startup of a new container.

### init-nginx
This folder container configuration file for NGINX.

### src
This folder contains source codes of different services. Please read `README.md` in this folder and subfolder for more information.

### subject
This folder contains exercice requirements and description, and provided files for Database and Mongoose.

## Hack
There is some custom node modules in `src/custom-modules` folder. These modules are inside this repository and add in other repositories too, to be able to download it with `npm`

## API
If you test locally, API Base Url will be `http://localhost`. Each requests will be proxied by NGINX to correct service.
NGINX listen on port `80`.

Each service use Fastify (https://www.fastify.io/) as framework.

### Routes

#### Authentification
- URL: ```/api/auth```
- Method: POST
- Request Body: JSON Object containing `username` and `password` properties

Response:
Successful login:
- Status: 200
- Body: JSON Object containing property `access_token`

Bad login
- Status: 401

CURL example:
```
curl --request POST \
  --url http://localhost/api/auth \
  --header 'content-type: application/json' \
  --data '{
	"username": "foo",
	"password": "bar"
}
'
```

Following routes needs the `Access Token` as Bearer in header `authorization`!

#### Administrators List
- URL: ```/api/administrators```
- Method: GET
- Header:
- - Authorization: `Bearer ${ACCESS_TOKEN}`
- Optional Query Params: `page` and `pageSize` to manage pagination. If not provided, default values are `page=1` and `pageSize=10`

Response:
Successful login:
- Status: 200
- Body: JSON Object containing:
- - `count`: Total items count in database
- - `page`: Current page returned
- - `size`: Page Size max
- - `result`: Array containing list of administrators

No token provided or wrong format
- Status: 401

Expired token or invalid token
- Status: 403

CURL example:
```
curl --request GET \
  --url http://localhost/api/administrators \
  --header 'authorization: Bearer ${ACCESS_TOKEN}'
```

#### Administrator Details
- URL: ```/api/administrators/details/:id```
- Method: GET
- Header:
- - Authorization: `Bearer ${ACCESS_TOKEN}`
- Params: `:id` should be replaced

Response:
Successful login:
- Status: 200
- Body: JSON Object containing required administrator

No token provided or wrong format
- Status: 401

Expired token or invalid token
- Status: 403

CURL example:
```
curl --request GET \
  --url http://localhost/api/administrators/detail/5c69c5a9a3378e1809930322 \
  --header 'authorization: Bearer ${ACCESS_TOKEN}'
```

#### Customers list
- URL: ```/api/customers```
- Method: GET
- Header:
- - Authorization: `Bearer ${ACCESS_TOKEN}`
- Optional Query Params: `page` and `pageSize` to manage pagination. If not provided, default values are `page=1` and `pageSize=10`

Response:
Successful login:
- Status: 200
- Body: JSON Object containing:
- - `count`: Total items count in database
- - `page`: Current page returned
- - `size`: Page Size max
- - `result`: Array containing list of customers

No token provided or wrong format
- Status: 401

Expired token or invalid token
- Status: 403

CURL example:
```
curl --request GET \
  --url http://localhost/api/customers \
  --header 'authorization: Bearer ${ACCESS_TOKEN}'
```

## Client UI

A small UI interface is provided: `http://localhost`

## Custom Node Modules

### auth-hooks
This module is a Fastify hooks. It will check the existence of an access token and its validity for services will need it. Just register the module in Fastify and each route will be checked!
https://github.com/romainv42/auth-hooks


### mongo-decorator
This module is a Fastify decorator. It will connect to Mongo database with provided credentials and give a Data Access Layer to make request. When registered, DAL is accessible in each route with `fastify.dal`.
https://github.com/romainv42/mongo-decorator


### paginate-hooks
This module is a Fastify hooks. It will retrieve `page` and `pageSize` from query params or create them with default values and set them accessible in `req.page` and `req.pageSize` in each route.
https://github.com/romainv42/paginate-hooks

