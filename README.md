Resabike project by Audrey Michel & Rafael Peixoto
============================

RESABIKE.CH is a Wallis project, led by Laurent Flueck, aiming to make life easier for cyclists. It is intended for the moment for athletes wishing to use public transport on the regional lines of Valais to transport their bikes more easily. 
The project has begun with the request from a mountain bike transportation service from the village of Saint-Luc during the 2004-2005 winter season. In the summer of 2005, for example, the first bicycle port for Post buses was created. Following the strong demand for service, the trailers have been created (see the picture bellow).
The project is not just about making it easier for cyclists to get there, but also about the number of users of this service to plan better trailer organization and availability. In addition, this project was also useful for operators as well as bus drivers. The frequency of use of this service would provide a more detailed report of existing demand by season.

The website allows users of Post buses an easy online reservation of a place for their bikes. The reservation can be made for one or more bicycles. If there are more than 3 bikes reservations a trailer (the picture below) would be install to the bus to carry the bikes to somewhere else. The trailer can carry 20 bikes at a time.
Users have the possibility to consult the regions that offer this service.
The platform displays the different availabilities according to the schedules offered by the postal buses.
Drivers will be able to consult in advance the total number of bookings for their trip sorted by date and time and provide for the organization of trailers to be coupled.
The zone administrator can add new lines to his area, view reservations for his region, and access statistics for his region.
The system administrator has the option to add new zone administrators.

> Technical guide

### Structure of the project

    .
    ├── db
    ├── i18n
    ├── models
    ├── module
    ├── public
    ├── routes
    ├── views
    ├── app.js
    ├── package.json
    └── README.md

> * **`db` directory contains all queries to the tables in the database (CREATE, DELETE, UPDATE)
> `i18n` directory contains all translations files of views files (fr, en and de translations). Files are in JSON format.
> `models` directory contains all models of the database tables
> `module` directory contains all important functionalities of the project (bookings, lines, mails, roles, users management)
> `public` directory contains all ressources files of the project (fonts, images, javascripts files and stylesheets)
> `routes` contains all redirections of the project (administration plateform and homepage)


### External librairies

Resabike project use many libraries. Here is the list :

> **Samples**: [jQuery][jQuery validate][DataTable][materialize-css][nodeMailer][i18n-express][bcrypt][axios][express-session][mysql2][pug][sequelize][sequelize-cli][search-it][materialize-stepper]

### Authors

* **Audrey Michel** - *Initial work* - [GitHub](https://github.com/audreycelia)

* **Rafael Peixoto** - *Initial work* - [GitHub](https://github.com/Piscinelove)


### License information

MIT License

Copyright (c) [2017] [Audrey Michel & Rafael Peixoto]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.